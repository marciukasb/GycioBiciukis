import Link from "next/link";
import styles from "./StoryTeaser.module.scss";

const StoryTeaser = ({ photo }: { photo: string }) => {
  return (
    <section className={styles.teaser}>
      <div
        className={styles.teaser__photo}
        style={photo ? { backgroundImage: `url(${photo})` } : undefined}
      />
      <div>
        <h2>Kaip viskas prasidėjo</h2>
        <p>Dovana, kuri užpildė kiekvieną laisvą minutę…</p>
        <Link href="/apie" className={styles.teaser__link}>
          Skaityti →
        </Link>
      </div>
    </section>
  );
};

export default StoryTeaser;
