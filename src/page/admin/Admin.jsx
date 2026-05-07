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
} from "react-icons/fa";

import Navbar from "../../components/navbar";
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
    pdf: "Missing",
    image: "",
  });

  const [bookings, setBookings] = useState([
    { name: "Sarah M.", trip: "Hurghada", date: "2026-06-15", status: "Confirmed" },
    { name: "Ahmed K.", trip: "Turkey Trip", date: "2026-07-22", status: "Pending" },
  ]);

  const [packages, setPackages] = useState([
    {
      name: "Hurghada",
      programme: "5 days / 4 nights including hotel, transfers, and sea activities.",
      price: "$580",
      pdf: "Uploaded",
      image: "",
    },
    {
      name: "Turkey Trip",
      programme: "7 days including Istanbul city tour, hotel stay, and transfers.",
      price: "$750",
      pdf: "Uploaded",
      image: "",
    },
    {
      name: "Cairo",
      programme: "Cairo city tour including pyramids, museum, and Nile dinner.",
      price: "$450",
      pdf: "Missing",
      image: "",
    },
  ]);

  const [payments, setPayments] = useState([
    { invoice: "Hurghada Invoice", client: "Siwar Saad", amount: "$580", status: "Paid" },
    { invoice: "Turkey Trip Invoice", client: "Ahmed Khaled", amount: "$750", status: "Not Paid" },
  ]);

  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("clientMessages")) || []
  );

  const clients = [
    { name: "Siwar Saad", email: "siwar@email.com", phone: "+20 109 999 9234" },
    { name: "Ahmed Khaled", email: "ahmed@email.com", phone: "+20 100 222 3344" },
  ];

  const stats = [
    { title: "Packages", value: packages.length, icon: "📦" },
    { title: "Reservations", value: bookings.length, icon: "🧾" },
    { title: "Clients", value: clients.length, icon: "👥" },
    { title: "Messages", value: messages.length, icon: "💬" },
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

  const updatePackageStatus = (index, value) => {
    const updated = [...packages];
    updated[index].pdf = value;
    setPackages(updated);
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

  const addPackage = () => {
    if (
      !newPackage.name.trim() ||
      !newPackage.programme.trim() ||
      !newPackage.price.trim()
    ) {
      setAdminSuccess("Please fill in the package name, programme and price.");
      setTimeout(() => setAdminSuccess(""), 3500);
      return;
    }

    setPackages([newPackage, ...packages]);

    setNewPackage({
      name: "",
      programme: "",
      price: "",
      pdf: "Missing",
      image: "",
    });

    setShowPackageForm(false);
    setAdminSuccess("New package has been added successfully.");
    setTimeout(() => setAdminSuccess(""), 3500);
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
    setTimeout(() => setAdminSuccess(""), 4000);
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
              <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
                <FaHome /> Dashboard
              </button>

              <button className={activeTab === "packages" ? "active" : ""} onClick={() => setActiveTab("packages")}>
                <FaBoxOpen /> Packages
              </button>

              <button className={activeTab === "reservations" ? "active" : ""} onClick={() => setActiveTab("reservations")}>
                <FaCalendarCheck /> Reservations
              </button>

              <button className={activeTab === "clients" ? "active" : ""} onClick={() => setActiveTab("clients")}>
                <FaUsers /> Clients
              </button>

              <button className={activeTab === "payments" ? "active" : ""} onClick={() => setActiveTab("payments")}>
                <FaCreditCard /> Payments
              </button>

              <button className={activeTab === "messages" ? "active" : ""} onClick={() => setActiveTab("messages")}>
                <FaEnvelope /> Messages
              </button>

              <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>
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
                  <p>Manage your travel packages, programme and PDF status.</p>
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
                      <th>PDF Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {packages.map((item, index) => (
                      <tr key={index}>
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

                        <td>{item.price}</td>

                        <td>
                          <select
                            className={`package-select ${
                              item.pdf === "Uploaded" ? "uploaded" : "missing"
                            }`}
                            value={item.pdf}
                            onChange={(e) =>
                              updatePackageStatus(index, e.target.value)
                            }
                          >
                            <option value="Uploaded">Uploaded</option>
                            <option value="Missing">Missing</option>
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
                    onChange={(e) => updateReply(index, e.target.value)}
                  />

                  <button onClick={sendReply}>Send Reply</button>
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
                value={newPackage.pdf}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, pdf: e.target.value })
                }
              >
                <option value="Uploaded">Uploaded</option>
                <option value="Missing">Missing</option>
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