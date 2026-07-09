import { useState, useContext, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiPlus, FiUser, FiX, FiChevronDown, FiStar, FiZap, FiMoon,
  FiChevronLeft, FiChevronRight,
} from "react-icons/fi";
import { RiDashboardLine } from "react-icons/ri";
import { HiOutlineUser } from "react-icons/hi2";
import { LuCalendarDays } from "react-icons/lu";
import { TbUsers } from "react-icons/tb";
import { PiSignOutBold } from "react-icons/pi";
import logo from "../../assets/images/logo.png";
import { AuthContext } from "../../context/AuthContext";
import { WorkspaceContext } from "../../context/WorkspaceContext";
import { createWorkspace } from "../../services/workspaceAPI";
import ThemePicker from "../ThemePicker/ThemePicker";
import "./Sidebar.css";

const MENU_ITEMS = [
  { icon: RiDashboardLine, label: "Overview",     path: "/dashboard"     },
  { icon: LuCalendarDays,  label: "Calendar",      path: "/calendar"      },
  { icon: TbUsers,         label: "Collaboration", path: "/collaboration" },
  { icon: LuCalendarDays,  label: "Today's Tasks", path: "/today"         },
  { icon: FiStar,          label: "Starred Tasks", path: "/starred"       },
  { icon: FiZap,           label: "Features",      path: "/features"      },
  { icon: HiOutlineUser,   label: "Profile",       path: "/profile"       },
];

const Sidebar = ({ mobileOpen, onClose, collapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const {
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    members,
    refreshWorkspaces,
  } = useContext(WorkspaceContext);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, anchor: "up" });

  const userCardRef = useRef(null);
  const userMenuPortalRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        userCardRef.current && !userCardRef.current.contains(e.target) &&
        userMenuPortalRef.current && !userMenuPortalRef.current.contains(e.target)
      ) {
        setUserMenuOpen(false);
        setThemeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggleUserMenu = () => {
    if (!userMenuOpen && userCardRef.current) {
      const rect = userCardRef.current.getBoundingClientRect();
      // Always anchor to the BOTTOM of the viewport relative to the card,
      // so the menu grows upward and can never get clipped below the fold.
      if (collapsed) {
        setMenuPos({
          bottom: window.innerHeight - rect.bottom,
          left: rect.right + 10,
        });
      } else {
        setMenuPos({
          bottom: window.innerHeight - rect.top + 8,
          left: rect.left,
        });
      }
    } else {
      setThemeOpen(false);
    }
    setUserMenuOpen((p) => !p);
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose?.();
  };

  const handleWorkspaceSelect = (ws) => {
    setActiveWorkspace(ws);
    onClose?.();
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    try {
      const res = await createWorkspace({
        name: newName.trim(),
        description: newDescription.trim(),
      });
      const created = res.data.data;
      await refreshWorkspaces();
      setActiveWorkspace(created);
      setShowCreateModal(false);
      setNewName("");
      setNewDescription("");
    } catch (error) {
      console.log(error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <aside
        className={`app-sidebar neu-card ${mobileOpen ? "app-sidebar--open" : ""} ${
          collapsed ? "app-sidebar--collapsed" : ""
        }`}
      >
        <div className="sidebar-top">
          <div
            className="sidebar-logo"
            onClick={() => handleNavigate("/dashboard")}
            role="button"
            tabIndex={0}
          >
            <img src={logo} alt="logo" className="sidebar-logo-img" />
            <span className="sidebar-logo-text">TodoFlow</span>
          </div>

          <button
            className="sidebar-collapse-btn"
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
          </button>

          <button className="sidebar-mobile-close" onClick={onClose} aria-label="Close menu">
            <FiX size={18} />
          </button>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <span>Workspaces</span>
            <button
              className="sidebar-add-btn"
              onClick={() => setShowCreateModal(true)}
              title="Create workspace"
            >
              <FiPlus size={13} />
            </button>
          </div>

          <div className="sidebar-workspace-list">
            <button
              className={`sidebar-ws-item ${!activeWorkspace ? "active" : ""}`}
              onClick={() => handleWorkspaceSelect(null)}
              title="Personal"
            >
              <span className="sidebar-ws-avatar">
                <FiUser size={13} />
              </span>
              <span className="sidebar-ws-name">Personal</span>
            </button>

            {workspaces.map((ws) => (
              <button
                key={ws._id}
                className={`sidebar-ws-item ${
                  activeWorkspace?._id === ws._id ? "active" : ""
                }`}
                onClick={() => handleWorkspaceSelect(ws)}
                title={ws.name}
              >
                <span className="sidebar-ws-avatar">
                  {ws.name[0]?.toUpperCase()}
                </span>
                <span className="sidebar-ws-name">{ws.name}</span>
                {activeWorkspace?._id === ws._id && (
                  <span className="sidebar-ws-count">{members.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-divider" />

        <nav className="sidebar-menu">
          {MENU_ITEMS.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              className={`sidebar-menu-item ${
                location.pathname === path ? "active" : ""
              }`}
              onClick={() => handleNavigate(path)}
              title={label}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            ref={userCardRef}
            className="sidebar-user-card"
            onClick={handleToggleUserMenu}
          >
            <span className="sidebar-user-avatar">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </span>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name || "User"}</span>
              <span className="sidebar-user-email">{user?.email || ""}</span>
            </div>
            <FiChevronDown
              size={14}
              className={`sidebar-user-chevron ${userMenuOpen ? "open" : ""}`}
            />
          </button>
        </div>
      </aside>

      {userMenuOpen &&
        createPortal(
          <div
            className="sidebar-user-menu-portal"
            style={{ top: menuPos.top, bottom: menuPos.bottom, left: menuPos.left }}
            ref={userMenuPortalRef}
          >
            <button
              className="sidebar-user-menu-item"
              onClick={() => setThemeOpen((p) => !p)}
            >
              <FiMoon size={13} /> Theme
            </button>
            {themeOpen && (
              <div className="sidebar-theme-picker">
                <ThemePicker />
              </div>
            )}
            <button
              className="sidebar-user-menu-item sidebar-user-menu-item--danger"
              onClick={logout}
            >
              <PiSignOutBold size={13} /> Logout
            </button>
          </div>,
          document.body
        )}

      {showCreateModal && (
        <div
          className="sidebar-modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="sidebar-modal glass-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sidebar-modal-header">
              <h3>New Workspace</h3>
              <button
                className="sidebar-modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateWorkspace} className="sidebar-form">
              <label>Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Product Team"
                autoFocus
                required
              />

              <label>Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Optional"
                rows={3}
              />

              <button
                type="submit"
                className="sidebar-form-submit"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Workspace"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;