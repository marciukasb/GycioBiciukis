import BlogList from '../_components/BlogList/BlogList';
import { readAllPosts } from '../utils/blog';

export const metadata = {
  title: 'Blog',
  description: 'Latest posts from Gyčio Bičiūkis',
};

export default async function Blog() {
  const posts = await readAllPosts();
  return (
    <main>
      <h1>Blog</h1>
      <BlogList posts={posts} />
    </main>
  );
}
