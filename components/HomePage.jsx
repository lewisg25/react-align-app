import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fadeUp, popIn, stagger, useScrollReveal } from "../src/scrollMotion";

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
  const heroReveal = useScrollReveal(0.1);
  const reveal = useScrollReveal();

  return (
    <main className="home-page">
      <Motion.section
        className="home-hero"
        variants={stagger}
        {...heroReveal}
      >
        <Motion.div className="home-copy" variants={fadeUp}>
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
        </Motion.div>

        <Motion.aside
          className="home-preview"
          aria-label="Alignment dashboard preview"
          variants={popIn}
        >
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
        </Motion.aside>
      </Motion.section>

      <Motion.section className="home-flow" variants={stagger} {...reveal}>
        {expectationItems.map((item, index) => (
          <Motion.article key={item} variants={popIn}>
            <span>{index + 1}</span>
            <p>{item}</p>
          </Motion.article>
        ))}
      </Motion.section>

      <Motion.section
        className="home-feature-grid"
        variants={stagger}
        {...reveal}
      >
        {featureCards.map(({ icon, title, copy }) => (
          <Motion.article
            className="home-feature-card"
            key={title}
            variants={popIn}
          >
            <div className="home-icon">
              <i className={`fa-solid ${icon}`} />
            </div>
            <h3>{title}</h3>
            <p>{copy}</p>
          </Motion.article>
        ))}
      </Motion.section>

      <Motion.section className="home-cta" variants={fadeUp} {...reveal}>
        <h2>Ready to see where you align?</h2>
        <button className="btn-submit" onClick={() => navigate("/login")}>
          Create account
        </button>
      </Motion.section>
    </main>
  );
};

export default HomePage;
