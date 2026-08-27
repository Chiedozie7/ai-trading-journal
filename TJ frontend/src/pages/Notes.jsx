import { useEffect, useState } from "react";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiBookmark } from "react-icons/fi";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../styles/notes.css";
import NoteModal from "../components/NoteModal";

function Notes() {
    const axiosPrivate = useAxiosPrivate();

    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);

    const fetchNotes = async () => {
        try {
            setLoading(true);

            const response = await axiosPrivate.get("/notes", {
                params: search.trim()
                    ? { search: search.trim() }
                    : {},
            });

            setNotes(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [search]);

    const handleNewNote = () => {
        setEditingNote(null);
        setIsModalOpen(true);
    };

    const handleEdit = (note) => {
        setEditingNote(note);
        setIsModalOpen(true);
    };

    const handleDelete = async (noteId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this note?"
        );

        if (!confirmed) return;

        try {
            await axiosPrivate.delete(`/notes/${noteId}`);
            fetchNotes();
        } catch (error) {
            console.error(error);
        }
    };

    const handleTogglePin = async (note) => {
        try {
            await axiosPrivate.put(`/notes/${note._id}`, {
                isPinned: !note.isPinned,
            });

            fetchNotes();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="notes-page">

            <div className="notes-actions">

                <div className="notes-search">
                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {notes.length > 0 && (
                    <button
                        className="primary-btn notes-new-btn"
                        onClick={handleNewNote}
                    >
                        <FiPlus />
                        New Note
                    </button>
                )}

            </div>

            {loading ? (
                <div className="notes-empty-state">
                    <p>Loading notes...</p>
                </div>
            ) : notes.length === 0 ? (
                <div className="notes-empty-state">
                    <h3>
                        {search
                            ? "No notes found"
                            : "No notes yet"}
                    </h3>

                    <p>
                        {search
                            ? "Try a different search."
                            : "Create your first note to keep track of ideas, observations, and lessons."}
                    </p>

                    {!search && (
                        <button
                            className="primary-btn"
                            onClick={handleNewNote}
                        >
                            <FiPlus />
                            Create Note
                        </button>
                    )}
                </div>
            ) : (
                <div className="notes-grid">

                    {notes.map((note) => (
                        <div
                            className={`note-card ${note.isPinned
                                ? "note-pinned"
                                : ""
                                }`}
                            key={note._id}
                        >

                            <div className="note-card-header">

                                <div className="note-title-wrap">

                                    {note.isPinned && (
                                        <FiBookmark className="note-pin-icon" />
                                    )}

                                    <h3>
                                        {note.title}
                                    </h3>

                                </div>

                                <div className="note-menu">

                                    <button
                                        className="note-menu-btn"
                                        onClick={() => {
                                            handleEdit(note);
                                        }}
                                    >
                                        <FiEdit2 />
                                    </button>

                                    <button
                                        className="note-menu-btn"
                                        onClick={() =>
                                            handleTogglePin(note)
                                        }
                                    >
                                        <FiBookmark />
                                    </button>

                                    <button
                                        className="note-menu-btn note-delete-btn"
                                        onClick={() =>
                                            handleDelete(note._id)
                                        }
                                    >
                                        <FiTrash2 />
                                    </button>

                                </div>

                            </div>

                            <p className="note-content">
                                {note.content}
                            </p>

                            <div className="note-card-footer">
                                <span>
                                    {new Date(
                                        note.updatedAt
                                    ).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        }
                                    )}
                                </span>

                                {note.updatedAt !==
                                    note.createdAt && (
                                        <span>
                                            Edited
                                        </span>
                                    )}
                            </div>

                        </div>
                    ))}

                </div>
            )}
            {isModalOpen && (
                <NoteModal
                    note={editingNote}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingNote(null);
                    }}
                    onSaved={fetchNotes}
                />
            )}

        </div>
    );
}

export default Notes;