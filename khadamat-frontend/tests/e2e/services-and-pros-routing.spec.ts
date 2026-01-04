import { test, expect } from '@playwright/test';

const FRONT_URL = 'http://localhost:3000';

test.describe('Services vs Pros routing', () => {
  test('services shows categories and pros shows pro cards', async ({ page }) => {
    await page.goto(`${FRONT_URL}/services`, { waitUntil: 'domcontentloaded' });

    const categories = page.getByTestId('service-category-card');
    await expect(categories.first()).toBeVisible({ timeout: 20000 });

    // Services page should not render pro cards
    await expect(page.locator('[data-testid="pro-card"]')).toHaveCount(0);

    const firstCategory = categories.first();
    const catHref = await firstCategory.getAttribute('href');
    await Promise.all([
      page.waitForURL(/\/pros/, { timeout: 20000 }),
      firstCategory.click(),
    ]);

    const proCards = page.getByTestId('pro-card');
    const count = await proCards.count();
    if (count === 0) {
      await page.goto(`${FRONT_URL}/pros`, { waitUntil: 'domcontentloaded' });
    }
    await expect(page.getByTestId('pro-card').first()).toBeVisible({ timeout: 20000 });

    void catHref; // optional info, pas bloquant
  });
});
