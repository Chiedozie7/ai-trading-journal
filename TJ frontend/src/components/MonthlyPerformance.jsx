import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

function MonthlyPerformance({ data }) {

    if (data.length === 0) {
        return (
            <div className="chart-container">
                <h2>Monthly Performance</h2>

                <div className="chart-empty-state">
                    <p>No monthly data yet.</p>
                    <p>Your monthly performance will appear here after you record trades.</p>
                </div>
            </div>
        );
    }

    const chartData = data.map((item) => ({
        month: new Date(item.year, item.month - 1).toLocaleString("default", {
            month: "short",
            year: "numeric",
        }),
        pnl: item.totalPnl,
    }));

    return (
        <div className="chart-container">
            <h2>Monthly Performance</h2>

            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="pnl"
                        radius={[5, 5, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default MonthlyPerformance;