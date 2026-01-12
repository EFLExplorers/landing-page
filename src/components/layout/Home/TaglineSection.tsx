import styles from "./TaglineSection.module.css";
import { PageSection } from "../../../pages/api/page-content";

export interface TaglineSectionProps {
  section: PageSection | null;
}

export const TaglineSection = ({ section }: TaglineSectionProps) => {
  // Database-driven content only
  if (!section?.content) return null;

  const title = section.content.title;
  const subtitle = section.content.body;

  return (
    <section className={styles.tagline}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default TaglineSection;
