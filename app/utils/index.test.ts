import { describe, it, expect } from 'vitest';
import { formatDate } from './index';

describe('formatDate', () => {
  it('formats an ISO date string to a Lithuanian long date', () => {
    expect(formatDate('2026-05-10')).toBe('2026 m. gegužės 10 d.');
  });

  it('does not shift the day across time zones', () => {
    expect(formatDate('2026-01-01')).toBe('2026 m. sausio 1 d.');
  });

  it('returns empty string for undefined input', () => {
    expect(formatDate(undefined)).toBe('');
  });

  it('returns empty string for empty string input', () => {
    expect(formatDate('')).toBe('');
  });

  it('returns empty string for an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('');
  });
});
