import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

// No-op client used in tests when Redis is unavailable
const noopRedisClient = () => ({
  on: () => {},
  quit: async () => {},
  disconnect: async () => {},
  isOpen: false,
});

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: async (configService: ConfigService): Promise<any> => {
    const config = configService.get('redis');
    const redisUrl =
      process.env.REDIS_URL ||
      config?.url ||
      `redis://${config?.host || 'localhost'}:${config?.port || 6379}`;
    const client = createClient({
      url: redisUrl,
      password: config?.password,
      database: config?.db,
    });

    client.on('error', (err) => {
      if (process.env.NODE_ENV !== 'test') {
        console.error('Redis Client Error:', err);
      }
    });

    try {
      await client.connect();
      return client;
    } catch (err) {
      // En test, on ne bloque pas si Redis n'est pas disponible
      if (process.env.NODE_ENV === 'test') {
        console.warn('Redis not available in test environment, using noop client');
        return noopRedisClient();
      }
      throw err;
    }
  },
  inject: [ConfigService],
};

@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisProviderModule {}
