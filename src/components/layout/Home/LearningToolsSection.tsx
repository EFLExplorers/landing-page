import styles from "./LearningToolsSection.module.css";

export type LearningTool = {
  id: string;
  content_type: string;
  title: string;
  description: string;
  content: {
    icon: string;
  };
  sort_order: number;
  active: boolean;
};

export interface LearningToolsSectionProps {
  tools: LearningTool[];
}

export const LearningToolsSection = ({ tools }: LearningToolsSectionProps) => {
  // Database-driven content only
  if (!tools || tools.length === 0) return null;

  return (
    <section className={styles.tools}>
      <div className={styles.content}>
        <h2 className={styles.title}>Learning Tools</h2>
        <p className={styles.subtitle}>
          Discover our comprehensive suite of tools designed to make learning
          English engaging and effective
        </p>

        <div className={styles.toolsGrid}>
          {tools.map((tool) => (
            <div key={tool.id} className={styles.toolCard}>
              <div className={styles.toolIcon}>{tool.content.icon}</div>
              <h3 className={styles.toolTitle}>{tool.title}</h3>
              <p className={styles.toolDescription}>{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningToolsSection;
