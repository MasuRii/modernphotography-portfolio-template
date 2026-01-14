import { readdir, mkdir, writeFile } from "node:fs/promises";
import { join, parse, extname } from "node:path";
import sharp from "sharp";

const SRC_DIR = "src/assets/images/gallery";
const OUT_FILE = "src/data/lqip-data.json";

async function main() {
  try {
    const files = await readdir(SRC_DIR);
    console.log(`Processing ${files.length} files for LQIP...`);
    
    const lqipData: Record<string, string> = {};

    for (const file of files) {
        const ext = extname(file).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;

        const filepath = join(SRC_DIR, file);
        const { name } = parse(file);

        try {
            const buffer = await sharp(filepath)
                .resize(20) // Very small
                .blur(5) // Gaussian blur
                .webp({ quality: 20 })
                .toBuffer();
            
            lqipData[name] = `data:image/webp;base64,${buffer.toString('base64')}`;
            console.log(`  Generated LQIP for ${file}`);
        } catch (err) {
            console.warn(`  Failed to generate LQIP for ${file}:`, err);
        }
    }

    // Ensure output dir exists
    await mkdir("src/data", { recursive: true });
    await writeFile(OUT_FILE, JSON.stringify(lqipData, null, 2));
    console.log(`LQIP data written to ${OUT_FILE}`);

  } catch (error) {
     if ((error as any).code === 'ENOENT') {
        console.log(`Source directory ${SRC_DIR} not found. Run fetch-images.ts first.`);
    } else {
        console.error("Error generating LQIP:", error);
        process.exit(1);
    }
  }
}

main();
