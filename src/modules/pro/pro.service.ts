import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateProServiceDto } from './dtos/create-pro-service.dto';
import { UpdateProServiceDto } from './dtos/update-pro-service.dto';
import { UpdateProProfileDto } from './dtos/update-pro-profile.dto';
import { GetProsFilterDto } from './dtos/get-pros-filter.dto';
import { PaginatedResponse } from '../../common/interfaces/pagination.interface';
import { Role, BookingStatus, Prisma } from '@prisma/client';

type ProWithServices = Prisma.ProProfileGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        email: false;
        phone: true;
        role: true;
        status: true;
        lastLogin: true;
        createdAt: true;
        phoneVerifiedAt: true;
        cguAcceptedAt: true;
      };
    };
    city: true;
    proServices: {
      where: { isActive: true };
      include: { serviceCategory: true; city: true };
    };
  };
}>;

@Injectable()
export class ProService {
  constructor(private prisma: PrismaService) {}

  private computeEligibility(profile: ProWithServices) {
    const missingFields: string[] = [];
    const bioLength = profile.bio?.trim().length ?? 0;
    const activeServices = (profile.proServices || []).filter((s) => s.isActive).length;
    if (!profile.user?.phoneVerifiedAt) missingFields.push('phone');
    if (!profile.user?.cguAcceptedAt) missingFields.push('cgu');
    if (!profile.cityId) missingFields.push('city');
    if (bioLength < 50) missingFields.push('bio');
    if (activeServices === 0) missingFields.push('service');
    const isActiveEligible = missingFields.length === 0;
    return { isActiveEligible, missingFields };
  }

  // Profile management
  async getProProfile(proId: string) {
    const profile = await this.prisma.proProfile.findUnique({
      where: { userId: proId },
      include: {
        user: true,
        city: true,
        proServices: {
          include: {
            serviceCategory: true,
            city: true,
          },
          where: { isActive: true },
        },
        subscriptions: {
          include: {
            subscriptionPlan: true,
          },
          where: { status: 'active' },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Pro profile not found');
    }

    const verificationStatus = profile.verificationStatus ?? (profile.isVerifiedPro ? 'APPROVED' : 'PENDING');
    const isVerified = verificationStatus === 'APPROVED';
    const { isActiveEligible, missingFields } = this.computeEligibility(profile as ProWithServices);

    return {
      ...profile,
      verificationStatus,
      isVerified,
      isActiveEligible,
      missingFields,
    };
  }

  async updateProProfile(proId: string, data: UpdateProProfileDto) {
    const profile = await this.prisma.proProfile.findUnique({
      where: { userId: proId },
    });

    if (!profile) {
      throw new NotFoundException('Pro profile not found');
    }

    return this.prisma.proProfile.update({
      where: { userId: proId },
      data,
      include: {
        user: true,
        city: true,
      },
    });
  }

  // Pro Services management
  async createProService(proId: string, dto: CreateProServiceDto) {
    // Verify the pro profile exists
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId: proId },
    });

    if (!proProfile) {
      throw new NotFoundException('Pro profile not found');
    }

    // Verify service category exists
    const serviceCategory = await this.prisma.serviceCategory.findUnique({
      where: { id: dto.categoryId },
    });

    if (!serviceCategory) {
      throw new NotFoundException('Service category not found');
    }

    // Verify city exists
    const city = await this.prisma.city.findUnique({
      where: { id: dto.cityId },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    if (dto.pricingType === 'FIXED' && dto.basePrice === undefined) {
      throw new BadRequestException('basePrice is required for FIXED pricingType');
    }

    return this.prisma.proService.create({
      data: {
        proProfileId: proProfile.id,
        serviceCategoryId: dto.categoryId,
        cityId: dto.cityId,
        pricingType: dto.pricingType,
        basePrice: dto.basePrice ?? null,
        description: dto.description,
      },
      include: {
        serviceCategory: true,
        city: true,
      },
    });
  }

  async getProServices(proId: string) {
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId: proId },
    });

    if (!proProfile) {
      throw new NotFoundException('Pro profile not found');
    }

    return this.prisma.proService.findMany({
      where: { proProfileId: proProfile.id },
      include: {
        serviceCategory: true,
        city: true,
      },
    });
  }

  async updateProService(
    proId: string,
    serviceId: string,
    dto: UpdateProServiceDto,
  ) {
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId: proId },
    });

    if (!proProfile) {
      throw new NotFoundException('Pro profile not found');
    }

    const service = await this.prisma.proService.findUnique({
      where: { id: serviceId },
    });

    if (!service || service.proProfileId !== proProfile.id) {
      throw new ForbiddenException('Service not found or access denied');
    }

    const data: any = {};
    if (dto.categoryId !== undefined) data.serviceCategoryId = dto.categoryId;
    if (dto.cityId !== undefined) data.cityId = dto.cityId;
    if (dto.pricingType !== undefined) {
      data.pricingType = dto.pricingType;
      if (dto.pricingType === 'QUOTE') {
        data.basePrice = null;
      }
    }
    if (dto.basePrice !== undefined) data.basePrice = dto.basePrice;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return this.prisma.proService.update({
      where: { id: serviceId },
      data,
      include: {
        serviceCategory: true,
        city: true,
      },
    });
  }

  async deleteProService(proId: string, serviceId: string) {
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId: proId },
    });

    if (!proProfile) {
      throw new NotFoundException('Pro profile not found');
    }

    const service = await this.prisma.proService.findUnique({
      where: { id: serviceId },
    });

    if (!service || service.proProfileId !== proProfile.id) {
      throw new ForbiddenException('Service not found or access denied');
    }

    return this.prisma.proService.delete({
      where: { id: serviceId },
    });
  }

  // Dashboard stats
  async getProStats(proId: string) {
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId: proId },
    });

    if (!proProfile) {
      throw new NotFoundException('Pro profile not found');
    }

    const [totalBookings, completedBookings, pendingBookings, averageRating] =
      await Promise.all([
        this.prisma.booking.count({
          where: {
            proId,
            status: {
              notIn: [BookingStatus.CANCELLED_BY_CLIENT, BookingStatus.CANCELLED_BY_PRO],
            },
          },
        }),
        this.prisma.booking.count({
          where: { proId, status: BookingStatus.COMPLETED },
        }),
        this.prisma.booking.count({
          where: {
            proId,
            status: { in: [BookingStatus.REQUESTED, BookingStatus.ACCEPTED] },
          },
        }),
        this.prisma.review.aggregate({
          where: { proId },
          _avg: { rating: true },
        }),
      ]);

    return {
      totalBookings,
      completedBookings,
      pendingBookings,
      averageRating: averageRating._avg?.rating || 0,
      completionRate:
        totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
    };
  }

  // Public pro discovery methods
  async getPros(
    dto: GetProsFilterDto,
  ): Promise<PaginatedResponse<ProWithServices>> {
    const page = Number(dto.page) || 1;
    const limit = Number(dto.limit) || 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ProProfileWhereInput = {
      user: {
        role: Role.PRO,
        status: 'active',
      },
      // Filter proServices to ensure at least one matches the criteria
      proServices: {
        some: {
          isActive: true,
          ...(dto.categoryId && {
            serviceCategoryId: dto.categoryId,
          }),
          ...(dto.cityId && {
            cityId: dto.cityId,
          }),
          ...(dto.maxPrice && {
            basePrice: { lte: dto.maxPrice },
          }),
        },
      },
      ...(dto.minRating !== undefined && {
        averageRating: { gte: dto.minRating },
      }),
      ...(dto.verified !== undefined && {
        isVerifiedPro: dto.verified,
      }),
      ...(dto.premium !== undefined && {
        isPremium: dto.premium,
      }),
      ...(dto.search && {
        OR: [
          { firstName: { contains: dto.search } },
          { lastName: { contains: dto.search } },
          { profession: { contains: dto.search } },
        ],
      }),
    };

    const [pros, total] = await Promise.all([
      this.prisma.proProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: false, // Don't expose email
              phone: true,
              role: true,
              status: true,
              cguAcceptedAt: true,
              phoneVerifiedAt: true,
              lastLogin: true,
              createdAt: true,
            },
          },
          city: true,
          proServices: {
            where: {
              isActive: true,
            },
            include: {
              serviceCategory: true,
              city: true,
            },
          },
        },
        orderBy: [
          { isVerifiedPro: 'desc' },
          { averageRating: 'desc' },
          { totalReviews: 'desc' },
        ],
        skip,
        take: limit,
      }),
      this.prisma.proProfile.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: pros,
      total,
      page,
      pageSize: limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async getProById(proId: string) {
    const pro = await this.prisma.proProfile.findUnique({
      where: { userId: proId },
      include: {
        user: {
          select: {
            id: true,
            role: true,
            status: true,
            phone: true,
            lastLogin: true,
            createdAt: true,
          },
        },
        city: true,
        proServices: {
          where: { isActive: true },
          include: {
            serviceCategory: true,
            city: true,
          },
        },
      },
    });

    if (!pro) {
      throw new NotFoundException('Pro not found');
    }

    return pro;
  }
}
