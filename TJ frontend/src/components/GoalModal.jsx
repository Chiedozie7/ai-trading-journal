import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CustomSelect from "./CustomSelect";

const goalTypes = [
    {
        value: "totalTrades",
        label: "Total Trades",
    },
    {
        value: "totalPnl",
        label: "Total PnL",
    },
    {
        value: "winRate",
        label: "Win Rate",
    },
    {
        value: "averageRR",
        label: "Average RR",
    },
];

const periodOptions = [
    {
        value: "thisWeek",
        label: "This Week",
    },
    {
        value: "thisMonth",
        label: "This Month",
    },
    {
        value: "thisYear",
        label: "This Year",
    },
    {
        value: "allTime",
        label: "All Time",
    },
    {
        value: "custom",
        label: "Custom",
    },
];

function GoalModal({ goal, onClose, onSaved }) {
    const axiosPrivate = useAxiosPrivate();

    const [title, setTitle] = useState("");
    const [type, setType] = useState("totalTrades");
    const [target, setTarget] = useState("");
    const [period, setPeriod] = useState("thisMonth");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const isEditing = Boolean(goal);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        if (goal) {
            setTitle(goal.title || "");
            setType(goal.type || "totalTrades");
            setTarget(
                goal.target !== undefined
                    ? String(goal.target)
                    : ""
            );
            setPeriod(goal.period || "thisMonth");
            setStartDate(
                goal.startDate
                    ? goal.startDate.split("T")[0]
                    : ""
            );
            setEndDate(
                goal.endDate
                    ? goal.endDate.split("T")[0]
                    : ""
            );
        } else {
            setTitle("");
            setType("totalTrades");
            setTarget("");
            setPeriod("thisMonth");
            setStartDate("");
            setEndDate("");
        }

        setError("");
    }, [goal]);

    const getTargetPlaceholder = () => {
        if (type === "totalTrades") return "e.g. 50";
        if (type === "totalPnl") return "e.g. 1000";
        if (type === "winRate") return "e.g. 55";
        if (type === "averageRR") return "e.g. 2";

        return "";
    };

    const getTargetHint = () => {
        if (type === "totalTrades") {
            return "Number of trades you want to complete.";
        }

        if (type === "totalPnl") {
            return "Profit target in your account currency.";
        }

        if (type === "winRate") {
            return "Enter your target percentage.";
        }

        if (type === "averageRR") {
            return "Enter your target average R multiple.";
        }

        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!title.trim()) {
            setError("Please enter a goal title.");
            return;
        }

        if (!target || Number(target) <= 0) {
            setError("Target must be greater than zero.");
            return;
        }

        if (period === "custom") {
            if (!startDate || !endDate) {
                setError(
                    "Custom periods require both a start and end date."
                );
                return;
            }

            if (new Date(startDate) >= new Date(endDate)) {
                setError(
                    "Start date must be before the end date."
                );
                return;
            }
        }

        const data = {
            title: title.trim(),
            type,
            target: Number(target),
            period,
            startDate:
                period === "custom"
                    ? startDate
                    : null,
            endDate:
                period === "custom"
                    ? endDate
                    : null,
        };

        try {
            setSubmitting(true);

            if (isEditing) {
                await axiosPrivate.put(
                    `/goals/${goal._id}`,
                    data
                );
            } else {
                await axiosPrivate.post(
                    "/goals",
                    data
                );
            }

            onSaved();
            onClose();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                `Unable to ${isEditing ? "update" : "create"} goal.`
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="goal-modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="goal-modal">

                <div className="goal-modal-header">

                    <div>

                        <h2>
                            {isEditing
                                ? "Edit Goal"
                                : "New Goal"}
                        </h2>

                        <p>
                            {isEditing
                                ? "Update your goal and its target."
                                : "Set a target and let your trades track the progress automatically."}
                        </p>

                    </div>

                    <button
                        type="button"
                        className="goal-modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="goal-form-field">

                        <label>Goal Title</label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            placeholder="e.g. Complete 50 trades"
                            maxLength={100}
                        />

                    </div>

                    <div className="goal-form-row">

                        <div className="goal-form-field">

                            <label>Goal Type</label>

                            <CustomSelect
                                options={goalTypes}
                                value={type}
                                onChange={setType}
                            />

                        </div>

                        <div className="goal-form-field">

                            <label>Target</label>

                            <input
                                type="number"
                                value={target}
                                onChange={(e) =>
                                    setTarget(e.target.value)
                                }
                                placeholder={getTargetPlaceholder()}
                                min="0"
                                step="any"
                            />

                            <small>
                                {getTargetHint()}
                            </small>

                        </div>

                    </div>

                    <div className="goal-form-field goal-period-field">

                        <label>Period</label>

                        <CustomSelect
                            options={periodOptions}
                            value={period}
                            onChange={setPeriod}
                        />

                    </div>

                    {period === "custom" && (
                        <div className="goal-form-row">

                            <div className="goal-form-field">

                                <label>Start Date</label>

                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div className="goal-form-field">

                                <label>End Date</label>

                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) =>
                                        setEndDate(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>
                    )}

                    {error && (
                        <p className="goal-form-error">
                            {error}
                        </p>
                    )}

                    <div className="goal-modal-actions">

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={submitting}
                        >
                            {submitting
                                ? isEditing
                                    ? "Saving..."
                                    : "Creating..."
                                : isEditing
                                    ? "Save Changes"
                                    : "Create Goal"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default GoalModal;