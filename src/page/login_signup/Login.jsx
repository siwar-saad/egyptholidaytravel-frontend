import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

import API from "../../api";
import { setRuntimeAuthUser } from "../../utils/authStorage";
import useRedirectIfLoggedIn from "../../hooks/useRedirectIfLoggedIn";
import "./Login.css";

import Navbar from "../../components/navbar";

import queenImage from "../../assets/image/login.png";
import pyramidIcon from "../../assets/image/pyramid.webp";
import passportIcon from "../../assets/image/passport.webp";
import visaIcon from "../../assets/image/visa.webp";

const EMPTY_MESSAGE = {
  message: "",
  type: "error",
  isVerification: false,
};

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [authMessage, setAuthMessage] = useState(EMPTY_MESSAGE);
  const [loading, setLoading] = useState(false);
  useRedirectIfLoggedIn();

  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const postWithFallback = async (requests) => {
    let lastError = null;

    for (const request of requests) {
      try {
        return await API.post(request.url, request.data, {
          skipAuthRedirect: true,
        });
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError;
  };

  const isEmailVerificationError = (message, data = {}) => {
    const text = String(message || "").toLowerCase();
    const code = String(
      data.code || data.errorCode || data.reason || data.type || ""
    ).toLowerCase();

    return (
      code.includes("email_not_verified") ||
      code.includes("not_verified") ||
      (text.includes("verify") && text.includes("email")) ||
      (text.includes("verified") && text.includes("email"))
    );
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setAuthMessage(EMPTY_MESSAGE);
  };

  const resendVerificationCode = async (emailValue) => {
    const cleanEmail = String(emailValue || "").trim();

    if (!cleanEmail) {
      setVerificationError("Please write your email first.");
      return;
    }

    try {
      setResendLoading(true);
      setVerificationError("");
      setVerificationMessage("");

      await postWithFallback([
        {
          url: "/auth/resend-verification-code",
          data: { email: cleanEmail },
        },
      ]);

      setVerificationMessage(
        "A new verification code has been sent to your email."
      );
    } catch (err) {
      console.log("Resend verification error:", err.response?.data || err.message);

      const serverError =
        err.response?.data?.message || err.response?.data?.error;
      const serverCode = err.response?.data?.code;

      setVerificationError(
        serverError
          ? serverCode
            ? `${serverError} (${serverCode})`
            : serverError
          : err.response
          ? "The backend returned an error without details."
          : "The backend is not reachable. Please check that the server is running on port 3000."
      );
    } finally {
      setResendLoading(false);
    }
  };

  const openVerificationPopup = async () => {
    const emailToVerify = form.email.trim() || verificationEmail.trim();

    if (!emailToVerify) {
      setAuthMessage({
        message: "Please write your email first.",
        type: "error",
        isVerification: false,
      });
      return;
    }

    setVerificationEmail(emailToVerify);
    setVerificationCode("");
    setVerificationMessage("");
    setVerificationError("");
    setShowVerifyPopup(true);

    await resendVerificationCode(emailToVerify);
  };

  const closeVerificationPopup = () => {
    setShowVerifyPopup(false);
    setVerificationCode("");
    setVerificationMessage("");
    setVerificationError("");
  };

  const verifyEmailCode = async () => {
    const cleanEmail = verificationEmail.trim();
    const cleanCode = verificationCode.trim();

    if (!cleanEmail) {
      setVerificationError("Email is required.");
      return;
    }

    if (!cleanCode) {
      setVerificationError("Please enter the verification code.");
      return;
    }

    try {
      setVerifyLoading(true);
      setVerificationError("");
      setVerificationMessage("");

      await postWithFallback([
        {
          url: "/auth/verify-signup-code",
          data: { email: cleanEmail, code: cleanCode },
        },
      ]);

      setShowVerifyPopup(false);
      setVerificationCode("");
      setVerificationMessage("");
      setVerificationError("");

      setAuthMessage({
        message: "Email verified successfully. You can login now.",
        type: "success",
        isVerification: false,
      });
    } catch (err) {
      console.log("Verify email error:", err.response?.data || err.message);

      setVerificationError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid verification code. Please try again."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setAuthMessage(EMPTY_MESSAGE);

    if (!form.email.trim() || !form.password) {
      setAuthMessage({
        message: "Please enter email and password.",
        type: "error",
        isVerification: false,
      });
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
        rememberMe,
      });

      if (!res.data?.user) {
        setAuthMessage({
          message: "Login failed. User not found.",
          type: "error",
          isVerification: false,
        });
        return;
      }

      const user = res.data.user;
      const storage = rememberMe ? localStorage : sessionStorage;

      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      storage.setItem("user", JSON.stringify(user));
      setRuntimeAuthUser(user);
      window.dispatchEvent(new Event("authChanged"));

      navigate(user.role === "admin" ? "/admin" : "/profile", {
        replace: true,
      });
    } catch (err) {
      console.log("Login error:", err.response?.data || err.message);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Email or password is incorrect.";

      const verificationError = isEmailVerificationError(
        message,
        err.response?.data
      );

      if (verificationError) {
        const emailToVerify = form.email.trim();

        setVerificationEmail(emailToVerify);
        setVerificationCode("");
        setVerificationMessage("");
        setVerificationError("");
        setShowVerifyPopup(true);

        setAuthMessage({
          message: "Please verify your email before login.",
          type: "warning",
          isVerification: true,
        });

        await resendVerificationCode(emailToVerify);
      } else {
        setAuthMessage({
          message,
          type: "error",
          isVerification: false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-left">
            <div className="auth-shape"></div>

            <img
              src={queenImage}
              alt="Egypt Queen"
              loading="lazy"
              className="auth-brand-image"
            />

            <img
              src={pyramidIcon}
              alt="Pyramid"
              loading="lazy"
              className="auth-icon icon-pyramid"
            />

            <img
              src={passportIcon}
              alt="Passport"
              loading="lazy"
              className="auth-icon icon-passport"
            />

            <img
              src={visaIcon}
              alt="Visa"
              loading="lazy"
              className="auth-icon icon-visa"
            />
          </div>

          <div className="auth-right">
            <form className="auth-form" onSubmit={handleLogin}>
              <h2>Log In</h2>

              {authMessage.message && (
                <button
                  type="button"
                  className={`auth-message-line ${authMessage.type} ${
                    authMessage.isVerification ? "clickable" : ""
                  }`}
                  onClick={
                    authMessage.isVerification
                      ? openVerificationPopup
                      : undefined
                  }
                >
                  <div className="auth-message-line-content">
                    <span>{authMessage.message}</span>

                    {authMessage.isVerification && (
                      <small>Verify now</small>
                    )}
                  </div>
                </button>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                {form.password && (
                  <button
                    type="button"
                    className="password-eye"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                )}
              </div>

              <div className="auth-options">
                <div className="remember-box">
                  <label>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember Me
                  </label>
                </div>

                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </button>

              <p className="auth-switch">
                Don&apos;t have an account? <Link to="/signup">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {showVerifyPopup && (
        <EmailVerificationPopup
          email={verificationEmail}
          code={verificationCode}
          setCode={setVerificationCode}
          message={verificationMessage}
          error={verificationError}
          resendLoading={resendLoading}
          verifyLoading={verifyLoading}
          onClose={closeVerificationPopup}
          onResend={() => resendVerificationCode(verificationEmail)}
          onVerify={verifyEmailCode}
        />
      )}
    </>
  );
}

function EmailVerificationPopup({
  email,
  code,
  setCode,
  message,
  error,
  resendLoading,
  verifyLoading,
  onClose,
  onResend,
  onVerify,
}) {
  return (
    <div className="email-verify-overlay">
      <div className="email-verify-popup">
        <button type="button" className="email-verify-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="email-verify-icon">
          <FaEnvelope />
        </div>

        <h2>Verify Your Email</h2>

        <p>
          We sent a new verification code to:
          <strong> {email}</strong>
        </p>

        {message && <div className="email-verify-success">{message}</div>}
        {error && <div className="email-verify-error">{error}</div>}

        <input
          type="text"
          inputMode="numeric"
          placeholder="Enter verification code"
          value={code}
          maxLength={8}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onVerify();
            }
          }}
        />

        <button
          type="button"
          className="email-verify-main-btn"
          onClick={onVerify}
          disabled={verifyLoading}
        >
          {verifyLoading ? "Verifying..." : "Verify Email"}
        </button>

        <button
          type="button"
          className="email-verify-resend-btn"
          onClick={onResend}
          disabled={resendLoading}
        >
          {resendLoading ? "Sending new code..." : "Resend new code"}
        </button>
      </div>
    </div>
  );
}





