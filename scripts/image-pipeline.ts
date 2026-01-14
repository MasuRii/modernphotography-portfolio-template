import sharp from "sharp";
import { readdir, mkdir, stat, writeFile } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { existsSync } from "node:fs";

const SOURCE_DIR = "src/assets/images/gallery";
const OUTPUT_DIR = "src/assets/images/optimized";
const DATA_DIR = "src/data";
const METADATA_FILE = "gallery-images.json";

const VARIANTS = [
  { name: "thumb", width: 320 },
  { name: "small", width: 640 },
  { name: "medium", width: 1024 },
  { name: "large", width: 1920 },
  { name: "xlarge", width: 2560 },
];

async function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function processImage(filename: string) {
  const inputPath = join(SOURCE_DIR, filename);
  const fileExt = extname(filename);
  const name = basename(filename, fileExt);
  
  // Create category subdirectory in output if implied, but for now flat or mirror source
  // Assuming source is flat for now based on description, or we handle subdirs?
  // 1.5.1 says "6 categories". Likely source has subdirs.
  // The script should probably walk subdirectories.
  
  // Let's assume flat for now or implement recursive walk. 
  // Given task 2.1.2 says "organized by category and size", let's assume source might have folders.
  // I will check if inputPath is a directory.
}

async function main() {
  console.log("Starting image processing pipeline...");
  
  await ensureDir(OUTPUT_DIR);
  await ensureDir(DATA_DIR);

  let processedCount = 0;
  const metadata: any[] = [];

  // Recursive walker
  async function walk(dir: string, category: string | null = null) {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subCategory = category ? `${category}/${entry.name}` : entry.name;
        await walk(fullPath, subCategory);
      } else if (entry.isFile() && /\.(jpg|jpeg|png|webp|tiff)$/i.test(entry.name)) {
        await processSingleImage(fullPath, entry.name, category || "uncategorized");
      }
    }
  }

  async function processSingleImage(inputPath: string, filename: string, category: string) {
    const fileExt = extname(filename);
    const name = basename(filename, fileExt);
    const categoryDir = join(OUTPUT_DIR, category);
    
    await ensureDir(categoryDir);

    console.log(`Processing: ${category}/${filename}`);
    const image = sharp(inputPath);
    const metadataRaw = await image.metadata();

    // 1. Generate Metadata entry
    const imageMeta = {
      id: `${category}-${name}`,
      category,
      filename,
      originalWidth: metadataRaw.width,
      originalHeight: metadataRaw.height,
      aspectRatio: (metadataRaw.width || 1) / (metadataRaw.height || 1),
      exif: {
        // Basic placeholder, real extraction would need 'exif-reader' or sharp's metadata
        // sharp provides some exif data if present
      },
      formats: ["avif", "webp", "jpg"],
      variants: VARIANTS.map(v => v.width)
    };
    metadata.push(imageMeta);

    // 2. Generate LQIP
    const lqipBuffer = await image
      .clone()
      .resize(20)
      .blur(10)
      .toBuffer();
    // In a real app we might save this to JSON or a file. Plan says src/data/lqip-data.json
    // But for now let's just output logic. 
    // Wait, task 2.1.6 says "output base64 data URLs to src/data/lqip-data.json".
    // I should collect this.
    (imageMeta as any).lqip = `data:image/${metadataRaw.format};base64,${lqipBuffer.toString('base64')}`;

    // 3. Generate Variants
    for (const variant of VARIANTS) {
      // Don't upscale if original is smaller? Or just let sharp handle it (it usually upscales).
      // Strategy says generate all.
      
      // AVIF
      await image
        .clone()
        .resize(variant.width)
        .avif({ quality: 80, effort: 4 })
        .toFile(join(categoryDir, `${name}-${variant.name}.avif`));

      // WebP
      await image
        .clone()
        .resize(variant.width)
        .webp({ quality: 80 })
        .toFile(join(categoryDir, `${name}-${variant.name}.webp`));

      // JPG (Fallback)
      await image
        .clone()
        .resize(variant.width)
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(join(categoryDir, `${name}-${variant.name}.jpg`));
    }
    
    processedCount++;
  }

  // Start processing
  if (existsSync(SOURCE_DIR)) {
      await walk(SOURCE_DIR);
  } else {
      console.warn(`Source directory ${SOURCE_DIR} not found. Skipping processing.`);
  }

  // Write metadata
  await writeFile(join(DATA_DIR, METADATA_FILE), JSON.stringify(metadata, null, 2));
  console.log(`Processed ${processedCount} images.`);
  console.log(`Metadata saved to ${join(DATA_DIR, METADATA_FILE)}`);
}

main().catch(console.error);
