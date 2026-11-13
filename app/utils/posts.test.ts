import { describe, it, expect } from 'vitest';
import type { BlogPost } from '../types/BlogPost';
import { homePostLayout, adjacentPosts, postsByTopic } from './posts';

const post = (slug: string, topic = 'Statyba'): BlogPost => ({
  slug,
  title: slug,
  summary: '',
  description: '',
  date: '',
  isoDate: '',
  topic,
  thumbnail: '',
  photos: [],
  galleryPhotos: [],
});

const [a, b, c, d, e] = ['a', 'b', 'c', 'd', 'e'].map(s => post(s));

describe('homePostLayout', () => {
  it('has no featured post when there are no posts', () => {
    expect(homePostLayout([])).toEqual({ featured: null, rest: [] });
  });

  it('features the only post', () => {
    expect(homePostLayout([a])).toEqual({ featured: a, rest: [] });
  });

  it('features the newest and keeps up to three more', () => {
    const layout = homePostLayout([a, b, c, d, e]);
    expect(layout.featured).toBe(a);
    expect(layout.rest).toEqual([b, c, d]);
  });
});

describe('adjacentPosts', () => {
  it('returns the newer and older neighbours', () => {
    expect(adjacentPosts([a, b, c], 'b')).toEqual({ newer: a, older: c });
  });

  it('has no newer post for the newest', () => {
    expect(adjacentPosts([a, b, c], 'a').newer).toBeNull();
  });

  it('returns nulls for an unknown slug', () => {
    expect(adjacentPosts([a], 'missing')).toEqual({ newer: null, older: null });
  });
});

describe('postsByTopic', () => {
  it('keeps only posts whose topic matches the slug', () => {
    const z = post('z', 'Žinios');
    expect(postsByTopic([a, z, b], 'zinios')).toEqual([z]);
  });

  it('excludes posts with empty or unknown topics', () => {
    const typo = post('typo', 'Statybos');
    const none = post('none', '');
    expect(postsByTopic([a, typo, none], 'statyba')).toEqual([a]);
  });
});
