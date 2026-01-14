import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import galleryImages from "../src/data/gallery-images.json";
import sharp from "sharp";

console.log("Generating placeholders...");

for (const img of galleryImages) {
  const path = join("src/assets", img.src);
  await mkdir(dirname(path), { recursive: true });

  const file = Bun.file(path);
  if (!(await file.exists())) {
    console.log(`Creating ${path}...`);
    try {
      await sharp({
        create: {
          width: 600,
          height: 800,
          channels: 3,
          background: { r: 30, g: 30, b: 30 },
        },
      })
        .composite([
          {
            input: Buffer.from(
              `<svg width="600" height="800" xmlns="http://www.w3.org/2000/svg">
                    <text x="50%" y="50%" font-size="40" fill="white" text-anchor="middle" font-family="sans-serif">${img.title}</text>
                </svg>`
            ),
            gravity: "center",
          },
        ])
        .jpeg()
        .toFile(path);
    } catch (e) {
      console.error(`Failed to create placeholder for ${path}`, e);
    }
  }
}

console.log("Done.");
