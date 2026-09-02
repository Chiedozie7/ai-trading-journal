function ConfirmModal({
    title = "Are you sure?",
    message,
    onConfirm,
    onCancel,
}) {
    return (
        <div
            className="confirm-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onCancel();
                }
            }}
        >
            <div className="confirm-modal">
                <h3>{title}</h3>

                <p>{message}</p>

                <div className="confirm-actions">
                    <button
                        type="button"
                        className="confirm-cancel"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="confirm-delete"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;