import "../styles/pantaTradeIntelligence.css";
import {
    formatPantaProbability,
    getPantaAlignmentMeta,
    hasPantaProbability,
} from "../utils/pantaDisplay";

const formatTimestamp = (value) =>
    value ? new Date(value).toLocaleString() : "Not available";

function PantaTradeIntelligence({ trade, isRefreshing, onRefresh }) {
    const entry = trade.pantaAnalysis;
    const timeline = trade.pantaTimeline || [];
    const latestSnapshot = timeline[timeline.length - 1];
    const latestScore = latestSnapshot?.alignmentScore ?? entry?.pantaAlignmentScore;
    const entryAlignment = getPantaAlignmentMeta(entry?.pantaAlignmentScore);
    const latestAlignment = getPantaAlignmentMeta(latestScore);
    const latestMarkets = latestSnapshot?.markets || entry?.markets || [];
    const firstSnapshot = timeline[0];
    const hasMovementHistory = timeline.length > 1;
    const alignmentDelta = hasMovementHistory
        ? Number(latestScore) - Number(entry?.pantaAlignmentScore)
        : null;
    const lastUpdatedAt = latestSnapshot?.capturedAt || entry?.analyzedAt;
    const firstMarketsById = new Map(
        (firstSnapshot?.markets || entry?.markets || []).map((market) => [
            market.marketId,
            market,
        ])
    );

    if (!entry) return null;

    return (
        <section className="details-card panta-trade-panel">
            <div className="panta-trade-heading">
                <div>
                    <span className="panta-powered">Powered by Panta</span>
                    <h2>Panta Trade Intelligence</h2>
                </div>
            </div>

            <p className="panta-trade-disclaimer">
                Panta Alignment is contextual agreement, not win probability.
            </p>

            <section className="panta-trade-section">
                <div className="panta-section-heading">
                    <div>
                        <span className="panta-section-kicker">Entry vs latest</span>
                        <h3>Panta Alignment</h3>
                    </div>

                    {!trade.result && (
                        <button
                            type="button"
                            className="panta-refresh-button"
                            onClick={onRefresh}
                            disabled={isRefreshing}
                        >
                            {isRefreshing ? "Refreshing..." : "Refresh Panta"}
                        </button>
                    )}
                </div>

                <div className="panta-score-comparison">
                    <div className={`panta-score-card panta-score-card-${entryAlignment.tone}`}>
                        <span>Alignment at entry</span>
                        <strong>
                            {entry.pantaAlignmentScore}{" \u2014 "}{entryAlignment.label}
                        </strong>
                        <small>out of 100</small>
                    </div>
                    <div className={`panta-score-card panta-score-card-${latestAlignment.tone}`}>
                        <span>Latest alignment</span>
                        <strong>
                            {latestScore}{" \u2014 "}{latestAlignment.label}
                        </strong>
                        <small>out of 100</small>
                    </div>
                </div>

                <div className="panta-alignment-meta">
                    <div className={`panta-alignment-movement ${alignmentDelta > 0 ? "panta-up" : alignmentDelta < 0 ? "panta-down" : ""}`}>
                        <span>Movement since entry</span>
                        <strong>
                            {hasMovementHistory
                                ? alignmentDelta === 0
                                    ? "No alignment change"
                                    : `${alignmentDelta > 0 ? "+" : ""}${alignmentDelta} points`
                                : "No movement yet"}
                        </strong>
                    </div>
                    <div className="panta-last-updated">
                        <span>Last updated</span>
                        <time dateTime={lastUpdatedAt || undefined}>
                            {formatTimestamp(lastUpdatedAt)}
                        </time>
                    </div>
                </div>
            </section>

            <section className="panta-trade-section">
                <div className="panta-section-heading">
                    <div>
                        <span className="panta-section-kicker">Live read-only signals</span>
                        <h3>Current Panta Context</h3>
                    </div>
                    <span className="panta-market-count">
                        {latestMarkets.length} relevant market{latestMarkets.length === 1 ? "" : "s"}
                    </span>
                </div>

                <div className="panta-current-markets">
                    {latestMarkets.length ? latestMarkets.map((market) => {
                        const entryMarket = firstMarketsById.get(market.marketId);
                        const probabilityMovement =
                            hasMovementHistory &&
                            hasPantaProbability(market.yesProbability) &&
                            hasPantaProbability(entryMarket?.yesProbability)
                                ? Math.round(
                                    (market.yesProbability - entryMarket.yesProbability) * 100
                                )
                                : null;
                        const hasRelevance =
                            market.relevanceScore !== null &&
                            market.relevanceScore !== undefined &&
                            Number.isFinite(Number(market.relevanceScore));

                        return (
                            <article key={market.marketId} className="panta-current-market">
                                <div className="panta-market-title-row">
                                    <h4>{market.title}</h4>
                                </div>
                                <div className="panta-market-signals">
                                    <span className={`panta-probability ${hasPantaProbability(market.yesProbability) ? "" : "panta-probability-unavailable"}`}>
                                        {formatPantaProbability(market.yesProbability)}
                                    </span>
                                    <span className={`panta-classification panta-${market.classification}`}>
                                        {market.classification}
                                    </span>
                                    {hasRelevance && (
                                        <span className="panta-relevance">
                                            Relevance {Math.round(Number(market.relevanceScore))}/100
                                        </span>
                                    )}
                                </div>
                                {probabilityMovement !== null && (
                                    <p className={probabilityMovement > 0 ? "panta-up" : probabilityMovement < 0 ? "panta-down" : ""}>
                                        {`${probabilityMovement > 0 ? "+" : ""}${probabilityMovement} YES probability points from entry`}
                                    </p>
                                )}
                                <p className="panta-market-reason">
                                    <strong>Why:</strong> {market.reason}
                                </p>
                            </article>
                        );
                    }) : (
                        <div className="panta-empty-context">
                            No relevant Panta markets are present in the latest context.
                        </div>
                    )}
                </div>
            </section>

            <section className="panta-trade-section panta-since-entry">
                <div className="panta-section-heading">
                    <div>
                        <span className="panta-section-kicker">Saved context history</span>
                        <h3>Since Entry</h3>
                    </div>
                </div>

                {timeline.length > 1 ? (
                    <div className="panta-timeline">
                        {timeline.map((snapshot, index) => {
                            const snapshotAlignment = getPantaAlignmentMeta(snapshot.alignmentScore);

                            return (
                                <div
                                    className="panta-timeline-item"
                                    key={`${snapshot.capturedAt}-${index}`}
                                >
                                    <div className="panta-timeline-marker" />
                                    <div className="panta-timeline-content">
                                        <div className="panta-timeline-summary">
                                            <div>
                                                <strong>
                                                    {snapshot.alignmentScore}{" \u2014 "}{snapshotAlignment.label}
                                                </strong>
                                                <span>{index === 0 ? "Entry snapshot" : "Alignment update"}</span>
                                            </div>
                                            <time dateTime={snapshot.capturedAt}>
                                                {formatTimestamp(snapshot.capturedAt)}
                                            </time>
                                        </div>
                                        <p>
                                            {snapshot.markets.length} relevant market
                                            {snapshot.markets.length === 1 ? "" : "s"}
                                        </p>
                                        {snapshot.markets.length > 0 && (
                                            <div className="panta-timeline-markets">
                                                {snapshot.markets.map((market) => (
                                                    <div key={market.marketId}>
                                                        <span>{market.title}</span>
                                                        <span>{formatPantaProbability(market.yesProbability)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : timeline.length === 1 ? (
                    <div className="panta-no-movement">
                        <strong>No movement yet</strong>
                        <span>The entry snapshot is the only saved Panta context for this trade.</span>
                    </div>
                ) : (
                    <div className="panta-no-movement">
                        <strong>No timeline snapshots yet</strong>
                        <span>This trade has entry context but no saved Panta timeline snapshots.</span>
                    </div>
                )}
            </section>
        </section>
    );
}

export default PantaTradeIntelligence;
