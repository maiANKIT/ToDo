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
        <p>{todo.description}</p>
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