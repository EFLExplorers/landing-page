import {
  StudentCTASection,
  StudentCharactersSection,
  StudentHeroSection,
  StudentPlanetsSection,
} from "@/components/layout/StudentPlatform";
import styles from "./student.module.css";

export default function StudentPlatform() {
  return (
    <main className={styles.main}>
      <StudentHeroSection />
      <StudentCharactersSection />
      <StudentPlanetsSection />
      <StudentCTASection />
    </main>
  );
}
