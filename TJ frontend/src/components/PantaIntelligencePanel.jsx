import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
    formatPantaProbability,
    getPantaAlignmentMeta,
    hasPantaProbability,
} from "../utils/pantaDisplay";
import "../styles/pantaIntelligence.css";

function PantaIntelligencePanel({
    enabled,
    tradeIdea,
    onAnalysisChange,
}) {
    const axiosPrivate = useAxiosPrivate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const analysis = tradeIdea.pantaAnalysis;
    const alignment = analysis
        ? getPantaAlignmentMeta(analysis.pantaAlignmentScore)
        : null;

    const canAnalyze = Boolean(
        tradeIdea.pair &&
        tradeIdea.direction &&
        tradeIdea.entryPrice &&
        tradeIdea.stopLoss &&
        tradeIdea.takeProfit
    );

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
                    <div
                        className={`panta-score panta-score-${alignment.tone}`}
                        aria-label={`Panta Alignment ${analysis.pantaAlignmentScore} out of 100, ${alignment.label}`}
                    >
                        <div>
                            <strong>{analysis.pantaAlignmentScore}</strong>
                            <span>/100</span>
                        </div>
                        <span className="panta-score-label">— {alignment.label}</span>
                    </div>
                )}
            </div>

            <p className="panta-disclaimer">
                Panta Alignment is contextual agreement, not win probability.
            </p>

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
                            </div>
                            <div className="panta-market-signals">
                                <span className={`panta-probability ${hasPantaProbability(market.yesProbability) ? "" : "panta-probability-unavailable"}`}>
                                    {formatPantaProbability(market.yesProbability)}
                                </span>
                                <span className={`panta-classification panta-${market.classification}`}>
                                    {market.classification}
                                </span>
                            </div>
                            <p className="panta-market-reason">
                                <strong>Why:</strong> {market.reason}
                            </p>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default PantaIntelligencePanel;
