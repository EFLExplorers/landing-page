import styles from "./PricingSection.module.css";

export type PricingTier = {
  id: string;
  content_type: string;
  title: string;
  content: {
    price: string;
    period: string;
    description: string;
    is_featured?: boolean;
  };
  sort_order: number;
  active: boolean;
};

export interface PricingSectionProps {
  pricingTiers: PricingTier[];
}

export const PricingSection = ({ pricingTiers }: PricingSectionProps) => {
  // Database-driven content only
  if (!pricingTiers || pricingTiers.length === 0) return null;

  return (
    <section className={styles.pricing}>
      <h2 className={styles.title}>Pricing</h2>
      <p className={styles.subtitle}>Choose the plan that is right for you</p>

      <div className={styles.pricingGrid}>
        {pricingTiers.map((tier) => (
          <div key={tier.id} className={styles.pricingCard}>
            <h3 className={styles.tierName}>{tier.title}</h3>
            <div className={styles.priceContainer}>
              <span className={styles.price}>{tier.content.price}</span>
              {tier.content.period && (
                <span className={styles.period}>{tier.content.period}</span>
              )}
            </div>
            <p className={styles.description}>{tier.content.description}</p>
            <button className={styles.getStarted}>Get started</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
