function Toast({ message, type = "success", onClose }) {
    return (
        <div className={`toast toast-${type}`}>
            <span>{message}</span>

            <button
                type="button"
                onClick={onClose}
                aria-label="Close notification"
            >
                ×
            </button>
        </div>
    );
}

export default Toast;