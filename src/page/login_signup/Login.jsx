import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api";
import "./Login.css";

import queenImage from "../../assets/image/login.png";
import pyramidIcon from "../../assets/image/pyramid.webp";
import passportIcon from "../../assets/image/passport.webp";
import visaIcon from "../../assets/image/visa.webp";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe") === "true"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password.trim(),
        rememberMe,
      });

      if (!res.data?.token) {
        setError("Login failed. Token not found.");
        return;
      }

      const userToStore = {
        id: res.data.user.id,
        email: res.data.user.email,
        role: res.data.user.role,
        name: res.data.user.name,
      };

      if (rememberMe) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(userToStore));
        localStorage.setItem("rememberMe", "true");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      } else {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("user", JSON.stringify(userToStore));

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("rememberMe");
      }

      if (res.data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      console.log("Login error:", err.response?.data || err.message);

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Email or password is incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-shape"></div>

          <img
            src={queenImage}
            alt="Egypt Queen"
            className="auth-brand-image"
          />

          <img
            src={pyramidIcon}
            alt="Pyramid"
            className="auth-icon icon-pyramid"
          />

          <img
            src={passportIcon}
            alt="Passport"
            className="auth-icon icon-passport"
          />

          <img
            src={visaIcon}
            alt="Visa"
            className="auth-icon icon-visa"
          />
        </div>

        <div className="auth-right">
          <form className="auth-form" onSubmit={handleLogin}>
            <h2>Log In</h2>

            {error && <div className="auth-error">{error}</div>}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
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
  );
}
