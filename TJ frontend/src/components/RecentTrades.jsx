import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function RecentTrades({ trades }) {
    const navigate = useNavigate();
    return (
        <div className="recent-trades">
            <h2>Recent Trades</h2>

            {trades.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Pair</th>
                            <th>Result</th>
                            <th>PnL</th>
                        </tr>
                    </thead>

                    <tbody>
                        {trades.map((trade) => (
                            <tr
                                key={trade._id}
                                onClick={() => navigate(`/trades/${trade._id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{trade.pair}</td>
                                <td>{trade.result}</td>
                                <td>{trade.pnl}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
            <Link to="/trades">
                View All →
            </Link>
        </div>
    );
}

export default RecentTrades;