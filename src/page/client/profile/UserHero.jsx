export default function UserHero({ user, onPhotoChange, onRemovePhoto }) {
  const fullName =
    user?.name ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "Client";

  const profilePhoto =
    user?.avatar ||
    user?.profileImage ||
    user?.photo ||
    user?.image ||
    "";

  const firstLetter = fullName.charAt(0).toUpperCase() || "U";

  return (
    <section className="user-hero">
      <div className="user-main-info">
        <div className="profile-avatar">
          {profilePhoto ? (
            <img src={profilePhoto} alt={fullName} />
          ) : (
            <span>{firstLetter}</span>
          )}
        </div>

        <div>
          <h1>Hello, {fullName}</h1>

          <p>Manage your account, bookings, payments, and settings.</p>

          <div className="profile-photo-actions">
            <label className="upload-btn">
              Change photo
              <input type="file" accept="image/*" onChange={onPhotoChange} />
            </label>

            {profilePhoto && (
              <button
                type="button"
                className="remove-photo-btn"
                onClick={onRemovePhoto}
              >
                Remove photo
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}