import type { BlogPost } from '../types/BlogPost';
import { SITE_NAME, TAGLINE } from '../_data/site';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const IMAGE_TYPES: Record<string, string> = { png: 'image/png', webp: 'image/webp', gif: 'image/gif' };

const imageType = (path: string) => IMAGE_TYPES[path.split('.').pop()?.toLowerCase() ?? ''] ?? 'image/jpeg';

function buildItem(post: BlogPost, siteUrl: string): string {
  const link = `${siteUrl}/irasai/${encodeURIComponent(post.slug)}/`;
  const lines = [
    `<title>${escapeXml(post.title)}</title>`,
    `<link>${escapeXml(link)}</link>`,
    `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
    `<description>${escapeXml(post.summary)}</description>`,
  ];
  if (post.isoDate) lines.push(`<pubDate>${new Date(post.isoDate).toUTCString()}</pubDate>`);
  if (post.thumbnail) {
    const url = escapeXml(`${siteUrl}${post.thumbnail}`);
    lines.push(`<enclosure url="${url}" type="${imageType(post.thumbnail)}" length="0"/>`);
  }
  return `<item>${lines.join('')}</item>`;
}

export function buildRss(posts: BlogPost[], siteUrl: string): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0"><channel>',
    `<title>${escapeXml(SITE_NAME)}</title>`,
    `<link>${escapeXml(siteUrl)}</link>`,
    `<description>${escapeXml(TAGLINE)}</description>`,
    '<language>lt</language>',
    ...posts.map(post => buildItem(post, siteUrl)),
    '</channel></rss>',
  ].join('\n');
}
