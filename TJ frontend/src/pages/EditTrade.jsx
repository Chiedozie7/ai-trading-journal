import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import TradeForm from "../components/TradeForm";
import tradeFormData from "../data/TradeFormData";
import { API_URL } from "../api/axios";

function EditTrade() {
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(tradeFormData);
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

        try {
            const tradeData = new FormData();

            Object.entries(formData).forEach(
                ([key, value]) => {

                    if (key === "newImages") return;

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
                    message: "Trade updated successfully."
                }
            });

        } catch (err) {
            console.error(err);
        }
    };


    return (
        <>
            <h1>Edit Trade</h1>

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
                submitText="Update Trade"
            />
        </>
    );
}

export default EditTrade;