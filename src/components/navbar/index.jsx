import "./style.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import API from "../../api";
import agency from "../../assets/image/agency.png";

export default function Navbar() {
  const navigate = useNavigate();
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

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={agency} alt="Logo" className="navbar-logo" />
        </Link>
      </div>

      <nav className="navbar-links">
        <button className="nav-link-btn" onClick={() => navigate("/")}>
          Home
        </button>

        <button className="nav-link-btn" onClick={() => navigate("/flight")}>
          Flights
        </button>

        <button className="nav-link-btn" onClick={() => navigate("/packages")}>
          Packages
        </button>

        <button className="nav-link-btn" onClick={() => navigate("/hotels")}>
          Hotels
        </button>

        {user ? (
          <button
            className="profile-btn"
            onClick={() =>
              navigate(user.role === "admin" ? "/admin" : "/profile")
            }
          >
            <FaUser />
            <span>{user.name || user.email || "Profile"}</span>
          </button>
        ) : (
          <button className="navbar-user" onClick={() => navigate("/login")}>
            <FaUser />
          </button>
        )}
      </nav>
    </header>
  );
}
