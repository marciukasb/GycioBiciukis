import { readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { markdown } from './blog';
import { assetPath } from './assetPath';

const DATA_DIR = join(process.cwd(), 'app/_data');

export type Stats = { aviliai: number | null; sodai: number | null; seimos: number | null };

export type About = { html: string; photo: string };

function toNumber(value: unknown): number | null {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function readStats(): Promise<Stats> {
  try {
    const { data } = matter(await readFile(join(DATA_DIR, 'stats.md'), 'utf-8'), {});
    return { aviliai: toNumber(data.aviliai), sodai: toNumber(data.sodai), seimos: toNumber(data.seimos) };
  } catch {
    return { aviliai: null, sodai: null, seimos: null };
  }
}

export async function readAbout(): Promise<About> {
  try {
    const { data, content } = matter(await readFile(join(DATA_DIR, 'about.md'), 'utf-8'), {});
    return { html: markdown.parse(content) as string, photo: assetPath((data.photo as string) ?? '') };
  } catch {
    return { html: '', photo: '' };
  }
}
