import { useEffect, useState } from "react";
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
} from "react-icons/fa";

import Navbar from "../../components/navbar";
import API from "../../api";
import "./Admin.css";

export default function Admin() {
  const navigate = useNavigate();

  const defaultCover =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminSuccess, setAdminSuccess] = useState("");
  const [showPackageForm, setShowPackageForm] = useState(false);

  const [newPackage, setNewPackage] = useState({
    name: "",
    programme: "",
    price: "",
    visibility: "Private",
    image: "",
  });

  const [dashboard, setDashboard] = useState({
    packages: 0,
    reservations: 0,
    clients: 0,
    messages: 0,
  });

  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchPackages();
    fetchReservations();
    fetchClients();
    fetchPayments();
    fetchMessages();
  }, []);

  const showSuccess = (msg) => {
    setAdminSuccess(msg);
    setTimeout(() => setAdminSuccess(""), 3500);
  };

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setDashboard(res.data);
    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await API.get("/admin/packages");
      setPackages(res.data);
    } catch (err) {
      console.log("Packages error:", err);
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await API.get("/admin/reservations");
      setBookings(res.data);
    } catch (err) {
      console.log("Reservations error:", err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await API.get("/admin/clients");
      setClients(res.data);
    } catch (err) {
      console.log("Clients error:", err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await API.get("/admin/payments");
      setPayments(res.data);
    } catch (err) {
      console.log("Payments error:", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await API.get("/admin/messages");
      setMessages(res.data);
    } catch (err) {
      console.log("Messages error:", err);
    }
  };

  const stats = [
    { title: "Packages", value: dashboard.packages, icon: "📦" },
    { title: "Reservations", value: dashboard.reservations, icon: "🧾" },
    { title: "Clients", value: dashboard.clients, icon: "👥" },
    { title: "Messages", value: dashboard.messages, icon: "💬" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/login");
  };

  const updateBooking = async (index, field, value) => {
    const updated = [...bookings];
    updated[index][field] = value;
    setBookings(updated);

    if (field === "status") {
      try {
        await API.put(`/admin/reservations/${updated[index].id}/status`, {
          status: value,
        });

        showSuccess("Reservation status updated successfully.");
      } catch (err) {
        console.log("Update reservation error:", err);
      }
    }
  };

  const updatePackageVisibility = async (index, value) => {
    const updated = [...packages];
    updated[index].visibility = value;
    setPackages(updated);

    try {
      await API.put(`/admin/packages/${updated[index].id}/visibility`, {
        visibility: value,
      });

      showSuccess("Package visibility updated successfully.");
    } catch (err) {
      console.log("Update visibility error:", err);
    }
  };

  const deletePackage = async (id) => {
    try {
      await API.delete(`/admin/packages/${id}`);
      setPackages(packages.filter((item) => item.id !== id));
      showSuccess("Package deleted successfully.");
      fetchDashboard();
    } catch (err) {
      console.log("Delete package error:", err);
    }
  };

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
    if (
      !newPackage.name.trim() ||
      !newPackage.programme.trim() ||
      !newPackage.price.trim()
    ) {
      showSuccess("Please fill in the package name, programme and price.");
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
      showSuccess("New package has been added successfully.");
      fetchDashboard();
    } catch (err) {
      console.log("Add package error:", err);
    }
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

  const sendReply = async (id, reply) => {
    try {
      await API.put(`/admin/messages/${id}/reply`, { reply });

      showSuccess(
        "Your reply has been sent successfully. The client can now view your response."
      );
    } catch (err) {
      console.log("Reply error:", err);
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
          </header>

          {adminSuccess && <div className="success-alert">✅ {adminSuccess}</div>}

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
                  <p>Manage your travel packages, programme and visibility.</p>
                </div>

                <button onClick={() => setShowPackageForm(true)}>
                  <FaPlus /> Add New Package
                </button>
              </div>

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
                          {item.programme || "No programme added"}
                        </td>

                        <td>{item.price || "No price"}</td>

                        <td>
                          <select
                            className={`package-select ${
                              item.visibility === "Published"
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
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.trip}</td>

                        <td>
                          <input
                            type="date"
                            className="date-input"
                            value={item.date || ""}
                            onChange={(e) =>
                              updateBooking(index, "date", e.target.value)
                            }
                          />
                        </td>

                        <td>
                          <select
                            className={`status-select ${item.status?.toLowerCase()}`}
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

              {clients.map((item) => (
                <div className="package-row" key={item.id}>
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
                      <tr key={item.id}>
                        <td>{item.invoice}</td>
                        <td>{item.client}</td>
                        <td>{item.amount}</td>

                        <td>
                          <select
                            className={`payment-select ${item.status
                              ?.toLowerCase()
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
                    value={item.reply || ""}
                    onChange={(e) => updateReply(index, e.target.value)}
                  />

                  <button onClick={() => sendReply(item.id, item.reply)}>
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

      {showPackageForm && (
        <div className="package-popup-overlay">
          <div className="package-popup">
            <div className="package-popup-head">
              <div>
                <h2>Add New Package</h2>
                <p>Create a complete travel package for your clients.</p>
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
                placeholder="Package name"
                value={newPackage.name}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, name: e.target.value })
                }
              />

              <textarea
                placeholder="Write the full programme here..."
                value={newPackage.programme}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, programme: e.target.value })
                }
              />

              <div className="image-upload-box">
                <label>Package Cover Image</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePackageImage}
                />

                {newPackage.image && (
                  <img
                    src={newPackage.image}
                    alt="preview"
                    className="package-preview-image"
                  />
                )}
              </div>

              <input
                type="text"
                placeholder="Price"
                value={newPackage.price}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, price: e.target.value })
                }
              />

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