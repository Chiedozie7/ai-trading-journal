const {
    getDashboardStats,
    getEquityCurveData,
    getMonthlyStats,
    getPnlOverview,
} = require("../services/dashboardService");

const getDashboard = async (req, res) => {
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
                winRate: 0,
            });
        }

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getEquityCurve = async (req, res) => {
    try {
        const equityCurve = await getEquityCurveData(req.id);
        res.json(equityCurve);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getMonthlyPerformance = async (req, res) => {
    try {
        const monthlyPerformance = await getMonthlyStats(req.id);
        res.json(monthlyPerformance);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getPnlOverviewData = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const pnlOverview = await getPnlOverview(
            req.id,
            startDate,
            endDate
        );

        res.json(pnlOverview);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = {
    getDashboard,
    getEquityCurve,
    getMonthlyPerformance,
    getPnlOverviewData
};