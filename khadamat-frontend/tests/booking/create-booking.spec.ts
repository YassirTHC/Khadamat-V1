import { test, expect } from '@playwright/test';

test.describe('Bookings Tests @regression', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(180000);
  });

  test('Create a booking as client', async ({ page }) => {
    const timestamp = Date.now();
    const clientEmail = `booking-test-${timestamp}@test.com`;
    const password = 'Test123!@#';

    // Signup as client
    await page.goto('http://localhost:3001/auth/signup');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: /client/i }).click();
    await page.waitForTimeout(500);

    await page.getByTestId('register-firstname-input').fill('Test');
    await page.getByTestId('register-lastname-input').fill('Client');
    await page.getByTestId('register-email-input').fill(clientEmail);
    await page.getByTestId('register-password-input').fill(password);
    await page.getByTestId('register-password-confirm-input').fill(password);
    await page.getByTestId('register-phone-input').fill('+212600000000');

    await page.getByRole('button', { name: /crAcer mon compte/i }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Go to services page
    await page.goto('http://localhost:3001/services');
    await page.waitForLoadState('networkidle');

    // Click on first service
    const serviceCards = page.locator('[data-testid="service-card"]');
    await expect(serviceCards.first()).toBeVisible({ timeout: 10000 });
    await serviceCards.first().click();

    // Click book button
    const bookButton = page.getByRole('button', { name: /rAcserver/i });
    await expect(bookButton).toBeVisible({ timeout: 10000 });
    await bookButton.click();

    // Fill booking form - clean, deterministic approach
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const slotStr = tomorrow.toISOString().slice(0, 16);

    await page.getByTestId('booking-timeslot').fill(slotStr);
    await page.getByTestId('booking-description').fill('Test booking flow');

    // Submit booking
    await page.getByTestId('booking-submit').click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/dashboard/);
  });

  test('View booking history', async ({ page }) => {
    const timestamp = Date.now();
    const clientEmail = `history-test-${timestamp}@test.com`;
    const password = 'Test123!@#';

    // Signup and create booking
    await page.goto('http://localhost:3001/auth/signup');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: /client/i }).click();
    await page.waitForTimeout(500);

    await page.getByTestId('register-firstname-input').fill('Test');
    await page.getByTestId('register-lastname-input').fill('Client');
    await page.getByTestId('register-email-input').fill(clientEmail);
    await page.getByTestId('register-password-input').fill(password);
    await page.getByTestId('register-password-confirm-input').fill(password);
    await page.getByTestId('register-phone-input').fill('+212600000000');

    await page.getByRole('button', { name: /crAcer mon compte/i }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Create a booking
    await page.goto('http://localhost:3001/services');
    await page.waitForLoadState('networkidle');

    const serviceCards = page.locator('[data-testid="service-card"]');
    await expect(serviceCards.first()).toBeVisible({ timeout: 10000 });
    await serviceCards.first().click();

    const bookButton = page.getByRole('button', { name: /rAcserver/i });
    await expect(bookButton).toBeVisible({ timeout: 10000 });
    await bookButton.click();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const slotStr = tomorrow.toISOString().slice(0, 16);

    await page.getByTestId('booking-timeslot').fill(slotStr);
    await page.getByTestId('booking-description').fill('Test booking history');

    await page.getByTestId('booking-submit').click();
    await page.waitForTimeout(2000);

    // Go to booking history
    await page.goto('http://localhost:3001/dashboard/client/history');
    await page.waitForLoadState('networkidle');

    // Verify booking is visible in history
    await expect(page.locator('[data-testid="booking-card"]').first()).toBeVisible({ timeout: 10000 });
  });
});
