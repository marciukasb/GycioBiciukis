import pageData from "../_data/meta";
import { readAbout } from "../utils/content";
import styles from "./page.module.scss";

const page = pageData["About"];

export const metadata = {
  title: page.title,
  description: page.description,
};

export default async function About() {
  const { html, photo } = await readAbout();
  return (
    <main>
      <h1>Kaip viskas prasidėjo</h1>
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className={styles.photo} />
      )}
      {html ? (
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p className="hand">Istorija jau rašoma…</p>
      )}
    </main>
  );
}
