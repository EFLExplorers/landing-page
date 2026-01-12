import styles from "./ContactHeroSection.module.css";

export const ContactHeroSection = () => {
  return (
    <section className={styles.hero} data-cy="contact-hero">
      <div className={styles.content}>
        <h1 className={styles.title} data-cy="contact-title">
          Get in Touch
        </h1>
        <p className={styles.subtitle} data-cy="contact-subtitle">
          Have questions about our English learning programs? We're here to
          help! Reach out to us and let's start your learning journey together.
        </p>
        <div className={styles.contactInfo}>
          <div className={styles.infoItem}>
            <span className={styles.icon}>📧</span>
            <div className={styles.infoText}>
              <a href="mailto:contact@eslexplorers.com" data-cy="contact-email">
                contact@eslexplorers.com
              </a>
            </div>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.icon}>📞</span>
            <div className={styles.infoText}>
              <a href="tel:+1234567890" data-cy="contact-phone">
                +1 (234) 567-890
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
