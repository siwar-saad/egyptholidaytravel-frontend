/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import API from "../../../api";
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
    null,
  );
};

const normalizeUser = (data = {}) => {
  return {
    ...data,
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    name:
      data?.name ||
      `${data?.firstName || ""} ${data?.lastName || ""}`.trim() ||
      "Client",
    email: data?.email || "",
    phone: data?.phone || "No phone",
    city: data?.city || "Mansoura",
    country: data?.country || "Egypt",
    avatar: data?.avatar || "",
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
    [],
  );

  return allReservations
    .filter(
      (reservation) =>
        reservation?.clientEmail?.toLowerCase() === email.toLowerCase(),
    )
    .map(normalizeAdminReservation);
};

const mergeBookings = (apiBookings = [], adminBookings = []) => {
  const normalApiBookings = Array.isArray(apiBookings) ? apiBookings : [];
  const normalAdminBookings = Array.isArray(adminBookings) ? adminBookings : [];

  const withoutOldAdminBookings = normalApiBookings.filter(
    (booking) => booking?.createdBy !== "admin" && !booking?.isAdminCreated,
  );

  const merged = [...normalAdminBookings, ...withoutOldAdminBookings];

  const seen = new Set();

  return merged.filter((booking) => {
    const key = String(
      booking?._id ||
        booking?.id ||
        `${booking?.clientEmail}-${booking?.type}-${booking?.travelDate}`,
    );

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

export default function UserProfile() {
  const [activePage, setActivePage] = useState("dashboard");

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    name: "Client",
    email: "",
    phone: "No phone",
    city: "Mansoura",
    country: "Egypt",
    avatar: "",
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
        (msg) => (msg.sender || "client") === "admin" && !msg.isRead,
      );

      if (activePage === "messages" && unreadAdminMessages.length > 0) {
        await API.put("/client/messages/read");

        refreshedMessages = refreshedMessages.map((msg) =>
          (msg.sender || "client") === "admin" ? { ...msg, isRead: true } : msg,
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

      try {
        const profileRes = await API.get("/client/profile");
        const bookingsRes = await API.get("/client/bookings");
        const paymentsRes = await API.get("/client/payments");
        const messagesRes = await API.get("/client/messages");

        const profileData = normalizeUser(profileRes.data || storedUser);
        const clientMessages = messagesRes.data || [];

        const adminBookings = getAdminCreatedBookingsForClient(
          profileData.email,
        );

        const finalBookings = mergeBookings(
          bookingsRes.data || [],
          adminBookings,
        );

        setUser(profileData);
        setEditForm(profileData);
        setBookings(finalBookings);
        setPayments(paymentsRes.data || []);
        setMessages(clientMessages);

        setMessageNotifications(
          clientMessages.filter(
            (msg) => (msg.sender || "client") === "admin" && !msg.isRead,
          ).length,
        );
      } catch (err) {
        console.log("CLIENT DATA ERROR:", err.response?.data || err.message);

        const fallbackUser = normalizeUser(storedUser);

        const adminBookings = getAdminCreatedBookingsForClient(
          fallbackUser.email,
        );

        setUser(fallbackUser);
        setEditForm(fallbackUser);
        setBookings(adminBookings);
        setPayments([]);
        setMessages([]);
        setMessageNotifications(0);
      }
    };

    loadClientData();
  }, []);

  useEffect(() => {
    if (!user?.email) return undefined;

    const refreshAdminCreatedBookings = () => {
      const adminBookings = getAdminCreatedBookingsForClient(user.email);

      setBookings((prevBookings) =>
        mergeBookings(prevBookings || [], adminBookings),
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
          err.response?.data || err.message,
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
              : msg,
          ),
        );

        setMessageNotifications(0);
      } catch (err) {
        console.log(
          "Client mark messages read error:",
          err.response?.data || err.message,
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
        avatar: editForm.avatar,
      });

      const updatedUser = normalizeUser({
        ...res.data,
        email: res.data?.email || user.email,
        role: res.data?.role || user.role || "user",
      });

      setUser(updatedUser);
      setEditForm(updatedUser);

      const adminBookings = getAdminCreatedBookingsForClient(updatedUser.email);

      setBookings((prevBookings) =>
        mergeBookings(prevBookings || [], adminBookings),
      );

      setShowEdit(false);
    } catch (err) {
      alert(err.response?.data?.error || err.message || "Update profile error");
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
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

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const updatedUser = {
          ...user,
          avatar: reader.result,
        };

        await API.put("/client/profile", {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phone: updatedUser.phone,
          city: updatedUser.city,
          country: updatedUser.country,
          avatar: updatedUser.avatar,
        });

        setUser(updatedUser);
        setEditForm(updatedUser);
      } catch (err) {
        console.log("Photo update failed:", err.response?.data || err.message);
        alert("Photo update failed");
      }
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log("Logout error:", err.response?.data || err.message);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

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
          <UserHero user={user} onPhotoChange={handlePhotoChange} />
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
    </div>
  );
}
