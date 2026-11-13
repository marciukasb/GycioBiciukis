import Link from "next/link";
import pageData from "./_data/meta";
import Logo from "./_components/Logo/Logo";
import styles from "./not-found.module.scss";

const page = pageData["404"];

export const metadata = {
  title: page.title,
  description: page.description,
};

export default function NotFound() {
  return (
    <main className={styles.notFound}>
      <Logo size={120} className={styles.logo} />
      <h1>Puslapis nerastas</h1>
      <p className="hand">Atrodo, ši bitė nuskrido kitur.</p>
      <Link href="/" className={styles.home}>
        Grįžti į pradžią
      </Link>
    </main>
  );
}
