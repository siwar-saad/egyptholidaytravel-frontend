import { useState } from "react";
import AdminLayout from "./AdminLayout";
import "./AdminPages.css";

export default function Messages() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      client: "Sarah M.",
      email: "sarah@email.com",
      message: "I want more details about Hurghada package.",
      reply: "",
    },
    {
      id: 2,
      client: "Ahmed K.",
      email: "ahmed@email.com",
      message: "Can I change my reservation date?",
      reply: "",
    },
  ]);

  const handleReply = (id, value) => {
    setMessages(
      messages.map((msg) =>
        msg.id === id ? { ...msg, reply: value } : msg
      )
    );
  };

  const sendReply = (id) => {
    setMessages(
      messages.map((msg) =>
        msg.id === id ? { ...msg, sent: true } : msg
      )
    );
  };

  return (
    <AdminLayout>
      <div className="admin-page-content">
        <h1>Client Messages</h1>

        <div className="messages-list">
          {messages.map((msg) => (
            <div className="message-card" key={msg.id}>
              <div className="message-head">
                <div>
                  <h3>{msg.client}</h3>
                  <p>{msg.email}</p>
                </div>

                <span className={msg.sent ? "msg-status sent" : "msg-status new"}>
                  {msg.sent ? "Replied" : "New"}
                </span>
              </div>

              <div className="client-message">
                <strong>Message:</strong>
                <p>{msg.message}</p>
              </div>

              <textarea
                placeholder="Write your reply..."
                value={msg.reply}
                onChange={(e) => handleReply(msg.id, e.target.value)}
              />

              <button
                className="main-btn"
                disabled={!msg.reply.trim()}
                onClick={() => sendReply(msg.id)}
              >
                Send Reply
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}