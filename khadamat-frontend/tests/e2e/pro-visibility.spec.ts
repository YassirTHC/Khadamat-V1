import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const PENDING_EMAIL = 'pro.pending@test.com';
const VERIFIED_EMAIL = 'pro.verified@test.com';
const PASSWORD = 'password123';

async function login(page, email: string, password: string) {
  await page.goto(`${BASE_URL}/auth/login`);
  await page.getByTestId('auth-email').fill(email);
  await page.getByTestId('auth-password').fill(password);
  await page.getByTestId('auth-submit').click();
  await page.waitForURL('**/dashboard*', { timeout: 30000 });
}

test.describe('Pro visibility (Verified/Premium gating)', () => {
  test('pending pro sees missing fields and premium is blocked', async ({ page }) => {
    await login(page, PENDING_EMAIL, PASSWORD);
    await page.goto(`${BASE_URL}/dashboard/pro`);

    await expect(page.getByTestId('pro-missing-fields')).toBeVisible({ timeout: 20000 });
    const missing = await page.getByTestId('pro-missing-fields').textContent();
    expect(missing || '').toMatch(/téléphone|cgu|service/i);

    const upgradeBtn = page.getByTestId('pro-upgrade-premium');
    await expect(upgradeBtn).toBeDisabled();
    const badgeText = (await page.getByTestId('pro-badge-verified').textContent()) || '';
    expect(badgeText.toLowerCase()).toContain('non');
  });

  test('verified pro can upgrade to premium (or already premium)', async ({ page }) => {
    await login(page, VERIFIED_EMAIL, PASSWORD);
    await page.goto(`${BASE_URL}/dashboard/pro`);

    const upgradeBtn = page.getByTestId('pro-upgrade-premium');
    const premiumBadge = page.getByTestId('pro-badge-premium');

    const badgeText = await premiumBadge.textContent();
    if (badgeText?.toLowerCase().includes('premium actif')) {
      await expect(premiumBadge).toContainText(/premium actif/i);
      return;
    }

    await expect(upgradeBtn).toBeEnabled({ timeout: 20000 });
    await upgradeBtn.click();
    await expect(premiumBadge).toContainText(/premium actif/i, { timeout: 20000 });
  });
});
