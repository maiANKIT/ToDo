import { useState, useRef } from "react";
import { FiExternalLink, FiStar, FiCopy, FiClock, FiCheck, FiTrash2, FiEdit2, FiCheckSquare } from "react-icons/fi";
import { getUrgencyLevel, getUrgencyLabel } from "../../utils/dueDateUrgency";
import { STATUS, getStatusKey, getNextStatus, STATUS_LABELS, PRIORITY_META } from "../../utils/taskEnums";
import "./TodoCard.css";

const SWIPE_THRESHOLD = 90;
const SWIPE_MAX = 130;
const LONG_PRESS_MS = 500;
const LONG_PRESS_MOVE_TOLERANCE = 10;

// Default: unrestricted — used for Personal tasks or when no permissions
// prop is passed in (keeps older call sites working unchanged).
const FULL_PERMISSIONS = {
  canCreate: true, canEdit: true, canDelete: true,
};

const TodoCard = ({
  todo,
  onEdit,
  onDelete,
  onToggleStar,
  onStatusChange,
  onViewDetails,
  onDuplicate,
  isListView = false,
  isKanban = false,
  permissions = FULL_PERMISSIONS,
}) => {
  const canEdit   = permissions.canEdit   ?? true;
  const canDelete = permissions.canDelete ?? true;
  const canCreate = permissions.canCreate ?? true; // gates Duplicate (creates a new task)

  // Swipe only makes sense if at least one swipe action is allowed
  const swipeEnabled = !isKanban && (canEdit || canDelete);

  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [longPressActive, setLongPressActive] = useState(false);

  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const swipeLockRef = useRef(null);
  const longPressTimerRef = useRef(null);
  const longPressFiredRef = useRef(false);

  const getStatusClass = () => {
    const key = getStatusKey(todo.status);
    if (key === "done") return "status-done";
    if (key === "inprogress") return "status-progress";
    return "status-pending";
  };

  const getStatusText = () => STATUS_LABELS[todo.status] || "Pending";

  const handleLinkClick = (e) => {
    e.stopPropagation();
    let url = todo.link.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    if (!canEdit) return;
    onToggleStar?.(todo._id, !todo.star);
  };

  const handleStatusClick = (e) => {
    e.stopPropagation();
    if (!canEdit || !onStatusChange) return;
    onStatusChange(todo._id, getNextStatus(todo.status));
  };

  const handleCardClick = () => { onViewDetails?.(todo); };
  const handleEditClick = (e) => { e.stopPropagation(); if (!canEdit) return; onEdit?.(todo); };
  const handleDeleteClick = (e) => { e.stopPropagation(); if (!canDelete) return; onDelete?.(todo._id); };
  const handleDuplicateClick = (e) => { e.stopPropagation(); if (!canCreate) return; onDuplicate?.(todo); };

  // ── Long-press → Edit (only when editing is allowed) ──
  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const startLongPressTimer = () => {
    if (!canEdit) return;
    longPressFiredRef.current = false;
    clearLongPressTimer();
    longPressTimerRef.current = setTimeout(() => {
      if (swipeLockRef.current === "x") return;
      longPressFiredRef.current = true;
      setLongPressActive(true);
      if (navigator.vibrate) navigator.vibrate(35);
      setTimeout(() => setLongPressActive(false), 220);
      onEdit?.(todo);
    }, LONG_PRESS_MS);
  };

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStartXRef.current = t.clientX;
    touchStartYRef.current = t.clientY;
    swipeLockRef.current = null;
    setSwiping(true);
    startLongPressTimer();
  };

  const handleTouchMove = (e) => {
    const t = e.touches[0];
    const dx = t.clientX - touchStartXRef.current;
    const dy = t.clientY - touchStartYRef.current;

    if (swipeLockRef.current === null) {
      if (Math.abs(dx) > LONG_PRESS_MOVE_TOLERANCE || Math.abs(dy) > LONG_PRESS_MOVE_TOLERANCE) {
        swipeLockRef.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        clearLongPressTimer();
      }
    }
    if (swipeLockRef.current !== "x") return;

    // Clamp the swipe range down to only the direction(s) actually permitted
    const maxRight = canEdit   ? SWIPE_MAX : 0;   // right swipe = mark done
    const maxLeft  = canDelete ? SWIPE_MAX : 0;    // left swipe  = delete
    const clamped = Math.max(-maxLeft, Math.min(maxRight, dx));
    setSwipeX(clamped);
  };

  const handleTouchEnd = () => {
    clearLongPressTimer();
    setSwiping(false);

    if (longPressFiredRef.current) {
      longPressFiredRef.current = false;
      setSwipeX(0);
      swipeLockRef.current = null;
      return;
    }

    if (swipeLockRef.current === "x") {
      if (swipeX >= SWIPE_THRESHOLD && canEdit) onStatusChange?.(todo._id, STATUS.DONE);
      else if (swipeX <= -SWIPE_THRESHOLD && canDelete) onDelete?.(todo._id);
    }
    setSwipeX(0);
    swipeLockRef.current = null;
  };

  const handleTouchCancel = () => {
    clearLongPressTimer();
    setSwiping(false);
    setSwipeX(0);
    swipeLockRef.current = null;
    longPressFiredRef.current = false;
  };

  const swipeStyle = swipeEnabled
    ? {
        transform: `translateX(${swipeX}px)`,
        transition: swiping ? "none" : "transform 0.28s cubic-bezier(0.34, 1.4, 0.64, 1)",
      }
    : undefined;

  const doneOpacity   = swipeX > 0 ? Math.min(1, swipeX / SWIPE_THRESHOLD) : 0;
  const deleteOpacity = swipeX < 0 ? Math.min(1, -swipeX / SWIPE_THRESHOLD) : 0;

  const urgency      = getUrgencyLevel(todo.dueDate, todo.status);
  const dueDateLabel = todo.dueDate ? getUrgencyLabel(todo.dueDate, urgency) : null;
  const dueDateClass = `due-${urgency}`;
  const urgencyClass = urgency !== "none" ? `urgency-${urgency}` : "";

  const priorityMeta = todo.priority ? PRIORITY_META[todo.priority] : null;

  const subtaskTotal = todo.subtasks?.length || 0;
  const subtaskDone  = todo.subtasks?.filter((s) => s.status === STATUS.DONE).length || 0;

  const isDone = todo.status === STATUS.DONE;
  const priorityAccentClass = priorityMeta
    ? `priority-accent--${priorityMeta.className.replace("priority-", "")}`
    : "";

  const getDomain = (url) => {
    try {
      return new URL(
        url.trim().match(/^https?:\/\//i) ? url.trim() : "https://" + url.trim()
      ).hostname.replace("www.", "");
    } catch {
      return url.replace(/^https?:\/\//, "").split("/")[0];
    }
  };

  const FaviconImg = ({ url, size = 14 }) => {
    const domain = getDomain(url);
    return (
      <>
        <img
          src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
          alt={domain}
          className="link-favicon"
          loading="lazy"
          onError={(e) => {
            if (!e.target.dataset.fallback) {
              e.target.dataset.fallback = "1";
              e.target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
            } else if (e.target.dataset.fallback === "1") {
              e.target.dataset.fallback = "2";
              e.target.src = `https://${domain}/favicon.ico`;
            } else {
              e.target.style.display = "none";
              if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
            }
          }}
        />
        <span className="link-fallback-icon" style={{ display: "none" }}>
          <FiExternalLink size={size} />
        </span>
      </>
    );
  };

  const StarButton = (
    <button
      className={`star-btn ${todo.star ? "star-btn--active" : ""}`}
      onClick={handleStarClick}
      disabled={!canEdit}
      title={!canEdit ? "View only" : todo.star ? "Unmark important" : "Mark as important"}
      style={!canEdit ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
    >
      <FiStar size={15} fill={todo.star ? "currentColor" : "none"} />
    </button>
  );

  const StatusBadge = ({ extraClass = "" }) => (
    <button
      className={`status-badge status-badge--clickable ${getStatusClass()} ${extraClass}`}
      onClick={handleStatusClick}
      disabled={!canEdit}
      title={canEdit ? "Click to change status" : "View only"}
      style={!canEdit ? { cursor: "default", opacity: 0.85 } : undefined}
    >
      {getStatusText()}
    </button>
  );

  const DuplicateButton = ({ className = "duplicate-btn" }) =>
    canCreate ? (
      <button className={className} onClick={handleDuplicateClick} title="Duplicate task">
        <FiCopy size={14} />
      </button>
    ) : null;

  const EstimateBadge = () =>
    todo.estimate ? (
      <span className="estimate-badge" title="Time estimate">
        <FiClock size={11} />
        {todo.estimate}
      </span>
    ) : null;

  const PriorityBadge = () =>
    priorityMeta ? (
      <span className={`priority-badge ${priorityMeta.className}`} title="Priority">
        {priorityMeta.label}
      </span>
    ) : null;

  const SubtaskBadge = () =>
    subtaskTotal > 0 ? (
      <span className="subtask-badge" title="Subtasks completed">
        <FiCheckSquare size={11} />
        {subtaskDone}/{subtaskTotal}
      </span>
    ) : null;

  const SubtaskProgress = () => {
    if (subtaskTotal === 0) return null;
    const pct     = Math.round((subtaskDone / subtaskTotal) * 100);
    const allDone = subtaskDone === subtaskTotal;
    return (
      <div className="subtask-progress">
        <div className="subtask-progress__label">
          <FiCheckSquare size={11} />
          <span>{subtaskDone}/{subtaskTotal}</span>
        </div>
        <div className="subtask-progress__track">
          <div
            className={`subtask-progress__fill ${allDone ? "subtask-progress__fill--complete" : ""}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  };

  const isWorkspaceTask = !!todo.workspace && typeof todo.user === "object" && todo.user?.name;

  const CreatorBadge = () =>
    isWorkspaceTask ? (
      <span className="creator-badge" title={`Created by ${todo.user.name}`}>
        <span className="creator-badge-avatar">{todo.user.name[0]?.toUpperCase()}</span>
        {todo.user.name}
      </span>
    ) : null;

  const swipeTouchProps = swipeEnabled
    ? {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        onTouchCancel: handleTouchCancel,
      }
    : {};

  let cardBody;

  if (isListView) {
    cardBody = (
      <div
        className={`todo-card todo-card--list neu-card todo-card--clickable ${urgencyClass} ${priorityAccentClass} ${isDone ? "todo-card--done" : ""}`}
        onClick={handleCardClick}
      >
        <div className="todo-list-left">
          <StatusBadge />
          {StarButton}
          <h3 className="todo-title-clickable">{todo.title}</h3>
          {dueDateLabel && <span className={`due-badge ${dueDateClass}`}>{dueDateLabel}</span>}
          <PriorityBadge />
          <SubtaskBadge />
          <EstimateBadge />
          <CreatorBadge />
          <span className="todo-date">
            {new Date(todo.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="todo-list-actions">
          {todo.link && (
            <button className="link-btn" onClick={handleLinkClick} title={getDomain(todo.link)}>
              <FaviconImg url={todo.link} size={14} />
            </button>
          )}
          <DuplicateButton className="link-btn" />
          {canEdit && (
            <button className="edit-btn" onClick={handleEditClick} title="Edit task">
              <FiEdit2 size={14} />
            </button>
          )}
          {canDelete && (
            <button className="delete-btn" onClick={handleDeleteClick} title="Delete task">
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
      </div>
    );
  } else {
    cardBody = (
      <div
        className={`todo-card neu-card todo-card--clickable ${urgencyClass} ${priorityAccentClass} ${isDone ? "todo-card--done" : ""}`}
        onClick={handleCardClick}
      >
        <div className="todo-content">
          <div className="todo-card-top-row">
            <StatusBadge extraClass="status-badge--card" />
            {StarButton}
          </div>
          <h3 className="todo-title-clickable">{todo.title}</h3>
          {todo.description && <p>{todo.description}</p>}
          {dueDateLabel && <span className={`due-badge ${dueDateClass}`}>{dueDateLabel}</span>}
          <PriorityBadge />

          <SubtaskProgress />

          <EstimateBadge />
          <CreatorBadge />

          {todo.link && (
            <button className="todo-link-pill" onClick={handleLinkClick}>
              <FaviconImg url={todo.link} size={12} />
              <span>{getDomain(todo.link)}</span>
            </button>
          )}
        </div>
        <div className="todo-footer">
          <span className="todo-date">
            {new Date(todo.createdAt).toLocaleDateString()}
          </span>
          <div className="todo-actions">
            <DuplicateButton />
            {canEdit && (
              <button className="edit-btn" onClick={handleEditClick} title="Edit task">
                <FiEdit2 size={16} />
              </button>
            )}
            {canDelete && (
              <button className="delete-btn" onClick={handleDeleteClick} title="Delete task">
                <FiTrash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!swipeEnabled) return cardBody;

  return (
    <div
      className={`swipe-wrap ${longPressActive ? "swipe-wrap--longpress" : ""}`}
      style={swipeStyle}
      {...swipeTouchProps}
    >
      {canEdit && (
        <div className="swipe-bg swipe-bg--done" style={{ opacity: doneOpacity }}>
          <FiCheck size={18} /> Done
        </div>
      )}
      {canDelete && (
        <div className="swipe-bg swipe-bg--delete" style={{ opacity: deleteOpacity }}>
          <FiTrash2 size={18} /> Delete
        </div>
      )}
      {longPressActive && (
        <div className="longpress-flash">
          <FiEdit2 size={20} />
        </div>
      )}
      {cardBody}
    </div>
  );
};

export default TodoCard;