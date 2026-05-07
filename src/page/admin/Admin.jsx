import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlane,
  FaHome,
  FaBoxOpen,
  FaCalendarCheck,
  FaUsers,
  FaCreditCard,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaPlus,
  FaFileExport,
} from "react-icons/fa";

import Navbar from "../../components/navbar";
import "./Admin.css";

export default function Admin() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminSuccess, setAdminSuccess] = useState("");

  const [bookings, setBookings] = useState([
    {
      name: "Sarah M.",
      trip: "Hurghada",
      date: "2026-06-15",
      status: "Confirmed",
    },
    {
      name: "Ahmed K.",
      trip: "Turkey Trip",
      date: "2026-07-22",
      status: "Pending",
    },
  ]);

  const [payments, setPayments] = useState([
    {
      invoice: "Hurghada Invoice",
      client: "Siwar Saad",
      amount: "$580",
      status: "Paid",
    },
    {
      invoice: "Turkey Trip Invoice",
      client: "Ahmed Khaled",
      amount: "$750",
      status: "Not Paid",
    },
  ]);

  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("clientMessages")) || []
  );

  const stats = [
    { title: "Packages", value: "14", icon: "📦" },
    { title: "Reservations", value: bookings.length, icon: "🧾" },
    { title: "Clients", value: "320", icon: "👥" },
    { title: "Messages", value: messages.length, icon: "💬" },
  ];

  const packages = [
    { name: "Hurghada", price: "$580", pdf: "Uploaded" },
    { name: "Turkey Trip", price: "$750", pdf: "Uploaded" },
  ];

  const clients = [
    {
      name: "Siwar Saad",
      email: "siwar@email.com",
      phone: "+20 109 999 9234",
    },
    {
      name: "Ahmed Khaled",
      email: "ahmed@email.com",
      phone: "+20 100 222 3344",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/login");
  };

  const updateBooking = (index, field, value) => {
    const updated = [...bookings];
    updated[index][field] = value;
    setBookings(updated);
  };

  const updatePayment = (index, value) => {
    const updated = [...payments];
    updated[index].status = value;
    setPayments(updated);
  };

  const updateReply = (index, value) => {
    const updated = [...messages];
    updated[index].reply = value;
    setMessages(updated);
  };

  const sendReply = () => {
    localStorage.setItem("clientMessages", JSON.stringify(messages));

    setAdminSuccess(
      "Your reply has been sent successfully. The client can now view your response."
    );

    setTimeout(() => {
      setAdminSuccess("");
    }, 4000);
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
                onClick={() => setActiveTab("dashboard")}
              >
                <FaHome /> Dashboard
              </button>

              <button
                className={activeTab === "packages" ? "active" : ""}
                onClick={() => setActiveTab("packages")}
              >
                <FaBoxOpen /> Packages
              </button>

              <button
                className={activeTab === "reservations" ? "active" : ""}
                onClick={() => setActiveTab("reservations")}
              >
                <FaCalendarCheck /> Reservations
              </button>

              <button
                className={activeTab === "clients" ? "active" : ""}
                onClick={() => setActiveTab("clients")}
              >
                <FaUsers /> Clients
              </button>

              <button
                className={activeTab === "payments" ? "active" : ""}
                onClick={() => setActiveTab("payments")}
              >
                <FaCreditCard /> Payments
              </button>

              <button
                className={activeTab === "messages" ? "active" : ""}
                onClick={() => setActiveTab("messages")}
              >
                <FaEnvelope /> Messages
              </button>

              <button
                className={activeTab === "settings" ? "active" : ""}
                onClick={() => setActiveTab("settings")}
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
          <header className="admin-top">
            <div>
              <span className="admin-label">Welcome back, Admin</span>

              <h1>
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "packages" && "Packages"}
                {activeTab === "reservations" && "Reservations"}
                {activeTab === "clients" && "Clients"}
                {activeTab === "payments" && "Payments"}
                {activeTab === "messages" && "Messages"}
                {activeTab === "settings" && "Settings"}
              </h1>
            </div>

            <div className="admin-actions">
              <button className="outline-btn">
                <FaFileExport /> Export
              </button>

              <button>
                <FaPlus /> Add New
              </button>
            </div>
          </header>

          {activeTab === "dashboard" && (
            <>
              <section className="admin-stats">
                {stats.map((item, index) => (
                  <div className="admin-stat-card" key={index}>
                    <div>
                      <p>{item.title}</p>
                      <h3>{item.value}</h3>
                    </div>

                    <span>{item.icon}</span>
                  </div>
                ))}
              </section>
            </>
          )}

          {activeTab === "packages" && (
            <section className="admin-panel">
              <h2>Packages</h2>

              {packages.map((item, index) => (
                <div className="package-row" key={index}>
                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.price}</p>
                  </div>

                  <span className="pdf-ok">{item.pdf}</span>
                </div>
              ))}
            </section>
          )}

          {activeTab === "reservations" && (
            <section className="admin-panel">
              <h2>Reservations</h2>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Package</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.trip}</td>

                        <td>
                          <input
                            type="date"
                            className="date-input"
                            value={item.date}
                            onChange={(e) =>
                              updateBooking(index, "date", e.target.value)
                            }
                          />
                        </td>

                        <td>
                          <select
                            className={`status-select ${item.status.toLowerCase()}`}
                            value={item.status}
                            onChange={(e) =>
                              updateBooking(index, "status", e.target.value)
                            }
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Pending">Pending</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "clients" && (
            <section className="admin-panel">
              <h2>Clients</h2>

              {clients.map((item, index) => (
                <div className="package-row" key={index}>
                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.email}</p>
                  </div>

                  <span>{item.phone}</span>
                </div>
              ))}
            </section>
          )}

          {activeTab === "payments" && (
            <section className="admin-panel">
              <h2>Payments</h2>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Client</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {payments.map((item, index) => (
                      <tr key={index}>
                        <td>{item.invoice}</td>
                        <td>{item.client}</td>
                        <td>{item.amount}</td>

                        <td>
                          <select
                            className={`payment-select ${item.status
                              .toLowerCase()
                              .replace(" ", "-")}`}
                            value={item.status}
                            onChange={(e) =>
                              updatePayment(index, e.target.value)
                            }
                          >
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Not Paid">Not Paid</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "messages" && (
            <section className="admin-panel">
              <h2>Messages</h2>

              {adminSuccess && (
                <div className="success-alert">
                  ✅ {adminSuccess}
                </div>
              )}

              {messages.length === 0 && (
                <p className="empty-msg">No client messages yet.</p>
              )}

              {messages.map((item, index) => (
                <div className="admin-message-card" key={item.id}>
                  <div className="admin-message-head">
                    <div>
                      <h4>{item.name}</h4>
                      <span>{item.email}</span>
                    </div>

                    <small>{item.date}</small>
                  </div>

                  <p className="client-msg">{item.message}</p>

                  <textarea
                    placeholder="Write a professional reply..."
                    value={item.reply}
                    onChange={(e) =>
                      updateReply(index, e.target.value)
                    }
                  />

                  <button onClick={sendReply}>
                    Send Reply
                  </button>
                </div>
              ))}
            </section>
          )}

          {activeTab === "settings" && (
            <section className="admin-panel">
              <h2>Settings</h2>

              <div className="quick-actions">
                <button>Edit Agency Information</button>
                <button>Change Admin Password</button>
                <button>Update Contact Numbers</button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}