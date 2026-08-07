import "./FloatingButton.css";

const FloatingButton = ({ onClick, disabled = false, title }) => {
  return (
    <button
      className="floating-btn"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={disabled ? (title || "You don't have permission to create tasks here") : undefined}
      style={disabled ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
    >
      +
    </button>
  );
};

export default FloatingButton;