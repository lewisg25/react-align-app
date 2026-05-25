import React from "react";
import { Link } from "react-router";

const Navbar = () => {
  return  (
        <>
        <nav className="nav-links">
        <ul>
          <Link to ="/how-it-works">How it Works</Link>
          <Link to = "/products">Products</Link>
          <Link to ="/programs">Programs</Link>
          <Link to ="/contact">Contact</Link>
        </ul>
      </nav>
        </>
    )
};

export default Navbar;

