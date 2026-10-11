export const getPantaAlignmentMeta = (score) => {
    const numericScore = Number(score);

    if (numericScore >= 60) return { label: "Supported", tone: "support" };
    if (numericScore <= 40) return { label: "Opposed", tone: "oppose" };

    return { label: "Neutral", tone: "neutral" };
};

export const hasPantaProbability = (value) =>
    value !== null && value !== undefined && Number.isFinite(Number(value));

export const formatPantaProbability = (value) =>
    hasPantaProbability(value)
        ? `YES probability ${Math.round(Number(value) * 100)}%`
        : "YES probability unavailable";
