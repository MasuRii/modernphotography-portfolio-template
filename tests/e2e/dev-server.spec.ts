import { test, expect } from "@playwright/test";

test("dev server starts and renders home page", async ({ page }) => {
  await page.goto("/");

  // Expect the title to contain "Modern Photography Portfolio"
  await expect(page).toHaveTitle(/Modern Photography Portfolio/);

  // Expect the hero section or main content to be visible
  await expect(page.locator("main")).toBeVisible();
});
