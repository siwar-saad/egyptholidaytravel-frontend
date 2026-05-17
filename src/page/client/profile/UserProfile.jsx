/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import API from "../../../api";
import "./UserProfile.css";
import Navbar from "../../../components/navbar";
import {
  FaPlane,
  FaHome,
  FaBriefcase,
  FaCreditCard,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaHeadset,
  FaEdit,
  FaLock,
} from "react-icons/fa";

const UserProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [activePage, setActivePage] = useState("dashboard");

  const [user, setUser] = useState({
    name: storedUser.name || "Client",
    email: storedUser.email || "",
    phone: storedUser.phone || "No phone",
    city: storedUser.city || "Mansoura",
    country: storedUser.country || "Egypt",
    avatar: storedUser.avatar || "",
  });

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [messages, setMessages] = useState([]);

  const [messageText, setMessageText] = useState("");
  const [replyTexts, setReplyTexts] = useState({});
  const [messageNotifications, setMessageNotifications] = useState(0);

  const [showClientPopup, setShowClientPopup] = useState(false);
  const [sentMessageText, setSentMessageText] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const [editForm, setEditForm] = useState(user);

  const [bookingTab, setBookingTab] = useState("packages");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadClientData = async () => {
      try {
        const profileRes = await API.get("/client/profile");
        const bookingsRes = await API.get("/client/bookings");
        const paymentsRes = await API.get("/client/payments");
        const messagesRes = await API.get("/client/messages");

        const profileData = {
          ...profileRes.data,
          name: profileRes.data.name || storedUser.name || "Client",
          email: profileRes.data.email || storedUser.email || "",
          phone: profileRes.data.phone || storedUser.phone || "No phone",
          city: profileRes.data.city || storedUser.city || "Mansoura",
          country: profileRes.data.country || storedUser.country || "Egypt",
          avatar: storedUser.avatar || profileRes.data.avatar || "",
        };

        const clientMessages = messagesRes.data || [];

        setUser(profileData);
        setEditForm(profileData);
        setBookings(bookingsRes.data || []);
        setPayments(paymentsRes.data || []);
        setMessages(clientMessages);

        setMessageNotifications(
          clientMessages.filter((msg) => msg.reply).length,
        );

        localStorage.setItem("user", JSON.stringify(profileData));
      } catch (err) {
        console.log("CLIENT DATA ERROR:", err.response?.data || err.message);
      }
    };

    loadClientData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const res = await API.put("/client/profile", {
        name: editForm.name,
        phone: editForm.phone,
        city: editForm.city,
        country: editForm.country,
        avatar: editForm.avatar,
      });

      const updatedUser = {
        ...res.data,
        role: user.role || storedUser.role || "user",
      };

      setUser(updatedUser);
      setEditForm(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setShowEdit(false);
    } catch (err) {
      alert(err.response?.data?.error || err.message || "Update profile error");
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await API.put("/client/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      alert("Password changed successfully");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPassword(false);
    } catch (err) {
      alert(err.response?.data?.error || "Password change failed");
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const res = await API.post("/client/messages", {
        message: messageText,
      });

      setMessages([res.data, ...messages]);
      setSentMessageText(messageText);
      setShowClientPopup(true);
      setMessageText("");
    } catch (err) {
      alert(err.response?.data?.error || err.message || "Message not sent");
    }
  };

  const handleReplyMessage = async (messageId) => {
    if (!replyTexts[messageId]?.trim()) return;

    try {
      const res = await API.post("/client/messages", {
        message: replyTexts[messageId],
      });

      setMessages([res.data, ...messages]);
      setSentMessageText(replyTexts[messageId]);
      setShowClientPopup(true);

      setReplyTexts({
        ...replyTexts,
        [messageId]: "",
      });
    } catch (err) {
      alert(err.response?.data?.error || "Reply not sent");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const updatedUser = {
          ...user,
          avatar: reader.result,
        };

        await API.put("/client/profile", {
          name: updatedUser.name,
          phone: updatedUser.phone,
          city: updatedUser.city,
          country: updatedUser.country,
          avatar: updatedUser.avatar,
        });

        setUser(updatedUser);
        setEditForm(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (err) {
        console.log("Photo update failed:", err.response?.data || err.message);
        alert("Photo update failed");
      }
    };

    reader.readAsDataURL(file);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const initials = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="user-page">
      <Navbar />

      <div className="user-container">
        <aside className="client-sidebar">
          <div className="client-sidebar-brand">
            <FaPlane />
            <h2>Egypt Holiday</h2>
            <p>Client Panel</p>
          </div>

          <button
            className={activePage === "dashboard" ? "active" : ""}
            onClick={() => setActivePage("dashboard")}
          >
            <FaHome /> Dashboard
          </button>

          <button
            className={activePage === "booking" ? "active" : ""}
            onClick={() => setActivePage("booking")}
          >
            <FaBriefcase /> My Booking
          </button>

          <button
            className={activePage === "payment" ? "active" : ""}
            onClick={() => setActivePage("payment")}
          >
            <FaCreditCard /> Payment
          </button>

          <button
            className={activePage === "messages" ? "active" : ""}
            onClick={() => {
              setActivePage("messages");
              setMessageNotifications(0);
            }}
          >
            <FaEnvelope />
            <span>Messages</span>

            {messageNotifications > 0 && (
              <span className="message-badge">{messageNotifications}</span>
            )}
          </button>

          <button
            className={activePage === "settings" ? "active" : ""}
            onClick={() => setActivePage("settings")}
          >
            <FaCog /> Settings
          </button>

          <button className="sidebar-logout" onClick={logout}>
            <FaSignOutAlt /> Logout
          </button>
        </aside>

        <main className="client-content">
          <section className="user-hero">
            <div className="user-main-info">
              <div className="profile-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt="profile" />
                ) : (
                  initials
                )}
              </div>

              <div>
                <h1>Hello, {user.name || "Client"}</h1>
                <p>Manage your account, bookings, payments, and settings.</p>

                <label className="upload-btn">
                  Change photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
            </div>
          </section>

          {activePage === "dashboard" && (
            <div className="user-grid">
              <section className="user-card big-card">
                <h2>Personal Information</h2>

                <div className="info-list">
                  <div>
                    <FaUser />
                    <span>Name</span>
                    <strong>{user.name || "Client"}</strong>
                  </div>

                  <div>
                    <FaEnvelope />
                    <span>Email</span>
                    <strong>{user.email || "No email"}</strong>
                  </div>

                  <div>
                    <FaPhone />
                    <span>Phone</span>
                    <strong>{user.phone || "No phone"}</strong>
                  </div>

                  <div>
                    <FaMapMarkerAlt />
                    <span>Location</span>
                    <strong>
                      {user.city || "Mansoura"}, {user.country || "Egypt"}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="user-card support-card">
                <h2>Support</h2>
                <p>Need help with your booking or travel details?</p>

                <button onClick={() => setShowContact(true)}>
                  <FaHeadset /> Contact Agency
                </button>
              </section>
            </div>
          )}

          {activePage === "booking" && (
            <section className="page-section">
              <h2>My Booking</h2>

              <div className="booking-tabs">
                <button
                  className={bookingTab === "packages" ? "active" : ""}
                  onClick={() => setBookingTab("packages")}
                >
                  Packages Reservations
                </button>

                <button
                  className={bookingTab === "hotels" ? "active" : ""}
                  onClick={() => setBookingTab("hotels")}
                >
                  Hotels Reservations
                </button>
              </div>

              <input
                className="booking-search"
                type="text"
                placeholder="Search reservations by client, trip, hotel or date..."
              />

              {/* PACKAGES */}
              {bookingTab === "packages" && (
                <div className="booking-list">
                  {bookings.length === 0 ? (
                    <p className="empty-msg">No package reservations found.</p>
                  ) : (
                    bookings.map((booking) => (
                      <div className="booking-pro-card" key={booking.id}>
                        <div>
                          <h3>{booking.title || booking.name || "Package"}</h3>

                          <p>
                            {booking.date || "No date"} •{" "}
                            {booking.details || booking.status || "No details"}
                          </p>
                        </div>

                        <span
                          className={`status ${
                            booking.status === "Confirmed"
                              ? "confirmed"
                              : "pending"
                          }`}
                        >
                          {booking.status || "Pending"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* HOTELS */}
              {bookingTab === "hotels" && (
                <div className="booking-list">
                  <p className="empty-msg">No hotel reservations found.</p>
                </div>
              )}
            </section>
          )}
          {activePage === "payment" && (
            <section className="page-section">
              <h2>Payment</h2>

              <div className="booking-list">
                {payments.length === 0 && (
                  <p className="empty-msg">No payments yet.</p>
                )}

                {payments.map((payment) => (
                  <div className="payment-card-pro" key={payment.id}>
                    <span>{payment.invoice || `Invoice #${payment.id}`}</span>

                    <span
                      className={payment.status === "Paid" ? "paid" : "unpaid"}
                    >
                      {payment.status || "Not Paid"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activePage === "messages" && (
            <section className="page-section">
              <h2>Messages</h2>

              <p className="section-desc">
                Send your request to the agency. Our team will reply as soon as
                possible.
              </p>

              <div className="message-box">
                <textarea
                  placeholder="Write your message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />

                <button onClick={handleSendMessage}>Send Message</button>
              </div>

              {messages.length === 0 && (
                <p className="empty-msg">No messages yet.</p>
              )}

              {messages.map((msg) => (
                <div className="user-message-card" key={msg.id}>
                  <p className="msg-date">{msg.date}</p>

                  <p>{msg.message}</p>

                  {msg.reply && (
                    <div className="admin-reply">
                      <strong>Agency reply:</strong>
                      <p>{msg.reply}</p>
                    </div>
                  )}

                  <div className="user-reply-box">
                    <textarea
                      placeholder="Write your reply to the agency..."
                      value={replyTexts[msg.id] || ""}
                      onChange={(e) =>
                        setReplyTexts({
                          ...replyTexts,
                          [msg.id]: e.target.value,
                        })
                      }
                    />

                    <button onClick={() => handleReplyMessage(msg.id)}>
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}

          {activePage === "settings" && (
            <section className="page-section">
              <h2>Settings</h2>

              <div className="settings-actions">
                <button onClick={() => setShowEdit(true)}>
                  <FaEdit /> Edit Profile
                </button>

                <button onClick={() => setShowPassword(true)}>
                  <FaLock /> Change Password
                </button>
              </div>
            </section>
          )}
        </main>
      </div>

      {showEdit && (
        <div className="popup-overlay">
          <div className="profile-popup">
            <h2>Edit Profile</h2>

            <input
              type="text"
              value={editForm.name || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              placeholder="Name"
            />

            <input
              type="email"
              value={editForm.email || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              placeholder="Email"
            />

            <input
              type="text"
              value={editForm.phone || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
              placeholder="Phone"
            />

            <input
              type="text"
              value={editForm.city || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, city: e.target.value })
              }
              placeholder="City"
            />

            <select
              value={editForm.country || "Egypt"}
              onChange={(e) =>
                setEditForm({ ...editForm, country: e.target.value })
              }
            >
              <option value="Egypt">Egypt</option>
              <option value="Tunisia">Tunisia</option>
              <option value="France">France</option>
              <option value="Turkey">Turkey</option>
            </select>

            <div className="popup-actions">
              <button onClick={handleSaveProfile}>Save</button>

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

            <input
              type="password"
              placeholder="Current password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="New password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Confirm password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
            />

            <div className="popup-actions">
              <button onClick={handleChangePassword}>Save</button>

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

      {showContact && (
        <div className="contact-popup-overlay">
          <div className="contact-popup">
            <div className="contact-header">
              <h2>Contact Our Agency</h2>

              <p>
                Our Egypt Holiday support team is available anytime to help you
                with bookings, flights, hotels, and travel details.
              </p>
            </div>

            <div className="contact-grid">
              <a href="tel:01099999234">☎️ 01099999234</a>
              <a href="tel:01050971444">☎️ 01050971444</a>
              <a href="tel:01050383173">☎️ 01050383173</a>
              <a href="tel:01111787867">☎️ 01111787867</a>

              <a href="mailto:ghaddabnessrine@gmail.com">
                📧 ghaddabnessrine@gmail.com
              </a>

              <a
                href="https://wa.me/201099999234"
                target="_blank"
                rel="noreferrer"
              >
                💬 WhatsApp Support
              </a>
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

      {showClientPopup && (
        <div className="message-success-overlay">
          <div className="message-success-popup">
            <div className="message-success-icon">✓</div>

            <h2>Message Sent Successfully</h2>

            <p>
              Thank you for contacting Egypt Holiday Travel. Our support team
              will review your message and get back to you as soon as possible.
            </p>

            <div className="sent-message-box">{sentMessageText}</div>

            <button onClick={() => setShowClientPopup(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
