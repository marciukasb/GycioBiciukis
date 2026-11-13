import React from "react";
import type { BlogPost as Post } from "@/app/types/BlogPost";
import PostMeta from "../Posts/PostMeta";
import styles from "./BlogPost.module.scss";

const BlogPost = ({ post }: { post: Post }) => {
  return (
    <article className={styles.blogPost}>
      <h1>{post.title}</h1>
      <div className={styles.meta}>
        <PostMeta post={post} />
      </div>
      {post.thumbnail && (
        <a href={post.thumbnail} target="_blank" rel="noopener" className={styles.cover}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.thumbnail} alt={post.title} />
        </a>
      )}
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.description }} />
      {post.galleryPhotos.length > 0 && (
        <div className={styles.gallery}>
          {post.galleryPhotos.map(url => (
            <a key={url} href={url} target="_blank" rel="noopener">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" loading="lazy" />
            </a>
          ))}
        </div>
      )}
    </article>
  );
};

export default BlogPost;
