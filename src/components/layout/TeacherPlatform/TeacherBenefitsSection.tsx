import styles from "./TeacherBenefitsSection.module.css";

export const TeacherBenefitsSection = () => {
  return (
    <section
      className={styles.teacherBenefits}
      data-cy="teacher-benefits-section"
    >
      <h2 data-cy="teacher-benefits-title">
        Why Teachers Choose ESL Explorers
      </h2>
      <div className={styles.benefitsGrid} data-cy="teacher-benefits-grid">
        <div className={styles.benefitCard} data-cy="teacher-benefit-card">
          <h3>Ready-Made Content</h3>
          <p>
            Access hundreds of pre-designed lesson plans, activities, and
            assessments that save you hours of preparation time.
          </p>
        </div>
        <div className={styles.benefitCard} data-cy="teacher-benefit-card">
          <h3>Student Progress Tracking</h3>
          <p>
            Monitor individual and class progress with detailed analytics and
            performance reports.
          </p>
        </div>
        <div className={styles.benefitCard} data-cy="teacher-benefit-card">
          <h3>Interactive Learning</h3>
          <p>
            Engage students with gamified lessons, multimedia content, and
            collaborative activities.
          </p>
        </div>
        <div className={styles.benefitCard} data-cy="teacher-benefit-card">
          <h3>Flexible Scheduling</h3>
          <p>
            Manage your classes with flexible scheduling tools and automated
            reminders for students.
          </p>
        </div>
      </div>
    </section>
  );
};
