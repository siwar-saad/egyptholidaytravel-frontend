import { useNavigate } from "react-router-dom";
import "./Login.css";
import logoImg from "../../assets/image/login.png";
import pyramid from "../../assets/image/pyramid.webp";
import passport from "../../assets/image/passport.webp";
import visa from "../../assets/image/visa.webp";
import Navbar from "../../components/navbar";

export default function Login() {
  const navigate = useNavigate();

  return (
  <div>
    <Navbar />

    <div className="auth-page">
      <div className="auth-card">
        {/* LEFT SIDE */}
        <div className="auth-left">
          <div className="auth-shape"></div>

          <img src={logoImg} alt="logo" className="auth-brand-image" />

          <img src={pyramid} className="auth-icon icon-pyramid" />
          <img src={passport} className="auth-icon icon-passport" />
          <img src={visa} className="auth-icon icon-visa" />
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <h2>Log In</h2>

          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />

            <span
              className="forgot-password"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </span>

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
