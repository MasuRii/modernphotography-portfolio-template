import { execSync } from "child_process";

console.log("🚀 Starting deployment process...");

try {
  console.log("📦 Building project...");
  execSync("bun run build", { stdio: "inherit" });

  console.log("✅ Build successful!");
  console.log("📂 Output directory: dist/");
  console.log("📝 Ready to deploy to Vercel/Netlify.");
  console.log('👉 Run "vercel deploy" or configure git integration.');
} catch (error) {
  console.error("❌ Deployment preparation failed:", error);
  process.exit(1);
}
