const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    pair: {
        type: String,
        required: true,
        trim: true
    },
    direction: {
        type: String,
        enum: ['buy', 'sell'],
        required: true
    },
    entryPrice: {
        type: Number,
        required: true
    },
    exitPrice: {
        type: Number,
        required: true
    },
    stopLoss: {
        type: Number,
        required: true
    },
    takeProfit: {
        type: Number,
        required: true
    },
    rr:{
        type:Number
    },
    riskPercent: {  
        type: Number,
        required: true
    },
    lotSize: {
        type: Number,
    },
    result: {
        type: String,
        enum: ['win', 'loss', 'breakeven'],
    },
    pnl: {
        type: Number,
    },
    strategy: {
        type: String,
        trim: true
    },
    timeframe: {
        type: String,
        trim: true
    },
    tradeDate: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        trim: true
    },
    images: [String],
    tags: [{ type: String, trim: true }],
},{
    timestamps: true
});

module.exports = mongoose.model('Trade', tradeSchema);