/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
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
} from "react-icons/fa";

import Navbar from "../../components/navbar";
import API from "../../api";
import "./Admin.css";

export default function Admin() {
  const defaultCover =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminSuccess, setAdminSuccess] = useState("");
  const [showPackageForm, setShowPackageForm] = useState(false);

  const [dashboard, setDashboard] = useState({
    packages: 0,
    reservations: 0,
    clients: 0,
    messages: 0,
  });

  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [messages, setMessages] = useState([]);

  const [newPackage, setNewPackage] = useState({
    name: "",
    programme: "",
    price: "",
    visibility: "Private",
    image: "",
  });

  const showSuccess = (msg) => {
    setAdminSuccess(msg);
    setTimeout(() => setAdminSuccess(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const fetchAllData = async () => {
    try {
      const dashboardRes = await API.get("/admin/dashboard");
      const packagesRes = await API.get("/admin/packages");
      const reservationsRes = await API.get("/admin/reservations");
      const clientsRes = await API.get("/admin/clients");
      const paymentsRes = await API.get("/admin/payments");
      const messagesRes = await API.get("/admin/messages");

      console.log("Dashboard data:", dashboardRes.data);

      setDashboard(dashboardRes.data);
      setPackages(packagesRes.data || []);
      setBookings(reservationsRes.data || []);
      setClients(clientsRes.data || []);
      setPayments(paymentsRes.data || []);
      setMessages(messagesRes.data || []);
    } catch (err) {
      console.log("Admin data error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAllData();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handlePackageImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setNewPackage({
        ...newPackage,
        image: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const addPackage = async () => {
    if (!newPackage.name || !newPackage.programme || !newPackage.price) {
      showSuccess("Please fill all package fields.");
      return;
    }

    try {
      const res = await API.post("/admin/packages", newPackage);

      setPackages([res.data, ...packages]);

      setNewPackage({
        name: "",
        programme: "",
        price: "",
        visibility: "Private",
        image: "",
      });

      setShowPackageForm(false);
      showSuccess("Package added successfully.");
      fetchAllData();
    } catch (err) {
      console.log("Add package error:", err.response?.data || err.message);
    }
  };

  const updatePackageVisibility = async (index, visibility) => {
    try {
      const item = packages[index];

      await API.put(`/admin/packages/${item.id}/visibility`, {
        visibility,
      });

      const updated = [...packages];
      updated[index].visibility = visibility;
      setPackages(updated);

      showSuccess("Package visibility updated.");
    } catch (err) {
      console.log("Visibility error:", err.response?.data || err.message);
    }
  };

  const deletePackage = async (id) => {
    try {
      await API.delete(`/admin/packages/${id}`);
      setPackages(packages.filter((item) => item.id !== id));
      showSuccess("Package deleted successfully.");
      fetchAllData();
    } catch (err) {
      console.log("Delete package error:", err.response?.data || err.message);
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      await API.put(`/admin/reservations/${id}/status`, { status });

      setBookings(
        bookings.map((b) => (b.id === id ? { ...b, status } : b))
      );

      showSuccess("Reservation status updated.");
    } catch (err) {
      console.log("Reservation error:", err.response?.data || err.message);
    }
  };

  const replyMessage = async (id, reply) => {
    try {
      await API.put(`/admin/messages/${id}/reply`, { reply });

      setMessages(
        messages.map((m) => (m.id === id ? { ...m, reply } : m))
      );

      showSuccess("Reply sent successfully.");
    } catch (err) {
      console.log("Reply error:", err.response?.data || err.message);
    }
  };

  const stats = [
    { title: "Packages", value: dashboard.packages, icon: "📦" },
    { title: "Reservations", value: dashboard.reservations, icon: "🧾" },
    { title: "Clients", value: dashboard.clients, icon: "👥" },
    { title: "Messages", value: dashboard.messages, icon: "💬" },
  ];

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
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
            </div>
          </header>

          {adminSuccess && (
            <div className="success-alert">✅ {adminSuccess}</div>
          )}

          {activeTab === "dashboard" && (
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
          )}

          {activeTab === "packages" && (
            <section className="admin-panel">
              <div className="panel-head">
                <div>
                  <h2>Packages</h2>
                  <p>Manage your travel packages and programmes.</p>
                </div>

                <button onClick={() => setShowPackageForm(true)}>
                  <FaPlus /> Add New Package
                </button>
              </div>

              {packages.length === 0 ? (
                <p className="empty-msg">No packages yet.</p>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Cover</th>
                        <th>Package</th>
                        <th>Programme</th>
                        <th>Price</th>
                        <th>Visibility</th>
                      </tr>
                    </thead>

                    <tbody>
                      {packages.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <img
                              src={item.image || defaultCover}
                              alt={item.name}
                              className="package-cover"
                            />
                          </td>

                          <td>{item.name}</td>
                          <td className="programme-cell">
                            {item.programme || "No programme"}
                          </td>
                          <td>{item.price || "No price"}</td>

                          <td>
                            <select
                              className={`package-select ${item.visibility === "Published"
                                ? "uploaded"
                                : "missing"
                                }`}
                              value={item.visibility || "Private"}
                              onChange={(e) => {
                                if (e.target.value === "Delete") {
                                  deletePackage(item.id);
                                } else {
                                  updatePackageVisibility(index, e.target.value);
                                }
                              }}
                            >
                              <option value="Published">Published</option>
                              <option value="Private">Private</option>
                              <option value="Delete">Delete</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {activeTab === "reservations" && (
            <section className="admin-panel">
              <h2>Reservations</h2>

              {bookings.length === 0 ? (
                <p className="empty-msg">No reservations yet.</p>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Trip</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>{booking.name}</td>
                          <td>{booking.trip}</td>
                          <td>{booking.date}</td>
                          <td>
                            <select
                              className={`status-select ${booking.status === "Confirmed"
                                ? "confirmed"
                                : booking.status === "Cancelled"
                                  ? "cancelled"
                                  : "pending"
                                }`}
                              value={booking.status}
                              onChange={(e) =>
                                updateReservationStatus(
                                  booking.id,
                                  e.target.value
                                )
                              }
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {activeTab === "clients" && (
            <section className="admin-panel">
              <h2>Clients</h2>

              {clients.length === 0 ? (
                <p className="empty-msg">No clients yet.</p>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                      </tr>
                    </thead>

                    <tbody>
                      {clients.map((client) => (
                        <tr key={client.id}>
                          <td>{client.name}</td>
                          <td>{client.email}</td>
                          <td>{client.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {activeTab === "payments" && (
            <section className="admin-panel">
              <h2>Payments</h2>

              {payments.length === 0 ? (
                <p className="empty-msg">No payments yet.</p>
              ) : (
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
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{payment.invoice}</td>
                          <td>{payment.client}</td>
                          <td>{payment.amount}</td>
                          <td>
                            <span
                              className={
                                payment.status === "Paid" ? "paid" : "unpaid"
                              }
                            >
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {activeTab === "messages" && (
            <section className="admin-panel">
              <h2>Messages</h2>

              {messages.length === 0 ? (
                <p className="empty-msg">No messages yet.</p>
              ) : (
                messages.map((msg) => (
                  <div className="admin-message-card" key={msg.id}>
                    <div className="admin-message-head">
                      <div>
                        <strong>{msg.name || "Client"}</strong>
                        <span> • {msg.email}</span>
                      </div>
                      <small>{msg.date}</small>
                    </div>

                    <p className="client-msg">{msg.message}</p>

                    <textarea
                      placeholder="Write your reply..."
                      value={msg.reply || ""}
                      onChange={(e) =>
                        setMessages(
                          messages.map((m) =>
                            m.id === msg.id
                              ? { ...m, reply: e.target.value }
                              : m
                          )
                        )
                      }
                    />

                    <button onClick={() => replyMessage(msg.id, msg.reply)}>
                      Send Reply
                    </button>
                  </div>
                ))
              )}
            </section>
          )}

          {activeTab === "settings" && (
            <section className="admin-panel">
              <h2>Settings</h2>

              <div className="quick-actions">
                <button>Agency Information</button>
                <button>Change Admin Password</button>
                <button>Contact Numbers</button>
              </div>
            </section>
          )}
        </main>
      </div>

      {showPackageForm && (
        <div className="package-popup-overlay">
          <div className="package-popup">
            <div className="package-popup-head">
              <div>
                <h2>Add New Package</h2>
                <p>Create a complete travel package.</p>
              </div>

              <button
                className="close-package-popup"
                onClick={() => setShowPackageForm(false)}
              >
                ×
              </button>
            </div>

            <div className="package-popup-form">
              <input
                type="text"
                placeholder="Package Name"
                value={newPackage.name}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, name: e.target.value })
                }
              />

              <textarea
                placeholder="Full Programme"
                value={newPackage.programme}
                onChange={(e) =>
                  setNewPackage({
                    ...newPackage,
                    programme: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Price"
                value={newPackage.price}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, price: e.target.value })
                }
              />

              <input type="file" accept="image/*" onChange={handlePackageImage} />

              {newPackage.image && (
                <img
                  src={newPackage.image}
                  alt="preview"
                  className="package-preview-image"
                />
              )}

              <select
                value={newPackage.visibility}
                onChange={(e) =>
                  setNewPackage({
                    ...newPackage,
                    visibility: e.target.value,
                  })
                }
              >
                <option value="Published">Published</option>
                <option value="Private">Private</option>
              </select>

              <div className="package-popup-actions">
                <button onClick={addPackage}>Save Package</button>

                <button
                  className="cancel-package-btn"
                  onClick={() => setShowPackageForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}