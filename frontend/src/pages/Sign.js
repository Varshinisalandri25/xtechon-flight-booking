import { useState } from "react";
import api from "../services/api";
import "./Auth.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      await api.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      alert("Signup successful ✨ Please login");
      window.location.href = "/";
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-page">
      {/* Sky animation */}
      <div className="auth-sky">
        <span className="auth-plane p1">✈️</span>
        <span className="auth-plane p2">✈️</span>
        <span className="auth-cloud c1">☁️</span>
        <span className="auth-cloud c2">☁️</span>
      </div>

      {/* Signup Card */}
      <div className="auth-card">
        <h2 className="auth-title">Create Account ✨</h2>
        <p className="auth-subtitle">
          Start your journey with us
        </p>

        <input
          className="auth-input"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={signup}>
          Signup
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <span onClick={() => (window.location.href = "/")}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
