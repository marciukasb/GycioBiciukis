import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./BlogListItem.module.scss";
import { BlogPost } from "@/app/types/BlogPost";

const BlogListItem = ({ slug, title, summary, date, topic, thumbnail }: BlogPost) => {
  return (
    <Link href={`/blog/${slug}`} className={styles.blogItem}>
      <div className={styles.blogItem__textColumn}>
        <h2>{title}</h2>
        <p>{summary}</p>
        <div className={styles.blogItem__meta}>
          <span>{date}</span>
          {topic && <span className={styles.blogItem__tag}>{topic}</span>}
        </div>
      </div>
      {thumbnail && (
        <div className={styles.blogItem__imageColumn}>
          <Image src={thumbnail} alt={title} fill className={styles.blogItem__image} />
        </div>
      )}
    </Link>
  );
};

export default BlogListItem;
