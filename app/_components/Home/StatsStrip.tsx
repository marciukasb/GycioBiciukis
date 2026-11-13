import type { Stats } from "@/app/utils/content";
import styles from "./StatsStrip.module.scss";

const LABELS: { key: keyof Stats; label: string }[] = [
  { key: "aviliai", label: "aviliai" },
  { key: "sodai", label: "sodai" },
  { key: "seimos", label: "bičių šeimos" },
];

const StatsStrip = ({ stats }: { stats: Stats }) => {
  const tiles = LABELS.filter(({ key }) => stats[key] !== null);
  if (tiles.length === 0) return null;

  return (
    <section className={styles.strip}>
      {tiles.map(({ key, label }) => (
        <div key={key} className={styles.tile}>
          <b className="serif">{stats[key]}</b>
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
};

export default StatsStrip;
