/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import API from "../../../api";
import { clearStoredAuth } from "../../../utils/authStorage";
import "./UserProfile.css";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";

import ProfileSidebar from "./ProfileSidebar";
import UserHero from "./UserHero";
import Dashboard from "./Dashboard";
import Bookings from "./Bookings";
import Payments from "./Payments";
import Messages from "./Messages";
import Settings from "./Settings";
import EditProfilePopup from "./EditProfilePopup";
import ChangePasswordPopup from "./ChangePasswordPopup";
import ContactPopup from "./ContactPopup";

const ADMIN_CREATED_RESERVATIONS_KEY = "adminCreatedReservations";

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
};

const getStoredUser = () => {
  return safeParse(
    localStorage.getItem("user") || sessionStorage.getItem("user"),
    null
  );
};

const saveStoredUser = (updatedUser) => {
  const hasLocalUser = Boolean(localStorage.getItem("user"));
  const hasSessionUser = Boolean(sessionStorage.getItem("user"));

  if (hasLocalUser) {
    localStorage.setItem("user", JSON.stringify(updatedUser));
  } else if (hasSessionUser) {
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
  } else {
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
  }

  window.dispatchEvent(
    new CustomEvent("profileUpdated", {
      detail: updatedUser,
    })
  );
};

const normalizeUser = (data = {}) => {
  const firstName = data?.firstName || "";
  const lastName = data?.lastName || "";

  return {
    ...data,
    firstName,
    lastName,
    name:
      data?.name ||
      `${firstName} ${lastName}`.trim() ||
      data?.email ||
      "Client",
    email: data?.email || "",
    phone: data?.phone || "No phone",
    city: data?.city || "Mansoura",
    country: data?.country || "Egypt",
    avatar: data?.avatar || data?.profileImage || "",
    profileImage: data?.profileImage || data?.avatar || "",
    role: data?.role || "user",
  };
};

const normalizeAdminReservation = (reservation) => {
  const id = reservation?._id || reservation?.id || `admin-${Date.now()}`;
  const type =
    reservation?.type || (reservation?.hotelName ? "hotel" : "package");

  const packageName =
    reservation?.packageName ||
    reservation?.trip ||
    reservation?.title ||
    reservation?.name ||
    "";

  const hotelName =
    reservation?.hotelName ||
    reservation?.hotel ||
    reservation?.title ||
    reservation?.name ||
    "";

  const travelDate =
    reservation?.travelDate ||
    reservation?.date ||
    reservation?.bookingDate ||
    reservation?.createdAt ||
    "";

  return {
    ...reservation,

    _id: id,
    id,

    type,

    clientName: reservation?.clientName || "",
    clientEmail: reservation?.clientEmail || "",
    clientPhone: reservation?.clientPhone || "",

    packageName: type === "package" ? packageName : "",
    trip: type === "package" ? packageName : "",
    hotelName: type === "hotel" ? hotelName : "",

    name: type === "hotel" ? hotelName : packageName,
    title: type === "hotel" ? hotelName : packageName,

    travelDate,
    date: travelDate,
    bookingDate: travelDate,

    travelers: reservation?.travelers || reservation?.numberOfTravelers || 1,
    numberOfTravelers:
      reservation?.numberOfTravelers || reservation?.travelers || 1,

    roomType: reservation?.roomType || "Double Room",

    notes: reservation?.notes || reservation?.note || "",
    note: reservation?.note || reservation?.notes || "",

    status: reservation?.status || "confirmed",

    createdBy: "admin",
    adminName: reservation?.adminName || "Admin EgyptHoliday",
    adminEmail: reservation?.adminEmail || "",
    createdAt: reservation?.createdAt || new Date().toISOString(),

    isAdminCreated: true,
  };
};

const getAdminCreatedBookingsForClient = (email) => {
  if (!email) return [];

  const allReservations = safeParse(
    localStorage.getItem(ADMIN_CREATED_RESERVATIONS_KEY),
    []
  );

  return allReservations
    .filter(
      (reservation) =>
        reservation?.clientEmail?.toLowerCase() === email.toLowerCase()
    )
    .map(normalizeAdminReservation);
};

const mergeBookings = (apiBookings = [], adminBookings = []) => {
  const normalApiBookings = Array.isArray(apiBookings) ? apiBookings : [];
  const normalAdminBookings = Array.isArray(adminBookings) ? adminBookings : [];

  const withoutOldAdminBookings = normalApiBookings.filter(
    (booking) => booking?.createdBy !== "admin" && !booking?.isAdminCreated
  );

  const merged = [...normalAdminBookings, ...withoutOldAdminBookings];

  const seen = new Set();

  return merged.filter((booking) => {
    const key = String(
      booking?._id ||
        booking?.id ||
        `${booking?.clientEmail}-${booking?.type}-${booking?.travelDate}`
    );

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

const compressProfilePhoto = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxSize = 720;
        const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
        const canvas = document.createElement("canvas");
        const width = Math.round(image.width * ratio);
        const height = Math.round(image.height * ratio);

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };

      image.onerror = reject;
      image.src = reader.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function UserProfile() {
  const [activePage, setActivePage] = useState("dashboard");

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    name: "Client",
    email: "",
    phone: "No phone",
    city: "",
    country: "",
    avatar: "",
    profileImage: "",
    role: "user",
  });

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [messages, setMessages] = useState([]);

  const [messageText, setMessageText] = useState("");
  const [messageNotifications, setMessageNotifications] = useState(0);

  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showRemovePhotoConfirm, setShowRemovePhotoConfirm] = useState(false);

  const [editForm, setEditForm] = useState(user);
  const [bookingTab, setBookingTab] = useState("packages");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchClientMessages = async () => {
    try {
      const res = await API.get("/client/messages");
      let refreshedMessages = res.data || [];

      const unreadAdminMessages = refreshedMessages.filter(
        (msg) => (msg.sender || "client") === "admin" && !msg.isRead
      );

      if (activePage === "messages" && unreadAdminMessages.length > 0) {
        await API.put("/client/messages/read");

        refreshedMessages = refreshedMessages.map((msg) =>
          (msg.sender || "client") === "admin" ? { ...msg, isRead: true } : msg
        );

        setMessageNotifications(0);
      }

      setMessages(refreshedMessages);
    } catch (err) {
      console.log("Messages refresh error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const loadClientData = async () => {
      const storedUser = normalizeUser(getStoredUser() || {});
      let profileData = storedUser;
      let apiBookings = [];
      let apiPayments = [];
      let clientMessages = [];

      try {
        const profileRes = await API.get("/client/profile");

        profileData = normalizeUser({
          ...profileRes.data,
          firstName: profileRes.data?.firstName || "",
          lastName: profileRes.data?.lastName || "",
          name: profileRes.data?.name || "Client",
          email: profileRes.data?.email || "",
          phone: profileRes.data?.phone || "No phone",
          city: profileRes.data?.city || "",
          country: profileRes.data?.country || "",
          avatar: profileRes.data?.avatar || "",
          role: profileRes.data?.role || "user",
        });

        setUser(profileData);
        setEditForm(profileData);
        saveStoredUser(profileData);
      } catch (err) {
        console.log("CLIENT PROFILE ERROR:", err.response?.data || err.message);

        setUser(profileData);
        setEditForm(profileData);
      }

      try {
        const bookingsRes = await API.get("/client/mybookings");
        apiBookings = bookingsRes.data || [];
      } catch (err) {
        console.log("CLIENT BOOKINGS ERROR:", err.response?.data || err.message);
      }

      try {
        const paymentsRes = await API.get("/client/payments");
        apiPayments = paymentsRes.data || [];
      } catch (err) {
        console.log("CLIENT PAYMENTS ERROR:", err.response?.data || err.message);
      }

      try {
        const messagesRes = await API.get("/client/messages");
        clientMessages = messagesRes.data || [];
      } catch (err) {
        console.log("CLIENT MESSAGES ERROR:", err.response?.data || err.message);
      }

      const adminBookings = getAdminCreatedBookingsForClient(profileData.email);
      const finalBookings = mergeBookings(apiBookings, adminBookings);

      setBookings(finalBookings);
      setPayments(apiPayments);
      setMessages(clientMessages);
      setMessageNotifications(
        clientMessages.filter(
          (msg) => (msg.sender || "client") === "admin" && !msg.isRead
        ).length
      );
    };

    loadClientData();
  }, []);

  useEffect(() => {
    if (!user?.email) return undefined;

    const refreshAdminCreatedBookings = () => {
      const adminBookings = getAdminCreatedBookingsForClient(user.email);

      setBookings((prevBookings) =>
        mergeBookings(prevBookings || [], adminBookings)
      );
    };

    refreshAdminCreatedBookings();

    window.addEventListener("storage", refreshAdminCreatedBookings);

    return () => {
      window.removeEventListener("storage", refreshAdminCreatedBookings);
    };
  }, [user.email]);

  useEffect(() => {
    if (activePage === "messages") {
      setMessageNotifications(0);
      return undefined;
    }

    const loadUnreadMessages = async () => {
      try {
        const res = await API.get("/client/messages/unread-count");
        setMessageNotifications(Number(res.data?.count || 0));
      } catch (err) {
        console.log(
          "Client message notification error:",
          err.response?.data || err.message
        );
      }
    };

    loadUnreadMessages();

    const unreadTimer = setInterval(loadUnreadMessages, 5000);

    return () => clearInterval(unreadTimer);
  }, [activePage]);

  useEffect(() => {
    const markMessagesRead = async () => {
      if (activePage !== "messages") return;

      try {
        await API.put("/client/messages/read");

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            (msg.sender || "client") === "admin"
              ? { ...msg, isRead: true }
              : msg
          )
        );

        setMessageNotifications(0);
      } catch (err) {
        console.log(
          "Client mark messages read error:",
          err.response?.data || err.message
        );
      }
    };

    markMessagesRead();
  }, [activePage]);

  const handleSaveProfile = async () => {
    try {
      const res = await API.put("/client/profile", {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phone: editForm.phone,
        city: editForm.city,
        country: editForm.country,
        avatar: editForm.avatar || editForm.profileImage || "",
        profileImage: editForm.profileImage || editForm.avatar || "",
      });

      const updatedUser = normalizeUser({
        ...user,
        ...editForm,
        ...res.data,
        email: res.data?.email || user.email,
        role: res.data?.role || user.role || "user",
        avatar:
          res.data?.avatar ||
          res.data?.profileImage ||
          editForm.avatar ||
          editForm.profileImage ||
          user.avatar ||
          "",
        profileImage:
          res.data?.profileImage ||
          res.data?.avatar ||
          editForm.profileImage ||
          editForm.avatar ||
          user.profileImage ||
          "",
      });

      setUser(updatedUser);
      setEditForm(updatedUser);
      saveStoredUser(updatedUser);

      window.dispatchEvent(
        new CustomEvent("profilePhotoUpdated", {
          detail: updatedUser,
        })
      );

      const adminBookings = getAdminCreatedBookingsForClient(updatedUser.email);

      setBookings((prevBookings) =>
        mergeBookings(prevBookings || [], adminBookings)
      );

      setShowEdit(false);
    } catch (err) {
      alert(err.response?.data?.error || err.message || "Update profile error");
    }
  };

  const handleChangePassword = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      alert("Please fill all password fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await API.put("/client/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      alert("Password changed successfully");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPassword(false);
    } catch (err) {
      alert(err.response?.data?.error || "Password change failed");
    }
  };

  const handleSendMessage = async () => {
    const message = messageText.trim();

    if (!message) return;

    try {
      const res = await API.post("/client/messages", { message });

      setMessages((prevMessages) => [...prevMessages, res.data]);
      setMessageText("");
    } catch (err) {
      alert(err.response?.data?.error || err.message || "Message not sent");
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const imageBase64 = await compressProfilePhoto(file);
      const updatedUser = normalizeUser({
        ...user,
        avatar: imageBase64,
        profileImage: imageBase64,
      });

      setUser(updatedUser);
      setEditForm(updatedUser);
      saveStoredUser(updatedUser);

      window.dispatchEvent(
        new CustomEvent("profilePhotoUpdated", {
          detail: updatedUser,
        })
      );

      try {
        const res = await API.put("/client/profile", {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phone: updatedUser.phone,
          city: updatedUser.city,
          country: updatedUser.country,
          avatar: updatedUser.avatar,
          profileImage: updatedUser.profileImage,
        });

        const savedUser = normalizeUser({
          ...updatedUser,
          ...res.data,
          avatar: res.data?.avatar || updatedUser.avatar,
          profileImage: res.data?.avatar || updatedUser.profileImage,
        });

        setUser(savedUser);
        setEditForm(savedUser);
        saveStoredUser(savedUser);
      } catch (err) {
        console.log("Photo update failed:", err.response?.data || err.message);
        const revertedUser = normalizeUser(user);

        setUser(revertedUser);
        setEditForm(revertedUser);
        saveStoredUser(revertedUser);

        alert(err.response?.data?.error || "Photo update failed");
      }
    } catch (err) {
      console.log("Photo compression failed:", err);
      alert("Unable to read this photo. Please choose another image.");
    } finally {
      e.target.value = "";
    }
  };

  const handleRemovePhoto = () => {
    setShowRemovePhotoConfirm(true);
  };

  const confirmRemovePhoto = async () => {
    const updatedUser = normalizeUser({
      ...user,
      avatar: "",
      profileImage: "",
      photo: "",
      image: "",
    });

    setUser(updatedUser);
    setEditForm(updatedUser);
    saveStoredUser(updatedUser);

    window.dispatchEvent(
      new CustomEvent("profilePhotoUpdated", {
        detail: updatedUser,
      })
    );

    setShowRemovePhotoConfirm(false);

    try {
      await API.put("/client/profile", {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        city: updatedUser.city,
        country: updatedUser.country,
        avatar: "",
        profileImage: "",
      });
    } catch (err) {
      console.log("Remove photo failed:", err.response?.data || err.message);
      alert("Photo removed locally, but backend update failed");
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log("Logout error:", err.response?.data || err.message);
    }

    clearStoredAuth();

    window.location.href = "/login";
  };

  const renderPage = () => {
    if (activePage === "dashboard") {
      return <Dashboard user={user} onContact={() => setShowContact(true)} />;
    }

    if (activePage === "booking") {
      return (
        <Bookings
          bookings={bookings}
          bookingTab={bookingTab}
          setBookingTab={setBookingTab}
        />
      );
    }

    if (activePage === "payment") {
      return <Payments payments={payments} />;
    }

    if (activePage === "messages") {
      return (
        <Messages
          messages={messages}
          messageText={messageText}
          setMessageText={setMessageText}
          onSendMessage={handleSendMessage}
          onRefreshMessages={fetchClientMessages}
        />
      );
    }

    if (activePage === "settings") {
      return (
        <Settings
          onEditProfile={() => setShowEdit(true)}
          onChangePassword={() => setShowPassword(true)}
        />
      );
    }

    return <Dashboard user={user} onContact={() => setShowContact(true)} />;
  };

  return (
    <div className="user-page">
      <Navbar />

      <div className="user-container">
        <ProfileSidebar
          activePage={activePage}
          setActivePage={setActivePage}
          messageNotifications={messageNotifications}
          onLogout={logout}
        />

        <main className="client-content">
          <UserHero
            user={user}
            onPhotoChange={handlePhotoChange}
            onRemovePhoto={handleRemovePhoto}
          />

          {renderPage()}
        </main>
      </div>

      <div className="client-profile-footer">
        <Footer />
      </div>

      {showEdit && (
        <EditProfilePopup
          editForm={editForm}
          setEditForm={setEditForm}
          onSave={handleSaveProfile}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showPassword && (
        <ChangePasswordPopup
          passwordForm={passwordForm}
          setPasswordForm={setPasswordForm}
          onSave={handleChangePassword}
          onClose={() => setShowPassword(false)}
        />
      )}

      {showContact && <ContactPopup onClose={() => setShowContact(false)} />}

      {showRemovePhotoConfirm && (
        <div className="photo-confirm-overlay">
          <div className="photo-confirm-popup">
            <div className="photo-confirm-icon">!</div>

            <h2>Remove Profile Photo?</h2>

            <p>
              Are you sure you want to remove your profile photo? You can upload
              a new one anytime.
            </p>

            <div className="photo-confirm-actions">
              <button
                type="button"
                className="photo-confirm-delete"
                onClick={confirmRemovePhoto}
              >
                Remove photo
              </button>

              <button
                type="button"
                className="photo-confirm-cancel"
                onClick={() => setShowRemovePhotoConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
