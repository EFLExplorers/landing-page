import { PricingTier } from "../../../pages/api/content";
import styles from "./PricingSection.module.css";

export interface PricingSectionProps {
  pricingTiers: PricingTier[];
}

export const PricingSection = ({ pricingTiers }: PricingSectionProps) => {
  if (!pricingTiers?.length) return null;

  return (
    <section className={styles.pricing} data-cy="pricing-section">
      <h2 className={styles.title} data-cy="pricing-title">
        Pricing
      </h2>
      <p className={styles.subtitle} data-cy="pricing-subtitle">
        Choose the plan that is right for you
      </p>

      <div className={styles.pricingGrid} data-cy="pricing-grid">
        {pricingTiers.map((tier) => {
          const name = tier.title || (tier.content as any)?.name || "";
          const price = (tier.content as any)?.price || "";
          const period = (tier.content as any)?.period || "";
          const description =
            tier.description || (tier.content as any)?.description || "";
          return (
            <div
              key={tier.id}
              className={styles.pricingCard}
              data-cy="pricing-card"
            >
              <h3 className={styles.tierName}>{name}</h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>{price}</span>
                {period && <span className={styles.period}>{period}</span>}
              </div>
              <p className={styles.description}>{description}</p>
              <button className={styles.getStarted} data-cy="pricing-cta">
                Get started
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PricingSection;
