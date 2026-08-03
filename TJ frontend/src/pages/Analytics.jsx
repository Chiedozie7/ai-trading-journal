import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import StatCard from "../components/StatCard";
import "../styles/analytics.css"
import TradingCalendar from "../components/TradingCalendar";
import CustomSelect from "../components/CustomSelect";

import {
    strategyOptions,
    pairOptions,
    timeframeOptions,
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

    if (!summary) return <h2>Loading...</h2>;

    return (
        <div className="analytics-page">
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
                        options={strategyOptions}
                        value={strategy}
                        onChange={setStrategy}
                    />

                    <CustomSelect
                        options={pairOptions}
                        value={pair}
                        onChange={setPair}
                    />

                    <CustomSelect
                        options={timeframeOptions}
                        value={timeframe}
                        onChange={setTimeframe}
                    />

                    <CustomSelect
                        options={directionOptions}
                        value={direction}
                        onChange={setDirection}
                    />


                    <CustomSelect
                        options={rangeOptions}
                        value={range}
                        onChange={setRange}
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
                                className="analytics-stat-card"
                                title="Total Trades"
                                value={summary.totalTrades}
                            />

                            <StatCard
                                className="analytics-stat-card"
                                title="Win Rate"
                                value={`${summary.winRate}%`}
                            />

                            <StatCard
                                className="analytics-stat-card"
                                title="Profit Factor"
                                value={summary.profitFactor}
                            />

                            <StatCard
                                className="analytics-stat-card"
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
                                value={`${summary.currentStreak.count} ${summary.currentStreak.type}`}
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
                                        {strategyPerformance.map((strategy) => (
                                            <tr key={strategy.strategy}>
                                                <td>{strategy.strategy}</td>
                                                <td>{strategy.totalTrades}</td>
                                                <td>{strategy.wins}</td>
                                                <td>{strategy.breakeven}</td>
                                                <td>{strategy.losses}</td>
                                                <td>{strategy.winRate}%</td>
                                                <td>${strategy.totalPnl}</td>
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
                                        {pairPerformance.map((pair) => (
                                            <tr key={pair.pair}>
                                                <td>{pair.pair}</td>
                                                <td>{pair.totalTrades}</td>
                                                <td>{pair.wins}</td>
                                                <td>{pair.breakeven}</td>
                                                <td>{pair.losses}</td>
                                                <td>{pair.winRate}%</td>
                                                <td>${pair.totalPnl}</td>
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
                                        {timeframePerformance.map((timeframe) => (
                                            <tr key={timeframe.timeframe}>
                                                <td>{timeframe.timeframe}</td>
                                                <td>{timeframe.totalTrades}</td>
                                                <td>{timeframe.wins}</td>
                                                <td>{timeframe.breakeven}</td>
                                                <td>{timeframe.losses}</td>
                                                <td>{timeframe.winRate}%</td>
                                                <td>${timeframe.totalPnl}</td>
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
                            />
                        )}
                    </>
                )}
            </>
        </div>
    );
};

export default Analytics;