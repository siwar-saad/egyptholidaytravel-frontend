export default function Messages({
  messages,
  messageText,
  setMessageText,
  replyTexts,
  setReplyTexts,
  onSendMessage,
  onReplyMessage,
}) {
  const getMessageId = (msg, index) => msg.id || msg._id || index;

  return (
    <section className="page-section">
      <h2>Messages</h2>

      <p className="section-desc">
        Send your request to the agency. Our team will reply as soon as possible.
      </p>

      <div className="message-box">
        <textarea
          placeholder="Write your message here..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />

        <button type="button" onClick={onSendMessage}>
          Send Message
        </button>
      </div>

      {messages.length === 0 && <p className="empty-msg">No messages yet.</p>}

      {messages.map((msg, index) => {
        const messageId = getMessageId(msg, index);

        return (
          <div className="user-message-card" key={messageId}>
            <p className="msg-date">{msg.date || msg.created_at || "Today"}</p>

            <p>{msg.message || "No message content."}</p>

            {msg.reply && (
              <div className="admin-reply">
                <strong>Agency reply:</strong>
                <p>{msg.reply}</p>
              </div>
            )}

            <div className="user-reply-box">
              <textarea
                placeholder="Write your reply to the agency..."
                value={replyTexts[messageId] || ""}
                onChange={(e) =>
                  setReplyTexts({
                    ...replyTexts,
                    [messageId]: e.target.value,
                  })
                }
              />

              <button type="button" onClick={() => onReplyMessage(messageId)}>
                Reply
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
}
