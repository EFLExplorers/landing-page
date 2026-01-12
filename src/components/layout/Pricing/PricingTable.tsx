import Link from "next/link";
import styles from "./PricingTable.module.css";

export const PricingTable = () => {
  return (
    <section className={styles.pricing} data-cy="pricing-page">
      <div className={styles.header}>
        <div className={styles.badge} data-cy="pricing-badge">
          Pricing Plans
        </div>
        <h1 data-cy="pricing-title">Choose Your Perfect Plan</h1>
        <p data-cy="pricing-subtitle">
          Unlock endless possibilities with our flexible pricing options
          designed for every learner
        </p>
      </div>

      <div className={styles.plans} data-cy="pricing-plans">
        <div
          className={`${styles.plan} ${styles.basic}`}
          data-cy="pricing-plan-basic"
        >
          <div className={styles.planBadge} data-cy="pricing-plan-badge-basic">
            Free
          </div>
          <div className={styles.planHeader}>
            <h3>Basic</h3>
            <p className={styles.description}>
              Perfect for individual use and exploration of ESL learning
            </p>
            <div className={styles.price}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>0</span>
              <span className={styles.period}>/month</span>
            </div>
            <Link
              href="/Auth/register/student"
              className={styles.button}
              data-cy="pricing-button-basic"
            >
              Get Started Free
            </Link>
          </div>
          <div className={styles.divider}></div>
          <ul className={styles.features} data-cy="pricing-features-basic">
            <li>
              <span className={styles.checkmark}>✓</span>10 daily active users
            </li>
            <li>
              <span className={styles.checkmark}>✓</span>Basic learning
              resources access
            </li>
            <li>
              <span className={styles.checkmark}>✓</span>Limited ESL exercises
            </li>
            <li>
              <span className={styles.checkmark}>✓</span>Community support
            </li>
          </ul>
        </div>

        <div
          className={`${styles.plan} ${styles.premium} ${styles.featured}`}
          data-cy="pricing-plan-premium"
        >
          <div
            className={styles.planBadge}
            data-cy="pricing-plan-badge-premium"
          >
            Most Popular
          </div>
          <div className={styles.planHeader}>
            <h3>Premium</h3>
            <p className={styles.description}>
              Perfect for serious learners who want more features
            </p>
            <div className={styles.price}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>9.99</span>
              <span className={styles.period}>/month</span>
            </div>
            <Link
              href="/Auth/register/student"
              className={`${styles.button} ${styles.buttonPrimary}`}
              data-cy="pricing-button-premium"
            >
              Start Premium Trial
            </Link>
          </div>
          <div className={styles.divider}></div>
          <ul className={styles.features} data-cy="pricing-features-premium">
            <li>
              <span className={styles.checkmark}>✓</span>Unlimited active users
            </li>
            <li>
              <span className={styles.checkmark}>✓</span>Full learning resources
              access
            </li>
            <li>
              <span className={styles.checkmark}>✓</span>Priority email support
            </li>
            <li>
              <span className={styles.checkmark}>✓</span>Advanced ESL exercises
            </li>
            <li>
              <span className={styles.checkmark}>✓</span>Progress tracking
            </li>
            <li>
              <span className={styles.checkmark}>✓</span>Custom learning paths
            </li>
          </ul>
        </div>

        <div
          className={`${styles.plan} ${styles.enterprise}`}
          data-cy="pricing-plan-enterprise"
        >
          <div
            className={styles.planBadge}
            data-cy="pricing-plan-badge-enterprise"
          >
            Enterprise
          </div>
          <div className={styles.planHeader}>
            <h3>Enterprise</h3>
            <p className={styles.description}>
              Perfect for schools and large organizations
            </p>
            <div className={styles.price}>
              <span className={styles.amount}>Custom</span>
            </div>
            <Link
              href="/contact"
              className={`${styles.button} ${styles.buttonEnterprise}`}
              data-cy="pricing-button-enterprise"
            >
              Contact Sales Team
            </Link>
          </div>
          <div className={styles.divider}></div>
          <ul className={styles.features} data-cy="pricing-features-enterprise">
            <li>
              <span className={styles.checkmark}>✓</span>Custom user management
            </li>
            <li>
              <span className={styles.checkmark}>✓</span>Advanced analytics
            </li>
            <li>
              <span className={styles.checkmark}>✓</span>24/7 phone support
            </li>
            <li>
              <span className={styles.checkmark}>✓</span>Training workshops
            </li>
            <li>
              <span className={styles.checkmark}>✓</span>Custom curriculum
              development
            </li>
            <li>
              <span className={styles.checkmark}>✓</span>Dedicated account
              manager
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.footer} data-cy="pricing-footer">
        <p>All plans include a 14-day free trial. No credit card required.</p>
        <p>
          Need help choosing?{" "}
          <Link href="/contact" data-cy="pricing-contact-link">
            Contact our team
          </Link>
        </p>
      </div>
    </section>
  );
};

export default PricingTable;
