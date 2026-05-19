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

<<<<<<< HEAD
=======
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

  const handleHotelImages = (e) => {
    const files = Array.from(e.target.files || []);
    const images = files.map((file) => URL.createObjectURL(file));

    setNewHotel({
      ...newHotel,
      images: [...newHotel.images, ...images],
    });

    e.target.value = "";
  };

  const removeHotelImage = (index) => {
    setNewHotel({
      ...newHotel,
      images: newHotel.images.filter((_, i) => i !== index),
    });
  };

  const addHotel = () => {
    if (!newHotel.name || !newHotel.city || !newHotel.mealPlan) {
      showSuccess("Please fill hotel information.");
      return;
    }

    const handleAddHotel = async () => {
      try {
        const response = await API.post("/hotels", hotelForm);

        setHotels((prev) => [...prev, response.data]);

        setHotelForm({
          name: "",
          city: "",
          image: "",
          description: "",
          price: "",
        });

        setShowHotelPopup(false);
      } catch (error) {
        alert(error.response?.data?.error || "Unable to add hotel");
      }
    };
    setNewHotel({
      name: "",
      city: "",
      mealPlan: "",
      fromDate: "",
      toDate: "",
      singleRoom: "",
      doubleRoom: "",
      tripleRoom: "",
      images: [],
    });

    setShowHotelForm(false);
    showSuccess("Hotel added successfully.");
  };

  const handleAddClient = async () => {
    try {
      const response = await API.post(
        "/admin/clients",
        clientForm
      );

      setClients((prev) => [
        ...prev,
        response.data,
      ]);

      setShowClientPopup(false);

    } catch (error) {
      alert(
        error.response?.data?.error ||
        "Unable to add client"
      );
    }
  };

  const openEditClient = (client) => {
    setEditingClient(client);
    setClientForm({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
    });
    setShowClientForm(true);
  };

  const saveClient = () => {
    if (!clientForm.name || !clientForm.email) {
      showSuccess("Please fill client name and email.");
      return;
    }

    if (editingClient) {
      setClients(
        clients.map((client) =>
          client.id === editingClient.id
            ? { ...client, ...clientForm }
            : client,
        ),
      );

      showSuccess("Client updated successfully.");
    } else {
      setClients([
        {
          id: Date.now(),
          ...clientForm,
        },
        ...clients,
      ]);

      showSuccess("Client added successfully.");
    }

    setShowClientForm(false);
    setEditingClient(null);
  };

  const deleteClient = (id) => {
    setClients(clients.filter((client) => client.id !== id));
    showSuccess("Client deleted successfully.");
  };

  const updateReservationStatus = async (id, status) => {
    try {
      await API.put(`/admin/reservations/${id}/status`, { status });
      setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
      showSuccess("Reservation status updated.");
    } catch (err) {
      console.log("Reservation error:", err.response?.data || err.message);
    }
  };

  const replyMessage = async (id, reply) => {
    if (!reply || !reply.trim()) {
      showSuccess("Please write a reply first.");
      return;
    }

    try {
      await API.put(`/admin/messages/${id}/reply`, { reply });

      setMessages(messages.map((m) => (m.id === id ? { ...m, reply } : m)));

      setSentReplyText(reply);
      setShowReplyPopup(true);
    } catch (err) {
      console.log("Reply error:", err.response?.data || err.message);
    }
  };

  const stats = [
    { title: "Packages", value: dashboard?.packages ?? 0, icon: "📦" },
    { title: "Reservations", value: dashboard?.reservations ?? 0, icon: "🧾" },
    { title: "Clients", value: dashboard?.clients ?? 0, icon: "👥" },
    { title: "Messages", value: dashboard?.messages ?? 0, icon: "💬" },
  ];

  const filteredSubscribers = subscribers.filter((item) =>
    item.email?.toLowerCase().includes(subscriberSearch.toLowerCase())
  );

>>>>>>> dd573efc3fb585cd7aae73321ab5d7eefd4ff26c
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

<<<<<<< HEAD
          {renderContent()}
=======
          {activeTab === "dashboard" && (
            <section className="admin-panel">
              <div className="panel-head">
                <div>
                  <h2>Dashboard</h2>
                  <p>Overview of the admin panel.</p>
                </div>
              </div>

              <div className="dashboard-grid">
                {stats.map((item) => (
                  <div key={item.title} className="dashboard-card">
                    <span className="dashboard-icon">{item.icon}</span>
                    <div>
                      <h3>{item.value}</h3>
                      <p>{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "packages" && (
            <section className="admin-panel">
              <div className="panel-head">
                <div>
                  <h2>Packages</h2>
                  <p>Manage your travel packages and programmes.</p>
                </div>

                <button
                  className="add-package-btn-pro"
                  onClick={() => setShowPackageForm(true)}
                >
                  <FaPlus /> Add New Package
                </button>
              </div>

              <div className="client-tools">
                <input
                  type="text"
                  placeholder="Search packages by name, programme or price..."
                  value={packageSearch}
                  onChange={(e) => setPackageSearch(e.target.value)}
                />
              </div>

              {filteredPackages.length === 0 ? (
                <p className="empty-msg">No packages found.</p>
              ) : (
                <div className="packages-admin-grid">
                  {filteredPackages.map((item, index) => (
                    <div className="package-admin-card" key={item.id || index}>
                      <img
                        src={
                          item.image ||
                          item.image_url ||
                          item.cover ||
                          defaultCover
                        }
                        alt={item.name}
                        className="package-admin-image"
                        onError={(e) => {
                          e.currentTarget.src = defaultCover;
                        }}
                      />

                      <div className="package-admin-content">
                        <h3>{item.name}</h3>

                        <p>
                          {item.programme ||
                            "No programme added for this package yet."}
                        </p>

                        <div className="package-admin-meta">
                          <span>{item.price || "No price"}</span>
                          <span>{item.visibility || "Private"}</span>
                        </div>
                      </div>

                      <div className="package-admin-actions">
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
                              const realIndex = packages.findIndex(
                                (p) => p.id === item.id,
                              );
                              updatePackageVisibility(
                                realIndex === -1 ? index : realIndex,
                                e.target.value,
                              );
                            }
                          }}
                        >
                          <option value="Published">Published</option>
                          <option value="Private">Private</option>
                          <option value="Delete">Delete</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "hotels" && (
            <section className="admin-panel">
              <div className="panel-head">
                <div>
                  <h2>Hotels</h2>
                  <p>
                    Manage hotel photos, meal plans, prices and travel periods.
                  </p>
                </div>

                <button
                  className="add-package-btn-pro"
                  onClick={() => setShowHotelForm(true)}
                >
                  <FaPlus /> Add New Hotel
                </button>
              </div>

              <div className="client-tools">
                <input
                  type="text"
                  placeholder="Search hotels by name, city or meal plan..."
                  value={hotelSearch}
                  onChange={(e) => setHotelSearch(e.target.value)}
                />
              </div>

              {filteredHotels.length === 0 ? (
                <p className="empty-msg">No hotels found.</p>
              ) : (
                <div className="packages-admin-grid">
                  {filteredHotels.map((hotel, index) => (
                    <div className="package-admin-card" key={index}>
                      <img
                        src={hotel.images[0] || defaultCover}
                        alt={hotel.name}
                        className="package-admin-image"
                        onError={(e) => {
                          e.currentTarget.src = defaultCover;
                        }}
                      />

                      <div className="package-admin-content">
                        <h3>{hotel.name}</h3>

                        <p>
                          <strong>City:</strong> {hotel.city} <br />
                          <strong>Meal Plan:</strong> {hotel.mealPlan} <br />
                          <strong>Period:</strong> {hotel.fromDate || "No date"}{" "}
                          → {hotel.toDate || "No date"}
                        </p>

                        <div className="package-admin-meta">
                          <span>Single: {hotel.singleRoom || "-"} USD</span>
                          <span>Double: {hotel.doubleRoom || "-"} USD</span>
                          <span>Triple: {hotel.tripleRoom || "-"} USD</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "reservations" && (
            <section className="admin-panel">
              <div className="panel-head">
                <div>
                  <h2>Reservations</h2>
                  <p>Manage package and hotel reservations separately.</p>
                </div>
              </div>

              <div className="reservation-switcher">
                <button
                  className={reservationTab === "packages" ? "active" : ""}
                  onClick={() => setReservationTab("packages")}
                >
                  Packages Reservations
                </button>

                <button
                  className={reservationTab === "hotels" ? "active" : ""}
                  onClick={() => setReservationTab("hotels")}
                >
                  Hotels Reservations
                </button>
              </div>

              <div className="client-tools">
                <input
                  type="text"
                  placeholder="Search reservations by client, trip, hotel or date..."
                  value={reservationSearch}
                  onChange={(e) => setReservationSearch(e.target.value)}
                />
              </div>

              {reservationTab === "packages" &&
                (searchedPackageReservations.length === 0 ? (
                  <p className="empty-msg">No package reservations found.</p>
                ) : (
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
                        {searchedPackageReservations.map((booking) => (
                          <tr key={booking.id}>
                            <td>{booking.name || booking.client}</td>
                            <td>{booking.packageName || booking.trip}</td>
                            <td>{booking.date}</td>

                            <td>
                              <select
                                className={`status-select ${booking.status === "Confirmed"
                                  ? "confirmed"
                                  : booking.status === "Cancelled"
                                    ? "cancelled"
                                    : "pending"
                                  }`}
                                value={booking.status || "Pending"}
                                onChange={(e) =>
                                  updateReservationStatus(
                                    booking.id,
                                    e.target.value,
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
                ))}

              {reservationTab === "hotels" &&
                (searchedHotelReservations.length === 0 ? (
                  <p className="empty-msg">No hotel reservations found.</p>
                ) : (
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Client</th>
                          <th>Hotel</th>
                          <th>Check In</th>
                          <th>Check Out</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {searchedHotelReservations.map((booking) => (
                          <tr key={booking.id}>
                            <td>{booking.name || booking.client}</td>
                            <td>{booking.hotelName}</td>
                            <td>{booking.checkIn || booking.date}</td>
                            <td>{booking.checkOut || "-"}</td>

                            <td>
                              <select
                                className={`status-select ${booking.status === "Confirmed"
                                  ? "confirmed"
                                  : booking.status === "Cancelled"
                                    ? "cancelled"
                                    : "pending"
                                  }`}
                                value={booking.status || "Pending"}
                                onChange={(e) =>
                                  updateReservationStatus(
                                    booking.id,
                                    e.target.value,
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
                ))}
            </section>
          )}

          {activeTab === "clients" && (
            <section className="admin-panel">
              <div className="panel-head">
                <div>
                  <h2>Clients</h2>
                  <p>Manage your agency clients.</p>
                </div>

                <button onClick={handleAddClient}>
                  <FaPlus /> Add Client
                </button>
              </div>

              <div className="client-tools">
                <input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                />
              </div>

              {filteredClients.length === 0 ? (
                <p className="empty-msg">No clients found.</p>
              ) : (
                <div className="clients-grid">
                  {filteredClients.map((client) => (
                    <div className="client-card" key={client.id}>
                      <div>
                        <h3>{client.name}</h3>
                        <p>{client.email}</p>
                        <span>{client.phone || "No phone"}</span>
                      </div>

                      <div className="client-actions">
                        <button onClick={() => openEditClient(client)}>
                          Edit
                        </button>

                        <button
                          className="delete-client-btn"
                          onClick={() => deleteClient(client.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
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
              <div className="panel-head">
                <div>
                  <h2>Messages</h2>
                  <p>Reply to your clients professionally.</p>
                </div>
              </div>

              {messages.length === 0 ? (
                <p className="empty-msg">No messages yet.</p>
              ) : (
                <div className="admin-messages-wrapper">
                  {messages.map((msg) => (
                    <div className="admin-message-card" key={msg.id}>
                      <div className="admin-message-head">
                        <div className="admin-message-user">
                          <div className="admin-message-avatar">
                            {(msg.name || "C").charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <h3>{msg.name || "Client"}</h3>
                            <p>{msg.email}</p>
                          </div>
                        </div>

                        <span className="admin-message-date">
                          {msg.date || "Today"}
                        </span>
                      </div>

                      <div className="client-msg">{msg.message}</div>

                      <textarea
                        placeholder="Write your professional reply here..."
                        value={msg.reply || ""}
                        onChange={(e) =>
                          setMessages(
                            messages.map((m) =>
                              m.id === msg.id
                                ? { ...m, reply: e.target.value }
                                : m,
                            ),
                          )
                        }
                      />

                      <div className="admin-message-actions">
                        <button onClick={() => replyMessage(msg.id, msg.reply)}>
                          Send Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "settings" && <AdminSettings />}

          {activeTab === "subscribers" && (
            <section className="admin-panel">
              <div className="panel-head">
                <div>
                  <h2>Email Subscribers</h2>
                  <p>
                    Users who subscribed from the home page newsletter.
                  </p>
                </div>

                <div className="admin-search-box">
                  <input
                    type="text"
                    placeholder="Search subscriber..."
                    value={subscriberSearch}
                    onChange={(e) =>
                      setSubscriberSearch(e.target.value)
                    }
                  />
                </div>
              </div>

              {filteredSubscribers.length === 0 ? (
                <p className="empty-msg">No subscribers found.</p>
              ) : (
                <div className="subscribers-grid">
                  {filteredSubscribers.map((item) => (
                    <div className="subscriber-card" key={item.id}>
                      <div>
                        <h3>{item.email}</h3>

                        <p>
                          {item.created_at || "New subscriber"}
                        </p>
                      </div>

                      <span>Subscribed</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

>>>>>>> dd573efc3fb585cd7aae73321ab5d7eefd4ff26c
        </main>
      </div>
    </div>
  );
}