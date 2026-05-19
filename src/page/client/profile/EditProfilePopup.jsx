export default function EditProfilePopup({ editForm, setEditForm, onSave, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="profile-popup">
        <h2>Edit Profile</h2>

        <input
          type="text"
          value={editForm.name || ""}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          placeholder="Name"
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

        <input
          type="text"
          value={editForm.city || ""}
          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
          placeholder="City"
        />

        <select
          value={editForm.country || "Egypt"}
          onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
        >
          <option value="Egypt">Egypt</option>
          <option value="Tunisia">Tunisia</option>
          <option value="France">France</option>
          <option value="Turkey">Turkey</option>
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
