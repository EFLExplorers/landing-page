import styles from "./RegisterCTASection.module.css";
import Link from "next/link";
import { PageSection } from "../../../pages/api/page-content";

export interface RegisterCTASectionProps {
  section: PageSection | null;
}

export const RegisterCTASection = ({ section }: RegisterCTASectionProps) => {
  // Database-driven content only
  if (!section?.content) return null;

  const title = section.content.title;
  const subtitle = section.content.subtitle;
  const buttonText = section.content.button_text;
  const buttonHref = section.content.button_href;

  return (
    <section className={styles.registerCta}>
      <div className={styles.registerCtaContent}>
        <h2 className={styles.registerCtaTitle}>
          {title}
        </h2>
        <p className={styles.registerCtaSubtitle}>
          {subtitle}
        </p>
        <Link href={buttonHref} className={styles.registerCtaButton}>
          {buttonText}
        </Link>
      </div>
    </section>
  );
};
