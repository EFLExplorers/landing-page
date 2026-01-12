import { PageSection } from "../../../pages/api/page-content";
import styles from "./HowWeTeachSection.module.css";

export interface HowWeTeachSectionProps {
  section: PageSection | null;
}

interface HowWeTeachCard {
  title: string;
  content?: string;
  description?: string;
  icon?: string;
}

export const HowWeTeachSection = ({ section }: HowWeTeachSectionProps) => {
  if (!section) return null;

  const title =
    (section.content as any)?.title ?? section.heading ?? section.title ?? "";
  const description =
    (section.content as any)?.description ??
    (section.content as any)?.subtitle ??
    section.subheading ??
    section.subtitle ??
    "";
  const cards =
    ((section.content as any)?.tabs as HowWeTeachCard[] | undefined) ?? [];

  const fallbackCards: HowWeTeachCard[] = [
    {
      title: "Lessons",
      content:
        "Interactive lessons designed by experts to help you master new concepts quickly and effectively.",
      icon: "📘",
    },
    {
      title: "Activities",
      content:
        "Hands-on activities that reinforce learning through practical application of concepts.",
      icon: "🧩",
    },
    {
      title: "Minigames",
      content:
        "Fun and engaging minigames that make learning enjoyable while testing your knowledge.",
      icon: "🎮",
    },
    {
      title: "Assessments",
      content:
        "Comprehensive assessments to track your progress and identify areas for improvement.",
      icon: "🧠",
    },
    {
      title: "Projects",
      content:
        "Collaborative projects that let learners build, present, and get feedback on real-world tasks.",
      icon: "🛠️",
    },
    {
      title: "Coaching",
      content:
        "Guided coaching and feedback loops to reinforce strengths and close learning gaps quickly.",
      icon: "🎯",
    },
  ];

  const itemsToRender = (() => {
    if (!cards.length) return fallbackCards;

    const existingTitles = new Set(
      cards.map((card) => (card.title || "").toLowerCase().trim())
    );

    const missingFallbacks = fallbackCards.filter(
      (card) => !existingTitles.has(card.title.toLowerCase().trim())
    );

    return [...cards, ...missingFallbacks];
  })();

  const defaultIcons = ["📘", "🧩", "🎮", "🧠", "🛠️", "🎯"];

  const itemsWithIcons = itemsToRender.map((card, index) => ({
    ...card,
    icon: card.icon || defaultIcons[index % defaultIcons.length],
  }));

  return (
    <section className={styles.teaching}>
      <div className={styles.content}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {description && <p className={styles.subtitle}>{description}</p>}

        <div className={styles.methodsGrid}>
          {itemsWithIcons.map((card, index) => (
            <div key={`${card.title}-${index}`} className={styles.methodCard}>
              <div className={styles.methodIcon}>{card.icon}</div>
              <h3 className={styles.methodTitle}>{card.title}</h3>
              <p className={styles.methodDescription}>
                {card.content || card.description || ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeTeachSection;
