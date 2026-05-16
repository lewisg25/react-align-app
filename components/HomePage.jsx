import React from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <main className="main">
      <section className="hero">
        <div className="top-main">
          <i className="fa-solid fa-star" /> Emotionally Wellness for Couples
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
            <li>A quick questionnaire about your relationship</li>
            <li>Personalized program recommendations</li>
            <li>Option to invite your partner</li>
          </ul>
        </figure>
        <button className="cta">
          Let's Begin <i className="fa-solid fa-arrow-right" />
        </button>
      </section>

      <section className="features">
        <div className="features-container">
          <article className="feature-card">
            <div className="icon">
              <i className="fa-solid fa-heart" />
            </div>
            <h3>Daily Prompts</h3>
            <p>
              Thoughtful questions to spark meaningful conversations and
              emotional check-ins.
            </p>
          </article>
          <article className="feature-card">
            <div className="icon">
              <i className="fa-solid fa-venus-mars" />
            </div>
            <h3>Partner Connection</h3>
            <p>
              Link accounts to share your journey and see alignment insights
              together.
            </p>
          </article>
          <article className="feature-card">
            <div className="icon">
              <i className="fa-solid fa-star" />
            </div>
            <h3>Discover Gaps</h3>
            <p>
              Identify areas where you can grow closer and understand each other
              better.
            </p>
          </article>
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-container">
          <h2 className="cta-heading">Ready to Align?</h2>
          <p className="cta-p">
            Join thousands of couples who are building stronger, more connected
            relationships.
          </p>
          <ul className="cta-tags" role="list">
            <li>
              <i className="fa-solid fa-check" /> Free to start
            </li>
            <li>
              <i className="fa-solid fa-check" /> No credit card required
            </li>
            <li>
              <i className="fa-solid fa-check" /> Cancel anytime
            </li>
          </ul>
          <button className="cta-button">Get Started</button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
