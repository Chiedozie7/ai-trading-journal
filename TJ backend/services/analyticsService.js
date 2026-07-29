const Trade = require("../model/Trades");
const mongoose = require("mongoose");
const {
    startOfDay,
    endOfDay,
    subDays,
    startOfMonth,
    endOfMonth,
    startOfYear,
    subMonths,
} = require("date-fns");



const buildFilter = (userId, query) => {
    const filter = {
        owner: new mongoose.Types.ObjectId(userId),
    };

    if (query.strategy) {
        filter.strategy = new RegExp(`^${query.strategy}$`, "i");
    }

    if (query.pair) {
        filter.pair = new RegExp(`^${query.pair}$`, "i");
    }

    if (query.timeframe) {
        filter.timeframe = new RegExp(`^${query.timeframe}$`, "i");
    }

    if (query.direction) {
        filter.direction = new RegExp(`^${query.direction}$`, "i");
    }

    if (query.range) {
        const now = new Date();

        switch (query.range) {
            case "all":
                break;

            case "today":
                filter.tradeDate = {
                    $gte: startOfDay(now),
                    $lte: endOfDay(now),
                };
                break;

            case "yesterday": {
                const yesterday = subDays(now, 1);

                filter.tradeDate = {
                    $gte: startOfDay(yesterday),
                    $lte: endOfDay(yesterday),
                };

                break;
            }

            case "last7":
                filter.tradeDate = {
                    $gte: startOfDay(subDays(now, 6)),
                    $lte: endOfDay(now),
                };
                break;

            case "last30":
                filter.tradeDate = {
                    $gte: startOfDay(subDays(now, 29)),
                    $lte: endOfDay(now),
                };
                break;

            case "thisMonth":
                filter.tradeDate = {
                    $gte: startOfMonth(now),
                    $lte: endOfMonth(now),
                };
                break;

            case "lastMonth": {
                const lastMonth = subMonths(now, 1);

                filter.tradeDate = {
                    $gte: startOfMonth(lastMonth),
                    $lte: endOfMonth(lastMonth),
                };
                break;
            }

            case "thisYear":
                filter.tradeDate = {
                    $gte: startOfYear(now),
                    $lte: endOfDay(now),
                };
                break;

            case "custom":
                if (query.startDate && query.endDate) {
                    filter.tradeDate = {
                        $gte: startOfDay(new Date(query.startDate)),
                        $lte: endOfDay(new Date(query.endDate)),
                    };
                }
                break;
        }
    }
    return filter;
};

const getSummary = async (userId, query) => {
    const filter = buildFilter(userId, query);
    const trades = await Trade.find(filter).sort({ tradeDate: 1 });


    const totalTrades = trades.length;

    const wins = trades.filter(trade => trade.result === "win").length;
    const losses = trades.filter(trade => trade.result === "loss").length;
    const breakeven = trades.filter(trade => trade.result === "breakeven").length;

    const winRate =
        totalTrades === 0
            ? 0
            : Number(((wins / totalTrades) * 100).toFixed(2));



    const winningTrades = trades.filter(
        trade => trade.result === "win" && typeof trade.pnl === "number"
    );

    const losingTrades = trades.filter(
        trade => trade.result === "loss" && typeof trade.pnl === "number"
    );

    const averageWinningTrade =
        winningTrades.length === 0
            ? 0
            : Number(
                (
                    winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) /
                    winningTrades.length
                ).toFixed(2)
            );

    const averageLosingTrade =
        losingTrades.length === 0
            ? 0
            : Number(
                (
                    losingTrades.reduce((sum, trade) => sum + Math.abs(trade.pnl), 0) /
                    losingTrades.length
                ).toFixed(2)
            );

    const largestWin =
        winningTrades.length === 0
            ? 0
            : Math.max(...winningTrades.map(trade => trade.pnl));

    const largestLoss =
        losingTrades.length === 0
            ? 0
            : Math.abs(
                Math.min(...losingTrades.map(trade => trade.pnl))
            );

    const grossProfit = winningTrades.reduce(
        (sum, trade) => sum + trade.pnl,
        0
    );

    const grossLoss = losingTrades.reduce(
        (sum, trade) => sum + Math.abs(trade.pnl),
        0
    );

    const profitFactor =
        grossLoss === 0
            ? grossProfit > 0
                ? Number.POSITIVE_INFINITY
                : 0
            : Number((grossProfit / grossLoss).toFixed(2));

    const completedTrades = trades.filter(
        trade => typeof trade.rr === "number"
    );

    const averageRR =
        completedTrades.length === 0
            ? 0
            : Number(
                (
                    completedTrades.reduce(
                        (sum, trade) => sum + trade.rr,
                        0
                    ) / completedTrades.length
                ).toFixed(2)
            );

    const lossRate =
        totalTrades === 0
            ? 0
            : losses / totalTrades;

    const expectancy = Number(
        (
            (winRate / 100) * averageWinningTrade -
            lossRate * averageLosingTrade
        ).toFixed(2)
    );

    let currentStreakType = null;
    let currentStreakCount = 0;

    let longestWinStreak = 0;
    let longestLossStreak = 0;

    let runningWinStreak = 0;
    let runningLossStreak = 0;

    trades.forEach((trade) => {
        if (trade.result === "win") {
            runningWinStreak++;
            runningLossStreak = 0;

            if (runningWinStreak > longestWinStreak) {
                longestWinStreak = runningWinStreak;
            }
        } else if (trade.result === "loss") {
            runningLossStreak++;
            runningWinStreak = 0;

            if (runningLossStreak > longestLossStreak) {
                longestLossStreak = runningLossStreak;
            }
        } else {
            runningWinStreak = 0;
            runningLossStreak = 0;
        }
    });

    for (let i = trades.length - 1; i >= 0; i--) {
        const result = trades[i].result;

        if (result === "breakeven") break;

        if (!currentStreakType) {
            currentStreakType = result;
        }

        if (result === currentStreakType) {
            currentStreakCount++;
        } else {
            break;
        }
    }


    return {
        totalTrades,
        wins,
        losses,
        breakeven,
        winRate,
        averageWinningTrade,
        averageLosingTrade,
        largestWin,
        largestLoss,
        profitFactor,
        averageRR,
        expectancy,
        currentStreak: {
            type: currentStreakType,
            count: currentStreakCount,
        },
        longestWinStreak,
        longestLossStreak,
    };
};

const getStrategyPerformance = async (userId, query) => {
    const filter = buildFilter(userId, query);
    const stats = await Trade.aggregate([
        {
            $match: filter
        },
        {
            $group: {
                _id: "$strategy",
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
            }
        }
    ]);

    const formattedStats = stats.map((strategy) => ({
        strategy: strategy._id,
        totalTrades: strategy.totalTrades,
        wins: strategy.wins,
        losses: strategy.losses,
        breakeven: strategy.breakeven,
        totalPnl: strategy.totalPnl,
        winRate:
            strategy.totalTrades > 0
                ? Number(
                    ((strategy.wins / strategy.totalTrades) * 100).toFixed(2)
                )
                : 0,
    }));

    return formattedStats;
}

const getTimeframePerformance = async (userId, query) => {
    const filter = buildFilter(userId, query);
    const stats = await Trade.aggregate([
        {
            $match: filter,
        },
        {
            $group: {
                _id: "$timeframe",
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
            }
        }
    ]);

    const formattedStats = stats.map((timeframe) => ({
        timeframe: timeframe._id,
        totalTrades: timeframe.totalTrades,
        wins: timeframe.wins,
        losses: timeframe.losses,
        breakeven: timeframe.breakeven,
        totalPnl: timeframe.totalPnl,
        winRate:
            timeframe.totalTrades > 0
                ? Number(
                    ((timeframe.wins / timeframe.totalTrades) * 100).toFixed(2)
                )
                : 0,
    }));

    return formattedStats;
};

const getPairPerformance = async (userId, query) => {
    const filter = buildFilter(userId, query);
    const stats = await Trade.aggregate([
        {
            $match: filter,
        },
        {
            $group: {
                _id: "$pair",
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
            }
        }
    ]);

    const formattedStats = stats.map((pair) => ({
        pair: pair._id,
        totalTrades: pair.totalTrades,
        wins: pair.wins,
        losses: pair.losses,
        breakeven: pair.breakeven,
        totalPnl: pair.totalPnl,
        winRate:
            pair.totalTrades > 0
                ? Number(
                    ((pair.wins / pair.totalTrades) * 100).toFixed(2)
                )
                : 0,
    }));

    return formattedStats;
};

const getTradingCalendar = async (userId, query) => {
    const filter = buildFilter(userId, query);

    const trades = await Trade.find(filter);

    const calendar = {};

    trades.forEach((trade) => {
        const date = trade.tradeDate.toISOString().split("T")[0];

        if (!calendar[date]) {
            calendar[date] = {
                date,
                trades: 0,
                netPL: 0,
            };
        }

        calendar[date].trades++;
        calendar[date].netPL += trade.pnl ?? 0;
    });

    return Object.values(calendar);
};


module.exports = {
    getSummary,
    getStrategyPerformance,
    getTimeframePerformance,
    getPairPerformance,
    getTradingCalendar
};