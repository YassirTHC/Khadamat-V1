import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req, // Utilisation de Req au lieu de Request (decorateur Nest)
  ForbiddenException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { BookingStatus, Role, User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express'; // Import du type Request Express
import { UpdateBookingStatusDto } from './dtos/update-booking-status.dto';

// ✅ CORRECTION : Interface standardisée pour ce projet
interface RequestWithUser extends Request {
  user: User;
}

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(
    @Req() req: RequestWithUser, 
    @Body() dto: CreateBookingDto
  ) {
    const user = req.user;

    if (user.role !== Role.CLIENT) {
      throw new ForbiddenException('Only clients can create bookings');
    }

    // ✅ CORRECTION : Accès direct à user.id
    return this.bookingsService.createBooking(user.id, dto);
  }

  @Get()
  async getUserBookings(@Req() req: RequestWithUser) {
    const user = req.user;

    // Pas besoin de vérifier si user existe, le Guard le fait déjà
    if (user.role !== Role.CLIENT && user.role !== Role.PRO) {
      throw new ForbiddenException(
        'Only clients and professionals can view their bookings',
      );
    }

    return this.bookingsService.findUserBookings(user.id, user.role);
  }

  @Patch(':id/status')
  async updateBookingStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;
    return this.bookingsService.updateStatus(id, dto.status, user.id, user.role);
  }
}
