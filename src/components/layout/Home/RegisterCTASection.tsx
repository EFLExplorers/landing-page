import styles from "./RegisterCTASection.module.css";
import Link from "next/link";

export const RegisterCTASection = () => {
  return (
    <section className={styles.registerCta} data-cy="register-cta-section">
      <div className={styles.registerCtaContent}>
        <h2 className={styles.registerCtaTitle} data-cy="register-cta-title">
          Ready to Start Your English Learning Journey?
        </h2>
        <p className={styles.registerCtaSubtitle} data-cy="register-cta-subtitle">
          Join our community of learners and get access to all our premium
          features.
        </p>
        <Link
          href="/Auth/register"
          className={styles.registerCtaButton}
          data-cy="register-cta-button"
        >
          Create Your Account
        </Link>
      </div>
    </section>
  );
};
