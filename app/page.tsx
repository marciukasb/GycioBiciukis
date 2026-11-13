import pageData from "./_data/meta";
import { INTRO } from "./_data/site";
import Hero from "./_components/Home/Hero";
import LatestPosts from "./_components/Home/LatestPosts";
import StatsStrip from "./_components/Home/StatsStrip";
import StoryTeaser from "./_components/Home/StoryTeaser";
import { readAllPosts } from "./utils/blog";
import { readAbout, readStats } from "./utils/content";
import styles from "./page.module.scss";

const page = pageData["Home"];

export const metadata = {
  title: page.title,
  description: page.description,
};

export default async function Home() {
  const [posts, stats, about] = await Promise.all([readAllPosts(), readStats(), readAbout()]);

  return (
    <main>
      <Hero />
      <p className={styles.intro}>{INTRO}</p>
      <LatestPosts posts={posts} />
      <StatsStrip stats={stats} />
      <StoryTeaser photo={about.photo} />
    </main>
  );
}
