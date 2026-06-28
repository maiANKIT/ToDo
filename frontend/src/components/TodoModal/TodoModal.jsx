import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiLink } from "react-icons/fi";
import "./TodoModal.css";

const TodoModal = ({ onClose, onSubmit, editTodo }) => {
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [link,        setLink]        = useState("");
  const [status,      setStatus]      = useState("pending");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const statusOptions = [
    { value: "pending",    label: "Pending"     },
    { value: "inprogress", label: "In Progress" },
    { value: "done",       label: "Done"        },
  ];

  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title       || "");
      setDescription(editTodo.description || "");
      setLink(editTodo.link         || "");
      setStatus(editTodo.status     || "pending");
    }
  }, [editTodo]);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".custom-select-wrapper")) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    // Send link as empty string if blank so backend stores nothing
    onSubmit({ title, description, link: link.trim(), status });
    onClose();
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>{editTodo ? "Edit Task" : "Create Task"}</h2>

        <form onSubmit={submitHandler}>
          {/* Title */}
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Description */}
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Link — optional */}
          <div className="modal-link-wrap">
            <span className="modal-link-icon"><FiLink size={15} /></span>
            <input
              type="url"
              className="modal-link-input"
              placeholder="Link (optional) — https://..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            {link && (
              <button
                type="button"
                className="modal-link-clear"
                onClick={() => setLink("")}
                title="Clear link"
              >
                ×
              </button>
            )}
          </div>

          {/* Status dropdown */}
          <div className="custom-select-wrapper">
            <div
              className={`custom-select ${dropdownOpen ? "open" : ""}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{statusOptions.find((o) => o.value === status)?.label}</span>
              <svg
                className={`select-arrow ${dropdownOpen ? "rotated" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                width="16" height="16"
                viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {dropdownOpen && (
              <div className="custom-options">
                {statusOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className={`custom-option ${status === opt.value ? "selected" : ""}`}
                    onClick={() => { setStatus(opt.value); setDropdownOpen(false); }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {editTodo ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default TodoModal;