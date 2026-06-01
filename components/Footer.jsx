import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
       

          <section className="footer-col footer-bottom">
            <h4>Connect</h4>

            <div className="social-icons">
              <a
                href="https://github.com/lewisg25"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="mailto:lewis.garnett96@yahoo.com" aria-label="Email">
                <i className="fa-solid fa-at"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/lewis-garnett-dev/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
            <p className="copyright">
              &copy; {new Date().getFullYear()} ALIGN. All rights reserved.
            </p>
          </section>
          
        </div>
      </footer>
    </>
  );
};

export default Footer;
