import React from "react";
import { useNavigate } from "react-router-dom";

const programs = [
  {
    className: "couples-ess",
    duration: "4 weeks",
    level: "Beginner",
    icon: "fa-user-group",
    title: "Couple Essentials",
    description: "Build a strong foundation with essential communication and understanding skills.",
    features: ["Daily prompts", "Video guides", "Progress tracking", "Partner exercises"],
  },
  {
    className: "deep-connection",
    duration: "8 weeks",
    level: "Intermediate",
    icon: "fa-heart",
    title: "Deep Connection",
    description: "Go beyond the surface to truly understand your partner's inner world.",
    features: ["Advanced prompts", "Emotional mapping", "Conflict resolution", "Intimacy building"],
  },
];

const couplePlanFeatures = [
  { icon: "fa-regular fa-heart", label: "Shared Dashboard" },
  { icon: "fa-regular fa-calendar-check", label: "Synced Prompts" },
  { icon: "fa-solid fa-wand-magic-sparkles", label: "Joint Insights" },
];

function ProgramCard({ program, onStart }) {
  return (
    <section className={program.className}>
      <article className="program-card">
        <div className="card-header">
          <span>{program.duration}</span>
          <span>{program.level}</span>
        </div>
        <div className="card-content">
          <div className="card-icon">
            <i className={`fa-solid ${program.icon}`} />
          </div>
          <div className="card-text">
            <h2>{program.title}</h2>
            <p>{program.description}</p>
            <div className="feature-tags">
              {program.features.map((feature) => <span className="tag" key={feature}>{feature}</span>)}
            </div>
            <button type="button" className="btn-outline" onClick={onStart}>
              Start This Program <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}

const Programs = () => {
  const navigate = useNavigate();
  const startProgram = () => navigate("/dashboard");

  return (
    <main className="programs-page">
      <section>
        <h1>Our Programs</h1>
        <p>Structured journeys designed to transform your relationship. Choose the program that fits your needs.</p>
      </section>

      {programs.map((program) => (
        <ProgramCard key={program.title} program={program} onStart={startProgram} />
      ))}

      <section className="couple-plan">
        <article>
          <div className="plan-header">
            <div className="main-icon">
              <i className="fa-solid fa-user-group" />
            </div>
            <h2>The Couple Plan</h2>
            <p className="plan-description">
              Link your accounts and embark on this journey together. See each other's progress,
              share insights, and grow as one.
            </p>
          </div>
          <div className="plan-features">
            {couplePlanFeatures.map(({ icon, label }) => (
              <div className="feature-item" key={label}>
                <div className="feature-icon-circle">
                  <i className={icon} />
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="plan-cta">
            <button className="btn-primary">
              Get the Couple Plan <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Programs;
