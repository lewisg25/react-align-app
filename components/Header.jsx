import React from "react";

const Header = () => {
  return (

     <>
    <header className="navbar">
      <a href="/" class="logo">
        <span>
          <i className="fa-solid fa-heart"></i>
        </span>{" "}
        ALIGN
      </a>
      <nav className="nav-links">
        <ul>
          <li>
            <a href="#">How it Works</a>
          </li>
          <li>
            <a href="products.html">Products</a>
          </li>
          <li>
            <a href="Programs.html">Programs</a>
          </li>
          <li>
            <a href="contact.html">Contact</a>
          </li>
        </ul>
      </nav>
      <div className="auth-buttons">
        <button className="theme-toggle" />
        <span>
          <i className="fa-solid fa-moon"></i>
        </span>
        <a href="get-started.html">
          <button className="btn-solid">Get Started</button>
        </a>
        <a href="sign-in.html">
          <button className="btn-solid">Sign In </button>
        </a>
      </div>
    </header>
  </>
  )
 
};

export default Header;