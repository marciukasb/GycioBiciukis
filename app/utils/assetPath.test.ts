import { describe, it, expect } from 'vitest';
import { assetPath } from './assetPath';

describe('assetPath', () => {
  it('prefixes site files with the base path', () => {
    expect(assetPath('/images/logo.svg', '/GycioBiciukis')).toBe('/GycioBiciukis/images/logo.svg');
  });

  it('leaves paths alone when there is no base path', () => {
    expect(assetPath('/images/logo.svg', '')).toBe('/images/logo.svg');
  });

  it('leaves outside links and empty values alone', () => {
    expect(assetPath('https://example.com/a.jpg', '/GycioBiciukis')).toBe('https://example.com/a.jpg');
    expect(assetPath('//cdn.example.com/a.jpg', '/GycioBiciukis')).toBe('//cdn.example.com/a.jpg');
    expect(assetPath('', '/GycioBiciukis')).toBe('');
  });
});
