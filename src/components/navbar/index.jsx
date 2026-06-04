import "./style.css";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

import API from "../../api";
import agency from "../../assets/image/agency.png";

const safeParse = (value, fallback = null) => {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
};

const getStoredUser = () => {
  return safeParse(
    localStorage.getItem("user") || sessionStorage.getItem("user"),
    null
  );
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(getStoredUser());

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = getStoredUser();

        if (storedUser) {
          setUser(storedUser);
        }

        const res = await API.get("/auth/me", { skipAuthRedirect: true });
        const apiUser = res.data?.user || null;

        if (apiUser) {
          const finalUser = {
            ...(storedUser || {}),
            ...apiUser,
            avatar: apiUser.avatar || storedUser?.avatar || "",
            profileImage:
              apiUser.profileImage || storedUser?.profileImage || "",
          };

          setUser(finalUser);
        } else {
          setUser(storedUser);
        }
      } catch {
        setUser(getStoredUser());
      }
    };

    loadUser();

    const refreshUser = () => {
      setUser(getStoredUser());
    };

    const handleProfileUpdate = (event) => {
      if (event.detail) {
        setUser(event.detail);
      } else {
        refreshUser();
      }
    };

    window.addEventListener("storage", refreshUser);
    window.addEventListener("profileUpdated", handleProfileUpdate);
    window.addEventListener("profilePhotoUpdated", handleProfileUpdate);
    window.addEventListener("authChanged", refreshUser);

    return () => {
      window.removeEventListener("storage", refreshUser);
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      window.removeEventListener("profilePhotoUpdated", handleProfileUpdate);
      window.removeEventListener("authChanged", refreshUser);
    };
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

  const userName =
    user?.name ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.email ||
    "Profile";

  const userPhoto =
    user?.avatar ||
    user?.profileImage ||
    user?.photo ||
    user?.image ||
    "";

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={agency} alt="Logo" className="navbar-logo" />
        </Link>
      </div>

      <nav className="navbar-links">
        <button
          type="button"
          className={`nav-link-btn ${isActive("/") ? "active" : ""}`}
          onClick={() => navigate("/")}
        >
          Home
        </button>

        <button
          type="button"
          className={`nav-link-btn ${isActive("/flight") ? "active" : ""}`}
          onClick={() => navigate("/flight")}
        >
          Flights
        </button>

        <button
          type="button"
          className={`nav-link-btn ${isActive("/packages") ? "active" : ""}`}
          onClick={() => navigate("/packages")}
        >
          Packages
        </button>

        <button
          type="button"
          className={`nav-link-btn ${isActive("/hotels") ? "active" : ""}`}
          onClick={() => navigate("/hotels")}
        >
          Hotels
        </button>

        {user ? (
          <button
            type="button"
            className={`profile-btn ${isProfileActive ? "active" : ""}`}
            onClick={() =>
              navigate(user.role === "admin" ? "/admin" : "/profile")
            }
          >
            {userPhoto ? (
              <img
                src={userPhoto}
                alt={userName}
                className="navbar-profile-img"
              />
            ) : (
              <FaUser />
            )}

            <span>{userName}</span>
          </button>
        ) : (
          <button
            type="button"
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