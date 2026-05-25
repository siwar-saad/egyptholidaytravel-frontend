import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api";
import "./ForgotPassword.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email?.trim().toLowerCase();
  const code = location.state?.code?.trim();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !code) {
      setError("Missing email or verification code");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const resetRes = await API.post("/auth/reset-password", {
        email,
        code,
        newPassword: password,
      });

      if (!resetRes.data?.user) {
        throw new Error("Password reset succeeded but login data is missing");
      }

      setShowPopup(true);
    } catch (error) {
      setError(
        error.response?.data?.error ||
        error.message ||
        "Failed to reset password"
      );
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h1>Reset Password</h1>
        <p>Enter your new password.</p>

        <form className="forgot-form" onSubmit={handleReset}>
          <input
            type="password"
            placeholder="New password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <span className="error-text">{error}</span>}

          <button type="submit">Reset Password</button>
        </form>

        <span className="back-login" onClick={() => navigate("/login")}>
          ← Back to Login
        </span>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Password Changed</h3>
            <p>Your password has been reset successfully.</p>
            <button onClick={() => navigate("/profile")}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
