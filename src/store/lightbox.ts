import { atom } from 'nanostores';

export interface LightboxImage {
  id: string;
  src: string;
  alt?: string;
  category?: string;
  title?: string;
  caption?: string;
}

export const isLightboxOpen = atom(false);
export const currentIndex = atom(0);
export const lightboxImages = atom<LightboxImage[]>([]);

export function openLightbox(images: LightboxImage[], index: number = 0) {
  lightboxImages.set(images);
  currentIndex.set(index);
  isLightboxOpen.set(true);
}

export function closeLightbox() {
  isLightboxOpen.set(false);
}

export function nextImage() {
  const index = currentIndex.get();
  const images = lightboxImages.get();
  if (images.length > 0) {
    currentIndex.set((index + 1) % images.length);
  }
}

export function prevImage() {
  const index = currentIndex.get();
  const images = lightboxImages.get();
  if (images.length > 0) {
    currentIndex.set((index - 1 + images.length) % images.length);
  }
}
