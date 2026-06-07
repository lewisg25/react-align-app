import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../src/useAuth";

const Header = () => {
  const { isAuthenticated, isLoading } = useAuth();

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
        {isAuthenticated ? (
          <Link to="/dashboard">
            <button className="btn-solid">Dashboard</button>
          </Link>
        ) : !isLoading ? (
          <Link to="/login">
            <button className="btn-solid">Log-in</button>
          </Link>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
