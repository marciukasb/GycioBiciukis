import Link from "next/link";
import { SITE_NAME } from "@/app/_data/site";
import styles from "./Navigation.module.scss";

const links = [
  { href: "/irasai", name: "Įrašai" },
  { href: "/apie", name: "Apie" },
];

const Navigation = () => {
  return (
    <nav className={styles.navigation}>
      <Link href="/" className={`${styles.navigation__name} serif`}>
        {SITE_NAME}
      </Link>
      <div className={styles.navigation__menu}>
        {links.map(link => (
          <Link key={link.href} href={link.href}>
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
