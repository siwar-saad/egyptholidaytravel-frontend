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

import Navbar from "../../components/Navbar";
import "./Admin.css";
import { getStoredUser, hasPermission } from "./adminPermissions";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = getStoredUser();

    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
      return;
    }

    setUser(currentUser);
  }, [navigate]);

  const menu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaHome />,
      permission: "dashboard",
    },
    {
      name: "Packages",
      path: "/admin/packages",
      icon: <FaBoxOpen />,
      permission: "packages",
    },
    {
      name: "Hotels",
      path: "/admin/hotels",
      icon: <FaHotel />,
      permission: "hotels",
    },
    {
      name: "Reservations",
      path: "/admin/reservations",
      icon: <FaClipboardList />,
      permission: "reservations",
    },
    {
      name: "Create Reservation",
      path: "/admin/create-reservation",
      icon: <FaCalendarPlus />,
      permission: "create_reservation",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FaUsers />,
      permission: "users",
    },
    {
      name: "Payments",
      path: "/admin/payments",
      icon: <FaCreditCard />,
      permission: "payments",
    },
    {
      name: "Messages",
      path: "/admin/messages",
      icon: <FaEnvelope />,
      permission: "messages",
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: <FaStar />,
      permission: "reviews",
    },
    {
      name: "Profile",
      path: "/admin/profile",
      icon: <FaUserCircle />,
      permission: "settings",
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <FaCog />,
      permission: "settings",
    },
  ];

  const allowedMenu = menu.filter((item) =>
    hasPermission(user, item.permission)
  );

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <>
      <Navbar />

      <div className="admin-layout">
        <button
          type="button"
          className="admin-mobile-toggle"
          onClick={() => setMobileMenuOpen(true)}
        >
          <FaBars />
        </button>

        <aside className={`admin-sidebar ${mobileMenuOpen ? "open" : ""}`}>
          <div className="admin-sidebar-head">
            <h2>Admin EgyptHoliday</h2>

            <button
              type="button"
              className="admin-sidebar-close"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="admin-user-mini">
            <FaUserCircle />

            <div>
              <strong>
                {user.firstName || user.name || "Admin"} {user.lastName || ""}
              </strong>
              <span>{user.email}</span>
            </div>
          </div>

          <nav className="admin-menu">
            {allowedMenu.length > 0 ? (
              allowedMenu.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  className={location.pathname === item.path ? "active" : ""}
                  onClick={() => handleNavigate(item.path)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))
            ) : (
              <p className="admin-no-permission">
                No permissions assigned.
              </p>
            )}
          </nav>

          <button type="button" className="admin-logout" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </aside>

        {mobileMenuOpen && (
          <button
            type="button"
            className="admin-sidebar-overlay"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="admin-main">{children}</main>
      </div>
    </>
  );
}