import { useContext, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import logo from "../../assets/images/logo.png";
import { FiSearch, FiX } from "react-icons/fi";
import "./Navbar.css";

const Navbar = ({ navbarRef, searchState, onSearchOpen, onSearchClose, searchTerm, onSearchChange }) => {
  const { logout } = useContext(AuthContext);
  const inputRef = useRef(null);

  const isOpen = searchState === "open" || searchState === "opening";

  useEffect(() => {
    if (searchState === "open") {
      setTimeout(() => inputRef.current?.focus(), 180);
    }
  }, [searchState]);

  return (
    <nav className={`navbar ${isOpen ? "navbar--search" : ""}`} ref={navbarRef}>

      {/* ── Normal content layer ── */}
      <div className={`nav-normal ${isOpen ? "nav-normal--hidden" : ""}`}>
        <div className="logo-section">
          <img src={logo} alt="logo" className="logo" />
          <h2>TodoFlow</h2>
        </div>
        <div className="nav-actions">
          <button className="search-btn" onClick={onSearchOpen} aria-label="Search tasks">
            <FiSearch size={20} />
          </button>
          <ThemeToggle />
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* ── Search layer ── */}
      <div className={`nav-search-layer ${isOpen ? "nav-search-layer--visible" : ""}`}>
        <FiSearch size={18} className="nav-search-icon" />
        <input
          ref={inputRef}
          type="text"
          className="nav-search-input"
          placeholder="Search tasks…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button className="nav-search-close" onClick={onSearchClose} aria-label="Close search">
          <FiX size={18} />
        </button>
      </div>

    </nav>
  );
};

export default Navbar;