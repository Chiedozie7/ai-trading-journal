const isPantaEnabled = () =>
    String(process.env.PANTA_ENABLED).toLowerCase() === 'true';

const getMaxPages = () => {
    const configuredMaxPages = Number(process.env.PANTA_MAX_PAGES);

    if (!Number.isFinite(configuredMaxPages)) return 25;

    return Math.min(Math.max(Math.floor(configuredMaxPages), 1), 50);
};

const getPantaConfig = () => ({
    enabled: isPantaEnabled(),
    apiBaseUrl: process.env.PANTA_API_BASE_URL,
    apiKey: process.env.PANTA_API_KEY,
    timeoutMs: Number(process.env.PANTA_API_TIMEOUT_MS) || 5000,
    maxPages: getMaxPages(),
});

module.exports = {
    getPantaConfig,
    isPantaEnabled,
};
