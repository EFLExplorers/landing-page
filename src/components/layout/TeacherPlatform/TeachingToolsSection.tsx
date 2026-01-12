import styles from "./TeachingToolsSection.module.css";

const teachingTools = [
  {
    name: "Lesson Planner",
    description:
      "Create and customize engaging lesson plans with templates, timing, and objectives.",
    icon: "📝",
  },
  {
    name: "Student Analytics",
    description:
      "Track student progress with dashboards, trends, and per-learner insights.",
    icon: "📈",
  },
  {
    name: "Interactive Resources",
    description:
      "Use games, multimedia, and activities to keep every lesson lively and fun.",
    icon: "🎮",
  },
  {
    name: "Assessment Tools",
    description:
      "Build quizzes, tests, and assignments with automated grading and feedback.",
    icon: "✅",
  },
  {
    name: "Progress Tracking",
    description:
      "Monitor mastery, gaps, and pacing with detailed reports and alerts.",
    icon: "📊",
  },
  {
    name: "Resource Library",
    description:
      "Browse ready-to-use slides, worksheets, and multimedia assets for any level.",
    icon: "📚",
  },
];

export const TeachingToolsSection = () => {
  return (
    <section className={styles.section} data-cy="teaching-tools-section">
      <div className={styles.card} data-cy="teaching-tools-card">
        <header className={styles.cardHeader}>
          <div>
            <p className={styles.kicker}>Tools for teachers</p>
            <h3 className={styles.cardTitle}>
              Everything you need, in one hub
            </h3>
            <p className={styles.cardSubtitle} data-cy="teaching-tools-intro">
              Plan faster, teach with confidence, and keep every student on
              track with our integrated toolkit.
            </p>
          </div>
          <div className={styles.badge} aria-hidden="true">
            ⚡️
          </div>
        </header>

        <div className={styles.toolGrid} data-cy="teaching-tools-grid">
          {teachingTools.map((tool) => (
            <article
              key={tool.name}
              className={styles.toolCard}
              data-cy="teaching-tool-card"
              data-tool-name={tool.name}
            >
              <div className={styles.toolIcon} aria-hidden="true">
                {tool.icon}
              </div>
              <div className={styles.toolContent}>
                <h4>{tool.name}</h4>
                <p>{tool.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.footerNote} data-cy="teaching-tools-outro">
          Pre-designed lesson plans for every level, interactive activities,
          grading, and analytics—so you can spend less time preparing and more
          time teaching.
        </div>
      </div>
    </section>
  );
};
