import { useEffect, useState } from "react";
import API from "../../api";
import "./Admin.css";

const DEFAULT_AGENCY = {
  name: "",
  email: "",
  address: "",
  facebook: "",
  instagram: "",
};

export default function AdminSettings() {
  const [activePopup, setActivePopup] = useState(null);
  const [loading, setLoading] = useState(false);

  const [agency, setAgency] = useState(DEFAULT_AGENCY);

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

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
    try {
      await API.put("/admin/settings/agency", agency);
      alert("Agency information updated successfully");
      setActivePopup(null);
    } catch (error) {
      alert(error.response?.data?.error || "Unable to update agency");
    }
  };

  const savePassword = async () => {
    if (!password.oldPassword.trim()) {
      alert("Please enter your current password");
      return;
    }

    if (!password.newPassword.trim()) {
      alert("Please enter a new password");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await API.put("/admin/settings/password", password);

      alert("Password updated successfully");

      setPassword({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setActivePopup(null);
    } catch (error) {
      alert(error.response?.data?.error || "Unable to update password");
    }
  };

  const addContact = () => {
    const phone = newContact.trim();

    if (!phone) return;

    setContacts((prev) => [...prev, phone]);
    setNewContact("");
  };

  const removeContact = (index) => {
    setContacts((prev) => prev.filter((_, i) => i !== index));
  };

  const updateContact = (index, value) => {
    setContacts((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const saveContacts = async () => {
    try {
      const cleanContacts = contacts
        .map((phone) => phone.trim())
        .filter((phone) => phone !== "");

      await API.put("/admin/settings/contacts", {
        contacts: cleanContacts,
      });

      setContacts(cleanContacts);
      alert("Contacts updated successfully");
      setActivePopup(null);
    } catch (error) {
      alert(error.response?.data?.error || "Unable to update contacts");
    }
  };

  return (
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
            onClick={() => setActivePopup("agency")}
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
            onClick={() => setActivePopup("password")}
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
            onClick={() => setActivePopup("contacts")}
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

      {activePopup === "agency" && (
        <div className="settings-popup-overlay">
          <div className="settings-popup">
            <h2>Agency Information</h2>

            <input
              type="text"
              placeholder="Agency Name"
              value={agency.name}
              onChange={(e) =>
                setAgency({ ...agency, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Agency Email"
              value={agency.email}
              onChange={(e) =>
                setAgency({ ...agency, email: e.target.value })
              }
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
              <button type="button" onClick={saveAgency}>
                Save Changes
              </button>

              <button
                type="button"
                className="settings-cancel-btn"
                onClick={() => setActivePopup(null)}
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
            <h2>Change Admin Password</h2>

            <input
              type="password"
              placeholder="Current Password"
              value={password.oldPassword}
              onChange={(e) =>
                setPassword({
                  ...password,
                  oldPassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              value={password.newPassword}
              onChange={(e) =>
                setPassword({
                  ...password,
                  newPassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={password.confirmPassword}
              onChange={(e) =>
                setPassword({
                  ...password,
                  confirmPassword: e.target.value,
                })
              }
            />

            <div className="settings-popup-actions">
              <button type="button" onClick={savePassword}>
                Update Password
              </button>

              <button
                type="button"
                className="settings-cancel-btn"
                onClick={() => setActivePopup(null)}
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
            <h2>Contact Numbers</h2>

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
              >
                + Add New Phone Number
              </button>
            </div>

            <div className="settings-popup-actions">
              <button type="button" onClick={saveContacts}>
                Save Contacts
              </button>

              <button
                type="button"
                className="settings-cancel-btn"
                onClick={() => setActivePopup(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}