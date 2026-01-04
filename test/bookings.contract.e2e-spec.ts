// Ensure we use a Postgres URL for contract tests (override sqlite test env)
process.env.DATABASE_URL =
  process.env.E2E_DATABASE_URL ||
  process.env.DATABASE_URL ||
  'postgresql://admin:password123@localhost:5432/khadamat_db?schema=public';
process.env.PORT = process.env.PORT || '4000';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';

describe('Bookings contract (proUserId vs proId)', () => {
  let app: INestApplication;
  let httpServer: any;
  let clientToken: string;
  let proToken: string;
  let proProfile: any;

  const clientEmail = 'jean.client@test.com';
  const proEmail = 'pro.youssef@test.com';
  const password = 'password123';

  const login = async (identifier: string, pwd: string) => {
    const res = await request(httpServer)
      .post('/api/auth/login')
      .send({ identifier, password: pwd });
    expect([200, 201]).toContain(res.status);
    return res.body.access_token as string;
  };

  const buildPayload = (proUserId: string, serviceCategoryId: string, cityId: string) => {
    const slot = new Date(Date.now() + 4 * 60 * 60 * 1000);
    slot.setMinutes(0, 0, 0);
    return {
      proUserId,
      serviceCategoryId,
      cityId,
      timeSlot: slot.toISOString(),
      description: 'Contract test booking',
    };
  };

  beforeAll(async () => {
    // Ensure env is correct before Nest initializes Prisma
    process.env.DATABASE_URL =
      process.env.E2E_DATABASE_URL ||
      process.env.DATABASE_URL ||
      'postgresql://admin:password123@localhost:5432/khadamat_db?schema=public';
    process.env.PORT = process.env.PORT || '4000';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    httpServer = app.getHttpServer();

    // Login once to avoid throttling
    clientToken = await login(clientEmail, password);
    proToken = await login(proEmail, password);

    const profileRes = await request(httpServer)
      .get('/api/pro/profile')
      .set('Authorization', `Bearer ${proToken}`);
    expect(profileRes.status).toBe(200);
    proProfile = profileRes.body;
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates booking with proUserId (happy path)', async () => {
    const proUserId = proProfile?.user?.id ?? proProfile?.userId ?? proProfile?.id;
    const primaryService = proProfile?.proServices?.[0];
    const cityId = proProfile?.cityId ?? primaryService?.cityId;
    const payload = buildPayload(proUserId, primaryService.serviceCategoryId, cityId);

    const res = await request(httpServer)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${clientToken}`)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body?.status).toBe('REQUESTED');
  });

  it('creates booking with legacy proId alias', async () => {
    const proUserId = proProfile?.user?.id ?? proProfile?.userId ?? proProfile?.id;
    const primaryService = proProfile?.proServices?.[0];
    const cityId = proProfile?.cityId ?? primaryService?.cityId;
    const payload = buildPayload(proUserId, primaryService.serviceCategoryId, cityId);

    // use alias proId instead of proUserId
    const { proUserId: _, ...rest } = payload;
    const aliasPayload = { ...rest, proId: proUserId };

    const res = await request(httpServer)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${clientToken}`)
      .send(aliasPayload);

    expect(res.status).toBe(201);
    expect(res.body?.status).toBe('REQUESTED');
  });

  it('rejects invalid proUserId (e.g., proProfileId)', async () => {
    const primaryService = proProfile?.proServices?.[0];
    const cityId = proProfile?.cityId ?? primaryService?.cityId;

    const invalidProUserId = proProfile?.id; // proProfileId, not userId
    const payload = buildPayload(invalidProUserId, primaryService.serviceCategoryId, cityId);

    const res = await request(httpServer)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${clientToken}`)
      .send(payload);

    expect([400, 404]).toContain(res.status);
    expect((res.body?.message || '').toLowerCase()).toContain('invalid pro user id');
  });
});
