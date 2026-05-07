import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaEdit,
  FaLock,
  FaHeadset,
  FaPlane,
  FaHome,
  FaSuitcaseRolling,
  FaCreditCard,
  FaCog,
} from "react-icons/fa";

import Navbar from "../../../components/navbar";
import "./UserProfile.css";

export default function UserProfile() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [image, setImage] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [userMessages, setUserMessages] = useState(
    JSON.parse(localStorage.getItem("clientMessages")) || []
  );

  const [user, setUser] = useState({
    name: "Siwar Saad",
    email: "siwar@email.com",
    phone: "+20 109 999 9234",
    city: "Mansoura",
    country: "Egypt",
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const sendMessage = () => {
    if (!messageText.trim()) {
      setSuccessMessage("Please write your message before sending.");
      setTimeout(() => setSuccessMessage(""), 3500);
      return;
    }

    const newMessage = {
      id: Date.now(),
      name: user.name,
      email: user.email,
      message: messageText,
      reply: "",
      date: new Date().toLocaleDateString(),
    };

    const updated = [newMessage, ...userMessages];

    setUserMessages(updated);
    localStorage.setItem("clientMessages", JSON.stringify(updated));
    setMessageText("");

    setSuccessMessage(
      "Your message has been sent successfully. Our agency team will review it and reply as soon as possible."
    );

    setTimeout(() => setSuccessMessage(""), 4000);
  };

  return (
    <div className="user-page">
      <Navbar />

      <main className="user-container">
        <aside className="client-sidebar">
          <div className="client-sidebar-brand">
            <FaPlane />
            <h2>Egypt Holiday</h2>
            <p>Client Panel</p>
          </div>

          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaHome /> Dashboard
          </button>

          <button
            className={activeTab === "booking" ? "active" : ""}
            onClick={() => setActiveTab("booking")}
          >
            <FaSuitcaseRolling /> My Booking
          </button>

          <button
            className={activeTab === "payment" ? "active" : ""}
            onClick={() => setActiveTab("payment")}
          >
            <FaCreditCard /> Payment
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

          <button className="sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </aside>

        <section className="client-content">
          <div className="user-hero">
            <div className="user-main-info">
              <div className="profile-avatar">
                {image ? <img src={image} alt="Profile" /> : user.name.charAt(0)}
              </div>

              <div>
                <h1>Hello, {user.name}</h1>
                <p>Manage your account, bookings, payments, and settings.</p>

                <label className="upload-btn">
                  Change photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setImage(URL.createObjectURL(file));
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {activeTab === "dashboard" && (
            <div className="user-grid">
              <div className="user-card big-card">
                <h2>Personal Information</h2>

                <div className="info-list">
                  <div>
                    <FaUser />
                    <span>Name</span>
                    <strong>{user.name}</strong>
                  </div>

                  <div>
                    <FaEnvelope />
                    <span>Email</span>
                    <strong>{user.email}</strong>
                  </div>

                  <div>
                    <FaPhone />
                    <span>Phone</span>
                    <strong>{user.phone}</strong>
                  </div>

                  <div>
                    <FaMapMarkerAlt />
                    <span>Location</span>
                    <strong>
                      {user.city}, {user.country}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="user-card support-card">
                <h2>Support</h2>
                <p>Need help with your booking or travel details?</p>

                <button onClick={() => setShowContact(true)}>
                  <FaHeadset /> Contact Agency
                </button>
              </div>
            </div>
          )}

          {activeTab === "booking" && (
            <div className="page-section">
              <h2>My Booking</h2>

              <div className="booking-list">
                <div className="booking-pro-card">
                  <div>
                    <h3>Hurghada Summer Package</h3>
                    <p>15 June 2026 • 5 Days / 4 Nights</p>
                  </div>
                  <span className="status confirmed">Confirmed</span>
                </div>

                <div className="booking-pro-card">
                  <div>
                    <h3>Turkey Trip</h3>
                    <p>22 July 2026 • Waiting for agency approval</p>
                  </div>
                  <span className="status pending">Pending</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="page-section">
              <h2>Payment</h2>

              <div className="payment-card-pro">
                <span>Hurghada Invoice</span>
                <strong className="paid">Paid</strong>
              </div>

              <div className="payment-card-pro">
                <span>Turkey Trip Invoice</span>
                <strong className="unpaid">Not Paid</strong>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="page-section">
              <h2>Messages</h2>
              <p className="section-desc">
                Send your request to the agency. Our team will reply as soon as possible.
              </p>

              {successMessage && <div className="success-alert">✅ {successMessage}</div>}

              <div className="message-box">
                <textarea
                  placeholder="Write your message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />

                <button onClick={sendMessage}>Send Message</button>
              </div>

              <div className="messages-list">
                {userMessages.length === 0 && (
                  <p className="empty-msg">No messages yet.</p>
                )}

                {userMessages.map((msg) => (
                  <div className="user-message-card" key={msg.id}>
                    <div className="msg-date">{msg.date}</div>

                    <h3>Your Message</h3>
                    <p>{msg.message}</p>

                    <div className="admin-reply">
                      <strong>Agency Reply</strong>
                      <span>
                        {msg.reply ||
                          "Your message was received successfully. Our admin team will reply as soon as possible."}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="page-section">
              <h2>Settings</h2>

              <div className="settings-actions">
                <button onClick={() => setShowEdit(true)}>
                  <FaEdit /> Edit Profile
                </button>

                <button onClick={() => setShowPassword(true)}>
                  <FaLock /> Change Password
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {showContact && (
        <div className="contact-popup-overlay">
          <div className="contact-popup">
            <div className="contact-header">
              <h2>Contact Our Agency</h2>
              <p>Our team is available to help you anytime.</p>
            </div>

            <div className="contact-grid">
              <a href="tel:01099999234">☎️ 01099999234</a>
              <a href="tel:01050971444">☎️ 01050971444</a>
              <a href="tel:01050383173">☎️ 01050383173</a>
              <a href="tel:01111787867">☎️ 01111787867</a>
              <a href="tel:01001579926">☎️ 01001579926</a>
              <a href="tel:01050972333">☎️ 01050972333</a>
            </div>

            <button
              className="close-contact-btn"
              onClick={() => setShowContact(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="popup-overlay">
          <div className="profile-popup">
            <h2>Edit Profile</h2>

            <input
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Full name"
            />

            <input
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Email"
            />

            <input
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              placeholder="Phone"
            />

            <input
              value={user.city}
              onChange={(e) => setUser({ ...user, city: e.target.value })}
              placeholder="City"
            />

            <select
              value={user.country}
              onChange={(e) => setUser({ ...user, country: e.target.value })}
            >
              <option>Egypt</option>
              <option>Tunisia</option>
              <option>Turkey</option>
              <option>France</option>
              <option>Italy</option>
              <option>Morocco</option>
            </select>

            <div className="popup-actions">
              <button onClick={() => setShowEdit(false)}>Save</button>
              <button className="cancel-btn" onClick={() => setShowEdit(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPassword && (
        <div className="popup-overlay">
          <div className="profile-popup">
            <h2>Change Password</h2>

            <input type="password" placeholder="Current password" />
            <input type="password" placeholder="New password" />
            <input type="password" placeholder="Confirm password" />

            <div className="popup-actions">
              <button onClick={() => setShowPassword(false)}>Save</button>
              <button
                className="cancel-btn"
                onClick={() => setShowPassword(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}