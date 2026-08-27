import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "../api/axios";
import "../styles/Auth.css";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

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
            setError(
                error.response?.data?.message ||
                "Something went wrong."
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

                    <h2>Reset Password</h2>

                    <p className="auth-subtitle">
                        Enter a new password for your account.
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

                            <label>New Password</label>

                            <div className="password-input-wrapper">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            prev => !prev
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword
                                        ? <FiEyeOff />
                                        : <FiEye />
                                    }
                                </button>

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="primary-btn"
                        >
                            Reset Password
                        </button>

                    </form>

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

export default ResetPassword;