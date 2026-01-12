import { useRouter } from "next/router";
import styles from "./HeroSection.module.css";
import { PageSection } from "../../../pages/api/page-content";

export interface HeroSectionProps {
  section: PageSection | null;
}

export const HeroSection = ({ section }: HeroSectionProps) => {
  const router = useRouter();

  const handlePlatformSelect = (platform: "student" | "teacher") => {
    router.push(`/register/${platform}`);
  };

  // Database-driven content only
  if (!section?.content) return null;

  const title = section.content.title;
  const subtitle = section.content.subtitle;
  const buttons = section.content.buttons || [];

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>
          {subtitle}
        </p>
        <div className={styles.buttonGroup}>
          {buttons.map((button: any, index: number) => (
            <button
              key={index}
              onClick={() => {
                if (button.href?.includes('/register/')) {
                  const platform = button.href.split('/').pop();
                  if (platform === 'student' || platform === 'teacher') {
                    handlePlatformSelect(platform);
                  }
                }
              }}
              className={styles.button}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
