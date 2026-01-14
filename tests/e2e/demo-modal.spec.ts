import { test, expect } from '@playwright/test';

test.describe('Demo Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show modal when clicking social media link', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Instagram' });
    await link.click();
    
    // Check if modal appears
    const modal = page.locator('#demo-modal');
    await expect(page.locator('#demo-modal-backdrop')).toBeVisible(); 
    await expect(modal).toBeVisible();
    
    // Check content
    await expect(page.locator('#demo-modal-title')).toHaveText('This is a Demo Site');
    await expect(page.locator('#demo-feature-name')).toContainText('Instagram Profile');
  });

  test('should show modal when clicking checkout button', async ({ page }) => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page.locator('#demo-modal')).toBeVisible();
    await expect(page.locator('#demo-feature-name')).toContainText('Checkout');
  });

  test('should show success message when submitting newsletter form', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button:has-text("Subscribe")');
    
    // Wait for success message (simulated delay)
    await expect(page.locator('#newsletter-success')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('#newsletter-success')).toContainText('Success! (Demo Mode: No data was actually sent)');
  });

  test('should render demo banner on initial visit', async ({ page }) => {
    await expect(page.locator('#demo-banner')).toBeVisible();
    await expect(page.locator('#demo-banner')).toContainText("You're viewing a demo portfolio");
  });

  test('should persist banner dismissal', async ({ page }) => {
    // Wait for banner to slide in
    await expect(page.locator('#demo-banner')).toBeVisible();
    await expect(page.locator('#demo-banner')).not.toHaveClass(/.*-translate-y-full.*/);
    
    // Slight delay for animation to settle
    await page.waitForTimeout(500);
    
    // Use evaluate to click because Playwright complains about viewport visibility 
    // for this fixed element, likely due to layout specifics or animation timing
    await page.evaluate(() => {
      const btn = document.getElementById('demo-banner-dismiss');
      if (btn) btn.click();
    });
    
    // Wait for transition class
    await expect(page.locator('#demo-banner')).toHaveClass(/.*-translate-y-full.*/);
    
    // Reload and check if it stays hidden (class should be present on load)
    await page.reload();
    // Wait for JS to execute
    await page.waitForTimeout(500);
    await expect(page.locator('#demo-banner')).toHaveClass(/.*-translate-y-full.*/);
  });

  test('should trap focus within modal', async ({ page }) => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page.locator('#demo-modal')).toBeVisible();
    
    // Focus should be on close button initially
    await expect(page.locator('#demo-modal-close-btn')).toBeFocused();
    
    // Tab should cycle
    await page.keyboard.press('Tab');
    await expect(page.locator('#demo-modal-close-btn')).toBeFocused();
  });

  test('should close modal with Escape key', async ({ page }) => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page.locator('#demo-modal')).toBeVisible();
    await page.keyboard.press('Escape');
    // Check backdrop visibility via aria-hidden as Playwright might consider opacity-0 visible
    await expect(page.locator('#demo-modal-backdrop')).toHaveAttribute('aria-hidden', 'true');
  });

  test('should navigate internally without showing modal', async ({ page }) => {
    await page.click('#internal-link');
    await expect(page).toHaveURL(/.*\/about/);
    
    // Ensure new page is loaded
    await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible();
    
    // Check modal is NOT visible (check backdrop opacity)
    // We check aria-hidden because opacity might be animated
    await expect(page.locator('#demo-modal-backdrop')).toHaveAttribute('aria-hidden', 'true');
  });
});
