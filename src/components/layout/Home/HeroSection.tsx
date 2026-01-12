import Link from "next/link";
import { PageSection } from "../../../pages/api/page-content";
import styles from "./HeroSection.module.css";

export interface HeroSectionProps {
  section: PageSection | null;
}

export const HeroSection = ({ section }: HeroSectionProps) => {
  if (!section) return null;

  const title =
    (section.content as any)?.title ?? section.heading ?? section.title ?? "";
  const subtitle =
    (section.content as any)?.subtitle ??
    section.subheading ??
    section.subtitle ??
    "";
  const buttons = ((section.content as any)?.buttons ??
    (section.data as any)?.buttons ??
    []) as Array<{ label: string; href: string }>;

  const effectiveButtons =
    buttons && buttons.length
      ? buttons
      : [
          { label: "Register Student", href: "/Auth/register/student" },
          { label: "Register Teacher", href: "/Auth/register/teacher" },
        ];

  return (
    <section className={styles.hero} data-cy="hero-section">
      <div className={styles.content}>
        <h1 className={styles.title} data-cy="hero-title">
          {title}
        </h1>
        <p className={styles.subtitle} data-cy="hero-subtitle">
          {subtitle}
        </p>
        <div className={styles.buttonGroup}>
          {effectiveButtons.map((button) => (
            <Link
              key={button.href}
              href={button.href}
              className={styles.button}
              data-cy={
                button.href.includes("/student")
                  ? "hero-register-student"
                  : "hero-register-teacher"
              }
            >
              {button.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
