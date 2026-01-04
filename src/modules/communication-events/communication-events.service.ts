import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CommunicationChannel, Role } from '@prisma/client';
import { CreateCommunicationEventDto } from './dtos/create-communication-event.dto';

@Injectable()
export class CommunicationEventsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureProExists(proId: string) {
    const pro = await this.prisma.user.findUnique({
      where: { id: proId },
      select: { id: true, role: true, status: true },
    });

    if (!pro || pro.role !== Role.PRO || pro.status !== 'active') {
      throw new NotFoundException('Pro not found or inactive');
    }
  }

  async create(clientId: string, dto: CreateCommunicationEventDto) {
    await this.ensureProExists(dto.proId);

    if (dto.bookingId) {
      const booking = await this.prisma.booking.findUnique({
        where: { id: dto.bookingId },
        select: { id: true, clientId: true, proId: true },
      });
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
      if (booking.proId !== dto.proId) {
        throw new ConflictException('Booking does not belong to this pro');
      }
      // Optionally enforce client ownership
      if (booking.clientId !== clientId) {
        throw new ConflictException('Booking does not belong to this client');
      }
    }

    return this.prisma.communicationEvent.create({
      data: {
        channel: dto.channel ?? CommunicationChannel.WHATSAPP,
        proId: dto.proId,
        clientId,
        bookingId: dto.bookingId,
        message: dto.message,
        metadata: dto.metadata,
      },
    });
  }
}
