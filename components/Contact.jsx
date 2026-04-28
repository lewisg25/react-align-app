import React from "react";

const Contacts = () => {
  return (
    <>
      <main className="contact-page">
        <section className="contact-hero">
          <h1>
            Get in <span>Touch</span>
          </h1>
          <p>
            Have questions? We're here to help you on your alignment journey.
          </p>
        </section>

        <div className="contact-grid">
          <section className="contact-form-container">
            <h3>
              <i className="fa-regular fa-comment-dots"></i> Send us a Message
            </h3>
            <form action="#">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="How can we help?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Tell us more..."
                ></textarea>
              </div>

              <button type="submit" className="btn-solid btn-full">
                Send Message
              </button>
            </form>
          </section>

          <aside className="contact-sidebar">
            <div className="info-card">
              <h3>Contact Information</h3>

              <div className="info-item">
                <div className="info-icon">
                  <i className="fa-regular fa-envelope"></i>
                </div>
                <div className="info-text">
                  <h3>Email</h3>
                  <p>lewis.garnett96@yahoo.com</p>
                  <p>support@aligntogether.com</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className="info-text">
                  <h4>Phone</h4>
                  <p>(270) 952-9944</p>
                  <p className="sub-text">Mon-Fri, 9am-5pm EST</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className="info-text">
                  <h4>Address</h4>
                  <p>123 Connection Street</p>
                  <p>Lansdale, PA 19446</p>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Quick Links</h3>
              <div className="quick-links-grid">
                <a href="#">
                  <i className="fa-regular fa-circle-question"></i> Help Center
                </a>
                <a href="#">
                  <i className="fa-regular fa-file-lines"></i> Privacy Policy
                </a>
                <a href="#">
                  <i className="fa-solid fa-shield-halved"></i> Terms of Service
                </a>
              </div>
            </div>
          </aside>
        </div>

        <section className="faq-section">
          <h2>
            Frequently Asked <span>Questions</span>
          </h2>

          <div className="faq-container">
            <details className="faq-item">
              <summary>
                How does ALIGN work for couples?{" "}
                <i className="fa-solid fa-chevron-down"></i>
              </summary>
              <div className="faq-answer">
                <p>
                  ALIGN connects both partners through a shared interface where
                  you can complete exercises, track emotional trends, and
                  receive personalized relationship insights together.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary>
                Can I use ALIGN without my partner?{" "}
                <i className="fa-solid fa-chevron-down"></i>
              </summary>
              <div className="faq-answer">
                <p>
                  Yes, you can use our Individual Plan to focus on personal
                  growth and relationship skills before inviting a partner to
                  join you.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary>
                Is my data private and secure?{" "}
                <i className="fa-solid fa-chevron-down"></i>
              </summary>
              <div className="faq-answer">
                <p>
                  Absolutely. We use end-to-end encryption for all shared
                  messages and private notes to ensure your intimacy remains
                  between you and your partner.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary>
                Can I cancel my subscription anytime?{" "}
                <i className="fa-solid fa-chevron-down"></i>
              </summary>
              <div className="faq-answer">
                <p>
                  Yes, you can manage or cancel your subscription at any time
                  through your account settings without any hidden fees.
                </p>
              </div>
            </details>
          </div>
        </section>
      </main>

      <footer className="footer-container">
        <nav className="footer-col">
          <h4>Quick Links</h4>
          <div className="quick-links">
            <ul>
              <li>
                <a href="how-it-works.html" className="q-a">
                  How It Works
                </a>
              </li>
              <li>
                <a href="products.html" className="q-a">
                  Products
                </a>
              </li>
              <li>
                <a href="Programs.html" className="q-a">
                  Programs
                </a>
              </li>
              <li>
                <a href="get-started.html" className="q-a">
                  Get Started
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <section className="footer-col">
          <h4>Get in Touch</h4>
          <p>Subscribe for updates or send a message.</p>
        </section>

        <div className="footer-bottom">
          <p>
            Reach me at <i className="fa-brands fa-github"></i>
            <i className="fa-solid fa-at"></i>
            <i className="fa-brands fa-linkedin"></i>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Contacts;
