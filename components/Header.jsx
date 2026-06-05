import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { getStoredAuth } from "../src/api";

const Header = () => {
  const auth = getStoredAuth();

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
