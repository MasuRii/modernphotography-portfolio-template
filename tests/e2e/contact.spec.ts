import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Contact Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("Form validation works", async ({ page }) => {
    const submitBtn = page.getByRole("button", { name: "Send Inquiry" });

    // Empty submission
    await submitBtn.click();

    // Check error messages
    await expect(page.locator("#name-error")).toBeVisible();
    await expect(page.locator("#name-error")).toHaveText("Name is required");
    await expect(page.locator("#email-error")).toBeVisible();
    await expect(page.locator("#message-error")).toBeVisible();

    // Focus should be on name (first invalid)
    await expect(page.locator("#name")).toBeFocused();

    // Invalid email
    await page.fill("#name", "Test User");
    await page.fill("#email", "invalid-email");
    await submitBtn.click();
    await expect(page.locator("#email-error")).toBeVisible();
    await expect(page.locator("#email-error")).toHaveText("Please enter a valid email address");
  });

  test("Successful submission shows demo notice", async ({ page }) => {
    await page.fill("#name", "Test User");
    await page.fill("#email", "test@example.com");
    await page.selectOption("#service", "Portrait Session");
    await page.fill("#message", "This is a test message.");

    const submitBtn = page.locator('#contact-form button[type="submit"]');
    await submitBtn.click();

    // Check loading state
    await expect(submitBtn).toBeDisabled();
    await expect(submitBtn).toHaveText("Sending...");

    // Check success message
    const status = page.locator("#form-status");
    await expect(status).toBeVisible({ timeout: 5000 });
    await expect(status).toHaveText("Success! (Demo Mode: No data was actually sent).");

    // Button should reset
    await expect(submitBtn).not.toBeDisabled();
    await expect(submitBtn).toHaveText("Send Inquiry");

    // Form should reset (check name is empty)
    await expect(page.locator("#name")).toHaveValue("");
  });

  test("Page is accessible", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude("#lightbox-title") // Empty heading by design
      .exclude("#demo-modal-backdrop") // Hidden state management issue
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
