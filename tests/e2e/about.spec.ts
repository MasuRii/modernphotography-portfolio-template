import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const photographer = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "src/data/photographer.json"), "utf-8")
);

test.describe("About Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about");
  });

  test("Renders photographer details", async ({ page }) => {
    // Check main heading
    await expect(page.locator("h1", { hasText: photographer.name })).toBeVisible();

    // Check title
    await expect(page.locator("h2", { hasText: photographer.title })).toBeVisible();

    // Check bio (part of it)
    const bioSnippet = photographer.bio.split(".")[0];
    await expect(page.locator(`text=${bioSnippet}`)).toBeVisible();

    // Check philosophy
    await expect(page.locator("blockquote")).toContainText(photographer.philosophy);
  });

  test("Renders equipment list", async ({ page }) => {
    await expect(page.locator("h2", { hasText: "Equipment" })).toBeVisible();
    for (const item of photographer.equipment) {
      await expect(page.locator("li", { hasText: item })).toBeVisible();
    }
  });

  test("Renders awards list", async ({ page }) => {
    await expect(page.locator("h2", { hasText: "Awards" })).toBeVisible();
    for (const award of photographer.awards) {
      await expect(page.locator(`text=${award.title}`)).toBeVisible();
      await expect(page.locator(`text=${award.category}`)).toBeVisible();
    }
  });

  test("Renders publications list", async ({ page }) => {
    await expect(page.locator("h2", { hasText: "Publications" })).toBeVisible();
    for (const pub of photographer.publications) {
      await expect(page.locator(`text=${pub.title}`)).toBeVisible();
    }
  });

  test("Portrait image is visible", async ({ page }) => {
    const image = page.locator('img[alt="Photographer Portrait"]');
    await expect(image).toBeVisible();
  });

  test("External publication links trigger demo modal", async ({ page }) => {
    // Click on the first publication link (Kinfolk)
    const link = page.locator('a[href*="kinfolk.com"]');
    await expect(link).toBeVisible();
    await link.click();

    // Check modal visibility
    const modal = page.locator("#demo-modal");
    await expect(modal).toBeVisible();

    // Check modal content
    await expect(page.locator("#demo-feature-name")).toContainText("Publication: Kinfolk");

    // Close modal
    await page.locator("#demo-modal-close-btn").click();
    // Check backdrop hidden status as modal might just fade out
    await expect(page.locator("#demo-modal-backdrop")).toHaveAttribute("aria-hidden", "true");
  });
});
