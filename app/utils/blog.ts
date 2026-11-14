import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { Marked } from 'marked';
import type { BlogPost } from '../types/BlogPost';
import { formatDate } from './index';
import { galleryOutsideBody } from './photos';
import { assetPath } from './assetPath';

const BLOG_DIR = join(process.cwd(), 'app/_data/_blog');

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Body images link to the full-size file so a tap opens it larger
export const markdown = new Marked({
  renderer: {
    image({ href, text }) {
      const src = escapeAttr(assetPath(href));
      return `<a href="${src}" class="post-image-link" target="_blank" rel="noopener"><img src="${src}" alt="${escapeAttr(text)}" loading="lazy"></a>`;
    },
  },
});

function coerceDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value !== 'string' || isNaN(new Date(value).getTime())) return '';
  return value;
}

// YAML turns bare values like `title: 2025` into numbers; the site needs strings
const text = (value: unknown) => (value === undefined || value === null ? '' : String(value).trim());

function photoList(value: unknown): string[] {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return list.map(text).filter(Boolean);
}

function parsePost(slug: string, raw: string): BlogPost {
  // Passing options disables gray-matter's cache, which would otherwise return
  // empty data for a file whose front matter failed to parse the first time
  const { data, content } = matter(raw, {});
  const isoDate = coerceDate(data.date);
  const photos = photoList(data.photos);
  return {
    slug,
    title: text(data.title),
    summary: text(data.summary),
    description: markdown.parse(content) as string,
    date: formatDate(isoDate),
    isoDate,
    topic: text(data.topic),
    // The first gallery photo is the cover; older posts may still have a thumbnail field
    thumbnail: assetPath(photos[0] ?? text(data.thumbnail)),
    photos: photos.map(p => assetPath(p)),
    galleryPhotos: galleryOutsideBody(photos.slice(1), content).map(p => assetPath(p)),
  };
}

export async function readAllPosts(): Promise<BlogPost[]> {
  let files: string[];
  try {
    files = await readdir(BLOG_DIR);
  } catch {
    return [];
  }
  const markdownFiles = files.filter(f => f.endsWith('.md'));
  const results = await Promise.allSettled(
    markdownFiles
      .map(async filename => {
        const slug = filename.replace(/\.md$/, '');
        const raw = await readFile(join(BLOG_DIR, filename), 'utf-8');
        return parsePost(slug, raw);
      })
  );
  results.forEach((r, i) => {
    if (r.status === 'rejected') console.warn(`Skipping post ${markdownFiles[i]}:`, r.reason);
  });
  const posts = results
    .filter((r): r is PromiseFulfilledResult<BlogPost> => r.status === 'fulfilled')
    .map(r => r.value);
  // Newest first; undated posts go last
  return posts.sort((a, b) => b.isoDate.localeCompare(a.isoDate));
}

export async function readPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const raw = await readFile(join(BLOG_DIR, `${slug}.md`), 'utf-8');
    return parsePost(slug, raw);
  } catch {
    return null;
  }
}
