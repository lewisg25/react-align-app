import { useNavigate } from "react-router-dom";

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
    <article
      className={program.isFeatured ? "pricing-card premium" : "pricing-card"}
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
    </article>
  );
}

const Programs = () => {
  const navigate = useNavigate();

  return (
    <main>
      <section className="pricing-section">
        <div className="pricing-header">
          <h1>
            Choose Your <span>Program</span>
          </h1>
          <p>
            Structured journeys designed to transform your relationship. Choose
            the program that fits your needs.
          </p>
        </div>

        <div className="pricing-grid">
          {programCards.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onStart={() => navigate("/dashboard")}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Programs;
