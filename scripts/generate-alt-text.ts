import galleryImages from "../src/data/gallery-images.json";

console.log("Generating alt text suggestions...");

// In a real scenario, this would call an AI API or update the JSON file.
// Here we output suggestions based on metadata.

galleryImages.forEach((img) => {
  const alt = `${img.title} - Fine art ${img.category} photography by Elena Vashchenko. ${img.caption}`;
  console.log(`ID: ${img.id}`);
  console.log(`Alt: ${alt}`);
  console.log("---");
});

console.log(`Generated alt text for ${galleryImages.length} images.`);
