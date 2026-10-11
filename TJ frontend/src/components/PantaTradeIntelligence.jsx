import "../styles/pantaTradeIntelligence.css";
import {
    formatPantaProbability,
    getPantaAlignmentMeta,
    hasPantaProbability,
} from "../utils/pantaDisplay";

function PantaTradeIntelligence({ trade, isRefreshing, onRefresh }) {
    const entry = trade.pantaAnalysis;
    const timeline = trade.pantaTimeline || [];
    const latestSnapshot = timeline[timeline.length - 1];
    const latestScore = latestSnapshot?.alignmentScore ?? entry?.pantaAlignmentScore;
    const entryAlignment = getPantaAlignmentMeta(entry?.pantaAlignmentScore);
    const latestAlignment = getPantaAlignmentMeta(latestScore);
    const latestMarkets = latestSnapshot?.markets || entry?.markets || [];
    const firstSnapshot = timeline[0];
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
                    <h2>Panta Alignment</h2>
                </div>

                {!trade.result && (
                    <button
                        type="button"
                        className="panta-refresh-button"
                        onClick={onRefresh}
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? "Refreshing…" : "Refresh Panta"}
                    </button>
                )}
            </div>

            <p className="panta-trade-disclaimer">
                Panta Alignment is contextual agreement, not win probability.
            </p>

            <div className="panta-score-comparison">
                <div className={`panta-score-card panta-score-card-${entryAlignment.tone}`}>
                    <span>Alignment at entry</span>
                    <strong>{entry.pantaAlignmentScore} — {entryAlignment.label}</strong>
                    <small>out of 100</small>
                </div>
                <div className={`panta-score-card panta-score-card-${latestAlignment.tone}`}>
                    <span>Latest alignment</span>
                    <strong>{latestScore} — {latestAlignment.label}</strong>
                    <small>out of 100</small>
                </div>
            </div>

            <h3>Current Market Context</h3>
            <div className="panta-current-markets">
                {latestMarkets.length ? latestMarkets.map((market) => {
                    const entryMarket = firstMarketsById.get(market.marketId);
                    const movement =
                        hasPantaProbability(market.yesProbability) &&
                        hasPantaProbability(entryMarket?.yesProbability)
                            ? Math.round(
                                (market.yesProbability - entryMarket.yesProbability) * 100
                            )
                            : null;

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
                            </div>
                            {movement !== null && (
                                <p className={movement > 0 ? "panta-up" : movement < 0 ? "panta-down" : ""}>
                                    {`${movement > 0 ? "+" : ""}${movement} points from entry`}
                                </p>
                            )}
                            <p className="panta-market-reason">
                                <strong>Why:</strong> {market.reason}
                            </p>
                        </article>
                    );
                }) : (
                    <p>{entry.message}</p>
                )}
            </div>

            <h3>Alignment Timeline</h3>
            {timeline.length ? (
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
                                            <strong>{snapshot.alignmentScore} — {snapshotAlignment.label}</strong>
                                            <span>{index === 0 ? "Entry snapshot" : "Alignment update"}</span>
                                        </div>
                                        <time dateTime={snapshot.capturedAt}>
                                            {new Date(snapshot.capturedAt).toLocaleString()}
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
            ) : (
                <p>No timeline snapshots yet.</p>
            )}
        </section>
    );
}

export default PantaTradeIntelligence;
