import { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import logo from "../../assets/images/logo.png";
import { FiSearch, FiX, FiUser, FiCalendar, FiGrid, FiLogOut } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({
  navbarRef,
  searchState,
  onSearchOpen,
  onSearchClose,
  searchTerm,
  onSearchChange,
  hideSearch = false,   // true on Profile & Calendar pages
}) => {
  const { logout, user } = useContext(AuthContext);
  const inputRef  = useRef(null);
  const menuRef   = useRef(null);
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isSearchOpen = searchState === "open" || searchState === "opening";

  useEffect(() => {
    if (searchState === "open") {
      setTimeout(() => inputRef.current?.focus(), 180);
    }
  }, [searchState]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menuItems = [
    { icon: <FiGrid size={15} />,     label: "Dashboard", path: "/dashboard" },
    { icon: <FiUser size={15} />,     label: "Profile",   path: "/profile"   },
    { icon: <FiCalendar size={15} />, label: "Calendar",  path: "/calendar"  },
  ];

  const handleLogoClick = () => {
    navigate(user ? "/dashboard" : "/");
  };

  return (
    <nav
      className={`navbar ${isSearchOpen ? "navbar--search" : ""}`}
      ref={navbarRef}
    >
      {/* ── Normal content layer ── */}
      <div className={`nav-normal ${isSearchOpen ? "nav-normal--hidden" : ""}`}>

        {/* Logo — clicks to dashboard if logged in */}
        <div className="logo-section" onClick={handleLogoClick} role="button" tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleLogoClick()}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="logo" className="logo" />
          <h2>TodoFlow</h2>
        </div>

        <div className="nav-actions">
          {/* Search — hidden on Profile & Calendar */}
          {!hideSearch && (
            <button className="nav-icon-btn" onClick={onSearchOpen} aria-label="Search tasks">
              <FiSearch size={18} />
            </button>
          )}

          {/* User menu */}
          <div className="nav-menu-wrapper" ref={menuRef}>
            <button
              className={`nav-icon-btn ${menuOpen ? "nav-icon-btn--active" : ""}`}
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="User menu"
            >
              <FiUser size={17} />
            </button>

            {menuOpen && (
              <div className="nav-dropdown">
                {/* User info header */}
                <div className="nav-dropdown__header">
                  <div className="nav-dropdown__avatar">
                    <FiUser size={16} />
                  </div>
                  <div className="nav-dropdown__info">
                    <span className="nav-dropdown__name">{user?.name || "User"}</span>
                    <span className="nav-dropdown__email">{user?.email || ""}</span>
                  </div>
                </div>

                <div className="nav-dropdown__divider" />

                {/* Nav links */}
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    className={`nav-dropdown__item ${location.pathname === item.path ? "nav-dropdown__item--active" : ""}`}
                    onClick={() => { navigate(item.path); setMenuOpen(false); }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}

                <div className="nav-dropdown__divider" />

                {/* Dark mode row inside dropdown */}
                <div className="nav-dropdown__theme-row">
                  <span className="nav-dropdown__theme-label">Dark Mode</span>
                  <ThemeToggle />
                </div>

                <div className="nav-dropdown__divider" />

                {/* Logout */}
                <button
                  className="nav-dropdown__item nav-dropdown__item--danger"
                  onClick={() => { logout(); setMenuOpen(false); }}
                >
                  <FiLogOut size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Search layer (only when search is active) ── */}
      {!hideSearch && (
        <div className={`nav-search-layer ${isSearchOpen ? "nav-search-layer--visible" : ""}`}>
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
      )}
    </nav>
  );
};

export default Navbar;