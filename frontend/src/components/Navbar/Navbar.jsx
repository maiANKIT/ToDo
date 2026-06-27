import { useContext, useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AuthContext } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import logo from "../../assets/images/logo.png";
import {
  FiSearch, FiX, FiUser, FiMoon,
} from "react-icons/fi";
import { RiDashboardLine } from "react-icons/ri";
import { HiOutlineUser } from "react-icons/hi2";
import { LuCalendarDays } from "react-icons/lu";
import { TbUsers } from "react-icons/tb";
import { PiSignOutBold } from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

/* ── Dropdown rendered via Portal so it escapes the navbar's
   backdrop-filter stacking context, allowing its own
   backdrop-filter to work correctly in production. ── */
const DropdownPortal = ({ anchorRef, children }) => {
  const [pos, setPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const recalc = () => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top:   rect.bottom + 12,               // viewport-relative, no scrollY needed
        right: window.innerWidth - rect.right,
      });
    };
    recalc();
    window.addEventListener("resize", recalc);
    // No scroll listener — position:fixed locks to viewport automatically
    return () => {
      window.removeEventListener("resize", recalc);
    };
  }, [anchorRef]);

  return createPortal(
    <div
      className="nav-dropdown-portal"
      style={{ top: pos.top, right: pos.right }}
    >
      {children}
    </div>,
    document.body
  );
};

const Navbar = ({
  navbarRef,
  searchState,
  onSearchOpen,
  onSearchClose,
  searchTerm,
  onSearchChange,
  hideSearch = false,
}) => {
  const { logout, user } = useContext(AuthContext);
  const inputRef    = useRef(null);
  const menuRef     = useRef(null);
  const dropdownRef = useRef(null);
  const navigate    = useNavigate();
  const location    = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isSearchOpen = searchState === "open" || searchState === "opening";

  useEffect(() => {
    if (searchState === "open") {
      setTimeout(() => inputRef.current?.focus(), 180);
    }
  }, [searchState]);

  useEffect(() => {
    const handler = (e) => {
      if (
        menuRef.current     && !menuRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menuItems = [
    { icon: <RiDashboardLine size={14} />, label: "Dashboard",    path: "/dashboard"     },
    { icon: <HiOutlineUser   size={14} />, label: "Profile",      path: "/profile"       },
    { icon: <LuCalendarDays  size={14} />, label: "Calendar",     path: "/calendar"      },
    { icon: <TbUsers         size={14} />, label: "Collaboration", path: "/collaboration", collab: true },
  ];

  const handleLogoClick = () => navigate(user ? "/dashboard" : "/");

  return (
    <nav
      className={`navbar ${isSearchOpen ? "navbar--search" : ""}`}
      ref={navbarRef}
    >
      {/* Normal layer */}
      <div className={`nav-normal ${isSearchOpen ? "nav-normal--hidden" : ""}`}>

        <div
          className="logo-section"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleLogoClick()}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="logo" className="logo" />
          <h2>TodoFlow</h2>
        </div>

        <div className="nav-actions">
          {!hideSearch && (
            <button className="nav-icon-btn" onClick={onSearchOpen} aria-label="Search tasks">
              <FiSearch size={17} />
            </button>
          )}

          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              className={`nav-icon-btn ${menuOpen ? "nav-icon-btn--active" : ""}`}
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="User menu"
            >
              <FiUser size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Search layer */}
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

      {/* Dropdown via Portal — lives directly on <body>, outside navbar stacking context */}
      {menuOpen && (
        <DropdownPortal anchorRef={menuRef}>
          <div className="nav-dropdown" ref={dropdownRef}>

            <div className="nav-dropdown__header">
              <div className="nav-dropdown__avatar">
                <HiOutlineUser size={16} />
              </div>
              <div className="nav-dropdown__info">
                <span className="nav-dropdown__name">{user?.name || "User"}</span>
                <span className="nav-dropdown__email">{user?.email || ""}</span>
              </div>
            </div>

            <div className="nav-dropdown__divider" />

            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`nav-dropdown__item ${
                  location.pathname === item.path ? "nav-dropdown__item--active" : ""
                } ${item.collab ? "nav-dropdown__item--collab" : ""}`}
                onClick={() => { navigate(item.path); setMenuOpen(false); }}
              >
                <span className="nav-dropdown__item-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}

            <div className="nav-dropdown__divider" />

            <div className="nav-dropdown__theme-row">
              <span className="nav-dropdown__theme-label">
                <span className="nav-dropdown__theme-icon">
                  <FiMoon size={13} />
                </span>
                Dark Mode
              </span>
              <ThemeToggle />
            </div>

            <div className="nav-dropdown__divider" />

            <button
              className="nav-dropdown__item nav-dropdown__item--danger"
              onClick={() => { logout(); setMenuOpen(false); }}
            >
              <span className="nav-dropdown__item-icon">
                <PiSignOutBold size={13} />
              </span>
              Logout
            </button>

          </div>
        </DropdownPortal>
      )}
    </nav>
  );
};

export default Navbar;