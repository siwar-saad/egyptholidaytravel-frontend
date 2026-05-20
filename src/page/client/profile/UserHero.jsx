export default function UserHero({ user, onPhotoChange }) {
  const initials = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <section className="user-hero">
      <div className="user-main-info">
        <div className="profile-avatar">
          {user.avatar ? <img src={user.avatar} alt="profile"  loading="lazy" /> : initials}
        </div>

        <div>
          <h1>Hello, {user.name || "Client"}</h1>
          <p>Manage your account, bookings, payments, and settings.</p>

          <label className="upload-btn">
            Change photo
            <input type="file" accept="image/*" onChange={onPhotoChange} />
          </label>
        </div>
      </div>
    </section>
  );
}
