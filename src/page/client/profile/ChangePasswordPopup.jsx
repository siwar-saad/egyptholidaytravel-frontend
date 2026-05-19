export default function ChangePasswordPopup({
  passwordForm,
  setPasswordForm,
  onSave,
  onClose,
}) {
  return (
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
