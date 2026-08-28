import { API_URL } from "../api/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import "../styles/tradeDetails.css";


function TradeDetails() {
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();

    const [trade, setTrade] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const getTrade = async () => {
            try {
                const response = await axiosPrivate.get(`/trades/${id}`);
                setTrade(response.data);
            } catch (err) {
                console.error(err);
            }

        };

        getTrade();
    }, [id]);

    if (!trade) {
        return <p>Loading...</p>;
    }

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this trade?"
        );

        if (!confirmed) return;

        try {
            await axiosPrivate.delete(`/trades/${trade._id}`);

            navigate("/trades");
        } catch (err) {
            console.error(err);
        }
    };

    const tags = trade.tags?.filter(Boolean) || [];

    return (

        <div className="trade-details-container">
            <div className="trade-header">
                <h1>{trade.pair?.trim().toUpperCase()}</h1>

                <p className="trade-subtitle">
                    {trade.direction.toUpperCase()} • {trade.strategy} • {trade.timeframe}
                </p>

                <div className="trade-result">
                    <span
                        className={`result-badge ${trade.result?.toLowerCase() === "win"
                            ? "win"
                            : trade.result?.toLowerCase() === "loss"
                                ? "loss"
                                : "breakeven"
                            }`}
                    >
                        {trade.result.toUpperCase()}
                    </span>

                    <span
                        className={`trade-pnl ${trade.result?.toLowerCase() === "win"
                            ? "pnl-win"
                            : trade.result?.toLowerCase() === "loss"
                                ? "pnl-loss"
                                : ""
                            }`}
                    >
                        {Number(trade.pnl) > 0 ? "+" : Number(trade.pnl) < 0 ? "-" : ""}
                        ${Math.abs(Number(trade.pnl)).toFixed(2)}
                    </span>
                </div>
            </div>



            <div className="details-card">
                <div className="trade-info-grid">
                    <div className="info-item">
                        <span className="label">Direction</span>
                        <span>{trade.direction?.charAt(0).toUpperCase() + trade.direction?.slice(1).toLowerCase()}</span>
                    </div>

                    <div className="info-item">
                        <span className="label">Entry</span>
                        <span>{trade.entryPrice}</span>
                    </div>

                    <div className="info-item">
                        <span className="label">Strategy</span>
                        <span>{trade.strategy}</span>
                    </div>

                    <div className="info-item">
                        <span className="label">Exit</span>
                        <span>{trade.exitPrice}</span>
                    </div>

                    <div className="info-item">
                        <span className="label">Timeframe</span>
                        <span>{trade.timeframe}</span>
                    </div>

                    <div className="info-item">
                        <span className="label">RR</span>
                        <span>{trade.rr}</span>
                    </div>

                    <div className="info-item">
                        <span className="label">Trade Date</span>
                        <span>{new Date(trade.tradeDate).toLocaleDateString()}</span>
                    </div>

                    <div className="info-item">
                        <span className="label">Risk %</span>
                        <span>{trade.riskPercent}</span>
                    </div>
                </div>
            </div>


            <div className="details-card">
                <div className="info-item">
                    <span className="label">Tags</span>
                    {tags.length > 0 ? (
                        <div>
                            {tags.map((tag, index) => (
                                <span key={tag}>
                                    {tag}
                                    {index < tags.length - 1 && ", "}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p>No tags</p>
                    )}
                </div>
            </div>

            <div className="details-card">
                <div className="info-item">
                    <span className="label">Notes</span>
                    <span>{trade.notes || "No notes"}</span>
                </div>
            </div>

            <div className="details-card">
                <div className="info-item">
                    <span className="label">Screenshots</span>

                    {trade.images?.length > 0 ? (
                        <div className="trade-images-grid">
                            {trade.images.map((image) => {
                                const imageUrl = image.startsWith("http")
                                    ? image
                                    : `${API_URL}/uploads/screenshots/${image}`;

                                return (
                                    <img
                                        key={image}
                                        src={imageUrl}
                                        alt="Trade Screenshot"
                                        className="trade-image"
                                        onClick={() =>
                                            setSelectedImage(imageUrl)
                                        }
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <p>No screenshots uploaded.</p>
                    )}
                </div>
            </div>


            <div className="action-buttons">
                <button
                    onClick={() => navigate(`/edit-trade/${trade._id}`)}
                >
                    Edit Trade
                </button>

                <button
                    onClick={handleDelete}
                >
                    Delete Trade
                </button>
            </div>

            {selectedImage && (
                <div
                    className="image-modal-overlay"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="image-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="close-modal-btn"
                            onClick={() => setSelectedImage(null)}
                        >
                            ×
                        </button>

                        <img
                            src={selectedImage}
                            alt="Trade Screenshot"
                        />
                    </div>
                </div>
            )}
        </div>


    );
}

export default TradeDetails;