import { test, expect, APIRequestContext } from '@playwright/test';

const FRONT_URL = process.env.FRONT_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'http://localhost:4000/api';

const CLIENT_EMAIL = 'jean.client@test.com';
const PRO_EMAIL = 'pro.youssef@test.com';
const PASSWORD = 'password123';

async function loginAndGetToken(request: APIRequestContext, identifier: string, password: string) {
  const res = await request.post(`${API_URL}/auth/login`, {
    data: { identifier, password },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  return body.access_token as string;
}

test.describe('MVP Gate - Booking lifecycle', () => {
  test('client books via UI, pro accepts/completes via API, client can review; second accept same slot returns 409', async ({
    page,
    request,
  }) => {
    // Instrumentation to debug network/errors during the flow
    page.on('console', (msg) => console.log('[console]', msg.type(), msg.text()));
    page.on('pageerror', (err) => console.log('[pageerror]', err.message));
    page.on('request', (req) => {
      if (req.url().includes('bookings')) {
        console.log('[request]', req.method(), req.url());
      }
    });
    page.on('response', async (res) => {
      if (res.url().includes('bookings')) {
        console.log('[response]', res.status(), res.url());
      }
    });
    page.on('requestfailed', (req) => {
      if (req.url().includes('bookings')) {
        console.log('[requestfailed]', req.method(), req.url(), req.failure());
      }
    });

    // 1) Récupérer le pro cible via son compte (pour éviter mismatch après reset DB)
    const proToken = await loginAndGetToken(request, PRO_EMAIL, PASSWORD);
    const proProfileRes = await request.get(`${API_URL}/pro/profile`, {
      headers: { Authorization: `Bearer ${proToken}` },
    });
    expect(proProfileRes.ok()).toBeTruthy();
    const proProfile = await proProfileRes.json();
    const proUserId = proProfile?.user?.id || proProfile?.userId || proProfile?.id;
    const proProfileId = proProfile?.id;
    const primaryService = proProfile?.proServices?.[0];
    expect(proUserId).toBeTruthy();
    expect(proProfileId).toBeTruthy();
    expect(primaryService?.serviceCategoryId).toBeTruthy();
    const cityId = proProfile?.cityId || primaryService?.cityId;

    // 2) Login client via UI et créer une réservation (REQUESTED)
    await page.goto(`${FRONT_URL}/auth/login`);
    await page.getByPlaceholder(/exemple@email\.com/i).first().fill(CLIENT_EMAIL);
    await page.locator('input[type="password"]').first().fill(PASSWORD);
    const submitBtn = page.getByTestId('auth-submit');
    if (await submitBtn.count().then((c) => c > 0)) {
      await submitBtn.first().click();
    } else {
      await page.locator('button:has-text("Se connecter")').first().click();
    }
    await page.waitForURL('**/dashboard', { timeout: 60000 });

    // Aller sur la fiche pro et ouvrir le modal de réservation (ne pas attendre "load" sur Next.js dev)
    await page.goto(`${FRONT_URL}/pro/${proUserId}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    const bookBtn = page.getByText(/r[ée]server maintenant/i);
    await expect(bookBtn).toBeVisible({ timeout: 60000 });
    await bookBtn.scrollIntoViewIfNeeded();
    await bookBtn.click();

    // Vérifier que le bon modal (v2) est affiché
    const modalTitle = page.getByRole('heading', { name: /réserver ce service/i });
    await expect(modalTitle).toBeVisible({ timeout: 15000 });
    // Vérifier que les attributs E2E existent (probe) et que le dialog est visible
    const probe = page.locator('[data-e2e="modal-header-probe"]');
    await expect(probe).toBeVisible({ timeout: 10000 });
    const dialog = page.getByRole('dialog', { name: /réserver ce service/i });
    await expect(dialog).toBeVisible({ timeout: 10000 });

    // Choisir des créneaux uniques pour éviter les locks persistants d'un run à l'autre
    const now = Date.now();
    const slot = new Date(now + 6 * 60 * 60 * 1000 + (now % (2 * 60 * 60 * 1000))); // ~6-8h ahead, varie par run
    slot.setMinutes(0, 0, 0); // aligner sur 60 min
    const timeSlotLocal = slot.toISOString().slice(0, 16);

    const description = `Test booking ${Date.now()}`;
    await page.locator('input[type="datetime-local"]').first().fill(timeSlotLocal);
    await page.locator('textarea').first().fill(description);

    const submitButton = page.getByTestId('booking-submit');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    await submitButton.click({ trial: true });

    const handlerLog = page.waitForEvent('console', {
      predicate: (msg) => msg.text().includes('submit handler triggered'),
      timeout: 10000,
    });

    const [postReq] = await Promise.all([
      page.waitForRequest(
        (req) =>
          req.method() === 'POST' &&
          req.url().toLowerCase().includes('bookings'),
        { timeout: 30000 },
      ),
      handlerLog,
      submitButton.click(),
    ]);
    const postRes = await postReq.response();
    expect(postRes, 'POST /bookings response').toBeTruthy();
    const postStatus = postRes!.status();
    const postBody = await postRes!.json().catch(() => ({}));
    console.log('POST /bookings status', postStatus, 'url', postRes!.url(), 'body', postBody);
    expect(postStatus).toBeGreaterThanOrEqual(200);
    expect(postStatus).toBeLessThan(500);
    expect(postBody.status).toBe('REQUESTED');
    const bookingId: string = postBody.id;

    // 3) API tokens
    const proToken2 = await loginAndGetToken(request, PRO_EMAIL, PASSWORD);
    const clientToken = await loginAndGetToken(request, CLIENT_EMAIL, PASSWORD);

    // 2b) API invalid proUserId guard (use client token already fetched)
    const invalidPayload = {
      proUserId: proProfileId, // profile id is invalid for booking
      serviceCategoryId: primaryService.serviceCategoryId,
      cityId,
      timeSlot: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      description: 'Invalid proUserId test',
    };
    const invalidResp = await request.post(`${API_URL}/bookings`, {
      headers: { Authorization: `Bearer ${clientToken}` },
      data: invalidPayload,
    });
    const invalidStatus = invalidResp.status();
    const invalidBody = await invalidResp.json().catch(() => ({}));
    console.log('Invalid proUserId booking status', invalidStatus, 'body', invalidBody);
    expect([400, 404]).toContain(invalidStatus);

    // 4) Pro accepte puis complète via API (anti double-booking testé plus bas)
    const acceptResp = await request.patch(`${API_URL}/bookings/${bookingId}/status`, {
      headers: { Authorization: `Bearer ${proToken2}` },
      data: { status: 'ACCEPTED' },
    });
    const acceptBody = await acceptResp.json().catch(() => ({}));
    console.log('PATCH accept status', acceptResp.status(), 'body', acceptBody);
    expect(acceptResp.ok()).toBeTruthy();

    const completeResp = await request.patch(`${API_URL}/bookings/${bookingId}/status`, {
      headers: { Authorization: `Bearer ${proToken2}` },
      data: { status: 'COMPLETED' },
    });
    const completeBody = await completeResp.json().catch(() => ({}));
    console.log('PATCH complete status', completeResp.status(), 'body', completeBody);
    expect(completeResp.ok()).toBeTruthy();

    // 5) Client laisse un avis via API (gating COMPLETED)
    const reviewResp = await request.post(`${API_URL}/reviews/bookings/${bookingId}/review`, {
      headers: { Authorization: `Bearer ${clientToken}` },
      data: { rating: 5, comment: 'Service impeccable (test e2e)' },
    });
    expect(reviewResp.ok()).toBeTruthy();

    // 6) Conflit 409 : deux bookings même créneau, un seul ACCEPTED
    // Scénario de conflit : utiliser un créneau encore plus loin pour éviter tout lock existant
    const slotConflict = new Date(slot.getTime() + 6 * 60 * 60 * 1000);
    slotConflict.setMinutes(0, 0, 0);
    const isoSlot = slotConflict.toISOString();
    const bookingPayload = {
      // Booking.proId pointe vers l'utilisateur PRO, pas le profil
      proId: proUserId,
      serviceCategoryId: primaryService.serviceCategoryId,
      cityId,
      description: `Conflict test ${Date.now()}`,
      timeSlot: isoSlot,
    };

    const firstConflict = await request.post(`${API_URL}/bookings`, {
      headers: { Authorization: `Bearer ${clientToken}` },
      data: bookingPayload,
    });
    const firstStatus = firstConflict.status();
    let firstBooking: any = {};
    try {
      firstBooking = await firstConflict.json();
    } catch {}
    console.log('Conflict booking A status', firstStatus, 'body', firstBooking);
    expect(firstConflict.ok()).toBeTruthy();

    const secondConflict = await request.post(`${API_URL}/bookings`, {
      headers: { Authorization: `Bearer ${clientToken}` },
      data: { ...bookingPayload, description: `${bookingPayload.description} bis` },
    });
    const secondStatus = secondConflict.status();
    let secondBooking: any = {};
    try {
      secondBooking = await secondConflict.json();
    } catch {}
    console.log('Conflict booking B status', secondStatus, 'body', secondBooking);
    expect(secondConflict.ok()).toBeTruthy();

    // Accept first -> OK
    const acceptFirst = await request.patch(`${API_URL}/bookings/${firstBooking.id}/status`, {
      headers: { Authorization: `Bearer ${proToken2}` },
      data: { status: 'ACCEPTED' },
    });
    expect(acceptFirst.ok()).toBeTruthy();

    // Accept second -> 409 attendu
    const acceptSecond = await request.patch(`${API_URL}/bookings/${secondBooking.id}/status`, {
      headers: { Authorization: `Bearer ${proToken2}` },
      data: { status: 'ACCEPTED' },
    });
    expect(acceptSecond.status()).toBe(409);
  });
});
