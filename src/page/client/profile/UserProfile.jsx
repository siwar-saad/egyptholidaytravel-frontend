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
          firstName: profileRes.data?.firstName || "",
          lastName: profileRes.data?.lastName || "",
          name: profileRes.data?.name || "Client",
          email: profileRes.data?.email || "",
          phone: profileRes.data?.phone || "No phone",
          city: profileRes.data?.city || "Mansoura",
          country: profileRes.data?.country || "Egypt",
          avatar: profileRes.data?.avatar || "",
          role: profileRes.data?.role || "user",
        };

        const clientMessages = messagesRes.data || [];

        setUser(profileData);
        setEditForm(profileData);
        setBookings(bookingsRes.data || []);
        setPayments(paymentsRes.data || []);
        setMessages(clientMessages);
        setMessageNotifications(
          clientMessages.filter(
            (msg) => (msg.sender || "client") === "admin" && !msg.isRead
          ).length
        );

      } catch (err) {
        console.log("CLIENT DATA ERROR:", err.response?.data || err.message);
      }
    };

    loadClientData();
  }, []);

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
        avatar: editForm.avatar,
      });

      const updatedUser = {
        ...res.data,
        email: res.data?.email || user.email,
        role: res.data?.role || user.role || "user",
      };

      setUser(updatedUser);
      setEditForm(updatedUser);
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
          onRefreshMessages={async () => {
            try {
              const res = await API.get("/client/messages");
              let refreshedMessages = res.data || [];
              const unreadAdminMessages = refreshedMessages.filter(
                (msg) => (msg.sender || "client") === "admin" && !msg.isRead
              );

              if (unreadAdminMessages.length > 0) {
                await API.put("/client/messages/read");

                refreshedMessages = refreshedMessages.map((msg) =>
                  (msg.sender || "client") === "admin"
                    ? { ...msg, isRead: true }
                    : msg
                );

                setMessageNotifications(0);
              } else {
                setMessageNotifications(0);
              }

              setMessages(refreshedMessages);
            } catch (err) {
              alert(err.response?.data?.error || "Unable to refresh messages");
            }
          }}
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
