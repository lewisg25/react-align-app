import { useNavigate } from "react-router-dom";

const featureCards = [
  {
    icon: "fa-heart",
    title: "Daily Prompts",
    copy: "Thoughtful questions to spark meaningful conversations and emotional check-ins.",
  },
  {
    icon: "fa-venus-mars",
    title: "Partner Connection",
    copy: "Link accounts to share your journey and see alignment insights together.",
  },
  {
    icon: "fa-star",
    title: "Discover Gaps",
    copy: "Identify areas where you can grow closer and understand each other better.",
  },
];

const expectationItems = [
  "A quick questionnaire about your relationship",
  "Personalized program recommendations",
  "Option to invite your partner",
];

const ctaTags = ["Free to start", "No credit card required", "Cancel anytime"];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <main className="main">
      <section className="hero">
        <div className="top-main">
          <i className="fa-solid fa-star" /> Emotional Wellness for Couples
        </div>
        <h1 id="hero-heading">
          Welcome to <span>ALIGN</span>
        </h1>
        <p className="subtitle">
          Stay Emotionally &amp; Mentally Aligned Together
        </p>
        <p>
          Discover alignment gaps, strengthen your bond with daily prompts, and
          build a deeper connection with your partner through guided emotional
          check-ins.
        </p>
        <figure className="card">
          <h3>What to expect:</h3>
          <ul>
            {expectationItems.map((expectation) => (
              <li key={expectation}>{expectation}</li>
            ))}
          </ul>
        </figure>
      </section>

      <section className="features">
        <div className="features-container">
          {featureCards.map(({ icon, title, copy }) => (
            <article className="feature-card" key={title}>
              <div className="icon">
                <i className={`fa-solid ${icon}`} />
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-container">
          <h2 className="cta-heading">Ready to Align?</h2>
          <p className="cta-p">
            Join thousands of couples who are building stronger, more connected
            relationships.
          </p>
          <ul className="cta-tags">
            {ctaTags.map((tag) => (
              <li key={tag}>
                <i className="fa-solid fa-check" /> {tag}
              </li>
            ))}
          </ul>
          <button className="cta-button" onClick={() => navigate("/login")}>
            Create Account
          </button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
