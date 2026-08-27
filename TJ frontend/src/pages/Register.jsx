import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import "../styles/Auth.css";
import "../styles/Register.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [registrationComplete, setRegistrationComplete] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }
        setError("");

        try {

            await axios.post("/register", {
                name,
                email,
                password,
            });

            setRegistrationComplete(true);

        } catch (err) {

            if (err.response) {
                setError(err.response.data?.message || "Registration failed.");
            } else {
                setError("Unable to connect to server.");
            }

        }

    };

    return (

        <div className="auth-page register-page">

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

                    <p>Review. Refine. Repeat.</p>

                </div>

                <div className="auth-principle">

                    <p>
                        Trade the plan.
                        <br />
                        Journal the outcome.
                    </p>

                </div>

            </section>

            <section className="auth-panel">

                <div className="auth-card">

                    {registrationComplete ? (

                        <div className="verification-message">

                            <h2>Check Your Email</h2>

                            <p>
                                We've sent a verification link to:
                            </p>

                            <strong>{email}</strong>

                            <p>
                                Please check your inbox and click the link
                                to verify your TradeLedger account.
                            </p>

                            <Link
                                to="/login"
                                className="primary-btn"
                            >
                                Go to Sign In
                            </Link>

                        </div>

                    ) : (

                        <>

                            <h2>Create Account</h2>

                            <p className="auth-subtitle">
                                Start building better trading habits today.
                            </p>

                            {error && (
                                <p className="auth-error">
                                    {error}
                                </p>
                            )}

                            <form
                                className="auth-form"
                                onSubmit={handleSubmit}
                            >

                                <div className="auth-field">

                                    <label>Name</label>

                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            setError("");
                                        }}
                                    />

                                </div>

                                <div className="auth-field">

                                    <label>Email</label>

                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError("");
                                        }}
                                    />

                                </div>

                                <div className="auth-field">

                                    <label>Password</label>

                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setError("");
                                            }}
                                        />

                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() =>
                                                setShowPassword(prev => !prev)
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>

                                </div>

                                <div className="auth-field">

                                    <label>Confirm Password</label>

                                    <div className="password-input-wrapper">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                setError("");
                                            }}
                                        />

                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() =>
                                                setShowConfirmPassword(prev => !prev)
                                            }
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    className="primary-btn"
                                >
                                    Create Account
                                </button>

                            </form>

                            <p className="auth-footer">
                                Already have an account?{" "}
                                <Link to="/login">
                                    Sign In
                                </Link>
                            </p>

                        </>

                    )}

                </div>

            </section>

        </div>

    );

}

export default Register;