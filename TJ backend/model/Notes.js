const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        content: {
            type: String,
            required: true,
            trim: true,
        },

        isPinned: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Note", noteSchema);