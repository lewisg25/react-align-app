import React from "react";
import { Link } from "react-router";

const Navbar = () => {
  return  (
        <>
        <nav classNameName="nav-links">
        <ul>
          <Link to ="/how-it-works"></Link>
          <Link to = "/products"></Link>
          <Link to ="/programs"></Link>
          <Link to ="/contact"></Link>
        </ul>
      </nav>
        </>
    )
};

export default Navbar;

