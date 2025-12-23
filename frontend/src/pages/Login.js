import { useState } from "react";
import api from "../services/api";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/flights";
    } catch (err) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ✈️ Sky decorations */}
      <div className="auth-sky">
        <span className="auth-plane p1">✈️</span>
        <span className="auth-plane p2">✈️</span>
        <span className="auth-cloud c1">☁️</span>
        <span className="auth-cloud c2">☁️</span>
      </div>

      {/* 🔐 Login Card */}
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back ✈️</h2>
        <p className="auth-subtitle">
          Login to continue your journey
        </p>

        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
        />

        <button
          className="auth-btn"
          onClick={login}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-footer">
          New user?{" "}
          <span onClick={() => (window.location.href = "/signup")}>
            Signup here
          </span>
        </p>
      </div>
    </div>
  );
}
