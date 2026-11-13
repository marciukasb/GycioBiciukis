import { NEWSLETTER } from "@/app/_data/newsletter";
import styles from "./Newsletter.module.scss";

const Newsletter = () => {
  if (!NEWSLETTER) return null;

  return (
    <section className={styles.newsletter}>
      <h2>Gaukite naujus įrašus el. paštu</h2>
      <form method="post" action={NEWSLETTER.action} target="_blank" className={styles.form}>
        {Object.entries(NEWSLETTER.hidden ?? {}).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <input
          type="email"
          name={NEWSLETTER.emailField}
          placeholder="jusu@pastas.lt"
          aria-label="El. paštas"
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Prenumeruoti
        </button>
      </form>
      <p className={styles.note}>Laiškas tik tada, kai atsiranda naujas įrašas. Atsisakyti galima bet kada.</p>
    </section>
  );
};

export default Newsletter;
