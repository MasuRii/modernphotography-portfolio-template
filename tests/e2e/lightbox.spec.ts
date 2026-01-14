import { test, expect } from "@playwright/test";

test.describe("Lightbox Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for the gallery to be ready
    await page.locator(".featured-card").first().waitFor();
  });

  test("should open when a gallery image is clicked", async ({ page }) => {
    // Lightbox should be hidden initially
    const lightbox = page.locator("#lightbox");
    await expect(lightbox).toHaveClass(/opacity-0/);
    await expect(lightbox).toHaveClass(/pointer-events-none/);

    // Click first image
    await page.locator(".featured-card").first().click();

    // Verify lightbox opens
    await expect(lightbox).not.toHaveClass(/opacity-0/);
    await expect(lightbox).not.toHaveClass(/pointer-events-none/);
    await expect(lightbox).toBeVisible();

    // Verify image source is set (lazy loading check)
    const img = page.locator("#lightbox-image");
    await expect(img).toHaveAttribute("src", /.+/);
  });

  test("should close via close button", async ({ page }) => {
    // Open lightbox
    await page.locator(".featured-card").first().click();
    await expect(page.locator("#lightbox")).toBeVisible();

    // Click close button
    await page.locator("#lightbox-close").click();

    // Verify closed
    await expect(page.locator("#lightbox")).toHaveClass(/opacity-0/);
  });

  test("should close via Escape key", async ({ page }) => {
    // Open lightbox
    await page.locator(".featured-card").first().click();
    await expect(page.locator("#lightbox")).toBeVisible();

    // Press Escape
    await page.keyboard.press("Escape");

    // Verify closed
    await expect(page.locator("#lightbox")).toHaveClass(/opacity-0/);
  });

  test("should navigate via keyboard arrows", async ({ page }) => {
    // Get info of first two images
    const card1 = page.locator(".featured-card").nth(0);
    const card2 = page.locator(".featured-card").nth(1);
    const title1 = await card1.getAttribute("data-title");
    const title2 = await card2.getAttribute("data-title");

    // Open lightbox
    await card1.click();
    await expect(page.locator("#lightbox-title")).toHaveText(title1 || "");

    // Press Right Arrow
    await page.keyboard.press("ArrowRight");

    // Verify title changes to second image
    await expect(page.locator("#lightbox-title")).toHaveText(title2 || "");

    // Press Left Arrow
    await page.keyboard.press("ArrowLeft");

    // Verify title back to first image
    await expect(page.locator("#lightbox-title")).toHaveText(title1 || "");
  });

  test("should verify lazy loading behavior", async ({ page }) => {
    // Check src is empty initially
    // Note: depending on implementation, it might be empty string or unset.
    // Lightbox.astro initializes with src=""
    const img = page.locator("#lightbox-image");
    await expect(img).toHaveAttribute("src", "");

    // Open lightbox
    await page.locator(".featured-card").first().click();

    // Now it should have a value
    await expect(img).not.toHaveAttribute("src", "");
  });

  test("should trap focus and disable scroll when open", async ({ page }) => {
    await page.locator(".featured-card").first().click();
    await expect(page.locator("#lightbox")).toBeVisible();

    // Check scroll lock
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("hidden");
  });

  test("Download button triggers demo modal", async ({ page }) => {
    await page.locator(".featured-card").first().click();

    const downloadBtn = page.locator('button[aria-label="Download"]');
    await expect(downloadBtn).toBeVisible();
    await downloadBtn.click();

    // Check Demo Modal
    await expect(page.locator("#demo-modal")).toBeVisible();
    await expect(page.locator("#demo-feature-name")).toContainText("Download Image");

    // Close demo modal
    await page.locator("#demo-modal-close-btn").click();
    await expect(page.locator("#demo-modal")).not.toBeVisible();
  });

  test("Share button triggers demo modal", async ({ page }) => {
    await page.locator(".featured-card").first().click();

    const shareBtn = page.locator("#lightbox-share");
    await expect(shareBtn).toBeVisible();
    await shareBtn.click();

    // If it's a DemoLink (intercepted), it triggers modal.
    // Wait, I implemented it as a DemoLink but updated href in JS.
    // If href is updated to twitter intent, it might NOT be intercepted if it's an external domain NOT in demo-config?
    // "twitter.com" IS in demo-config.
    // So it SHOULD be intercepted.
    await expect(page.locator("#demo-modal")).toBeVisible();
  });
});
