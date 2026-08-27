import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
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
                <AreaChart
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
                                stopOpacity={0.18}
                            />

                            <stop
                                offset="55%"
                                stopColor="#2563eb"
                                stopOpacity={0.07}
                            />

                            <stop
                                offset="100%"
                                stopColor="#2563eb"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="4 5"
                        stroke="rgba(148,163,184,.22)"
                        vertical={false}
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
                        content={({ active, payload, label }) => {
                            if (!active || !payload?.length) {
                                return null;
                            }

                            return (
                                <div
                                    style={{
                                        backgroundColor: "var(--card-bg)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "8px",
                                        padding: isMobile
                                            ? "6px 8px"
                                            : "8px 10px",
                                        fontSize: isMobile
                                            ? "11px"
                                            : "13px",
                                        boxShadow:
                                            "0 8px 20px rgba(15,23,42,.08)",
                                    }}
                                >
                                    <div
                                        style={{
                                            color: "var(--text)",
                                            fontWeight: 600,
                                            marginBottom: "3px",
                                        }}
                                    >
                                        {new Date(label).toLocaleDateString()}
                                    </div>

                                    <div
                                        style={{
                                            color: "#2563eb",
                                            fontWeight: 600,
                                        }}
                                    >
                                        $
                                        {Number(
                                            payload[0].value
                                        ).toFixed(2)}
                                    </div>
                                </div>
                            );
                        }}
                    />

                    <Area
                        type="monotone"
                        dataKey="equity"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        fill="url(#equityGradient)"
                        fillOpacity={1}
                        dot={false}
                        activeDot={{
                            r: 4,
                            fill: "#2563eb",
                            stroke: "var(--card-bg)",
                            strokeWidth: 2,
                        }}
                    />

                </AreaChart>
            </ResponsiveContainer>

        </div>
    );
}

export default EquityCurve;