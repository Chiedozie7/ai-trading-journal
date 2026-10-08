const express = require('express');
const router = express.Router();
const upload = require("../../middleware/upload");
const { createTrade, getAllTrades, getTrade, updateTrade, deleteTrade, getTradeStats } = require('../../controllers/tradeController');
const { analyzeTradeIdea, getPantaStatus } = require('../../controllers/pantaController');

router.post("/", upload.array("images"), createTrade);
router.get('/', getAllTrades);
router.get('/analytics', getTradeStats);
router.get('/panta/config', getPantaStatus);
router.post('/panta/analyze', analyzeTradeIdea);
router.get('/:id', getTrade);
router.put("/:id", upload.array("images"), updateTrade);
router.delete('/:id', deleteTrade);
module.exports = router;
