import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import ThemeToggle from "../ThemeToggle/ThemeToggle";

import logo from "../../assets/images/logo.png";
import { FiSearch } from "react-icons/fi";

import "./Navbar.css";

const Navbar = ({ onSearchClick, navbarRef }) => {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="logo-section">
        <img src={logo} alt="logo" className="logo" />
        <h2>TodoFlow</h2>
      </div>

      <div className="nav-actions">
        <button
          className="search-btn"
          onClick={onSearchClick}
          aria-label="Search tasks"
        >
          <FiSearch size={22} />
        </button>

        <ThemeToggle />

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;