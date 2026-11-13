import Link from "next/link";
import { topicByName } from "@/app/_data/topics";
import styles from "./TopicTag.module.scss";

const TopicTag = ({ topic }: { topic: string }) => {
  const match = topicByName(topic);
  if (!match) return null;
  return (
    <Link href={`/irasai/tema/${match.slug}`} className={styles.tag}>
      {match.name}
    </Link>
  );
};

export default TopicTag;
