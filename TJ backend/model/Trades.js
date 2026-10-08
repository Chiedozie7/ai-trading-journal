const mongoose = require('mongoose');

const pantaMarketSchema = new mongoose.Schema({
    marketId: String,
    title: String,
    url: String,
    yesProbability: Number,
    endsAt: Date,
    relevanceScore: Number,
    classification: {
        type: String,
        enum: ['support', 'oppose', 'neutral']
    },
    reason: String,
}, { _id: false });

const pantaAnalysisSchema = new mongoose.Schema({
    pantaAlignmentScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    status: {
        type: String,
        enum: ['available', 'no_relevant_markets', 'unavailable'],
    },
    message: String,
    analyzedAt: Date,
    markets: [pantaMarketSchema],
    disclaimer: String,
}, { _id: false });

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
    expectedHoldingPeriod: {
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
    pantaAnalysis: pantaAnalysisSchema,
},{
    timestamps: true
});

module.exports = mongoose.model('Trade', tradeSchema);
