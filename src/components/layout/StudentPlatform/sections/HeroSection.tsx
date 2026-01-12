import Link from "next/link";
import Image from "next/image";
import styles from "@/pages/platforms/student.module.css";

export const StudentHeroSection = () => {
  return (
    <section className={styles.hero} data-cy="student-hero-section">
      <div className={styles.heroContent}>
        <h1 data-cy="student-hero-title">Our Student Portal</h1>
        <p data-cy="student-hero-subtitle">
          Our student portal offers a cutting-edge platform for you to learn
          English effectively. With interactive lessons, real-time feedback, and
          engaging activities, learning has never been more fun!
        </p>
        <Link
          href="/Auth/register/student"
          className={styles.primaryButton}
          data-cy="student-hero-cta"
        >
          Get Started
        </Link>
      </div>
      <div className={styles.heroImage}>
        <div className={styles.placeholder} data-cy="student-hero-placeholder">
          <Image
            src="/assets/images/characters/Emma.png"
            alt="Student Portal character"
            width={480}
            height={360}
            className={styles.heroCharacter}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default StudentHeroSection;
