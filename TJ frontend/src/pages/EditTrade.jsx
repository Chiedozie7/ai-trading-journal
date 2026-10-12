import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import TradeForm from "../components/TradeForm";
import tradeFormData from "../data/TradeFormData";
import { API_URL } from "../api/axios";

function EditTrade() {
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isOutcomeMode = searchParams.get("mode") === "outcome";

    const [formData, setFormData] = useState(tradeFormData);
    const [error, setError] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        const fetchTrade = async () => {
            try {
                const response = await axiosPrivate.get(
                    `/trades/${id}`
                );

                setFormData({
                    ...tradeFormData,
                    ...response.data,
                    existingImages:
                        response.data.images || [],
                    newImages: [],
                    tags:
                        response.data.tags?.join(", ") || "",
                    tradeDate:
                        response.data.tradeDate
                            ?.split("T")[0] || "",
                    result: response.data.result || "",
                    exitPrice: response.data.exitPrice ?? "",
                });

            } catch (err) {
                console.log(err);
            }
        };

        fetchTrade();
    }, [id, axiosPrivate]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            newImages: Array.from(e.target.files),
        }));
    };

    const handleRemoveImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            newImages: prev.newImages.filter(
                (_, index) => index !== indexToRemove
            ),
        }));
    };

    const handleRemoveExistingImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            existingImages:
                prev.existingImages.filter(
                    (_, index) =>
                        index !== indexToRemove
                ),
        }));
    };

    const handleOpenPreview = (image) => {
        if (image instanceof File) {
            setPreviewImage(
                URL.createObjectURL(image)
            );
        } else {
            setPreviewImage(
                image.startsWith("http")
                    ? image
                    : `${API_URL}/uploads/screenshots/${image}`
            );
        }

        setIsPreviewOpen(true);
    };

    const handleClosePreview = () => {
        if (
            previewImage &&
            previewImage.startsWith("blob:")
        ) {
            URL.revokeObjectURL(previewImage);
        }

        setPreviewImage(null);
        setIsPreviewOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            isOutcomeMode &&
            (!formData.result ||
                !Number.isFinite(Number(formData.exitPrice)) ||
                formData.exitPrice === "" ||
                !Number.isFinite(Number(formData.pnl)) ||
                formData.pnl === "")
        ) {
            setError("Exit price, result, and PnL are required to record the outcome.");
            return;
        }

        setError("");

        try {
            const tradeData = new FormData();

            Object.entries(formData).forEach(
                ([key, value]) => {

                    if (key === "newImages") return;

                    if (isOutcomeMode && key === "pnl") return;

                    if (key === "pantaAnalysis") return;

                    if (key === "pantaTimeline") return;

                    if (key === "existingImages") {
                        value.forEach(image =>
                            tradeData.append(
                                "existingImages",
                                image
                            )
                        );

                        return;
                    }

                    if (key === "tags") {
                        value
                            .split(",")
                            .map(tag => tag.trim())
                            .filter(Boolean)
                            .forEach(tag =>
                                tradeData.append(
                                    "tags",
                                    tag
                                )
                            );
                    } else {
                        if (
                            value !== null &&
                            value !== undefined &&
                            value !== ""
                        ) {
                            tradeData.append(
                                key,
                                value
                            );
                        }
                    }
                }
            );

            if (isOutcomeMode) {
                const pnl = Number(formData.pnl);
                const normalizedPnl =
                    formData.result === "loss"
                        ? -Math.abs(pnl)
                        : formData.result === "win"
                            ? Math.abs(pnl)
                            : 0;

                tradeData.append("pnl", normalizedPnl);
            }

            formData.newImages.forEach(image => {
                tradeData.append("images", image);
            });

            console.log(formData.newImages);

            await axiosPrivate.put(
                `/trades/${id}`,
                tradeData
            );

            navigate(`/trades/${id}`, {
                state: {
                    message: isOutcomeMode
                        ? "Trade outcome recorded successfully."
                        : "Trade updated successfully."
                }
            });

        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className={isOutcomeMode ? "record-outcome-page" : ""}>
            <h1>{isOutcomeMode ? "Record Outcome" : "Edit Trade"}</h1>

            {isOutcomeMode && (
                <p className="record-outcome-intro">
                    Record how this trade closed externally. TradeLedger does not execute or close the position.
                </p>
            )}

            {error && <p className="form-error">{error}</p>}

            <TradeForm
                formData={formData}
                handleChange={handleChange}
                handleImageChange={handleImageChange}
                handleRemoveImage={handleRemoveImage}
                handleRemoveExistingImage={
                    handleRemoveExistingImage
                }
                handleOpenPreview={handleOpenPreview}
                handleClosePreview={handleClosePreview}
                previewImage={previewImage}
                isPreviewOpen={isPreviewOpen}
                handleSubmit={handleSubmit}
                submitText={isOutcomeMode ? "Save Outcome" : "Update Trade"}
                allowOpenTrade={!isOutcomeMode && !formData.result}
                outcomeOnly={isOutcomeMode}
            />
        </div>
    );
}

export default EditTrade;
