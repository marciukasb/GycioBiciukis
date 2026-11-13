import styles from "./EmptyPosts.module.scss";

const EmptyPosts = ({ note = "Pirmasis įrašas jau pakeliui…" }: { note?: string }) => {
  return (
    <div className={styles.empty}>
      <p className="hand">{note}</p>
      <p>Netrukus čia atsiras pirmieji užrašai iš bityno.</p>
    </div>
  );
};

export default EmptyPosts;
