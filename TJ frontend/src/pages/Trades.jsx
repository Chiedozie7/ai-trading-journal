import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CreateTrade from "./CreateTrade";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import '../styles/Trades.css';

function Trades() {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const selectedDate = location.state?.selectedDate;



    const [trades, setTrades] = useState([]);
    const [search, setSearch] = useState("");
    const [strategy, setStrategy] = useState("");
    const [timeframe, setTimeframe] = useState("");
    const [result, setResult] = useState("");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tradeDate, setTradeDate] = useState(selectedDate || "");
    const tradeDateObj = tradeDate ? new Date(tradeDate) : null;


    useEffect(() => {
        if (selectedDate) {
            setTradeDate(selectedDate);
            setPage(1);
        }
    }, [selectedDate]);

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const response = await axiosPrivate.get("/trades",
                    {
                        params: {
                            search,
                            strategy,
                            timeframe,
                            result,
                            tradeDate,
                            sort,
                            page,
                        }
                    }
                );
                setTrades(response.data.trades);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTrades();
    }, [search, strategy, timeframe, result, tradeDate, sort, page]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this trade?"
        );

        if (!confirmed) return;

        try {
            await axiosPrivate.delete(`/trades/${id}`);

            const updatedTrades = trades.filter(trade => trade._id !== id);

            setTrades(updatedTrades);

            if (updatedTrades.length === 0 && page > 1) {
                setPage(prev => prev - 1);
            }

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>

            {tradeDate && (


                <button
                    className="back-to-calendar-btn"
                    onClick={() => navigate(
                        `/analytics?tab=calendar&month=${tradeDateObj.getMonth() + 1}&year=${tradeDateObj.getFullYear()}`
                    )
                    }
                >
                    ← Back to Calendar
                </button>
            )
            }
            {
                tradeDate && (
                    <div className="calendar-filter-banner">
                        <span>
                            Showing trades for <strong>{tradeDate}</strong>
                        </span>

                        <button
                            onClick={() => {
                                setTradeDate("");
                                navigate("/trades", { replace: true });
                            }}
                        >
                            Clear
                        </button>
                    </div>
                )
            }

            <input
                type="text"
                placeholder="Search trades"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
            >
                <option value="">All Strategies</option>
                <option value="SMC">SMC</option>
                <option value="ICT">ICT</option>
                <option value="Price Action">Price Action</option>
            </select>

            <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
            >
                <option value="">All Timeframes</option>
                <option value="1m">1m</option>
                <option value="5m">5m</option>
                <option value="15m">15m</option>
                <option value="45m">45m</option>
                <option value="4H">4H</option>
            </select>

            <select
                value={result}
                onChange={(e) => setResult(e.target.value)}
            >
                <option value="">All Results</option>
                <option value="win">Win</option>
                <option value="loss">Loss</option>
                <option value="breakeven">Breakeven</option>
            </select>

            <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
            >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="profit">Highest PnL</option>
                <option value="loss">Lowest PnL</option>
            </select>

            {
                trades.length === 0 ? (
                    <p>No trades found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Pair</th>
                                <th>Dir</th>
                                <th>Strategy</th>
                                <th>TF</th>
                                <th>RR</th>
                                <th>Result</th>
                                <th>PnL</th>
                            </tr>
                        </thead>

                        <tbody>
                            {trades.map((trade) => (
                                <tr
                                    key={trade._id}
                                    onClick={() => navigate(`/trades/${trade._id}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{trade.pair}</td>
                                    <td>{trade.direction}</td>
                                    <td>{trade.strategy}</td>
                                    <td>{trade.timeframe}</td>
                                    <td>{trade.rr}</td>
                                    <td>{trade.result}</td>
                                    <td>{trade.pnl}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
            <button>
                <Link to="/create-trade">
                    Add Trade
                </Link>
            </button>
            <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
            >
                Previous
            </button>

            <span>
                Page {page} of {totalPages}
            </span>

            <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
            >
                Next
            </button>
        </div >
    );
}

export default Trades;