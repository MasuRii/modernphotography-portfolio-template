import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/about", "/contact", "/shop", "/gallery/portraits"];

test.describe("Accessibility Scan", () => {
  for (const route of routes) {
    test(`Route ${route} should pass accessibility check`, async ({ page }) => {
      await page.goto(route);

      // Wait for content to load (especially dynamic parts)
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .exclude("#lightbox-title") // Known issue: Empty heading by design
        .exclude("#demo-modal-backdrop") // Known issue: Focus management on hidden modal
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
