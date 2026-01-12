import Image from "next/image";
import styles from "@/pages/platforms/student.module.css";

const characters = [
  {
    name: "Cassidy",
    imageUrl: "/assets/images/characters/Cassidy.png",
  },
  {
    name: "Emma",
    imageUrl: "/assets/images/characters/Emma.png",
  },
  {
    name: "Luke",
    imageUrl: "/assets/images/characters/Luke.png",
  },
  {
    name: "Riley",
    imageUrl: "/assets/images/characters/Riley.png",
  },
];

export const StudentCharactersSection = () => {
  return (
    <section className={styles.characters} data-cy="student-characters-section">
      <div className={styles.characterContent}>
        <div className={styles.characterGridContainer}>
          <p className={styles.characterText} data-cy="student-characters-copy">
            Help the gang unlock items by completing guided tasks. As you move
            ahead, they stay around to guide you on the ESL Explorer, and give
            rewards and English skills!
          </p>
          <div
            className={styles.characterGrid}
            data-cy="student-characters-grid"
          >
            {characters.map((character) => (
              <div
                key={character.name}
                className={styles.characterCircle}
                data-cy="student-character-card"
              >
                <div className={styles.characterAvatar}>
                  <Image
                    src={character.imageUrl}
                    alt={character.name}
                    width={80}
                    height={80}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className={styles.characterName}>{character.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.featureText} data-cy="student-characters-outro">
          <p>
            With 3D lessons per planet, equipping learners with a solid
            foundation in English. Each lesson allows you to practice everyday
            English. That&apos;s the lessons already prepared for teachers,
            allowing them to focus on their main passion: teaching! Students can
            track their progress and become masters of the English language.
            Learning English has never been this easy!
          </p>
        </div>
      </div>
    </section>
  );
};

export default StudentCharactersSection;
