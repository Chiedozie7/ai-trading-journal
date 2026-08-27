const mongoose = require("mongoose");
const Goal = require("../model/Goals");
const Trade = require("../model/Trades");

const getGoalDateRange = (goal) => {
    const now = new Date();

    if (goal.period === "allTime") {
        return {};
    }

    if (goal.period === "thisWeek") {
        const start = new Date(now);
        const day = start.getDay();

        const diff = day === 0 ? 6 : day - 1;

        start.setDate(start.getDate() - diff);
        start.setHours(0, 0, 0, 0);

        return {
            tradeDate: {
                $gte: start,
                $lte: now,
            },
        };
    }

    if (goal.period === "thisMonth") {
        const start = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        return {
            tradeDate: {
                $gte: start,
                $lte: now,
            },
        };
    }

    if (goal.period === "thisYear") {
        const start = new Date(
            now.getFullYear(),
            0,
            1
        );

        return {
            tradeDate: {
                $gte: start,
                $lte: now,
            },
        };
    }

    if (goal.period === "custom") {
        return {
            tradeDate: {
                $gte: new Date(goal.startDate),
                $lte: new Date(goal.endDate),
            },
        };
    }

    return {};
};


const calculateGoalProgress = async (goal) => {
    const dateFilter = getGoalDateRange(goal);

    const match = {
        owner: new mongoose.Types.ObjectId(goal.owner),
        ...dateFilter,
    };

    const trades = await Trade.find(match)
        .select("pnl result rr")
        .lean();

    let currentValue = 0;

    if (goal.type === "totalTrades") {
        currentValue = trades.length;
    }

    if (goal.type === "totalPnl") {
        currentValue = trades.reduce(
            (total, trade) => total + Number(trade.pnl || 0),
            0
        );
    }

    if (goal.type === "winRate") {
        if (trades.length === 0) {
            currentValue = 0;
        } else {
            const wins = trades.filter(
                (trade) => trade.result === "win"
            ).length;

            currentValue = (wins / trades.length) * 100;
        }
    }

    if (goal.type === "averageRR") {
        if (trades.length === 0) {
            currentValue = 0;
        } else {
            const totalRR = trades.reduce(
                (total, trade) => total + Number(trade.rr || 0),
                0
            );

            currentValue = totalRR / trades.length;
        }
    }

    const progress =
        goal.target > 0
            ? (currentValue / goal.target) * 100
            : 0;

    return {
        currentValue,
        progress: Math.min(Math.max(progress, 0), 100),
        completed: currentValue >= goal.target,
    };
};


const createGoal = async (userId, goalData) => {
    const {
        title,
        type,
        target,
        period,
        startDate,
        endDate,
    } = goalData;

    if (period === "custom") {
        if (!startDate || !endDate) {
            throw new Error(
                "Custom goals require both start and end dates"
            );
        }

        if (new Date(startDate) >= new Date(endDate)) {
            throw new Error(
                "Start date must be before end date"
            );
        }
    }

    const goal = await Goal.create({
        owner: userId,
        title,
        type,
        target,
        period,
        startDate:
            period === "custom"
                ? startDate
                : null,
        endDate:
            period === "custom"
                ? endDate
                : null,
    });

    return goal;
};


const getGoals = async (userId) => {
    const goals = await Goal.find({
        owner: userId,
    })
        .sort({ createdAt: -1 })
        .lean();

    return Promise.all(
        goals.map(async (goal) => {
            const progress = await calculateGoalProgress(goal);

            return {
                ...goal,
                ...progress,
            };
        })
    );
};


const updateGoal = async (userId, goalId, goalData) => {
    const goal = await Goal.findOne({
        _id: goalId,
        owner: userId,
    });

    if (!goal) {
        throw new Error("Goal not found");
    }

    const period = goalData.period ?? goal.period;

    if (period === "custom") {
        const startDate =
            goalData.startDate ?? goal.startDate;

        const endDate =
            goalData.endDate ?? goal.endDate;

        if (!startDate || !endDate) {
            throw new Error(
                "Custom goals require both start and end dates"
            );
        }

        if (new Date(startDate) >= new Date(endDate)) {
            throw new Error(
                "Start date must be before end date"
            );
        }
    }

    Object.assign(goal, goalData);

    if (period !== "custom") {
        goal.startDate = null;
        goal.endDate = null;
    }

    await goal.save();

    return goal;
};


const deleteGoal = async (userId, goalId) => {
    const goal = await Goal.findOneAndDelete({
        _id: goalId,
        owner: userId,
    });

    if (!goal) {
        throw new Error("Goal not found");
    }

    return goal;
};


module.exports = {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal,
};