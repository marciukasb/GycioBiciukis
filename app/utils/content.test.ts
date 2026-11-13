import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
}));

import { readFile } from 'fs/promises';
import { readStats, readAbout } from './content';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('readStats', () => {
  it('reads the three numbers', async () => {
    vi.mocked(readFile).mockResolvedValue('---\naviliai: 24\nsodai: 3\nseimos: 18\n---\n' as any);
    expect(await readStats()).toEqual({ aviliai: 24, sodai: 3, seimos: 18 });
  });

  it('turns a value that is not a number into null', async () => {
    vi.mocked(readFile).mockResolvedValue('---\naviliai: 24\nsodai: 3\nseimos: daug\n---\n' as any);
    expect((await readStats()).seimos).toBeNull();
  });

  it('treats a missing key as null', async () => {
    vi.mocked(readFile).mockResolvedValue('---\naviliai: 24\n---\n' as any);
    expect(await readStats()).toEqual({ aviliai: 24, sodai: null, seimos: null });
  });

  it('returns all nulls when the file is missing', async () => {
    vi.mocked(readFile).mockRejectedValue(new Error('ENOENT'));
    expect(await readStats()).toEqual({ aviliai: null, sodai: null, seimos: null });
  });
});

describe('readAbout', () => {
  it('returns the body as HTML and the photo', async () => {
    vi.mocked(readFile).mockResolvedValue('---\nphoto: /images/tetis.jpg\n---\n\nSveiki' as any);
    const about = await readAbout();
    expect(about.html).toContain('<p>Sveiki</p>');
    expect(about.photo).toBe('/images/tetis.jpg');
  });

  it('returns empty content when the file is missing', async () => {
    vi.mocked(readFile).mockRejectedValue(new Error('ENOENT'));
    expect(await readAbout()).toEqual({ html: '', photo: '' });
  });
});
