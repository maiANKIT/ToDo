import { useEffect } from "react";
import { FiX, FiExternalLink, FiCalendar, FiClock, FiEdit2, FiStar } from "react-icons/fi";
import "./TaskDetailPanel.css";

const STATUS_CYCLE = ["pending", "inprogress", "done"];

const TaskDetailPanel = ({ todo, onClose, onEdit, onStatusChange, onToggleStar }) => {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!todo) return null;

  const getStatusClass = () => {
    switch (todo.status) {
      case "done":       return "status-done";
      case "inprogress": return "status-progress";
      default:           return "status-pending";
    }
  };

  const getStatusText = () => {
    switch (todo.status) {
      case "done":       return "Done";
      case "inprogress": return "In Progress";
      default:           return "Pending";
    }
  };

  const handleStatusClick = () => {
    if (!onStatusChange) return;
    const currentIndex = STATUS_CYCLE.indexOf(todo.status);
    const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
    onStatusChange(todo._id, nextStatus);
  };

  const handleLinkClick = () => {
    let url = todo.link.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getDomain = (url) => {
    try {
      return new URL(
        url.trim().match(/^https?:\/\//i) ? url.trim() : "https://" + url.trim()
      ).hostname.replace("www.", "");
    } catch {
      return url.replace(/^https?:\/\//, "").split("/")[0];
    }
  };

  const now = new Date();
  const due = todo.dueDate ? new Date(todo.dueDate) : null;
  const isOverdue  = due && due < now && todo.status !== "done";
  const isDueToday = due && due.toDateString() === now.toDateString() && todo.status !== "done";
  const dueDateClass = isOverdue ? "due-overdue" : isDueToday ? "due-today" : "due-upcoming";

  const createdLabel = new Date(todo.createdAt).toLocaleDateString(undefined, {
    day: "numeric", month: "short", year: "numeric",
  });
  const updatedLabel = todo.updatedAt
    ? new Date(todo.updatedAt).toLocaleDateString(undefined, {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div
        className="detail-panel neu-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="detail-header">
          <button
            className={`status-badge status-badge--clickable ${getStatusClass()}`}
            onClick={handleStatusClick}
            title="Click to change status"
          >
            {getStatusText()}
          </button>
          <div className="detail-header-actions">
            <button
              className={`star-btn ${todo.star ? "star-btn--active" : ""}`}
              onClick={() => onToggleStar?.(todo._id, !todo.star)}
              title={todo.star ? "Unmark important" : "Mark as important"}
            >
              <FiStar size={15} fill={todo.star ? "currentColor" : "none"} />
            </button>
            <button className="detail-close-btn" onClick={onClose} title="Close">
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* ── Title ── */}
        <h2 className="detail-title">{todo.title}</h2>

        {/* ── Description ── */}
        {todo.description && (
          <p className="detail-description">{todo.description}</p>
        )}

        {/* ── Due date ── */}
        {due && (
          <div className={`detail-due-row ${dueDateClass}`}>
            <FiClock size={14} />
            <span>
              {isOverdue ? "Overdue · " : isDueToday ? "Due today" : "Due "}
              {!isDueToday && due.toLocaleDateString(undefined, {
                day: "numeric", month: "short", year: "numeric",
              })}
            </span>
          </div>
        )}

        {/* ── Link ── */}
        {todo.link && (
          <button className="detail-link-pill" onClick={handleLinkClick}>
            <FiExternalLink size={13} />
            <span>{getDomain(todo.link)}</span>
          </button>
        )}

        {/* ── Meta ── */}
        <div className="detail-meta">
          <div className="detail-meta-row">
            <FiCalendar size={13} />
            <span>Created {createdLabel}</span>
          </div>
          {updatedLabel && updatedLabel !== createdLabel && (
            <div className="detail-meta-row">
              <FiClock size={13} />
              <span>Last updated {updatedLabel}</span>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="detail-footer">
          <button className="detail-edit-btn" onClick={() => onEdit(todo)}>
            <FiEdit2 size={14} />
            Edit Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPanel;