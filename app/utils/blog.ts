import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { Marked } from 'marked';
import type { BlogPost } from '../types/BlogPost';
import { formatDate } from './index';

const BLOG_DIR = join(process.cwd(), 'app/_data/_blog');

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Body images link to the full-size file so a tap opens it larger
export const markdown = new Marked({
  renderer: {
    image({ href, text }) {
      const src = escapeAttr(href);
      return `<a href="${src}" class="post-image-link" target="_blank" rel="noopener"><img src="${src}" alt="${escapeAttr(text)}" loading="lazy"></a>`;
    },
  },
});

function coerceDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value !== 'string' || isNaN(new Date(value).getTime())) return '';
  return value;
}

function parsePost(slug: string, raw: string): BlogPost {
  const { data, content } = matter(raw);
  const isoDate = coerceDate(data.date);
  return {
    slug,
    title: (data.title as string) ?? '',
    summary: (data.summary as string) ?? '',
    description: markdown.parse(content) as string,
    date: formatDate(isoDate),
    isoDate,
    topic: (data.topic as string) ?? '',
    thumbnail: (data.thumbnail as string) ?? '',
  };
}

export async function readAllPosts(): Promise<BlogPost[]> {
  let files: string[];
  try {
    files = await readdir(BLOG_DIR);
  } catch {
    return [];
  }
  const results = await Promise.allSettled(
    files
      .filter(f => f.endsWith('.md'))
      .map(async filename => {
        const slug = filename.replace(/\.md$/, '');
        const raw = await readFile(join(BLOG_DIR, filename), 'utf-8');
        return parsePost(slug, raw);
      })
  );
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
