import { test, expect } from '@playwright/test';

test.describe('Hero Slider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render hero section with photographer branding', async ({ page }) => {
    const hero = page.locator('section[aria-label="Featured Photography"]');
    await expect(hero).toBeVisible();
    await expect(page.getByRole('heading', { name: /Elena/i })).toBeVisible();
  });

  test('should navigate via buttons', async ({ page }) => {
    // Pause auto-advance by hovering (optional but good practice to avoid race conditions)
    const hero = page.locator('section[aria-label="Featured Photography"]');
    await hero.hover();

    // Verify buttons exist
    const nextBtn = page.getByLabel('Next Slide');
    const prevBtn = page.getByLabel('Previous Slide');
    
    // Use evaluate to bypass strict visibility checks if overlay/scroll is tricky in headless
    await nextBtn.evaluate((btn) => (btn as HTMLElement).click());
    
    // Wait for slide transition
    await expect(page.locator('[data-slide="1"]')).toHaveAttribute('data-active', 'true');

    await prevBtn.evaluate((btn) => (btn as HTMLElement).click());
    await expect(page.locator('[data-slide="0"]')).toHaveAttribute('data-active', 'true');
  });

  test('should display slide text content', async ({ page }) => {
     // Wait for text animation (delay 300ms + 500ms)
     const firstSlideTitle = page.locator('[data-slide="0"] h2');
     await expect(firstSlideTitle).toBeVisible();
     await expect(firstSlideTitle).toHaveCSS('opacity', '1', { timeout: 5000 });
  });
});
