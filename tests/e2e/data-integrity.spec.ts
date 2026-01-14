import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

// Load data manually to avoid import attributes issues if strict
const photographer = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "src/data/photographer.json"), "utf-8")
);
const socialLinks = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "src/data/social-links.json"), "utf-8")
);

test.describe("Data Integrity", () => {
  test("Photographer name matches JSON", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("main h1")).toHaveText(photographer.name);
  });

  test("Social links match JSON", async ({ page }) => {
    await page.goto("/");
    const firstLink = socialLinks[0];
    const linkEl = page.locator(`footer a[href="${firstLink.url}"]`);
    await expect(linkEl).toBeVisible();
  });
});
