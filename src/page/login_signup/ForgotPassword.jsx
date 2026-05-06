import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const startResendTimer = () => {
    setCanResend(false);
    setTimeout(() => setCanResend(true), 5000);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/auth/forgot-password", { email });

      setShowCode(true);
      startResendTimer();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to send code");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/auth/verify-reset-code", {
        email,
        code,
      });

      navigate("/reset-password", {
        state: { email, code },
      });
    } catch (error) {
      setError(error.response?.data?.error || "Invalid code. Please try again.");
    }
  };

  const handleResend = async () => {
    setError("");

    try {
      await API.post("/auth/forgot-password", { email });

      setShowPopup(true);
      startResendTimer();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to resend code");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h1>Forgot Password</h1>
        <p>Enter your email and we will send you a verification code.</p>

        <form className="forgot-form" onSubmit={handleSend}>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={showCode}
          />

          {!showCode && <button type="submit">Send Code</button>}
        </form>

        {showCode && (
          <form className="forgot-form code-box" onSubmit={handleVerify}>
            <input
              type="text"
              placeholder="Enter verification code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            {error && <span className="error-text">{error}</span>}

            <button type="submit">Verify Code</button>

            <p className="resend-text">
              Didn’t receive the code?{" "}
              <span
                className={canResend ? "active" : "disabled"}
                onClick={canResend ? handleResend : undefined}
              >
                Resend code
              </span>
            </p>
          </form>
        )}

        {!showCode && error && <span className="error-text">{error}</span>}

        <span className="back-login" onClick={() => navigate("/login")}>
          ← Back to Login
        </span>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Code Sent</h3>
            <p>A new verification code has been sent to your email.</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}