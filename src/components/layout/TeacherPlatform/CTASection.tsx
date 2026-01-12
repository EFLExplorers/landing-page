import Link from "next/link";
import styles from "./CTASection.module.css";

export const TeacherCTASection = () => {
  return (
    <section className={styles.cta} data-cy="teacher-cta-section">
      <h2 data-cy="teacher-cta-title">
        Join our community of EFL educators today!
      </h2>
      <p data-cy="teacher-cta-subtitle">
        Start creating engaging lessons and inspiring your students to master
        English
      </p>
      <Link
        href="/Auth/register/teacher"
        className={styles.registerButton}
        data-cy="teacher-cta-button"
      >
        Register as Teacher
      </Link>
    </section>
  );
};
