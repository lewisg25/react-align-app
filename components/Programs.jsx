import React from "react";
// import { Link } from "react-router";
const Programs = () => {
  return (
    <>
      <main className="programs-page">
        <section>
          <h1>Our Programs</h1>
          <p>
            Structured journeys designed to transform your relationship. Choose
            the program that fits your needs.
          </p>
        </section>

        <section className="couples-ess">
          <article className="program-card">
            <div className="card-header">
              <span>4 weeks</span>
              <span>Beginner</span>
            </div>
            <div className="card-content">
              <div className="card-icon">
                <i className="fa-solid fa-user-group" />
              </div>
              <div className="card-text">
                <h2>Couple Essentials</h2>
                <p>
                  Build a strong foundation with essential communication and
                  understanding skills.
                </p>
                <div className="feature-tags">
                  <span className="tag">Daily prompts</span>
                  <span className="tag">Video guides</span>
                  <span className="tag">Progress tracking</span>
                  <span className="tag">Partner exercises</span>
                </div>
                <button className="btn-outline">
                  Start This Program <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>
          </article>
        </section>

        <section className="deep-connection">
          <article className="program-card">
            <div className="card-header">
              <span>8 weeks</span>
              <span>Intermediate</span>
            </div>
            <div className="card-content">
              <div className="card-icon">
                <i className="fa-solid fa-heart" />
              </div>
              <div className="card-text">
                <h2>Deep Connection</h2>
                <p>
                  Go beyond the surface to truly understand your partner's inner
                  world.
                </p>
                <div className="feature-tags">
                  <span className="tag">Advanced prompts</span>
                  <span className="tag">Emotional mapping</span>
                  <span className="tag">Conflict resolution</span>
                  <span className="tag">Intimacy building</span>
                </div>
                <button className="btn-outline">
                  Start This Program <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>
          </article>
        </section>

        <section className="couple-plan">
          <article>
            <div className="plan-header">
              <div className="main-icon">
                <i className="fa-solid fa-user-group" />
              </div>
              <h2>The Couple Plan</h2>
              <p className="plan-description">
                Link your accounts and embark on this journey together. See each
                other's progress, share insights, and grow as one.
              </p>
            </div>
            <div className="plan-features">
              <div className="feature-item">
                <div className="feature-icon-circle">
                  <i className="fa-regular fa-heart" />
                </div>
                <span>Shared Dashboard</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon-circle">
                  <i className="fa-regular fa-calendar-check" />
                </div>
                <span>Synced Prompts</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon-circle">
                  <i className="fa-solid fa-wand-magic-sparkles" />
                </div>
                <span>Joint Insights</span>
              </div>
            </div>
            <div className="plan-cta">
              <button className="btn-primary">
                Get the Couple Plan <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </article>
        </section>
      </main>
    </>
  );
};

export default Programs;
