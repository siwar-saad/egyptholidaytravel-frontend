export default function EditProfilePopup({
  editForm,
  setEditForm,
  onSave,
  onClose,
}) {
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

        <select
          value={editForm.country || "Paris"}
          onChange={(e) =>
            setEditForm({ ...editForm, country: e.target.value })
          }
        >
          <option value="Paris">Paris</option>
          <option value="Allemagne">Allemagne</option>
          <option value="Luxembourg">Luxembourg</option>
          <option value="Turquie">Turquie</option>
          <option value="Tunisie">Tunisie</option>
          <option value="Maroc">Maroc</option>
          <option value="Bosnie">Bosnie</option>
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
