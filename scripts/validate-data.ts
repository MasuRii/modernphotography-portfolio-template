import { z } from "zod";
import galleryImages from "../src/data/gallery-images.json";
import socialLinks from "../src/data/social-links.json";
import printProducts from "../src/data/print-products.json";
import photographer from "../src/data/photographer.json";

const ImageSchema = z.object({
  id: z.string(),
  src: z.string(),
  category: z.string(),
  title: z.string(),
  caption: z.string(),
  featured: z.boolean(),
  printAvailable: z.boolean(),
  exif: z
    .object({
      camera: z.string(),
      lens: z.string(),
      iso: z.number(),
      aperture: z.string(),
      shutter: z.string(),
    })
    .optional(),
});

const SocialSchema = z.object({
  platform: z.string(),
  url: z.string().url(),
  icon: z.string(),
  label: z.string(),
});

const PrintProductSchema = z.object({
  sizes: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      multiplier: z.number(),
      basePrice: z.number(),
    })
  ),
  frames: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      price: z.number(),
    })
  ),
});

const PhotographerSchema = z.object({
  name: z.string(),
  title: z.string(),
  bio: z.string(),
  philosophy: z.string(),
  equipment: z.array(z.string()),
  awards: z.array(
    z.object({
      year: z.string(),
      title: z.string(),
      category: z.string(),
    })
  ),
  publications: z.array(
    z.object({
      title: z.string(),
      date: z.string(),
      url: z.string().url(),
    })
  ),
});

const validate = () => {
  try {
    console.log("Validating gallery-images.json...");
    z.array(ImageSchema).parse(galleryImages);
    console.log("✅ Gallery images valid.");

    console.log("Validating social-links.json...");
    z.array(SocialSchema).parse(socialLinks);
    console.log("✅ Social links valid.");

    console.log("Validating print-products.json...");
    PrintProductSchema.parse(printProducts);
    console.log("✅ Print products valid.");

    console.log("Validating photographer.json...");
    PhotographerSchema.parse(photographer);
    console.log("✅ Photographer profile valid.");
  } catch (e) {
    console.error("❌ Validation failed:", e);
    process.exit(1);
  }
};

validate();
