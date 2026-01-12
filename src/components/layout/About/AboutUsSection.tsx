import { PageSection } from "../../../pages/api/page-content";
import styles from "./AboutUsSection.module.css";

export interface TeamMember {
  id?: string;
  name: string;
  role?: string;
  title?: string;
  image?: string;
  bio?: string;
  expertise?: string[];
}

export interface AboutStat {
  id?: string;
  number: string;
  label: string;
}

export interface CoreValue {
  id?: string;
  title: string;
  description: string;
  icon?: string;
}

export interface AboutUsSectionProps {
  heroSection?: PageSection | null;
  descriptionSection?: PageSection | null;
  taglineSection?: PageSection | null;
  missionSection?: PageSection | null;
  visionSection?: PageSection | null;
  teamIntroSection?: PageSection | null;
  valuesHeaderSection?: PageSection | null;
  teamMembers?: TeamMember[];
  stats?: AboutStat[];
  coreValues?: CoreValue[];
}

const defaultTeamMembers: TeamMember[] = [
  {
    name: "Shinade Groves",
    role: "Chief Executive Officer",
    title: "CEO & Founder",
    image: "/assets/images/characters/Emma.png",
    bio: "Passionate about revolutionizing ESL education through innovative technology and engaging content.",
    expertise: ["Leadership", "Education Strategy", "Product Vision"],
  },
  {
    name: "Bobby Brown",
    role: "Lead Developer",
    title: "Technical Lead",
    image: "/assets/images/characters/Luke.png",
    bio: "Full-stack developer dedicated to creating seamless learning experiences through cutting-edge technology.",
    expertise: ["Full-Stack Development", "UI/UX", "System Architecture"],
  },
  {
    name: "Nathan Van Der Watt",
    role: "Senior Designer",
    title: "Creative Lead",
    image: "/assets/images/characters/Riley.png",
    bio: "Creative visionary focused on designing beautiful, intuitive interfaces that enhance the learning experience.",
    expertise: ["Visual Design", "User Experience", "Brand Identity"],
  },
];

const defaultStats: AboutStat[] = [
  { number: "10K+", label: "Students Worldwide" },
  { number: "500+", label: "Expert Teachers" },
  { number: "95%", label: "Success Rate" },
  { number: "24/7", label: "Learning Support" },
];

const defaultValues: CoreValue[] = [
  {
    title: "Excellence",
    description: "We strive for the highest quality in everything we create",
    icon: "🎓",
  },
  {
    title: "Community",
    description:
      "Building connections and fostering a supportive learning environment",
    icon: "🤝",
  },
  {
    title: "Innovation",
    description: "Continuously evolving and improving our learning methods",
    icon: "💡",
  },
  {
    title: "Accessibility",
    description: "Making quality education available to everyone, everywhere",
    icon: "🌍",
  },
];

const getSectionText = (
  section?: PageSection | null,
  key?: string,
  fallback = ""
) => {
  if (!section) return fallback;
  const contentText = (section.content as Record<string, any> | undefined)?.[
    key || "text"
  ];
  return (
    contentText ?? section.body ?? section.subtitle ?? section.title ?? fallback
  );
};

export const AboutUsSection = ({
  heroSection,
  descriptionSection,
  taglineSection,
  missionSection,
  visionSection,
  teamIntroSection,
  valuesHeaderSection,
  teamMembers = defaultTeamMembers,
  stats = defaultStats,
  coreValues = defaultValues,
}: AboutUsSectionProps) => {
  const safeTeamMembers = teamMembers?.length
    ? teamMembers
    : defaultTeamMembers;
  const safeStats = stats?.length ? stats : defaultStats;
  const safeValues = coreValues?.length ? coreValues : defaultValues;

  const heroTitle =
    heroSection?.title ||
    heroSection?.heading ||
    (heroSection?.content as Record<string, any> | undefined)?.title ||
    "About ESL Explorers";
  const heroSubtitle =
    heroSection?.subtitle ||
    heroSection?.subheading ||
    (heroSection?.content as Record<string, any> | undefined)?.subtitle ||
    "Pioneering the future of English language learning";

  return (
    <section className={styles.aboutUs} data-cy="about-page">
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <h1 className={styles.title} data-cy="about-title">
            {heroTitle}
          </h1>
          <div className={styles.subtitle} data-cy="about-subtitle">
            {heroSubtitle}
          </div>
        </div>

        <div className={styles.description} data-cy="about-description">
          <p>
            {getSectionText(
              descriptionSection,
              "body",
              "We&apos;re a passionate team of educators, developers, and designers committed to making English language learning an exciting adventure. Our mission is to break down language barriers and create a world where everyone can communicate confidently in English."
            )}
          </p>
          <div className={styles.statsGrid} data-cy="about-stats">
            {safeStats.map((stat) => (
              <div
                key={`${stat.id || stat.label}-${stat.number}`}
                className={styles.statItem}
                data-cy="about-stat"
              >
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.tagline} data-cy="about-tagline">
          <span className={styles.quoteMark}>"</span>
          {getSectionText(
            taglineSection,
            "text",
            "Adventure awaits - learn English with ESL Explorers"
          )}
          <span className={styles.quoteMark}>"</span>
        </div>

        <div className={styles.infoSections}>
          <div className={styles.mission} data-cy="about-mission">
            <div className={styles.sectionHeader}>
              <div className={styles.iconContainer}>
                <span className={styles.icon}>🎯</span>
              </div>
              <h2>
                {missionSection?.title ||
                  missionSection?.heading ||
                  "Our Mission"}
              </h2>
            </div>
            <p>
              {getSectionText(
                missionSection,
                "body",
                "At ESL Explorers, we believe learning English should be an exciting journey, not a daunting task. Our mission is to transform language education through innovative technology, engaging content, and personalized learning experiences. We empower both teachers and students with tools that make learning effective, enjoyable, and accessible to everyone, regardless of their background or location."
              )}
            </p>
            <div className={styles.missionPoints}>
              <div className={styles.point}>
                ✨ Interactive Learning Experiences
              </div>
              <div className={styles.point}>🌍 Global Community Building</div>
              <div className={styles.point}>📚 Comprehensive Curriculum</div>
            </div>
          </div>

          <div className={styles.vision} data-cy="about-vision">
            <div className={styles.sectionHeader}>
              <div className={styles.iconContainer}>
                <span className={styles.icon}>🔮</span>
              </div>
              <h2>
                {visionSection?.title || visionSection?.heading || "Our Vision"}
              </h2>
            </div>
            <p>
              {getSectionText(
                visionSection,
                "body",
                "We envision a world where language barriers dissolve and every individual can confidently communicate in English. Our platform will be the leading destination for ESL education, known for its innovative approach, engaging content, and proven results. We see a future where learning English is not just about grammar and vocabulary, but about connecting cultures and building bridges between people worldwide."
              )}
            </p>
            <div className={styles.visionGoals}>
              <div className={styles.goal}>🚀 Global Accessibility</div>
              <div className={styles.goal}>💡 Innovation Leadership</div>
              <div className={styles.goal}>🤝 Cultural Exchange</div>
            </div>
          </div>

          <div className={styles.team} data-cy="about-team">
            <div className={styles.sectionHeader}>
              <div className={styles.iconContainer}>
                <span className={styles.icon}>👥</span>
              </div>
              <h2>
                {teamIntroSection?.title ||
                  teamIntroSection?.heading ||
                  "Meet Our Team"}
              </h2>
            </div>
            <p className={styles.teamIntro}>
              {getSectionText(
                teamIntroSection,
                "body",
                "Our diverse team brings together expertise in education, technology, design, and content creation to deliver an exceptional learning experience."
              )}
            </p>
            <div className={styles.teamGrid} data-cy="about-team-grid">
              {safeTeamMembers.map((member) => (
                <div
                  key={member.id || member.name}
                  className={styles.teamMember}
                  data-cy="about-team-member"
                >
                  <div className={styles.memberImage}>
                    <img
                      src={member.image || "/assets/images/characters/Emma.png"}
                      alt={member.name}
                      className={styles.memberPhoto}
                    />
                    <div className={styles.memberOverlay}>
                      <div className={styles.socialLinks}>
                        <span className={styles.socialIcon}>💼</span>
                        <span className={styles.socialIcon}>📧</span>
                        <span className={styles.socialIcon}>🔗</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.memberInfo}>
                    <h3>{member.name}</h3>
                    {member.role && (
                      <p className={styles.memberRole}>{member.role}</p>
                    )}
                    {member.title && (
                      <p className={styles.memberTitle}>{member.title}</p>
                    )}
                    {member.bio && (
                      <p className={styles.memberBio}>{member.bio}</p>
                    )}
                    {member.expertise?.length ? (
                      <div className={styles.expertise}>
                        {member.expertise.map((skill, skillIndex) => (
                          <span
                            key={`${member.name}-${skill}-${skillIndex}`}
                            className={styles.skillTag}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.values} data-cy="about-values">
          <h2>
            {valuesHeaderSection?.title ||
              valuesHeaderSection?.heading ||
              "Our Core Values"}
          </h2>
          <div className={styles.valuesGrid} data-cy="about-values-grid">
            {safeValues.map((value) => (
              <div
                key={value.id || value.title}
                className={styles.value}
                data-cy="about-value"
              >
                <div className={styles.valueIcon}>{value.icon || "💡"}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
