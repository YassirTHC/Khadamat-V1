import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig, { databaseConfig, jwtConfig, redisConfig, emailConfig, paymentConfig, uploadConfig, loginLockoutConfig } from './config/configuration';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './common/logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { LocationsModule } from './modules/locations/locations.module';
import { UsersModule } from './modules/users/users.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ProModule } from './modules/pro/pro.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { ClientModule } from './modules/client/client.module';
import { ServicesModule } from './modules/services/services.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthModule } from './modules/health/health.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { DatabaseModule } from './common/database.module';
import { CacheInterceptor } from './common/cache.interceptor';
import { QueuesModule } from './modules/queues/queues.module';
import { RedisProviderModule as RedisModule } from './common/redis/redis.provider';
import { CommunicationEventsModule } from './modules/communication-events/communication-events.module';
const CACHE_TTL_MS = 5 * 60 * 1000;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig, databaseConfig, jwtConfig, redisConfig, emailConfig, paymentConfig, uploadConfig, loginLockoutConfig] }),
    LoggerModule,
    DatabaseModule,
    RedisModule,
    CacheModule.register({
      isGlobal: true,
      ttl: CACHE_TTL_MS,
      max: 1000,
    }),
// Throttling strategy: 'default' throttler applies globally to all endpoints.
// Specific throttlers like 'auth' are applied per-route using @Throttle decorator.
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDev = configService.get('app.nodeEnv') === 'development';
        const defaultLimit = isDev ? 1000 : 200;
        const throttlers = [
          { name: 'default', ttl: 60000, limit: defaultLimit },
        ];
        console.log('Throttler config loaded:', throttlers);
        return {
          throttlers,
          defaultThrottler: 'default',
          skipIf: (context) => context.switchToHttp().getRequest().method === 'OPTIONS',
          storage: process.env.NODE_ENV !== 'test' ? new ThrottlerStorageRedisService(new Redis(configService.get('REDIS_URL') as string)) : undefined,
        };
      },
    }),
    AuthModule,
    LocationsModule,
    UsersModule,
    BookingsModule,
    ProModule,
    MessagingModule,
    ServicesModule,
    ReviewsModule,
    DisputesModule,
    ClientModule,
    NotificationsModule,
    HealthModule,
    SubscriptionsModule,
    StatisticsModule,
    MetricsModule,
    QueuesModule,
    CommunicationEventsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
