import React from "react";

const Products = () => {
  return (
    <>
      <main>
        <section className="pricing-section">
          <div className="pricing-header">
            <h1>
              Choose Your <span>Plan</span>
            </h1>
            <p>
              Find the perfect plan for your relationship journey. All plans
              include our core features.
            </p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="card-top">
                <h3>Free</h3>
                <div className="price">
                  $0<span>/forever</span>
                </div>
                <p>Perfect for couples starting their alignment journey.</p>
              </div>
              <ul className="features-list">
                <li>
                  <span>
                    <i className="fa-solid fa-check"></i>
                  </span>{" "}
                  Daily prompts (limited)
                </li>
                <li>
                  <span>
                    <i className="fa-solid fa-check"></i>
                  </span>{" "}
                  Basic alignment insights
                </li>
                <li>
                  <span>
                    <i className="fa-solid fa-check"></i>
                  </span>{" "}
                  Partner linking
                </li>
                <li>
                  <span>
                    <i className="fa-solid fa-check"></i>
                  </span>{" "}
                  Weekly check-ins
                </li>
                <li>
                  <span>
                    <i className="fa-solid fa-check"></i>
                  </span>{" "}
                  Community access
                </li>
              </ul>
              <button className="btn-outline">Start Free</button>
            </div>

            <div className="pricing-card premium">
              <div className="badge">Most Popular</div>
              <div className="card-top">
                <h3>Premium</h3>
                <div className="price">
                  $12<span>/per month</span>
                </div>
                <p>For couples serious about deepening their connection.</p>
              </div>
              <ul className="features-list">
                <li>
                  <span>
                    <i className="fa-solid fa-check"></i>
                  </span>{" "}
                  Unlimited daily prompts
                </li>
                <li>
                  <span>
                    <i className="fa-solid fa-check"></i>
                  </span>{" "}
                  Advanced alignment analytics
                </li>
                <li>
                  <span>
                    <i className="fa-solid fa-check"></i>
                  </span>{" "}
                  Priority partner matching
                </li>
                <li>
                  <span>
                    <i className="fa-solid fa-check"></i>
                  </span>{" "}
                  Personalized programs
                </li>
                <li>
                  <span>
                    <i className="fa-solid fa-check"></i>
                  </span>{" "}
                  1:1 coaching sessions
                </li>
                <li>
                  <span>
                    <i className="fa-solid fa-check"></i>
                  </span>{" "}
                  Exclusive content library
                </li>
                <li>
                  <span>
                    <i className="fa-solid fa-check"></i>
                  </span>{" "}
                  Early access to features
                </li>
              </ul>
              <button className="btn-solid">Go Premium</button>
            </div>
          </div>
        </section>
        <section className="our-mission">
          <div className="mission-header">
            <span className="mission-icon">
              <i className="fa-solid fa-burst"></i>
            </span>
            <h2>Our Mission & Philosophy</h2>
          </div>

          <div className="mission-grid">
            <div className="mission-card">
              <div className="card-icon">
                <i className="fa-solid fa-crosshairs"></i>
              </div>
              <h3>Who ALIGN is For</h3>
              <p>
                ALIGN is designed for couples at any stage—newlyweds, long-term
                partners, or those working to reconnect. Whether you're thriving
                or facing challenges, we're here to help.
              </p>
            </div>

            <div className="mission-card">
              <div className="card-icon">
                <i className="fa-solid fa-heart"></i>
              </div>
              <h3>Why Mental & Emotional Alignment</h3>
              <p>
                True connection goes beyond the surface. When partners
                understand each other's thoughts, feelings, and needs, they
                build a foundation that can weather any storm.
              </p>
            </div>

            <div className="mission-card">
              <div className="card-icon">
                <i className="fa-solid fa-venus-mars"></i>
              </div>
              <h3>Built by Experts</h3>
              <p>
                Our programs are developed with relationship therapists,
                psychologists, and couples who've walked the path. Every prompt
                is crafted with intention.
              </p>
            </div>

            <div className="mission-card">
              <div className="card-icon">
                <i className="fa-solid fa-fingerprint"></i>
              </div>
              <h3>Your Privacy Matters</h3>
              <p>
                Your conversations and data are sacred. We use bank-level
                encryption and never share your personal information. Your
                journey is yours alone.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Products;
