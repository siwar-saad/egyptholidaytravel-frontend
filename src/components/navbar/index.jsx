import "./style.css";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

import API from "../../api";
import agency from "../../assets/image/agency.png";

const apiOrigin =
  (import.meta.env.VITE_API_URL || "/api").replace(/\/api\/?$/, "") || "";

const getImageUrl = (src) => {
  if (!src) return "";
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith("/images/")) return `${apiOrigin}${src}`;
  return src;
};

const clearStoredAuth = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await API.get("/auth/me", { skipAuthRedirect: true });
        setUser(res.data?.user || null);
      } catch (error) {
        if (error.response?.status === 401) {
          clearStoredAuth();
        }

        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("storage", loadUser);
    window.addEventListener("authChanged", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("authChanged", loadUser);
    };
  }, [location.pathname]);

  const getUserName = () => {
  if (!user) return "";

  const role = (user.role || "").toLowerCase();

  if (role === "admin") {
    return "Admin EgyptHoliday";
  }

  return (
    user.name ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.email ||
    "Profile"
  );
};

  const getUserAvatar = () => {
    return getImageUrl(user?.avatar || user?.image || user?.profileImage || "");
  };

  const goToProfile = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const role = (user.role || "").toLowerCase();

    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
  };

  const isProfileActive =
    location.pathname.startsWith("/admin") || location.pathname === "/profile";

  return (
    <header className="navbar">
      <div className="navbar-left">
        <img
          src={agency}
          alt="Egypt Holiday Travel"
          className="navbar-logo"
          onClick={() => navigate("/")}
        />
      </div>

      <nav className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link-btn active" : "nav-link-btn"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/flight"
          className={({ isActive }) =>
            isActive ? "nav-link-btn active" : "nav-link-btn"
          }
        >
          Flights
        </NavLink>

        <NavLink
          to="/packages"
          className={({ isActive }) =>
            isActive ? "nav-link-btn active" : "nav-link-btn"
          }
        >
          Packages
        </NavLink>

        <NavLink
          to="/hotels"
          className={({ isActive }) =>
            isActive ? "nav-link-btn active" : "nav-link-btn"
          }
        >
          Hotels
        </NavLink>

        <NavLink
          to="/destinations"
          className={({ isActive }) =>
            isActive ? "nav-link-btn active" : "nav-link-btn"
          }
        >
          Destination
        </NavLink>
      </nav>

      {user ? (
        <button
          type="button"
          className={isProfileActive ? "profile-btn active" : "profile-btn"}
          onClick={goToProfile}
          title={getUserName()}
        >
          {getUserAvatar() ? (
            <img
              src={getUserAvatar()}
              alt={getUserName()}
              className="navbar-profile-img"
            />
          ) : (
            <FaUser />
          )}

          <span>{getUserName()}</span>
        </button>
      ) : (
        <button
          type="button"
          className={
            location.pathname === "/login" || location.pathname === "/signup"
              ? "navbar-user active"
              : "navbar-user"
          }
          onClick={() => navigate("/login")}
          aria-label="Login"
        >
          <FaUser />
        </button>
      )}
    </header>
  );
}
