import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/how-it-works", label: "How it Works" },
  { to: "/products", label: "Products" },
  { to: "/programs", label: "Programs" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
];

const Navbar = ({ isOpen = false, onNavigate = () => {} }) => {
  return (
    <nav
      id="primary-navigation"
      className={isOpen ? "nav-links open" : "nav-links"}
      aria-label="Primary navigation"
    >
      <ul>
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
