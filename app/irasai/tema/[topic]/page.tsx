import { notFound } from "next/navigation";
import { SITE_NAME } from "../../../_data/site";
import { TOPICS, topicBySlug } from "../../../_data/topics";
import EmptyPosts from "../../../_components/Posts/EmptyPosts";
import PostGrid from "../../../_components/Posts/PostGrid";
import TopicFilter from "../../../_components/Posts/TopicFilter";
import { readAllPosts } from "../../../utils/blog";
import { postsByTopic } from "../../../utils/posts";

export const dynamicParams = false;

type TopicProps = {
  params: { topic: string };
};

export function generateStaticParams() {
  return TOPICS.map(t => ({ topic: t.slug }));
}

export function generateMetadata({ params }: TopicProps) {
  return { title: `${topicBySlug(params.topic)?.name ?? "Tema"} – ${SITE_NAME}` };
}

export default async function TopicPage({ params }: TopicProps) {
  const topic = topicBySlug(params.topic);
  if (!topic) return notFound();
  const posts = postsByTopic(await readAllPosts(), topic.slug);
  return (
    <main>
      <h1>{topic.name}</h1>
      <TopicFilter active={topic.slug} />
      {posts.length > 0 ? <PostGrid posts={posts} /> : <EmptyPosts note="Šia tema įrašų dar nėra." />}
    </main>
  );
}
