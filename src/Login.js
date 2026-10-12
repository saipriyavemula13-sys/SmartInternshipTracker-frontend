
import { useState } from "react";
import api from "./api";

function Login({ onShowRegister, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });

      // Save the token for API requests in later steps.
      sessionStorage.setItem("token", response.data.token);

      setMessage(response.data.message);
      onLoginSuccess(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Login failed. Please check your backend."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app register-page">
      <div className="brand-icon">✦</div>

      <p className="eyebrow">SMART INTERNSHIP TRACKER</p>

      <h1>Welcome back!</h1>

      <p className="subtitle">
        Sign in to continue your internship journey.
        <br />
        Your career progress is waiting for you.
      </p>

      <form className="internship-form" onSubmit={handleLogin}>
        <label htmlFor="login-email">Email address</label>

        <input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="login-password">Password</label>

        <div className="password-wrapper">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button
            className="password-toggle"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Login →"}
        </button>
      </form>

      {message && (
        <p
          className={
            message === "Login successful!"
              ? "success-message"
              : "error-message"
          }
          role="status"
        >
          {message}
        </p>
      )}

      <p className="login-prompt">
        Don't have an account?{" "}
        <button
          type="button"
          className="text-link"
          onClick={onShowRegister}
        >
          Create account
        </button>
      </p>

      <p className="footer-text">
        © 2026 Smart Internship Tracker
      </p>
    </div>
  );
}

export default Login;