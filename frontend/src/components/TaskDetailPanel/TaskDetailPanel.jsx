import { useEffect, useState } from "react";
import { FiX, FiExternalLink, FiCalendar, FiClock, FiEdit2, FiStar, FiCopy, FiPlus, FiTrash2, FiCheck } from "react-icons/fi";
import { getUrgencyLevel } from "../../utils/dueDateUrgency";
import { STATUS, getNextStatus, PRIORITY_META, getNextPriority } from "../../utils/taskEnums";
import { addSubtask, updateSubtask, deleteSubtask } from "../../services/todoAPI";
import "./TaskDetailPanel.css";

const TaskDetailPanel = ({
  todo, onClose, onEdit, onStatusChange, onToggleStar, onDuplicate,
  onPriorityChange, onRefresh,
}) => {
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);

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
    if (todo.status === STATUS.DONE) return "status-done";
    if (todo.status === STATUS.IN_PROGRESS) return "status-progress";
    return "status-pending";
  };

  const getStatusText = () => {
    if (todo.status === STATUS.DONE) return "Completed";
    if (todo.status === STATUS.IN_PROGRESS) return "In Progress";
    return "Pending";
  };

  const handleStatusClick = () => {
    if (!onStatusChange) return;
    onStatusChange(todo._id, getNextStatus(todo.status));
  };

  const handlePriorityClick = () => {
    if (!onPriorityChange || !todo.priority) return;
    onPriorityChange(todo._id, getNextPriority(todo.priority));
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

  const due = todo.dueDate ? new Date(todo.dueDate) : null;
  const urgency = getUrgencyLevel(todo.dueDate, todo.status);
  const isOverdue  = urgency === "overdue";
  const isDueToday = urgency === "today";
  const dueDateClass = `due-${urgency}`;

  const createdLabel = new Date(todo.createdAt).toLocaleDateString(undefined, {
    day: "numeric", month: "short", year: "numeric",
  });
  const updatedLabel = todo.updatedAt
    ? new Date(todo.updatedAt).toLocaleDateString(undefined, {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  const priorityMeta = todo.priority ? PRIORITY_META[todo.priority] : null;

  const subtasks = todo.subtasks || [];
  const subtaskDoneCount = subtasks.filter((s) => s.status === STATUS.DONE).length;

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!subtaskTitle.trim() || addingSubtask) return;
    setAddingSubtask(true);
    try {
      await addSubtask(todo._id, { title: subtaskTitle.trim() });
      setSubtaskTitle("");
      onRefresh?.();
    } catch (err) {
      console.error("Failed to add subtask:", err?.response?.data || err);
    } finally {
      setAddingSubtask(false);
    }
  };

  const handleToggleSubtask = async (subtask) => {
    const nextStatus = subtask.status === STATUS.DONE ? STATUS.PENDING : STATUS.DONE;
    try {
      await updateSubtask(todo._id, subtask._id, { status: nextStatus });
      onRefresh?.();
    } catch (err) {
      console.error("Failed to update subtask:", err?.response?.data || err);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await deleteSubtask(todo._id, subtaskId);
      onRefresh?.();
    } catch (err) {
      console.error("Failed to delete subtask:", err?.response?.data || err);
    }
  };

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

        {/* ── Priority pill ── */}
        {priorityMeta && (
          <button
            className={`detail-priority-pill detail-priority-pill--${priorityMeta.className.replace("priority-", "")}`}
            onClick={handlePriorityClick}
            title="Click to change priority"
          >
            {priorityMeta.label} priority
          </button>
        )}

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

        {/* ── Subtasks ── */}
        <div className="detail-subtasks">
          <div className="detail-subtasks-title">
            <span>Subtasks</span>
            {subtasks.length > 0 && <span>{subtaskDoneCount}/{subtasks.length}</span>}
          </div>

          {subtasks.length > 0 && (
            <div className="detail-subtask-list">
              {subtasks.map((s) => (
                <div key={s._id} className="detail-subtask-item">
                  <button
                    className={`detail-subtask-check ${s.status === STATUS.DONE ? "detail-subtask-check--done" : ""}`}
                    onClick={() => handleToggleSubtask(s)}
                    title={s.status === STATUS.DONE ? "Mark as pending" : "Mark as done"}
                  >
                    {s.status === STATUS.DONE && <FiCheck size={12} />}
                  </button>
                  <span className={`detail-subtask-title ${s.status === STATUS.DONE ? "detail-subtask-title--done" : ""}`}>
                    {s.title}
                  </span>
                  <button
                    className="detail-subtask-delete"
                    onClick={() => handleDeleteSubtask(s._id)}
                    title="Delete subtask"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form className="detail-subtask-add-row" onSubmit={handleAddSubtask}>
            <input
              type="text"
              className="detail-subtask-input"
              placeholder="Add a subtask..."
              value={subtaskTitle}
              onChange={(e) => setSubtaskTitle(e.target.value)}
            />
            <button
              type="submit"
              className="detail-subtask-add-btn"
              disabled={!subtaskTitle.trim() || addingSubtask}
              title="Add subtask"
            >
              <FiPlus size={16} />
            </button>
          </form>
        </div>

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
          <div className="detail-footer-row">
            <button
              className="detail-duplicate-btn"
              onClick={() => onDuplicate?.(todo)}
              title="Duplicate task"
            >
              <FiCopy size={14} />
            </button>
            <button className="detail-edit-btn" onClick={() => onEdit(todo)}>
              <FiEdit2 size={14} />
              Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPanel;