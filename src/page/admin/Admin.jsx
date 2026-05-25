import { useCallback, useEffect, useState } from "react";
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

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log("Admin logout error:", err.response?.data || err.message);
    }

    window.location.href = "/login";
  };

  const loadMessageNotifications = useCallback(async () => {
    try {
      const res = await API.get("/admin/messages/unread-count");
      setAdminMessageNotifications(Number(res.data?.count || 0));
    } catch (err) {
      console.log(
        "Messages notification error:",
        err.response?.data || err.message
      );
    }
  }, []);

  useEffect(() => {
    loadMessageNotifications();

    const unreadTimer = setInterval(loadMessageNotifications, 5000);

    return () => clearInterval(unreadTimer);
  }, [loadMessageNotifications]);

  useEffect(() => {
    loadMessageNotifications();
  }, [activeTab, loadMessageNotifications]);

  const openTab = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
  switch (activeTab) {
    case "dashboard":
      return <Dashboard onOpenTab={openTab} />;

    case "packages":
      return <Packages showSuccess={showSuccess} />;

    case "hotels":
      return <Hotels showSuccess={showSuccess} />;

    case "reservations":
      return <Reservations showSuccess={showSuccess} />;

    case "clients":
      return <Clients showSuccess={showSuccess} />;

    case "payments":
      return <Payments />;

    case "messages":
      return (
        <Messages
          showSuccess={showSuccess}
          onUnreadChange={setAdminMessageNotifications}
        />
      );

    case "subscribers":
      return <Subscribers />;

    case "settings":
      return <Settings />;

    default:
      return <Dashboard onOpenTab={openTab} />;
  }
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
                type="button"
                className={activeTab === "dashboard" ? "active" : ""}
                onClick={() => openTab("dashboard")}
              >
                <FaHome /> Dashboard
              </button>

              <button
                type="button"
                className={activeTab === "packages" ? "active" : ""}
                onClick={() => openTab("packages")}
              >
                <FaBoxOpen /> Packages
              </button>

              <button
                type="button"
                className={activeTab === "hotels" ? "active" : ""}
                onClick={() => openTab("hotels")}
              >
                <FaHotel /> Hotels
              </button>

              <button
                type="button"
                className={activeTab === "reservations" ? "active" : ""}
                onClick={() => openTab("reservations")}
              >
                <FaCalendarCheck /> Reservations
              </button>

              <button
                type="button"
                className={activeTab === "clients" ? "active" : ""}
                onClick={() => openTab("clients")}
              >
                <FaUsers /> Clients
              </button>

              <button
                type="button"
                className={activeTab === "payments" ? "active" : ""}
                onClick={() => openTab("payments")}
              >
                <FaCreditCard /> Payments
              </button>

              <button
                type="button"
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
                type="button"
                className={activeTab === "subscribers" ? "active" : ""}
                onClick={() => openTab("subscribers")}
              >
                <FaMailBulk /> Subscribers
              </button>

              <button
                type="button"
                className={activeTab === "settings" ? "active" : ""}
                onClick={() => openTab("settings")}
              >
                <FaCog /> Settings
              </button>
            </nav>
          </div>

          <button type="button" className="admin-logout" onClick={handleLogout}>
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
