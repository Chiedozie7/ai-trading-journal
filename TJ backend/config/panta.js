const isPantaEnabled = () =>
    String(process.env.PANTA_ENABLED).toLowerCase() === 'true';

const getPantaConfig = () => ({
    enabled: isPantaEnabled(),
    apiBaseUrl: process.env.PANTA_API_BASE_URL,
    apiKey: process.env.PANTA_API_KEY,
    timeoutMs: Number(process.env.PANTA_API_TIMEOUT_MS) || 5000,
    maxMarkets: Number(process.env.PANTA_MAX_MARKETS) || 100,
});

module.exports = {
    getPantaConfig,
    isPantaEnabled,
};
