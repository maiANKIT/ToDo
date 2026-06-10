import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

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

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-box">
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
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
            >
              {editTodo
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default TodoModal;
