import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { BookingStatus, Role } from '@prisma/client';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getClientStatistics(userId: string) {
    // Get active bookings (quoted or accepted)
    const activeBookings = await this.prisma.booking.count({
      where: {
        clientId: userId,
        status: {
          in: [BookingStatus.REQUESTED, BookingStatus.ACCEPTED],
        },
      },
    });

    // Get completed bookings
    const completedBookings = await this.prisma.booking.count({
      where: {
        clientId: userId,
        status: BookingStatus.COMPLETED,
      },
    });

    // Get total spent (sum of finalPrice from completed bookings)
    const totalSpentResult = await this.prisma.booking.aggregate({
      where: {
        clientId: userId,
        status: BookingStatus.COMPLETED,
        finalPrice: {
          not: null,
        },
      },
      _sum: {
        finalPrice: true,
      },
    });

    const totalSpent = totalSpentResult._sum?.finalPrice || 0;

    return {
      activeBookings,
      completedBookings,
      totalSpent,
    };
  }

  // Platform-level public stats for homepage and marketing
  async getPlatformStats() {
    const [
      totalUsers,
      totalPros,
      totalBookings,
      activeBookings,
      totalServices,
      totalCities,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: Role.PRO } }),
      this.prisma.booking.count(),
      this.prisma.booking.count({
        where: {
          status: { in: [BookingStatus.REQUESTED, BookingStatus.ACCEPTED] },
        },
      }),
      this.prisma.proService.count(),
      this.prisma.city.count(),
    ]);

    return {
      totalUsers,
      totalPros,
      totalBookings,
      activeBookings,
      totalServices,
      totalCities,
    };
  }

  async getProStatistics(userId: string) {
    // Get pro profile
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId },
    });

    if (!proProfile) {
      throw new Error('Pro profile not found');
    }

    // Get revenue (sum of finalPrice from completed bookings)
    const revenueResult = await this.prisma.booking.aggregate({
      where: {
        proId: userId,
        status: BookingStatus.COMPLETED,
        finalPrice: {
          not: null,
        },
      },
      _sum: {
        finalPrice: true,
      },
    });

    const revenue = revenueResult._sum?.finalPrice || 0;

    // Get pending bookings (quoted or accepted)
    const pendingBookings = await this.prisma.booking.count({
      where: {
        proId: userId,
        status: {
          in: [BookingStatus.REQUESTED, BookingStatus.ACCEPTED],
        },
      },
    });

    // Get completed bookings
    const completedBookings = await this.prisma.booking.count({
      where: {
        proId: userId,
        status: BookingStatus.COMPLETED,
      },
    });

    // Get rating from pro profile
    const rating = proProfile.averageRating || 0;

    return {
      revenue,
      pendingBookings,
      completedBookings,
      rating,
    };
  }
}
