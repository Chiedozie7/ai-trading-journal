import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { FiTrendingUp } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import "../styles/Login.css";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("API URL:", import.meta.env.VITE_API_URL);
    console.log("Sending login request...");

    try {
      const response = await axios.post(
        "/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      setAuth({
        user: response.data.user,
        accessToken: response.data.accessToken,
      });

      setEmail("");
      setPassword("");
      setError("");

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      console.log(err.response);
      console.log(err.message);

      if (err.response) {
        setError(`${err.response.status} - ${err.response.data?.message || "Request failed"}`);
      } else {
        setError(err.message);
      }
    }
  };

  return (

    <div className="auth-page">

      <section className="auth-showcase">

        <div className="auth-brand">

          <div className="brand-icon">
            <FiTrendingUp />
          </div>

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

          <h2>Welcome Back</h2>

          <p className="auth-subtitle">
            Sign in to continue.
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

            </div>

            <button
              type="submit"
              className="primary-btn"
            >
              Sign In
            </button>

          </form>

          <Link
            to="/forgot-password"
            className="forgot-password-link"
          >
            Forgot Password?
          </Link>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="auth-footer">

            Don't have an account?{" "}

            <Link to="/register">
              Create one
            </Link>

          </p>

        </div>

      </section>

    </div>

  );
}

export default Login;