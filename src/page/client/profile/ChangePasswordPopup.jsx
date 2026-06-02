import { useState } from "react";

export default function ChangePasswordPopup({ onSave, onClose }) {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (field, value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert("Please fill all password fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirm password are not the same");
      return;
    }

    if (typeof onSave === "function") {
      onSave(passwordForm);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="profile-popup">
        <h2>Change Password</h2>

        <div className="password-input-wrap">
          <input
            type={showPassword.currentPassword ? "text" : "password"}
            value={passwordForm.currentPassword}
            onChange={(e) => handleChange("currentPassword", e.target.value)}
            placeholder="Current password"
          />

          <button
            type="button"
            className="password-eye-btn"
            onClick={() => togglePassword("currentPassword")}
          >
            {showPassword.currentPassword ? "🙈" : "👁"}
          </button>
        </div>

        <div className="password-input-wrap">
          <input
            type={showPassword.newPassword ? "text" : "password"}
            value={passwordForm.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
            placeholder="New password"
          />

          <button
            type="button"
            className="password-eye-btn"
            onClick={() => togglePassword("newPassword")}
          >
            {showPassword.newPassword ? "🙈" : "👁"}
          </button>
        </div>

        <div className="password-input-wrap">
          <input
            type={showPassword.confirmPassword ? "text" : "password"}
            value={passwordForm.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="Confirm password"
          />

          <button
            type="button"
            className="password-eye-btn"
            onClick={() => togglePassword("confirmPassword")}
          >
            {showPassword.confirmPassword ? "🙈" : "👁"}
          </button>
        </div>

        <div className="popup-actions">
          <button type="button" onClick={handleSave}>
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