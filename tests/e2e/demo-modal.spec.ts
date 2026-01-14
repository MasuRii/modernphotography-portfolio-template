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
    // Using simple locator visibility check on the dialog role or parent
    await expect(page.locator('#demo-modal-backdrop')).toBeVisible(); 
    await expect(modal).toBeVisible();
    
    // Check content
    await expect(page.locator('#demo-modal-title')).toHaveText('This is a Demo Site');
    await expect(page.locator('#demo-feature-name')).toContainText('Instagram Profile');
  });
});
