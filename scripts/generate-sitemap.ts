import { write } from "bun";
import galleryImages from "../src/data/gallery-images.json";

const BASE_URL = "http://localhost:4321"; // Update for production

const categories = [...new Set(galleryImages.map((img) => img.category))];

const pages = ["", "/about", "/shop", "/contact", ...categories.map((c) => `/gallery/${c}`)];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
    <url>
      <loc>${BASE_URL}${page}</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${page === "" ? "1.0" : "0.8"}</priority>
    </url>
  `
    )
    .join("")}
</urlset>`;

await write("public/sitemap.xml", sitemap);
console.log("Sitemap generated at public/sitemap.xml");
