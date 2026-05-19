import { FaEdit, FaLock } from "react-icons/fa";

export default function Settings({ onEditProfile, onChangePassword }) {
  return (
    <section className="page-section">
      <h2>Settings</h2>

      <div className="settings-actions">
        <button type="button" onClick={onEditProfile}>
          <FaEdit /> Edit Profile
        </button>

        <button type="button" onClick={onChangePassword}>
          <FaLock /> Change Password
        </button>
      </div>
    </section>
  );
}
