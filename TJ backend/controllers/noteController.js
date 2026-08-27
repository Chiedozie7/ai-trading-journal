const {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
} = require("../services/noteService");


const createNoteController = async (req, res) => {
    try {
        const note = await createNote(
            req.id,
            req.body
        );

        res.status(201).json(note);
    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message,
        });
    }
};


const getNotesController = async (req, res) => {
    try {
        const notes = await getNotes(
            req.id,
            req.query.search || ""
        );

        res.status(200).json(notes);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
};


const getNoteController = async (req, res) => {
    try {
        const note = await getNoteById(
            req.id,
            req.params.id
        );

        res.status(200).json(note);
    } catch (error) {
        console.error(error);

        const status =
            error.message === "Note not found"
                ? 404
                : 500;

        res.status(status).json({
            message: error.message,
        });
    }
};


const updateNoteController = async (req, res) => {
    try {
        const note = await updateNote(
            req.id,
            req.params.id,
            req.body
        );

        res.status(200).json(note);
    } catch (error) {
        console.error(error);

        const status =
            error.message === "Note not found"
                ? 404
                : 400;

        res.status(status).json({
            message: error.message,
        });
    }
};


const deleteNoteController = async (req, res) => {
    try {
        await deleteNote(
            req.id,
            req.params.id
        );

        res.status(200).json({
            message: "Note deleted successfully",
        });
    } catch (error) {
        console.error(error);

        const status =
            error.message === "Note not found"
                ? 404
                : 400;

        res.status(status).json({
            message: error.message,
        });
    }
};


module.exports = {
    createNoteController,
    getNotesController,
    getNoteController,
    updateNoteController,
    deleteNoteController,
};