import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import StatCard from "../components/StatCard";
import "../styles/dashboard.css";
import EquityCurve from "../components/EquityCurve";
import MonthlyPerformance from "../components/MonthlyPerformance";
import RecentTrades from "../components/RecentTrades";
import useAuth from "../hooks/useAuth";

function Dashboard() {

    const { auth } = useAuth();

    const username = auth?.user?.username || "Trader";

    const hour = new Date().getHours();
    let greeting = "Good evening";

    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 18) {
        greeting = "Good afternoon";
    }
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
    const currentDate = new Date();

    const currentMonthStats = monthlyStats.find(
        item =>
            item.year === currentDate.getFullYear() &&
            item.month === currentDate.getMonth() + 1
    );

    const monthlyPnl = currentMonthStats?.totalPnl || 0;
    const isProfit = monthlyPnl > 0;
    const isLoss = monthlyPnl < 0;

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
                    averageRR: 0,
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
                <section className="dashboard-hero">

                    <div className="dashboard-hero-content">

                        <h1>
                            {greeting}, <span>{username}</span> 👋
                        </h1>

                        <p
                            className={`dashboard-hero-performance ${isProfit ? "profit" : isLoss ? "loss" : "breakeven"
                                }`}
                        >
                            {isProfit && "You're up "}
                            {isLoss && "You're down "}
                            {!isProfit && !isLoss && "You're at break even at "}

                            <strong>
                                ${Math.abs(Number(monthlyPnl)).toFixed(2)}
                            </strong>

                            {" "}this month.
                        </p>

                        <p className="dashboard-hero-message">
                            {isProfit
                                ? "Keep executing your plan."
                                : isLoss
                                    ? "Review your trades and refine your plan."
                                    : "Stay patient and wait for your setups."
                            }
                        </p>

                    </div>

                    <a href="/create-trade" className="dashboard-hero-btn">
                        + Log Trade
                    </a>

                </section>
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
                        title="Average RR"
                        value={stats.averageRR != null
                            ? `${Number(stats.averageRR).toFixed(2)}R`
                            : "—"
                        }
                    />

                    <StatCard
                        title="Average PnL"
                        value={Number(stats.averagePnl).toFixed(2)}
                    />

                </div>

                <div className="dashboard-bottom-grid">

                    <div className="dashboard-card">
                        <RecentTrades trades={recentTrades} />
                    </div>

                    <div className="dashboard-card">
                        <MonthlyPerformance data={monthlyStats} />
                    </div>

                </div>
                <div className="dashboard-card">
                    <EquityCurve data={equityCurve} />
                </div>

            </>
        </div>
    );
}

export default Dashboard;