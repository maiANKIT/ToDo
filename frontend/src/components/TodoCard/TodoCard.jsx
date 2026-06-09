import "./TodoCard.css";

const TodoCard = ({ todo, onEdit, onDelete }) => {
  return (
    <div className="todo-card neu-card">
      <h3>{todo.title}</h3>

      <p>{todo.description}</p>

      <div className="todo-actions">
        <button
          className="edit-btn"
          onClick={() => onEdit(todo)}
        >
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(todo._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoCard;