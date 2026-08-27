import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function NoteModal({ note, onClose, onSaved }) {
    const axiosPrivate = useAxiosPrivate();

    const [title, setTitle] = useState(note?.title || "");
    const [content, setContent] = useState(note?.content || "");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const isEditing = Boolean(note);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!title.trim()) {
            setError("Please enter a note title.");
            return;
        }

        if (!content.trim()) {
            setError("Please enter some note content.");
            return;
        }

        try {
            setSaving(true);

            if (isEditing) {
                await axiosPrivate.put(`/notes/${note._id}`, {
                    title: title.trim(),
                    content: content.trim(),
                });
            } else {
                await axiosPrivate.post("/notes", {
                    title: title.trim(),
                    content: content.trim(),
                });
            }

            onSaved();
            onClose();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save note."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="note-modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="note-modal">

                <div className="note-modal-header">
                    <div>
                        <h2>
                            {isEditing
                                ? "Edit Note"
                                : "New Note"}
                        </h2>

                        <p>
                            Capture an observation,
                            idea, or lesson from your trading.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="note-modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="note-form-field">
                        <label>Title</label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            placeholder="e.g. London Session Observation"
                            maxLength={150}
                        />
                    </div>

                    <div className="note-form-field">
                        <label>Note</label>

                        <textarea
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value)
                            }
                            placeholder="Write your observation..."
                            rows={8}
                        />
                    </div>

                    {error && (
                        <p className="note-form-error">
                            {error}
                        </p>
                    )}

                    <div className="note-modal-actions">

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : isEditing
                                    ? "Save Changes"
                                    : "Create Note"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default NoteModal;