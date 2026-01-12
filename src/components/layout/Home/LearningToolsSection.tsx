import { LearningTool } from "../../../pages/api/content";
import styles from "./LearningToolsSection.module.css";

export interface LearningToolsSectionProps {
  tools: LearningTool[];
}

export const LearningToolsSection = ({ tools }: LearningToolsSectionProps) => {
  if (!tools?.length) return null;

  return (
    <section className={styles.tools} data-cy="learning-tools-section">
      <div className={styles.content}>
        <h2 className={styles.title} data-cy="learning-tools-title">
          Learning Tools
        </h2>
        <p className={styles.subtitle} data-cy="learning-tools-subtitle">
          Discover our comprehensive suite of tools designed to make learning
          English engaging and effective
        </p>

        <div className={styles.toolsGrid} data-cy="learning-tools-grid">
          {tools.map((tool) => {
            const name = tool.title || (tool.content as any)?.title || "";
            const description =
              tool.description || (tool.content as any)?.description || "";
            const icon = (tool.content as any)?.icon || "";

            return (
              <div
                key={tool.id}
                className={styles.toolCard}
                data-cy="learning-tool-card"
              >
                <div className={styles.toolIcon}>{icon}</div>
                <h3 className={styles.toolTitle}>{name}</h3>
                <p className={styles.toolDescription}>{description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LearningToolsSection;
