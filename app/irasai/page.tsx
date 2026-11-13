import pageData from "../_data/meta";
import EmptyPosts from "../_components/Posts/EmptyPosts";
import PostGrid from "../_components/Posts/PostGrid";
import TopicFilter from "../_components/Posts/TopicFilter";
import { readAllPosts } from "../utils/blog";

const page = pageData["Posts"];

export const metadata = {
  title: page.title,
  description: page.description,
};

export default async function Posts() {
  const posts = await readAllPosts();
  return (
    <main>
      <h1>Įrašai</h1>
      <TopicFilter active={null} />
      {posts.length > 0 ? <PostGrid posts={posts} /> : <EmptyPosts />}
    </main>
  );
}
