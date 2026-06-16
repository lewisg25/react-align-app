import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fadeUp, popIn, stagger, useScrollReveal } from "../src/scrollMotion";

const programCards = [
  {
    id: "essentials",
    name: "Couple Essentials",
    duration: "4 weeks",
    level: "Beginner",
    description:
      "Build a strong foundation with essential communication and understanding skills.",
    cta: "Start Program",
    features: ["Daily prompts", "Video guides", "Progress tracking", "Partner exercises"],
  },
  {
    id: "deep-connection",
    name: "Deep Connection",
    duration: "8 weeks",
    level: "Intermediate",
    description:
      "Go beyond the surface to truly understand your partner's inner world.",
    cta: "Start Program",
    isFeatured: true,
    features: [
      "Advanced prompts",
      "Emotional mapping",
      "Conflict resolution",
      "Intimacy building",
    ],
  },
];

function ProgramCard({ program, onStart }) {
  return (
    <Motion.article
      className={program.isFeatured ? "pricing-card premium" : "pricing-card"}
      variants={popIn}
    >
      {program.isFeatured && <div className="badge">Most Popular</div>}
      <div className="card-top">
        <h3>{program.name}</h3>
        <div className="price">
          {program.duration}
          <span> / {program.level}</span>
        </div>
        <p>{program.description}</p>
      </div>
      <ul className="features-list">
        {program.features.map((feature) => (
          <li key={feature}>
            <span>
              <i className="fa-solid fa-check" />
            </span>{" "}
            {feature}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={program.isFeatured ? "btn-solid" : "btn-outline"}
        onClick={onStart}
      >
        {program.cta}
      </button>
    </Motion.article>
  );
}

const Programs = () => {
  const navigate = useNavigate();
  const reveal = useScrollReveal();

  return (
    <main>
      <Motion.section
        className="pricing-section"
        variants={stagger}
        {...reveal}
      >
        <Motion.div className="pricing-header" variants={fadeUp}>
          <h1>
            Choose Your <span>Program</span>
          </h1>
          <p>
            Structured journeys designed to transform your relationship. Choose
            the program that fits your needs.
          </p>
        </Motion.div>

        <Motion.div className="pricing-grid" variants={stagger}>
          {programCards.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onStart={() => navigate("/dashboard")}
            />
          ))}
        </Motion.div>
      </Motion.section>
    </main>
  );
};

export default Programs;
