import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
    formatPantaProbability,
    getPantaAlignmentMeta,
    hasPantaProbability,
} from "../utils/pantaDisplay";
import "../styles/pantaIntelligence.css";

const getAggregateExplanation = (analysis) => {
    if (!analysis.markets.length) return analysis.message;

    const counts = analysis.markets.reduce((totals, market) => ({
        ...totals,
        [market.classification]: totals[market.classification] + 1,
    }), { support: 0, oppose: 0, neutral: 0 });
    const pricedMarkets = analysis.markets.filter((market) =>
        hasPantaProbability(market.yesProbability)
    ).length;

    return `${counts.support} supporting, ${counts.oppose} opposing, and ${counts.neutral} neutral market signal${analysis.markets.length === 1 ? "" : "s"} ${analysis.markets.length === 1 ? "was" : "were"} combined into the ${analysis.pantaAlignmentScore}/100 alignment. ${pricedMarkets} of ${analysis.markets.length} currently provide a YES probability.`;
};

const getSetupMeaning = (analysis, direction) => {
    const alignment = getPantaAlignmentMeta(analysis.pantaAlignmentScore);

    if (alignment.tone === "support") {
        return `Panta market context leans with this ${direction} setup. Treat that agreement as supporting context, not a prediction of the trade outcome.`;
    }

    if (alignment.tone === "oppose") {
        return `Panta market context leans against this ${direction} setup. Consider the disagreement before execution, but do not treat it as a trade outcome prediction.`;
    }

    return `Panta market context is mixed, neutral, or not sufficiently priced for this ${direction} setup. The check does not add a strong directional signal.`;
};

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
    const analyzedAt = analysis?.analyzedAt
        ? new Date(analysis.analyzedAt).toLocaleString()
        : "timestamp unavailable";

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
                    <div className="panta-setup-summary" aria-label="Proposed trade setup">
                        <div><span>Asset</span><strong>{tradeIdea.pair}</strong></div>
                        <div><span>Direction</span><strong>{tradeIdea.direction}</strong></div>
                        <div><span>Entry</span><strong>{tradeIdea.entryPrice}</strong></div>
                        <div><span>Stop Loss</span><strong>{tradeIdea.stopLoss}</strong></div>
                        <div><span>Take Profit</span><strong>{tradeIdea.takeProfit}</strong></div>
                        <div><span>Holding Period</span><strong>{tradeIdea.expectedHoldingPeriod || "Not specified"}</strong></div>
                    </div>

                    <div className="panta-result-summary">
                        <section className="panta-result-primary">
                            <div className="panta-result-primary-heading">
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
                                <time dateTime={analysis.analyzedAt || undefined}>
                                    Analyzed {analyzedAt}
                                </time>
                            </div>
                            <div className="panta-analysis-overview">
                                <strong>Why this score</strong>
                                <p>{getAggregateExplanation(analysis)}</p>
                            </div>
                        </section>

                        <div className={`panta-setup-meaning panta-setup-meaning-${alignment.tone}`}>
                            <strong>What this means for your setup</strong>
                            <p>{getSetupMeaning(analysis, tradeIdea.direction)}</p>
                        </div>
                    </div>

                    <section className="panta-relevant-markets">
                        <div className="panta-relevant-markets-heading">
                            <h3>
                                Relevant Panta Market{analysis.markets.length === 1 ? "" : "s"} ({analysis.markets.length})
                            </h3>
                        </div>
                        <div className="panta-market-list">
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
                                        {market.relevanceScore !== null &&
                                            market.relevanceScore !== undefined &&
                                            Number.isFinite(Number(market.relevanceScore)) && (
                                            <span className="panta-relevance">
                                                Relevance {Math.round(Number(market.relevanceScore))}/100
                                            </span>
                                        )}
                                    </div>
                                    <p className="panta-market-reason">
                                        <strong>Why:</strong> {market.reason}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </section>
    );
}

export default PantaIntelligencePanel;
