import { test, expect } from '@playwright/test';

const FRONT_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:4000/api';
const CLIENT_EMAIL = 'jean.client@test.com';
const PASSWORD = 'password123';
const PRO_QUOTE_EMAIL = 'pro.quote@test.com';

async function loginUI(page, email: string, password: string) {
  await page.goto(`${FRONT_URL}/auth/login`);
  await page.getByTestId('auth-email').fill(email);
  await page.getByTestId('auth-password').fill(password);
  await page.getByTestId('auth-submit').click();
  await page.waitForURL('**/dashboard*', { timeout: 60000, waitUntil: 'domcontentloaded' });
}

async function getProQuoteUserId(request) {
  const loginRes = await request.post(`${API_URL}/auth/login`, {
    data: { identifier: PRO_QUOTE_EMAIL, password: PASSWORD },
  });
  expect(loginRes.status()).toBeLessThan(300);
  const token = (await loginRes.json()).access_token as string;

  const profileRes = await request.get(`${API_URL}/pro/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(profileRes.status()).toBe(200);
  const profile = await profileRes.json();
  return profile.userId || profile.user?.id || profile.id;
}

test.describe('Services QUOTE pricing flow', () => {
  test('client can view QUOTE service and create booking', async ({ page, request }) => {
    const proUserId = await getProQuoteUserId(request);

    await loginUI(page, CLIENT_EMAIL, PASSWORD);
    await page.goto(`${FRONT_URL}/pro/${proUserId}`, { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /services/i }).first()).toBeVisible();
    await expect(page.getByText(/prix sur devis/i).first()).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(/quote/i).first()).toBeVisible({ timeout: 20000 });

    // Open booking modal
    const bookBtn = page.getByText(/r[ée]server maintenant/i).first();
    await bookBtn.click();
    await expect(page.getByTestId('booking-modal-v2-root')).toBeVisible({ timeout: 20000 });

    // Fill slot + description
    const future = new Date(Date.now() + 4 * 60 * 60 * 1000);
    future.setMinutes(0, 0, 0);
    const iso = future.toISOString().slice(0, 16);
    await page.getByTestId('booking-timeslot').fill(iso);
    await page.getByTestId('booking-description').fill('Besoin devis peinture complete appartement.');

    const [resp] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/bookings') && r.request().method() === 'POST'),
      page.getByTestId('booking-submit').click(),
    ]);
    expect(resp.status()).toBeLessThan(300);
    const sentBody = JSON.parse(resp.request().postData() || '{}');
    expect(sentBody.pricingType).toBe('QUOTE');
    const body = await resp.json();
    expect(body.pricingType).toBe('QUOTE');
  });
});
