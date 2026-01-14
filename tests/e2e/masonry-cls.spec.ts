import { test, expect } from "@playwright/test";

test.describe("Masonry Grid Visual Stability", () => {
  // Use a category that is known to have images (from previous 'ls' output: portraits, landscapes)
  const category = "portraits";

  test("should load masonry layout with minimal Cumulative Layout Shift (CLS)", async ({
    page,
  }) => {
    // 1. Navigate to the page
    await page.goto(`/gallery/${category}`);

    // 2. Inject PerformanceObserver to track CLS
    // We do this immediately to catch initial load shifts
    await page.evaluate(() => {
      // @ts-expect-error - Custom property on window
      window.clsScore = 0;

      try {
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            // @ts-expect-error - hadRecentInput not in standard types yet
            if (!entry.hadRecentInput) {
              // @ts-expect-error - value exists on LayoutShift
              window.clsScore += entry.value;
            }
          }
        }).observe({ type: "layout-shift", buffered: true });
      } catch {
        console.error("PerformanceObserver not supported in this browser");
      }
    });

    // 3. Wait for content to stabilize
    // Wait for the masonry items to appear
    await page.locator(".masonry-item").first().waitFor({ state: "visible", timeout: 10000 });

    // 4. Scroll interaction to trigger any lazy-loading related shifts
    await page.evaluate(async () => {
      // Smooth scroll to bottom
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      // Wait a bit
      await new Promise((r) => setTimeout(r, 1000));
      // Scroll back up
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Wait for animations/transitions to settle
    await page.waitForTimeout(1000);

    // 5. Retrieve CLS score
    // @ts-expect-error - Custom property on window
    const cls = await page.evaluate(() => window.clsScore);

    console.log(`Measured CLS for ${category}: ${cls}`);

    // 6. Assert CLS is within acceptable threshold (0.1 is Good, 0.25 is Needs Improvement)
    // Given this is a complex masonry layout, 0.1 is the target.
    // However, in headless environments without full GPU rendering, sometimes minor shifts occur.
    // We'll stick to 0.1 as the strict goal.
    expect(cls).toBeLessThanOrEqual(0.1);
  });

  test("images should have explicit width and height attributes to prevent CLS", async ({
    page,
  }) => {
    await page.goto(`/gallery/${category}`);
    await page.waitForLoadState("domcontentloaded");

    const images = page.locator(".masonry-item img.main-image");
    const count = await images.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);

      // Astro's <Image /> component should set these attributes
      // Even if they are style-overridden to be responsive, the attributes help browser reserve ratio.
      await expect(img).toHaveAttribute("width");
      await expect(img).toHaveAttribute("height");
    }
  });
});
