import "./FloatingButton.css";

const FloatingButton = ({ onClick }) => {
  return (
    <button
      className="floating-btn"
      onClick={onClick}
    >
      +
    </button>
  );
};

export default FloatingButton;