function StatCard({
    title,
    value,
    icon: Icon,
    change,
    changeType = "number",
    changeColor = "neutral",
    favorableDirection = "up",
    className = "",
}) {
    let colorClass = "neutral";

    if (changeColor === "performance") {
        if (change > 0) {
            colorClass =
                favorableDirection === "up"
                    ? "positive"
                    : "negative";
        } else if (change < 0) {
            colorClass =
                favorableDirection === "down"
                    ? "positive"
                    : "negative";
        }
    }

    const arrow =
        change > 0
            ? "▲"
            : change < 0
                ? "▼"
                : "•";

    let formattedChange = "";

    if (change !== null && change !== undefined) {
        if (changeType === "percentage") {
            formattedChange = `${Math.abs(change).toFixed(2)}%`;
        } else if (changeType === "rr") {
            formattedChange = `${Math.abs(change).toFixed(2)}R`;
        } else {
            formattedChange = Number(
                Math.abs(change).toFixed(2)
            ).toString();
        }
    }

    return (
        <div className={`stat-card ${className}`}>

            <div className="stat-card-header">
                <div className="stat-card-title">
                    {Icon && (
                        <Icon className="stat-card-icon" />
                    )}

                    <span>{title}</span>
                </div>
            </div>

            <p className="stat-card-value">
                {value}
            </p>

            {change !== null && change !== undefined && (
                <small className="stat-card-change">
                    <span className={`stat-card-change-value ${colorClass}`}>
                        <span className="stat-card-arrow">
                            {arrow}
                        </span>

                        {formattedChange}
                    </span>

                    <span className="stat-card-change-label">
                        {" vs last month"}
                    </span>
                </small>
            )}

        </div>
    );
}

export default StatCard;