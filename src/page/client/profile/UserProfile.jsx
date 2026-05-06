import { useState } from "react";
import Navbar from "../../../components/navbar";
import "./UserProfile.css";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const [image, setImage] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Siwar Saad",
    email: "siwar@email.com",
    phone: "+20 109 999 9234",
    city: "Mansoura",
    country: "Egypt",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  return (
    <div className="user-page">
      <Navbar />

      <div className="user-container">
        <section className="profile-hero">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {image ? <img src={image} alt="profile" /> : "S"}
            </div>

            <label className="upload-btn">
              Change Photo
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

          <div>
            <h1>Welcome, {user.name}</h1>
            <p>Your Egypt Holiday account is ready.</p>
          </div>

          <button className="logout-btn" onClick={() => navigate("/login")}>
            Logout
          </button>
        </section>

        <section className="profile-grid">
          <div className="profile-card">
            <h2>Personal Information</h2>
            <div className="info-list">
              <p>
                <span>Name</span> {user.name}
              </p>
              <p>
                <span>Email</span> {user.email}
              </p>
              <p>
                <span>Phone</span> {user.phone}
              </p>
              <p>
                <span>City</span> {user.city}
              </p>
              <p>
                <span>Country</span> {user.country}
              </p>
            </div>
          </div>

          <div className="profile-card">
            <h2>My Reservations</h2>
            <div className="reservation-item">
              <div>
                <h3>Hurghada Package</h3>
                <p>15 June 2026</p>
              </div>
              <span className="status confirmed">Confirmed</span>
            </div>

            <div className="reservation-item">
              <div>
                <h3>Turkey Trip</h3>
                <p>22 July 2026</p>
              </div>
              <span className="status pending">Pending</span>
            </div>
          </div>

          <div className="profile-card">
            <h2>Saved Packages</h2>
            <div className="saved-tags">
              <span>Sharm El Sheikh</span>
              <span>Luxor</span>
              <span>Siwa Oasis</span>
              <span>Aswan</span>
            </div>
          </div>

          <div className="profile-card">
            <h2>Payment & Invoices</h2>
            <div className="invoice-row">
              <span>Hurghada Invoice</span>
              <strong>Paid</strong>
            </div>
            <div className="invoice-row">
              <span>Turkey Trip Invoice</span>
              <strong className="not-paid">Not Paid</strong>
            </div>
          </div>

          <div className="profile-card">
            <h2>Documents</h2>
            <div className="doc-list">
              <p>🛂 Passport: Not uploaded</p>
              <p>💳 Visa: Pending</p>
              <p>📄 Travel Form: Completed</p>
            </div>
          </div>

          <div className="profile-card">
            <h2>Account Settings</h2>
            <div className="settings-actions">
              <button onClick={() => setShowEdit(true)}>Edit Profile</button>
              <button onClick={() => setShowPassword(true)}>
                Change Password
              </button>
            </div>
          </div>

          <div className="profile-card support-card">
            <h2>Support</h2>
            <p>Need help with your booking or trip details?</p>
            <button onClick={() => setShowContact(true)}>Contact Agency</button>
            <button className="whatsapp-btn">WhatsApp Support</button>
          </div>
        </section>
      </div>

      {showContact && (
        <div className="contact-popup-overlay">
          <div className="contact-popup">
            <h2>Contact Our Agency</h2>

            <div className="phones">
              <p>☎️ 01099999234</p>
              <p>☎️ 01050971444</p>
              <p>☎️ 01050383173</p>
              <p>☎️ 01111787867</p>
              <p>☎️ 01001579926</p>
              <p>☎️ 01050972333</p>
            </div>

            <button onClick={() => setShowContact(false)}>Close</button>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="profile-popup-overlay">
          <div className="profile-popup">
            <h2>Edit Profile</h2>

            <input
              type="text"
              placeholder="Name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />

            <input
              type="tel"
              placeholder="Phone"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />

            <input
              type="text"
              placeholder="City"
              value={user.city}
              onChange={(e) => setUser({ ...user, city: e.target.value })}
            />

            <select
              value={user.country}
              onChange={(e) => setUser({ ...user, country: e.target.value })}
            >
              <option>Egypt</option>
              <option>Tunisia</option>
              <option>France</option>
              <option>Italy</option>
              <option>Turkey</option>
              <option>Saudi Arabia</option>
              <option>United Arab Emirates</option>
              <option>Morocco</option>
              <option>Germany</option>
              <option>Spain</option>
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
        <div className="profile-popup-overlay">
          <div className="profile-popup">
            <h2>Change Password</h2>

            <input
              type="password"
              placeholder="Old password"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  oldPassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="New password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Confirm new password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />

            <div className="popup-actions">
              <button
                onClick={() => {
                  if (
                    !passwordData.oldPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword
                  ) {
                    alert("Please fill all password fields");
                    return;
                  }

                  if (
                    passwordData.newPassword !== passwordData.confirmPassword
                  ) {
                    alert("Passwords do not match");
                    return;
                  }

                  setShowPassword(false);
                }}
              >
                Save Password
              </button>

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
