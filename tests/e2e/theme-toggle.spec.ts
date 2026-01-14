import { test, expect } from '@playwright/test';

test.describe('Theme System', () => {
  // Set default system preference to dark to match the "Dark Mode Default" requirement
  test.use({ colorScheme: 'dark' });

  test.beforeEach(async ({ page }) => {
    // Dismiss demo banner to ensure nav is clickable
    await page.addInitScript(() => {
      localStorage.setItem('demo_banner_dismissed', 'true');
    });
    await page.goto('/');
  });

  test('should default to dark mode', async ({ page }) => {
    // Check html has class="dark"
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Check sun icon does NOT have hidden class
    await expect(page.locator('#theme-toggle-sun')).not.toHaveClass(/hidden/);
    await expect(page.locator('#theme-toggle-moon')).toHaveClass(/hidden/);
  });

  test('should toggle theme on click', async ({ page }) => {
    await page.evaluate(() => document.getElementById('theme-toggle')?.click());
    
    // Should be light mode now
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await expect(page.locator('#theme-toggle-sun')).toHaveClass(/hidden/);
    await expect(page.locator('#theme-toggle-moon')).not.toHaveClass(/hidden/);
    
    await page.evaluate(() => document.getElementById('theme-toggle')?.click());
    
    // Should be dark mode again
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should persist theme preference', async ({ page }) => {
    // Switch to light
    await page.evaluate(() => document.getElementById('theme-toggle')?.click());
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    
    // Reload
    await page.reload();
    
    // Should still be light
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test.describe('Light Mode System Preference', () => {
    test.use({ colorScheme: 'light' });
    
    test('should respect system preference if no storage', async ({ page }) => {
       // Since we cleared storage (new context) and system is light:
       // The init script should remove the 'dark' class.
       await expect(page.locator('html')).not.toHaveClass(/dark/);
    });
  });
});
