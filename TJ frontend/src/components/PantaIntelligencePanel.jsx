import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../styles/pantaIntelligence.css";

function PantaIntelligencePanel({
    tradeIdea,
    onAnalysisChange,
    onTradeIdeaChange,
    onEnabledChange,
}) {
    const axiosPrivate = useAxiosPrivate();
    const [enabled, setEnabled] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const analysis = tradeIdea.pantaAnalysis;

    const canAnalyze = Boolean(
        tradeIdea.pair &&
        tradeIdea.direction &&
        tradeIdea.entryPrice &&
        tradeIdea.stopLoss &&
        tradeIdea.takeProfit
    );

    useEffect(() => {
        let isMounted = true;

        const loadStatus = async () => {
            try {
                const response = await axiosPrivate.get("/trades/panta/config");
                if (isMounted) {
                    const isEnabled = response.data.enabled === true;
                    setEnabled(isEnabled);
                    onEnabledChange(isEnabled);
                }
            } catch {
                if (isMounted) {
                    setEnabled(false);
                    onEnabledChange(false);
                }
            }
        };

        loadStatus();
        return () => {
            isMounted = false;
        };
    }, [axiosPrivate, onEnabledChange]);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError("");

        try {
            const response = await axiosPrivate.post(
                "/trades/panta/analyze",
                {
                    pair: tradeIdea.pair,
                    direction: tradeIdea.direction,
                    entryPrice: tradeIdea.entryPrice,
                    stopLoss: tradeIdea.stopLoss,
                    takeProfit: tradeIdea.takeProfit,
                    expectedHoldingPeriod: tradeIdea.expectedHoldingPeriod,
                }
            );

            onAnalysisChange(response.data);
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Panta analysis could not be completed."
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (enabled !== true) return null;

    return (
        <section className="panta-panel" aria-labelledby="panta-panel-title">
            <div className="panta-panel-header">
                <div>
                    <span className="panta-powered">Powered by Panta</span>
                    <h2 id="panta-panel-title">Panta Alignment</h2>
                </div>

                {analysis && (
                    <div className="panta-score" aria-label={`Panta Alignment score ${analysis.pantaAlignmentScore} out of 100`}>
                        <strong>{analysis.pantaAlignmentScore}</strong>
                        <span>/100</span>
                    </div>
                )}
            </div>

            <p className="panta-disclaimer">
                Contextual alignment with relevant Panta markets — not the probability that this trade will win.
            </p>

            <div className="form-field panta-holding-period">
                <label htmlFor="expectedHoldingPeriod">Expected Holding Period</label>
                <input
                    id="expectedHoldingPeriod"
                    name="expectedHoldingPeriod"
                    placeholder="Optional, e.g. 3 days"
                    value={tradeIdea.expectedHoldingPeriod ?? ""}
                    onChange={onTradeIdeaChange}
                />
            </div>

            <button
                className="panta-analyze-button"
                type="button"
                onClick={handleAnalyze}
                disabled={!canAnalyze || isLoading}
            >
                {isLoading ? "Checking Panta…" : "Analyze with Panta"}
            </button>

            {!canAnalyze && (
                <p className="panta-helper">
                    Add pair, direction, entry, stop loss, and take profit to analyze this idea.
                </p>
            )}

            {error && <p className="panta-error">{error}</p>}

            {analysis && (
                <div className="panta-results">
                    <p className="panta-message">{analysis.message}</p>

                    {analysis.markets.map((market) => (
                        <article className="panta-market" key={market.marketId}>
                            <div className="panta-market-heading">
                                {market.url ? (
                                    <a href={market.url} target="_blank" rel="noreferrer">
                                        {market.title}
                                    </a>
                                ) : (
                                    <h3>{market.title}</h3>
                                )}
                                <span className={`panta-classification panta-${market.classification}`}>
                                    {market.classification}
                                </span>
                            </div>
                            <p className="panta-probability">
                                Current YES probability: {market.yesProbability === null
                                    ? "Unavailable"
                                    : `${Math.round(market.yesProbability * 100)}%`}
                            </p>
                            <p>{market.reason}</p>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default PantaIntelligencePanel;
