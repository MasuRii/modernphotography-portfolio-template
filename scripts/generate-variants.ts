import { readdir, mkdir } from "node:fs/promises";
import { join, parse, extname } from "node:path";
import sharp from "sharp";

const SRC_DIR = "src/assets/images/gallery";
const OUT_DIR = "src/assets/images/optimized";
const WIDTHS = [320, 640, 1024, 1920];

// Ensure output directory exists
await mkdir(OUT_DIR, { recursive: true });

async function processImage(filename: string) {
  const filepath = join(SRC_DIR, filename);
  const ext = extname(filename).toLowerCase();
  
  // Skip non-image files
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

  const { name } = parse(filename);
  console.log(`Processing ${filename}...`);

  const image = sharp(filepath);
  let metadata;
  try {
    metadata = await image.metadata();
  } catch (err) {
    console.warn(`  Could not read metadata for ${filename}, skipping.`);
    return;
  }

  // Organize by category if filename starts with category
  // Filename format from fetch-images.ts: category-index.jpg
  const category = name.split('-')[0]; 
  const categoryDir = join(OUT_DIR, category);
  await mkdir(categoryDir, { recursive: true });

  for (const width of WIDTHS) {
    // If original is smaller than target width, we might want to skip or upscale. 
    // Usually for optimized sets, we skip if it's significantly smaller, but let's just resize to be safe or skip.
    // Here we'll skip if original is smaller to save space/time.
    if (metadata.width && metadata.width < width) {
        // console.log(`  Skipping ${width}w (original smaller)`);
        continue;
    }

    const outPath = join(categoryDir, `${name}-${width}w.webp`);
    
    await image
      .clone()
      .resize(width)
      .webp({ quality: 80 })
      .toFile(outPath);
      
    console.log(`  Generated ${width}w WebP`);
  }
}

async function main() {
  try {
    const files = await readdir(SRC_DIR);
    console.log(`Found ${files.length} files in ${SRC_DIR}`);

    for (const file of files) {
      await processImage(file);
    }
    console.log("Variant generation complete!");
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
        console.log(`Source directory ${SRC_DIR} not found. Run fetch-images.ts first.`);
    } else {
        console.error("Error processing images:", error);
        process.exit(1);
    }
  }
}

main();
