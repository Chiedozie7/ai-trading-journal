import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/login", {
        email,
        password
      },
        {
          withCredentials: true,
        }
      );

      setAuth({
        user: response.data.user,
        accessToken: response.data.accessToken,
      });
      const payload = JSON.parse(atob(response.data.accessToken.split(".")[1]));

      console.log(payload);

      setEmail("");
      setPassword("");
      setError("");

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "login failed");
    }
  }
  


  return (
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <Link to="/forgot-password">
        Forgot Password?
      </Link>
    </div>
  );
}

export default Login;