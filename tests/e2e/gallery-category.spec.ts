import { test, expect } from "@playwright/test";

const categories = [
  "portraits",
  "landscapes",
  "street-photography",
  "events",
  "editorial",
  "architecture",
];

test.describe("Gallery Category Pages", () => {
  for (const category of categories) {
    test(`should load ${category} gallery correctly`, async ({ page }) => {
      await page.goto(`/gallery/${category}`);

      // Verify Title
      // The page logic capitalizes only the first letter: category.charAt(0).toUpperCase() + category.slice(1)
      const expectedTitle = category.charAt(0).toUpperCase() + category.slice(1);
      // Use getByRole to avoid matching Astro Dev Toolbar elements
      await expect(page.getByRole("heading", { name: expectedTitle, level: 1 })).toBeVisible();

      // Verify Grid exists OR Empty State exists
      // Note: MasonryGrid uses columns-1 md:columns-2 lg:columns-3
      const grid = page.locator(".columns-1").first();
      const emptyState = page.getByText("No images found in this category yet.");

      if (await emptyState.isVisible()) {
        await expect(emptyState).toBeVisible();
      } else {
        await expect(grid).toBeVisible();

        // Verify images are present if grid is visible
        // We check for .masonry-item class which wrap the images
        const items = page.locator(".masonry-item");
        await expect(items.first()).toBeVisible();
        await expect(items).not.toHaveCount(0);
      }
    });
  }
});
