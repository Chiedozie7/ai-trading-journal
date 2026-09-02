import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import TradeForm from "../components/TradeForm";
import TradeFormData from "../data/TradeFormData";
import usePreferences from "../hooks/usePreferences";

function CreateTrade() {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const { preferences } = usePreferences();

    const [formData, setFormData] = useState({
        ...TradeFormData,
        riskPercent: preferences.trading.defaultRisk,
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

    const handleOpenPreview = (image) => {
        setPreviewImage(URL.createObjectURL(image));
        setIsPreviewOpen(true);
    };

    const handleClosePreview = () => {
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }

        setPreviewImage(null);
        setIsPreviewOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const tradeData = new FormData();

            const pnl = Number(formData.pnl);

            const normalizedPnl =
                formData.result === "loss"
                    ? -Math.abs(pnl)
                    : formData.result === "win"
                        ? Math.abs(pnl)
                        : 0;

            Object.entries(formData).forEach(([key, value]) => {
                if (
                    key === "existingImages" ||
                    key === "newImages"
                ) {
                    return;
                }

                if (key === "pnl") return;

                if (key === "tags") {
                    value
                        .split(",")
                        .map(tag => tag.trim())
                        .filter(Boolean)
                        .forEach(tag =>
                            tradeData.append("tags", tag)
                        );
                } else {
                    tradeData.append(key, value);
                }
            });

            tradeData.append("pnl", normalizedPnl);

            formData.newImages.forEach((image) => {
                tradeData.append("images", image);
            });

            await axiosPrivate.post(
                "/trades",
                tradeData
            );

            navigate("/trades", {
                state: {
                    message: "Trade created successfully."
                }
            });

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Create Trade</h1>

            <TradeForm
                formData={formData}
                handleChange={handleChange}
                handleImageChange={handleImageChange}
                handleRemoveImage={handleRemoveImage}
                handleOpenPreview={handleOpenPreview}
                handleClosePreview={handleClosePreview}
                previewImage={previewImage}
                isPreviewOpen={isPreviewOpen}
                handleSubmit={handleSubmit}
                submitText="Create Trade"
            />
        </div>
    );
}

export default CreateTrade;