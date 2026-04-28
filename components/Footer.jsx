import React from "react";

const Footer = () => {
    return (
        <>
         <footer className="footer">

<nav className="footer-col">

  <h4>Quick Links</h4>
  <div className="quick-links">
    <ul>
      <li><a href="how-it-works.html" className="q-a">How It Works</a></li>
      <li><a href="products.html" className="q-a">Products</a></li>
      <li><a href="Programs.html" className="q-a">Programs</a></li>
      <li><a href="get-started.html" className="q-a">Get Started</a></li>
    </ul>
  </div>

</nav>



<div>
<section className="footer-col">
  <h4>Get in Touch</h4>
  <p>Subscribe for updates or send a message.</p>
</section>
</div>

<div className="footer-bottom">
  <p>Reach me at <i class="fa-brands fa-github"></i>
    <i className="fa-solid fa-at"></i>
    <i className="fa-brands fa-linkedin"></i>
  </p>
</div>
</footer>
        </>
    )
};

export default Footer;