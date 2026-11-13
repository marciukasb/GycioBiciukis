import Link from "next/link";
import type { BlogPost } from "@/app/types/BlogPost";
import styles from "./PostNav.module.scss";

type PostNavProps = {
  newer: BlogPost | null;
  older: BlogPost | null;
};

const PostNav = ({ newer, older }: PostNavProps) => {
  if (!newer && !older) return null;
  return (
    <nav className={styles.nav}>
      {newer ? (
        <Link href={`/irasai/${newer.slug}`} className={styles.link}>
          <span>← Naujesnis</span>
          <b className="serif">{newer.title}</b>
        </Link>
      ) : (
        <span />
      )}
      {older && (
        <Link href={`/irasai/${older.slug}`} className={`${styles.link} ${styles.older}`}>
          <span>Senesnis →</span>
          <b className="serif">{older.title}</b>
        </Link>
      )}
    </nav>
  );
};

export default PostNav;
