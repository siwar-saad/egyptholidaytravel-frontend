import { useNavigate, useLocation } from "react-router-dom";
import {
  FaChartPie,
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
  FaCreditCard,
  FaEnvelope,
  FaCog,
  FaStar,
  FaSignOutAlt,
  FaPlaneDeparture,
} from "react-icons/fa";
import "./Admin.css";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin", icon: <FaChartPie /> },
    { name: "Packages", path: "/admin/packages", icon: <FaBoxOpen /> },
    { name: "Reservations", path: "/admin/reservations", icon: <FaClipboardList /> },
    { name: "Clients", path: "/admin/clients", icon: <FaUsers /> },
    { name: "Payments", path: "/admin/payments", icon: <FaCreditCard /> },
    { name: "Messages", path: "/admin/messages", icon: <FaEnvelope /> },
    { name: "Reviews", path: "/admin/reviews", icon: <FaStar /> },
    { name: "Settings", path: "/admin/profile", icon: <FaCog /> },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-page">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <div className="brand-icon">
              <FaPlaneDeparture />
            </div>

            <div>
              <h2>Egypt Holiday</h2>
              <span>Admin Panel</span>
            </div>
          </div>

          <nav className="admin-nav">
            {menu.map((item) => (
              <button
                key={item.path}
                type="button"
                className={isActive(item.path) ? "active" : ""}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>

          <button type="button" className="admin-logout" onClick={logout}>
            <FaSignOutAlt />
            Logout
          </button>
        </aside>

        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}