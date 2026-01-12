import { Service } from "../../../pages/api/content";
import styles from "./ServicesSection.module.css";

export interface ServicesSectionProps {
  services: Service[];
}

export const ServicesSection = ({ services }: ServicesSectionProps) => {
  if (!services?.length) return null;

  return (
    <section className={styles.services} data-cy="services-section">
      <div className={styles.content}>
        <h2 className={styles.title} data-cy="services-title">
          Our Services
        </h2>
        <p className={styles.subtitle} data-cy="services-subtitle">
          Discover how we make learning English an exciting journey for both
          students and teachers
        </p>

        <div className={styles.servicesGrid} data-cy="services-grid">
          {services.map((service) => {
            const title = service.title || "";
            const description =
              service.description || (service.content as any)?.description || "";
            const icon = (service.content as any)?.icon || "";
            const backgroundIcons =
              (service.content as any)?.background_icons || [];

            return (
              <div
                key={service.id}
                className={styles.serviceCard}
                data-cy="service-card"
              >
                {backgroundIcons.map((bgIcon: string, bgIndex: number) => (
                  <div
                    key={`${service.id}-${bgIndex}`}
                    className={`${styles.backgroundIcon} ${styles[`backgroundIcon${bgIndex + 1}`]}`}
                  >
                    {bgIcon}
                  </div>
                ))}
                <div className={styles.serviceIcon}>{icon}</div>
                <h3 className={styles.serviceTitle}>{title}</h3>
                <p className={styles.serviceDescription}>{description}</p>
                <button className={styles.learnMore} data-cy="service-learn-more">
                  Learn More
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
