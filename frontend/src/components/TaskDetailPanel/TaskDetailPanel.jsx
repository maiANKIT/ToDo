import { useEffect, useState } from "react";
import {
  FiX, FiExternalLink, FiCalendar, FiClock, FiEdit2, FiStar, FiCopy,
  FiPlus, FiTrash2, FiCheck, FiChevronDown, FiLink,
} from "react-icons/fi";
import { getUrgencyLevel } from "../../utils/dueDateUrgency";
import { STATUS, getNextStatus, PRIORITY, PRIORITY_ORDER, PRIORITY_META, getNextPriority } from "../../utils/taskEnums";
import { addSubtask, updateSubtask, deleteSubtask } from "../../services/todoAPI";
import "./TaskDetailPanel.css";

const TaskDetailPanel = ({
  todo, onClose, onEdit, onStatusChange, onToggleStar, onDuplicate,
  onPriorityChange, onRefresh,
}) => {
  // ── Subtask creation form state ──
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [subtaskDescription, setSubtaskDescription] = useState("");
  const [subtaskLink, setSubtaskLink] = useState("");
  const [subtaskDueDate, setSubtaskDueDate] = useState("");
  const [subtaskPriority, setSubtaskPriority] = useState(PRIORITY.MEDIUM);
  const [subtaskExpanded, setSubtaskExpanded] = useState(false);
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

  const resetSubtaskForm = () => {
    setSubtaskTitle("");
    setSubtaskDescription("");
    setSubtaskLink("");
    setSubtaskDueDate("");
    setSubtaskPriority(PRIORITY.MEDIUM);
    setSubtaskExpanded(false);
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!subtaskTitle.trim() || addingSubtask) return;
    setAddingSubtask(true);
    try {
      await addSubtask(todo._id, {
        title: subtaskTitle.trim(),
        description: subtaskDescription.trim() || undefined,
        link: subtaskLink.trim() || undefined,
        dueDate: subtaskDueDate || undefined,
        priority: subtaskPriority,
      });
      resetSubtaskForm();
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

  const handleCycleSubtaskPriority = async (subtask) => {
    try {
      await updateSubtask(todo._id, subtask._id, { priority: getNextPriority(subtask.priority || PRIORITY.MEDIUM) });
      onRefresh?.();
    } catch (err) {
      console.error("Failed to update subtask priority:", err?.response?.data || err);
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
              {subtasks.map((s) => {
                const sPriorityMeta = s.priority ? PRIORITY_META[s.priority] : null;
                const sDue = s.dueDate ? new Date(s.dueDate) : null;
                return (
                  <div key={s._id} className="detail-subtask-item">
                    <button
                      className={`detail-subtask-check ${s.status === STATUS.DONE ? "detail-subtask-check--done" : ""}`}
                      onClick={() => handleToggleSubtask(s)}
                      title={s.status === STATUS.DONE ? "Mark as pending" : "Mark as done"}
                    >
                      {s.status === STATUS.DONE && <FiCheck size={12} />}
                    </button>

                    <div className="detail-subtask-body">
                      <span className={`detail-subtask-title ${s.status === STATUS.DONE ? "detail-subtask-title--done" : ""}`}>
                        {s.title}
                      </span>
                      {s.description && (
                        <span className="detail-subtask-desc">{s.description}</span>
                      )}
                      <div className="detail-subtask-meta-row">
                        {sPriorityMeta && (
                          <button
                            className={`detail-subtask-priority detail-subtask-priority--${sPriorityMeta.className.replace("priority-", "")}`}
                            onClick={() => handleCycleSubtaskPriority(s)}
                            title="Click to change priority"
                          >
                            {sPriorityMeta.label}
                          </button>
                        )}
                        {sDue && (
                          <span className="detail-subtask-date">
                            <FiCalendar size={10} />
                            {sDue.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </span>
                        )}
                        {s.link && (
                          <a
                            className="detail-subtask-link"
                            href={/^https?:\/\//i.test(s.link) ? s.link : `https://${s.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiLink size={10} />
                            {getDomain(s.link)}
                          </a>
                        )}
                      </div>
                    </div>

                    <button
                      className="detail-subtask-delete"
                      onClick={() => handleDeleteSubtask(s._id)}
                      title="Delete subtask"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <form className="detail-subtask-add-form" onSubmit={handleAddSubtask}>
            <div className="detail-subtask-add-row">
              <input
                type="text"
                className="detail-subtask-input"
                placeholder="Add a subtask..."
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
              />
              <button
                type="button"
                className="detail-subtask-expand-btn"
                onClick={() => setSubtaskExpanded((p) => !p)}
                title={subtaskExpanded ? "Hide extra fields" : "Add description, link, due date, priority"}
              >
                <FiChevronDown
                  size={16}
                  className={subtaskExpanded ? "detail-subtask-expand-icon detail-subtask-expand-icon--open" : "detail-subtask-expand-icon"}
                />
              </button>
              <button
                type="submit"
                className="detail-subtask-add-btn"
                disabled={!subtaskTitle.trim() || addingSubtask}
                title="Add subtask"
              >
                <FiPlus size={16} />
              </button>
            </div>

            {subtaskExpanded && (
              <div className="detail-subtask-extra-fields">
                <textarea
                  className="detail-subtask-textarea"
                  placeholder="Description (optional)"
                  value={subtaskDescription}
                  onChange={(e) => setSubtaskDescription(e.target.value)}
                />
                <div className="detail-subtask-link-wrap">
                  <FiLink size={13} className="detail-subtask-link-icon" />
                  <input
                    type="text"
                    className="detail-subtask-input detail-subtask-input--link"
                    placeholder="Link (optional)"
                    value={subtaskLink}
                    onChange={(e) => setSubtaskLink(e.target.value)}
                  />
                </div>
                <input
                  type="date"
                  className="detail-subtask-input"
                  value={subtaskDueDate}
                  onChange={(e) => setSubtaskDueDate(e.target.value)}
                />
                <div className="detail-subtask-priority-picker">
                  {PRIORITY_ORDER.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`detail-subtask-priority-option detail-subtask-priority-option--${PRIORITY_META[p].className.replace("priority-", "")} ${subtaskPriority === p ? "detail-subtask-priority-option--active" : ""}`}
                      onClick={() => setSubtaskPriority(p)}
                    >
                      {PRIORITY_META[p].label}
                    </button>
                  ))}
                </div>
              </div>
            )}
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