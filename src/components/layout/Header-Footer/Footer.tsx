import Link from "next/link";
import Logo from "./Logo";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer} data-cy="site-footer">
      <div className={styles.footerContent}>
        <div className={styles.logoSection} data-cy="footer-logo-section">
          <Logo />
        </div>

        <div className={styles.linksSection} data-cy="footer-links-section">
          <div className={styles.column} data-cy="footer-socials-column">
            <h3>Socials</h3>
            <Link href="https://linkedin.com" data-cy="footer-linkedin-link">
              LinkedIn
            </Link>
            <Link href="https://instagram.com" data-cy="footer-instagram-link">
              Instagram
            </Link>
            <Link href="https://facebook.com" data-cy="footer-facebook-link">
              Facebook
            </Link>
          </div>

          <div className={styles.column} data-cy="footer-company-column">
            <h3>Company</h3>
            <Link href="/about" data-cy="footer-about-link">
              About Us
            </Link>
            <Link href="/pricing" data-cy="footer-pricing-link">
              Pricing
            </Link>
            <Link href="/Auth/register" data-cy="footer-register-link">
              Register
            </Link>
          </div>

          <div className={styles.column} data-cy="footer-support-column">
            <h3>Support</h3>
            <Link href="/contact" data-cy="footer-contact-link">
              Contact Us
            </Link>
            <Link href="/faq" data-cy="footer-faq-link">
              FAQ
            </Link>
            <Link href="/terms" data-cy="footer-terms-link">
              Terms & Conditions
            </Link>
            <Link href="/privacy" data-cy="footer-privacy-link">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar} data-cy="footer-bottom-bar">
        <p>All rights reserved</p>
        <p>Copyright 2026 | Privacy Policy</p>
        <p>Powered by ESL Explorers</p>
      </div>
    </footer>
  );
};

export { Footer as default };
