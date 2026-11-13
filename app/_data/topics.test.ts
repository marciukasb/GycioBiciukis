import { describe, it, expect } from 'vitest';
import { TOPICS, topicByName, topicBySlug } from './topics';

describe('topics', () => {
  it('has the four fixed topics in order', () => {
    expect(TOPICS.map(t => t.name)).toEqual(['Statyba', 'Žinios', 'Bitynas', 'Spiečiai']);
  });

  it('finds a topic by its Lithuanian name', () => {
    expect(topicByName('Žinios')?.slug).toBe('zinios');
  });

  it('returns undefined for an unknown topic name', () => {
    expect(topicByName('Statybos')).toBeUndefined();
    expect(topicByName('')).toBeUndefined();
  });

  it('finds a topic by slug', () => {
    expect(topicBySlug('spieciai')?.name).toBe('Spiečiai');
  });
});
