function MiniVisual({ type, value }) {
    if (type === "bars") {
        return (
            <div className="stat-mini-bars">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        );
    }

    if (type === "donut") {
        const percentage = Math.min(
            100,
            Math.max(0, Number(String(value).replace("%", "")) || 0)
        );

        return (
            <div
                className="stat-mini-donut"
                style={{
                    "--win-rate": `${percentage * 3.6}deg`,
                }}
            >
                <div className="stat-mini-donut-inner"></div>
            </div>
        );
    }

    if (type === "flat") {
        return (
            <svg
                className="stat-mini-line"
                viewBox="0 0 120 50"
                preserveAspectRatio="none"
            >
                <path d="M2 32 L118 32" />
                <circle cx="118" cy="32" r="3" />
            </svg>
        );
    }

    if (type === "green-line") {
        return (
            <svg
                className="stat-mini-line green"
                viewBox="0 0 120 50"
                preserveAspectRatio="none"
            >
                <path d="M2 36 C15 20, 18 40, 30 27 S45 32, 55 22 S70 30, 82 17 S98 27, 118 8" />
                <circle cx="118" cy="8" r="3" />
            </svg>
        );
    }

    if (type === "red-line") {
        return (
            <svg
                className="stat-mini-line red"
                viewBox="0 0 120 50"
                preserveAspectRatio="none"
            >
                <path d="M2 15 C14 8, 18 25, 30 20 S43 38, 55 27 S70 34, 82 29 S99 42, 118 35" />
                <circle cx="118" cy="35" r="3" />
            </svg>
        );
    }

    if (type === "purple-line") {
        return (
            <svg
                className="stat-mini-line purple"
                viewBox="0 0 120 50"
                preserveAspectRatio="none"
            >
                <path d="M2 38 C14 35, 18 25, 30 30 S45 18, 55 25 S68 8, 78 17 S92 5, 101 20 S110 30, 118 18" />
                <circle cx="118" cy="18" r="3" />
            </svg>
        );
    }

    if (type === "pnl-line") {
        return (
            <svg
                className="stat-mini-line green"
                viewBox="0 0 120 50"
                preserveAspectRatio="none"
            >
                <path d="M2 40 C15 35, 20 42, 30 34 S45 37, 55 28 S68 32, 76 25 S88 30, 98 13 S110 18, 118 5" />
                <circle cx="118" cy="5" r="3" />
            </svg>
        );
    }

    return null;
}


function getVisualType(title) {
    const normalizedTitle = title?.toLowerCase();

    if (normalizedTitle === "total trades") return "bars";
    if (normalizedTitle === "wins") return "green-line";
    if (normalizedTitle === "losses") return "red-line";
    if (
        normalizedTitle === "breakeven" ||
        normalizedTitle === "break even"
    ) {
        return "flat";
    }
    if (normalizedTitle === "win rate") return "donut";
    if (normalizedTitle === "total pnl") return "pnl-line";
    if (normalizedTitle === "average pnl") return "bars";
    if (normalizedTitle === "average rr") return "purple-line";

    return null;
}

function getIconColor(title) {
    const normalizedTitle = title?.toLowerCase();

    if (normalizedTitle === "wins") return "green";
    if (normalizedTitle === "losses") return "red";
    if (
        normalizedTitle === "breakeven" ||
        normalizedTitle === "break even"
    ) return "orange";
    if (normalizedTitle === "win rate") return "teal";

    return "purple";
}


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
            formattedChange = `${Math.abs(change).toFixed(1)}%`;
        } else if (changeType === "rr") {
            formattedChange = `${Math.abs(change).toFixed(2)}R`;
        } else {
            formattedChange = Number(
                Math.abs(change).toFixed(2)
            ).toString();
        }
    }

    const visualType = getVisualType(title);
    const iconColor = getIconColor(title);

    return (
        <div className={`stat-card ${className}`}>

            <div className="stat-card-main">

                <div className="stat-card-header">
                    <div className="stat-card-title">

                        {Icon && (
                            <span className={`stat-card-icon-wrap ${iconColor}`}>
                                <Icon className="stat-card-icon" />
                            </span>
                        )}

                        <span>{title}</span>
                    </div>
                </div>

                <p className="stat-card-value">
                    {value}
                </p>

                {change !== null && change !== undefined && (
                    <small className="stat-card-change">

                        <span
                            className={`stat-card-change-value ${colorClass}`}
                        >
                            <span className="stat-card-arrow">
                                {arrow}
                            </span>

                            {formattedChange}
                        </span>

                        <span className="stat-card-change-label">
                            vs last month
                        </span>

                    </small>
                )}

            </div>

            {visualType && (
                <div className="stat-card-visual">
                    <MiniVisual
                        type={visualType}
                        value={value}
                    />
                </div>
            )}

        </div>
    );
}

export default StatCard;