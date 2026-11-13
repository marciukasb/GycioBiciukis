import Link from "next/link";
import { SITE_NAME } from "@/app/_data/meta";
import styles from "./Navigation.module.scss";

const links = [
  { href: "/", name: "Home" },
  { href: "/about", name: "About" },
  { href: "/blog", name: "Blog" },
  { href: "/contacts", name: "Contacts" },
];

const Navigation = () => {
  return (
    <nav className={styles.navigation}>
      <Link href="/" className={styles.navigation__logo}>
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
