import { SITE_URL } from '../_data/site';
import { readAllPosts } from '../utils/blog';
import { buildRss } from '../utils/rss';

export const dynamic = 'force-static';

export async function GET() {
  const xml = buildRss(await readAllPosts(), SITE_URL);
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
