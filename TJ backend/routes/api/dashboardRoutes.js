const express = require('express');
const router = express.Router();
const { getDashboard, getEquityCurve, getMonthlyPerformance } = require('../../controllers/dashboardController');


router.get('/', getDashboard);
router.get("/equity-curve", getEquityCurve);
router.get("/monthly-performance", getMonthlyPerformance);
module.exports = router;