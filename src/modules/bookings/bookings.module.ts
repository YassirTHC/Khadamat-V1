import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../../common/prisma.service';
import { BookingsExpirationService } from './bookings-expiration.service';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, PrismaService, BookingsExpirationService],
  exports: [BookingsService, BookingsExpirationService],
})
export class BookingsModule {}
