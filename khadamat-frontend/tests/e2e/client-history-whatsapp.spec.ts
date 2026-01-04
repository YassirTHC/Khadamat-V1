import { test, expect } from '@playwright/test';

const FRONT_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:4000/api';
const CLIENT_EMAIL = 'jean.client@test.com';
const PASSWORD = 'password123';
const PRO_VERIFIED_EMAIL = 'pro.verified@test.com';

async function loginUI(page, email: string, password: string) {
  await page.goto(`${FRONT_URL}/auth/login`);
  await page.getByTestId('auth-email').fill(email);
  await page.getByTestId('auth-password').fill(password);
  await page.getByTestId('auth-submit').click();
  await page.waitForURL('**/dashboard*', { timeout: 30000 });
}

async function getProUserId(request) {
  const loginRes = await request.post(`${API_URL}/auth/login`, {
    data: { identifier: PRO_VERIFIED_EMAIL, password: PASSWORD },
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

async function ensureBooking(request, proUserId: string) {
  const loginClient = await request.post(`${API_URL}/auth/login`, {
    data: { identifier: CLIENT_EMAIL, password: PASSWORD },
  });
  expect(loginClient.status()).toBeLessThan(300);
  const clientToken = (await loginClient.json()).access_token as string;

  const slot = new Date(Date.now() + 4 * 60 * 60 * 1000);
  slot.setMinutes(0, 0, 0);

  const createRes = await request.post(`${API_URL}/bookings`, {
    headers: { Authorization: `Bearer ${clientToken}` },
    data: {
      proUserId,
      serviceCategoryId: 'plomberie',
      cityId: 'casablanca',
      timeSlot: slot.toISOString(),
      description: 'Test booking for history WhatsApp CTA',
    },
  });
  expect(createRes.status()).toBeLessThan(300);
}

test.describe('Client history WhatsApp CTA', () => {
  test('history shows WhatsApp CTA and logs trace', async ({ page, request }) => {
    const proUserId = await getProUserId(request);
    await ensureBooking(request, proUserId);

    await loginUI(page, CLIENT_EMAIL, PASSWORD);
    await page.goto(`${FRONT_URL}/dashboard/client/history`, { waitUntil: 'domcontentloaded' });

    const waBtn = page.getByTestId('history-contact-whatsapp').first();
    await expect(waBtn).toBeVisible({ timeout: 20000 });
    await expect(waBtn).toBeEnabled();

    const href = await waBtn.getAttribute('data-contact-url');
    expect(href || '').toContain('wa.me');

    const [req] = await Promise.all([
      page.waitForRequest((r) => r.url().includes('/api/communication-events') && r.method() === 'POST'),
      waBtn.click(),
    ]);
    expect(req).toBeTruthy();
  });
});
