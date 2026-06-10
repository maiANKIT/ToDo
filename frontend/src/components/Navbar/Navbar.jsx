import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import ThemeToggle from "../ThemeToggle/ThemeToggle";

import logo from "../../assets/images/logo.png";
import { FiSearch } from "react-icons/fi";

import "./Navbar.css";

const Navbar = ({ onSearchClick }) => {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="logo-section">
        <img
          src={logo}
          alt="logo"
          className="logo"
        />

        <h2>TodoFlow</h2>
      </div>

      <div className="nav-actions">
        <button
  className="search-btn"
  onClick={onSearchClick}
>
  <FiSearch />
</button>

        <ThemeToggle />

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;