import Link from "next/link";
import type { BlogPost } from "@/app/types/BlogPost";
import { homePostLayout } from "@/app/utils/posts";
import EmptyPosts from "../Posts/EmptyPosts";
import FeaturedPost from "../Posts/FeaturedPost";
import PostCard from "../Posts/PostCard";
import styles from "./LatestPosts.module.scss";

const LatestPosts = ({ posts }: { posts: BlogPost[] }) => {
  const { featured, rest } = homePostLayout(posts);

  if (!featured) {
    return (
      <section className={styles.section}>
        <EmptyPosts />
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2>Naujausias įrašas</h2>
      <FeaturedPost post={featured} />
      {rest.length > 0 && (
        <>
          <div className={styles.grid}>
            {rest.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <Link href="/irasai" className={styles.all}>
            Visi įrašai →
          </Link>
        </>
      )}
    </section>
  );
};

export default LatestPosts;
