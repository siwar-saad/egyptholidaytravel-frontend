export default function EditProfilePopup({
  editForm,
  setEditForm,
  onSave,
  onClose,
}) {
  const countries = [
    "France",
    "Germany",
    "Luxembourg",
    "Turkey",
    "Tunisia",
    "Morocco",
    "Bosnia",
    "Egypt",
  ];

  return (
    <div className="popup-overlay">
      <div className="profile-popup">
        <h2>Edit Profile</h2>

        <input
          type="text"
          value={editForm.firstName || ""}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              firstName: e.target.value,
            })
          }
          placeholder="First Name"
        />

        <input
          type="text"
          value={editForm.lastName || ""}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              lastName: e.target.value,
            })
          }
          placeholder="Last Name"
        />

        <input
          type="email"
          value={editForm.email || ""}
          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
          placeholder="Email"
        />

        <input
          type="text"
          value={editForm.phone || ""}
          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
          placeholder="Phone"
        />

        <select
          value={editForm.country || ""}
          onChange={(e) =>
            setEditForm({ ...editForm, country: e.target.value })
          }
        >
          {countries.map((country) => (
            <option value={country} key={country}>
              {country}
            </option>
          ))}
        </select>

        <div className="popup-actions">
          <button type="button" onClick={onSave}>
            Save
          </button>

          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
