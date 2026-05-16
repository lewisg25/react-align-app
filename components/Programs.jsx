import React from "react";
import { Link } from "react-router";
const Programs = () => {
  return (
    <>
      <main classNameName="programs-page">
        <section>
          <h1>Our Programs</h1>
          <p>
            Structured journeys designed to transform your relationship. Choose
            the program that fits your needs.
          </p>
        </section>

        <section classNameName="couples-ess">
          <article classNameName="program-card">
            <div classNameName="card-header">
              <span>4 weeks</span>
              <span>Beginner</span>
            </div>
            <div classNameName="card-content">
              <div classNameName="card-icon">
                <i classNameName="fa-solid fa-user-group" />
              </div>
              <div classNameName="card-text">
                <h2>Couple Essentials</h2>
                <p>
                  Build a strong foundation with essential communication and
                  understanding skills.
                </p>
                <div classNameName="feature-tags">
                  <span classNameName="tag">Daily prompts</span>
                  <span classNameName="tag">Video guides</span>
                  <span classNameName="tag">Progress tracking</span>
                  <span classNameName="tag">Partner exercises</span>
                </div>
                <button classNameName="btn-outline">
                  Start This Program <i classNameName="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>
          </article>
        </section>

        <section classNameName="deep-connection">
          <article classNameName="program-card">
            <div classNameName="card-header">
              <span>8 weeks</span>
              <span>Intermediate</span>
            </div>
            <div classNameName="card-content">
              <div classNameName="card-icon">
                <i classNameName="fa-solid fa-heart" />
              </div>
              <div classNameName="card-text">
                <h2>Deep Connection</h2>
                <p>
                  Go beyond the surface to truly understand your partner's inner
                  world.
                </p>
                <div classNameName="feature-tags">
                  <span classNameName="tag">Advanced prompts</span>
                  <span classNameName="tag">Emotional mapping</span>
                  <span classNameName="tag">Conflict resolution</span>
                  <span classNameName="tag">Intimacy building</span>
                </div>
                <button classNameName="btn-outline">
                  Start This Program <i classNameName="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>
          </article>
        </section>

        <section classNameName="couple-plan">
          <article>
            <div classNameName="plan-header">
              <div classNameName="main-icon">
                <i classNameName="fa-solid fa-user-group" />
              </div>
              <h2>The Couple Plan</h2>
              <p classNameName="plan-description">
                Link your accounts and embark on this journey together. See each
                other's progress, share insights, and grow as one.
              </p>
            </div>
            <div classNameName="plan-features">
              <div classNameName="feature-item">
                <div classNameName="feature-icon-circle">
                  <i classNameName="fa-regular fa-heart" />
                </div>
                <span>Shared Dashboard</span>
              </div>
              <div classNameName="feature-item">
                <div classNameName="feature-icon-circle">
                  <i classNameName="fa-regular fa-calendar-check" />
                </div>
                <span>Synced Prompts</span>
              </div>
              <div classNameName="feature-item">
                <div classNameName="feature-icon-circle">
                  <i classNameName="fa-solid fa-wand-magic-sparkles" />
                </div>
                <span>Joint Insights</span>
              </div>
            </div>
            <div classNameName="plan-cta">
              <button classNameName="btn-primary">
                Get the Couple Plan <i classNameName="fa-solid fa-arrow-right" />
              </button>
            </div>
          </article>
        </section>
      </main>

      <footer classNameName="footer">
        <nav classNameName="footer-col">
          {/* <h4>Quick Links</h4> */}
          <div classNameName="quick-links">
            <ul>
            <Link to ="/how-it-works"></Link>
          <Link to = "/products"></Link>
          <Link to ="/programs"></Link>
          <Link to ="/contact"></Link>
            </ul>
          </div>
        </nav>
        <section classNameName="footer-col">
          {/* <h4>Get in Touch</h4> */}
          <p>Subscribe for updates or send a message.</p>
        </section>
        <div classNameName="footer-bottom">
          <p>
            Reach me at
            <i classNameName="fa-brands fa-github" />
            <i classNameName="fa-solid fa-at" />
            <i classNameName="fa-brands fa-linkedin" />
          </p>
        </div>
      </footer>
    </>
  );
};

export default Programs;
