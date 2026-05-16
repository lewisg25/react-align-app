import React from "react";
import { Link } from "react-router";
const Header = () => {
  return (

     <>
    <header classNameName="navbar">
      <a href="/" className="logo">
        <span>
          <i classNameName="fa-solid fa-heart"></i>
        </span>{" "}
        ALIGN
      </a>
      <nav classNameName="nav-links">
        <ul>
        <Link to ="/how-it-works"></Link>
          <Link to = "/products"></Link>
          <Link to ="/programs"></Link>
          <Link to ="/contact"></Link>
        </ul>
      </nav>
      <div classNameName="auth-buttons">
         <button classNameName="theme-toggle" />
        <span>
          <i classNameName="fa-solid fa-moon"></i>
        </span> 
         <a href="get-started.html">
          <button classNameName="btn-solid">Get Started</button>
        </a>
        <a href="sign-in.html">
          <button classNameName="btn-solid">Log-in </button>
        </a> 
      </div>
    </header>
  </>
  )
 
};

export default Header;