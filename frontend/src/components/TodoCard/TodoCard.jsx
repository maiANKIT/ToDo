import { FiExternalLink } from "react-icons/fi";
import "./TodoCard.css";

const TodoCard = ({ todo, onEdit, onDelete, isListView = false }) => {
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

  if (isListView) {
    return (
      <div className="todo-card todo-card--list neu-card">
        <div className="todo-list-left">
          <span className={`status-badge ${getStatusClass()}`}>
            {getStatusText()}
          </span>
          <h3>{todo.title}</h3>
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
        <div className={`status-badge ${getStatusClass()}`}>
          {getStatusText()}
        </div>
        <h3>{todo.title}</h3>
        {todo.description && <p>{todo.description}</p>}

        {/* Link pill — only shown when link exists */}
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