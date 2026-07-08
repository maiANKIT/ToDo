import { useState, useRef, useEffect } from "react";
import { Users, User, ChevronDown, Check } from "lucide-react";
import "./WorkspaceSwitcher.css";

const WorkspaceSwitcher = ({ workspaces, activeWorkspace, onSelect }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!workspaces.length) return null;

  const label = activeWorkspace ? activeWorkspace.name : "Personal";

  const handlePick = (ws) => {
    onSelect(ws);
    setOpen(false);
  };

  return (
    <div className="ws-switcher" ref={wrapRef}>
      <button
        className={`ws-switcher-trigger neu-card ${open ? "ws-switcher-trigger--open" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="ws-switcher-icon">
          {activeWorkspace ? (
            <Users size={15} strokeWidth={2} />
          ) : (
            <User size={15} strokeWidth={2} />
          )}
        </span>
        <span className="ws-switcher-label">{label}</span>
        <ChevronDown
          size={15}
          strokeWidth={2}
          className={`ws-switcher-chevron ${open ? "ws-switcher-chevron--open" : ""}`}
        />
      </button>

      {open && (
        <div className="ws-switcher-panel neu-card">
          <button
            className={`ws-switcher-item ${!activeWorkspace ? "active" : ""}`}
            onClick={() => handlePick(null)}
          >
            <span className="ws-switcher-item-icon">
              <User size={13} strokeWidth={2} />
            </span>
            <span className="ws-switcher-item-name">Personal</span>
            {!activeWorkspace && <Check size={14} className="ws-switcher-check" />}
          </button>

          <div className="ws-switcher-divider" />

          {workspaces.map((ws) => (
            <button
              key={ws._id}
              className={`ws-switcher-item ${
                activeWorkspace?._id === ws._id ? "active" : ""
              }`}
              onClick={() => handlePick(ws)}
            >
              <span className="ws-switcher-item-icon">
                {ws.name[0]?.toUpperCase()}
              </span>
              <span className="ws-switcher-item-name">{ws.name}</span>
              {activeWorkspace?._id === ws._id && (
                <Check size={14} className="ws-switcher-check" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspaceSwitcher; 