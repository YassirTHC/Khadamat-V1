import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  private computeEligibility(profile: any, servicesCount: number) {
    const missingFields: string[] = [];
    const bioLength = profile.bio?.trim().length ?? 0;
    if (!profile.user?.phoneVerifiedAt) missingFields.push('phone');
    if (!profile.user?.cguAcceptedAt) missingFields.push('cgu');
    if (!profile.cityId) missingFields.push('city');
    if (bioLength < 50) missingFields.push('bio');
    if (servicesCount === 0) missingFields.push('service');
    return {
      isActiveEligible: missingFields.length === 0,
      missingFields,
    };
  }

  // Subscription Plans management (Admin)
  async getAllSubscriptionPlans() {
    return this.prisma.subscriptionPlan.findMany({
      orderBy: { price: 'asc' },
    });
  }

  async getSubscriptionPlanById(planId: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    return plan;
  }

  // Pro Subscriptions management
  async createProSubscription(proId: string, dto: CreateSubscriptionDto) {
    // Verify pro profile exists
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId: proId },
      include: {
        user: true,
        proServices: { where: { isActive: true } },
      },
    });

    if (!proProfile) {
      throw new NotFoundException('Pro profile not found');
    }

    const verificationStatus = proProfile.verificationStatus ?? (proProfile.isVerifiedPro ? 'APPROVED' : 'PENDING');
    if (verificationStatus !== 'APPROVED') {
      throw new ConflictException('Premium requires verified pro');
    }

    const { isActiveEligible, missingFields } = this.computeEligibility(
      proProfile,
      proProfile.proServices?.length ?? 0,
    );
    if (!isActiveEligible) {
      throw new BadRequestException({
        message: 'Profile incomplete',
        missingFields,
      });
    }

    // Verify subscription plan exists
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: dto.subscriptionPlanId },
    });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    // Check if pro already has an active subscription
    const existingSubscription = await this.prisma.proSubscription.findFirst({
      where: {
        proProfileId: proProfile.id,
        status: 'active',
      },
    });

    if (existingSubscription) {
      throw new ConflictException('Pro already has an active subscription');
    }

    // Calculate end date (assuming monthly subscription)
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const subscription = await this.prisma.proSubscription.create({
      data: {
        proProfileId: proProfile.id,
        subscriptionPlanId: dto.subscriptionPlanId,
        startDate,
        endDate,
        autoRenew: dto.autoRenew ?? true,
      },
      include: {
        subscriptionPlan: true,
      },
    });

    await this.prisma.proProfile.update({
      where: { id: proProfile.id },
      data: { isPremium: true },
    });

    return subscription;
  }

  async getProSubscriptions(proId: string) {
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId: proId },
    });

    if (!proProfile) {
      throw new NotFoundException('Pro profile not found');
    }

    return this.prisma.proSubscription.findMany({
      where: { proProfileId: proProfile.id },
      include: {
        subscriptionPlan: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCurrentProSubscription(proId: string) {
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId: proId },
    });

    if (!proProfile) {
      throw new NotFoundException('Pro profile not found');
    }

    return this.prisma.proSubscription.findFirst({
      where: {
        proProfileId: proProfile.id,
        status: 'active',
      },
      include: {
        subscriptionPlan: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancelProSubscription(proId: string, subscriptionId: string) {
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId: proId },
    });

    if (!proProfile) {
      throw new NotFoundException('Pro profile not found');
    }

    const subscription = await this.prisma.proSubscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription || subscription.proProfileId !== proProfile.id) {
      throw new NotFoundException('Subscription not found');
    }

    return this.prisma.proSubscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'canceled',
        autoRenew: false,
      },
      include: {
        subscriptionPlan: true,
      },
    });
  }

  async renewProSubscription(proId: string, subscriptionId: string) {
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId: proId },
    });

    if (!proProfile) {
      throw new NotFoundException('Pro profile not found');
    }

    const subscription = await this.prisma.proSubscription.findUnique({
      where: { id: subscriptionId },
      include: { subscriptionPlan: true },
    });

    if (!subscription || subscription.proProfileId !== proProfile.id) {
      throw new NotFoundException('Subscription not found');
    }

    // Extend the subscription by one month
    const newEndDate = new Date(subscription.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + 1);

    return this.prisma.proSubscription.update({
      where: { id: subscriptionId },
      data: {
        endDate: newEndDate,
        status: 'active',
      },
      include: {
        subscriptionPlan: true,
      },
    });
  }

  // Check and update expired subscriptions (to be called by a cron job)
  async checkExpiredSubscriptions() {
    const expiredSubscriptions = await this.prisma.proSubscription.findMany({
      where: {
        status: 'active',
        endDate: {
          lt: new Date(),
        },
      },
      include: {
        proProfile: true,
      },
    });

    for (const subscription of expiredSubscriptions) {
      if (subscription.autoRenew) {
        // Auto-renew the subscription
        const newEndDate = new Date(subscription.endDate);
        newEndDate.setMonth(newEndDate.getMonth() + 1);

        await this.prisma.proSubscription.update({
          where: { id: subscription.id },
          data: { endDate: newEndDate },
        });

        // Update pro profile premium status
        await this.prisma.proProfile.update({
          where: { id: subscription.proProfileId },
          data: { isPremium: true },
        });
      } else {
        // Mark as expired
        await this.prisma.proSubscription.update({
          where: { id: subscription.id },
          data: { status: 'expired' },
        });

        // Remove premium status
        await this.prisma.proProfile.update({
          where: { id: subscription.proProfileId },
          data: { isPremium: false },
        });
      }
    }

    return { processed: expiredSubscriptions.length };
  }
}
