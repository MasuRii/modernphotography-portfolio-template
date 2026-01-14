import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { existsSync } from "node:fs";
import galleryImages from "../src/data/gallery-images.json";
import lqipDataRaw from "../src/data/lqip-data.json";

const TARGET_BASE = "src/assets/images/gallery";
const SOURCE_PORTRAIT = join(TARGET_BASE, "portraits-1.jpg");
const SOURCE_LANDSCAPE = join(TARGET_BASE, "landscapes-1.jpg");

async function main() {
  console.log("🎨 Filling dummy images and LQIP data...");

  // Ensure sources exist (if not in root, try subfolders)
  let portraitSource = SOURCE_PORTRAIT;
  let landscapeSource = SOURCE_LANDSCAPE;

  if (!existsSync(portraitSource)) {
    // Try subfolder
    const sub = join(TARGET_BASE, "portraits", "portraits-1.jpg");
    if (existsSync(sub)) {
      await copyFile(sub, portraitSource);
    } else {
      console.error("❌ Source portrait image not found!");
    }
  }

  if (!existsSync(landscapeSource)) {
    // Try subfolder
    const sub = join(TARGET_BASE, "landscapes", "landscapes-1.jpg");
    if (existsSync(sub)) {
      await copyFile(sub, landscapeSource);
    } else {
      console.error("❌ Source landscape image not found!");
    }
  }

  const newLqipData = { ...lqipDataRaw };
  let lqipSource = Object.values(lqipDataRaw)[0]; // Use first available LQIP as generic fallback

  for (const img of galleryImages) {
    // 1. Fill Image File
    // Expected path from JSON: "/images/gallery/category/id.jpg"
    // We map to: "src/assets/images/gallery/category/id.jpg" AND "src/assets/images/gallery/id.jpg"
    // (to cover both import patterns if they differ)

    // The previous analysis showed MasonryGrid looks in src/assets/images/gallery via glob recursive.
    // hero.ts looks in src/assets/images/gallery/*.jpg (root).

    // So we should put images in ROOT for hero.ts, and maybe subfolders for consistency?
    // Let's put them in ROOT as "id.jpg" AND in "category/id.jpg" to be safe.

    const rootPath = join(TARGET_BASE, `${img.id}.jpg`);
    const categoryDir = join(TARGET_BASE, img.category);
    const subPath = join(categoryDir, `${img.id}.jpg`);

    await mkdir(categoryDir, { recursive: true });

    const source =
      img.category === "landscapes" ||
      img.category === "architecture" ||
      img.category === "street-photography"
        ? landscapeSource
        : portraitSource;

    if (existsSync(source)) {
      if (!existsSync(rootPath)) {
        await copyFile(source, rootPath);
        console.log(`   Created root: ${img.id}.jpg`);
      }
      if (!existsSync(subPath)) {
        await copyFile(source, subPath);
        console.log(`   Created sub: ${img.category}/${img.id}.jpg`);
      }
    }

    // 2. Fill LQIP Data
    if (!newLqipData[img.id]) {
      newLqipData[img.id] = lqipSource;
    }
  }

  // Write updated LQIP data
  await writeFile("src/data/lqip-data.json", JSON.stringify(newLqipData, null, 2));
  console.log("✅ LQIP data updated.");
  console.log("✨ Dummy data fill complete!");
}

main().catch(console.error);
