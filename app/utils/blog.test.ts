import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fs/promises so tests don't touch the real filesystem
vi.mock('fs/promises', () => ({
  readdir: vi.fn(),
  readFile: vi.fn(),
}));

import { readdir, readFile } from 'fs/promises';
import { readAllPosts, readPostBySlug } from './blog';

const SAMPLE_MD = `---
title: "Hello World"
summary: "A test post"
topic: "Tech"
date: "2026-01-15"
thumbnail: "/images/test.png"
---

Post body here.
`;

const SAMPLE_MD_2 = `---
title: "Older Post"
summary: "An older post"
topic: "News"
date: "2025-06-01"
thumbnail: "/images/old.png"
---

Older body.
`;

const UNDATED_MD = `---
title: "Be datos"
summary: "No date"
topic: "Žinios"
---

Body.
`;

const IMAGE_MD = `---
title: "Su nuotrauka"
date: "2026-02-01"
---

![Avilys](/images/a.jpg)
`;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('readAllPosts', () => {
  it('returns empty array when no markdown files exist', async () => {
    vi.mocked(readdir).mockResolvedValue([] as any);
    const posts = await readAllPosts();
    expect(posts).toEqual([]);
  });

  it('parses frontmatter fields correctly', async () => {
    vi.mocked(readdir).mockResolvedValue(['hello-world.md'] as any);
    vi.mocked(readFile).mockResolvedValue(SAMPLE_MD as any);
    const posts = await readAllPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe('hello-world');
    expect(posts[0].title).toBe('Hello World');
    expect(posts[0].summary).toBe('A test post');
    expect(posts[0].topic).toBe('Tech');
    expect(posts[0].thumbnail).toBe('/images/test.png');
  });

  it('sorts posts by date descending (newest first)', async () => {
    vi.mocked(readdir).mockResolvedValue(['older-post.md', 'hello-world.md'] as any);
    vi.mocked(readFile)
      .mockResolvedValueOnce(SAMPLE_MD_2 as any)
      .mockResolvedValueOnce(SAMPLE_MD as any);
    const posts = await readAllPosts();
    expect(posts[0].slug).toBe('hello-world'); // 2026 > 2025
    expect(posts[1].slug).toBe('older-post');
  });

  it('formats date to human-readable string', async () => {
    vi.mocked(readdir).mockResolvedValue(['hello-world.md'] as any);
    vi.mocked(readFile).mockResolvedValue(SAMPLE_MD as any);
    const posts = await readAllPosts();
    expect(posts[0].date).toBe('2026 m. sausio 15 d.');
  });

  it('ignores non-markdown files', async () => {
    vi.mocked(readdir).mockResolvedValue(['hello-world.md', 'README.txt', '.DS_Store'] as any);
    vi.mocked(readFile).mockResolvedValue(SAMPLE_MD as any);
    const posts = await readAllPosts();
    expect(posts).toHaveLength(1);
  });

  it('skips files with malformed frontmatter without crashing', async () => {
    vi.mocked(readdir).mockResolvedValue(['good.md', 'bad.md'] as any);
    vi.mocked(readFile)
      .mockResolvedValueOnce(SAMPLE_MD as any)
      .mockRejectedValueOnce(new Error('ENOENT'));
    const posts = await readAllPosts();
    expect(posts).toHaveLength(1);
  });

  it('exposes isoDate', async () => {
    vi.mocked(readdir).mockResolvedValue(['hello-world.md'] as any);
    vi.mocked(readFile).mockResolvedValue(SAMPLE_MD as any);
    const posts = await readAllPosts();
    expect(posts[0].isoDate).toBe('2026-01-15');
  });

  it('sorts undated posts last without crashing', async () => {
    vi.mocked(readdir).mockResolvedValue(['undated.md', 'older-post.md', 'hello-world.md'] as any);
    vi.mocked(readFile)
      .mockResolvedValueOnce(UNDATED_MD as any)
      .mockResolvedValueOnce(SAMPLE_MD_2 as any)
      .mockResolvedValueOnce(SAMPLE_MD as any);
    const posts = await readAllPosts();
    expect(posts.map(p => p.slug)).toEqual(['hello-world', 'older-post', 'undated']);
    expect(posts[2].date).toBe('');
    expect(posts[2].isoDate).toBe('');
  });

  it('wraps body images in a link to the full image', async () => {
    vi.mocked(readdir).mockResolvedValue(['images.md'] as any);
    vi.mocked(readFile).mockResolvedValue(IMAGE_MD as any);
    const posts = await readAllPosts();
    expect(posts[0].description).toContain('<a href="/images/a.jpg" class="post-image-link"');
    expect(posts[0].description).toContain('<img src="/images/a.jpg" alt="Avilys" loading="lazy"');
  });

  it('converts markdown body to HTML', async () => {
    vi.mocked(readdir).mockResolvedValue(['hello-world.md'] as any);
    vi.mocked(readFile).mockResolvedValue(SAMPLE_MD as any);
    const posts = await readAllPosts();
    expect(posts[0].description).toContain('<p>');
  });
});

describe('front matter edge cases', () => {
  it('keeps a title that is only a number as a string', async () => {
    vi.mocked(readdir).mockResolvedValue(['skaicius.md'] as any);
    vi.mocked(readFile).mockResolvedValue('---\ntitle: 2025\nsummary: 42\ndate: "2026-01-01"\n---\n\nT\n' as any);
    const posts = await readAllPosts();
    expect(posts[0].title).toBe('2025');
    expect(posts[0].summary).toBe('42');
  });

  it('skips a post with broken front matter every time it is read', async () => {
    const BROKEN = '---\ntitle: - Blogas\n  yaml: [\n---\n\nT\n';
    vi.mocked(readdir).mockResolvedValue(['blogas.md'] as any);
    vi.mocked(readFile).mockResolvedValue(BROKEN as any);
    expect(await readAllPosts()).toEqual([]);
    expect(await readAllPosts()).toEqual([]);
  });
});

describe('photos', () => {
  const read = async (frontMatter: string, body = 'T') => {
    vi.mocked(readdir).mockResolvedValue(['p.md'] as any);
    vi.mocked(readFile).mockResolvedValue(`---\n${frontMatter}\n---\n\n${body}\n` as any);
    return (await readAllPosts())[0];
  };

  it('has no photos, thumbnail or gallery when none are given', async () => {
    const post = await read('title: A');
    expect(post).toMatchObject({ photos: [], thumbnail: '', galleryPhotos: [] });
  });

  it('uses the only photo as the cover', async () => {
    const post = await read('photos:\n  - /images/a.jpg');
    expect(post).toMatchObject({ photos: ['/images/a.jpg'], thumbnail: '/images/a.jpg', galleryPhotos: [] });
  });

  it('puts photos after the cover that are not in the text into the gallery', async () => {
    const post = await read('photos:\n  - /images/a.jpg\n  - /images/b.jpg\n  - /images/c.jpg', '![](/images/b.jpg)');
    expect(post.galleryPhotos).toEqual(['/images/c.jpg']);
  });

  it('still supports a legacy thumbnail field', async () => {
    const post = await read('thumbnail: /images/t.jpg');
    expect(post).toMatchObject({ photos: [], thumbnail: '/images/t.jpg' });
  });

  it('treats a single photos string as a one-item list', async () => {
    const post = await read('photos: /images/a.jpg');
    expect(post.photos).toEqual(['/images/a.jpg']);
  });
});

describe('readPostBySlug', () => {
  it('returns null when file does not exist', async () => {
    vi.mocked(readFile).mockRejectedValue(new Error('ENOENT'));
    const post = await readPostBySlug('nonexistent');
    expect(post).toBeNull();
  });

  it('returns a parsed post for a valid slug', async () => {
    vi.mocked(readFile).mockResolvedValue(SAMPLE_MD as any);
    const post = await readPostBySlug('hello-world');
    expect(post).not.toBeNull();
    expect(post!.slug).toBe('hello-world');
    expect(post!.title).toBe('Hello World');
  });

  it('converts markdown body to HTML', async () => {
    vi.mocked(readFile).mockResolvedValue(SAMPLE_MD as any);
    const post = await readPostBySlug('hello-world');
    expect(post!.description).toContain('<p>');
  });
});
