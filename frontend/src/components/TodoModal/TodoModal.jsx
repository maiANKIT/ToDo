import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiLink, FiStar, FiZap, FiCalendar, FiClock } from "react-icons/fi";
import DateTimePicker from "../DateTimePicker/DateTimePicker";
import { parseQuickAdd } from "../../utils/quickAddParser";
import { STATUS, PRIORITY, PRIORITY_ORDER } from "../../utils/taskEnums";
import "./TodoModal.css";

const TodoModal = ({ onClose, onSubmit, editTodo }) => {
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [link,        setLink]        = useState("");
  const [status,      setStatus]      = useState(STATUS.PENDING);
  const [priority,    setPriority]    = useState(PRIORITY.MEDIUM);
  const [dueDate,     setDueDate]     = useState("");
  const [estimate,    setEstimate]    = useState("");
  const [star,        setStar]        = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownFlip, setDropdownFlip] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [priorityDropdownFlip, setPriorityDropdownFlip] = useState(false);

  const [quickMode, setQuickMode] = useState(false);
  const [quickText, setQuickText] = useState("");

  const selectRef = useRef(null);
  const priorityRef = useRef(null);

  const statusOptions = [
    { value: STATUS.PENDING,     label: "Pending"     },
    { value: STATUS.IN_PROGRESS, label: "In Progress" },
    { value: STATUS.DONE,        label: "Completed"   },
  ];

  const priorityOptions = PRIORITY_ORDER.map((p) => ({ value: p, label: p }));

  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title       || "");
      setDescription(editTodo.description || "");
      setLink(editTodo.link         || "");
      setStatus(editTodo.status     || STATUS.PENDING);
      setPriority(editTodo.priority || PRIORITY.MEDIUM);
      setStar(editTodo.star         || false);
      setDueDate(editTodo.dueDate   || "");
      setEstimate(editTodo.estimate || "");
    }
  }, [editTodo]);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".custom-select-wrapper")) {
        setDropdownOpen(false);
        setPriorityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      link: link.trim(),
      status,
      priority,
      dueDate: dueDate || null,
      estimate: estimate.trim(),
      star,
    });
    onClose();
  };

  const quickPreview = quickText.trim() ? parseQuickAdd(quickText) : null;
  const quickCanSubmit = !!quickPreview?.title;

  const quickSubmitHandler = (e) => {
    e.preventDefault();
    if (!quickCanSubmit) return;
    const { title: qTitle, dueDate: qDueDate, link: qLink } = parseQuickAdd(quickText);
    onSubmit({
      title: qTitle,
      description: "",
      link: qLink || "",
      status: STATUS.PENDING,
      priority: PRIORITY.MEDIUM,
      dueDate: qDueDate || null,
      estimate: "",
      star: false,
    });
    onClose();
  };

  const handleSelectClick = () => {
    if (!dropdownOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropdownFlip(spaceBelow < 180);
    }
    setPriorityDropdownOpen(false);
    setDropdownOpen(!dropdownOpen);
  };

  const handlePrioritySelectClick = () => {
    if (!priorityDropdownOpen && priorityRef.current) {
      const rect = priorityRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setPriorityDropdownFlip(spaceBelow < 180);
    }
    setDropdownOpen(false);
    setPriorityDropdownOpen(!priorityDropdownOpen);
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header-row">
          {!editTodo && (
            <button
              type="button"
              className="modal-quick-switch"
              onClick={() => setQuickMode((p) => !p)}
              title={quickMode ? "Switch to detailed form" : "Switch to quick add"}
            >
              <FiZap size={14} fill={quickMode ? "currentColor" : "none"} />
              {quickMode ? "Detailed" : "Quick add"}
            </button>
          )}
          <h2>{editTodo ? "Edit Task" : "Create Task"}</h2>
          <button
            type="button"
            className={`modal-star-toggle ${star ? "modal-star-toggle--active" : ""}`}
            onClick={() => setStar((p) => !p)}
            title={star ? "Unmark important" : "Mark as important"}
          >
            <FiStar size={20} fill={star ? "currentColor" : "none"} />
          </button>
        </div>

        {quickMode ? (
          <form onSubmit={quickSubmitHandler}>
            <div className="modal-link-wrap">
              <span className="modal-link-icon"><FiZap size={15} /></span>
              <input
                type="text"
                className="modal-link-input"
                placeholder='Try "Merge Intervals due tomorrow leetcode.com"'
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                autoFocus
              />
            </div>

            {quickPreview && (quickPreview.title || quickPreview.dueDate || quickPreview.link) && (
              <div className="quickadd-preview">
                {quickPreview.title && (
                  <span className="quickadd-chip quickadd-chip--title">{quickPreview.title}</span>
                )}
                {quickPreview.dueDate && (
                  <span className="quickadd-chip quickadd-chip--date">
                    <FiCalendar size={12} />
                    {new Date(quickPreview.dueDate).toLocaleString(undefined, {
                      month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                    })}
                  </span>
                )}
                {quickPreview.link && (
                  <span className="quickadd-chip quickadd-chip--link">
                    <FiLink size={12} />
                    {quickPreview.link.replace(/^https?:\/\//, "")}
                  </span>
                )}
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={!quickCanSubmit}>
                Create
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

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

            {/* Time estimate — free-form, e.g. "30 min", "2 hrs" */}
            <div className="modal-link-wrap">
              <span className="modal-link-icon"><FiClock size={15} /></span>
              <input
                type="text"
                className="modal-link-input"
                placeholder="Time estimate (optional) — e.g. 30 min, 2 hrs"
                value={estimate}
                onChange={(e) => setEstimate(e.target.value)}
                maxLength={24}
              />
              {estimate && (
                <button
                  type="button"
                  className="modal-link-clear"
                  onClick={() => setEstimate("")}
                  title="Clear estimate"
                >
                  ×
                </button>
              )}
            </div>

            <DateTimePicker
              value={dueDate}
              onChange={(iso) => setDueDate(iso || "")}
            />

            {/* Status dropdown */}
            <div className="custom-select-wrapper">
              <div
                ref={selectRef}
                className={`custom-select ${dropdownOpen ? "open" : ""}`}
                onClick={handleSelectClick}
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
                <div className={`custom-options ${dropdownFlip ? "custom-options--flip" : ""}`}>
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

            {/* Priority dropdown */}
            <div className="custom-select-wrapper">
              <div
                ref={priorityRef}
                className={`custom-select ${priorityDropdownOpen ? "open" : ""}`}
                onClick={handlePrioritySelectClick}
              >
                <span>{priorityOptions.find((o) => o.value === priority)?.label} priority</span>
                <svg
                  className={`select-arrow ${priorityDropdownOpen ? "rotated" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16" height="16"
                  viewBox="0 0 24 24"
                  fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {priorityDropdownOpen && (
                <div className={`custom-options ${priorityDropdownFlip ? "custom-options--flip" : ""}`}>
                  {priorityOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className={`custom-option ${priority === opt.value ? "selected" : ""}`}
                      onClick={() => { setPriority(opt.value); setPriorityDropdownOpen(false); }}
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
        )}
      </div>
    </div>,
    document.body
  );
};

export default TodoModal;