// Set only for the GitHub Pages preview, which serves the site from /GycioBiciukis/
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// Next adds the base path to links, but not to plain <img> and CSS urls; this does
export function assetPath(src: string, base = BASE_PATH): string {
  return base && src.startsWith('/') && !src.startsWith('//') ? `${base}${src}` : src;
}
