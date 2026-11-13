import type { BlogPost } from "@/app/types/BlogPost";
import TopicTag from "./TopicTag";
import styles from "./PostMeta.module.scss";

const PostMeta = ({ post }: { post: BlogPost }) => {
  return (
    <div className={styles.meta}>
      {post.date && <span>{post.date}</span>}
      <TopicTag topic={post.topic} />
    </div>
  );
};

export default PostMeta;
