import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import StatCard from "../components/StatCard";
import "../styles/analytics.css"
import "../styles/dashboard.css"
import TradingCalendar from "../components/TradingCalendar";
import CustomSelect from "../components/CustomSelect";
import PairIcon from "../components/PairIcon";

import {
    directionOptions,
    rangeOptions,
} from "../data/analyticsFilterOptions";
import ScrollableTable from "../components/ScrollableTable";

const Analytics = () => {
    const [summary, setSummary] = useState(null);
    const [strategyPerformance, setStrategyPerformance] = useState([]);
    const [timeframePerformance, setTimeframePerformance] = useState([]);
    const [pairPerformance, setPairPerformance] = useState([]);
    const [strategy, setStrategy] = useState("");
    const [pair, setPair] = useState("");
    const [availablePairs, setAvailablePairs] = useState([]);
    const [availableStrategies, setAvailableStrategies] = useState([]);
    const [availableTimeframes, setAvailableTimeframes] = useState([]);
    const [timeframe, setTimeframe] = useState("");
    const [direction, setDirection] = useState("");
    const [range, setRange] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [calendarData, setCalendarData] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const changeTab = (tab) => {
        const params = new URLSearchParams(searchParams);

        params.set("tab", tab);

        setSearchParams(params);
    };
    const activeTab = searchParams.get("tab") || "overview";
    const axiosPrivate = useAxiosPrivate();

    const normalizedStrategyPerformance = Object.values(
        strategyPerformance.reduce((acc, item) => {
            const key = item.strategy?.trim().toLowerCase();

            if (!acc[key]) {
                acc[key] = {
                    ...item,
                    strategy: item.strategy?.trim().toUpperCase(),
                };
            } else {
                acc[key].totalTrades += item.totalTrades;
                acc[key].wins += item.wins;
                acc[key].breakeven += item.breakeven;
                acc[key].losses += item.losses;
                acc[key].totalPnl += item.totalPnl;

                acc[key].winRate =
                    acc[key].totalTrades > 0
                        ? Number(
                            (
                                (acc[key].wins / acc[key].totalTrades) *
                                100
                            ).toFixed(2)
                        )
                        : 0;
            }

            return acc;
        }, {})
    ).sort((a, b) => b.totalTrades - a.totalTrades);

    const normalizedPairPerformance = Object.values(
        pairPerformance.reduce((acc, item) => {
            const key = item.pair?.trim().toUpperCase();

            if (!acc[key]) {
                acc[key] = {
                    ...item,
                    pair: key,
                };
            } else {
                acc[key].totalTrades += item.totalTrades;
                acc[key].wins += item.wins;
                acc[key].breakeven += item.breakeven;
                acc[key].losses += item.losses;
                acc[key].totalPnl += item.totalPnl;

                acc[key].winRate =
                    acc[key].totalTrades > 0
                        ? Number(
                            (
                                (acc[key].wins / acc[key].totalTrades) *
                                100
                            ).toFixed(2)
                        )
                        : 0;
            }

            return acc;
        }, {})
    ).sort((a, b) => b.totalTrades - a.totalTrades);

    const dynamicPairOptions = [
        { value: "", label: "All Pairs" },
        ...[
            ...new Set(
                availablePairs
                    .map((item) => item.pair?.trim().toUpperCase())
                    .filter(Boolean)
            ),
        ].map((pair) => ({
            value: pair,
            label: pair,
        })),
    ];

    const dynamicStrategyOptions = [
        { value: "", label: "All Strategies" },
        ...Object.values(
            availableStrategies.reduce((acc, item) => {
                const strategy = item.strategy?.trim();

                if (!strategy) return acc;

                const key = strategy.toLowerCase();

                if (!acc[key]) {
                    acc[key] = strategy.toUpperCase();
                }

                return acc;
            }, {})
        ).map((strategy) => ({
            value: strategy,
            label: strategy,
        })),
    ];

    const dynamicTimeframeOptions = [
        { value: "", label: "All Timeframes" },
        ...[
            ...new Set(
                availableTimeframes
                    .map((item) => item.timeframe?.trim())
                    .filter(Boolean)
            ),
        ].map((timeframe) => ({
            value: timeframe,
            label: timeframe,
        })),
    ];

    const sortedTimeframePerformance = [...timeframePerformance].sort(
        (a, b) => b.totalTrades - a.totalTrades
    );


    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const summaryResponse = await axiosPrivate.get("/analytics/summary", {
                    params: {
                        strategy,
                        pair,
                        timeframe,
                        direction,
                        range,
                        startDate,
                        endDate,
                    }
                });
                setSummary(summaryResponse.data);

                const strategyResponse = await axiosPrivate.get("/analytics/strategy", {
                    params: {
                        strategy,
                        pair,
                        timeframe,
                        direction,
                        range,
                        startDate,
                        endDate,
                    }
                });
                setStrategyPerformance(strategyResponse.data);

                const timeframeResponse = await axiosPrivate.get("/analytics/timeframe", {
                    params: {
                        strategy,
                        pair,
                        timeframe,
                        direction,
                        range,
                        startDate,
                        endDate,
                    }
                });
                setTimeframePerformance(timeframeResponse.data);

                const pairResponse = await axiosPrivate.get("/analytics/pair", {
                    params: {
                        strategy,
                        pair,
                        timeframe,
                        direction,
                        range,
                        startDate,
                        endDate,
                    }
                });
                setPairPerformance(pairResponse.data);

                const calendarResponse = await axiosPrivate.get("/analytics/calendar", {
                    params: {
                        strategy,
                        pair,
                        timeframe,
                        direction,
                        range,
                        startDate,
                        endDate,
                    }
                });


                setCalendarData(calendarResponse.data);


            } catch (error) {
                console.error(error);
            }
        };

        fetchAnalytics();
    }, [strategy, pair, timeframe, direction, range, startDate, endDate]);

    useEffect(() => {
        const fetchAvailableFilters = async () => {
            try {
                const params = {
                    strategy: "",
                    pair: "",
                    timeframe: "",
                    direction: "",
                    range: "all",
                    startDate: "",
                    endDate: "",
                };

                const [pairResponse, strategyResponse, timeframeResponse] =
                    await Promise.all([
                        axiosPrivate.get("/analytics/pair", {
                            params,
                        }),

                        axiosPrivate.get("/analytics/strategy", {
                            params,
                        }),

                        axiosPrivate.get("/analytics/timeframe", {
                            params,
                        }),
                    ]);

                setAvailablePairs(pairResponse.data);
                setAvailableStrategies(strategyResponse.data);
                setAvailableTimeframes(timeframeResponse.data);

            } catch (error) {
                console.error(error);
            }
        };

        fetchAvailableFilters();
    }, []);

    if (!summary) return <h2>Loading...</h2>;

    return (
        <div
            className={`analytics-page ${activeTab === "calendar" ? "calendar-view" : ""
                }`}
        >
            <>

                <div className="analytics-tabs">

                    <button
                        className={activeTab === "overview" ? "active" : ""}
                        onClick={() => changeTab("overview")}
                    >
                        Overview
                    </button>

                    <button
                        className={activeTab === "breakdown" ? "active" : ""}
                        onClick={() => changeTab("breakdown")}
                    >
                        Breakdown
                    </button>

                    <button
                        className={activeTab === "calendar" ? "active" : ""}
                        onClick={() => changeTab("calendar")}
                    >
                        Calendar
                    </button>

                </div>

                <div className="analytics-filters">

                    <CustomSelect
                        options={dynamicStrategyOptions}
                        value={strategy}
                        onChange={setStrategy}
                    />

                    <CustomSelect
                        options={dynamicPairOptions}
                        value={pair}
                        onChange={setPair}
                    />

                    <CustomSelect
                        options={dynamicTimeframeOptions}
                        value={timeframe}
                        onChange={setTimeframe}
                    />
                    <CustomSelect
                        options={rangeOptions}
                        value={range}
                        onChange={setRange}
                    />

                    <CustomSelect
                        options={directionOptions}
                        value={direction}
                        onChange={setDirection}
                    />

                    <div className="custom-date-filters">
                        {range === "custom" && (
                            <>
                                <label>
                                    Start Date:
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </label>

                                <label>
                                    End Date:
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </label>
                            </>
                        )}
                    </div>
                </div>


                {activeTab === "overview" && (
                    <>
                        <section className="analytics-grid">
                            <StatCard
                                className="analytics-stat-card analytics-clean-card"
                                title="Total Trades"
                                value={summary.totalTrades}
                            />

                            <StatCard
                                className="analytics-stat-card analytics-clean-card"
                                title="Win Rate"
                                value={`${summary.winRate}%`}
                            />

                            <StatCard
                                className="analytics-stat-card"
                                title="Profit Factor"
                                value={summary.profitFactor}
                            />

                            <StatCard
                                className="analytics-stat-card analytics-clean-card"
                                title="Average RR"
                                value={`${summary.averageRR}R`}
                            />

                            <StatCard
                                className="analytics-stat-card"
                                title="Expectancy"
                                value={`$${summary.expectancy}`}
                                subtitle="per trade"
                            />

                            <StatCard
                                className="analytics-stat-card"
                                title="Average Winning Trade"
                                value={`$${summary.averageWinningTrade}`}
                            />

                            <StatCard
                                className="analytics-stat-card"
                                title="Average Losing Trade"
                                value={`$${summary.averageLosingTrade}`}
                            />

                            <StatCard
                                className="analytics-stat-card"
                                title="Breakevens"
                                value={summary.breakeven}
                            />
                        </section>

                        <h2>Streaks</h2>

                        <section className="analytics-grid">
                            <StatCard
                                className="analytics-stat-card"
                                title="Current Streak"
                                value={`${summary.currentStreak.count} ${summary.currentStreak.type === "win"
                                        ? summary.currentStreak.count === 1 ? "win" : "wins"
                                        : summary.currentStreak.type === "loss"
                                            ? summary.currentStreak.count === 1 ? "loss" : "losses"
                                            : summary.currentStreak.type
                                    }`}
                            />

                            <StatCard
                                className="analytics-stat-card"
                                title="Longest Win Streak"
                                value={summary.longestWinStreak}
                            />

                            <StatCard
                                className="analytics-stat-card"
                                title="Longest Loss Streak"
                                value={summary.longestLossStreak}
                            />
                        </section>

                        <h2>Trade Records</h2>

                        <section className="analytics-grid">
                            <StatCard
                                className="analytics-stat-card"
                                title="Largest Win"
                                value={`$${summary.largestWin}`}
                            />

                            <StatCard
                                className="analytics-stat-card"
                                title="Largest Loss"
                                value={`$${summary.largestLoss}`}
                            />
                        </section>
                    </>
                )}

                {activeTab === "breakdown" && (
                    <>
                        <h2>Strategy Performance</h2>
                        <ScrollableTable>
                            <div className="analytics-table-container">
                                <table className="analytics-table">
                                    <thead>
                                        <tr>
                                            <th>Strategy</th>
                                            <th>Trades</th>
                                            <th>Wins</th>
                                            <th>Breakeven</th>
                                            <th>Losses</th>
                                            <th>Win Rate</th>
                                            <th>Total PnL</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {normalizedStrategyPerformance.map((strategy) => (
                                            <tr key={strategy.strategy}>
                                                <td>{strategy.strategy}</td>
                                                <td>{strategy.totalTrades}</td>
                                                <td>{strategy.wins}</td>
                                                <td>{strategy.breakeven}</td>
                                                <td>{strategy.losses}</td>
                                                <td>{strategy.winRate}%</td>
                                                <td
                                                    className={
                                                        strategy.totalPnl > 0
                                                            ? "pnl-profit"
                                                            : strategy.totalPnl < 0
                                                                ? "pnl-loss"
                                                                : "pnl-neutral"
                                                    }
                                                >
                                                    ${Number(strategy.totalPnl).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </ScrollableTable>


                        <h2>Pair Performance</h2>
                        <ScrollableTable>
                            <div className="analytics-table-container">
                                <table className="analytics-table">
                                    <thead>
                                        <tr>
                                            <th>Pair</th>
                                            <th>Trades</th>
                                            <th>Wins</th>
                                            <th>Breakeven</th>
                                            <th>Losses</th>
                                            <th>Win Rate</th>
                                            <th>Total PnL</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {normalizedPairPerformance.map((pair) => (
                                            <tr key={pair.pair}>
                                                <td>
                                                    <div className="analytics-pair-display">
                                                        <PairIcon
                                                            pair={pair.pair}
                                                            size={20}
                                                        />
                                                        <span>{pair.pair}</span>
                                                    </div>
                                                </td>
                                                <td>{pair.totalTrades}</td>
                                                <td>{pair.wins}</td>
                                                <td>{pair.breakeven}</td>
                                                <td>{pair.losses}</td>
                                                <td>{pair.winRate}%</td>
                                                <td
                                                    className={
                                                        pair.totalPnl > 0
                                                            ? "pnl-profit"
                                                            : pair.totalPnl < 0
                                                                ? "pnl-loss"
                                                                : "pnl-neutral"
                                                    }
                                                >
                                                    ${Number(pair.totalPnl).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </ScrollableTable>
                        <h2>Timeframe Performance</h2>
                        <ScrollableTable>
                            <div className="analytics-table-container">
                                <table className="analytics-table">
                                    <thead>
                                        <tr>
                                            <th>Timeframe</th>
                                            <th>Trades</th>
                                            <th>Wins</th>
                                            <th>Breakeven</th>
                                            <th>Losses</th>
                                            <th>Win Rate</th>
                                            <th>Total PnL</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {sortedTimeframePerformance.map((timeframe) => (
                                            <tr key={timeframe.timeframe}>
                                                <td>{timeframe.timeframe}</td>
                                                <td>{timeframe.totalTrades}</td>
                                                <td>{timeframe.wins}</td>
                                                <td>{timeframe.breakeven}</td>
                                                <td>{timeframe.losses}</td>
                                                <td>{timeframe.winRate}%</td>
                                                <td
                                                    className={
                                                        timeframe.totalPnl > 0
                                                            ? "pnl-profit"
                                                            : timeframe.totalPnl < 0
                                                                ? "pnl-loss"
                                                                : "pnl-neutral"
                                                    }
                                                >
                                                    ${Number(timeframe.totalPnl).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </ScrollableTable>
                    </>
                )}

                {activeTab === "calendar" && (
                    <>
                        {activeTab === "calendar" && (
                            <TradingCalendar
                                calendarData={calendarData}
                                searchParams={searchParams}
                                setSearchParams={setSearchParams}
                                from="/analytics?tab=calendar"
                            />
                        )}
                    </>
                )}
            </>
        </div>
    );
};

export default Analytics;