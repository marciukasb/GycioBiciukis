const INLINE_IMAGE = /!\[[^\]]*\]\(([^)\s]+)[^)]*\)/g;

// Photos from the gallery that aren't already placed in the text (same rule as Marksman)
export function galleryOutsideBody(photos: string[], bodyMarkdown: string): string[] {
  const inline = new Set(Array.from(bodyMarkdown.matchAll(INLINE_IMAGE), m => m[1]));
  return photos.filter(url => !inline.has(url));
}
