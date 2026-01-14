import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "http://localhost:4321",
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
});
