const Trade = require('../model/Trades');
const mongoose = require('mongoose');
const { getDashboardStats } = require('../services/dashboardService');

const createTrade = async (req, res) => {
    try {
        const {
            pair,
            direction,
            entryPrice,
            exitPrice,
            stopLoss,
            takeProfit,
            riskPercent,
            lotSize,
            result,
            pnl,
            strategy,
            timeframe,
            tradeDate,
            notes,
            tags
        } = req.body;

        let risk;
        let actualMove;


        if (direction === "buy") {
            risk = entryPrice - stopLoss;
            actualMove = exitPrice - entryPrice;
        } else {
            risk = stopLoss - entryPrice;
            actualMove = entryPrice - exitPrice;
        }

        if (risk <= 0) {
            return res.status(400).json({
                message: "Invalid trade. Stop loss must create a positive risk."
            });
        }

        const rr = Number((actualMove / risk).toFixed(2));


        const images = req.files
            ? req.files.map(file => file.filename)
            : [];

        const trade = await Trade.create({
            owner: req.id,
            pair,
            direction,
            entryPrice,
            exitPrice,
            stopLoss,
            takeProfit,
            rr,
            riskPercent,
            lotSize,
            result,
            pnl,
            strategy,
            timeframe,
            tradeDate,
            notes,
            images,
            tags
        });
        console.log("trade created")
        res.status(201).json(trade);
        console.log("response sent")

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getAllTrades = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const query = {
            owner: req.id,
        };
        const { pair, strategy, timeframe, result, sort, search, startDate, endDate, tradeDate } = req.query;
        const sortQuery = {};
        if (sort === 'newest') {
            sortQuery.tradeDate = -1;
            sortQuery.createdAt = -1;
        }
        if (sort === 'oldest') {
            sortQuery.tradeDate = 1;
            sortQuery.createdAt = 1;
        }
        if (sort === 'profit') {
            sortQuery.pnl = -1;
        }
        if (sort === 'loss') {
            sortQuery.pnl = 1;
        }
        if (pair) query.pair = pair;
        if (strategy) query.strategy = strategy;
        if (timeframe) query.timeframe = timeframe;
        if (result) query.result = result;

        if (search) {
            query.$or = [
                {
                    pair: {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    strategy: {
                        $regex: search,
                        $options: 'i'
                    },
                },
                {
                    notes: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    tags: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ];
        }
        if (tradeDate) {
            const start = new Date(tradeDate);
            start.setHours(0, 0, 0, 0);

            const end = new Date(tradeDate);
            end.setHours(23, 59, 59, 999);

            query.tradeDate = {
                $gte: start,
                $lte: end,
            };
        } else if (startDate || endDate) {
            query.tradeDate = {};

            if (startDate) {
                query.tradeDate.$gte = new Date(startDate);
            }

            if (endDate) {
                query.tradeDate.$lte = new Date(endDate);
            }
        }

        const trades = await Trade.find(query).sort(sortQuery).skip(skip).limit(limit);
        const totalTrades = await Trade.countDocuments(query);
        res.status(200).json({
            trades,
            currentPage: page,
            totalPages: Math.ceil(totalTrades / limit),
            totalTrades,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTrade = async (req, res) => {
    try {
        const trade = await Trade.findOne({ _id: req.params.id, owner: req.id });
        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }
        res.status(200).json(trade);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTrade = async (req, res) => {
    try {
        const trade = await Trade.findOne({
            _id: req.params.id,
            owner: req.id,
        });

        if (!trade) {
            return res.status(404).json({ message: "Trade not found" });
        }

        const uploadedImages = req.files
            ? req.files.map(file => file.filename)
            : [];

        let existingImages = [];

        if (req.body.existingImages) {
            existingImages = Array.isArray(req.body.existingImages)
                ? req.body.existingImages
                : [req.body.existingImages];
        }

        const {
            direction,
            entryPrice,
            exitPrice,
            stopLoss,
        } = req.body;

        let rr;

        if (
            direction &&
            entryPrice !== undefined &&
            exitPrice !== undefined &&
            stopLoss !== undefined
        ) {
            let risk;
            let actualMove;

            if (direction === "buy") {
                risk = Number(entryPrice) - Number(stopLoss);
                actualMove = Number(exitPrice) - Number(entryPrice);
            } else {
                risk = Number(stopLoss) - Number(entryPrice);
                actualMove = Number(entryPrice) - Number(exitPrice);
            }

            if (risk <= 0) {
                return res.status(400).json({
                    message: "Invalid trade. Stop loss must create a positive risk."
                });
            }

            rr = Number((actualMove / risk).toFixed(2));
        }

        const updatedTrade = await Trade.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                ...(rr !== undefined && { rr }),
                images: [...existingImages, ...uploadedImages],
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        res.json(updatedTrade);
        console.log("req.files:", req.files);
        console.log("req.body:", req.body);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const deleteTrade = async (req, res) => {
    try {
        const trade = await Trade.findOneAndDelete({ _id: req.params.id, owner: req.id });
        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }
        res.status(200).json({ message: 'Trade deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTradeStats = async (req, res) => {
    try {
        const stats = await getDashboardStats(req.id);

        if (stats.length === 0) {
            return res.status(200).json({
                totalTrades: 0,
                wins: 0,
                losses: 0,
                breakeven: 0,
                totalPnl: 0,
                averagePnl: 0,
                winRate: 0
            });
        }
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};






module.exports = {
    createTrade,
    getAllTrades,
    getTrade,
    updateTrade,
    deleteTrade,
    getTradeStats,

};