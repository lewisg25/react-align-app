import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { getStoredAuth } from "../src/api";

const THEME_STORAGE_KEY = "alignTheme";

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const Header = () => {
  const auth = getStoredAuth();
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <span>
          <i className="fa-solid fa-heart"></i>
        </span>{" "}
        ALIGN
      </Link>

      <Navbar />

      <div className="auth-buttons">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <i className={theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon"} aria-hidden="true" />
        </button>
        {auth?.token ? (
          <Link to="/dashboard">
            <button className="btn-solid">Dashboard</button>
          </Link>
        ) : (
          <Link to="/login">
            <button className="btn-solid">Log-in</button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
