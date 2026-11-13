import type { BlogPost } from '../types/BlogPost';
import { topicByName } from '../_data/topics';

// All functions expect posts sorted newest first (as readAllPosts returns them)

export function homePostLayout(posts: BlogPost[]): { featured: BlogPost | null; rest: BlogPost[] } {
  const [featured = null, ...rest] = posts;
  return { featured, rest: rest.slice(0, 3) };
}

export function adjacentPosts(posts: BlogPost[], slug: string): { newer: BlogPost | null; older: BlogPost | null } {
  const index = posts.findIndex(p => p.slug === slug);
  if (index === -1) return { newer: null, older: null };
  return { newer: posts[index - 1] ?? null, older: posts[index + 1] ?? null };
}

export function postsByTopic(posts: BlogPost[], topicSlug: string): BlogPost[] {
  return posts.filter(p => topicByName(p.topic)?.slug === topicSlug);
}
