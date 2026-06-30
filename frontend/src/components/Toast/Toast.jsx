import { useEffect } from "react";
import { Undo2 } from "lucide-react";
import "./Toast.css";

const Toast = ({ message, onUndo, onDismiss, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <div className="toast">
      <span className="toast-message">{message}</span>
      {onUndo && (
        <button className="toast-undo-btn" onClick={onUndo}>
          <Undo2 size={14} /> Undo
        </button>
      )}
      <div className="toast-progress" style={{ animationDuration: `${duration}ms` }} />
    </div>
  );
};

export default Toast;