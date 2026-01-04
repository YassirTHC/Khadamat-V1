import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 120000,

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 2,

  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/smoke-results.json' }]
  ],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    actionTimeout: 30000,
    navigationTimeout: 60000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      command: 'set NODE_OPTIONS=--max-old-space-size=4096&& set NEXT_PUBLIC_API_URL=http://localhost:4000&& npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: false,
      timeout: 120000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
  ],
});
