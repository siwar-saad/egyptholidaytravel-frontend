import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeadset,
} from "react-icons/fa";

export default function Dashboard({ user, onContact }) {
  return (
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
            <strong>{user.country || "Tunisie"}</strong>
          </div>
        </div>
      </section>

      <section className="user-card support-card">
        <h2>Support</h2>
        <p>Need help with your booking or travel details?</p>

        <button type="button" onClick={onContact}>
          <FaHeadset /> Contact Agency
        </button>
      </section>
    </div>
  );
}
