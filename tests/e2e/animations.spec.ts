import { test, expect } from "@playwright/test";

test.describe("Animations", () => {
  test("Gallery items fade in on scroll", async ({ page }) => {
    await page.goto("/gallery/portraits");

    const item = page.locator(".masonry-item").first();

    // It should eventually become visible
    await expect(item).not.toHaveClass(/opacity-0/, { timeout: 10000 });
    await expect(item).toBeVisible();
  });

  test("Reduced motion disables stagger delay", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/gallery/portraits");

    const item = page.locator(".masonry-item").nth(1); // 2nd item

    // Wait for observer to fire
    await expect(item).toBeVisible();

    // Check delay
    const delay = await item.evaluate((el) => el.style.transitionDelay);
    expect(delay).toBe("");
  });
});
