import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { BookingsService } from './bookings.service';

const FIVE_MINUTES_MS = 5 * 60 * 1000;

@Injectable()
export class BookingsExpirationService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BookingsExpirationService.name);
  private timer: NodeJS.Timeout | null = null;

  constructor(private readonly bookingsService: BookingsService) {}

  onModuleInit() {
    // Disable cron in test if flag is set
    if (process.env.NODE_ENV === 'test' || process.env.ENABLE_BOOKING_CRON === 'false') {
      this.logger.log('Booking expiration cron disabled in test environment');
      return;
    }
    // Run once at startup, then every 5 minutes.
    this.runSafely();
    this.timer = setInterval(() => this.runSafely(), FIVE_MINUTES_MS);
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async runSafely() {
    try {
      const result = await this.bookingsService.expireStaleBookings();
      if (result?.processed) {
        this.logger.log(`Expired ${result.processed} stale bookings`);
      }
    } catch (error) {
      this.logger.error('Failed to expire stale bookings', error as any);
    }
  }
}
