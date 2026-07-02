import { FiExternalLink, FiStar, FiCopy } from "react-icons/fi";
import { getUrgencyLevel, getUrgencyLabel } from "../../utils/dueDateUrgency";
import "./TodoCard.css";

const STATUS_CYCLE = ["pending", "inprogress", "done"];

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

  // ── Due date urgency (color-coded: overdue/today/soon/week/later) ──
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

  if (isListView) {
    return (
      <div className={`todo-card todo-card--list neu-card ${urgencyClass}`}>
        <div className="todo-list-left">
          <StatusBadge />
          {StarButton}
          <h3 onClick={handleTitleClick} className="todo-title-clickable">
            {todo.title}
          </h3>
          {dueDateLabel && <span className={`due-badge ${dueDateClass}`}>{dueDateLabel}</span>}
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
          <button className="edit-btn" onClick={() => onEdit(todo)}>Edit</button>
          <button className="delete-btn" onClick={() => onDelete(todo._id)}>Delete</button>
        </div>
      </div>
    );
  }

  return (
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
          <button className="edit-btn" onClick={() => onEdit(todo)}>Edit</button>
          <button className="delete-btn" onClick={() => onDelete(todo._id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;