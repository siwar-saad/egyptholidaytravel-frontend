import { useEffect, useState } from "react";
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
  FaBars,
  FaTimes,
} from "react-icons/fa";

import Navbar from "../../components/navbar";
import { logoutClient } from "../../api";
import "./Admin.css";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 1100 : false
  );

  const menu = [
    { key: "dashboard", name: "Dashboard", path: "/admin", icon: <FaHome /> },

    {
      key: "packages",
      name: "Packages",
      path: "/admin/packages",
      icon: <FaBoxOpen />,
    },

    {
      key: "hotels",
      name: "Hotels",
      path: "/admin/hotels",
      icon: <FaHotel />,
    },

    {
      key: "reservations",
      name: "Reservations",
      path: "/admin/reservations",
      icon: <FaClipboardList />,
    },

    {
      key: "create-reservation",
      name: "Create Reservation",
      path: "/admin/create-reservation",
      icon: <FaCalendarPlus />,
    },

    {
      key: "users",
      name: "Users",
      path: "/admin/users",
      icon: <FaUsers />,
    },

    {
      key: "payments",
      name: "Payments",
      path: "/admin/payments",
      icon: <FaCreditCard />,
    },

    {
      key: "messages",
      name: "Messages",
      path: "/admin/messages",
      icon: <FaEnvelope />,
    },

    {
      key: "reviews",
      name: "Reviews",
      path: "/admin/reviews",
      icon: <FaStar />,
    },

    {
      key: "profile",
      name: "Profile",
      path: "/admin/profile",
      icon: <FaUserCircle />,
    },

    {
      key: "settings",
      name: "Settings",
      path: "/admin/settings",
      icon: <FaCog />,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1100;
      setIsMobile(mobile);

      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, isMobile]);

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };

  const goToPage = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "";

    await logoutClient();
  };

  const mobileButtonStyle = {
    position: "fixed",
    left: "18px",
    bottom: "22px",
    width: "54px",
    height: "54px",
    border: "none",
    borderRadius: "50%",
    background: "#935426",
    color: "#fff",
    display: isMobile ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    cursor: "pointer",
    zIndex: 2147483647,
    boxShadow: "0 14px 32px rgba(61, 35, 20, 0.45)",
  };

  const mobileOverlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(3px)",
    zIndex: 2147483645,
  };

  const mobileSidebarStyle = isMobile
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "290px",
        maxWidth: "86vw",
        minWidth: "0",
        height: "100vh",
        minHeight: "100vh",
        background: "#fffaf5",
        zIndex: 2147483646,
        transform: mobileMenuOpen ? "translateX(0)" : "translateX(-115%)",
        transition: "transform 0.28s ease",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "76px 17px 26px",
        boxShadow: "18px 0 48px rgba(0, 0, 0, 0.26)",
        borderRadius: "0 24px 24px 0",
      }
    : undefined;

  const closeButtonStyle = {
    position: "absolute",
    top: "18px",
    right: "18px",
    width: "40px",
    height: "40px",
    border: "none",
    borderRadius: "50%",
    background: "#f3ebe4",
    color: "#935426",
    fontSize: "21px",
    display: isMobile ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  return (
    <>
      <Navbar />

      {isMobile && (
        <button
          type="button"
          style={mobileButtonStyle}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Open admin menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      {isMobile && mobileMenuOpen && (
        <div
          style={mobileOverlayStyle}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className="admin-layout"
        style={
          isMobile
            ? {
                display: "block",
                width: "100%",
                minHeight: "calc(100vh - 80px)",
                background: "#f3ede6",
              }
            : undefined
        }
      >
        <aside
          className={`admin-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}
          style={mobileSidebarStyle}
        >
          <button
            type="button"
            style={closeButtonStyle}
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close admin menu"
          >
            <FaTimes />
          </button>

          <div className="admin-sidebar-menu">
            {menu.map((item) => (
              <button
                key={item.path}
                type="button"
                className={`admin-menu-link ${
                  isActive(item.path) ? "active" : ""
                }`}
                onClick={() => goToPage(item.path)}
              >
                <span className="admin-menu-icon">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}

            <button
              type="button"
              className="admin-menu-link logout-link"
              onClick={handleLogout}
            >
              <span className="admin-menu-icon">
                <FaSignOutAlt />
              </span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main
          className="admin-main-content"
          style={
            isMobile
              ? {
                  width: "100%",
                  padding: "16px 12px 90px",
                  minWidth: 0,
                }
              : undefined
          }
        >
          {children}
        </main>
      </div>
    </>
  );
}