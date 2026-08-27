import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CustomSelect from "./CustomSelect";

const periodOptions = [
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "last7", label: "Last 7 Days" },
    { value: "last30", label: "Last 30 Days" },
    { value: "thisYear", label: "This Year" },
    { value: "all", label: "All Time" },
];

function getDateRange(period) {
    const now = new Date();

    const startOfDay = (date) => {
        const result = new Date(date);
        result.setHours(0, 0, 0, 0);
        return result;
    };

    const endOfDay = (date) => {
        const result = new Date(date);
        result.setHours(23, 59, 59, 999);
        return result;
    };

    if (period === "thisMonth") {
        return {
            startDate: startOfDay(
                new Date(now.getFullYear(), now.getMonth(), 1)
            ),
            endDate: endOfDay(now),
        };
    }

    if (period === "lastMonth") {
        return {
            startDate: startOfDay(
                new Date(now.getFullYear(), now.getMonth() - 1, 1)
            ),
            endDate: endOfDay(
                new Date(now.getFullYear(), now.getMonth(), 0)
            ),
        };
    }

    if (period === "last7") {
        const start = new Date(now);
        start.setDate(start.getDate() - 6);

        return {
            startDate: startOfDay(start),
            endDate: endOfDay(now),
        };
    }

    if (period === "last30") {
        const start = new Date(now);
        start.setDate(start.getDate() - 29);

        return {
            startDate: startOfDay(start),
            endDate: endOfDay(now),
        };
    }

    if (period === "thisYear") {
        return {
            startDate: startOfDay(
                new Date(now.getFullYear(), 0, 1)
            ),
            endDate: endOfDay(now),
        };
    }

    return {
        startDate: null,
        endDate: null,
    };
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("default", {
        month: "short",
        day: "numeric",
    });
}

function PnlOverview() {
    const axiosPrivate = useAxiosPrivate();

    const [period, setPeriod] = useState("thisMonth");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPnlOverview = async () => {
            try {
                setLoading(true);

                const { startDate, endDate } = getDateRange(period);

                const response = await axiosPrivate.get(
                    "/dashboard/pnl-overview",
                    {
                        params: {
                            startDate: startDate
                                ? startDate.toISOString()
                                : undefined,
                            endDate: endDate
                                ? endDate.toISOString()
                                : undefined,
                        },
                    }
                );

                setData(response.data);
            } catch (error) {
                console.error(error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPnlOverview();
    }, [period]);

    const chartData = useMemo(() => {
        let runningPnl = 0;

        return data.map((item) => {
            runningPnl += Number(item.dailyPnl || 0);

            return {
                date: item.date,
                pnl: runningPnl,
                dailyPnl: Number(item.dailyPnl || 0),
            };
        });
    }, [data]);

    const totalPnl = chartData.length > 0
        ? chartData[chartData.length - 1].pnl
        : 0;

    const isProfit = totalPnl >= 0;

    const lineColor = isProfit
        ? "#16b98a"
        : "#ef5350";

    const areaColor = isProfit
        ? "rgba(22, 185, 138, 0.10)"
        : "rgba(239, 83, 80, 0.10)";

    return (
        <div
            className={`chart-container pnl-overview ${!loading && chartData.length === 0 ? "pnl-empty" : ""
                }`}
        >

            <div className="chart-header">

                <div className="pnl-overview-title">
                    <h2>PnL Overview</h2>

                    <span
                        className="pnl-info"
                        title="Cumulative profit and loss for the selected period"
                    >
                        i
                    </span>
                </div>

                <div className="pnl-period-select-wrapper">
                    <CustomSelect
                        options={periodOptions}
                        value={period}
                        onChange={setPeriod}
                    />
                </div>

            </div>

            <div
                className={`pnl-overview-total ${totalPnl < 0 ? "negative" : "positive"
                    }`}
            >
                {totalPnl >= 0 ? "+" : "-"}$
                {Math.abs(totalPnl).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
            </div>

            <div className="pnl-overview-chart">

                {loading ? (
                    <div className="chart-empty-state">
                        <p>Loading...</p>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="chart-empty-state">
                        <p>No PnL data for this period.</p>
                    </div>
                ) : (
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 12,
                                right: 8,
                                left: -20,
                                bottom: 0,
                            }}
                        >

                            <defs>
                                <linearGradient
                                    id="pnlAreaGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor={lineColor}
                                        stopOpacity={0.18}
                                    />

                                    <stop
                                        offset="100%"
                                        stopColor={lineColor}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="4 5"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                tick={{
                                    fontSize: 10,
                                }}
                                axisLine={false}
                                tickLine={false}
                                minTickGap={25}
                            />

                            <YAxis
                                tick={{
                                    fontSize: 10,
                                }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) =>
                                    `$${Number(value).toLocaleString()}`
                                }
                            />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor:
                                        "var(--card-bg)",
                                    border:
                                        "1px solid var(--border)",
                                    borderRadius: "8px",
                                    color: "var(--text)",
                                    fontSize: "12px",
                                    padding: "7px 9px",
                                }}
                                labelStyle={{
                                    color: "var(--text)",
                                    fontWeight: 600,
                                    marginBottom: "3px",
                                }}
                                formatter={(value) => [
                                    `${value >= 0 ? "+" : "-"}$${Math.abs(
                                        Number(value)
                                    ).toFixed(2)}`,
                                    "PnL",
                                ]}
                                labelFormatter={(label) =>
                                    formatDate(label)
                                }
                            />

                            <Area
                                type="monotone"
                                dataKey="pnl"
                                stroke={lineColor}
                                strokeWidth={2}
                                fill="url(#pnlAreaGradient)"
                                dot={false}
                                activeDot={{
                                    r: 4,
                                    fill: lineColor,
                                }}
                            />

                        </AreaChart>
                    </ResponsiveContainer>
                )}

            </div>
        </div>
    );
}

export default PnlOverview;