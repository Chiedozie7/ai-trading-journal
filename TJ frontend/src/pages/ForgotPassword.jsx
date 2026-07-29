import { useState } from "react";
import axios from "../api/axios";
import "../styles/forgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/forgot-password", {
                email,
            });

            setMessage(response.data.message);
            setEmail("");
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="forgot-password-container">
            <form
                className="forgot-password-form"
                onSubmit={handleSubmit}
            >
                <h2>Forgot Password</h2>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button type="submit">
                    Send Reset Link
                </button>

                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default ForgotPassword;