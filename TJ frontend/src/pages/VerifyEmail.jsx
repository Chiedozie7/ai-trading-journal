import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../api/axios";
import "../styles/auth.css";

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const verificationStarted = useRef(false);

    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("");

    useEffect(() => {
    if (verificationStarted.current) return;

    verificationStarted.current = true;

    const token = searchParams.get("token");

    if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
    }

    const verifyEmail = async () => {
        try {
            const response = await axios.get(
                `/verify-email?token=${encodeURIComponent(token)}`
            );

            setStatus("success");
            setMessage(
                response.data?.message ||
                "Your email has been verified successfully."
            );

        } catch (err) {
            setStatus("error");

            setMessage(
                err.response?.data?.message ||
                "Unable to verify your email."
            );
        }
    };

    verifyEmail();
}, [searchParams]);

    return (
        <div className="auth-page verify-email-page">

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

            </section>

            <section className="auth-panel">

                <div className="auth-card">

                    {status === "verifying" && (
                        <>
                            <h2>Verifying Email</h2>

                            <p className="auth-subtitle">
                                Please wait while we verify your email address.
                            </p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <h2>Email Verified</h2>

                            <p className="auth-subtitle">
                                {message}
                            </p>

                            <Link
                                to="/login"
                                className="primary-btn verification-successful-btn"
                            >
                                Sign In
                            </Link>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <h2>Verification Failed</h2>

                            <p className="auth-error">
                                {message}
                            </p>

                            <Link
                                to="/login"
                                className="primary-btn"
                            >
                                Go to Sign In
                            </Link>
                        </>
                    )}

                </div>

            </section>

        </div>
    );
}

export default VerifyEmail;