import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

import API from "../../api";
import useRedirectIfLoggedIn from "../../hooks/useRedirectIfLoggedIn";
import pyramid from "../../assets/image/pyramid.webp";
import passport from "../../assets/image/passport.webp";
import visa from "../../assets/image/visa.webp";
import login from "../../assets/image/login.png";
import Navbar from "../../components/navbar";

const COUNTRIES = [
  { flag: "https://flagcdn.com/fr.svg", name: "France", dialCode: "+33" },
  { flag: "https://flagcdn.com/de.svg", name: "Germany", dialCode: "+49" },
  { flag: "https://flagcdn.com/lu.svg", name: "Luxembourg", dialCode: "+352" },
  { flag: "https://flagcdn.com/tr.svg", name: "Turkey", dialCode: "+90" },
  { flag: "https://flagcdn.com/tn.svg", name: "Tunisia", dialCode: "+216" },
  { flag: "https://flagcdn.com/ma.svg", name: "Morocco", dialCode: "+212" },
  { flag: "https://flagcdn.com/ba.svg", name: "Bosnia", dialCode: "+387" },
  { flag: "https://flagcdn.com/eg.svg", name: "Egypt", dialCode: "+20" },
];

export default function Signup() {
  const navigate = useNavigate();

  const checkingAuth = useRedirectIfLoggedIn();
  const [showSuccess, setShowSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [openCountry, setOpenCountry] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [phone, setPhone] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  const [showCodePopup, setShowCodePopup] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [codeMessage, setCodeMessage] = useState("");

  const chooseCountry = (country) => {
    setSelectedCountry(country);
    setOpenCountry(false);
  };

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return false;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return false;
    }

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your password.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return false;
    }

    return true;
  };

  const getFullPhone = () => `${selectedCountry.dialCode} ${phone.trim()}`;

  const sendVerificationCode = async () => {
    const fullPhone = getFullPhone();

    await API.post("/auth/signup", {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
      confirmPassword,
      phone: fullPhone,
      country: selectedCountry.name,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setCodeError("");
    setCodeMessage("");
    setVerificationCode("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      await sendVerificationCode();

      setPendingEmail(email.trim().toLowerCase());
      setShowCodePopup(true);
      setCodeMessage(
        "We sent a verification code to your email. Please enter it below to activate your account."
      );
    } catch (err) {
      console.log("Send code error:", err.response?.data || err.message);

      const serverError =
        err.response?.data?.message || err.response?.data?.error;
      const serverCode = err.response?.data?.code;

      setError(
        serverError
          ? serverCode
            ? `${serverError} (${serverCode})`
            : serverError
          : err.response
          ? "The backend returned an error without details."
          : "The backend is not reachable. Please check that the server is running on port 3000."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setCodeError("");
    setCodeMessage("");

    if (!verificationCode.trim()) {
      setCodeError("Please enter the verification code.");
      return;
    }

    if (verificationCode.trim().length !== 6) {
      setCodeError("The verification code must contain 6 digits.");
      return;
    }

    try {
      setVerifyLoading(true);

      const response = await API.post("/auth/verify-signup-code", {
        email: pendingEmail || email.trim().toLowerCase(),
        code: verificationCode.trim(),
      });

      if (response.data?.user) {
        sessionStorage.setItem("user", JSON.stringify(response.data.user));

        if (response.data?.token) {
          sessionStorage.setItem("token", response.data.token);
        }
      }

      setShowCodePopup(false);
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch (err) {
      console.log("Verify code error:", err.response?.data || err.message);

      setCodeError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "The verification code is incorrect. Please check your email and try again."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendCode = async () => {
    setCodeError("");
    setCodeMessage("");

    try {
      setVerifyLoading(true);

      await sendVerificationCode();

      setVerificationCode("");
      setCodeMessage("A new verification code has been sent to your email.");
    } catch (err) {
      setCodeError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Could not resend the code. Please try again."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  if (checkingAuth) {
    return null;
  }

  return (
    <div>
      <Navbar />

      <div className="auth-page">
        <div className="auth-card signup-card">
          <div className="auth-left">
            <div className="auth-shape"></div>

            <img
              src={login}
              alt="Egypt Holiday"
              loading="lazy"
              className="auth-brand-image"
            />

            <img
              src={pyramid}
              className="auth-icon icon-pyramid"
              loading="lazy"
              alt="pyramid"
            />

            <img
              src={passport}
              className="auth-icon icon-passport"
              loading="lazy"
              alt="passport"
            />

            <img
              src={visa}
              className="auth-icon icon-visa"
              loading="lazy"
              alt="visa"
            />
          </div>

          <div className="auth-right signup-right">
            <form className="auth-form signup-form" onSubmit={handleSignup}>
              <div className="signup-title-box">
                <h2>Sign Up</h2>

                <p>
                  Create your account and manage your bookings easily with us.
                </p>
              </div>

              <div className="signup-row">
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Last Name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="signup-row">
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {password && (
                    <button
                      type="button"
                      className="password-eye"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  )}
                </div>

                <div className="password-field">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  {confirmPassword && (
                    <button
                      type="button"
                      className="password-eye"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  )}
                </div>
              </div>

              <div className="phone-field">
                <div
                  className={`custom-country ${openCountry ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="custom-country-btn"
                    onClick={() => setOpenCountry(!openCountry)}
                  >
                    <div className="country-left">
                      <img
                        src={selectedCountry.flag}
                        alt={selectedCountry.name}
                        loading="lazy"
                        className="country-flag"
                      />

                      <div className="country-text">
                        <small>Country</small>
                        <strong>{selectedCountry.name}</strong>
                      </div>
                    </div>

                    <div className="country-right">
                      <FaChevronDown />
                    </div>
                  </button>

                  {openCountry && (
                    <div className="country-menu">
                      {COUNTRIES.map((country) => (
                        <button
                          type="button"
                          key={country.dialCode}
                          className={
                            selectedCountry.dialCode === country.dialCode
                              ? "country-option selected"
                              : "country-option"
                          }
                          onClick={() => chooseCountry(country)}
                        >
                          <img
                            src={country.flag}
                            alt={country.name}
                            loading="lazy"
                            className="country-option-flag"
                          />

                          <span className="country-option-name">
                            {country.name}
                          </span>

                          <span className="country-option-code">
                            {country.dialCode}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="phone-input-box">
                  <span className="phone-country-code">
                    {selectedCountry.dialCode}
                  </span>

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {error && <span className="auth-error">{error}</span>}

              <button type="submit" disabled={loading}>
                {loading ? "Sending Code..." : "Sign Up"}
              </button>

              <p className="auth-switch">
                Already have an account?{" "}
                <span onClick={() => navigate("/login")}>Log in</span>
              </p>
            </form>
          </div>
        </div>
      </div>

      {showCodePopup && (
        <div className="verify-popup-overlay">
          <div className="verify-popup">
            <button
              type="button"
              className="verify-close"
              onClick={() => {
                setShowCodePopup(false);
                setVerificationCode("");
                setCodeError("");
                setCodeMessage("");
              }}
            >
              <FaTimes />
            </button>

            <div className="verify-icon">✉</div>

            <h2>Email Verification</h2>

            <p>
              Enter the 6-digit code sent to{" "}
              <strong>{email.trim().toLowerCase()}</strong>
            </p>

            <input
              className="verify-code-input"
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(e.target.value.replace(/\D/g, ""))
              }
            />

            {codeError && <div className="verify-error">{codeError}</div>}
            {codeMessage && <div className="verify-success">{codeMessage}</div>}

            <button
              type="button"
              className="verify-main-btn"
              disabled={verifyLoading}
              onClick={handleVerifyCode}
            >
              {verifyLoading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <button
              type="button"
              className="verify-resend-btn"
              disabled={verifyLoading}
              onClick={handleResendCode}
            >
              Resend Code
            </button>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-icon">✓</div>

            <h2>Account Created</h2>

            <p>Your Egypt Holiday account has been created successfully.</p>

            <button
              type="button"
              onClick={() => {
                setShowSuccess(false);
                navigate("/", { replace: true });
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
