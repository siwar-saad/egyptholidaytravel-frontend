import { useEffect, useMemo, useRef } from "react";
import { FaPaperPlane, FaSyncAlt } from "react-icons/fa";

const getMessageDate = (msg) =>
  new Date(
    msg.createdAt || msg.created_at || msg.dateTime || msg.date || Date.now()
  );

const isSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const formatChatDate = (date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatChatTime = (msg) =>
  getMessageDate(msg).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Messages({
  messages,
  messageText,
  setMessageText,
  onSendMessage,
  onRefreshMessages,
}) {
  const threadEndRef = useRef(null);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort((a, b) => {
        const firstDate = getMessageDate(a).getTime();
        const secondDate = getMessageDate(b).getTime();
        return firstDate - secondDate;
      }),
    [messages]
  );

  useEffect(() => {
    if (typeof onRefreshMessages !== "function") return undefined;

    const refreshTimer = setInterval(() => {
      onRefreshMessages();
    }, 5000);

    return () => clearInterval(refreshTimer);
  }, [onRefreshMessages]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages.length]);

  return (
    <section className="page-section">
      <div className="messenger-header">
        <div className="messenger-avatar">E</div>

        <div>
          <h2>Egypt Holiday Travel</h2>
          <p>{sortedMessages.length} messages</p>
        </div>

        <button type="button" onClick={onRefreshMessages}>
          <FaSyncAlt /> Refresh
        </button>
      </div>

      <div className="messenger-chat">
        <div className="messenger-thread">
          {sortedMessages.length === 0 ? (
            <p className="empty-msg">Start your conversation with the agency.</p>
          ) : (
            sortedMessages.map((msg, index) => {
              const isAdmin = (msg.sender || "client") === "admin";
              const currentDate = getMessageDate(msg);
              const previousMessage = sortedMessages[index - 1];
              const showDateDivider =
                !previousMessage ||
                !isSameDay(currentDate, getMessageDate(previousMessage));

              return (
                <div className="messenger-message-group" key={msg.id || index}>
                  {showDateDivider && (
                    <div className="messenger-date-divider">
                      {formatChatDate(currentDate)}
                    </div>
                  )}

                  <div className={`chat-row ${isAdmin ? "incoming" : "outgoing"}`}>
                    {isAdmin && <div className="messenger-avatar small">E</div>}

                    <div className="chat-bubble">
                      <p>{msg.message || "No message content."}</p>
                      <span>{formatChatTime(msg)}</span>
                    </div>
                  </div>

                  {msg.reply && (
                    <div className="chat-row incoming">
                      <div className="messenger-avatar small">E</div>
                      <div className="chat-bubble">
                        <p>{msg.reply}</p>
                        <span>{msg.repliedAtTime || msg.repliedAt || "Reply"}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          <div ref={threadEndRef} />
        </div>

        <div className="messenger-composer">
          <textarea
            placeholder="Aa"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
          />

          <button type="button" onClick={onSendMessage}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </section>
  );
}
