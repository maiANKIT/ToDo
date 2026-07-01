import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiZap, FiLink, FiCalendar } from "react-icons/fi";
import { parseQuickAdd } from "../../utils/quickAddParser";
import "./QuickAddOverlay.css";

const QuickAddOverlay = ({ onClose, onSubmit }) => {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const preview = text.trim() ? parseQuickAdd(text) : null;
  const canSubmit = !!preview?.title;

  const submitHandler = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const { title, dueDate, link } = parseQuickAdd(text);
    onSubmit({
      title,
      description: "",
      link: link || "",
      status: "pending",
      dueDate: dueDate || null,
      star: false,
    });
    onClose();
  };

  return createPortal(
    <div className="quickadd-overlay" onClick={onClose}>
      <div className="quickadd-box" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={submitHandler}>
          <div className="quickadd-input-wrap">
            <span className="quickadd-icon">
              <FiZap size={18} />
            </span>
            <input
              ref={inputRef}
              type="text"
              className="quickadd-input"
              placeholder='Try "Merge Intervals due tomorrow leetcode.com"'
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {preview && (preview.dueDate || preview.link || preview.title) && (
            <div className="quickadd-preview">
              {preview.title && (
                <span className="quickadd-chip quickadd-chip--title">
                  {preview.title}
                </span>
              )}
              {preview.dueDate && (
                <span className="quickadd-chip quickadd-chip--date">
                  <FiCalendar size={12} />
                  {new Date(preview.dueDate).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              )}
              {preview.link && (
                <span className="quickadd-chip quickadd-chip--link">
                  <FiLink size={12} />
                  {preview.link.replace(/^https?:\/\//, "")}
                </span>
              )}
            </div>
          )}

          <div className="quickadd-footer">
            <span className="quickadd-hint">
              <kbd>Enter</kbd> to create &nbsp;·&nbsp; <kbd>Esc</kbd> to cancel
            </span>
            <button type="submit" className="quickadd-submit" disabled={!canSubmit}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default QuickAddOverlay;