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
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.description }} />
    </article>
  );
};

export default BlogPost;
