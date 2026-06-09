import "./FloatingButton.css";

const FloatingButton = ({ onClick }) => {
  return (
    <button
      className="floating-btn neu-card"
      onClick={onClick}
    >
      +
    </button>
  );
};

export default FloatingButton;