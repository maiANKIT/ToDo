import { useState, useEffect } from "react";

import "./TodoModal.css";

const TodoModal = ({
  onClose,
  onSubmit,
  editTodo,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title);
      setDescription(editTodo.description);
    }
  }, [editTodo]);

  const submitHandler = (e) => {
    e.preventDefault();

    onSubmit({
      title,
      description,
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box neu-card">
        <h2>
          {editTodo
            ? "Edit Task"
            : "Create Task"}
        </h2>

        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            required
          />

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit">
              {editTodo
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoModal;