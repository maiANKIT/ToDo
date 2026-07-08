import { useContext, useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AuthContext } from "../../context/AuthContext";
import { WorkspaceContext } from "../../context/WorkspaceContext";
import logo from "../../assets/images/logo.png";
import {
  FiSearch, FiX, FiUser, FiMoon, FiBell, FiStar, FiZap, FiUsers, FiShield,
} from "react-icons/fi";
import { RiDashboardLine } from "react-icons/ri";
import { HiOutlineUser } from "react-icons/hi2";
import { LuCalendarDays } from "react-icons/lu";
import { TbUsers } from "react-icons/tb";
import { PiSignOutBold } from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import ThemePicker from "../ThemePicker/ThemePicker";


const DropdownPortal = ({ anchorRef, children, align = "right" }) => {
  const [pos, setPos] = useState({ top: 0, right: 0, left: 0 });

  useEffect(() => {
    const recalc = () => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top:   rect.bottom + 12,
        right: window.innerWidth - rect.right,
        left:  rect.left,
      });
    };
    recalc();
    window.addEventListener("resize", recalc);
    return () => {
      window.removeEventListener("resize", recalc);
    };
  }, [anchorRef]);

  return createPortal(
    <div
      className="nav-dropdown-portal"
      style={align === "left" ? { top: pos.top, left: pos.left } : { top: pos.top, right: pos.right }}
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
  overdueTasks = [],
}) => {
  const { logout, user } = useContext(AuthContext);
  const { activeWorkspace, members, membersLoading, setActiveWorkspace } = useContext(WorkspaceContext);

  const inputRef      = useRef(null);
  const menuRef        = useRef(null);
  const dropdownRef    = useRef(null);
  const notifRef       = useRef(null);
  const notifDropRef   = useRef(null);
  const brandRef       = useRef(null);
  const brandDropRef   = useRef(null);
  const navigate       = useNavigate();
  const location       = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);

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
        setThemeOpen(false);
      }
      if (
        notifRef.current     && !notifRef.current.contains(e.target) &&
        notifDropRef.current && !notifDropRef.current.contains(e.target)
      ) {
        setNotifOpen(false);
      }
      if (
        brandRef.current     && !brandRef.current.contains(e.target) &&
        brandDropRef.current && !brandDropRef.current.contains(e.target)
      ) {
        setBrandOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close theme accordion whenever the main menu closes
  useEffect(() => {
    if (!menuOpen) setThemeOpen(false);
  }, [menuOpen]);

  // Close workspace info panel whenever the active workspace changes
  useEffect(() => {
    setBrandOpen(false);
  }, [activeWorkspace?._id]);

  const menuItems = [
    { icon: <RiDashboardLine size={14} />, label: "Dashboard",     path: "/dashboard"     },
    { icon: <HiOutlineUser   size={14} />, label: "Profile",       path: "/profile"       },
    { icon: <LuCalendarDays  size={14} />, label: "Calendar",      path: "/calendar"      },
    { icon: <TbUsers         size={14} />, label: "Collaboration", path: "/collaboration", collab: true },
    { icon: <LuCalendarDays  size={14} />, label: "Today's Tasks", path: "/today"         },
    { icon: <FiStar          size={14} />, label: "Starred Tasks", path: "/starred"       },
    { icon: <FiZap           size={14} />, label: "Features",      path: "/features"      },
  ];

  const handleLogoClick = () => navigate(user ? "/dashboard" : "/");

  const handleBrandClick = () => {
    if (activeWorkspace) setBrandOpen((p) => !p);
    else handleLogoClick();
  };

  const goToCollaboration = () => {
    setBrandOpen(false);
    navigate("/collaboration");
  };

  const backToPersonal = () => {
    setActiveWorkspace(null);
    setBrandOpen(false);
  };

  return (
    <nav
      className={`navbar ${isSearchOpen ? "navbar--search" : ""}`}
      ref={navbarRef}
    >
      {/* Normal layer */}
      <div className={`nav-normal ${isSearchOpen ? "nav-normal--hidden" : ""}`}>

        <div
          className="logo-section"
          ref={brandRef}
          onClick={handleBrandClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleBrandClick()}
          style={{ cursor: "pointer" }}
        >
          {activeWorkspace ? (
            <>
              <span className="brand-workspace-avatar">
                {activeWorkspace.name[0]?.toUpperCase()}
              </span>
              <div className="brand-workspace-info">
                <h2 className="brand-workspace-name">{activeWorkspace.name}</h2>
                <span className="brand-workspace-sub">
                  {members.length} member{members.length !== 1 ? "s" : ""}
                </span>
              </div>
            </>
          ) : (
            <>
              <img src={logo} alt="logo" className="logo" />
              <h2>TodoFlow</h2>
            </>
          )}
        </div>

        <div className="nav-actions">
          {!hideSearch && (
            <button className="nav-icon-btn" onClick={onSearchOpen} aria-label="Search tasks">
              <FiSearch size={17} />
            </button>
          )}

          {/* Notification bell */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button
              className={`nav-icon-btn ${notifOpen ? "nav-icon-btn--active" : ""}`}
              onClick={() => setNotifOpen((p) => !p)}
              aria-label="Notifications"
            >
              <FiBell size={16} />
              {overdueTasks.length > 0 && (
                <span className="nav-badge">{overdueTasks.length}</span>
              )}
            </button>
          </div>

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

      {/* Workspace group-info dropdown (WhatsApp-style) */}
      {brandOpen && activeWorkspace && (
        <DropdownPortal anchorRef={brandRef} align="left">
          <div className="nav-dropdown nav-dropdown--workspace" ref={brandDropRef}>
            <div className="nav-dropdown__header">
              <div className="nav-dropdown__avatar">
                <FiUsers size={16} />
              </div>
              <div className="nav-dropdown__info">
                <span className="nav-dropdown__name">{activeWorkspace.name}</span>
                <span className="nav-dropdown__email">
                  {members.length} member{members.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="nav-dropdown__divider" />

            {membersLoading ? (
              <p className="nav-notif-empty">Loading members...</p>
            ) : (
              <div className="nav-workspace-member-list">
                {members.map((m) => (
                  <div className="nav-workspace-member-row" key={m._id}>
                    <span className="nav-workspace-member-avatar">
                      {m.user?.name?.[0]?.toUpperCase() || "?"}
                    </span>
                    <span className="nav-workspace-member-name">
                      {m.user?.name}
                    </span>
                    <span className="nav-workspace-member-role">
                      {m.role === "Owner" && <FiShield size={11} />}
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="nav-dropdown__divider" />

            <button className="nav-dropdown__item nav-dropdown__item--collab" onClick={goToCollaboration}>
              <span className="nav-dropdown__item-icon">
                <TbUsers size={13} />
              </span>
              Manage Workspace
            </button>

            <button className="nav-dropdown__item" onClick={backToPersonal}>
              <span className="nav-dropdown__item-icon">
                <HiOutlineUser size={13} />
              </span>
              Switch to Personal
            </button>
          </div>
        </DropdownPortal>
      )}

      {/* Notification dropdown */}
      {notifOpen && (
        <DropdownPortal anchorRef={notifRef}>
          <div className="nav-dropdown nav-dropdown--notif" ref={notifDropRef}>
            <div className="nav-dropdown__header">
              <div className="nav-dropdown__avatar nav-dropdown__avatar--notif">
                <FiBell size={16} />
              </div>
              <div className="nav-dropdown__info">
                <span className="nav-dropdown__name">Notifications</span>
                <span className="nav-dropdown__email">
                  {overdueTasks.length} overdue task{overdueTasks.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <div className="nav-dropdown__divider" />

            {overdueTasks.length === 0 ? (
              <p className="nav-notif-empty">You're all caught up</p>
            ) : (
              <div className="nav-notif-list">
                {overdueTasks.map((t) => (
                  <div key={t._id} className="nav-notif-item">
                    <span className="nav-notif-title">{t.title}</span>
                    <span className="nav-notif-due">
                      Due {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DropdownPortal>
      )}

      {/* Profile dropdown */}
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

            {/* ── Theme accordion ── */}
            <button
              className="nav-dropdown__item nav-dropdown__item--accordion"
              onClick={() => setThemeOpen((p) => !p)}
            >
              <span className="nav-dropdown__item-icon">
                <FiMoon size={13} />
              </span>
              <span className="nav-dropdown__item-label">Theme</span>
              <svg
                className={`nav-accordion-arrow ${themeOpen ? "rotated" : ""}`}
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {themeOpen && (
              <div className="nav-accordion-list">
                <ThemePicker />
              </div>
            )}

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