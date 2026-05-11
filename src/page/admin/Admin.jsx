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

  /* =========================
     STATES
  ========================= */

  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminSuccess, setAdminSuccess] = useState("");
  const [showPackageForm, setShowPackageForm] = useState(false);

  const [settingsPopup, setSettingsPopup] = useState(null);

  const [agencyInfo, setAgencyInfo] = useState({
    name: "Egypt Holiday Travel",
    email: "info@egyptholidaytravel.com",
    address: "Cairo, Egypt",
  });

  const [adminPassword, setAdminPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [contactInfo, setContactInfo] = useState({
    phone1: "",
    phone2: "",
    whatsapp: "",
  });

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

  /* =========================
     FUNCTIONS
  ========================= */

  const showSuccess = (msg) => {
    setAdminSuccess(msg);

    setTimeout(() => {
      setAdminSuccess("");
    }, 3500);
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

  /* =========================
     USE EFFECT
  ========================= */

  useEffect(() => {
    fetchDashboard();
    fetchPackages();
    fetchReservations();
    fetchClients();
    fetchPayments();
    fetchMessages();
  }, []);

  /* =========================
     ACTIONS
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/login");
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
      showSuccess(
        "Please fill package name, programme and price."
      );

      return;
    }

    try {
      const res = await API.post(
        "/admin/packages",
        newPackage
      );

      setPackages([res.data, ...packages]);

      setNewPackage({
        name: "",
        programme: "",
        price: "",
        visibility: "Private",
        image: "",
      });

      setShowPackageForm(false);

      showSuccess(
        "New package added successfully."
      );

      fetchDashboard();

    } catch (err) {
      console.log("Add package error:", err);
    }
  };

  const stats = [
    {
      title: "Packages",
      value: dashboard.packages,
      icon: "📦",
    },
    {
      title: "Reservations",
      value: dashboard.reservations,
      icon: "🧾",
    },
    {
      title: "Clients",
      value: dashboard.clients,
      icon: "👥",
    },
    {
      title: "Messages",
      value: dashboard.messages,
      icon: "💬",
    },
  ];

  return (
    <div className="admin-wrapper">

      <Navbar />

      <div className="admin-page">

        {/* SIDEBAR */}

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

          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </button>

        </aside>

        {/* MAIN */}

        <main className="admin-main">

          <header className="admin-top">

            <div>

              <span className="admin-label">
                Welcome back, Admin
              </span>

              <h1>
                {activeTab.charAt(0).toUpperCase() +
                  activeTab.slice(1)}
              </h1>

            </div>

          </header>

          {adminSuccess && (
            <div className="success-alert">
              ✅ {adminSuccess}
            </div>
          )}

          {/* DASHBOARD */}

          {activeTab === "dashboard" && (

            <section className="admin-stats">

              {stats.map((item, index) => (

                <div
                  className="admin-stat-card"
                  key={index}
                >

                  <div>
                    <p>{item.title}</p>
                    <h3>{item.value}</h3>
                  </div>

                  <span>{item.icon}</span>

                </div>

              ))}

            </section>
          )}

          {/* PACKAGES */}

          {activeTab === "packages" && (

            <section className="admin-panel">

              <div className="panel-head">

                <div>
                  <h2>Packages</h2>

                  <p>
                    Manage your travel packages and programmes.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowPackageForm(true)
                  }
                >
                  <FaPlus /> Add New Package
                </button>

              </div>

            </section>
          )}

          {/* SETTINGS */}

          {activeTab === "settings" && (

            <section className="admin-panel">

              <h2>Settings</h2>

              <div className="quick-actions">

                <button
                  onClick={() =>
                    setSettingsPopup("agency")
                  }
                >
                  Edit Agency Information
                </button>

                <button
                  onClick={() =>
                    setSettingsPopup("password")
                  }
                >
                  Change Admin Password
                </button>

                <button
                  onClick={() =>
                    setSettingsPopup("contact")
                  }
                >
                  Update Contact Numbers
                </button>

              </div>

            </section>
          )}

        </main>

      </div>

      {/* SETTINGS POPUP */}

      {settingsPopup && (

        <div className="settings-popup-overlay">

          <div className="settings-popup">

            <button
              className="settings-close"
              onClick={() =>
                setSettingsPopup(null)
              }
            >
              ×
            </button>

            {/* AGENCY */}

            {settingsPopup === "agency" && (
              <>

                <h2>Edit Agency Information</h2>

                <p>
                  Update your agency details displayed
                  across the website.
                </p>

                <input
                  type="text"
                  placeholder="Agency Name"
                  value={agencyInfo.name}
                  onChange={(e) =>
                    setAgencyInfo({
                      ...agencyInfo,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  type="email"
                  placeholder="Agency Email"
                  value={agencyInfo.email}
                  onChange={(e) =>
                    setAgencyInfo({
                      ...agencyInfo,
                      email: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="Agency Address"
                  value={agencyInfo.address}
                  onChange={(e) =>
                    setAgencyInfo({
                      ...agencyInfo,
                      address: e.target.value,
                    })
                  }
                />

                <button
                  className="settings-save"
                  onClick={() => {

                    showSuccess(
                      "Agency information updated successfully."
                    );

                    setSettingsPopup(null);
                  }}
                >
                  Save Changes
                </button>

              </>
            )}

            {/* PASSWORD */}

            {settingsPopup === "password" && (
              <>

                <h2>Change Admin Password</h2>

                <p>
                  Choose a strong password to keep
                  your admin account secure.
                </p>

                <input
                  type="password"
                  placeholder="Current Password"
                  value={adminPassword.oldPassword}
                  onChange={(e) =>
                    setAdminPassword({
                      ...adminPassword,
                      oldPassword:
                        e.target.value,
                    })
                  }
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={adminPassword.newPassword}
                  onChange={(e) =>
                    setAdminPassword({
                      ...adminPassword,
                      newPassword:
                        e.target.value,
                    })
                  }
                />

                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={
                    adminPassword.confirmPassword
                  }
                  onChange={(e) =>
                    setAdminPassword({
                      ...adminPassword,
                      confirmPassword:
                        e.target.value,
                    })
                  }
                />

                <button
                  className="settings-save"
                  onClick={() => {

                    if (
                      adminPassword.newPassword !==
                      adminPassword.confirmPassword
                    ) {

                      showSuccess(
                        "Passwords do not match."
                      );

                      return;
                    }

                    showSuccess(
                      "Password updated successfully."
                    );

                    setSettingsPopup(null);
                  }}
                >
                  Update Password
                </button>

              </>
            )}

            {/* CONTACT */}

            {settingsPopup === "contact" && (
              <>

                <h2>Update Contact Numbers</h2>

                <p>
                  Keep your agency phone and
                  WhatsApp numbers updated.
                </p>

                <input
                  type="text"
                  placeholder="Main Phone Number"
                  value={contactInfo.phone1}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      phone1:
                        e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="Second Phone Number"
                  value={contactInfo.phone2}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      phone2:
                        e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="WhatsApp Number"
                  value={contactInfo.whatsapp}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      whatsapp:
                        e.target.value,
                    })
                  }
                />

                <button
                  className="settings-save"
                  onClick={() => {

                    showSuccess(
                      "Contact numbers updated successfully."
                    );

                    setSettingsPopup(null);
                  }}
                >
                  Save Contact Numbers
                </button>

              </>
            )}

          </div>

        </div>
      )}

      {/* ADD PACKAGE POPUP */}

      {showPackageForm && (

        <div className="package-popup-overlay">

          <div className="package-popup">

            <div className="package-popup-head">

              <div>

                <h2>Add New Package</h2>

                <p>
                  Create a complete travel package.
                </p>

              </div>

              <button
                className="close-package-popup"
                onClick={() =>
                  setShowPackageForm(false)
                }
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
                  setNewPackage({
                    ...newPackage,
                    name: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Full Programme"
                value={newPackage.programme}
                onChange={(e) =>
                  setNewPackage({
                    ...newPackage,
                    programme:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Price"
                value={newPackage.price}
                onChange={(e) =>
                  setNewPackage({
                    ...newPackage,
                    price: e.target.value,
                  })
                }
              />

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

              <select
                value={newPackage.visibility}
                onChange={(e) =>
                  setNewPackage({
                    ...newPackage,
                    visibility:
                      e.target.value,
                  })
                }
              >
                <option value="Published">
                  Published
                </option>

                <option value="Private">
                  Private
                </option>

              </select>

              <div className="package-popup-actions">

                <button onClick={addPackage}>
                  Save Package
                </button>

                <button
                  className="cancel-package-btn"
                  onClick={() =>
                    setShowPackageForm(false)
                  }
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