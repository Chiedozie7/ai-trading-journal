import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrendingUp } from "react-icons/fi";
import axios from "../api/axios";
import "../styles/Auth.css";
import "../styles/Register.css";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }

        try {

            await axios.post("/register", {
                name,
                email,
                password,
            });

            navigate("/login");

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

                    <div className="brand-icon">
                        <FiTrendingUp />
                    </div>

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
                                onChange={(e) => setName(e.target.value)}
                            />

                        </div>

                        <div className="auth-field">

                            <label>Email</label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                        </div>

                        <div className="auth-field">

                            <label>Password</label>

                            <input
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                        </div>

                        <div className="auth-field">

                            <label>Confirm Password</label>

                            <input
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />

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

                </div>

            </section>

        </div>

    );

}

export default Register;