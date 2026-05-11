import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "./Login.css";

import pyramid from "../../assets/image/pyramid.webp";
import passport from "../../assets/image/passport.webp";
import visa from "../../assets/image/visa.webp";
import login from "../../assets/image/login.png";
import Navbar from "../../components/navbar";

export default function Signup() {
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await API.post("/auth/signup", {
        firstName,
        lastName,
        email,
        password,
        confirmPassword: password,
        phone,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.user.id,
            name:
              response.data.user.name ||
              `${response.data.user.firstName || ""} ${response.data.user.lastName || ""
              }`.trim(),

            email: response.data.user.email,

            phone: response.data.user.phone || "",

            city: response.data.user.city || "Mansoura",

            country: response.data.user.country || "Egypt",

            avatar: response.data.user.avatar || "",

            role: response.data.user.role || "user",
          })
        );

        setShowSuccess(true);

        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed ❌");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-left">
            <div className="auth-shape"></div>

            <img
              src={login}
              alt="Egypt Holiday"
              className="auth-brand-image"
            />

            <img
              src={pyramid}
              className="auth-icon icon-pyramid"
              alt="pyramid"
            />

            <img
              src={passport}
              className="auth-icon icon-passport"
              alt="passport"
            />

            <img
              src={visa}
              className="auth-icon icon-visa"
              alt="visa"
            />
          </div>

          <div className="auth-right">
            <h2>Sign Up</h2>

            <form className="auth-form" onSubmit={handleSignup}>
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

              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="tel"
                placeholder="Phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              {error && <span className="error-text">{error}</span>}

              <button type="submit">Sign Up</button>

              <p className="auth-switch">
                Already have an account?{" "}
                <span onClick={() => navigate("/login")}>
                  Log in
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-icon">✓</div>

            <h2>Account Created</h2>

            <p>
              Your Egypt Holiday account has been created successfully.
            </p>

            <button
              onClick={() => {
                setShowSuccess(false);
                navigate("/profile");
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