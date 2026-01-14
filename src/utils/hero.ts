import type { ImageMetadata } from 'astro';
import galleryImages from '../data/gallery-images.json';

export async function getHeroSlides() {
  const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/gallery/*.{jpeg,jpg,png,gif}');
  const featuredItems = galleryImages.filter(item => item.featured).slice(0, 5);

  const slides = await Promise.all(featuredItems.map(async (item) => {
    const imagePath = `/src/assets/images/gallery/${item.id}.jpg`;
    const imageImport = images[imagePath];
    if (!imageImport) return null;
    const img = await imageImport();
    return {
      ...item,
      image: img.default
    };
  }));

  return slides.filter((s): s is NonNullable<typeof s> => s !== null);
}
