const POSITIVE_OUTCOME_TERMS = [
    'above',
    'break above',
    'exceed',
    'gain',
    'higher',
    'hit',
    'increase',
    'rally',
    'reach',
    'rise',
    'up',
];

const NEGATIVE_OUTCOME_TERMS = [
    'below',
    'break below',
    'crash',
    'decline',
    'decrease',
    'drop',
    'fall',
    'lower',
    'sell off',
    'sell-off',
];

const ASSET_ALIASES = {
    BTC: ['bitcoin', 'btc'],
    ETH: ['ethereum', 'ether', 'eth'],
    SOL: ['solana', 'sol'],
    BNB: ['binance coin', 'bnb'],
    XRP: ['ripple', 'xrp'],
    DOGE: ['dogecoin', 'doge'],
    ADA: ['cardano', 'ada'],
    AVAX: ['avalanche', 'avax'],
    LINK: ['chainlink', 'link'],
    EUR: ['euro', 'eur'],
    GBP: ['british pound', 'sterling', 'gbp'],
    USD: ['us dollar', 'dollar', 'usd'],
    XAU: ['gold', 'xau'],
    XAG: ['silver', 'xag'],
};

const QUOTE_ASSETS = [
    'USDT',
    'USDC',
    'BUSD',
    'USD',
    'EUR',
    'GBP',
    'BTC',
    'ETH',
];

const clamp = (value, minimum, maximum) =>
    Math.min(Math.max(value, minimum), maximum);

const normalizeProbability = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number) || number < 0) return null;
    if (number <= 1) return number;
    if (number <= 100) return number / 100;

    return null;
};

const getOutcomeValue = (market, outcomeName) => {
    const outcomes = market.outcomes || market.options;

    if (Array.isArray(outcomes)) {
        const outcome = outcomes.find((item) =>
            String(item?.name || item?.label || item?.outcome)
                .toLowerCase() === outcomeName
        );

        if (outcome) {
            return outcome.probability ?? outcome.price ?? outcome.percentage;
        }
    }

    if (
        Array.isArray(market.outcomes) &&
        Array.isArray(market.outcomePrices)
    ) {
        const index = market.outcomes.findIndex((outcome) =>
            String(outcome).toLowerCase() === outcomeName
        );

        if (index >= 0) return market.outcomePrices[index];
    }

    return null;
};

const normalizeMarket = (market, index) => {
    const title = market.question || market.title || market.name || '';
    const yesProbability = normalizeProbability(
        market.yesProbability ??
        market.yes_probability ??
        market.yesPrice ??
        market.yes_price ??
        market.yesPercentage ??
        market.probability ??
        market.prices?.yes ??
        getOutcomeValue(market, 'yes')
    );

    return {
        marketId: String(
            market.id ||
            market._id ||
            market.address ||
            market.marketAddress ||
            market.slug ||
            `panta-market-${index}`
        ),
        title: String(title),
        description: String(market.description || market.summary || ''),
        category: String(market.category || market.topic || ''),
        status: String(market.status || market.state || '').toLowerCase(),
        yesProbability,
        url: market.url || market.marketUrl || market.market_url || null,
        endsAt:
            market.endsAt ||
            market.endDate ||
            market.end_date ||
            market.resolutionDate ||
            market.resolution_date ||
            null,
    };
};

const getBaseAsset = (pair) => {
    const normalizedPair = String(pair || '')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');

    const quoteAsset = QUOTE_ASSETS.find((quote) =>
        normalizedPair.endsWith(quote) && normalizedPair.length > quote.length
    );

    return quoteAsset
        ? normalizedPair.slice(0, -quoteAsset.length)
        : normalizedPair;
};

const getAssetTerms = (pair) => {
    const baseAsset = getBaseAsset(pair);
    return [...new Set([
        baseAsset.toLowerCase(),
        ...(ASSET_ALIASES[baseAsset] || []),
    ].filter(Boolean))];
};

const includesTerm = (text, term) => {
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9])${escapedTerm}([^a-z0-9]|$)`, 'i')
        .test(text);
};

const parseHoldingPeriodDays = (holdingPeriod) => {
    const match = String(holdingPeriod || '')
        .toLowerCase()
        .match(/(\d+(?:\.\d+)?)\s*(hour|day|week|month)s?/);

    if (!match) return null;

    const value = Number(match[1]);
    const multipliers = {
        hour: 1 / 24,
        day: 1,
        week: 7,
        month: 30,
    };

    return value * multipliers[match[2]];
};

const scoreMarketRelevance = (market, tradeIdea) => {
    if (['cancelled', 'closed', 'resolved', 'settled'].includes(market.status)) {
        return 0;
    }

    const searchableText = [market.title, market.description, market.category]
        .join(' ')
        .toLowerCase();
    const assetTerms = getAssetTerms(tradeIdea.pair || tradeIdea.asset);
    const matchedAsset = assetTerms.find((term) => includesTerm(searchableText, term));

    if (!matchedAsset) return 0;

    let score = matchedAsset === assetTerms[0] ? 65 : 60;

    if (
        POSITIVE_OUTCOME_TERMS.some((term) => includesTerm(searchableText, term)) ||
        NEGATIVE_OUTCOME_TERMS.some((term) => includesTerm(searchableText, term))
    ) {
        score += 15;
    }

    const tradeLevels = [tradeIdea.entryPrice, tradeIdea.stopLoss, tradeIdea.takeProfit]
        .map(Number)
        .filter((value) => Number.isFinite(value) && value > 0);
    const marketNumbers = searchableText.match(/\d+(?:[,.]\d+)*(?:k|m)?/g) || [];

    if (tradeLevels.length && marketNumbers.length) score += 10;

    const holdingPeriodDays = parseHoldingPeriodDays(tradeIdea.expectedHoldingPeriod);
    const endTimestamp = market.endsAt ? new Date(market.endsAt).getTime() : NaN;

    if (holdingPeriodDays && Number.isFinite(endTimestamp)) {
        const daysUntilEnd = (endTimestamp - Date.now()) / 86400000;
        const differenceRatio = Math.abs(daysUntilEnd - holdingPeriodDays) / holdingPeriodDays;

        if (daysUntilEnd >= 0 && differenceRatio <= 1) score += 10;
    }

    return clamp(score, 0, 100);
};

const getOutcomeOrientation = (market) => {
    const text = `${market.title} ${market.description}`.toLowerCase();
    const hasPositiveTerm = POSITIVE_OUTCOME_TERMS.some((term) =>
        includesTerm(text, term)
    );
    const hasNegativeTerm = NEGATIVE_OUTCOME_TERMS.some((term) =>
        includesTerm(text, term)
    );

    if (hasPositiveTerm === hasNegativeTerm) return 'ambiguous';
    return hasPositiveTerm ? 'bullish' : 'bearish';
};

const classifyMarket = (market, tradeIdea) => {
    const orientation = getOutcomeOrientation(market);
    const direction = String(tradeIdea.direction).toLowerCase();
    const probability = market.yesProbability;

    if (orientation === 'ambiguous' || probability === null) {
        return {
            classification: 'neutral',
            alignedValue: 0.5,
            reason: `The market outcome is not directional enough to compare reliably with this ${direction} idea.`,
        };
    }

    const tradeIsBullish = direction === 'buy';
    const outcomeSupportsTrade =
        (tradeIsBullish && orientation === 'bullish') ||
        (!tradeIsBullish && orientation === 'bearish');
    const alignedValue = outcomeSupportsTrade ? probability : 1 - probability;
    const yesPercentage = Math.round(probability * 100);

    if (alignedValue >= 0.6) {
        return {
            classification: 'support',
            alignedValue,
            reason: `Panta assigns ${yesPercentage}% to this ${orientation} outcome, which aligns with the ${direction} idea.`,
        };
    }

    if (alignedValue <= 0.4) {
        return {
            classification: 'oppose',
            alignedValue,
            reason: `Panta assigns ${yesPercentage}% to this ${orientation} outcome, which conflicts with the ${direction} idea.`,
        };
    }

    return {
        classification: 'neutral',
        alignedValue,
        reason: `Panta assigns ${yesPercentage}% to this ${orientation} outcome, so the signal is mixed for the ${direction} idea.`,
    };
};

const createFallbackAnalysis = (status, message) => ({
    pantaAlignmentScore: 50,
    status,
    message,
    analyzedAt: new Date().toISOString(),
    markets: [],
    disclaimer: 'Panta Alignment is contextual market alignment, not the probability that this trade will win.',
});

const analyzePantaMarkets = (rawMarkets, tradeIdea) => {
    const relevantMarkets = rawMarkets
        .map(normalizeMarket)
        .map((market) => ({
            ...market,
            relevanceScore: scoreMarketRelevance(market, tradeIdea),
        }))
        .filter((market) => market.title && market.relevanceScore >= 60)
        .map((market) => ({
            ...market,
            ...classifyMarket(market, tradeIdea),
        }))
        .sort((first, second) => second.relevanceScore - first.relevanceScore)
        .slice(0, 5);

    if (!relevantMarkets.length) {
        return createFallbackAnalysis(
            'no_relevant_markets',
            'No sufficiently relevant Panta market was found for this trade idea.'
        );
    }

    const totalWeight = relevantMarkets.reduce(
        (total, market) => total + market.relevanceScore,
        0
    );
    const weightedAlignment = relevantMarkets.reduce(
        (total, market) =>
            total + (market.alignedValue * market.relevanceScore),
        0
    ) / totalWeight;

    return {
        pantaAlignmentScore: Math.round(weightedAlignment * 100),
        status: 'available',
        message: `${relevantMarkets.length} relevant Panta market${relevantMarkets.length === 1 ? '' : 's'} analyzed.`,
        analyzedAt: new Date().toISOString(),
        markets: relevantMarkets.map(({ description, status, alignedValue, ...market }) => market),
        disclaimer: 'Panta Alignment is contextual market alignment, not the probability that this trade will win.',
    };
};

module.exports = {
    analyzePantaMarkets,
    createFallbackAnalysis,
    normalizeMarket,
    scoreMarketRelevance,
};
