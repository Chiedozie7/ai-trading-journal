const express = require("express");
const router = express.Router();

const {
    getDashboard,
    getEquityCurve,
    getMonthlyPerformance,
    getPnlOverviewData,
} = require("../../controllers/dashboardController");


router.get("/", getDashboard);
router.get("/equity-curve", getEquityCurve);
router.get("/monthly-performance", getMonthlyPerformance);
router.get("/pnl-overview", getPnlOverviewData);


module.exports = router;