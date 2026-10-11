const { isPantaEnabled } = require('../config/panta');
const { fetchPantaMarkets } = require('./pantaService');
const { analyzePantaMarkets } = require('./pantaAnalysisService');

const PROBABILITY_CHANGE_THRESHOLD = 0.01;

const createPantaSnapshot = (
    analysis,
    capturedAt = analysis.analyzedAt ? new Date(analysis.analyzedAt) : new Date()
) => ({
    capturedAt,
    alignmentScore: analysis.pantaAlignmentScore,
    status: analysis.status,
    markets: analysis.markets.map((market) => ({
        marketId: market.marketId,
        title: market.title,
        url: market.url,
        yesProbability: market.yesProbability,
        classification: market.classification,
        reason: market.reason,
    })),
});

const haveMarketDetailsChanged = (previousMarkets, nextMarkets) => {
    if (previousMarkets.length !== nextMarkets.length) return true;

    const previousById = new Map(
        previousMarkets.map((market) => [market.marketId, market])
    );

    return nextMarkets.some((market) => {
        const previous = previousById.get(market.marketId);

        if (!previous || previous.classification !== market.classification) {
            return true;
        }

        if (previous.yesProbability === null || market.yesProbability === null) {
            return previous.yesProbability !== market.yesProbability;
        }

        return Math.abs(previous.yesProbability - market.yesProbability) >=
            PROBABILITY_CHANGE_THRESHOLD;
    });
};

const isMateriallyDifferent = (previous, next) => {
    if (!previous) return true;
    if (previous.status !== next.status) return true;
    if (Math.abs(previous.alignmentScore - next.alignmentScore) >= 1) return true;

    return haveMarketDetailsChanged(previous.markets || [], next.markets || []);
};

const appendSnapshotIfChanged = (trade, analysis) => {
    const snapshot = createPantaSnapshot(analysis);
    const previous = trade.pantaTimeline?.[trade.pantaTimeline.length - 1];

    if (!isMateriallyDifferent(previous, snapshot)) return false;

    if (!trade.pantaTimeline) trade.pantaTimeline = [];
    trade.pantaTimeline.push(snapshot);
    return true;
};

const refreshTradePantaSnapshot = async (trade) => {
    if (!isPantaEnabled()) {
        return { trade, snapshotAdded: false, status: 'disabled' };
    }

    if (trade.result) {
        return { trade, snapshotAdded: false, status: 'closed' };
    }

    try {
        const markets = await fetchPantaMarkets();
        const analysis = analyzePantaMarkets(markets, trade.toObject());

        if (!trade.pantaAnalysis) {
            trade.pantaAnalysis = analysis;
        }

        const snapshotAdded = appendSnapshotIfChanged(trade, analysis);

        if (snapshotAdded || trade.isModified('pantaAnalysis')) {
            await trade.save();
        }

        return {
            trade,
            snapshotAdded,
            status: snapshotAdded ? 'updated' : 'unchanged',
        };
    } catch (error) {
        console.warn('Panta snapshot refresh unavailable:', error.message);
        return { trade, snapshotAdded: false, status: 'unavailable' };
    }
};

module.exports = {
    appendSnapshotIfChanged,
    createPantaSnapshot,
    isMateriallyDifferent,
    refreshTradePantaSnapshot,
};
