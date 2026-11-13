import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/app/types/BlogPost";
import PostMeta from "./PostMeta";
import styles from "./FeaturedPost.module.scss";

const FeaturedPost = ({ post }: { post: BlogPost }) => {
  const href = `/irasai/${post.slug}`;
  return (
    <article className={`${styles.featured} ${post.thumbnail ? "" : styles.featuredNoImage}`}>
      {post.thumbnail && (
        <Link href={href} className={styles.featured__image} tabIndex={-1}>
          <Image src={post.thumbnail} alt={post.title} fill sizes="(min-width: 920px) 600px, 100vw" />
        </Link>
      )}
      <div className={styles.featured__body}>
        <h3 className={styles.featured__title}>
          <Link href={href}>{post.title}</Link>
        </h3>
        {post.summary && <p>{post.summary}</p>}
        <PostMeta post={post} />
        <Link href={href} className={styles.featured__more}>
          Skaityti →
        </Link>
      </div>
    </article>
  );
};

export default FeaturedPost;
