const { getPantaConfig } = require('../config/panta');

const buildMarketsUrl = (apiBaseUrl, cursor) => {
    const url = `${apiBaseUrl.replace(/\/+$/, '')}/markets/`;

    return cursor
        ? `${url}?cursor=${encodeURIComponent(cursor)}`
        : url;
};

const extractMarketCollection = (payload) => {
    if (Array.isArray(payload?.items)) return payload.items;

    throw new Error('Panta markets response did not contain an items collection');
};

const fetchPantaMarketPage = async (config, cursor) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
        const response = await fetch(buildMarketsUrl(config.apiBaseUrl, cursor), {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'X-Api-Key': config.apiKey,
            },
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`Panta API returned ${response.status}`);
        }

        const payload = await response.json();

        return {
            markets: extractMarketCollection(payload),
            nextCursor: payload.nextCursor || null,
        };
    } finally {
        clearTimeout(timeout);
    }
};

const fetchPantaMarkets = async () => {
    const config = getPantaConfig();

    if (!config.apiBaseUrl) {
        throw new Error('PANTA_API_BASE_URL is not configured');
    }

    if (!config.apiKey) {
        throw new Error('PANTA_API_KEY is not configured');
    }

    const markets = [];
    const seenCursors = new Set();
    let cursor = null;

    for (let page = 0; page < config.maxPages; page += 1) {
        const result = await fetchPantaMarketPage(config, cursor);
        markets.push(...result.markets);

        if (!result.nextCursor || seenCursors.has(result.nextCursor)) break;

        seenCursors.add(result.nextCursor);
        cursor = result.nextCursor;
    }

    return markets;
};

module.exports = {
    buildMarketsUrl,
    extractMarketCollection,
    fetchPantaMarkets,
};
