/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import API from "../../../api";
import "./UserProfile.css";
import Navbar from "../../../components/navbar";

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
import MessageSuccessPopup from "./MessageSuccessPopup";

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem("user") ||
        sessionStorage.getItem("user") ||
        "{}"
    );
  } catch {
    return {};
  }
}

function setStoredUser(user) {
  const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
  storage.setItem("user", JSON.stringify(user));
}

export default function UserProfile() {
  const storedUser = getStoredUser();

  const [activePage, setActivePage] = useState("dashboard");

  const [user, setUser] = useState({
    name: storedUser.name || "Client",
    email: storedUser.email || "",
    phone: storedUser.phone || "No phone",
    city: storedUser.city || "Mansoura",
    country: storedUser.country || "Egypt",
    avatar: storedUser.avatar || "",
    role: storedUser.role || "user",
  });

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [messages, setMessages] = useState([]);

  const [messageText, setMessageText] = useState("");
  const [replyTexts, setReplyTexts] = useState({});
  const [messageNotifications, setMessageNotifications] = useState(0);

  const [showClientPopup, setShowClientPopup] = useState(false);
  const [sentMessageText, setSentMessageText] = useState("");

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

  useEffect(() => {
    const loadClientData = async () => {
      try {
        const profileRes = await API.get("/client/profile");
        const bookingsRes = await API.get("/client/bookings");
        const paymentsRes = await API.get("/client/payments");
        const messagesRes = await API.get("/client/messages");

        const profileData = {
          ...profileRes.data,
          name: profileRes.data?.name || storedUser.name || "Client",
          email: profileRes.data?.email || storedUser.email || "",
          phone: profileRes.data?.phone || storedUser.phone || "No phone",
          city: profileRes.data?.city || storedUser.city || "Mansoura",
          country: profileRes.data?.country || storedUser.country || "Egypt",
          avatar: profileRes.data?.avatar || storedUser.avatar || "",
          role: profileRes.data?.role || storedUser.role || "user",
        };

        const clientMessages = messagesRes.data || [];

        setUser(profileData);
        setEditForm(profileData);
        setBookings(bookingsRes.data || []);
        setPayments(paymentsRes.data || []);
        setMessages(clientMessages);
        setMessageNotifications(clientMessages.filter((msg) => msg.reply).length);

        setStoredUser(profileData);
      } catch (err) {
        console.log("CLIENT DATA ERROR:", err.response?.data || err.message);
      }
    };

    loadClientData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const res = await API.put("/client/profile", {
        name: editForm.name,
        phone: editForm.phone,
        city: editForm.city,
        country: editForm.country,
        avatar: editForm.avatar,
      });

      const updatedUser = {
        ...res.data,
        email: res.data?.email || user.email,
        role: res.data?.role || user.role || storedUser.role || "user",
      };

      setUser(updatedUser);
      setEditForm(updatedUser);
      setStoredUser(updatedUser);
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

      setMessages((prevMessages) => [res.data, ...prevMessages]);
      setSentMessageText(message);
      setShowClientPopup(true);
      setMessageText("");
    } catch (err) {
      alert(err.response?.data?.error || err.message || "Message not sent");
    }
  };

  const handleReplyMessage = async (messageId) => {
    const reply = replyTexts[messageId]?.trim();

    if (!reply) return;

    try {
      const res = await API.post("/client/messages", { message: reply });

      setMessages((prevMessages) => [res.data, ...prevMessages]);
      setSentMessageText(reply);
      setShowClientPopup(true);

      setReplyTexts((prevReplies) => ({
        ...prevReplies,
        [messageId]: "",
      }));
    } catch (err) {
      alert(err.response?.data?.error || "Reply not sent");
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
          name: updatedUser.name,
          phone: updatedUser.phone,
          city: updatedUser.city,
          country: updatedUser.country,
          avatar: updatedUser.avatar,
        });

        setUser(updatedUser);
        setEditForm(updatedUser);
        setStoredUser(updatedUser);
      } catch (err) {
        console.log("Photo update failed:", err.response?.data || err.message);
        alert("Photo update failed");
      }
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
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
          replyTexts={replyTexts}
          setReplyTexts={setReplyTexts}
          onSendMessage={handleSendMessage}
          onReplyMessage={handleReplyMessage}
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
          setMessageNotifications={setMessageNotifications}
          onLogout={logout}
        />

        <main className="client-content">
          <UserHero user={user} onPhotoChange={handlePhotoChange} />
          {renderPage()}
        </main>
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

      {showClientPopup && (
        <MessageSuccessPopup
          sentMessageText={sentMessageText}
          onClose={() => setShowClientPopup(false)}
        />
      )}
    </div>
  );
}
