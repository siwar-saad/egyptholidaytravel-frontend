import {
  FaPlane,
  FaHome,
  FaBriefcase,
  FaCreditCard,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function ProfileSidebar({
  activePage,
  setActivePage,
  messageNotifications,
  onLogout,
}) {
  const openPage = (page) => {
    setActivePage(page);
  };

  return (
    <aside className="client-sidebar">
      <div className="client-sidebar-brand">
        <FaPlane />
        <h2>Egypt Holiday</h2>
        <p>Client Panel</p>
      </div>

      <button
        type="button"
        className={activePage === "dashboard" ? "active" : ""}
        onClick={() => openPage("dashboard")}
      >
        <FaHome /> Dashboard
      </button>

      <button
        type="button"
        className={activePage === "booking" ? "active" : ""}
        onClick={() => openPage("booking")}
      >
        <FaBriefcase /> My Booking
      </button>

      <button
        type="button"
        className={activePage === "payment" ? "active" : ""}
        onClick={() => openPage("payment")}
      >
        <FaCreditCard /> Payment
      </button>

      <button
        type="button"
        className={activePage === "messages" ? "active" : ""}
        onClick={() => openPage("messages")}
      >
        <FaEnvelope />
        <span>Messages</span>

        {messageNotifications > 0 && (
          <span className="message-badge">{messageNotifications}</span>
        )}
      </button>

      <button
        type="button"
        className={activePage === "settings" ? "active" : ""}
        onClick={() => openPage("settings")}
      >
        <FaCog /> Settings
      </button>

      <button type="button" className="sidebar-logout" onClick={onLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
}
