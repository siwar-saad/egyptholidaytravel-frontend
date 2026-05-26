import "./style.css";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import API from "../../api";
import agency from "../../assets/image/agency.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await API.get("/auth/me", { skipAuthRedirect: true });
        setUser(res.data?.user || null);
      } catch {
        setUser(null);
      }
    };

    loadUser();
  }, []);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const isProfileActive =
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/admin");

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={agency} alt="Logo" className="navbar-logo" />
        </Link>
      </div>

      <nav className="navbar-links">
        <button
          className={`nav-link-btn ${isActive("/") ? "active" : ""}`}
          onClick={() => navigate("/")}
        >
          Home
        </button>

        <button
          className={`nav-link-btn ${isActive("/flight") ? "active" : ""}`}
          onClick={() => navigate("/flight")}
        >
          Flights
        </button>

        <button
          className={`nav-link-btn ${isActive("/packages") ? "active" : ""}`}
          onClick={() => navigate("/packages")}
        >
          Packages
        </button>

        <button
          className={`nav-link-btn ${isActive("/hotels") ? "active" : ""}`}
          onClick={() => navigate("/hotels")}
        >
          Hotels
        </button>

        {user ? (
          <button
            className={`profile-btn ${isProfileActive ? "active" : ""}`}
            onClick={() =>
              navigate(user.role === "admin" ? "/admin" : "/profile")
            }
          >
            <FaUser />
            <span>{user.name || user.email || "Profile"}</span>
          </button>
        ) : (
          <button
            className={`navbar-user ${
              location.pathname.startsWith("/login") ? "active" : ""
            }`}
            onClick={() => navigate("/login")}
          >
            <FaUser />
          </button>
        )}
      </nav>
    </header>
  );
}