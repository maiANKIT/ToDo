import { useState, useRef, useEffect, useContext } from "react";
import { Users, User, ChevronDown, Check, Settings, RotateCcw, Info } from "lucide-react";
import { WorkspaceContext } from "../../context/WorkspaceContext";
import { restoreWorkspace } from "../../services/workspaceAPI";
import WorkspaceSettingsModal from "../WorkspaceSettingsModal/WorkspaceSettingsModal";
import "./WorkspaceSwitcher.css";

const ARCHIVED_KEY = "todoflow-recently-archived";

const WorkspaceSwitcher = ({ workspaces, activeWorkspace, onSelect }) => {
  const { refreshWorkspaces } = useContext(WorkspaceContext);

  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [recentlyArchived, setRecentlyArchived] = useState([]);
  const [restoringId, setRestoringId] = useState(null);
  const wrapRef = useRef(null);

  // Load the session-local "recently archived" list whenever the panel opens
  useEffect(() => {
    if (open) {
      try {
        setRecentlyArchived(JSON.parse(localStorage.getItem(ARCHIVED_KEY) || "[]"));
      } catch (e) {
        setRecentlyArchived([]);
      }
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePick = (ws) => {
    onSelect(ws);
    setOpen(false);
  };

  const handleRestore = async (id) => {
    setRestoringId(id);
    try {
      await restoreWorkspace(id);
      await refreshWorkspaces();
      const next = recentlyArchived.filter((w) => w.id !== id);
      setRecentlyArchived(next);
      localStorage.setItem(ARCHIVED_KEY, JSON.stringify(next));
    } catch (e) {
      // If restore fails (e.g. permission changed, workspace deleted), just
      // leave it in the list — user can retry or it'll clear out naturally.
    } finally {
      setRestoringId(null);
    }
  };

  if (!workspaces.length && !recentlyArchived.length) return null;

  const label = activeWorkspace ? activeWorkspace.name : "Personal";

  return (
    <>
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

            {workspaces.length > 0 && <div className="ws-switcher-divider" />}

            {workspaces.map((ws) => {
              const isActive = activeWorkspace?._id === ws._id;
              return (
                <div key={ws._id} className={`ws-switcher-row ${isActive ? "active" : ""}`}>
                  <button
                    className="ws-switcher-item ws-switcher-item--flex"
                    onClick={() => handlePick(ws)}
                  >
                    <span className="ws-switcher-item-icon">
                      {ws.name[0]?.toUpperCase()}
                    </span>
                    <span className="ws-switcher-item-name">{ws.name}</span>
                    {isActive && <Check size={14} className="ws-switcher-check" />}
                  </button>

                  {/* Settings gear — only meaningful for the active workspace */}
                  {isActive && (
                    <button
                      className="ws-switcher-settings-btn"
                      title="Workspace settings"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSettings(true);
                        setOpen(false);
                      }}
                    >
                      <Settings size={14} />
                    </button>
                  )}
                </div>
              );
            })}

            {/* ── Recently archived (session/device-local only) ── */}
            {recentlyArchived.length > 0 && (
              <>
                <div className="ws-switcher-divider" />
                <div className="ws-switcher-archived-header">
                  <span>Recently Archived</span>
                  <span
                    className="ws-switcher-archived-info"
                    title="Only shows workspaces you archived from this device in this session"
                  >
                    <Info size={12} />
                  </span>
                </div>
                {recentlyArchived.map((w) => (
                  <div key={w.id} className="ws-switcher-archived-row">
                    <span className="ws-switcher-archived-name">{w.name}</span>
                    <button
                      className="ws-switcher-restore-btn"
                      onClick={() => handleRestore(w.id)}
                      disabled={restoringId === w.id}
                    >
                      <RotateCcw size={12} />
                      {restoringId === w.id ? "Restoring..." : "Restore"}
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {showSettings && activeWorkspace && (
        <WorkspaceSettingsModal
          workspace={activeWorkspace}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
};

export default WorkspaceSwitcher;