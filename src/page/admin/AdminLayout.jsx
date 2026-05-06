import { useNavigate, useLocation } from "react-router-dom";
import "./Admin.css";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Packages", path: "/admin/packages" },
    { name: "Reservations", path: "/admin/reservations" },
    { name: "Clients", path: "/admin/clients" },
    { name: "Payments", path: "/admin/payments" },
    { name: "Messages", path: "/admin/messages" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <h2>Egypt Holiday</h2>

        <nav>
          {menu.map((item) => (
            <a
              key={item.path}
              className={location.pathname === item.path ? "active" : ""}
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </a>
          ))}
        </nav>

        <button className="admin-logout" onClick={() => navigate("/login")}>
          Logout
        </button>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
