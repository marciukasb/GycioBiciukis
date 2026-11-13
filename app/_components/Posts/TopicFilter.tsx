import Link from "next/link";
import { TOPICS } from "@/app/_data/topics";
import styles from "./TopicFilter.module.scss";

const TopicFilter = ({ active }: { active: string | null }) => {
  const chips = [{ name: "Visi", href: "/irasai", slug: null }, ...TOPICS.map(t => ({ ...t, href: `/irasai/tema/${t.slug}` }))];
  return (
    <nav className={styles.filter} aria-label="Temos">
      {chips.map(chip => (
        <Link
          key={chip.href}
          href={chip.href}
          className={`${styles.chip} ${chip.slug === active ? styles.chipActive : ""}`}
          aria-current={chip.slug === active ? "page" : undefined}
        >
          {chip.name}
        </Link>
      ))}
    </nav>
  );
};

export default TopicFilter;
