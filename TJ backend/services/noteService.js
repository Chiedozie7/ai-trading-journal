const mongoose = require("mongoose");
const Note = require("../model/Notes");


const createNote = async (userId, noteData) => {
    const { title, content } = noteData;

    if (!title?.trim()) {
        throw new Error("Note title is required");
    }

    if (!content?.trim()) {
        throw new Error("Note content is required");
    }

    return await Note.create({
        owner: userId,
        title: title.trim(),
        content: content.trim(),
    });
};


const getNotes = async (userId, search = "") => {
    const query = {
        owner: new mongoose.Types.ObjectId(userId),
    };

    if (search.trim()) {
        query.$or = [
            {
                title: {
                    $regex: search.trim(),
                    $options: "i",
                },
            },
            {
                content: {
                    $regex: search.trim(),
                    $options: "i",
                },
            },
        ];
    }

    return await Note.find(query)
        .sort({
            isPinned: -1,
            updatedAt: -1,
        })
        .lean();
};


const getNoteById = async (userId, noteId) => {
    const note = await Note.findOne({
        _id: noteId,
        owner: userId,
    }).lean();

    if (!note) {
        throw new Error("Note not found");
    }

    return note;
};


const updateNote = async (userId, noteId, noteData) => {
    const note = await Note.findOne({
        _id: noteId,
        owner: userId,
    });

    if (!note) {
        throw new Error("Note not found");
    }

    if (
        noteData.title !== undefined &&
        !noteData.title.trim()
    ) {
        throw new Error("Note title is required");
    }

    if (
        noteData.content !== undefined &&
        !noteData.content.trim()
    ) {
        throw new Error("Note content is required");
    }

    if (noteData.title !== undefined) {
        note.title = noteData.title.trim();
    }

    if (noteData.content !== undefined) {
        note.content = noteData.content.trim();
    }

    if (noteData.isPinned !== undefined) {
        note.isPinned = Boolean(noteData.isPinned);
    }

    await note.save();

    return note;
};


const deleteNote = async (userId, noteId) => {
    const note = await Note.findOneAndDelete({
        _id: noteId,
        owner: userId,
    });

    if (!note) {
        throw new Error("Note not found");
    }

    return note;
};


module.exports = {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
};