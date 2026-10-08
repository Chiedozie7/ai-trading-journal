const isPantaEnabled = () =>
    String(process.env.PANTA_ENABLED).toLowerCase() === 'true';

const getPantaConfig = () => ({
    enabled: isPantaEnabled(),
    apiUrl: process.env.PANTA_API_URL,
    apiKey: process.env.PANTA_API_KEY,
    apiKeyHeader: process.env.PANTA_API_KEY_HEADER || 'Authorization',
    apiKeyPrefix: process.env.PANTA_API_KEY_PREFIX ?? 'Bearer ',
    timeoutMs: Number(process.env.PANTA_API_TIMEOUT_MS) || 5000,
    maxMarkets: Number(process.env.PANTA_MAX_MARKETS) || 100,
});

module.exports = {
    getPantaConfig,
    isPantaEnabled,
};
