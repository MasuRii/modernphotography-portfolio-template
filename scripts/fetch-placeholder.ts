import { write } from "bun";
import { mkdir } from "node:fs/promises";

await mkdir("src/assets/images/gallery", { recursive: true });

console.log("Fetching placeholder image...");
const response = await fetch("https://picsum.photos/1920/1080");
const blob = await response.blob();
await write("src/assets/images/gallery/portraits-1.jpg", blob);
await write("src/assets/images/gallery/portraits-2.jpg", blob);
await write("src/assets/images/gallery/landscapes-1.jpg", blob);
console.log("Placeholders created.");
