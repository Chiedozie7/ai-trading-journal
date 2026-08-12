import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Area,
} from "recharts";

function EquityCurve({ data }) {
    const isMobile = window.innerWidth < 768;

    if (data.length === 0) {
        return (
            <div className="chart-container">
                <h2>Equity Curve</h2>

                <div className="chart-empty-state">
                    <p>No equity data yet.</p>
                    <p>
                        Your account growth will appear here after you record
                        trades.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h2>Equity Curve</h2>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 10,
                        left: -20,
                        bottom: 30,
                    }}
                >
                    <defs>
                        <linearGradient
                            id="equityGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor="#2563eb"
                                stopOpacity={0.22}
                            />
                            <stop
                                offset="100%"
                                stopColor="#2563eb"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(148,163,184,.25)"
                    />

                    <XAxis
                        dataKey="tradeDate"
                        interval="preserveStartEnd"
                        minTickGap={30}
                        tick={{
                            fontSize: 12,
                            fill: "var(--text-secondary)",
                        }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(date) =>
                            new Date(date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })
                        }
                    />

                    <YAxis
                        tick={{
                            fontSize: 12,
                            fill: "var(--text-secondary)",
                        }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip
                        labelFormatter={(date) =>
                            new Date(date).toLocaleDateString()
                        }
                    />

                    <Area
                        type="basis"
                        dataKey="equity"
                        stroke="none"
                        fill="url(#equityGradient)"
                        fillOpacity={1}
                    />

                    <Line
                        type="basis"
                        dataKey="equity"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{
                            r: 5,
                            fill: "#2563eb",
                            stroke: "#fff",
                            strokeWidth: 2,
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default EquityCurve;