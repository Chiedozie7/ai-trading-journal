import { useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { FiTrendingUp } from "react-icons/fi";
import "../styles/Login.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const response = await axios.post("/forgot-password", {
                email,
            });

            setMessage(response.data.message);
            setEmail("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        }
    };

    return (
        <div className="auth-page">

            <section className="auth-showcase">

                <div className="auth-brand">

                    <img
                        src="/images/tradeledger-logo.png"
                        alt="TradeLedger"
                        className="auth-logo"
                    />

                    <h1 className="brand-title">
                        Trade<span>Ledger</span>
                    </h1>

                    <p className="brand-tagline">
                        Review. Refine. Repeat.
                    </p>

                </div>

                <div className="auth-principle">

                    <div className="principle-bar"></div>

                    <p>
                        The best traders don't trust memory.
                        <br />
                        They trust data.
                    </p>

                </div>

            </section>

            <section className="auth-panel">

                <div className="auth-card">

                    <h2>Forgot Password?</h2>

                    <p className="auth-subtitle">
                        Enter your email and we'll send you a
                        password reset link.
                    </p>

                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="auth-success">
                            {message}
                        </p>
                    )}

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="auth-field">

                            <label>Email</label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="primary-btn"
                        >
                            Send Reset Link
                        </button>

                    </form>

                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    <p className="auth-footer">

                        Remember your password?{" "}

                        <Link to="/">
                            Sign In
                        </Link>

                    </p>

                </div>

            </section>

        </div>
    );
};

export default ForgotPassword;