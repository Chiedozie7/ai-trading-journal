const { getPantaConfig } = require('../config/panta');

const buildMarketsUrl = (apiBaseUrl) =>
    `${apiBaseUrl.replace(/\/+$/, '')}/markets/`;

const extractMarketCollection = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.data)) return payload.data;

    throw new Error('Panta markets response did not contain a market collection');
};

const fetchPantaMarkets = async () => {
    const config = getPantaConfig();

    if (!config.apiBaseUrl) {
        throw new Error('PANTA_API_BASE_URL is not configured');
    }

    if (!config.apiKey) {
        throw new Error('PANTA_API_KEY is not configured');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
    const headers = {
        Accept: 'application/json',
        'X-Api-Key': config.apiKey,
    };

    try {
        const response = await fetch(buildMarketsUrl(config.apiBaseUrl), {
            method: 'GET',
            headers,
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`Panta API returned ${response.status}`);
        }

        const payload = await response.json();
        return extractMarketCollection(payload).slice(0, config.maxMarkets);
    } finally {
        clearTimeout(timeout);
    }
};

module.exports = {
    buildMarketsUrl,
    extractMarketCollection,
    fetchPantaMarkets,
};
