import { notFound } from "next/navigation";
import BlogPost from "../../_components/BlogPost/BlogPost";
import Newsletter from "../../_components/Newsletter/Newsletter";
import PostNav from "../../_components/Posts/PostNav";
import { SITE_NAME } from "../../_data/site";
import { readAllPosts, readPostBySlug } from "../../utils/blog";
import { adjacentPosts } from "../../utils/posts";

export const dynamicParams = false;

type PostProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = await readAllPosts();
  if (posts.length === 0) return [{ slug: "_empty" }];
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostProps) {
  const post = await readPostBySlug(params.slug);
  if (!post) return { title: SITE_NAME };
  return { title: `${post.title} – ${SITE_NAME}`, description: post.summary };
}

export default async function Post({ params }: PostProps) {
  const post = await readPostBySlug(params.slug);
  if (!post) return notFound();
  const { newer, older } = adjacentPosts(await readAllPosts(), post.slug);
  return (
    <main>
      <BlogPost post={post} />
      <Newsletter />
      <PostNav newer={newer} older={older} />
    </main>
  );
}
