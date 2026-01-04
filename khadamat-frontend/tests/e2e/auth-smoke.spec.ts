import { test, expect } from '@playwright/test';

const CLIENT_EMAIL = process.env.E2E_CLIENT_EMAIL || 'jean.client@test.com';
const CLIENT_PASSWORD = process.env.E2E_CLIENT_PASSWORD || 'password123';

async function loginAsClient(page) {
  await page.goto('/auth/login');
  await page.getByTestId('auth-email').fill(CLIENT_EMAIL);
  await page.getByTestId('auth-password').fill(CLIENT_PASSWORD);
  await page.getByTestId('auth-submit').click();
}

test('auth smoke: login -> protected -> refresh -> logout', async ({ page }) => {
  await loginAsClient(page);

  // Accéder à une page protégée et vérifier la session
  await page.goto('/dashboard/client');
  await expect(page.getByTestId('dashboard-logout')).toBeVisible({ timeout: 30000 });

  // Simuler un refresh (reload)
  await page.reload();
  await expect(page.getByTestId('dashboard-logout')).toBeVisible({ timeout: 15000 });

  // Logout via le dashboard
  await page.getByTestId('dashboard-logout').click();

  // Vérifier déconnexion
  await expect(page.getByTestId('nav-login')).toBeVisible({ timeout: 10000 });
});
