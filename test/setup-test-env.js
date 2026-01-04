// Test environment setup
require('dotenv').config({ path: '.env.test' });

// Set test-specific environment variables
process.env.NODE_ENV = 'test';
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./prisma/test.db';
}
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test_jwt_refresh_secret_key';

console.log('Test environment configured with:', {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3002
});

// Expose a flag to disable background jobs in test (used by booking expiration cron)
process.env.ENABLE_BOOKING_CRON = process.env.ENABLE_BOOKING_CRON || 'false';
