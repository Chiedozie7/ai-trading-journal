import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { useMemo, useState, useEffect } from "react";

function MonthlyPerformance({ data }) {

    const isMobile = window.innerWidth < 768;

    const availableYears = useMemo(() => {
        return [...new Set(data.map(item => item.year))].sort((a, b) => a - b);
    }, [data]);

    const [selectedYear, setSelectedYear] = useState(null);

    useEffect(() => {
        if (
            availableYears.length > 0 &&
            (selectedYear === null || !availableYears.includes(selectedYear))
        ) {
            setSelectedYear(availableYears[availableYears.length - 1]);
        }
    }, [availableYears, selectedYear]);

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

    if (selectedYear === null) {
        return null;
    }

    const currentIndex = availableYears.indexOf(selectedYear);

    const chartData = Array.from({ length: 12 }, (_, index) => {

        const month = index + 1;

        const record = data.find(
            item =>
                item.year === selectedYear &&
                item.month === month
        );

        return {
            month: new Date(2000, index).toLocaleString("default", {
                month: "short",
            }),
            pnl: record ? record.totalPnl : 0,
        };

    });

    return (
        <div className="chart-container">

            <div className="chart-header">

                <h2>Monthly Performance</h2>

                <div className="chart-year-nav">

                    <button
                        disabled={currentIndex === 0}
                        onClick={() =>
                            setSelectedYear(availableYears[currentIndex - 1])
                        }
                    >
                        ←
                    </button>

                    <span>{selectedYear}</span>

                    <button
                        disabled={currentIndex === availableYears.length - 1}
                        onClick={() =>
                            setSelectedYear(availableYears[currentIndex + 1])
                        }
                    >
                        →
                    </button>

                </div>

            </div>

            <ResponsiveContainer width="100%" height="100%">

                <BarChart
                    data={chartData}
                    margin={{
                        top: 0,
                        right: 10,
                        left: -30,
                        bottom: isMobile ? 45 : 55,
                    }}
                >

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="month"
                        interval={0}
                        tick={{ fontSize: isMobile ? 9 : 12 }}
                        angle={isMobile ? -35 : 0}
                        textAnchor={isMobile ? "end" : "middle"}
                        height={isMobile ? 45 : 30}
                    />

                    <YAxis
                        tick={{ fontSize: 12 }}
                    />

                    <Tooltip/>

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