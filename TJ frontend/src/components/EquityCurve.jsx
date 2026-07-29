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

            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="tradeDate"
                        tickFormatter={(date) =>
                            new Date(date).toLocaleDateString()
                        }
                    />

                    <YAxis />

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