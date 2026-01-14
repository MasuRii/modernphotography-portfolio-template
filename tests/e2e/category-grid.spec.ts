import { test, expect } from '@playwright/test';

test.describe('Category Grid Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const categories = [
    { id: 'portraits', title: 'Portraits' },
    { id: 'landscapes', title: 'Landscapes' },
    { id: 'street-photography', title: 'Street' },
    { id: 'events', title: 'Events' },
    { id: 'editorial', title: 'Editorial' },
    { id: 'architecture', title: 'Architecture' },
  ];

  for (const category of categories) {
    test(`should navigate to ${category.title} gallery correctly`, async ({ page }) => {
      // Find the link for this category, ensuring we target the card specifically to avoid header/menu links
      const card = page.locator(`a.category-card[href="/gallery/${category.id}"]`);
      
      // Ensure it's visible
      await expect(card).toBeVisible();
      
      // Click it
      await card.click();
      
      // Verify URL
      await expect(page).toHaveURL(new RegExp(`/gallery/${category.id}$`));
      
      // Note: We don't verify 200 OK or content yet because the pages don't exist
      // The test passes if the client-side router (or browser) updates the URL correctly
    });
  }

  test('should have correct number of category cards', async ({ page }) => {
    const cards = page.locator('.category-card');
    await expect(cards).toHaveCount(6);
  });
});
