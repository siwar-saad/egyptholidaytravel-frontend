import { useEffect, useState } from "react";
import {
  FaPlane,
  FaHome,
  FaBoxOpen,
  FaHotel,
  FaCalendarCheck,
  FaUsers,
  FaCreditCard,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaMailBulk,
} from "react-icons/fa";

import Navbar from "../../components/navbar";
import API from "../../api";
import "./Admin.css";

import Dashboard from "./Dashboard";
import Packages from "./Packages";
import Hotels from "./Hotels";
import Reservations from "./Reservations";
import Clients from "./Clients";
import Payments from "./Payments";
import Messages from "./Messages";
import Subscribers from "./Subscribers";
import Settings from "./Settings";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminSuccess, setAdminSuccess] = useState("");
  const [adminMessageNotifications, setAdminMessageNotifications] = useState(0);

  const showSuccess = (msg) => {
    setAdminSuccess(msg);

    setTimeout(() => {
      setAdminSuccess("");
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  useEffect(() => {
    const loadMessageNotifications = async () => {
      try {
        const res = await API.get("/admin/messages");
        setAdminMessageNotifications((res.data || []).length);
      } catch (err) {
        console.log(
          "Messages notification error:",
          err.response?.data || err.message
        );
      }
    };

    loadMessageNotifications();
  }, []);

  const openTab = (tab) => {
    setActiveTab(tab);

    if (tab === "messages") {
      setAdminMessageNotifications(0);
    }
  };

  const renderContent = () => {
    if (activeTab === "dashboard") return <Dashboard />;
    if (activeTab === "packages") return <Packages showSuccess={showSuccess} />;
    if (activeTab === "hotels") return <Hotels showSuccess={showSuccess} />;
    if (activeTab === "reservations") return <Reservations showSuccess={showSuccess} />;
    if (activeTab === "clients") return <Clients showSuccess={showSuccess} />;
    if (activeTab === "payments") return <Payments />;
    if (activeTab === "messages") return <Messages showSuccess={showSuccess} />;
    if (activeTab === "subscribers") return <Subscribers />;
    if (activeTab === "settings") return <Settings />;

    return <Dashboard />;
  };

  return (
    <div className="admin-wrapper">
      <Navbar />

      <div className="admin-page">
        <aside className="admin-sidebar">
          <div>
            <div className="admin-brand">
              <div className="brand-icon">
                <FaPlane />
              </div>

              <div>
                <h2>Egypt Holiday</h2>
                <span>Admin Panel</span>
              </div>
            </div>

            <nav className="admin-nav">
              <button
                className={activeTab === "dashboard" ? "active" : ""}
                onClick={() => openTab("dashboard")}
              >
                <FaHome /> Dashboard
              </button>

              <button
                className={activeTab === "packages" ? "active" : ""}
                onClick={() => openTab("packages")}
              >
                <FaBoxOpen /> Packages
              </button>

              <button
                className={activeTab === "hotels" ? "active" : ""}
                onClick={() => openTab("hotels")}
              >
                <FaHotel /> Hotels
              </button>

              <button
                className={activeTab === "reservations" ? "active" : ""}
                onClick={() => openTab("reservations")}
              >
                <FaCalendarCheck /> Reservations
              </button>

              <button
                className={activeTab === "clients" ? "active" : ""}
                onClick={() => openTab("clients")}
              >
                <FaUsers /> Clients
              </button>

              <button
                className={activeTab === "payments" ? "active" : ""}
                onClick={() => openTab("payments")}
              >
                <FaCreditCard /> Payments
              </button>

              <button
                className={activeTab === "messages" ? "active" : ""}
                onClick={() => openTab("messages")}
              >
                <FaEnvelope />
                <span>Messages</span>

                {adminMessageNotifications > 0 && (
                  <span className="message-badge">
                    {adminMessageNotifications}
                  </span>
                )}
              </button>

              <button
                className={activeTab === "subscribers" ? "active" : ""}
                onClick={() => openTab("subscribers")}
              >
                <FaMailBulk /> Subscribers
              </button>

              <button
                className={activeTab === "settings" ? "active" : ""}
                onClick={() => openTab("settings")}
              >
                <FaCog /> Settings
              </button>
            </nav>
          </div>

          <button className="admin-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </aside>

        <main className="admin-main">
          {adminSuccess && (
            <div className="success-alert">✅ {adminSuccess}</div>
          )}

          {renderContent()}
        </main>
      </div>
    </div>
  );
}