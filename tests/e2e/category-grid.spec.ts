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

  test('should show hover effects on desktop', async ({ page, isMobile }) => {
    // Skip hover tests on mobile/touch devices where hover interaction is different
    if (isMobile) return;

    const card = page.locator('.category-card').first();
    const content = card.locator('.card-content');
    const viewIcon = card.locator('h3 span').last(); // The icon wrapper is the second span

    // 1. Initial State
    // View icon should be hidden initially (opacity 0)
    await expect(viewIcon).toHaveCSS('opacity', '0');
    // Transform should be default (or no inline style)
    await expect(content).not.toHaveAttribute('style', /rotate/);

    // 2. Hover State
    await card.hover();

    // Verify View Icon becomes visible
    // Note: It has a transition delay, but toHaveCSS retries automatically
    await expect(viewIcon).toHaveCSS('opacity', '1');

    // 3. Tilt Effect (Mouse Movement)
    // Move mouse to top-left quadrant of the card to trigger specific rotation
    const box = await card.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.25);
      
      // Verify inline style is applied (tilt effect)
      // We check for the presence of perspective and rotate in the style attribute
      await expect(content).toHaveAttribute('style', /perspective\(1000px\)/);
      await expect(content).toHaveAttribute('style', /rotateX/);
      await expect(content).toHaveAttribute('style', /rotateY/);
    }
  });
});
