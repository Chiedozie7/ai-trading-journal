const GoalCard = ({ goal }) => {

    const formatValue = () => {
        if (goal.type === "totalPnl") {
            return `$${Number(goal.currentValue).toFixed(2)}`;
        }

        if (goal.type === "winRate") {
            return `${Number(goal.currentValue).toFixed(1)}%`;
        }

        if (goal.type === "averageRR") {
            return `${Number(goal.currentValue).toFixed(2)}R`;
        }

        return Number(goal.currentValue).toFixed(0);
    };

    const formatTarget = () => {
        if (goal.type === "totalPnl") {
            return `$${Number(goal.target).toFixed(2)}`;
        }

        if (goal.type === "winRate") {
            return `${Number(goal.target).toFixed(1)}%`;
        }

        if (goal.type === "averageRR") {
            return `${Number(goal.target).toFixed(2)}R`;
        }

        return Number(goal.target).toFixed(0);
    };

    const getTypeLabel = () => {
        const labels = {
            totalTrades: "Total Trades",
            totalPnl: "Total PnL",
            winRate: "Win Rate",
            averageRR: "Average RR",
        };

        return labels[goal.type] || goal.type;
    };

    const getPeriodLabel = () => {
        const labels = {
            thisWeek: "This Week",
            thisMonth: "This Month",
            thisYear: "This Year",
            allTime: "All Time",
            custom: "Custom Range",
        };

        return labels[goal.period] || goal.period;
    };

    return (
        <div
            className={`goal-card ${
                goal.completed ? "goal-completed" : ""
            }`}
        >

            <div className="goal-card-header">

                <div>
                    <h3>{goal.title}</h3>

                    <span className="goal-type">
                        {getTypeLabel()}
                    </span>
                </div>

                <button className="goal-menu-btn">
                    ⋮
                </button>

            </div>

            <div className="goal-progress-info">

                <span>
                    {formatValue()} / {formatTarget()}
                </span>

                <strong>
                    {Number(goal.progress).toFixed(0)}%
                </strong>

            </div>

            <div className="goal-progress-bar">

                <div
                    className="goal-progress-fill"
                    style={{
                        width: `${goal.progress}%`,
                    }}
                />

            </div>

            <div className="goal-card-footer">

                <span>{getPeriodLabel()}</span>

                {goal.completed && (
                    <span className="goal-completed-label">
                        Completed
                    </span>
                )}

            </div>

        </div>
    );
};

export default GoalCard;