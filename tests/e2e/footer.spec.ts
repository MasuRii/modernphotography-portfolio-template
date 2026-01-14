import { test, expect } from "@playwright/test";

test.describe("Footer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Dismiss banner
    const banner = page.locator("#demo-banner-dismiss");
    if (await banner.isVisible()) await banner.click();
  });

  test("Social links trigger demo modal", async ({ page }) => {
    // Check one social link
    const instagram = page.locator('footer a[aria-label="Follow on Instagram"]');
    await expect(instagram).toBeVisible();
    await instagram.click();

    // Check modal
    await expect(page.locator("#demo-modal")).toBeVisible();
    await expect(page.locator("#demo-feature-name")).toContainText("Instagram Profile");

    // Close modal
    await page.locator("#demo-modal-close-btn").click();
  });

  test("Newsletter signup works (demo)", async ({ page }) => {
    const input = page.locator('footer input[type="email"]');
    const button = page.locator('footer button[type="submit"]');

    await input.fill("test@example.com");
    await button.click();

    // Check status
    const status = page.locator(".newsletter-status");
    await expect(status).toBeVisible();
    await expect(status).toHaveText("Success! (Demo Mode: No data was actually sent).", {
      timeout: 5000,
    });
  });
});
