const { getPantaConfig } = require('../config/panta');

const extractMarketCollection = (payload) => {
    const candidates = [
        payload,
        payload?.markets,
        payload?.items,
        payload?.data,
        payload?.data?.markets,
        payload?.data?.items,
    ];

    return candidates.find(Array.isArray) || [];
};

const fetchPantaMarkets = async () => {
    const config = getPantaConfig();

    if (!config.apiUrl) {
        throw new Error('PANTA_API_URL is not configured');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
    const headers = {
        Accept: 'application/json',
    };

    if (config.apiKey) {
        headers[config.apiKeyHeader] = `${config.apiKeyPrefix}${config.apiKey}`;
    }

    try {
        const response = await fetch(config.apiUrl, {
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
    fetchPantaMarkets,
};
