import "../styles/Tradeform.css";
import { API_URL } from "../api/axios";

function TradeForm({
    formData,
    handleChange,
    handleImageChange,
    handleRemoveImage,
    handleRemoveExistingImage,
    handleOpenPreview,
    handleClosePreview,
    previewImage,
    isPreviewOpen,
    handleSubmit,
    submitText,
}) {

    return (
        <form
            className="trade-form"
            onSubmit={handleSubmit}
        >
            <div className="trade-form-grid">

                <div className="form-field">
                    <label htmlFor="pair">Pair</label>
                    <input
                        id="pair"
                        name="pair"
                        placeholder="e.g. BTCUSDT"
                        value={formData.pair ?? ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="direction">Direction</label>
                    <select
                        id="direction"
                        name="direction"
                        value={formData.direction}
                        onChange={handleChange}
                    >
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="strategy">Strategy</label>
                    <input
                        id="strategy"
                        name="strategy"
                        placeholder="e.g. ICT"
                        value={formData.strategy ?? ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="timeframe">Timeframe</label>
                    <input
                        id="timeframe"
                        name="timeframe"
                        placeholder="e.g. 15m"
                        value={formData.timeframe ?? ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="entryPrice">Entry Price</label>
                    <input
                        id="entryPrice"
                        type="number"
                        name="entryPrice"
                        placeholder="Entry Price"
                        value={formData.entryPrice ?? ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="exitPrice">Exit Price</label>
                    <input
                        id="exitPrice"
                        type="number"
                        name="exitPrice"
                        placeholder="Exit Price"
                        value={formData.exitPrice ?? ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="stopLoss">Stop Loss</label>
                    <input
                        id="stopLoss"
                        type="number"
                        name="stopLoss"
                        placeholder="Stop Loss"
                        value={formData.stopLoss ?? ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="takeProfit">Take Profit</label>
                    <input
                        id="takeProfit"
                        type="number"
                        name="takeProfit"
                        placeholder="Take Profit"
                        value={formData.takeProfit ?? ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="riskPercent">Risk %</label>
                    <input
                        id="riskPercent"
                        type="number"
                        name="riskPercent"
                        value={formData.riskPercent ?? ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="lotSize">Position Size</label>
                    <input
                        id="lotSize"
                        type="number"
                        name="lotSize"
                        placeholder="Optional"
                        value={formData.lotSize ?? ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="pnl">PnL</label>
                    <input
                        id="pnl"
                        type="number"
                        name="pnl"
                        placeholder="Profit / Loss"
                        value={formData.pnl ?? ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="result">Result</label>
                    <select
                        id="result"
                        name="result"
                        value={formData.result ?? ""}
                        onChange={handleChange}
                    >
                        <option value="win">Win</option>
                        <option value="loss">Loss</option>
                        <option value="breakeven">Breakeven</option>
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="tradeDate">Trade Date</label>
                    <input
                        id="tradeDate"
                        type="date"
                        name="tradeDate"
                        value={formData.tradeDate ?? ""}
                        onChange={handleChange}
                    />
                </div>

            </div>

            <div className="form-field">
                <label htmlFor="tags">Tags</label>
                <input
                    id="tags"
                    name="tags"
                    placeholder="Comma separated (e.g. liquidity, ICT, NY session)"
                    value={formData.tags ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="form-field">
                <label htmlFor="notes">Notes</label>
                <textarea
                    id="notes"
                    name="notes"
                    placeholder="Write your trade notes..."
                    value={formData.notes ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="images">Trade Screenshots</label>

                <input
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                />

                {/* Existing screenshots */}

                {formData.existingImages?.length > 0 && (
                    <>
                        <h4>Existing Screenshots</h4>

                        <div className="image-preview-container">
                            {formData.existingImages.map((image, index) => (
                                <div
                                    key={image}
                                    className="image-preview"
                                >
                                    <img
                                        src={`${API_URL}/uploads/screenshots/${image}`}
                                        alt={`Existing ${index + 1}`}
                                        className="clickable-preview"
                                    />

                                    <p>{image}</p>

                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={() =>
                                            handleRemoveExistingImage(index)
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Newly selected screenshots */}

                {formData.newImages?.length > 0 && (
                    <>
                        <h4>New Screenshots</h4>

                        <div className="image-preview-container">
                            {formData.newImages.map((image, index) => (
                                <div
                                    key={`${image.name}-${index}`}
                                    className="image-preview"
                                >
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index + 1}`}
                                        onClick={() => handleOpenPreview(image)}
                                        className="clickable-preview"
                                    />

                                    <p>{image.name}</p>

                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {isPreviewOpen && (
                    <div
                        className="image-modal-overlay"
                        onClick={handleClosePreview}
                    >
                        <div
                            className="image-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                className="close-modal-btn"
                                onClick={handleClosePreview}
                            >
                                ×
                            </button>

                            <img
                                src={previewImage}
                                alt="Full Preview"
                            />
                        </div>
                    </div>
                )}
            </div>

            <button type="submit">
                {submitText}
            </button>
        </form>
    );
}



export default TradeForm;