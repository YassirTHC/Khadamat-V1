import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { Role, BookingStatus, PricingType } from '@prisma/client';
import { CreateBookingDto } from './dtos/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  private normalizeToSlot(dateInput?: string): Date {
    if (!dateInput) {
      throw new BadRequestException('timeSlot is required');
    }
    const parsed = new Date(dateInput);
    if (isNaN(parsed.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
    // Snap to next 60-min slot to avoid falling into the past (ceil)
    const ms = parsed.getTime();
    const slotMs =
      Math.ceil(ms / (60 * 60 * 1000)) * 60 * 60 * 1000;
    const slot = new Date(slotMs);
    const now = new Date();
    if (slot <= now) {
      throw new BadRequestException('Cannot book a past time slot');
    }
    return slot;
  }

  private async logEvent(
    bookingId: string,
    toStatus: BookingStatus,
    actorId?: string,
    actorRole?: Role,
    fromStatus?: BookingStatus,
    reason?: string,
    metadata?: Record<string, any>,
  ) {
    await this.prisma.bookingEvent.create({
      data: {
        bookingId,
        toStatus,
        fromStatus,
        actorId,
        actorRole,
        reason,
        metadata,
      },
    });
  }

  async createBooking(userId: string, dto: CreateBookingDto) {
    const proUserId = dto.proUserId || dto.proId;
    if (!proUserId) {
      throw new BadRequestException('proUserId is required');
    }
    if (!dto.proUserId && dto.proId) {
      console.warn('[booking] Using legacy proId alias; please migrate to proUserId');
    }

    const proUser = await this.prisma.user.findUnique({
      where: { id: proUserId },
      select: { id: true, role: true, status: true },
    });
    if (!proUser || proUser.role !== Role.PRO) {
      throw new BadRequestException('Invalid pro user id');
    }

    const slot = this.normalizeToSlot(dto.timeSlot);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Determine pricingType (prefer payload, else infer from pro service/category)
    let pricingType: PricingType = dto.pricingType || PricingType.FIXED;
    if (!dto.pricingType && dto.serviceCategoryId) {
      const proService = await this.prisma.proService.findFirst({
        where: {
          proProfile: { userId: proUserId },
          serviceCategoryId: dto.serviceCategoryId,
          isActive: true,
        },
        select: { pricingType: true },
      });
      if (proService?.pricingType) {
        pricingType = proService.pricingType;
      }
    }

    try {
      const booking = await this.prisma.$transaction(async (tx) => {
        const created = await tx.booking.create({
          data: {
            clientId: userId,
            proId: proUserId,
            serviceCategoryId: dto.serviceCategoryId,
            cityId: dto.cityId,
            description: dto.description,
            timeSlot: slot,
            expiresAt,
            pricingType,
            status: BookingStatus.REQUESTED,
          },
        });

        await tx.bookingEvent.create({
          data: {
            bookingId: created.id,
            toStatus: BookingStatus.REQUESTED,
            actorId: userId,
            actorRole: Role.CLIENT,
            metadata: { source: 'create' },
          },
        });

        return created;
      });

      return booking;
    } catch (err: any) {
      console.error('createBooking error', {
        code: err?.code,
        message: err?.message,
        meta: err?.meta,
      });
      if (err?.code === 'P2002') {
        // Unique constraint (ex: slot already locked via constraint)
        throw new ConflictException('Slot already taken (constraint)');
      }
      if (err?.code === 'P2003') {
        throw new BadRequestException('Invalid reference (pro/service/city)');
      }
      throw new BadRequestException(
        {
          message: 'Unable to create booking',
          code: err?.code,
          detail: err?.meta || err?.message,
        },
        { cause: err },
      );
    }
  }

  async findUserBookings(userId: string, role: Role) {
    const where =
      role === Role.CLIENT
        ? { clientId: userId }
        : { proId: userId };

    return this.prisma.booking.findMany({
      where,
      include: {
        serviceCategory: true,
        city: true,
        pro: {
          select: {
            id: true,
            phone: true,
            proProfile: true,
          },
        },
        client: { include: { clientProfile: true } },
        slotLock: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    id: string,
    status: BookingStatus,
    userId: string,
    role: Role,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { slotLock: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const current = booking.status as BookingStatus;
    if (current === status) return booking;

    const isClient = role === Role.CLIENT && booking.clientId === userId;
    const isPro = role === Role.PRO && booking.proId === userId;
    const isAdmin = role === Role.ADMIN || role === Role.MODERATOR;

    const requireClient = () => {
      if (!isClient && !isAdmin) {
        throw new ForbiddenException('Only client can perform this action');
      }
    };
    const requirePro = () => {
      if (!isPro && !isAdmin) {
        throw new ForbiddenException('Only pro can perform this action');
      }
    };

    if (status === BookingStatus.ACCEPTED) {
      if (current !== BookingStatus.REQUESTED) {
        throw new BadRequestException('Only REQUESTED can be accepted');
      }
      requirePro();
      const slot = booking.timeSlot;
      const updated = await this.prisma.$transaction(async (tx) => {
        try {
          await tx.slotLock.create({
            data: {
              proId: booking.proId,
              timeSlot: slot,
              bookingId: booking.id,
            },
          });
        } catch (err: any) {
          if (err.code === 'P2002') {
            throw new ConflictException('Slot already taken');
          }
          throw err;
        }

        const b = await tx.booking.update({
          where: { id },
          data: {
            status: BookingStatus.ACCEPTED,
            acceptedAt: new Date(),
          },
        });

        await tx.bookingEvent.create({
          data: {
            bookingId: id,
            fromStatus: current,
            toStatus: BookingStatus.ACCEPTED,
            actorId: userId,
            actorRole: role,
          },
        });

        return b;
      });
      return updated;
    }

    if (status === BookingStatus.DECLINED) {
      if (current !== BookingStatus.REQUESTED) {
        throw new BadRequestException('Only REQUESTED can be declined');
      }
      requirePro();
      const updated = await this.prisma.booking.update({
        where: { id },
        data: { status: BookingStatus.DECLINED },
      });
      await this.logEvent(id, BookingStatus.DECLINED, userId, role, current);
      return updated;
    }

    if (status === BookingStatus.CANCELLED_BY_CLIENT) {
      const cancellable: BookingStatus[] = [
        BookingStatus.REQUESTED,
        BookingStatus.ACCEPTED,
      ];
      if (!cancellable.includes(current)) {
        throw new BadRequestException('Cannot cancel this booking');
      }
      requireClient();
      const updated = await this.prisma.$transaction(async (tx) => {
        if (booking.slotLock) {
          await tx.slotLock.delete({ where: { id: booking.slotLock.id } });
        }
        const b = await tx.booking.update({
          where: { id },
          data: { status: BookingStatus.CANCELLED_BY_CLIENT },
        });
        await tx.bookingEvent.create({
          data: {
            bookingId: id,
            fromStatus: current,
            toStatus: BookingStatus.CANCELLED_BY_CLIENT,
            actorId: userId,
            actorRole: role,
          },
        });
        return b;
      });
      return updated;
    }

    if (status === BookingStatus.CANCELLED_BY_PRO) {
      const cancellable: BookingStatus[] = [
        BookingStatus.REQUESTED,
        BookingStatus.ACCEPTED,
      ];
      if (!cancellable.includes(current)) {
        throw new BadRequestException('Cannot cancel this booking');
      }
      requirePro();
      const updated = await this.prisma.$transaction(async (tx) => {
        if (booking.slotLock) {
          await tx.slotLock.delete({ where: { id: booking.slotLock.id } });
        }
        const b = await tx.booking.update({
          where: { id },
          data: { status: BookingStatus.CANCELLED_BY_PRO },
        });
        await tx.bookingEvent.create({
          data: {
            bookingId: id,
            fromStatus: current,
            toStatus: BookingStatus.CANCELLED_BY_PRO,
            actorId: userId,
            actorRole: role,
          },
        });
        return b;
      });
      return updated;
    }

    if (status === BookingStatus.COMPLETED) {
      if (current !== BookingStatus.ACCEPTED) {
        throw new BadRequestException('Only ACCEPTED can be completed');
      }
      if (!isPro && !isAdmin && !isClient) {
        throw new ForbiddenException('Not allowed');
      }
      const updated = await this.prisma.booking.update({
        where: { id },
        data: {
          status: BookingStatus.COMPLETED,
          completedAt: new Date(),
        },
      });
      await this.logEvent(
        id,
        BookingStatus.COMPLETED,
        userId,
        role,
        current,
      );
      return updated;
    }

    if (status === BookingStatus.EXPIRED) {
      if (current !== BookingStatus.REQUESTED) {
        throw new BadRequestException('Only REQUESTED can expire');
      }
      const updated = await this.prisma.booking.update({
        where: { id },
        data: { status: BookingStatus.EXPIRED },
      });
      await this.logEvent(id, BookingStatus.EXPIRED, userId, role, current);
      return updated;
    }

    throw new BadRequestException('Unsupported transition');
  }

  async expireStaleBookings() {
    const now = new Date();
    const stale = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.REQUESTED,
        expiresAt: { lte: now },
      },
      select: { id: true, status: true },
    });

    if (!stale.length) return { processed: 0 };

    await this.prisma.$transaction(async (tx) => {
      await tx.booking.updateMany({
        where: {
          id: { in: stale.map((b) => b.id) },
        },
        data: { status: BookingStatus.EXPIRED },
      });

      await tx.bookingEvent.createMany({
        data: stale.map((b) => ({
          bookingId: b.id,
          fromStatus: b.status,
          toStatus: BookingStatus.EXPIRED,
        })),
      });
    });

    return { processed: stale.length };
  }
}
