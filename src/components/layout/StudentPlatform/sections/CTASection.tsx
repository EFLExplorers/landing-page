import Link from "next/link";
import styles from "@/pages/platforms/student.module.css";

export const StudentCTASection = () => {
  return (
    <section className={styles.cta} data-cy="student-cta-section">
      <div className={styles.ctaContent}>
        <h2 data-cy="student-cta-title">
          Register today to start your learning journey!
        </h2>
        <Link
          href="/Auth/register/student"
          className={styles.registerButton}
          data-cy="student-cta-button"
        >
          Register
        </Link>
      </div>
    </section>
  );
};

export default StudentCTASection;
