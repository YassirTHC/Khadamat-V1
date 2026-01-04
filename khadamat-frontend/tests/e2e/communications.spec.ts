import { test, expect, request as playwrightRequest } from '@playwright/test';

const CLIENT_EMAIL = process.env.E2E_CLIENT_EMAIL || 'jean.client@test.com';
const CLIENT_PASSWORD = process.env.E2E_CLIENT_PASSWORD || 'password123';
const API_URL = process.env.API_URL || 'http://localhost:4000';

async function loginAsClient(page) {
  await page.goto('/auth/login');
  await page.getByTestId('auth-email').fill(CLIENT_EMAIL);
  await page.getByTestId('auth-password').fill(CLIENT_PASSWORD);
  await page.getByTestId('auth-submit').click();
}

async function pickVerifiedPro() {
  console.log('Using API_URL for comms test:', API_URL);
  const api = await playwrightRequest.newContext({ baseURL: API_URL });
  const res = await api.get('/api/pros?verified=true&limit=1');
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to fetch pros: ${res.status()} ${text}`);
  }
  const data = await res.json();
  const pro =
    data.items?.[0] ||
    data.professionals?.[0] ||
    (Array.isArray(data) ? data[0] : null);
  if (!pro) throw new Error('No pro found for communications test');
  return {
    userId: pro.user?.id || pro.userId || pro.id,
    phone: pro.user?.phone || pro.phone,
  };
}

test('Contact WhatsApp deep link + trace', async ({ page }) => {
  const pro = await pickVerifiedPro();

  await loginAsClient(page);

  await page.goto(`/pro/${pro.userId}`, { waitUntil: 'domcontentloaded' });

  const contactButton = page.getByTestId('contact-whatsapp');
  await expect(contactButton).toBeVisible({ timeout: 30000 });
  const contactUrl = await contactButton.getAttribute('data-contact-url');
  expect(contactUrl).toContain('wa.me');
  expect(contactUrl).toContain(pro.phone?.replace(/\D/g, '')?.slice(-8) || '');

  const [resp] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes('/api/communication-events') &&
        response.request().method() === 'POST',
    ),
    contactButton.click(),
  ]);

  expect(resp.status()).toBe(201);
  const body = await resp.json();
  expect(body.channel).toBe('WHATSAPP');
});
