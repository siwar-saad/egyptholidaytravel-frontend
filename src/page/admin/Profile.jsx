import { useState } from "react";
import "./AdminPages.css";
import AdminLayout from "./AdminLayout";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [photo, setPhoto] = useState(null);

  const [admin, setAdmin] = useState({
    name: "Siwar Saad",
    address: "Mansoura, Egypt",
    phone: "+20 000 000 0000",
    email: "admin@egyptholidaytravel.com",
  });

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  return (
    <AdminLayout>
      <div className="admin-page-content">
        <div className="profile-header">
          <div>
            <h1>Admin Profile</h1>
            <p>Manage your personal information and profile photo.</p>
          </div>

          <button
            className="main-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className="profile-card">
          <div className="profile-photo-box">
            <div className="profile-photo">
              {photo ? (
                <img src={photo} alt="Admin" />
              ) : (
                <span>{admin.name.charAt(0)}</span>
              )}
            </div>

            {isEditing && (
              <>
                <label htmlFor="photoUpload" className="upload-btn">
                  Upload Photo
                </label>
                <input
                  id="photoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  hidden
                />
              </>
            )}
          </div>

          <div className="profile-form">
            <div className="input-group">
              <label>Full Name</label>
              <input
                name="name"
                value={admin.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="input-group">
              <label>Address</label>
              <input
                name="address"
                value={admin.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                name="phone"
                value={admin.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                name="email"
                value={admin.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <button
                className="save-profile-btn"
                onClick={() => setIsEditing(false)}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}