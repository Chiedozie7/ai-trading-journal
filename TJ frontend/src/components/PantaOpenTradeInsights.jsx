import { Link } from "react-router-dom";
import {
    formatPantaProbability,
    getPantaAlignmentMeta,
    hasPantaProbability,
} from "../utils/pantaDisplay";

function PantaOpenTradeInsights({ trades }) {
    const openTrades = trades.filter((trade) =>
        !trade.result && trade.pantaAnalysis && trade.pantaTimeline?.length
    );

    return (
        <section className="panta-open-insights">
            <div className="panta-insights-heading">
                <div>
                    <span className="panta-powered">Powered by Panta</span>
                    <h2>Open-Trade Movement</h2>
                </div>
                <span>{openTrades.length} tracked</span>
            </div>

            {openTrades.length ? (
                <div className="panta-open-grid">
                    {openTrades.map((trade) => {
                        const first = trade.pantaTimeline[0];
                        const latest = trade.pantaTimeline[trade.pantaTimeline.length - 1];
                        const alignment = getPantaAlignmentMeta(latest.alignmentScore);
                        const scoreMovement = latest.alignmentScore - first.alignmentScore;
                        const entryMarkets = new Map(
                            (first.markets || []).map((market) => [market.marketId, market])
                        );

                        return (
                            <article className="panta-open-card" key={trade._id}>
                                <div className="panta-open-card-heading">
                                    <div>
                                        <span>{trade.direction}</span>
                                        <h3>{trade.pair}</h3>
                                    </div>
                                    <span className={`panta-analytics-status panta-${alignment.tone}`}>
                                        {alignment.label}
                                    </span>
                                </div>
                                <div className="panta-open-score">
                                    <strong>{latest.alignmentScore}</strong>
                                    <span className={scoreMovement > 0 ? "panta-up" : scoreMovement < 0 ? "panta-down" : ""}>
                                        {scoreMovement === 0
                                            ? "No score movement"
                                            : `${scoreMovement > 0 ? "+" : ""}${scoreMovement} points since entry`}
                                    </span>
                                </div>
                                <div className="panta-open-markets">
                                    {(latest.markets || []).map((market) => {
                                        const entryMarket = entryMarkets.get(market.marketId);
                                        const probabilityMovement =
                                            hasPantaProbability(market.yesProbability) &&
                                            hasPantaProbability(entryMarket?.yesProbability)
                                                ? Math.round((market.yesProbability - entryMarket.yesProbability) * 100)
                                                : null;

                                        return (
                                            <div key={market.marketId}>
                                                <span>{market.title}</span>
                                                <span>
                                                    {formatPantaProbability(market.yesProbability)}
                                                    {probabilityMovement !== null && probabilityMovement !== 0
                                                        ? ` (${probabilityMovement > 0 ? "+" : ""}${probabilityMovement} pts)`
                                                        : ""}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="panta-open-footer">
                                    <span>{trade.pantaTimeline.length} snapshot{trade.pantaTimeline.length === 1 ? "" : "s"}</span>
                                    <Link to={`/trades/${trade._id}`}>View trade</Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className="panta-empty-state">
                    <strong>No tracked open trades yet</strong>
                    <p>Open trades created from a Panta pre-trade check will appear here as snapshots accumulate.</p>
                </div>
            )}
        </section>
    );
}

export default PantaOpenTradeInsights;
