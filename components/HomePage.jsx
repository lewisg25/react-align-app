import { useNavigate } from "react-router-dom";

const featureCards = [
  {
    icon: "fa-heart",
    title: "Daily check-ins",
    copy: "Answer one focused relationship question and keep the habit simple.",
  },
  {
    icon: "fa-venus-mars",
    title: "Shared insight",
    copy: "Turn saved responses into alignment categories you can talk through.",
  },
  {
    icon: "fa-star",
    title: "Clear next step",
    copy: "See the gap, then use one prompt to reconnect with intention.",
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
    <main className="home-page">
      <section className="home-hero">
        <div className="home-copy">
          <p className="home-eyebrow">
            <i className="fa-solid fa-star" /> Emotional wellness for couples
          </p>
          <h1>
            Stay aligned through better daily conversations.
          </h1>
          <p className="home-lede">
            ALIGN helps couples answer thoughtful check-ins, spot relationship
            gaps, and turn those insights into simple next steps.
          </p>
          <div className="home-actions">
            <button className="btn-submit" onClick={() => navigate("/login")}>
              Start check-in
            </button>
            <button
              className="home-secondary-button"
              onClick={() => navigate("/how-it-works")}
            >
              How it works
            </button>
          </div>
          <ul className="home-tags">
            {ctaTags.map((tag) => (
              <li key={tag}>
                <i className="fa-solid fa-check" /> {tag}
              </li>
            ))}
          </ul>
        </div>

        <aside className="home-preview" aria-label="Alignment dashboard preview">
          <div className="preview-score">
            <span>78%</span>
            <p>Overall alignment</p>
          </div>
          {["Communication", "Future Planning", "Connection"].map(
            (category, index) => (
              <div className="preview-row" key={category}>
                <span>{category}</span>
                <strong>{[72, 64, 86][index]}%</strong>
              </div>
            )
          )}
        </aside>
      </section>

      <section className="home-flow">
        {expectationItems.map((item, index) => (
          <article key={item}>
            <span>{index + 1}</span>
            <p>{item}</p>
          </article>
        ))}
      </section>

      <section className="home-feature-grid">
        {featureCards.map(({ icon, title, copy }) => (
          <article className="home-feature-card" key={title}>
            <div className="home-icon">
              <i className={`fa-solid ${icon}`} />
            </div>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="home-cta">
        <h2>Ready to see where you align?</h2>
        <button className="btn-submit" onClick={() => navigate("/login")}>
          Create account
        </button>
      </section>
    </main>
  );
};

export default HomePage;
