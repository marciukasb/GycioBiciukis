import type { BlogPost } from "@/app/types/BlogPost";
import PostCard from "./PostCard";
import styles from "./PostGrid.module.scss";

const PostGrid = ({ posts }: { posts: BlogPost[] }) => {
  return (
    <div className={styles.grid}>
      {posts.map(post => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
};

export default PostGrid;
