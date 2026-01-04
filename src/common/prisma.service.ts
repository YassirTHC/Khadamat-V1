import { Inject, Injectable, OnModuleInit, OnModuleDestroy, INestApplication } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { RedisCacheService } from './redis-cache.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(RedisCacheService)
    private cacheService: RedisCacheService,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

   // Clean shutdown to avoid open handles in tests
   async onModuleDestroy() {
     await this.$disconnect();
   }

  // ✅ CORRECTION : Typage de l'application Nest
  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }

  // Cached query methods
  async findUserByIdCached(userId: string) {
    const cacheKey = RedisCacheService.generateUserKey(userId);
    return this.cacheService.getOrSet(
      cacheKey,
      () =>
        this.user.findUnique({
          where: { id: userId, deletedAt: null },
          include: {
            clientProfile: true,
            proProfile: true,
          },
        }),
      3600, // 1 hour TTL
    );
  }

  async findLocationsCached(city?: string) {
    const cacheKey = RedisCacheService.generateLocationsKey(city);
    return this.cacheService.getOrSet(
      cacheKey,
      () =>
        this.city.findMany({
          where: city ? { name: { contains: city } } : undefined,
          orderBy: { name: 'asc' },
        }),
      1800, // 30 minutes TTL
    );
  }

  async findServicesCached(categoryId?: string) {
    const cacheKey = RedisCacheService.generateServicesKey(categoryId);
    return this.cacheService.getOrSet(
      cacheKey,
      () =>
        this.serviceCategory.findMany({
          where: categoryId ? { id: categoryId } : undefined,
          include: {
            proServices: {
              where: { isActive: true },
              include: {
                proProfile: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
          orderBy: { name: 'asc' },
        }),
      1800, // 30 minutes TTL
    );
  }

  async findServiceCategoriesCached() {
    const cacheKey = RedisCacheService.generateServiceCategoriesKey();
    return this.cacheService.getOrSet(
      cacheKey,
      () =>
        this.serviceCategory.findMany({
          orderBy: { name: 'asc' },
        }),
      3600, // 1 hour TTL
    );
  }

  async findBookingsByUserCached(userId: string, status?: string) {
    const cacheKey = RedisCacheService.generateBookingsKey(userId, status);
    return this.cacheService.getOrSet(
      cacheKey,
      () =>
        this.booking.findMany({
          where: {
            OR: [{ clientId: userId }, { proId: userId }],
            ...(status && { status: status as any }),
          },
          include: {
            client: { include: { clientProfile: true } },
            pro: { include: { proProfile: true } },
            serviceCategory: true,
            review: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
      600, // 10 minutes TTL
    );
  }

  async findReviewsCached(serviceId?: string, proId?: string) {
    const cacheKey = RedisCacheService.generateReviewsKey(serviceId, proId);
    return this.cacheService.getOrSet(
      cacheKey,
      () =>
        this.review.findMany({
          where: {
            ...(serviceId && { serviceId }),
            ...(proId && { proId }),
          },
          include: {
            booking: {
              include: {
                serviceCategory: true,
                client: { include: { clientProfile: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
      1800, // 30 minutes TTL
    );
  }

  // Cache invalidation methods
  async invalidateUserCache(userId: string) {
    await this.cacheService.invalidateUserCache(userId);
  }

  async invalidateLocationsCache() {
    await this.cacheService.invalidateLocationsCache();
  }

  async invalidateServicesCache() {
    await this.cacheService.invalidateServicesCache();
  }

  async invalidateServiceCategoriesCache() {
    await this.cacheService.invalidateServiceCategoriesCache();
  }

  async invalidateBookingsCache(userId: string) {
    await this.cacheService.invalidateBookingsCache(userId);
  }

  async invalidateReviewsCache(proId?: string, serviceId?: string) {
    await this.cacheService.invalidateReviewsCache(proId, serviceId);
  }

  // ✅ CORRECTION : Utilisation des types Prisma.XxxArgs au lieu de any

  async createUser(args: Prisma.UserCreateArgs) {
    const result = await this.user.create(args);
    return result;
  }

  async updateUser(args: Prisma.UserUpdateArgs) {
    const result = await this.user.update(args);
    // Invalidate cache for this user
    if (args.where.id) {
      await this.invalidateUserCache(args.where.id);
    }
    return result;
  }

  async deleteUser(args: Prisma.UserDeleteArgs) {
    const result = await this.user.delete(args);
    // Invalidate cache for this user
    if (args.where.id) {
      await this.invalidateUserCache(args.where.id);
    }
    return result;
  }

  async createLocation(args: Prisma.CityCreateArgs) {
    const result = await this.city.create(args);
    await this.invalidateLocationsCache();
    return result;
  }

  async updateLocation(args: Prisma.CityUpdateArgs) {
    const result = await this.city.update(args);
    await this.invalidateLocationsCache();
    return result;
  }

  async createServiceCategory(args: Prisma.ServiceCategoryCreateArgs) {
    const result = await this.serviceCategory.create(args);
    await this.invalidateServiceCategoriesCache();
    await this.invalidateServicesCache();
    return result;
  }

  async updateServiceCategory(args: Prisma.ServiceCategoryUpdateArgs) {
    const result = await this.serviceCategory.update(args);
    await this.invalidateServiceCategoriesCache();
    await this.invalidateServicesCache();
    return result;
  }

  async createBooking(args: Prisma.BookingCreateArgs) {
    const result = await this.booking.create(args);
    // Invalidate bookings cache for both client and pro
    await this.invalidateBookingsCache(result.clientId);
    await this.invalidateBookingsCache(result.proId);
    return result;
  }

  async updateBooking(args: Prisma.BookingUpdateArgs) {
    const result = await this.booking.update(args);
    
    // Pour invalider proprement, on utilise le résultat direct
    // au lieu de refaire une requête findUnique inutile
    await this.invalidateBookingsCache(result.clientId);
    await this.invalidateBookingsCache(result.proId);
    
    return result;
  }

  async createReview(args: Prisma.ReviewCreateArgs) {
    const result = await this.review.create(args);
    await this.invalidateReviewsCache(result.proId);
    return result;
  }
}
