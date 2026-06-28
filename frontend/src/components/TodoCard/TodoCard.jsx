import { FiExternalLink, FiStar } from "react-icons/fi";
import "./TodoCard.css";

const TodoCard = ({ todo, onEdit, onDelete, onToggleStar, isListView = false }) => {
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

  // ── Due date status ──
  const now = new Date();
  const due = todo.dueDate ? new Date(todo.dueDate) : null;
  const isOverdue  = due && due < now && todo.status !== "done";
  const isDueToday = due && due.toDateString() === now.toDateString() && todo.status !== "done";

  const dueDateLabel = due
    ? isOverdue
      ? `Overdue · ${due.toLocaleDateString()}`
      : isDueToday
      ? "Due today"
      : `Due ${due.toLocaleDateString()}`
    : null;

  const dueDateClass = isOverdue ? "due-overdue" : isDueToday ? "due-today" : "due-upcoming";

  const StarButton = (
    <button
      className={`star-btn ${todo.star ? "star-btn--active" : ""}`}
      onClick={handleStarClick}
      title={todo.star ? "Unmark important" : "Mark as important"}
    >
      <FiStar size={15} fill={todo.star ? "currentColor" : "none"} />
    </button>
  );

  if (isListView) {
    return (
      <div className="todo-card todo-card--list neu-card">
        <div className="todo-list-left">
          <span className={`status-badge ${getStatusClass()}`}>
            {getStatusText()}
          </span>
          {StarButton}
          <h3>{todo.title}</h3>
          {dueDateLabel && <span className={`due-badge ${dueDateClass}`}>{dueDateLabel}</span>}
          <span className="todo-date">
            {new Date(todo.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="todo-list-actions">
          {todo.link && (
            <button className="link-btn" onClick={handleLinkClick} title="Open link">
              <FiExternalLink size={14} />
            </button>
          )}
          <button className="edit-btn" onClick={() => onEdit(todo)}>Edit</button>
          <button className="delete-btn" onClick={() => onDelete(todo._id)}>Delete</button>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-card neu-card">
      <div className="todo-content">
        <div className="todo-card-top-row">
          <div className={`status-badge ${getStatusClass()}`}>
            {getStatusText()}
          </div>
          {StarButton}
        </div>
        <h3>{todo.title}</h3>
        {todo.description && <p>{todo.description}</p>}

        {dueDateLabel && <span className={`due-badge ${dueDateClass}`}>{dueDateLabel}</span>}

        {todo.link && (
          <button className="todo-link-pill" onClick={handleLinkClick}>
            <FiExternalLink size={12} />
            <span>{todo.link.replace(/^https?:\/\//, "").split("/")[0]}</span>
          </button>
        )}
      </div>
      <div className="todo-footer">
        <span className="todo-date">
          {new Date(todo.createdAt).toLocaleDateString()}
        </span>
        <div className="todo-actions">
          <button className="edit-btn" onClick={() => onEdit(todo)}>Edit</button>
          <button className="delete-btn" onClick={() => onDelete(todo._id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;