import Link from "next/link";
import Image from "next/image";
import styles from "./HeroSection.module.css";

export const TeacherHeroSection = () => {
  return (
    <section className={styles.hero} data-cy="teacher-hero-section">
      <div className={styles.heroContent}>
        <h1 data-cy="teacher-hero-title">Our Teacher Portal</h1>
        <p data-cy="teacher-hero-subtitle">
          Empower your teaching with our comprehensive ESL platform. Access
          ready-made lesson plans, track student progress, and deliver engaging
          interactive lessons that make learning English an exciting adventure
          for your students.
        </p>
        <Link
          href="/Auth/register/teacher"
          className={styles.primaryButton}
          data-cy="teacher-hero-cta"
        >
          Start Teaching
        </Link>
      </div>
      <div className={styles.heroImage}>
        <div className={styles.placeholder}>
          <Image
            src="/assets/images/characters/Emma.png"
            alt="Teacher Character"
            width={400}
            height={300}
            className={styles.heroCharacter}
            data-cy="teacher-hero-image"
          />
        </div>
      </div>
    </section>
  );
};
