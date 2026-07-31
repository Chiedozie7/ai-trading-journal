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
                <input
                    name="pair"
                    placeholder="Pair"
                    value={formData.pair ?? ""}
                    onChange={handleChange}
                />

                <select
                    name="direction"
                    value={formData.direction}
                    onChange={handleChange}
                >
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                </select>

                <input
                    name="strategy"
                    placeholder="Strategy"
                    value={formData.strategy ?? ""}
                    onChange={handleChange}
                />

                <input
                    name="timeframe"
                    placeholder="Timeframe"
                    value={formData.timeframe ?? ""}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="entryPrice"
                    placeholder="Entry Price"
                    value={formData.entryPrice ?? ""}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="exitPrice"
                    placeholder="Exit Price"
                    value={formData.exitPrice ?? ""}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="stopLoss"
                    placeholder="Stop Loss"
                    value={formData.stopLoss ?? ""}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="takeProfit"
                    placeholder="Take Profit"
                    value={formData.takeProfit ?? ""}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="riskPercent"
                    placeholder="Risk %"
                    value={formData.riskPercent ?? ""}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="lotSize"
                    placeholder="Position Size (optional)"
                    value={formData.lotSize ?? ""}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="pnl"
                    placeholder="PnL"
                    value={formData.pnl ?? ""}
                    onChange={handleChange}
                />

                <select
                    name="result"
                    value={formData.result ?? ""}
                    onChange={handleChange}
                >
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                    <option value="breakeven">Breakeven</option>
                </select>

                <input
                    type="date"
                    name="tradeDate"
                    value={formData.tradeDate ?? ""}
                    onChange={handleChange}
                />
            </div>

            <input
                name="tags"
                placeholder="Tags (comma separated)"
                value={formData.tags ?? ""}
                onChange={handleChange}
            />

            <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes ?? ""}
                onChange={handleChange}
            />
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