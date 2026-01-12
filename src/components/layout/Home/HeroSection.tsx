import { useRouter } from "next/router";
import styles from "./HeroSection.module.css";

export const HeroSection = () => {
  const router = useRouter();

  const handlePlatformSelect = (platform: "student" | "teacher") => {
    router.push(`/Auth/register/${platform}`);
  };

  return (
    <section className={styles.hero} data-cy="hero-section">
      <div className={styles.content}>
        <h1 className={styles.title} data-cy="hero-title">
          Start your learning journey today!
        </h1>
        <p className={styles.subtitle} data-cy="hero-subtitle">
          We&apos;re so happy you&apos;re here! However, you will need to
          register to get started.
        </p>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => handlePlatformSelect("student")}
            className={styles.button}
            data-cy="hero-register-student"
          >
            Register Student
          </button>
          <button
            onClick={() => handlePlatformSelect("teacher")}
            className={styles.button}
            data-cy="hero-register-teacher"
          >
            Register Teacher
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
