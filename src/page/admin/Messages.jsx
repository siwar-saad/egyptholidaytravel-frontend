import { useEffect, useState } from "react";
import API from "../../api";

export default function Messages({ showSuccess }) {
  const [messages, setMessages] = useState([]);
  const [showReplyPopup, setShowReplyPopup] = useState(false);
  const [sentReplyText, setSentReplyText] = useState("");

  const notify = (message) => {
    if (typeof showSuccess === "function") {
      showSuccess(message);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get("/admin/messages");
        setMessages(res.data || []);
      } catch (err) {
        console.log("Messages error:", err.response?.data || err.message);
      }
    };

    fetchMessages();
  }, []);

  const getMessageId = (msg) => msg.id || msg._id;

  const replyMessage = async (id, reply) => {
    const cleanReply = reply?.trim();

    if (!cleanReply) {
      notify("Please write a reply first.");
      return;
    }

    try {
      await API.put(`/admin/messages/${id}/reply`, {
        reply: cleanReply,
      });

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          getMessageId(msg) === id
            ? {
                ...msg,
                reply: cleanReply,
              }
            : msg
        )
      );

      setSentReplyText(cleanReply);
      setShowReplyPopup(true);
      notify("Reply sent successfully.");
    } catch (err) {
      console.log("Reply error:", err.response?.data || err.message);
      notify("Failed to send reply.");
    }
  };

  const updateReplyText = (id, value) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        getMessageId(msg) === id
          ? {
              ...msg,
              reply: value,
            }
          : msg
      )
    );
  };

  return (
    <>
      <section className="admin-panel">
        <div className="panel-head">
          <div>
            <h2>Messages</h2>
            <p>Reply to your clients professionally.</p>
          </div>
        </div>

        {messages.length === 0 ? (
          <p className="empty-msg">No messages yet.</p>
        ) : (
          <div className="admin-messages-wrapper">
            {messages.map((msg) => {
              const messageId = getMessageId(msg);

              return (
                <div className="admin-message-card" key={messageId}>
                  <div className="admin-message-head">
                    <div className="admin-message-user">
                      <div className="admin-message-avatar">
                        {(msg.name || "C").charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h3>{msg.name || "Client"}</h3>
                        <p>{msg.email || "No email"}</p>
                      </div>
                    </div>

                    <span className="admin-message-date">
                      {msg.date || msg.created_at || "Today"}
                    </span>
                  </div>

                  <div className="client-msg">
                    {msg.message || "No message content."}
                  </div>

                  <textarea
                    placeholder="Write your professional reply here..."
                    value={msg.reply || ""}
                    onChange={(e) =>
                      updateReplyText(messageId, e.target.value)
                    }
                  />

                  <div className="admin-message-actions">
                    <button
                      type="button"
                      onClick={() => replyMessage(messageId, msg.reply)}
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {showReplyPopup && (
        <div className="message-success-overlay">
          <div className="message-success-popup">
            <div className="message-success-icon">✓</div>

            <h2>Reply Sent Successfully</h2>

            <p>
              Your message has been sent to the client in a professional way.
            </p>

            <div className="sent-message-box">{sentReplyText}</div>

            <button
              type="button"
              onClick={() => setShowReplyPopup(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}