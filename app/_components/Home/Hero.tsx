import { HERO_IMAGE, TAGLINE } from "@/app/_data/site";
import Logo from "../Logo/Logo";
import styles from "./Hero.module.scss";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div
        className={styles.hero__photo}
        style={HERO_IMAGE ? { backgroundImage: `url(${HERO_IMAGE})` } : undefined}
      >
        <h1 className={styles.hero__title}>{TAGLINE}</h1>
      </div>
      <Logo size={230} className={styles.hero__logo} />
    </section>
  );
};

export default Hero;
