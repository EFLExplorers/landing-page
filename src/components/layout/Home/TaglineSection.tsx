import styles from "./TaglineSection.module.css";

export const TaglineSection = () => {
  return (
    <section className={styles.tagline} data-cy="tagline-section">
      <div className={styles.content}>
        <h2 className={styles.title} data-cy="tagline-title">
          Explore the universe of language!
        </h2>
        <p className={styles.subtitle} data-cy="tagline-subtitle">
          We provide teachers with stellar ESL resources and guide students on
          an exciting journey to English mastery!
        </p>
      </div>
    </section>
  );
};

export default TaglineSection;
