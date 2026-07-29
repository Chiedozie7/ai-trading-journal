const analyticsService = require("../services/analyticsService");

const getSummary = async (req, res) => {
    try {
        const summary = await analyticsService.getSummary(req.id, req.query);

        res.status(200).json(summary);
    } catch (error) {
        console.error(error);
        
        res.status(500).json({ message: "Server Error" });
    }
};


const getStrategyPerformance = async (req, res) => {
    try {
        const stats = await analyticsService.getStrategyPerformance(
            req.id,
            req.query
        );

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTimeframePerformance = async (req, res) => {
    try {
        const stats = await analyticsService.getTimeframePerformance(
            req.id,
            req.query
        );
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPairPerformance = async (req, res) => {
    try {
        const stats = await analyticsService.getPairPerformance(
            req.id,
            req.query
        );

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const tradingCalendar = async (req, res) => {
    try {
        const calendar = await analyticsService.getTradingCalendar(req.id, req.query);
        console.log(calendar);
        console.log(Object.values(calendar));

        res.status(200).json(calendar);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch trading calendar.",
        });
    }
};

module.exports = {
    getSummary,
    getStrategyPerformance,
    getTimeframePerformance,
    getPairPerformance,
    tradingCalendar

};