import styles from "./ContactHeroSection.module.css";
import { PageSection } from "../../../pages/api/page-content";

export interface ContactHeroSectionProps {
  section: PageSection | null;
}

export const ContactHeroSection = ({ section }: ContactHeroSectionProps) => {
  // Database-driven content only
  if (!section?.content) return null;

  const title = section.content.title;
  const subtitle = section.content.subtitle;
  const body = section.content.body;
  const contactInfo = section.content.contact_info || [];

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>
          {subtitle} {body}
        </p>
        <div className={styles.contactInfo}>
          {contactInfo.map((info: any, index: number) => (
            <div key={index} className={styles.infoItem}>
              <span className={styles.icon}>{info.icon}</span>
              <div className={styles.infoText}>
                {info.href ? (
                  <a href={info.href}>{info.text}</a>
                ) : (
                  info.text
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 