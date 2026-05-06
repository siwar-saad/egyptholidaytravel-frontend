import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api";
import "./ForgotPassword.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const code = location.state?.code;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !code) {
      setError("Missing email or code. Please try again.");
      return;
    }

  if (password !== confirm) {
    setError("Passwords do not match");
    return;
  }

    try {
      await API.post("/auth/reset-password", {
        email,
        code,
        newPassword: password,
        confirmPassword: confirm,
      });

      alert("Password changed successfully ✅");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.error || "Reset failed ❌");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h1>Reset Password</h1>

        <form className="forgot-form" onSubmit={handleReset}>
          <input
            type="password"
            placeholder="New Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {error && <span className="error-text">{error}</span>}

          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}