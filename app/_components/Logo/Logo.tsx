import { LOGO_SRC, SITE_NAME } from "@/app/_data/site";
import { assetPath } from "@/app/utils/assetPath";
import styles from "./Logo.module.scss";

type LogoProps = {
  size: number;
  className?: string;
};

const Logo = ({ size, className }: LogoProps) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={assetPath(LOGO_SRC)}
      alt={SITE_NAME}
      width={size}
      height={size}
      className={`${styles.logo} ${className ?? ""}`}
    />
  );
};

export default Logo;
