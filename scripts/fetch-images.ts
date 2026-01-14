import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { write } from "bun";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const TARGET_DIR = "src/assets/images/gallery";
const CATEGORIES = [
  "portraits",
  "landscapes",
  "street-photography", // 'street' might be ambiguous, using specific tag
  "events",
  "editorial",
  "architecture"
];
const IMAGES_PER_CATEGORY = 10;

if (!UNSPLASH_ACCESS_KEY) {
  console.error("❌ UNSPLASH_ACCESS_KEY is missing in .env");
  process.exit(1);
}

// Ensure target directory exists
await mkdir(TARGET_DIR, { recursive: true });

async function downloadImage(url: string, filepath: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  const blob = await response.blob();
  await write(filepath, blob);
}

async function fetchCategory(category: string) {
  console.log(`📸 Fetching images for category: ${category}...`);
  const endpoint = `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}&query=${category}&count=${IMAGES_PER_CATEGORY}&orientation=landscape`;
  
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Rate limit exceeded or invalid key");
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const images = Array.isArray(data) ? data : [data];

    for (const [index, img] of images.entries()) {
      const url = img.urls.raw + '&q=80&w=2000'; // Request decent quality
      const filename = `${category}-${index + 1}.jpg`;
      const filepath = join(TARGET_DIR, filename);
      
      console.log(`   ⬇️ Downloading ${filename}...`);
      await downloadImage(url, filepath);
    }
    console.log(`✅ Completed category: ${category}`);
  } catch (error) {
    console.error(`❌ Error fetching ${category}:`, error);
  }
}

async function main() {
  console.log("🚀 Starting image acquisition from Unsplash...");
  
  for (const category of CATEGORIES) {
    await fetchCategory(category);
    // Add a small delay to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log("✨ All downloads completed!");
}

main();
