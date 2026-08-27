const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        type: {
            type: String,
            enum: [
                "totalTrades",
                "totalPnl",
                "winRate",
                "averageRR",
            ],
            required: true,
        },

        target: {
            type: Number,
            required: true,
        },

        period: {
            type: String,
            enum: [
                "thisWeek",
                "thisMonth",
                "thisYear",
                "allTime",
                "custom",
            ],
            required: true,
        },

        startDate: {
            type: Date,
            default: null,
        },

        endDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Goal", goalSchema);