import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Site and base are configured at build time for GitHub Pages deployment
  // via CLI flags: --site and --base (see .github/workflows/deploy.yml)
  // For local development, defaults work out of the box
  site: process.env.SITE || "http://localhost:4321",
  output: "static",
  build: {
    // Ensure assets use relative paths for GitHub Pages subpath compatibility
    assets: "_astro",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
