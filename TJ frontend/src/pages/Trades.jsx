import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CreateTrade from "./CreateTrade";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import '../styles/Trades.css';
import CustomSelect from "../components/CustomSelect";
import {
    strategyOptions,
    timeframeOptions,
    resultOptions,
    sortOptions,
} from "../data/tradeFilterOptions";
import ScrollableTable from "../components/ScrollableTable";

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
        <div className="trades-page">

            {tradeDate && (


                <button
                    className="back-to-calendar-btn"
                    onClick={() => {

                        const from = location.state?.from || "/analytics?tab=calendar";
                        const [pathname, query = ""] = from.split("?");
                        const params = new URLSearchParams(query);
                        params.set("month", tradeDateObj.getMonth() + 1);
                        params.set("year", tradeDateObj.getFullYear());
                        navigate(`${pathname}?${params.toString()}`);
                    }}
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

            <div className="trades-toolbar">

                <input
                    type="text"
                    placeholder="Search trades"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <CustomSelect
                    options={strategyOptions}
                    value={strategy}
                    onChange={setStrategy}
                    className="filter"
                />
                <CustomSelect
                    options={timeframeOptions}
                    value={timeframe}
                    onChange={setTimeframe}
                    className="filter"
                />

                <CustomSelect
                    options={resultOptions}
                    value={result}
                    onChange={setResult}
                    className="filter"
                />

                <CustomSelect
                    options={sortOptions}
                    value={sort}
                    onChange={setSort}
                    className="filter"
                />
            </div>

            {
                trades.length === 0 ? (
                    <div className="trades-empty">
                        <h3>No trades found</h3>

                        <p>Try adjusting your filters or add your first trade.</p>
                    </div>
                ) : (
                    <ScrollableTable>
                        <div className="trades-table-wrapper">
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
                        </div>
                    </ScrollableTable>
                )
            }
            <Link
                to="/create-trade"
                className="primary-btn add-trade-btn"
            >
                Add Trade
            </Link>
            <div className="pagination">
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
            </div>
        </div >
    );
}

export default Trades;