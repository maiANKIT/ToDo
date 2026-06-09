import "./DeleteModal.css";

const DeleteModal = ({
  onClose,
  onConfirm,
}) => {
  return (
    <div className="delete-overlay">
      <div className="delete-modal neu-card">
        <h2>Delete Task?</h2>

        <p>
          This action cannot be undone.
        </p>

        <div className="delete-actions">
          <button
            onClick={onClose}
            className="cancel-btn"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="danger-btn"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;