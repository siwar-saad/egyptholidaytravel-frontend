import { useEffect, useRef, useState } from "react";
import {
  FaCamera,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSave,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import API from "../../api";
import "./profile.css";

const PROFILE_ME_ENDPOINT = "/auth/me";
const PROFILE_UPDATE_ENDPOINT = "/admin/profile";
const PASSWORD_UPDATE_ENDPOINT = "/admin/profile/password";

const EMPTY_PROFILE = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  avatar: "",
};

const EMPTY_PASSWORD = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function Profile() {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [profileForm, setProfileForm] = useState(EMPTY_PROFILE);
  const [passwordForm, setPasswordForm] = useState(EMPTY_PASSWORD);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const [editProfile, setEditProfile] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const [loadingPage, setLoadingPage] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [notice, setNotice] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const notify = (message, type = "success") => {
    setNotice({
      show: true,
      type,
      message,
    });
  };

  const closeNotice = () => {
    setNotice({
      show: false,
      type: "success",
      message: "",
    });
  };

  const getProfileFromResponse = (data) => {
    return data?.admin || data?.user || data?.profile || data?.data || data || {};
  };

  const normalizeProfile = (user) => {
    const firstName = user?.firstName || user?.first_name || "";
    const lastName = user?.lastName || user?.last_name || "";

    return {
      firstName,
      lastName,
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || user?.adresse || "",
      avatar: user?.avatar || user?.image || user?.photo || "",
    };
  };

  const getFullName = () => {
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();
    return fullName || "Admin Profile";
  };

  const getAvatarSrc = () => {
    if (avatarPreview) return avatarPreview;

    if (!profile.avatar || removeAvatar) return "";

    if (
      profile.avatar.startsWith("http") ||
      profile.avatar.startsWith("data:image")
    ) {
      return profile.avatar;
    }

    return profile.avatar;
  };

  const avatarSrc = getAvatarSrc();

  const loadProfile = async () => {
    try {
      setLoadingPage(true);

      const res = await API.get(PROFILE_ME_ENDPOINT);
      const profileData = normalizeProfile(getProfileFromResponse(res.data));

      setProfile(profileData);
      setProfileForm(profileData);
      setAvatarPreview("");
      setAvatarFile(null);
      setRemoveAvatar(false);
    } catch (err) {
      console.log("Load admin profile error:", err.response?.data || err.message);
      notify("Unable to load admin profile.", "error");
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const chooseAvatar = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Please select a valid image.", "error");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      notify("Image size must be less than 3MB.", "error");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setRemoveAvatar(false);
  };

  const deleteAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setRemoveAvatar(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const cancelProfileEdit = () => {
    setEditProfile(false);
    setProfileForm(profile);
    setAvatarFile(null);
    setAvatarPreview("");
    setRemoveAvatar(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const saveProfile = async () => {
    const firstName = profileForm.firstName.trim();
    const lastName = profileForm.lastName.trim();
    const email = profileForm.email.trim();
    const phone = profileForm.phone.trim();
    const address = profileForm.address.trim();

    if (!firstName || !lastName || !email) {
      notify("Please fill first name, last name and email.", "error");
      return;
    }

    try {
      setSavingProfile(true);

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("name", `${firstName} ${lastName}`);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("adresse", address);
      formData.append("role", "admin");

      if (avatarFile) {
        formData.append("avatar", avatarFile);
        formData.append("image", avatarFile);
      }

      if (removeAvatar) {
        formData.append("removeAvatar", "true");
      }

      const res = await API.put(PROFILE_UPDATE_ENDPOINT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedProfile = normalizeProfile(
        getProfileFromResponse(res.data) || {
          ...profile,
          ...profileForm,
          avatar: removeAvatar ? "" : profile.avatar,
        }
      );

      setProfile(updatedProfile);
      setProfileForm(updatedProfile);
      setEditProfile(false);
      setAvatarFile(null);
      setAvatarPreview("");
      setRemoveAvatar(false);

      notify("Admin profile updated successfully.");
    } catch (err) {
      console.log("Update admin profile error:", err.response?.data || err.message);

      notify(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to update admin profile.",
        "error"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const cancelPasswordEdit = () => {
    setEditPassword(false);
    setPasswordForm(EMPTY_PASSWORD);
  };

  const savePassword = async () => {
    const currentPassword = passwordForm.currentPassword.trim();
    const newPassword = passwordForm.newPassword.trim();
    const confirmPassword = passwordForm.confirmPassword.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      notify("Please fill all password fields.", "error");
      return;
    }

    if (newPassword.length < 6) {
      notify("New password must contain at least 6 characters.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      notify("Passwords do not match.", "error");
      return;
    }

    try {
      setSavingPassword(true);

      await API.put(PASSWORD_UPDATE_ENDPOINT, {
        currentPassword,
        oldPassword: currentPassword,
        newPassword,
        password: newPassword,
      });

      setPasswordForm(EMPTY_PASSWORD);
      setEditPassword(false);

      notify("Password updated successfully.");
    } catch (err) {
      console.log("Update password error:", err.response?.data || err.message);

      notify(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to update password.",
        "error"
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loadingPage) {
    return (
      <section className="admin-profile-page">
        <div className="admin-profile-loading">Loading admin profile...</div>
      </section>
    );
  }

  return (
    <>
      <section className="admin-profile-page">
        <div className="admin-profile-hero">
          <div className="admin-profile-avatar-box">
            <div className="admin-profile-avatar">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Admin" />
              ) : (
                <FaUser />
              )}
            </div>

            {editProfile && (
              <div className="admin-profile-avatar-actions">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaCamera /> Change Photo
                </button>

                {avatarSrc && (
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={deleteAvatar}
                  >
                    Remove
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={chooseAvatar}
                  hidden
                />
              </div>
            )}
          </div>

          <div className="admin-profile-hero-info">
            <span>Admin Account</span>
            <h2>{getFullName()}</h2>
            <p>{profile.email || "No email available"}</p>
          </div>

          <button
            type="button"
            className="admin-profile-edit-main"
            onClick={() => setEditProfile(true)}
            disabled={editProfile}
          >
            Edit Profile
          </button>
        </div>

        <div className="admin-profile-grid">
          <div className="admin-profile-card">
            <div className="admin-profile-card-head">
              <div>
                <h3>Personal Information</h3>
                <p>Manage admin name, email, phone and address.</p>
              </div>

              {!editProfile && (
                <button type="button" onClick={() => setEditProfile(true)}>
                  Edit
                </button>
              )}
            </div>

            <div className="admin-profile-form">
              <div className="admin-profile-row">
                <div className="admin-profile-field">
                  <label>First Name</label>
                  <div className="admin-profile-input">
                    <FaUser />
                    <input
                      type="text"
                      value={profileForm.firstName}
                      disabled={!editProfile}
                      onChange={(e) =>
                        handleProfileChange("firstName", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="admin-profile-field">
                  <label>Last Name</label>
                  <div className="admin-profile-input">
                    <FaUser />
                    <input
                      type="text"
                      value={profileForm.lastName}
                      disabled={!editProfile}
                      onChange={(e) =>
                        handleProfileChange("lastName", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="admin-profile-field">
                <label>Email</label>
                <div className="admin-profile-input">
                  <FaEnvelope />
                  <input
                    type="email"
                    value={profileForm.email}
                    disabled={!editProfile}
                    onChange={(e) =>
                      handleProfileChange("email", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="admin-profile-field">
                <label>Phone</label>
                <div className="admin-profile-input">
                  <FaPhoneAlt />
                  <input
                    type="tel"
                    value={profileForm.phone}
                    disabled={!editProfile}
                    placeholder="Add phone number"
                    onChange={(e) =>
                      handleProfileChange("phone", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="admin-profile-field">
                <label>Address</label>
                <div className="admin-profile-input">
                  <FaMapMarkerAlt />
                  <input
                    type="text"
                    value={profileForm.address}
                    disabled={!editProfile}
                    placeholder="Add address"
                    onChange={(e) =>
                      handleProfileChange("address", e.target.value)
                    }
                  />
                </div>
              </div>

              {editProfile && (
                <div className="admin-profile-actions">
                  <button
                    type="button"
                    className="save-profile-btn"
                    onClick={saveProfile}
                    disabled={savingProfile}
                  >
                    <FaSave />
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    className="cancel-profile-btn"
                    onClick={cancelProfileEdit}
                    disabled={savingProfile}
                  >
                    <FaTimes />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="admin-profile-card">
            <div className="admin-profile-card-head">
              <div>
                <h3>Password Security</h3>
                <p>Update admin password securely.</p>
              </div>

              {!editPassword && (
                <button type="button" onClick={() => setEditPassword(true)}>
                  Edit
                </button>
              )}
            </div>

            {!editPassword ? (
              <div className="admin-password-preview">
                <div>
                  <FaLock />
                </div>

                <h4>Password protected</h4>
                <p>Use a strong password to keep your admin account safe.</p>
              </div>
            ) : (
              <div className="admin-profile-form">
                <div className="admin-profile-field">
                  <label>Current Password</label>
                  <div className="admin-profile-input">
                    <FaLock />
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        handlePasswordChange(
                          "currentPassword",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="admin-profile-field">
                  <label>New Password</label>
                  <div className="admin-profile-input">
                    <FaLock />
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="admin-profile-field">
                  <label>Confirm Password</label>
                  <div className="admin-profile-input">
                    <FaLock />
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange(
                          "confirmPassword",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="admin-profile-actions">
                  <button
                    type="button"
                    className="save-profile-btn"
                    onClick={savePassword}
                    disabled={savingPassword}
                  >
                    <FaSave />
                    {savingPassword ? "Saving..." : "Save Password"}
                  </button>

                  <button
                    type="button"
                    className="cancel-profile-btn"
                    onClick={cancelPasswordEdit}
                    disabled={savingPassword}
                  >
                    <FaTimes />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {notice.show && (
        <div className="admin-profile-notice-overlay">
          <div className={`admin-profile-notice ${notice.type}`}>
            <button type="button" onClick={closeNotice}>
              ×
            </button>

            <div className="admin-profile-notice-icon">
              {notice.type === "success" ? "✓" : "!"}
            </div>

            <h3>{notice.type === "success" ? "Success" : "Notice"}</h3>
            <p>{notice.message}</p>

            <button
              type="button"
              className="admin-profile-notice-ok"
              onClick={closeNotice}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}