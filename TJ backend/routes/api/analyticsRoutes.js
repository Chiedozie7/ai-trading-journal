const express = require("express");
const router = express.Router();

const analyticsController = require("../../controllers/analyticsController");




router.get("/summary", analyticsController.getSummary);
router.get("/strategy", analyticsController.getStrategyPerformance);
router.get("/timeframe", analyticsController.getTimeframePerformance);
router.get("/pair", analyticsController.getPairPerformance);
router.get("/calendar", analyticsController.tradingCalendar);

module.exports = router;