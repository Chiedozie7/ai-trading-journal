const PANTA_BUCKETS = [
    { key: "supported", label: "Supported", tone: "support" },
    { key: "neutral", label: "Neutral", tone: "neutral" },
    { key: "opposed", label: "Opposed", tone: "oppose" },
];

function PantaAnalyticsOverview({ analytics }) {
    if (!analytics?.enabled) return null;

    return (
        <section className="panta-analytics-section">
            <span className="panta-powered">Powered by Panta</span>
            <h2>Journal Alignment Insights</h2>
            <p className="panta-analytics-disclaimer">
                Panta Alignment is contextual agreement, not win probability.
            </p>

            <div className="panta-analytics-grid">
                {PANTA_BUCKETS.map(({ key, label, tone }) => {
                    const bucket = analytics[key];
                    const range = key === "supported"
                        ? `${analytics.thresholds.supported}–100`
                        : key === "opposed"
                            ? `0–${analytics.thresholds.opposed}`
                            : `${analytics.thresholds.opposed + 1}–${analytics.thresholds.supported - 1}`;

                    return (
                        <article className={`panta-analytics-card panta-analytics-${tone}`} key={key}>
                            <div className="panta-analytics-card-heading">
                                <span className={`panta-analytics-status panta-${tone}`}>{label}</span>
                                <span>Score {range}</span>
                            </div>
                            <strong>{bucket.count}</strong>
                            <span className="panta-analytics-trades">trade{bucket.count === 1 ? "" : "s"} at entry</span>
                            <div className="panta-analytics-metrics">
                                <div>
                                    <span>Win rate</span>
                                    <strong>{bucket.winRate}%</strong>
                                </div>
                                <div>
                                    <span>Average R</span>
                                    <strong>{bucket.averageR}R</strong>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            <h3>Entry Alignment vs Final Outcome</h3>
            <div className="analytics-table-container">
                <table className="analytics-table">
                    <thead>
                        <tr>
                            <th>Entry Alignment</th>
                            <th>Wins</th>
                            <th>Losses</th>
                            <th>Breakeven</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PANTA_BUCKETS.map(({ key, label, tone }) => (
                            <tr key={key}>
                                <td><span className={`panta-analytics-status panta-${tone}`}>{label}</span></td>
                                <td>{analytics[key].wins}</td>
                                <td>{analytics[key].losses}</td>
                                <td>{analytics[key].breakeven}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default PantaAnalyticsOverview;
