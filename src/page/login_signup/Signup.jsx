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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/auth/signup", {
        firstName: name,
        lastName: "User",
        email,
        password,
        confirmPassword: password,
        phone,
      });

      alert("Account created ✅");
      navigate("/login");
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

            <img src={login} alt="Egypt Holiday" className="auth-brand-image" />
            <img src={pyramid} className="auth-icon icon-pyramid" alt="pyramid" />
            <img src={passport} className="auth-icon icon-passport" alt="passport" />
            <img src={visa} className="auth-icon icon-visa" alt="visa" />
          </div>

          <div className="auth-right">
            <h2>Sign Up</h2>

            <form className="auth-form" onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                type="number"
                placeholder="Phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              {error && <span className="error-text">{error}</span>}

              <button type="submit">Sign Up</button>

              <p className="auth-switch">
                Already have an account?{" "}
                <span onClick={() => navigate("/login")}>Log in</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}