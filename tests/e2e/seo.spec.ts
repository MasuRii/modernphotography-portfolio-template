import { test, expect } from "@playwright/test";

test.describe("SEO & Metadata", () => {
  test("Home page has correct meta tags", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Portfolio/); // "Modern Photography Portfolio"

    // OG
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /Portfolio/);

    // Canonical
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /localhost:4321/);
  });

  test("About page has Person schema", async ({ page }) => {
    await page.goto("/about");

    const script = page.locator('script[type="application/ld+json"]');
    const content = await script.textContent();
    const json = JSON.parse(content || "{}");

    expect(json["@type"]).toBe("Person");
    expect(json.name).toBe("Elena Vashchenko");
  });

  test("Gallery page has ImageGallery schema", async ({ page }) => {
    await page.goto("/gallery/portraits");

    const script = page.locator('script[type="application/ld+json"]');
    const content = await script.textContent();
    const json = JSON.parse(content || "{}");

    expect(json["@type"]).toBe("ImageGallery");
    expect(json.image.length).toBeGreaterThan(0);
    expect(json.image[0]["@type"]).toBe("ImageObject");
  });
});
