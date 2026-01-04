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
    const isTest = process.env.NODE_ENV === 'test';

    if (isTest) {
      // En test : on évite toute connexion réelle pour supprimer les ECONNREFUSED/handles ouverts
      const stub = {
        on: () => {},
        connect: async () => {},
        disconnect: async () => {},
        quit: async () => {},
        get: async () => null,
        set: async () => null,
      };
      return stub;
    }

    const client = createClient({
      url: redisUrl,
      password: config?.password,
      database: config?.db,
    });

    client.on('error', (err) => {
      if (!isTest) {
        console.error('Redis Client Error:', err);
      }
    });

    try {
      await client.connect();
    } catch (err) {
      console.error('Redis connect failed (continuing without Redis):', err);
      return noopRedisClient();
    }

    // Nettoyage à la sortie du process
    process.on('exit', async () => {
      try {
        await client.quit();
      } catch (e) {
        /* ignore */
      }
    });

    return client;
  },
  inject: [ConfigService],
};

@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisProviderModule {}
