const mongoose = require('mongoose');
const Trade = require('../model/Trades');

const getDashboardStats = async (userId) => {
    return await Trade.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $group: {
                _id: null,
                totalTrades: { $sum: 1 },
                wins: {
                    $sum: {
                        $cond: [{ $eq: ["$result", "win"] }, 1, 0]
                    }
                },
                losses: {
                    $sum: {
                        $cond: [{ $eq: ["$result", "loss"] }, 1, 0]
                    }
                },
                breakeven: {
                    $sum: {
                        $cond: [{ $eq: ["$result", "breakeven"] }, 1, 0]
                    }
                },
                totalPnl: {
                    $sum: "$pnl"
                },
                averagePnl: {
                    $avg: "$pnl"
                },
                averageRR: {
                    $avg: {
                        $cond: [
                            { $ne: [{ $type: "$rr" }, "missing"] },
                            "$rr",
                            null
                        ]
                    }
                },
            },
        },
        {
            $project: {
                _id: 0,
                totalTrades: 1,
                wins: 1,
                losses: 1,
                breakeven: 1,
                totalPnl: 1,
                averagePnl: 1,
                averageRR: 1,
                winRate: {
                    $cond: [
                        { $eq: ["$totalTrades", 0] },
                        0,
                        {
                            $multiply: [
                                { $divide: ["$wins", "$totalTrades"] },
                                100]
                        }]
                }
            }
        }

    ]);
    if (stats.length === 0) {
        res.json({
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
}

const getEquityCurveData = async (userId) => {
    const trades = await Trade.find({
        owner: new mongoose.Types.ObjectId(userId),
    })
        .sort({ tradeDate: 1 })
        .select("tradeDate pnl");

    let runningTotal = 0;

    const equityCurve = trades.map((trade) => {
        const pnl = Number.isFinite(Number(trade.pnl))
            ? Number(trade.pnl)
            : 0;

        runningTotal += pnl;

        return {
            tradeDate: trade.tradeDate,
            equity: runningTotal,
        };
    });

    return equityCurve;
};

const getMonthlyStats = async (userId) => {
    return await Trade.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$tradeDate" },
                    month: { $month: "$tradeDate" },
                },
                totalTrades: { $sum: 1 },
                wins: {
                    $sum: {
                        $cond: [{ $eq: ["$result", "win"] }, 1, 0],
                    },
                },
                losses: {
                    $sum: {
                        $cond: [{ $eq: ["$result", "loss"] }, 1, 0],
                    },
                },
                breakeven: {
                    $sum: {
                        $cond: [{ $eq: ["$result", "breakeven"] }, 1, 0],
                    },
                },
                totalPnl: {
                    $sum: "$pnl",
                },
            },
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
            },
        },
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                totalTrades: 1,
                wins: 1,
                losses: 1,
                breakeven: 1,
                totalPnl: 1,
            },
        },
    ]);
};


module.exports = {
    getDashboardStats,
    getEquityCurveData,
    getMonthlyStats
};