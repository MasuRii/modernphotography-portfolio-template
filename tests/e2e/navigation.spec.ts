import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Desktop navigation links are visible', async ({ page, isMobile }) => {
    if (isMobile) test.skip();
    
    const nav = page.locator('nav.hidden.md\\:flex');
    await expect(nav).toBeVisible();
    await expect(nav.locator('a', { hasText: 'Work' })).toBeVisible();
    await expect(nav.locator('a', { hasText: 'About' })).toBeVisible();
    await expect(nav.locator('a', { hasText: 'Shop' })).toBeVisible();
    await expect(nav.locator('a', { hasText: 'Contact' })).toBeVisible();
  });

  test('Mobile menu toggle works', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    
    const menuBtn = page.locator('#mobile-menu-btn');
    await expect(menuBtn).toBeVisible();
    
    // Open menu
    await menuBtn.click();
    const overlay = page.locator('#mobile-menu-overlay');
    await expect(overlay).toBeVisible();
    await expect(overlay).toHaveClass(/translate-x-0/);
    
    // Check links in mobile menu
    await expect(overlay.locator('a', { hasText: 'Work' })).toBeVisible();
    
    // Close menu by clicking a link (simulated)
    // Or toggle again? The button might be covered?
    // The button is in the header, z-40. Overlay is z-30. So button is clickable.
    await menuBtn.click();
    await expect(overlay).toHaveClass(/translate-x-full/);
  });

  test('Header hides on scroll down and shows on scroll up', async ({ page, isMobile }) => {
    // Determine height of page to allow scrolling
    // We might need to add content if the page is empty
    await page.evaluate(() => {
        document.body.style.height = '2000px';
    });

    const header = page.locator('#main-header');
    
    // Initial state can be none or matrix identity
    const transform = await header.evaluate(el => getComputedStyle(el).transform);
    expect(transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)').toBeTruthy();

    // Scroll down
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(500); // Wait for transition
    
    // Verify hidden (translateY(-100%))
    await expect(header).toHaveAttribute('style', /translateY\(-100%\)/);

    // Scroll up
    await page.mouse.wheel(0, -200);
    await page.waitForTimeout(500);
    await expect(header).toHaveAttribute('style', /translateY\(0(px)?\)/);
  });

  test('Hire Me CTA is persistent', async ({ page }) => {
    const cta = page.locator('text=Hire Me');
    await expect(cta).toBeVisible();
    
    // Check if fixed
    await expect(cta.locator('..')).toHaveClass(/fixed/);
  });
});
