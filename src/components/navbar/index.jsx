import "./style.css";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import agency from "../../assets/image/agency.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") ||
        sessionStorage.getItem("user") ||
        "null"
    );
  } catch {
    user = null;
  }

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

        <button
          className="nav-link-btn"
          onClick={() => navigate("/flight")}
        >
          Flights
        </button>

        <button
          className="nav-link-btn"
          onClick={() => navigate("/packages")}
        >
          Packages
        </button>

        <button
          className="nav-link-btn"
          onClick={() => navigate("/hotels")}
        >
          Hotels
        </button>

        {user ? (
          <button
            className="profile-btn"
            onClick={() => navigate(user.role === "admin" ? "/admin" : "/profile")}
          >
            <FaUser />
            <span>
              {user.name || user.email || "Profile"}
            </span>
          </button>
        ) : (
          <button
            className="navbar-user"
            onClick={() => navigate("/login")}
          >
            <FaUser />
          </button>
        )}




      </nav>
    </header >
  );
}
