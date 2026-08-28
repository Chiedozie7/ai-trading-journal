import { useEffect, useRef, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const GoalCard = ({ goal, onUpdate, onEdit }) => {
    const axiosPrivate = useAxiosPrivate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const handleDelete = async () => {
        setIsMenuOpen(false);

        const confirmed = window.confirm(
            "Are you sure you want to delete this goal?"
        );

        if (!confirmed) return;

        try {
            await axiosPrivate.delete(`/goals/${goal._id}`);
            onUpdate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = () => {
        setIsMenuOpen(false);
        onEdit(goal);
    };

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
            className={`goal-card ${goal.completed ? "goal-completed" : ""
                }`}
        >

            <div className="goal-card-header">

                <div>
                    <h3>{goal.title}</h3>

                    <span className="goal-type">
                        {getTypeLabel()}
                    </span>
                </div>

                <div
                    className="goal-menu"
                    ref={menuRef}
                >
                    <button
                        type="button"
                        className="goal-menu-btn"
                        onClick={() =>
                            setIsMenuOpen(prev => !prev)
                        }
                    >
                        ⋮
                    </button>

                    {isMenuOpen && (
                        <div className="goal-menu-dropdown">

                            <button
                                type="button"
                                onClick={handleEdit}
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                className="goal-delete-option"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>

                        </div>
                    )}
                </div>

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