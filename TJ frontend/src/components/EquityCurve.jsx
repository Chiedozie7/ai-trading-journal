import {
    ResponsiveContainer,
    LineChart,
    Line,
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
                    <p>Your account growth will appear here after you record trades.</p>
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
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="tradeDate"
                        interval="preserveStartEnd"
                        minTickGap={30}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(date) =>
                            new Date(date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })
                        }
                    />

                    <YAxis 
                    tick={{ fontSize: 12 }}/>

                    <Tooltip
                        labelFormatter={(date) =>
                            new Date(date).toLocaleDateString()
                        }
                    />

                    <Line
                        type="monotone"
                        dataKey="equity"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default EquityCurve;