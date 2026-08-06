import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function RecentTrades({ trades }) {
    const navigate = useNavigate();
    return (
        <div className="recent-trades">
            <h2>Recent Trades</h2>

            {trades.length > 0 ? (
                <>
                    <div className="recent-trades-list">
                        {trades.map((trade) => (
                            <div
                                key={trade._id}
                                className="recent-trade-item"
                                onClick={() => navigate(`/trades/${trade._id}`)}
                            >
                                <div className="recent-trade-header">

                                    <h3>{trade.pair}</h3>

                                    <span
                                        className={`recent-trade-rr ${trade.rr >= 0
                                            ? "profit"
                                            : "loss"
                                            }`}
                                    >
                                        {trade.rr > 0 ? "+" : ""}
                                        {trade.rr}R
                                    </span>

                                </div>

                                <div className="recent-trade-meta">

                                    <span
                                        className={`trade-badge ${trade.direction === "buy"
                                            ? "buy"
                                            : "sell"
                                            }`}
                                    >
                                        {trade.direction === "buy"
                                            ? "Long"
                                            : "Short"}
                                    </span>

                                    <span className="trade-badge neutral">
                                        {trade.strategy}
                                    </span>

                                    <span className="trade-badge info">
                                        {trade.timeframe}
                                    </span>

                                    <span className="recent-trade-date">
                                        {new Date(
                                            trade.tradeDate
                                        ).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short"
                                        })}
                                    </span>

                                </div>

                            </div>

                        ))}
                    </div>
                    <div className="recent-trades-footer">
                        <Link
                            to="/trades"
                            className="primary-btn"
                        >
                            View All Trades
                        </Link>
                    </div>
                </>

            ) : (
                <div className="recent-trades-empty">
                    <p>No trades yet.</p>
                    <p>Start recording trades to see your recent activity.</p>

                    <Link
                        to="/create-trade"
                        className="add-first-trade-btn"
                    >
                        + Add Your First Trade
                    </Link>
                </div>
            )}

        </div>
    );
}

export default RecentTrades;