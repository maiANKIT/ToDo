import { useState, useRef } from "react";
import { FiExternalLink, FiStar, FiCopy, FiClock, FiCheck, FiTrash2, FiEdit2 } from "react-icons/fi";
import { getUrgencyLevel, getUrgencyLabel } from "../../utils/dueDateUrgency";
import "./TodoCard.css";

const STATUS_CYCLE = ["pending", "inprogress", "done"];
const SWIPE_THRESHOLD = 90;
const SWIPE_MAX = 130;
const LONG_PRESS_MS = 500;
const LONG_PRESS_MOVE_TOLERANCE = 10;

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
}) => {
  const swipeEnabled = !isKanban;
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [longPressActive, setLongPressActive] = useState(false);

  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const swipeLockRef = useRef(null);
  const longPressTimerRef = useRef(null);
  const longPressFiredRef = useRef(false);

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

  const handleLinkClick = (e) => {
    e.stopPropagation();
    let url = todo.link.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    onToggleStar?.(todo._id, !todo.star);
  };

  const handleStatusClick = (e) => {
    e.stopPropagation();
    if (!onStatusChange) return;
    const currentIndex = STATUS_CYCLE.indexOf(todo.status);
    const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
    onStatusChange(todo._id, nextStatus);
  };

  const handleTitleClick = (e) => {
    e.stopPropagation();
    onViewDetails?.(todo);
  };

  const handleDuplicateClick = (e) => {
    e.stopPropagation();
    onDuplicate?.(todo);
  };

  // ── Long-press → Edit ──
  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const startLongPressTimer = () => {
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

  // ── Swipe + long-press handlers (touch only) ──
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

    const clamped = Math.max(-SWIPE_MAX, Math.min(SWIPE_MAX, dx));
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
      if (swipeX >= SWIPE_THRESHOLD) {
        onStatusChange?.(todo._id, "done");
      } else if (swipeX <= -SWIPE_THRESHOLD) {
        onDelete?.(todo._id);
      }
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

  // ── Due date urgency ──
  const urgency = getUrgencyLevel(todo.dueDate, todo.status);
  const dueDateLabel = todo.dueDate ? getUrgencyLabel(todo.dueDate, urgency) : null;
  const dueDateClass = `due-${urgency}`;
  const urgencyClass = urgency !== "none" ? `urgency-${urgency}` : "";

  // ── Favicon helpers ──
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
      title={todo.star ? "Unmark important" : "Mark as important"}
    >
      <FiStar size={15} fill={todo.star ? "currentColor" : "none"} />
    </button>
  );

  const StatusBadge = ({ extraClass = "" }) => (
    <button
      className={`status-badge status-badge--clickable ${getStatusClass()} ${extraClass}`}
      onClick={handleStatusClick}
      title="Click to change status"
    >
      {getStatusText()}
    </button>
  );

  const DuplicateButton = ({ className = "duplicate-btn" }) => (
    <button
      className={className}
      onClick={handleDuplicateClick}
      title="Duplicate task"
    >
      <FiCopy size={14} />
    </button>
  );

  const EstimateBadge = () =>
    todo.estimate ? (
      <span className="estimate-badge" title="Time estimate">
        <FiClock size={11} />
        {todo.estimate}
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
      <div className={`todo-card todo-card--list neu-card ${urgencyClass}`}>
        <div className="todo-list-left">
          <StatusBadge />
          {StarButton}
          <h3 onClick={handleTitleClick} className="todo-title-clickable">
            {todo.title}
          </h3>
          {dueDateLabel && <span className={`due-badge ${dueDateClass}`}>{dueDateLabel}</span>}
          <EstimateBadge />
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
          <button className="edit-btn" onClick={() => onEdit(todo)} title="Edit task">
            <FiEdit2 size={14} />
          </button>
          <button className="delete-btn" onClick={() => onDelete(todo._id)} title="Delete task">
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
    );
  } else {
    cardBody = (
      <div className={`todo-card neu-card ${urgencyClass}`}>
        <div className="todo-content">
          <div className="todo-card-top-row">
            <StatusBadge extraClass="status-badge--card" />
            {StarButton}
          </div>
          <h3 onClick={handleTitleClick} className="todo-title-clickable">
            {todo.title}
          </h3>
          {todo.description && <p>{todo.description}</p>}

          {dueDateLabel && <span className={`due-badge ${dueDateClass}`}>{dueDateLabel}</span>}
          <EstimateBadge />

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
            <button className="edit-btn" onClick={() => onEdit(todo)} title="Edit task">
              <FiEdit2 size={16} />
            </button>
            <button className="delete-btn" onClick={() => onDelete(todo._id)} title="Delete task">
              <FiTrash2 size={16} />
            </button>
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
      <div className="swipe-bg swipe-bg--done" style={{ opacity: doneOpacity }}>
        <FiCheck size={18} /> Done
      </div>
      <div className="swipe-bg swipe-bg--delete" style={{ opacity: deleteOpacity }}>
        <FiTrash2 size={18} /> Delete
      </div>
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