import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../api/axios";
import "../styles/resetPassword.css";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/reset-password", {
                token,
                password,
            });

            setMessage(response.data.message);

            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Something went wrong."
            );
        }
    };

    return (
        <div className="reset-password-container">
            <form
                className="reset-password-form"
                onSubmit={handleSubmit}
            >
                <h2>Reset Password</h2>

                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">
                    Reset Password
                </button>

                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;