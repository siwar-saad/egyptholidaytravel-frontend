/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import AdminSettings from "./AdminSettings";
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
  FaPlus,
} from "react-icons/fa";

import Navbar from "../../components/navbar";
import API from "../../api";
import "./Admin.css";
import { FaMailBulk } from "react-icons/fa";

export default function Admin() {
  const defaultCover =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

  const [activeTab, setActiveTab] = useState("dashboard");
  const [reservationTab, setReservationTab] = useState("packages");

  const [adminSuccess, setAdminSuccess] = useState("");
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);

  const [showReplyPopup, setShowReplyPopup] = useState(false);
  const [sentReplyText, setSentReplyText] = useState("");

  const [dashboard, setDashboard] = useState(null);
  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [messages, setMessages] = useState([]);

  const [adminMessageNotifications, setAdminMessageNotifications] = useState(0);

  const [packageSearch, setPackageSearch] = useState("");
  const [hotelSearch, setHotelSearch] = useState("");
  const [reservationSearch, setReservationSearch] = useState("");
  const [clientSearch, setClientSearch] = useState("");

  const [editingClient, setEditingClient] = useState(null);

  const [subscribers, setSubscribers] = useState([]);

  const [subscriberSearch, setSubscriberSearch] = useState("");

  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [newPackage, setNewPackage] = useState({
    name: "",
    programme: "",
    price: "",
    visibility: "Private",
    image: "",
  });

  const [newHotel, setNewHotel] = useState({
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
      setDashboard({
        packages: Number(dashboardRes.data?.packages ?? 0),
        reservations: Number(dashboardRes.data?.reservations ?? 0),
        clients: Number(dashboardRes.data?.clients ?? 0),
        messages: Number(dashboardRes.data?.messages ?? 0),
      });
    } catch (err) {
      console.log("Dashboard error:", err.response?.data || err.message);
    }

    try {
      const packagesRes = await API.get("/admin/packages");
      setPackages(packagesRes.data || []);
    } catch (err) {
      console.log("Packages error:", err.response?.data || err.message);
    }

    try {
      const packageReservationsRes =
        await API.get("/admin/reservations");

      const hotelReservationsRes =
        await API.get("/hotels/bookings");

      const allBookings = [
        ...(packageReservationsRes.data || []),
        ...(hotelReservationsRes.data || []),
      ];

      setBookings(allBookings);

    } catch (err) {
      console.log(
        "Reservations error:",
        err.response?.data || err.message
      );
    }

    try {
      const clientsRes = await API.get("/admin/clients");
      setClients(clientsRes.data || []);
    } catch (err) {
      console.log("Clients error:", err.response?.data || err.message);
    }

    try {
      const paymentsRes = await API.get("/admin/payments");
      setPayments(paymentsRes.data || []);
    } catch (err) {
      console.log("Payments error:", err.response?.data || err.message);
    }

    try {
      const messagesRes = await API.get("/admin/messages");
      const messagesData = messagesRes.data || [];

      setMessages(messagesData);
      setAdminMessageNotifications(messagesData.length);
    } catch (err) {
      console.log("Messages error:", err.response?.data || err.message);
    }

    try {
      const subsRes = await API.get("/admin/subscribers");
      setSubscribers(subsRes.data || []);
    } catch (err) {
      console.log("Subscribers error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const packageReservations = bookings.filter(
    (item) => item.type === "package" || item.packageName || item.trip,
  );

  const hotelReservations = bookings.filter(
    (item) => item.type === "hotel" || item.hotelName,
  );

  const filteredPackages = packages.filter((item) =>
    `${item.name || ""} ${item.title || ""} ${item.programme || ""} ${item.price || ""
      } ${item.visibility || ""}`
      .toLowerCase()
      .includes(packageSearch.toLowerCase()),
  );

  const filteredHotels = hotels.filter((hotel) =>
    `${hotel.name || ""} ${hotel.city || ""} ${hotel.mealPlan || ""} ${hotel.singleRoom || ""
      } ${hotel.doubleRoom || ""}`
      .toLowerCase()
      .includes(hotelSearch.toLowerCase()),
  );

  const searchedPackageReservations = packageReservations.filter((booking) =>
    `${booking.name || ""} ${booking.client || ""} ${booking.packageName || ""
      } ${booking.trip || ""} ${booking.date || ""} ${booking.status || ""}`
      .toLowerCase()
      .includes(reservationSearch.toLowerCase()),
  );

  const searchedHotelReservations = hotelReservations.filter((booking) =>
    `${booking.name || ""} ${booking.client || ""} ${booking.hotelName || ""} ${booking.checkIn || ""
      } ${booking.checkOut || ""} ${booking.status || ""}`
      .toLowerCase()
      .includes(reservationSearch.toLowerCase()),
  );

  const filteredClients = clients.filter((client) =>
    `${client.name || ""} ${client.email || ""} ${client.phone || ""}`
      .toLowerCase()
      .includes(clientSearch.toLowerCase()),
  );

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
    e.target.value = "";
  };

  const removePackageImage = () => {
    setNewPackage({
      ...newPackage,
      image: "",
    });
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

    setHotels([newHotel, ...hotels]);

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

  const openAddClient = () => {
    setEditingClient(null);
    setClientForm({
      name: "",
      email: "",
      phone: "",
    });
    setShowClientForm(true);
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
                className={activeTab === "hotels" ? "active" : ""}
                onClick={() => setActiveTab("hotels")}
              >
                <FaHotel /> Hotels
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
                onClick={() => {
                  setActiveTab("messages");
                  setAdminMessageNotifications(0);
                }}
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
                onClick={() => setActiveTab("subscribers")}
              >
                <FaMailBulk /> Subscribers
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
          {adminSuccess && (
            <div className="success-alert">✅ {adminSuccess}</div>
          )}

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

                <button onClick={openAddClient}>
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

        </main>
      </div>

      {showClientForm && (
        <div className="package-popup-overlay">
          <div className="package-popup">
            <div className="package-popup-head">
              <div>
                <h2>{editingClient ? "Edit Client" : "Add New Client"}</h2>
                <p>Manage client information professionally.</p>
              </div>

              <button
                className="close-package-popup"
                onClick={() => setShowClientForm(false)}
              >
                ×
              </button>
            </div>

            <div className="package-popup-form">
              <input
                type="text"
                placeholder="Client Name"
                value={clientForm.name}
                onChange={(e) =>
                  setClientForm({ ...clientForm, name: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Client Email"
                value={clientForm.email}
                onChange={(e) =>
                  setClientForm({ ...clientForm, email: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Client Phone"
                value={clientForm.phone}
                onChange={(e) =>
                  setClientForm({ ...clientForm, phone: e.target.value })
                }
              />

              <div className="package-popup-actions">
                <button onClick={saveClient}>
                  {editingClient ? "Save Changes" : "Add Client"}
                </button>

                <button
                  className="cancel-package-btn"
                  onClick={() => setShowClientForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  setNewPackage({ ...newPackage, programme: e.target.value })
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

              <input
                type="file"
                accept="image/*"
                onChange={handlePackageImage}
              />

              {newPackage.image && (
                <div className="hotel-preview-grid">
                  <div className="hotel-preview-item">
                    <img src={newPackage.image} alt="preview" />

                    <button type="button" onClick={removePackageImage}>
                      ×
                    </button>
                  </div>
                </div>
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

      {showHotelForm && (
        <div className="package-popup-overlay">
          <div className="package-popup">
            <div className="package-popup-head">
              <div>
                <h2>Add New Hotel</h2>
                <p>Add hotel details, photos, prices and travel periods.</p>
              </div>

              <button
                className="close-package-popup"
                onClick={() => setShowHotelForm(false)}
              >
                ×
              </button>
            </div>

            <div className="package-popup-form">
              <input
                type="text"
                placeholder="Hotel Name"
                value={newHotel.name}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, name: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="City"
                value={newHotel.city}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, city: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Meal Plan"
                value={newHotel.mealPlan}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, mealPlan: e.target.value })
                }
              />

              <input
                type="date"
                value={newHotel.fromDate}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, fromDate: e.target.value })
                }
              />

              <input
                type="date"
                value={newHotel.toDate}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, toDate: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Single Room Price"
                value={newHotel.singleRoom}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, singleRoom: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Double Room Price"
                value={newHotel.doubleRoom}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, doubleRoom: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Triple Room / Note"
                value={newHotel.tripleRoom}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, tripleRoom: e.target.value })
                }
              />

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleHotelImages}
              />

              {newHotel.images.length > 0 && (
                <div className="hotel-preview-grid">
                  {newHotel.images.map((img, index) => (
                    <div className="hotel-preview-item" key={index}>
                      <img src={img} alt="hotel preview" />

                      <button
                        type="button"
                        onClick={() => removeHotelImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="package-popup-actions">
                <button onClick={addHotel}>Save Hotel</button>

                <button
                  className="cancel-package-btn"
                  onClick={() => setShowHotelForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReplyPopup && (
        <div className="message-success-overlay">
          <div className="message-success-popup">
            <div className="message-success-icon">✓</div>

            <h2>Reply Sent Successfully</h2>

            <p>
              Your message has been sent to the client in a professional way.
            </p>

            <div className="sent-message-box">{sentReplyText}</div>

            <button onClick={() => setShowReplyPopup(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
