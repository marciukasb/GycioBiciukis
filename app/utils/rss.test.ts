import { describe, it, expect } from 'vitest';
import type { BlogPost } from '../types/BlogPost';
import { buildRss } from './rss';

const SITE = 'https://gyciobiciukis.lt';

const post = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  slug: 'sablonas',
  title: 'Šablonas avilių rėmams',
  summary: 'Kaip supjaunu rėmelius',
  description: '<p>Body</p>',
  date: '2026 m. sausio 15 d.',
  isoDate: '2026-01-15',
  topic: 'Statyba',
  thumbnail: '',
  photos: [],
  galleryPhotos: [],
  ...overrides,
});

describe('buildRss', () => {
  it('escapes XML special characters in titles', () => {
    const xml = buildRss([post({ title: 'Medus & vaškas <2026>' })], SITE);
    expect(xml).toContain('Medus &amp; vaškas &lt;2026&gt;');
  });

  it('links each item to its post page', () => {
    const xml = buildRss([post()], SITE);
    expect(xml).toContain('<link>https://gyciobiciukis.lt/irasai/sablonas/</link>');
  });

  it('includes an RFC-822 pubDate when the post has a date', () => {
    expect(buildRss([post()], SITE)).toContain('<pubDate>Thu, 15 Jan 2026 00:00:00 GMT</pubDate>');
  });

  it('omits pubDate for undated posts', () => {
    expect(buildRss([post({ isoDate: '', date: '' })], SITE)).not.toContain('<pubDate>');
  });

  it('adds an enclosure only when there is a thumbnail', () => {
    expect(buildRss([post()], SITE)).not.toContain('<enclosure');
    expect(buildRss([post({ thumbnail: '/images/a.jpg' })], SITE)).toContain(
      '<enclosure url="https://gyciobiciukis.lt/images/a.jpg" type="image/jpeg" length="0"/>'
    );
  });

  it('percent-encodes Lithuanian letters in post links', () => {
    const xml = buildRss([post({ slug: 'šablonas' })], SITE);
    expect(xml).toContain('<link>https://gyciobiciukis.lt/irasai/%C5%A1ablonas/</link>');
  });

  it('produces a valid empty channel with no posts', () => {
    const xml = buildRss([], SITE);
    expect(xml.startsWith('<?xml')).toBe(true);
    expect(xml).toContain('<language>lt</language>');
    expect(xml).not.toContain('<item>');
  });
});
