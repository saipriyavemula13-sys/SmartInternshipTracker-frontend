import { useState } from "react";
import api from "./api";
import "./App.css";
function Register({ onShowLogin }) {
  


  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    setMessage("");
    setIsSuccess(false);
    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", {
        fullName,
        email,
        password
      });

      setMessage(response.data.message || "Account created successfully!");
      setIsSuccess(true);
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please check your backend."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app register-page">
      <div className="brand-icon">✦</div>

      <p className="eyebrow">SMART INTERNSHIP TRACKER</p>

      <h1>Create your account</h1>

      <p className="subtitle">
        Your next opportunity starts here.
        <br />
        Organize applications and track your progress.
      </p>

      <form className="internship-form" onSubmit={handleRegister}>
        <label htmlFor="fullName">Full name</label>
        <input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          maxLength={100}
          autoComplete="name"
          required
        />

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="password">Password</label>

        <div className="password-wrapper">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <button
            className="password-toggle"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <p className="helper-text">
          Use at least 8 characters for your password.
        </p>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account →"}
        </button>
      </form>

      {message && (
        <p
          className={isSuccess ? "success-message" : "error-message"}
          role="status"
        >
          {message}
        </p>
      )}

      <p className="login-prompt">
        Already have an account?{" "}
        

<button
  type="button"
  className="text-link"
  onClick={onShowLogin}
>
  Login
</button>
      </p>

      <p className="footer-text">
        © 2026 Smart Internship Tracker
      </p>
    </div>
  );
}

export default Register;