import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
  FaCreditCard,
  FaEnvelope,
  FaCog,
  FaStar,
  FaSignOutAlt,
  FaCalendarPlus,
  FaUserCircle,
  FaHotel,
  FaUserPlus,
  FaBars,
  FaTimes,
  FaPlaneDeparture,
} from "react-icons/fa";

import API from "../../api";
import Navbar from "../../components/navbar";
import "./Admin.css";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/admin", icon: <FaHome /> },
    { name: "Packages", path: "/admin/packages", icon: <FaBoxOpen /> },
    { name: "Hotels", path: "/admin/hotels", icon: <FaHotel /> },
    {
      name: "Reservations",
      path: "/admin/reservations",
      icon: <FaClipboardList />,
    },
    {
      name: "Create Reservation",
      path: "/admin/create-reservation",
      icon: <FaCalendarPlus />,
    },
    { name: "Users", path: "/admin/clients", icon: <FaUsers /> },
    { name: "Payments", path: "/admin/payments", icon: <FaCreditCard /> },
    { name: "Messages", path: "/admin/messages", icon: <FaEnvelope /> },
    { name: "Subscribers", path: "/admin/subscribers", icon: <FaUserPlus /> },
    { name: "Reviews", path: "/admin/reviews", icon: <FaStar /> },
    { name: "Profile", path: "/admin/profile", icon: <FaUserCircle /> },
    { name: "Settings", path: "/admin/settings", icon: <FaCog /> },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };

  const goTo = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log("Admin logout error:", err.response?.data || err.message);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    window.dispatchEvent(new Event("authChanged"));
    window.location.replace("/login");
  };

  return (
    <div className="admin-wrapper">
      <Navbar />

      <button
        type="button"
        className="admin-mobile-menu-btn"
        onClick={() => setMobileMenuOpen(true)}
      >
        <FaBars />
      </button>

      {mobileMenuOpen && (
        <button
          type="button"
          className="admin-mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="admin-page">
        <aside
          className={
            mobileMenuOpen ? "admin-sidebar mobile-open" : "admin-sidebar"
          }
        >
          <div className="admin-brand">
            <div className="brand-icon">
              <FaPlaneDeparture />
            </div>

            <div>
              <h2>Egypt Holiday</h2>
              <span>Admin Panel</span>
            </div>

            <button
              type="button"
              className="admin-sidebar-close"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          <nav className="admin-nav">
            {menu.map((item) => (
              <button
                key={item.path}
                type="button"
                className={isActive(item.path) ? "active" : ""}
                onClick={() => goTo(item.path)}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          <button type="button" className="admin-logout" onClick={logout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </aside>

        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}