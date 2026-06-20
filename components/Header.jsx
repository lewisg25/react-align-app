import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../src/useAuth";

const Header = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="navbar">
      <Link to="/" className="logo" onClick={closeMenu}>
        <span>
          <i className="fa-solid fa-heart"></i>
        </span>{" "}
        GetALIGNED
      </Link>

      <button
        type="button"
        className="mobile-menu-button"
        aria-controls="primary-navigation"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
      >
        <i className={`fa-solid ${isMenuOpen ? "fa-xmark" : "fa-bars"}`}></i>
      </button>

      <Navbar isOpen={isMenuOpen} onNavigate={closeMenu} />

      <div className="auth-buttons">
        {isAuthenticated ? (
          <Link to="/dashboard" onClick={closeMenu}>
            <button className="btn-solid">Dashboard</button>
          </Link>
        ) : !isLoading ? (
          <Link to="/login" onClick={closeMenu}>
            <button className="btn-solid">Login</button>
          </Link>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
