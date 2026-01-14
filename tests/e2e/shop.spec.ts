import { test, expect } from "@playwright/test";

test.describe("Print Shop", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/shop");
    // Dismiss demo banner if it obscures elements
    const banner = page.locator("#demo-banner-dismiss");
    if (await banner.isVisible()) {
      await banner.click();
    }
  });

  test("Page renders correctly", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Print Shop" })).toBeVisible();
    await expect(page.locator("text=Demo Shop — Purchases are simulated")).toBeVisible();

    // Check for products
    const cards = page.locator(".print-card");
    await expect(cards.first()).toBeVisible();
  });

  test("Product selection updates price", async ({ page }) => {
    const card = page.locator(".print-card").first();
    const price = card.locator(".price-display");
    const sizeSelect = card.locator(".size-select");

    // Get initial price (Small)
    const smallPriceText = await price.textContent();

    // Select Medium (index 1)
    await sizeSelect.selectOption({ index: 1 });

    // Check new price
    const mediumPriceText = await price.textContent();

    expect(mediumPriceText).not.toEqual(smallPriceText);

    // Should be higher (assuming > 1 multiplier)
    const smallPrice = parseFloat(smallPriceText?.replace("$", "") || "0");
    const mediumPrice = parseFloat(mediumPriceText?.replace("$", "") || "0");
    expect(mediumPrice).toBeGreaterThan(smallPrice);
  });

  test("Add to Cart triggers confirmation", async ({ page }) => {
    // Setup dialog handler
    let dialogMessage = "";
    page.on("dialog", (dialog) => {
      dialogMessage = dialog.message();
      dialog.accept();
    });

    const card = page.locator(".print-card").first();
    await card.locator("button", { hasText: "Add to Cart" }).click();

    // Wait for event loop to process
    await page.waitForTimeout(100);

    expect(dialogMessage).toContain("Added to cart");
  });

  test("Checkout icon triggers demo modal", async ({ page }) => {
    // There are two cart icons (desktop/mobile). Click the visible one.
    const cartIcon = page.locator('a[aria-label="Cart"]').locator("visible=true");
    await expect(cartIcon).toBeVisible();
    await cartIcon.click();

    // Verify modal
    await expect(page.locator("#demo-modal")).toBeVisible();
    await expect(page.locator("#demo-feature-name")).toContainText("Shop Checkout");

    // Close it
    await page.locator("#demo-modal-close-btn").click();
    await expect(page.locator("#demo-modal")).not.toBeVisible();
  });
});
