import "./style.css";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import agency from "../../assets/image/agency.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

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

        <button className="nav-link-btn" onClick={() => navigate("/#Flights")}>
          Flights
        </button>

        <Link to="/packages" className="nav-link">
          Packages
        </Link>

        <button className="nav-link-btn" onClick={() => navigate("/#info")}>
          Hotels
        </button>

        <button
          className="navbar-user"
          aria-label="User account"
          onClick={() => navigate("/login")}
        >
          <FaUser />
        </button>
      </nav>
    </header>
  );
}
