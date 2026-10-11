import "../styles/pantaTradeIntelligence.css";

const formatProbability = (value) =>
    value === null || value === undefined
        ? "Unavailable"
        : `${Math.round(value * 100)}%`;

function PantaTradeIntelligence({ trade, isRefreshing, onRefresh }) {
    const entry = trade.pantaAnalysis;
    const timeline = trade.pantaTimeline || [];
    const latestSnapshot = timeline[timeline.length - 1];
    const latestScore = latestSnapshot?.alignmentScore ?? entry?.pantaAlignmentScore;
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
                Contextual agreement with Panta markets, not the probability of trade success.
            </p>

            <div className="panta-score-comparison">
                <div>
                    <span>Alignment at entry</span>
                    <strong>{entry.pantaAlignmentScore}/100</strong>
                </div>
                <div>
                    <span>Latest alignment</span>
                    <strong>{latestScore}/100</strong>
                </div>
            </div>

            <h3>Current Market Context</h3>
            <div className="panta-current-markets">
                {latestMarkets.length ? latestMarkets.map((market) => {
                    const entryMarket = firstMarketsById.get(market.marketId);
                    const movement =
                        market.yesProbability !== null &&
                        entryMarket?.yesProbability !== null &&
                        entryMarket?.yesProbability !== undefined
                            ? Math.round(
                                (market.yesProbability - entryMarket.yesProbability) * 100
                            )
                            : null;

                    return (
                        <article key={market.marketId} className="panta-current-market">
                            <div className="panta-market-title-row">
                                <h4>{market.title}</h4>
                                <span className={`panta-classification panta-${market.classification}`}>
                                    {market.classification}
                                </span>
                            </div>
                            <p>
                                YES {formatProbability(market.yesProbability)}
                                {movement !== null && (
                                    <span className={movement > 0 ? "panta-up" : movement < 0 ? "panta-down" : ""}>
                                        {` (${movement > 0 ? "+" : ""}${movement} pts from entry)`}
                                    </span>
                                )}
                            </p>
                            <p>{market.reason}</p>
                        </article>
                    );
                }) : (
                    <p>{entry.message}</p>
                )}
            </div>

            <h3>Alignment Timeline</h3>
            {timeline.length ? (
                <div className="panta-timeline">
                    {timeline.map((snapshot, index) => (
                        <div
                            className="panta-timeline-item"
                            key={`${snapshot.capturedAt}-${index}`}
                        >
                            <div className="panta-timeline-marker" />
                            <div>
                                <strong>{snapshot.alignmentScore}/100</strong>
                                <span>{new Date(snapshot.capturedAt).toLocaleString()}</span>
                                <p>
                                    {snapshot.markets.length} relevant market
                                    {snapshot.markets.length === 1 ? "" : "s"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No timeline snapshots yet.</p>
            )}
        </section>
    );
}

export default PantaTradeIntelligence;
