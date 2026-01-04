process.env.DATABASE_URL =
  process.env.E2E_DATABASE_URL ||
  process.env.DATABASE_URL ||
  'postgresql://admin:password123@localhost:5432/khadamat_db_test?schema=public';
process.env.PORT = process.env.PORT || '4000';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { PricingType } from '@prisma/client';

describe('Services pricing (FIXED | QUOTE) contract', () => {
  let app: INestApplication;
  let httpServer: any;
  let clientToken: string;
  let proFixedToken: string;
  let proQuoteToken: string;

  const clientEmail = 'jean.client@test.com';
  const proFixedEmail = 'pro.verified@test.com';
  const proQuoteEmail = 'pro.quote@test.com';
  const password = 'password123';

  const login = async (identifier: string, pwd: string) => {
    const res = await request(httpServer).post('/api/auth/login').send({ identifier, password: pwd });
    expect([200, 201]).toContain(res.status);
    return res.body.access_token as string;
  };

  beforeAll(async () => {
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

    clientToken = await login(clientEmail, password);
    proFixedToken = await login(proFixedEmail, password);
    proQuoteToken = await login(proQuoteEmail, password);
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a FIXED service (requires basePrice)', async () => {
    const res = await request(httpServer)
      .post('/api/pro/services')
      .set('Authorization', `Bearer ${proFixedToken}`)
      .send({
        categoryId: 'plomberie',
        cityId: 'casablanca',
        pricingType: PricingType.FIXED,
        basePrice: 450,
        description: 'Test service FIXED',
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.pricingType).toBe(PricingType.FIXED);
    expect(res.body.basePrice).toBe(450);
  });

  it('creates a QUOTE service without basePrice', async () => {
    const res = await request(httpServer)
      .post('/api/pro/services')
      .set('Authorization', `Bearer ${proQuoteToken}`)
      .send({
        categoryId: 'peinture',
        cityId: 'casablanca',
        pricingType: PricingType.QUOTE,
        description: 'Test service QUOTE',
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.pricingType).toBe(PricingType.QUOTE);
    expect(res.body.basePrice).toBeNull();
  });

  it('creates bookings with pricingType propagated (FIXED vs QUOTE)', async () => {
    const future = new Date(Date.now() + 4 * 60 * 60 * 1000);
    future.setMinutes(0, 0, 0);

    const fixedBooking = await request(httpServer)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        proUserId: (await request(httpServer).get('/api/pro/profile').set('Authorization', `Bearer ${proFixedToken}`))
          .body.userId,
        serviceCategoryId: 'plomberie',
        cityId: 'casablanca',
        pricingType: PricingType.FIXED,
        timeSlot: future.toISOString(),
        description: 'Booking FIXED',
      });
    expect([200, 201]).toContain(fixedBooking.status);
    expect(fixedBooking.body.pricingType).toBe(PricingType.FIXED);

    const quoteBooking = await request(httpServer)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        proUserId: (
          await request(httpServer).get('/api/pro/profile').set('Authorization', `Bearer ${proQuoteToken}`)
        ).body.userId,
        serviceCategoryId: 'peinture',
        cityId: 'casablanca',
        pricingType: PricingType.QUOTE,
        timeSlot: future.toISOString(),
        description: 'Booking QUOTE',
      });
    expect([200, 201]).toContain(quoteBooking.status);
    expect(quoteBooking.body.pricingType).toBe(PricingType.QUOTE);
  });

  it('rejects invalid pricingType', async () => {
    const res = await request(httpServer)
      .post('/api/pro/services')
      .set('Authorization', `Bearer ${proFixedToken}`)
      .send({
        categoryId: 'plomberie',
        cityId: 'casablanca',
        pricingType: 'INVALID',
        description: 'Bad pricing type',
      });

    expect(res.status).toBe(400);
  });
});
