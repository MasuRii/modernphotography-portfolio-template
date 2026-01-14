import { test, expect } from '@playwright/test';

test('dev server starts and renders home page', async ({ page }) => {
  await page.goto('/');

  // Expect the title to contain "Modern Photography Portfolio"
  await expect(page).toHaveTitle(/Modern Photography Portfolio/);

  // Expect the h1 to contain "Astro Setup Complete"
  await expect(page.getByRole('heading', { name: 'Astro Setup Complete' })).toBeVisible();
});
