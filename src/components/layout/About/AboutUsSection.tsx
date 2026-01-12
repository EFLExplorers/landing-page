import styles from "./AboutUsSection.module.css";
import { PageSection } from "../../../pages/api/page-content";

export type TeamMember = {
  id: string;
  content_type: string;
  title: string;
  subtitle?: string;
  description?: string;
  content: {
    image_url?: string;
    expertise?: string[];
  };
  sort_order: number;
  active: boolean;
};

export type AboutStat = {
  id: string;
  content_type: string;
  title?: string;
  content: {
    number: string;
    label: string;
  };
  sort_order: number;
  active: boolean;
};

export type CoreValue = {
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

export interface AboutUsSectionProps {
  heroSection: PageSection | null;
  descriptionSection: PageSection | null;
  taglineSection: PageSection | null;
  missionSection: PageSection | null;
  visionSection: PageSection | null;
  teamIntroSection: PageSection | null;
  valuesHeaderSection: PageSection | null;
  teamMembers: TeamMember[];
  stats: AboutStat[];
  coreValues: CoreValue[];
}

export const AboutUsSection = ({
  heroSection,
  descriptionSection,
  taglineSection,
  missionSection,
  visionSection,
  teamIntroSection,
  valuesHeaderSection,
  teamMembers,
  stats,
  coreValues
}: AboutUsSectionProps) => {

  return (
    <section className={styles.aboutUs}>
      <div className={styles.container}>
        {heroSection && (
          <div className={styles.heroSection}>
            <h1 className={styles.title}>{heroSection.content?.title}</h1>
            <div className={styles.subtitle}>
              {heroSection.content?.subtitle}
            </div>
          </div>
        )}

        {descriptionSection && (
          <div className={styles.description}>
            <p>
              {descriptionSection.content?.body}
            </p>
            {stats && stats.length > 0 && (
              <div className={styles.statsGrid}>
                {stats.map((stat) => (
                  <div key={stat.id} className={styles.statItem}>
                    <div className={styles.statNumber}>{stat.content?.number}</div>
                    <div className={styles.statLabel}>{stat.content?.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {taglineSection && (
          <div className={styles.tagline}>
            <span className={styles.quoteMark}>"</span>
            {taglineSection.content?.body}
            <span className={styles.quoteMark}>"</span>
          </div>
        )}

        <div className={styles.infoSections}>
          {missionSection && (
          <div className={styles.mission}>
            <div className={styles.sectionHeader}>
              <div className={styles.iconContainer}>
                <span className={styles.icon}>{missionSection.content?.icon}</span>
              </div>
              <h2>{missionSection.content?.title}</h2>
            </div>
            <p>
              {missionSection.content?.body}
            </p>
            {missionSection.content?.points && (
              <div className={styles.missionPoints}>
                {(missionSection.content.points as string[]).map((point: string, index: number) => (
                  <div key={index} className={styles.point}>{point}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {visionSection && (
          <div className={styles.vision}>
            <div className={styles.sectionHeader}>
              <div className={styles.iconContainer}>
                <span className={styles.icon}>{visionSection.content?.icon}</span>
              </div>
              <h2>{visionSection.content?.title}</h2>
            </div>
            <p>
              {visionSection.content?.body}
            </p>
            {visionSection.content?.goals && (
              <div className={styles.visionGoals}>
                {(visionSection.content.goals as string[]).map((goal: string, index: number) => (
                  <div key={index} className={styles.goal}>{goal}</div>
                ))}
              </div>
            )}
          </div>
        )}

          <div className={styles.team}>
            {teamIntroSection && (
              <>
                <div className={styles.sectionHeader}>
                  <div className={styles.iconContainer}>
                    <span className={styles.icon}>{teamIntroSection.content?.icon}</span>
                  </div>
                  <h2>{teamIntroSection.content?.title}</h2>
                </div>
                <p className={styles.teamIntro}>
                  {teamIntroSection.content?.body}
                </p>
              </>
            )}
            {teamMembers && teamMembers.length > 0 && (
              <div className={styles.teamGrid}>
                {teamMembers.map((member) => (
                  <div key={member.id} className={styles.teamMember}>
                    <div className={styles.memberImage}>
                      <img
                        src={member.content?.image_url || "/assets/images/characters/default.png"}
                        alt={member.title}
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
                      <h3>{member.title}</h3>
                      <p className={styles.memberRole}>{member.subtitle}</p>
                      <p className={styles.memberTitle}>{member.content?.expertise?.join(', ') || 'Team Member'}</p>
                      <p className={styles.memberBio}>{member.description}</p>
                      <div className={styles.expertise}>
                        {member.content?.expertise?.map((skill: string, skillIndex: number) => (
                          <span key={skillIndex} className={styles.skillTag}>
                            {skill}
                          </span>
                        )) || []}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {valuesHeaderSection && coreValues && coreValues.length > 0 && (
          <div className={styles.values}>
            <h2>{valuesHeaderSection.content?.title}</h2>
            <div className={styles.valuesGrid}>
              {coreValues.map((value) => (
                <div key={value.id} className={styles.value}>
                  <div className={styles.valueIcon}>{value.content?.icon}</div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
