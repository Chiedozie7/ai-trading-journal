import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import StatCard from "../components/StatCard";
import "../styles/dashboard.css";
import EquityCurve from "../components/EquityCurve";
import MonthlyPerformance from "../components/MonthlyPerformance";
import RecentTrades from "../components/RecentTrades";
import useAuth from "../hooks/useAuth";
import {
    FiBarChart2,
    FiCheckCircle,
    FiXCircle,
    FiMinusCircle,
    FiPercent,
    FiDollarSign,
    FiActivity,
    FiTrendingUp,
} from "react-icons/fi";


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
                            limit: 4,
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

    const now = new Date();

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const previousDate = new Date(currentYear, now.getMonth() - 1);

    const previousYear = previousDate.getFullYear();
    const previousMonth = previousDate.getMonth() + 1;

    const CurrentMonthlyStats = monthlyStats.find(
        (item) =>
            item.year === currentYear &&
            item.month === currentMonth
    );

    const previousMonthStats = monthlyStats.find(
        (item) =>
            item.year === previousYear &&
            item.month === previousMonth
    );

    /*
     * Percentage difference
     * Used for:
     * Win Rate
     * Total PnL
     * Average PnL
     */
    const getPercentageChange = (current, previous) => {
        if (
            current === undefined ||
            current === null ||
            previous === undefined ||
            previous === null ||
            previous === 0
        ) {
            return null;
        }

        return (
            ((Number(current) - Number(previous)) /
                Math.abs(Number(previous))) *
            100
        );
    };

    /*
     * Actual number difference
     * Used for:
     * Total Trades
     * Wins
     * Losses
     * Break Even
     * Average RR
     */
    const getDifference = (current, previous) => {
        if (
            current === undefined ||
            current === null ||
            previous === undefined ||
            previous === null
        ) {
            return null;
        }

        return Number(current) - Number(previous);
    };

    /*
     * Monthly Win Rate
     */
    const currentWinRate =
        CurrentMonthlyStats?.totalTrades > 0
            ? (CurrentMonthlyStats.wins /
                CurrentMonthlyStats.totalTrades) *
            100
            : null;

    const previousWinRate =
        previousMonthStats?.totalTrades > 0
            ? (previousMonthStats.wins /
                previousMonthStats.totalTrades) *
            100
            : null;

    /*
     * Monthly Average PnL
     */
    const currentAveragePnl =
        CurrentMonthlyStats?.totalTrades > 0
            ? CurrentMonthlyStats.totalPnl /
            CurrentMonthlyStats.totalTrades
            : null;

    const previousAveragePnl =
        previousMonthStats?.totalTrades > 0
            ? previousMonthStats.totalPnl /
            previousMonthStats.totalTrades
            : null;

    /*
     * Number differences
     */
    const totalTradesChange = getDifference(
        CurrentMonthlyStats?.totalTrades,
        previousMonthStats?.totalTrades
    );

    const winsChange = getDifference(
        CurrentMonthlyStats?.wins,
        previousMonthStats?.wins
    );

    const lossesChange = getDifference(
        CurrentMonthlyStats?.losses,
        previousMonthStats?.losses
    );

    const breakevenChange = getDifference(
        CurrentMonthlyStats?.breakeven,
        previousMonthStats?.breakeven
    );

    const averageRRChange = getDifference(
        CurrentMonthlyStats?.averageRR,
        previousMonthStats?.averageRR
    );

    /*
     * Percentage differences
     */
    const winRateChange = getPercentageChange(
        currentWinRate,
        previousWinRate
    );

    const totalPnlChange = getPercentageChange(
        CurrentMonthlyStats?.totalPnl,
        previousMonthStats?.totalPnl
    );

    const averagePnlChange = getPercentageChange(
        currentAveragePnl,
        previousAveragePnl
    );
    

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

                    <div className="hero-chart-decoration">
                        <svg
                            viewBox="0 0 500 160"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <defs>
                                <linearGradient
                                    id="heroChartFade"
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="var(--primary-btn-bg)"
                                        stopOpacity="0.06"
                                    />

                                    <stop
                                        offset="100%"
                                        stopColor="var(--primary-btn-bg)"
                                        stopOpacity="0.2"
                                    />
                                </linearGradient>

                                <filter id="heroChartGlow">
                                    <feGaussianBlur
                                        stdDeviation="5"
                                        result="blur"
                                    />

                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Glow */}
                            <path
                                d="
                M0 135
                L55 135
                L90 100
                L125 118
                L165 65
                L205 92
                L250 42
                L290 70
                L335 28
                L375 58
                L420 20
                L455 42
                L500 8
            "
                                fill="none"
                                stroke="var(--primary-btn-bg)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity=".01"
                                filter="url(#heroChartGlow)"
                            />

                            {/* Main structure */}
                            <path
                                d="
                M0 135
                L55 135
                L90 100
                L125 118
                L165 65
                L205 92
                L250 42
                L290 70
                L335 28
                L375 58
                L420 20
                L455 42
                L500 8
            "
                                fill="none"
                                stroke="url(#heroChartFade)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </section>
                <div className="stats-grid">

                    <StatCard
                        title="Total Trades"
                        value={stats.totalTrades}
                        icon={FiBarChart2}
                        change={totalTradesChange}
                        changeType="number"
                        changeColor="neutral"
                    />

                    <StatCard
                        title="Wins"
                        value={stats.wins}
                        icon={FiCheckCircle}
                        change={winsChange}
                        changeType="number"
                        changeColor="performance"
                        favorableDirection="up"
                    />

                    <StatCard
                        title="Losses"
                        value={stats.losses}
                        icon={FiXCircle}
                        change={lossesChange}
                        changeType="number"
                        changeColor="performance"
                        favorableDirection="down"
                    />

                    <StatCard
                        title="Break Even"
                        value={stats.breakeven}
                        icon={FiMinusCircle}
                        change={breakevenChange}
                        changeType="number"
                        changeColor="neutral"
                    />

                    <StatCard
                        title="Win Rate"
                        value={`${Number(stats.winRate).toFixed(2)}%`}
                        icon={FiPercent}
                        change={winRateChange}
                        changeType="percentage"
                        changeColor="performance"
                        favorableDirection="up"
                    />

                    <StatCard
                        title="Total PnL"
                        value={Number(stats.totalPnl).toFixed(2)}
                        icon={FiDollarSign}
                        change={totalPnlChange}
                        changeType="percentage"
                        changeColor="performance"
                        favorableDirection="up"
                    />

                    <StatCard
                        title="Average PnL"
                        value={Number(stats.averagePnl).toFixed(2)}
                        icon={FiActivity}
                        change={averagePnlChange}
                        changeType="percentage"
                        changeColor="performance"
                        favorableDirection="up"
                    />

                    <StatCard
                        title="Average RR"
                        value={`${Number(stats.averageRR).toFixed(2)}R`}
                        icon={FiTrendingUp}
                        change={averageRRChange}
                        changeType="rr"
                        changeColor="performance"
                        favorableDirection="up"
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