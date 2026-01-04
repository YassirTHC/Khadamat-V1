import { ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import { SubscriptionsService } from '../src/modules/subscriptions/subscriptions.service';
import { ProService } from '../src/modules/pro/pro.service';

const MOCK_REDIS = {
  getOrSet: async (_k: string, fn: any) => fn(),
  invalidateUserCache: async () => undefined,
  invalidateLocationsCache: async () => undefined,
  invalidateServicesCache: async () => undefined,
  invalidateServiceCategoriesCache: async () => undefined,
  invalidateBookingsCache: async () => undefined,
  invalidateReviewsCache: async () => undefined,
};

describe('Pro Visibility contract (verification + premium guard)', () => {
  const planId = 'premium-149-mad';
  let prisma: PrismaService;
  let subsService: SubscriptionsService;
  let proService: ProService;

  beforeAll(async () => {
    process.env.DATABASE_URL =
      process.env.DATABASE_URL ||
      'postgresql://admin:password123@localhost:5432/khadamat_db_test?schema=public';
    prisma = new PrismaService(MOCK_REDIS as any);
    await prisma.$connect();
    subsService = new SubscriptionsService(prisma);
    proService = new ProService(prisma);

    // Safety: ensure plan exists
    await prisma.subscriptionPlan.upsert({
      where: { id: planId },
      update: { name: 'Premium', price: 149, duration: 30, isActive: true },
      create: { id: planId, name: 'Premium', price: 149, duration: 30, isActive: true },
    });

    // Safety: ensure seed pros exist
    const pwd = '$2b$10$xG0Y4XOG0C6wCQI.fzk9K.1T5rp0kw5IZY1LpjOGLRH.y1Q.g4nmq'; // bcrypt('password123')
    await prisma.user.upsert({
      where: { email: 'pro.pending@test.com' },
      update: {},
      create: {
        email: 'pro.pending@test.com',
        phone: '+212600001999',
        passwordHash: pwd,
        role: 'PRO',
        isEmailVerified: true,
        phoneVerifiedAt: null,
        cguAcceptedAt: null,
        proProfile: {
          create: {
            firstName: 'Pending',
            lastName: 'Pro',
            profession: 'En attente',
            bio: 'Profil en attente.',
            cityId: 'rabat',
            verificationStatus: 'PENDING',
            isVerifiedPro: false,
            isPremium: false,
          },
        },
      },
    });

    await prisma.user.upsert({
      where: { email: 'pro.verified@test.com' },
      update: {},
      create: {
        email: 'pro.verified@test.com',
        phone: '+212600002000',
        passwordHash: pwd,
        role: 'PRO',
        isEmailVerified: true,
        phoneVerifiedAt: new Date(),
        cguAcceptedAt: new Date(),
        proProfile: {
          create: {
            firstName: 'Verified',
            lastName: 'Pro',
            profession: 'Plombier',
            bio: 'Plombier certifié avec plus de 10 ans d’expérience, interventions rapides et travaux garantis.',
            cityId: 'casablanca',
            verificationStatus: 'APPROVED',
            isVerifiedPro: true,
            isPremium: false,
            proServices: {
              create: {
                id: 'svc-plomberie-casa-verified',
                serviceCategoryId: 'plomberie',
                cityId: 'casablanca',
                basePrice: 300,
                description: 'Interventions plomberie, diagnostics et réparations courantes.',
                isActive: true,
              },
            },
          },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma?.$disconnect();
  });

  it('pending pro: profile shows missingFields and premium is blocked', async () => {
    const pending = await prisma.user.findUniqueOrThrow({ where: { email: 'pro.pending@test.com' } });
    const profile = await proService.getProProfile(pending.id);
    expect(profile.verificationStatus).toBe('PENDING');
    expect(profile.isActiveEligible).toBe(false);
    expect(profile.missingFields).toEqual(expect.arrayContaining(['phone', 'cgu', 'bio', 'service']));

    await expect(
      subsService.createProSubscription(pending.id, { subscriptionPlanId: planId }),
    ).rejects.toThrow(ConflictException);
  });

  it('verified but incomplete pro: fails with 400 Profile incomplete', async () => {
    const tmp = await prisma.user.create({
      data: {
        email: `pro.incomplete.${Date.now()}@test.com`,
        phone: '+212611111111',
        passwordHash:
          '$2b$10$xG0Y4XOG0C6wCQI.fzk9K.1T5rp0kw5IZY1LpjOGLRH.y1Q.g4nmq', // password123
        role: 'PRO',
        isEmailVerified: true,
        phoneVerifiedAt: new Date(),
        cguAcceptedAt: new Date(),
        proProfile: {
          create: {
            firstName: 'Incomplete',
            lastName: 'Pro',
            profession: 'Menuisier',
            bio: 'Bio courte',
            cityId: 'casablanca',
            verificationStatus: 'APPROVED',
            isVerifiedPro: true,
            isPremium: false,
          },
        },
      },
      include: { proProfile: true },
    });

    await expect(
      subsService.createProSubscription(tmp.id, { subscriptionPlanId: planId }),
    ).rejects.toThrow(BadRequestException);

    // cleanup
    await prisma.proProfile.delete({ where: { userId: tmp.id } });
    await prisma.user.delete({ where: { id: tmp.id } });
  });

  it('verified complete pro: premium upgrade succeeds and sets isPremium', async () => {
    const verified = await prisma.user.findUniqueOrThrow({ where: { email: 'pro.verified@test.com' } });
    const res = await subsService.createProSubscription(verified.id, { subscriptionPlanId: planId });
    expect(res).toBeDefined();

    const profile = await proService.getProProfile(verified.id);
    expect(profile.verificationStatus).toBe('APPROVED');
    expect(profile.isActiveEligible).toBe(true);
    expect(profile.isPremium).toBe(true);
  });
});
