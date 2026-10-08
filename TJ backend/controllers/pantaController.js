const { isPantaEnabled } = require('../config/panta');
const { fetchPantaMarkets } = require('../services/pantaService');
const {
    analyzePantaMarkets,
    createFallbackAnalysis,
} = require('../services/pantaAnalysisService');

const getPantaStatus = (req, res) => {
    res.json({ enabled: isPantaEnabled() });
};

const analyzeTradeIdea = async (req, res) => {
    if (!isPantaEnabled()) {
        return res.status(404).json({ message: 'Panta integration is disabled.' });
    }

    const { pair, asset, direction, entryPrice, stopLoss, takeProfit } = req.body;

    if (!(pair || asset) || !['buy', 'sell'].includes(direction)) {
        return res.status(400).json({
            message: 'Asset/pair and a buy or sell direction are required.',
        });
    }

    if ([entryPrice, stopLoss, takeProfit].some((value) =>
        !Number.isFinite(Number(value))
    )) {
        return res.status(400).json({
            message: 'Entry price, stop loss, and take profit must be valid numbers.',
        });
    }

    try {
        const markets = await fetchPantaMarkets();
        return res.json(analyzePantaMarkets(markets, req.body));
    } catch (error) {
        console.warn('Panta market fetch unavailable:', error.message);
        return res.json(createFallbackAnalysis(
            'unavailable',
            'Panta market data is temporarily unavailable. The trade can still be saved normally.'
        ));
    }
};

module.exports = {
    analyzeTradeIdea,
    getPantaStatus,
};
