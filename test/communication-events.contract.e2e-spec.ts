// Force Postgres for contract tests
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
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';

describe('Communication events contract (WhatsApp trace)', () => {
  let app: INestApplication;
  let httpServer: any;
  let prisma: PrismaService;
  let clientToken: string;
  let proId: string;

  const clientEmail = 'jean.client@test.com';
  const proEmail = 'pro.verified@test.com';
  const password = 'password123';

  const login = async (identifier: string, pwd: string) => {
    const res = await request(httpServer)
      .post('/api/auth/login')
      .send({ identifier, password: pwd });
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
    prisma = moduleRef.get(PrismaService);

    // Minimal references for seed users
    await prisma.city.upsert({
      where: { id: 'casablanca' },
      update: { name: 'Casablanca', isActive: true },
      create: { id: 'casablanca', name: 'Casablanca', isActive: true },
    });
    await prisma.serviceCategory.upsert({
      where: { id: 'plomberie' },
      update: { name: 'Plomberie', isActive: true },
      create: { id: 'plomberie', name: 'Plomberie', isActive: true, icon: 'Wrench' },
    });

    // Ensure seed users exist
    const passwordHash = await bcrypt.hash(password, 10);

    // Ensure seed users exist for the test DB
    const pro = await prisma.user.upsert({
      where: { email: proEmail },
      update: {},
      create: {
        email: proEmail,
        phone: '+212600002000',
        passwordHash,
        role: 'PRO',
        isEmailVerified: true,
        phoneVerifiedAt: new Date(),
        cguAcceptedAt: new Date(),
        proProfile: {
          create: {
            firstName: 'Verified',
            lastName: 'Pro',
            profession: 'Plombier',
            bio: 'Contact test pro',
            cityId: 'casablanca',
            verificationStatus: 'APPROVED',
            isVerifiedPro: true,
            isPremium: false,
            proServices: {
              create: {
                serviceCategoryId: 'plomberie',
                cityId: 'casablanca',
                basePrice: 250,
                description: 'Service test',
                isActive: true,
              },
            },
          },
        },
      },
    });
    proId = pro.id;

    await prisma.user.upsert({
      where: { email: clientEmail },
      update: {},
      create: {
        email: clientEmail,
        phone: '+212600009999',
        passwordHash,
        role: 'CLIENT',
        isEmailVerified: true,
        phoneVerifiedAt: new Date(),
        cguAcceptedAt: new Date(),
        clientProfile: {
          create: {
            firstName: 'Jean',
            lastName: 'Client',
            cityId: 'casablanca',
          },
        },
      },
    });

    clientToken = await login(clientEmail, password);
  });

  afterAll(async () => {
    await app?.close();
    await prisma?.$disconnect();
  });

  it('creates a WhatsApp communication event for a valid pro', async () => {
    const res = await request(httpServer)
      .post('/api/communication-events')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        channel: 'WHATSAPP',
        proId,
        message: 'Contact test',
        metadata: { source: 'contract-e2e' },
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.channel).toBe('WHATSAPP');
    expect(res.body.proId).toBe(proId);
  });

  it('rejects when pro does not exist', async () => {
    const res = await request(httpServer)
      .post('/api/communication-events')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        channel: 'WHATSAPP',
        proId: 'non-existent-pro',
      });

    expect(res.status).toBe(404);
  });
});
\n// TODO: cleanly close prom-client/metrics handles so --forceExit becomes unnecessary.
