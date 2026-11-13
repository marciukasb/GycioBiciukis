import { describe, it, expect } from 'vitest';
import { galleryOutsideBody } from './photos';

describe('galleryOutsideBody', () => {
  it('keeps photos not placed in the text', () => {
    expect(galleryOutsideBody(['/images/a.jpg', '/images/b.jpg'], '![x](/images/b.jpg)')).toEqual(['/images/a.jpg']);
  });

  it('keeps everything when the text has no photos', () => {
    expect(galleryOutsideBody(['/images/a.jpg'], 'Tekstas')).toEqual(['/images/a.jpg']);
  });
});
