import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import request from 'supertest';
import { TestDatabaseService } from './test-database.service';
import { PrismaService } from '../src/common/prisma.service';
import { TestUtils } from './test-utils';
import { RedisCacheService } from '../src/common/redis-cache.service';

// Mock RedisCacheService for tests
const mockRedisCacheService = {
  getOrSet: jest.fn().mockImplementation(async (key, fn) => fn()),
  invalidateUserCache: jest.fn(),
  invalidateLocationsCache: jest.fn(),
  invalidateServicesCache: jest.fn(),
  invalidateServiceCategoriesCache: jest.fn(),
  invalidateBookingsCache: jest.fn(),
  invalidateReviewsCache: jest.fn(),
};
// Import only the modules we need for testing
import { AuthModule } from '../src/modules/auth/auth.module';
import { UsersModule } from '../src/modules/users/users.module';
import { BookingsModule } from '../src/modules/bookings/bookings.module';
import { HealthModule } from '../src/modules/health/health.module';
import { ProModule } from '../src/modules/pro/pro.module';
import { ConfigModule } from '@nestjs/config';
import appConfig, { databaseConfig, jwtConfig, redisConfig, emailConfig, paymentConfig, uploadConfig, loginLockoutConfig } from '../src/config/configuration';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisProviderModule } from '../src/common/redis/redis.provider';
import { DatabaseModule } from '../src/common/database.module';

describe('Khadamat API (e2e)', () => {
  let app: INestApplication<App>;
  let testDb: TestDatabaseService;
  let testUtils: TestUtils;
  let testData: any;

  beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = 'file:./prisma/test.db';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, databaseConfig, jwtConfig, redisConfig, emailConfig, paymentConfig, uploadConfig, loginLockoutConfig],
          envFilePath: '.env',
        }),
        DatabaseModule,
        ThrottlerModule.forRoot({
          throttlers: [
            { name: 'default', ttl: 60000, limit: 200 },
            { name: 'auth', ttl: 60000, limit: 5, blockDuration: 900000 },
          ],
        }),
        RedisProviderModule,
        AuthModule,
        UsersModule,
        BookingsModule,
        HealthModule,
        ProModule,
      ],
    }).overrideProvider('PrismaService')
      .useClass(TestDatabaseService)
      .overrideProvider(RedisCacheService)
      .useValue(mockRedisCacheService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

    testDb = new TestDatabaseService();
    testUtils = new TestUtils(app, testDb);

    await app.init();

    // Clean and seed database
    await testDb.cleanDatabase();
    testData = await testDb.seedTestData();
  });

  afterAll(async () => {
    await testDb.$disconnect();
    await app.close();
  });

  afterEach(async () => {
    // Clean database after each test
    await testDb.cleanDatabase();
    testData = await testDb.seedTestData();
  });

  describe('Health Check', () => {
    it('/health (GET) - should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
        });
    });
  });

  describe('User Registration', () => {
    describe('Client Registration', () => {
      it('should register a new client successfully', async () => {
        const clientData = {
          email: 'client@example.com',
          phone: '+212600000001',
          password: 'password123',
          role: 'client',
          firstName: 'John',
          lastName: 'Doe',
        };

        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(clientData)
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('email', clientData.email);
        expect(response.body).toHaveProperty('roles');
        expect(JSON.parse(response.body.roles)).toContain('client');
        expect(response.body).toHaveProperty('isEmailVerified', false);
      });

      it('should fail registration with invalid email', async () => {
        const invalidData = {
          email: 'invalid-email',
          phone: '+212600000002',
          password: 'password123',
          role: 'client',
          firstName: 'John',
          lastName: 'Doe',
        };

        await request(app.getHttpServer())
          .post('/auth/signup')
          .send(invalidData)
          .expect(400);
      });

      it('should fail registration with duplicate email', async () => {
        const clientData = {
          email: 'duplicate@example.com',
          phone: '+212600000003',
          password: 'password123',
          role: 'client',
          firstName: 'John',
          lastName: 'Doe',
        };

        // First registration
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send(clientData)
          .expect(201);

        // Duplicate registration
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send(clientData)
          .expect(409); // Conflict
      });
    });

    describe('Pro Registration', () => {
      it('should register a new pro successfully', async () => {
        const proData = {
          email: 'pro@example.com',
          phone: '+212600000004',
          password: 'password123',
          role: 'pro',
          firstName: 'Jane',
          lastName: 'Smith',
          profession: 'Plumber',
          bio: 'Professional plumber with 5 years experience',
        };

        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(proData)
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('email', proData.email);
        expect(response.body).toHaveProperty('roles');
        expect(JSON.parse(response.body.roles)).toContain('pro');
        expect(response.body).toHaveProperty('isEmailVerified', false);
      });

      it('should register pro without optional bio', async () => {
        const proData = {
          email: 'pro2@example.com',
          phone: '+212600000005',
          password: 'password123',
          role: 'pro',
          firstName: 'Bob',
          lastName: 'Johnson',
          profession: 'Electrician',
        };

        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(proData)
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(JSON.parse(response.body.roles)).toContain('pro');
      });
    });
  });
  
  describe('Signup Endpoint Tests', () => {
    describe('Positive Tests', () => {
      it('POST /auth/register returns 201 with expected AuthResponse shape', async () => {
        const registerData = {
          email: 'register-test@example.com',
          password: 'Password123',
          role: 'CLIENT',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+212600000006',
        };
  
        const response = await request(app.getHttpServer())
          .post('/auth/register')
          .send(registerData)
          .expect(201);
  
        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).toHaveProperty('email', registerData.email);
        expect(response.body.user).toHaveProperty('role', 'CLIENT');
        expect(response.body.user).toHaveProperty('displayName', 'John Doe');
      });
  
      it('POST /auth/signup returns 201 with same shape (alias test)', async () => {
        const signupData = {
          email: 'signup-test@example.com',
          password: 'Password123',
          role: 'CLIENT',
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+212600000007',
        };
  
        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(signupData)
          .expect(201);
  
        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).toHaveProperty('email', signupData.email);
        expect(response.body.user).toHaveProperty('role', 'CLIENT');
        expect(response.body.user).toHaveProperty('displayName', 'Jane Smith');
      });
    });
  
    describe('Negative Tests', () => {
      it('should fail registration with invalid phone number => 400', async () => {
        const invalidPhoneData = {
          email: 'invalid-phone@example.com',
          password: 'Password123',
          role: 'CLIENT',
          firstName: 'John',
          lastName: 'Doe',
          phone: 'invalid-phone-number',
        };
  
        await request(app.getHttpServer())
          .post('/auth/register')
          .send(invalidPhoneData)
          .expect(400);
      });
  
      it('should fail registration with weak password => 400', async () => {
        const weakPasswordData = {
          email: 'weak-password@example.com',
          password: 'password', // Missing uppercase and digit
          role: 'CLIENT',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+212600000008',
        };
  
        await request(app.getHttpServer())
          .post('/auth/register')
          .send(weakPasswordData)
          .expect(400);
      });
  
      it('should fail registration with missing required fields => 400', async () => {
        const missingFieldsData = {
          email: 'missing-fields@example.com',
          password: 'Password123',
          role: 'CLIENT',
          // Missing firstName, lastName, phone
        };
  
        await request(app.getHttpServer())
          .post('/auth/register')
          .send(missingFieldsData)
          .expect(400);
      });
    });
  });
  
  describe('Authentication', () => {
    let testClient: any;
    let testPro: any;

    beforeEach(async () => {
      testClient = await testUtils.createTestClient();
      testPro = await testUtils.createTestPro();
    });

    describe('Login', () => {
      it('should login client successfully', async () => {
        const loginData = {
          emailOrPhone: testClient.credentials.email,
          password: testClient.credentials.password,
        };

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginData)
          .expect(200);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe(testClient.credentials.email);
      });

      it('should login pro successfully', async () => {
        const loginData = {
          emailOrPhone: testPro.credentials.email,
          password: testPro.credentials.password,
        };

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginData)
          .expect(200);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
        expect(response.body.user.email).toBe(testPro.credentials.email);
      });

      it('should fail login with wrong password', async () => {
        const loginData = {
          emailOrPhone: testClient.credentials.email,
          password: 'wrongpassword',
        };

        await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginData)
          .expect(401);
      });

      it('should fail login with non-existent user', async () => {
        const loginData = {
          emailOrPhone: 'nonexistent@example.com',
          password: 'password123',
        };

        await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginData)
          .expect(401);
      });
    });

    describe('Token Refresh', () => {
      it('should refresh access token', async () => {
        const loginResponse = await testUtils.loginUser(testClient.credentials);

        const refreshData = {
          refreshToken: loginResponse.refreshToken,
        };

        const response = await request(app.getHttpServer())
          .post('/auth/refresh')
          .send(refreshData)
          .expect(200);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
      });

      it('should fail refresh with invalid token', async () => {
        const refreshData = {
          refreshToken: 'invalid-token',
        };

        await request(app.getHttpServer())
          .post('/auth/refresh')
          .send(refreshData)
          .expect(401);
      });
    });
  
    describe('Pro Services Management', () => {
      let proToken: string;
      let otherProToken: string;
      let testPro: any;
      let otherPro: any;
      let serviceId: string;
  
      beforeEach(async () => {
        testPro = await testUtils.createTestPro();
        otherPro = await testUtils.createTestPro({
          email: `other-pro-${Date.now()}@example.com`,
          phone: '+212600000099',
        });
  
        const proLogin = await testUtils.loginUser(testPro.credentials);
        const otherProLogin = await testUtils.loginUser(otherPro.credentials);
  
        proToken = proLogin.accessToken;
        otherProToken = otherProLogin.accessToken;
  
        // Create a service for the pro
        const service = await testUtils.createTestProService(proToken, {
          serviceCategoryId: testData.categories.menageCategory.id,
          cityId: testData.cities.casablanca.id,
          basePrice: 150,
          description: 'Professional cleaning service',
        });
  
        serviceId = service.id;
      });
  
      describe('PUT /pro/services/:serviceId - Update Service isActive', () => {
        it('should allow pro to update service isActive to true', async () => {
          const updateData = {
            isActive: true,
          };
  
          const response = await testUtils.createAuthenticatedRequest(proToken)
            .put(`/pro/services/${serviceId}`)
            .send(updateData)
            .expect(200);
  
          expect(response.body).toHaveProperty('isActive', true);
          expect(response.body).toHaveProperty('id', serviceId);
        });
  
        it('should allow pro to update service isActive to false', async () => {
          const updateData = {
            isActive: false,
          };
  
          const response = await testUtils.createAuthenticatedRequest(proToken)
            .put(`/pro/services/${serviceId}`)
            .send(updateData)
            .expect(200);
  
          expect(response.body).toHaveProperty('isActive', false);
          expect(response.body).toHaveProperty('id', serviceId);
        });
  
        it('should reject invalid isActive type (string instead of boolean)', async () => {
          const updateData = {
            isActive: 'false', // Invalid: should be boolean
          };
  
          await testUtils.createAuthenticatedRequest(proToken)
            .put(`/pro/services/${serviceId}`)
            .send(updateData)
            .expect(400);
        });
  
        it('should reject update from different pro (authorization failure)', async () => {
          const updateData = {
            isActive: false,
          };
  
          await testUtils.createAuthenticatedRequest(otherProToken)
            .put(`/pro/services/${serviceId}`)
            .send(updateData)
            .expect(403); // Forbidden
        });
  
        it('should return 404 for non-existent service', async () => {
          const updateData = {
            isActive: true,
          };

          const fakeServiceId = '00000000-0000-0000-0000-000000000000';

          await testUtils.createAuthenticatedRequest(proToken)
            .put(`/pro/services/${fakeServiceId}`)
            .send(updateData)
            .expect(404);
        });
      });
    });
  });

  describe('Pro Services Update', () => {
    let proToken: string;
    let serviceId: string;

    beforeEach(async () => {
      const testPro = await testUtils.createTestPro();
      const proLogin = await testUtils.loginUser(testPro.credentials);
      proToken = proLogin.accessToken;

      const service = await testUtils.createTestProService(proToken, {
        serviceCategoryId: testData.categories.menageCategory.id,
        cityId: testData.cities.casablanca.id,
        basePrice: 150,
        description: 'Professional cleaning service',
      });

      serviceId = service.id;
    });

    it('should update service isActive to false (boolean)', async () => {
      const updateData = {
        isActive: false,
      };

      const response = await testUtils.createAuthenticatedRequest(proToken)
        .put(`/pro/services/${serviceId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('isActive', false);
      expect(response.body).toHaveProperty('id', serviceId);
    });

    it('should reject isActive as string "false"', async () => {
      const updateData = {
        isActive: "false",
      };

      await testUtils.createAuthenticatedRequest(proToken)
        .put(`/pro/services/${serviceId}`)
        .send(updateData)
        .expect(400);
    });
  });

  describe('Email Verification', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await testUtils.createTestUser();
    });

    it('should verify email with valid token', async () => {
      // Get verification token from database (in real scenario this would be sent via email)
      const user = await testDb.user.findUnique({
        where: { email: testUser.credentials.email },
      });

      expect(user).not.toBeNull();
      expect(user!.emailVerificationToken).not.toBeNull();

      const verifyData = {
        token: user!.emailVerificationToken,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/verify-email')
        .send(verifyData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('verified');

      // Check that user is now verified
      const updatedUser = await testDb.user.findUnique({
        where: { email: testUser.credentials.email },
      });
      expect(updatedUser).not.toBeNull();
      expect(updatedUser!.isEmailVerified).toBe(true);
    });

    it('should fail verification with invalid token', async () => {
      const verifyData = {
        token: 'invalid-token',
      };

      await request(app.getHttpServer())
        .post('/auth/verify-email')
        .send(verifyData)
        .expect(400);
    });

    it('should resend verification email', async () => {
      const resendData = {
        email: testUser.credentials.email,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/resend-verification')
        .send(resendData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Role-Based Access Control', () => {
    let clientToken: string;
    let proToken: string;
    let testClient: any;
    let testPro: any;

    beforeEach(async () => {
      testClient = await testUtils.createTestClient();
      testPro = await testUtils.createTestPro();

      const clientLogin = await testUtils.loginUser(testClient.credentials);
      const proLogin = await testUtils.loginUser(testPro.credentials);

      clientToken = clientLogin.accessToken;
      proToken = proLogin.accessToken;
    });

    describe('User Profile Access', () => {
      it('should allow client to access their own profile', async () => {
        const response = await testUtils.createAuthenticatedRequest(clientToken)
          .get('/user/profile')
          .expect(200);

        expect(response.body).toHaveProperty('email', testClient.credentials.email);
      });

      it('should allow pro to access their own profile', async () => {
        const response = await testUtils.createAuthenticatedRequest(proToken)
          .get('/user/profile')
          .expect(200);

        expect(response.body).toHaveProperty('email', testPro.credentials.email);
      });

      it('should fail access without authentication', async () => {
        await request(app.getHttpServer())
          .get('/user/profile')
          .expect(401);
      });
    });

    describe('Booking Access Control', () => {
      it('should allow client to create booking', async () => {
        const bookingData = {
          proId: testPro.user.id,
          serviceCategoryId: testData.categories.menageCategory.id,
          cityId: testData.cities.casablanca.id,
          description: 'Need house cleaning service',
        };

        const response = await testUtils.createAuthenticatedRequest(clientToken)
          .post('/bookings')
          .send(bookingData)
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('clientId', testClient.user.id);
        expect(response.body).toHaveProperty('proId', testPro.user.id);
      });

      it('should allow pro to view their bookings', async () => {
        // First create a booking as client
        const bookingData = {
          proId: testPro.user.id,
          serviceCategoryId: testData.categories.menageCategory.id,
          cityId: testData.cities.casablanca.id,
          description: 'Need house cleaning service',
        };

        await testUtils.createAuthenticatedRequest(clientToken)
          .post('/bookings')
          .send(bookingData)
          .expect(201);

        // Now pro should be able to see the booking
        const response = await testUtils.createAuthenticatedRequest(proToken)
          .get('/bookings')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });

      it('should allow pro to update booking status', async () => {
        // Create booking
        const bookingData = {
          proId: testPro.user.id,
          serviceCategoryId: testData.categories.menageCategory.id,
          cityId: testData.cities.casablanca.id,
          description: 'Need house cleaning service',
        };

        const bookingResponse = await testUtils.createAuthenticatedRequest(clientToken)
          .post('/bookings')
          .send(bookingData)
          .expect(201);

        const bookingId = bookingResponse.body.id;

        // Pro accepts the booking
        const updateData = {
          status: 'accepted',
        };

        const response = await testUtils.createAuthenticatedRequest(proToken)
          .put(`/bookings/${bookingId}/status`)
          .send(updateData)
          .expect(200);

        expect(response.body).toHaveProperty('status', 'accepted');
      });
    });
  });

  describe('Booking Management', () => {
    let clientToken: string;
    let proToken: string;
    let testClient: any;
    let testPro: any;
    let bookingId: string;

    beforeEach(async () => {
      testClient = await testUtils.createTestClient();
      testPro = await testUtils.createTestPro();

      const clientLogin = await testUtils.loginUser(testClient.credentials);
      const proLogin = await testUtils.loginUser(testPro.credentials);

      clientToken = clientLogin.accessToken;
      proToken = proLogin.accessToken;

      // Create a booking for testing
      const bookingData = {
        proId: testPro.user.id,
        serviceCategoryId: testData.categories.menageCategory.id,
        cityId: testData.cities.casablanca.id,
        description: 'Need house cleaning service',
      };

      const bookingResponse = await testUtils.createAuthenticatedRequest(clientToken)
        .post('/bookings')
        .send(bookingData)
        .expect(201);

      bookingId = bookingResponse.body.id;
    });

    it('should get user bookings', async () => {
      const response = await testUtils.createAuthenticatedRequest(clientToken)
        .get('/bookings')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id', bookingId);
    });

    it('should get specific booking details', async () => {
      const response = await testUtils.createAuthenticatedRequest(clientToken)
        .get(`/bookings/${bookingId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', bookingId);
      expect(response.body).toHaveProperty('description', 'Need house cleaning service');
    });

    it('should update booking status through workflow', async () => {
      // Pro accepts booking
      await testUtils.createAuthenticatedRequest(proToken)
        .put(`/bookings/${bookingId}/status`)
        .send({ status: 'accepted' })
        .expect(200);

      // Check status updated
      let booking = await testUtils.createAuthenticatedRequest(clientToken)
        .get(`/bookings/${bookingId}`)
        .expect(200);
      expect(booking.body.status).toBe('accepted');

      // Pro completes booking
      await testUtils.createAuthenticatedRequest(proToken)
        .put(`/bookings/${bookingId}/status`)
        .send({ status: 'completed' })
        .expect(200);

      // Check final status
      booking = await testUtils.createAuthenticatedRequest(clientToken)
        .get(`/bookings/${bookingId}`)
        .expect(200);
      expect(booking.body.status).toBe('completed');
    });

    it('should fail to access booking from different user', async () => {
      // Create another client
      const otherClient = await testUtils.createTestClient();
      const otherLogin = await testUtils.loginUser(otherClient.credentials);
      const otherToken = otherLogin.accessToken;

      // Try to access booking from different client
      await testUtils.createAuthenticatedRequest(otherToken)
        .get(`/bookings/${bookingId}`)
        .expect(403); // Forbidden
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors', async () => {
      const invalidData = {
        email: 'invalid-email',
        phone: 'invalid-phone',
        password: '123', // Too short
        role: 'invalid-role',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBe(true);
    });

    it('should handle 404 for non-existent routes', async () => {
      await request(app.getHttpServer())
        .get('/non-existent-route')
        .expect(404);
    });

    it('should handle malformed JSON', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .set('Content-Type', 'application/json')
        .send('{invalid json}')
        .expect(400);
    });
  });

  describe('Integration Tests', () => {
    let clientToken: string;
    let proToken: string;
    let testClient: any;
    let testPro: any;

    beforeEach(async () => {
      testClient = await testUtils.createTestClient();
      testPro = await testUtils.createTestPro();

      const clientLogin = await testUtils.loginUser(testClient.credentials);
      const proLogin = await testUtils.loginUser(testPro.credentials);

      clientToken = clientLogin.accessToken;
      proToken = proLogin.accessToken;
    });

    it('should complete full booking workflow', async () => {
      // 1. Client creates booking
      const bookingData = {
        proId: testPro.user.id,
        serviceCategoryId: testData.categories.menageCategory.id,
        cityId: testData.cities.casablanca.id,
        description: 'Need house cleaning service',
        timeSlot: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow on the hour
      };

      const bookingResponse = await testUtils.createAuthenticatedRequest(clientToken)
        .post('/bookings')
        .send(bookingData)
        .expect(201);

      const bookingId = bookingResponse.body.id;
      expect(bookingResponse.body.status).toBe('REQUESTED');

      // 2. Pro accepts booking
      await testUtils.createAuthenticatedRequest(proToken)
        .put(`/bookings/${bookingId}/status`)
        .send({ status: 'ACCEPTED' })
        .expect(200);

      // 3. Pro completes booking
      await testUtils.createAuthenticatedRequest(proToken)
        .put(`/bookings/${bookingId}/status`)
        .send({ status: 'COMPLETED' })
        .expect(200);

      // 4. Client can see completed booking
      const finalBooking = await testUtils.createAuthenticatedRequest(clientToken)
        .get(`/bookings/${bookingId}`)
        .expect(200);

      expect(finalBooking.body.status).toBe('COMPLETED');
      expect(finalBooking.body).toHaveProperty('timeSlot');
    });

    it('should handle booking rejection workflow', async () => {
      // Create booking
      const bookingData = {
        proId: testPro.user.id,
        serviceCategoryId: testData.categories.menageCategory.id,
        cityId: testData.cities.casablanca.id,
        description: 'Need house cleaning service',
        timeSlot: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      };

      const bookingResponse = await testUtils.createAuthenticatedRequest(clientToken)
        .post('/bookings')
        .send(bookingData)
        .expect(201);

      const bookingId = bookingResponse.body.id;

      // Pro rejects booking
      await testUtils.createAuthenticatedRequest(proToken)
        .put(`/bookings/${bookingId}/status`)
        .send({ status: 'DECLINED' })
        .expect(200);

      // Check final status
      const finalBooking = await testUtils.createAuthenticatedRequest(clientToken)
        .get(`/bookings/${bookingId}`)
        .expect(200);

      expect(finalBooking.body.status).toBe('DECLINED');
    });
  });
});
