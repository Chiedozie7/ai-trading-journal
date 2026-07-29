import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import StatCard from "../components/StatCard";
import "../styles/dashboard.css";
import EquityCurve from "../components/EquityCurve";
import MonthlyPerformance from "../components/MonthlyPerformance";
import RecentTrades from "../components/RecentTrades";

function Dashboard() {
    const axiosPrivate = useAxiosPrivate();

    const [stats, setStats] = useState({
        totalTrades: 0,
        wins: 0,
        losses: 0,
        breakeven: 0,
        winRate: 0,
        totalPnl: 0,
        averagePnl: 0,
    });
    const [equityCurve, setEquityCurve] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [recentTrades, setRecentTrades] = useState([])

    useEffect(() => {
        const getDashboard = async () => {
            try {
                const [
                    statsResponse,
                    curveResponse,
                    monthlyResponse,
                    recentTradesResponse,
                ] = await Promise.all([
                    axiosPrivate.get("/dashboard"),
                    axiosPrivate.get("/dashboard/equity-curve"),
                    axiosPrivate.get("/dashboard/monthly-performance"),
                    axiosPrivate.get("/trades", {
                        params: {
                            limit: 5,
                            sort: "newest",
                        },
                    }),
                ]);
                ;

                setStats(statsResponse.data[0] || {
                    totalTrades: 0,
                    wins: 0,
                    losses: 0,
                    breakeven: 0,
                    winRate: 0,
                    totalPnl: 0,
                    averagePnl: 0,
                });
                setEquityCurve(curveResponse.data);
                setMonthlyStats(monthlyResponse.data);
                setRecentTrades(recentTradesResponse.data.trades);

            } catch (err) {
                console.error(err);
            }
        };
        getDashboard();
    }, []);

    return (
        <div>

            <>
                <div className="stats-grid">

                    <StatCard
                        title="Total Trades"
                        value={stats.totalTrades}
                    />

                    <StatCard
                        title="Wins"
                        value={stats.wins}
                    />

                    <StatCard
                        title="Losses"
                        value={stats.losses}
                    />

                    <StatCard
                        title="Break Even"
                        value={stats.breakeven}
                    />

                    <StatCard
                        title="Win Rate"
                        value={`${Number(stats.winRate).toFixed(2)}%`}
                    />

                    <StatCard
                        title="Total PnL"
                        value={stats.totalPnl}
                    />

                    <StatCard
                        title="Average PnL"
                        value={Number(stats.averagePnl).toFixed(2)}
                    />

                </div>
                <div className="dashboard-card">
                    <RecentTrades trades={recentTrades} />
                </div>
                <div className="dashboard-card">
                    <EquityCurve data={equityCurve} />
                </div>
                <div className="dashboard-card">
                    <MonthlyPerformance data={monthlyStats} />
                </div>

            </>
        </div>
    );
}

export default Dashboard;