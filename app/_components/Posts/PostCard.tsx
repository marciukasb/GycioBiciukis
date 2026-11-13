import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/app/types/BlogPost";
import PostMeta from "./PostMeta";
import styles from "./PostCard.module.scss";

const PostCard = ({ post }: { post: BlogPost }) => {
  const href = `/irasai/${post.slug}`;
  return (
    <article className={styles.card}>
      {post.thumbnail && (
        <Link href={href} className={styles.card__image} tabIndex={-1}>
          <Image src={post.thumbnail} alt={post.title} fill sizes="(min-width: 920px) 300px, 100vw" />
        </Link>
      )}
      <div className={styles.card__body}>
        <h3 className={styles.card__title}>
          <Link href={href}>{post.title}</Link>
        </h3>
        {!post.thumbnail && post.summary && <p className={styles.card__summary}>{post.summary}</p>}
        <PostMeta post={post} />
      </div>
    </article>
  );
};

export default PostCard;
