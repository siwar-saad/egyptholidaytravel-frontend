import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../../api";
import "./Admin.css";

const DEFAULT_AGENCY = {
  name: "",
  email: "",
  address: "",
  facebook: "",
  instagram: "",
};

const DEFAULT_NOTICE = {
  type: "",
  message: "",
};

const DEFAULT_PASSWORD = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const DEFAULT_SHOW_PASSWORDS = {
  oldPassword: false,
  newPassword: false,
  confirmPassword: false,
};

export default function AdminSettings() {
  const [activePopup, setActivePopup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [notice, setNotice] = useState(DEFAULT_NOTICE);
  const [agency, setAgency] = useState(DEFAULT_AGENCY);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [showPasswords, setShowPasswords] = useState(DEFAULT_SHOW_PASSWORDS);

  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const showNotice = (type, message) => {
    setNotice({ type, message });
  };

  const clearNotice = () => {
    setNotice(DEFAULT_NOTICE);
  };

  const resetPasswordForm = () => {
    setPassword(DEFAULT_PASSWORD);
    setShowPasswords(DEFAULT_SHOW_PASSWORDS);
  };

  const openPopup = (popupName) => {
    clearNotice();

    if (popupName === "password") {
      resetPasswordForm();
    }

    setActivePopup(popupName);
  };

  const closePopup = () => {
    setActivePopup(null);
    clearNotice();
    setActionLoading(false);
    resetPasswordForm();
  };

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const loadSettings = async () => {
    try {
      setLoading(true);

      const response = await API.get("/admin/settings");
      const data = response.data || {};

      setAgency({
        ...DEFAULT_AGENCY,
        ...(data.agency || {}),
      });

      setContacts(Array.isArray(data.contacts) ? data.contacts : []);
    } catch (error) {
      console.error("Load settings error:", error);
      setAgency(DEFAULT_AGENCY);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const saveAgency = async () => {
    clearNotice();

    if (!agency.name.trim()) {
      showNotice("error", "Please enter agency name.");
      return;
    }

    if (!agency.email.trim()) {
      showNotice("error", "Please enter agency email.");
      return;
    }

    try {
      setActionLoading(true);

      await API.put("/admin/settings/agency", agency);

      showNotice("success", "Agency information updated successfully.");

      setTimeout(() => {
        closePopup();
      }, 1000);
    } catch (error) {
      showNotice(
        "error",
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Unable to update agency information."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const savePassword = async () => {
    clearNotice();

    if (!password.oldPassword.trim()) {
      showNotice("error", "Please enter your current password.");
      return;
    }

    if (!password.newPassword.trim()) {
      showNotice("error", "Please enter a new password.");
      return;
    }

    if (password.newPassword.length < 6) {
      showNotice("error", "New password must contain at least 6 characters.");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      showNotice("error", "New password and confirmation do not match.");
      return;
    }

    try {
      setActionLoading(true);

      await API.put("/admin/settings/password", password);

      showNotice("success", "Password updated successfully.");

      resetPasswordForm();

      setTimeout(() => {
        closePopup();
      }, 1200);
    } catch (error) {
      showNotice(
        "error",
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Current password is incorrect."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const addContact = () => {
    clearNotice();

    const phone = newContact.trim();

    if (!phone) {
      showNotice("error", "Please enter a phone number.");
      return;
    }

    setContacts((prev) => [...prev, phone]);
    setNewContact("");
    showNotice("success", "Phone number added. Click Save Contacts to confirm.");
  };

  const removeContact = (index) => {
    clearNotice();
    setContacts((prev) => prev.filter((_, i) => i !== index));
    showNotice(
      "success",
      "Phone number removed. Click Save Contacts to confirm."
    );
  };

  const updateContact = (index, value) => {
    clearNotice();

    setContacts((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const saveContacts = async () => {
    clearNotice();

    try {
      setActionLoading(true);

      const cleanContacts = contacts
        .map((phone) => phone.trim())
        .filter((phone) => phone !== "");

      await API.put("/admin/settings/contacts", {
        contacts: cleanContacts,
      });

      setContacts(cleanContacts);

      showNotice("success", "Contact numbers updated successfully.");

      setTimeout(() => {
        closePopup();
      }, 1000);
    } catch (error) {
      showNotice(
        "error",
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Unable to update contact numbers."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const renderNotice = () => {
    if (!notice.message) return null;

    return (
      <div className={`settings-notice ${notice.type}`}>
        {notice.message}
      </div>
    );
  };

  const renderPasswordInput = (field, placeholder) => {
    return (
      <div className="settings-password-field">
        <input
          type={showPasswords[field] ? "text" : "password"}
          placeholder={placeholder}
          value={password[field]}
          onChange={(e) =>
            setPassword({
              ...password,
              [field]: e.target.value,
            })
          }
        />

        <button
          type="button"
          className="settings-eye-btn"
          onClick={() => togglePassword(field)}
          aria-label={showPasswords[field] ? "Hide password" : "Show password"}
        >
          {showPasswords[field] ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    );
  };

  return (
    <>
      <section className="admin-panel settings-panel">
        <div className="settings-header-pro">
          <div>
            <h2>Settings</h2>
            <p>Manage agency information, admin security and contact numbers.</p>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Loading settings...</div>
        ) : (
          <div className="settings-grid-pro">
            <button
              type="button"
              className="settings-card-pro"
              onClick={() => openPopup("agency")}
            >
              <span className="settings-icon-pro">🏢</span>

              <span className="settings-text-pro">
                <strong>Agency Information</strong>
                <small>
                  Update agency profile, email, address and social media.
                </small>
              </span>

              <span className="settings-arrow-pro">→</span>
            </button>

            <button
              type="button"
              className="settings-card-pro"
              onClick={() => openPopup("password")}
            >
              <span className="settings-icon-pro">🔒</span>

              <span className="settings-text-pro">
                <strong>Change Admin Password</strong>
                <small>Change your admin password securely.</small>
              </span>

              <span className="settings-arrow-pro">→</span>
            </button>

            <button
              type="button"
              className="settings-card-pro"
              onClick={() => openPopup("contacts")}
            >
              <span className="settings-icon-pro">☎️</span>

              <span className="settings-text-pro">
                <strong>Contact Numbers</strong>
                <small>Edit, remove or add support contact numbers.</small>
              </span>

              <span className="settings-arrow-pro">→</span>
            </button>
          </div>
        )}
      </section>

      {activePopup === "agency" && (
        <div className="settings-popup-overlay">
          <div className="settings-popup">
            <button
              type="button"
              className="settings-popup-close"
              onClick={closePopup}
              disabled={actionLoading}
            >
              ×
            </button>

            <h2>Agency Information</h2>

            {renderNotice()}

            <input
              type="text"
              placeholder="Agency Name"
              value={agency.name}
              onChange={(e) => setAgency({ ...agency, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Agency Email"
              value={agency.email}
              onChange={(e) => setAgency({ ...agency, email: e.target.value })}
            />

            <input
              type="text"
              placeholder="Agency Address"
              value={agency.address}
              onChange={(e) =>
                setAgency({ ...agency, address: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Facebook Link"
              value={agency.facebook}
              onChange={(e) =>
                setAgency({ ...agency, facebook: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Instagram Link"
              value={agency.instagram}
              onChange={(e) =>
                setAgency({ ...agency, instagram: e.target.value })
              }
            />

            <div className="settings-popup-actions">
              <button
                type="button"
                onClick={saveAgency}
                disabled={actionLoading}
              >
                {actionLoading ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                className="settings-cancel-btn"
                onClick={closePopup}
                disabled={actionLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {activePopup === "password" && (
        <div className="settings-popup-overlay">
          <div className="settings-popup">
            <button
              type="button"
              className="settings-popup-close"
              onClick={closePopup}
              disabled={actionLoading}
            >
              ×
            </button>

            <h2>Change Admin Password</h2>

            {renderNotice()}

            {renderPasswordInput("oldPassword", "Current Password")}
            {renderPasswordInput("newPassword", "New Password")}
            {renderPasswordInput("confirmPassword", "Confirm New Password")}

            <div className="settings-popup-actions">
              <button
                type="button"
                onClick={savePassword}
                disabled={actionLoading}
              >
                {actionLoading ? "Updating..." : "Update Password"}
              </button>

              <button
                type="button"
                className="settings-cancel-btn"
                onClick={closePopup}
                disabled={actionLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {activePopup === "contacts" && (
        <div className="settings-popup-overlay">
          <div className="settings-popup">
            <button
              type="button"
              className="settings-popup-close"
              onClick={closePopup}
              disabled={actionLoading}
            >
              ×
            </button>

            <h2>Contact Numbers</h2>

            {renderNotice()}

            <div className="contact-number-list">
              {contacts.length > 0 ? (
                contacts.map((phone, index) => (
                  <div className="contact-number-row" key={index}>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => updateContact(index, e.target.value)}
                    />

                    <button
                      type="button"
                      className="remove-contact-btn"
                      onClick={() => removeContact(index)}
                      disabled={actionLoading}
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="empty-text">No contact numbers yet.</p>
              )}
            </div>

            <div className="add-contact-row">
              <input
                type="text"
                placeholder="Add new phone number"
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
              />

              <button
                type="button"
                className="add-contact-btn"
                onClick={addContact}
                disabled={actionLoading}
              >
                + Add New Phone Number
              </button>
            </div>

            <div className="settings-popup-actions">
              <button
                type="button"
                onClick={saveContacts}
                disabled={actionLoading}
              >
                {actionLoading ? "Saving..." : "Save Contacts"}
              </button>

              <button
                type="button"
                className="settings-cancel-btn"
                onClick={closePopup}
                disabled={actionLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}