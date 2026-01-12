import styles from "./ServicesSection.module.css";

export type Service = {
  id: string;
  content_type: string;
  title: string;
  description: string;
  content: {
    icon: string;
    background_icons: string[];
  };
  sort_order: number;
  active: boolean;
};

export interface ServicesSectionProps {
  services: Service[];
}

export const ServicesSection = ({ services }: ServicesSectionProps) => {
  // Database-driven content only
  if (!services || services.length === 0) return null;

  return (
    <section className={styles.services}>
      <div className={styles.content}>
        <h2 className={styles.title}>Our Services</h2>
        <p className={styles.subtitle}>
          Discover how we make learning English an exciting journey for both
          students and teachers
        </p>

        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              {service.content.background_icons.map((bgIcon: string, bgIndex: number) => (
                <div key={bgIndex} className={`${styles.backgroundIcon} ${styles[`backgroundIcon${bgIndex + 1}`]}`}>
                  {bgIcon}
                </div>
              ))}
              <div className={styles.serviceIcon}>{service.content.icon}</div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
              <button className={styles.learnMore}>Learn More</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
