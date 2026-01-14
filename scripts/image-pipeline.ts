import sharp from "sharp";
import { readdir, mkdir, writeFile } from "node:fs/promises";
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

interface ImageMeta {
  id: string;
  category: string;
  filename: string;
  originalWidth: number | undefined;
  originalHeight: number | undefined;
  aspectRatio: number;
  exif: Record<string, unknown>;
  formats: string[];
  variants: number[];
  lqip?: string;
}

async function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function main() {
  console.log("Starting image processing pipeline...");
  
  await ensureDir(OUTPUT_DIR);
  await ensureDir(DATA_DIR);

  let processedCount = 0;
  const metadata: ImageMeta[] = [];

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
    const imageMeta: ImageMeta = {
      id: `${category}-${name}`,
      category,
      filename,
      originalWidth: metadataRaw.width,
      originalHeight: metadataRaw.height,
      aspectRatio: (metadataRaw.width || 1) / (metadataRaw.height || 1),
      exif: {
        // Basic placeholder
      },
      formats: ["avif", "webp", "jpg"],
      variants: VARIANTS.map(v => v.width)
    };
    

    // 2. Generate LQIP
    const lqipBuffer = await image
      .clone()
      .resize(20)
      .blur(10)
      .toBuffer();
    
    imageMeta.lqip = `data:image/${metadataRaw.format};base64,${lqipBuffer.toString('base64')}`;
    metadata.push(imageMeta);

    // 3. Generate Variants
    for (const variant of VARIANTS) {
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
