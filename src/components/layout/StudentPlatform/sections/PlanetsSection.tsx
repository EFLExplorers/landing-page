import { useEffect, useMemo, useState } from "react";
import styles from "@/pages/platforms/student.module.css";

const planets = [
  { name: "Earth", color: "var(--theme-muted)", icon: "🌍" },
  { name: "Mars", color: "var(--accent)", icon: "🔴" },
  { name: "Venus", color: "var(--text-secondary)", icon: "🟠" },
  { name: "Jupiter", color: "var(--theme-foreground)", icon: "🪐" },
  { name: "Saturn", color: "var(--theme-muted-foreground)", icon: "🪐" },
  { name: "Neptune", color: "var(--primary-three)", icon: "🔵" },
];

export const StudentPlanetsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % planets.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + planets.length) % planets.length);
  };

  const calculatePlanetStyle = useMemo(
    () => (index: number) => {
      const angle = (360 / planets.length) * index;
      const radius = 300;
      const zOffset = Math.cos((angle * Math.PI) / 180) * 100;

      return {
        "--planet-color": planets[index].color,
        transform: `
          rotate(${angle + (isSpinning ? currentSlide * 36 : 0)}deg)
          translateX(${radius}px)
          scale(${index === currentSlide ? 1.2 : 0.8})
          translateZ(${zOffset}px)
        `,
        zIndex: Math.round(zOffset),
      } as React.CSSProperties;
    },
    [currentSlide, isSpinning]
  );

  useEffect(() => {
    if (isSpinning) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [isSpinning]);

  return (
    <section className={styles.planets} data-cy="student-planets-section">
      <h2 data-cy="student-planets-title">Explore our planets</h2>
      <div className={styles.planetCarousel}>
        <button
          className={styles.carouselButton}
          onClick={prevSlide}
          aria-label="Previous planet"
          data-cy="student-planets-prev"
        >
          &lt;
        </button>

        <div className={styles.planetCircles}>
          <div className={styles.windmill} data-cy="student-planets-windmill">
            {planets.map((planet, index) => (
              <div
                key={planet.name}
                className={`${styles.planetCircle} ${
                  index === currentSlide ? styles.activePlanet : ""
                }`}
                style={calculatePlanetStyle(index)}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsSpinning(false);
                }}
                data-cy="student-planet-circle"
                data-planet-name={planet.name}
                aria-label={planet.name}
              >
                <span className={styles.planetIcon} aria-hidden="true">
                  {planet.icon}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          className={styles.carouselButton}
          onClick={nextSlide}
          aria-label="Next planet"
          data-cy="student-planets-next"
        >
          &gt;
        </button>
      </div>
      <p className={styles.planetName} data-cy="student-planet-name">
        {planets[currentSlide].name}
      </p>
      <button
        className={`${styles.spinButton} ${isSpinning ? styles.active : ""}`}
        onClick={() => setIsSpinning(!isSpinning)}
        data-cy="student-planets-toggle"
      >
        {isSpinning ? "Stop Rotation" : "Start Rotation"}
      </button>
    </section>
  );
};

export default StudentPlanetsSection;
