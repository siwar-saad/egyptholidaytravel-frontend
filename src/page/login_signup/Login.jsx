import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

import logoImg from "../../assets/image/login.png";
import pyramid from "../../assets/image/pyramid.webp";
import passport from "../../assets/image/passport.webp";
import visa from "../../assets/image/visa.webp";

import Navbar from "../../components/navbar";
import api from "../../api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      if (rememberMe) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
      }

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-left">
            <div className="auth-shape"></div>

            <img src={logoImg} alt="logo" className="auth-brand-image" />
            <img src={pyramid} alt="" className="auth-icon icon-pyramid" />
            <img src={passport} alt="" className="auth-icon icon-passport" />
            <img src={visa} alt="" className="auth-icon icon-visa" />
          </div>

          <div className="auth-right">
            <h2>Log In</h2>

            <form className="auth-form" onSubmit={handleSubmit}>
              {error && (
                <p
                  style={{
                    color: "red",
                    marginBottom: "10px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </p>
              )}

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

  <span
    className="forgot-password"
    onClick={() => navigate("/forgot-password")}
  >
    Forgot Password?
  </span>
</div>

              <button type="submit">Log In</button>

              <p className="auth-switch">
                Don’t have an account?{" "}
                <span onClick={() => navigate("/signup")}>Sign up</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
