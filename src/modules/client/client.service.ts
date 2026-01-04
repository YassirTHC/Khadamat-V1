import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { BookingStatus } from '@prisma/client';
import { UpdateClientProfileDto } from './dtos/update-client-profile.dto';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  // Profile management
  async getClientProfile(clientId: string) {
    const profile = await this.prisma.clientProfile.findUnique({
      where: { userId: clientId },
      include: {
        user: true,
        city: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Client profile not found');
    }

    return profile;
  }

  async updateClientProfile(clientId: string, data: UpdateClientProfileDto) {
    const profile = await this.prisma.clientProfile.findUnique({
      where: { userId: clientId },
    });

    if (!profile) {
      throw new NotFoundException('Client profile not found');
    }

    return this.prisma.clientProfile.update({
      where: { userId: clientId },
      data,
      include: {
        user: true,
        city: true,
      },
    });
  }

  // Dashboard stats
  async getClientStats(clientId: string) {
    const [totalBookings, completedBookings, pendingBookings, totalSpent] =
      await Promise.all([
        this.prisma.booking.count({
          where: {
            clientId,
            status: {
              notIn: [
                BookingStatus.CANCELLED_BY_CLIENT,
                BookingStatus.CANCELLED_BY_PRO,
              ],
            },
          },
        }),
        this.prisma.booking.count({
          where: { clientId, status: BookingStatus.COMPLETED },
        }),
        this.prisma.booking.count({
          where: {
            clientId,
            status: { in: [BookingStatus.REQUESTED, BookingStatus.ACCEPTED] },
          },
        }),
        this.prisma.booking.aggregate({
          where: { clientId, status: BookingStatus.COMPLETED },
          _sum: { finalPrice: true },
        }),
      ]);

    return {
      totalBookings,
      completedBookings,
      pendingBookings,
      totalSpent: totalSpent._sum?.finalPrice || 0,
      completionRate:
        totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
    };
  }

  // Recent bookings
  async getClientRecentBookings(clientId: string, limit: number = 5) {
    return this.prisma.booking.findMany({
      where: { clientId },
      include: {
        pro: {
          include: { proProfile: true },
        },
        serviceCategory: true,
        city: true,
        review: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  // Favorite pros (based on completed bookings)
  async getClientFavoritePros(clientId: string, limit: number = 5) {
    const favoritePros = await this.prisma.booking.groupBy({
      by: ['proId'],
      where: {
        clientId,
        status: BookingStatus.COMPLETED,
      },
      _count: {
        proId: true,
      },
      orderBy: {
        _count: {
          proId: 'desc',
        },
      },
      take: limit,
    });

    if (favoritePros.length === 0) {
      return [];
    }

    const proIds = favoritePros.map((fp) => fp.proId);
    const pros = await this.prisma.user.findMany({
      where: { id: { in: proIds } },
      include: {
        proProfile: {
          include: {
            _count: {
              select: { proServices: true },
            },
          },
        },
      },
    });

    return pros.map((pro) => ({
      ...pro,
      bookingCount:
        favoritePros.find((fp) => fp.proId === pro.id)?._count?.proId || 0,
    }));
  }
}
