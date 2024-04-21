import Link from "next/link";
import s from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={s.footer}>
      {/* insert actions here */}
      {/* Press and hold CTA */}
      {/* Cards thumbnails */}
      {/* Shortlinks ("Learn more, End conversation") */}
      <Link href="#" className={s.link}>
        Learn more
      </Link>
    </footer>
  );
};

export default Footer;
