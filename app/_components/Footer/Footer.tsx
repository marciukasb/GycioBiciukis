import { SITE_NAME } from "@/app/_data/site";
import styles from "./Footer.module.scss";

type FooterProps = {
  children?: React.ReactNode;
};

const Footer = ({ children }: FooterProps) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__inner}>
        {children}
        <p className={styles.footer__copy}>
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
