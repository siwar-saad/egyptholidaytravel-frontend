import { useEffect, useMemo, useRef, useState } from "react";
import { FaInbox, FaPaperPlane, FaSearch } from "react-icons/fa";
import API from "../../api";

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

const formatConversationTime = (msg) => {
  const date = getMessageDate(msg);
  const today = new Date();

  if (isSameDay(date, today)) {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return formatChatDate(date);
};

export default function Messages({ showSuccess }) {
  const [messages, setMessages] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [selectedConversationKey, setSelectedConversationKey] = useState(null);
  const [search, setSearch] = useState("");
  const [showReplyPopup, setShowReplyPopup] = useState(false);
  const [sentReplyText, setSentReplyText] = useState("");
  const threadEndRef = useRef(null);

  const notify = (message) => {
    if (typeof showSuccess === "function") {
      showSuccess(message);
    }
  };

  const getMessageId = (msg) => msg.id || msg._id;
  const getConversationKey = (msg) =>
    (msg.email || msg.name || `visitor-${getMessageId(msg)}`).toLowerCase();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get("/admin/messages");
        const loadedMessages = res.data || [];

        setMessages(loadedMessages);
        setSelectedConversationKey(
          loadedMessages[0] ? getConversationKey(loadedMessages[0]) : null
        );
        setReplyDrafts(
          loadedMessages.reduce((drafts, msg) => {
            const id = getMessageId(msg);
            if (id) drafts[id] = msg.reply || "";
            return drafts;
          }, {})
        );
      } catch (err) {
        console.log("Messages error:", err.response?.data || err.message);
      }
    };

    fetchMessages();
  }, []);

  const conversations = useMemo(() => {
    const map = new Map();

    messages.forEach((msg) => {
      const key = getConversationKey(msg);
      const current = map.get(key) || {
        key,
        name: msg.name || "Visitor",
        email: msg.email || "",
        phone: msg.phone || "",
        isRegisteredUser: msg.isRegisteredUser,
        messages: [],
      };

      current.messages.push(msg);
      current.name = current.name || msg.name || "Visitor";
      current.email = current.email || msg.email || "";
      current.phone = current.phone || msg.phone || "";
      current.isRegisteredUser =
        current.isRegisteredUser || msg.isRegisteredUser;
      map.set(key, current);
    });

    return Array.from(map.values())
      .map((conversation) => ({
        ...conversation,
        messages: conversation.messages.sort((a, b) => {
          const firstDate = getMessageDate(a).getTime();
          const secondDate = getMessageDate(b).getTime();
          return firstDate - secondDate;
        }),
      }))
      .sort((a, b) => {
        const latestA = a.messages[a.messages.length - 1];
        const latestB = b.messages[b.messages.length - 1];
        return (
          getMessageDate(latestB).getTime() - getMessageDate(latestA).getTime()
        );
      });
  }, [messages]);

  const filteredConversations = conversations.filter((conversation) =>
    `${conversation.name} ${conversation.email} ${conversation.phone} ${conversation.messages
      .map((msg) => `${msg.message} ${msg.reply}`)
      .join(" ")}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const selectedConversation =
    filteredConversations.find(
      (conversation) => conversation.key === selectedConversationKey
    ) || filteredConversations[0];

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.key, selectedConversation?.messages?.length]);

  const lastMessage =
    selectedConversation?.messages?.[selectedConversation.messages.length - 1];
  const replyTarget =
    selectedConversation?.messages?.find((msg) => !msg.reply) || lastMessage;
  const replyTargetId = replyTarget ? getMessageId(replyTarget) : null;

  const replyMessage = async () => {
    if (!replyTargetId) return;

    const cleanReply = replyDrafts[replyTargetId]?.trim();

    if (!cleanReply) {
      notify("Please write a reply first.");
      return;
    }

    try {
      const res = await API.put(`/admin/messages/${replyTargetId}/reply`, {
        reply: cleanReply,
      });

      const savedMessage = res.data?.data;

      setMessages((prevMessages) => [
        {
          id: savedMessage?.id || `admin-${Date.now()}`,
          name: selectedConversation?.name || "Client",
          email: selectedConversation?.email || "",
          phone: selectedConversation?.phone || "",
          sender: "admin",
          message: cleanReply,
          reply: "",
          createdAt: savedMessage?.created_at || new Date().toISOString(),
          date: savedMessage?.created_at
            ? new Date(savedMessage.created_at).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          dateTime: savedMessage?.created_at
            ? new Date(savedMessage.created_at).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : new Date().toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              }),
        },
        ...prevMessages,
      ]);

      setReplyDrafts((prevDrafts) => ({
        ...prevDrafts,
        [replyTargetId]: "",
      }));

      setSentReplyText(cleanReply);
      setShowReplyPopup(true);
      notify(res.data?.message || "Reply saved successfully.");
    } catch (err) {
      console.log("Reply error:", err.response?.data || err.message);
      notify(err.response?.data?.error || "Failed to save reply.");
    }
  };

  const updateReplyText = (id, value) => {
    setReplyDrafts((prevDrafts) => ({
      ...prevDrafts,
      [id]: value,
    }));
  };

  return (
    <>
      <section className="admin-panel">
        <div className="panel-head">
          <div>
            <h2>Messages</h2>
            <p>Each client has one conversation with the agency.</p>
          </div>
        </div>

        <div className="admin-messenger-shell">
          <aside className="admin-messenger-list">
            <div className="admin-mail-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="admin-mail-list-title">
              <FaInbox />
              <span>Conversations</span>
              <b>{filteredConversations.length}</b>
            </div>

            {filteredConversations.length === 0 ? (
              <p className="empty-msg">No conversations yet.</p>
            ) : (
              filteredConversations.map((conversation) => {
                const latest =
                  conversation.messages[conversation.messages.length - 1];
                const needsReply =
                  latest?.sender !== "admin" &&
                  conversation.messages.some(
                    (msg) => (msg.sender || "client") !== "admin"
                  );

                return (
                  <button
                    type="button"
                    className={`admin-messenger-item ${
                      conversation.key === selectedConversation?.key
                        ? "active"
                        : ""
                    }`}
                    key={conversation.key}
                    onClick={() => setSelectedConversationKey(conversation.key)}
                  >
                    <span className="admin-message-avatar">
                      {(conversation.name || "V").charAt(0).toUpperCase()}
                    </span>

                    <span className="admin-mail-preview">
                      <strong>{conversation.name || "Visitor"}</strong>
                      <small>{conversation.email || "No email"}</small>
                      <small>{conversation.phone || "No phone"}</small>
                      <em>{needsReply ? "Needs reply" : "Replied"}</em>
                    </span>

                    <span className="admin-mail-date">
                      {formatConversationTime(latest)}
                    </span>
                  </button>
                );
              })
            )}
          </aside>

          <div className="admin-messenger-pane">
            {selectedConversation ? (
              <>
                <div className="admin-messenger-head">
                  <div>
                    <h3>{selectedConversation.name || "Visitor"}</h3>
                    <p>
                      {selectedConversation.isRegisteredUser
                        ? "Registered client"
                        : "Visitor / contact message"}
                    </p>
                    <p>Email: {selectedConversation.email || "No email"}</p>
                    {selectedConversation.phone && (
                      <p>Phone: {selectedConversation.phone}</p>
                    )}
                  </div>

                  <span>{selectedConversation.messages.length} messages</span>
                </div>

                <div className="admin-messenger-thread">
                  {selectedConversation.messages.map((msg, index) => {
                    const isAdmin = (msg.sender || "client") === "admin";
                    const currentDate = getMessageDate(msg);
                    const previousMessage =
                      selectedConversation.messages[index - 1];
                    const showDateDivider =
                      !previousMessage ||
                      !isSameDay(currentDate, getMessageDate(previousMessage));

                    return (
                      <div className="conversation-group" key={getMessageId(msg)}>
                        {showDateDivider && (
                          <div className="messenger-date-divider">
                            {formatChatDate(currentDate)}
                          </div>
                        )}

                        <div
                          className={`admin-chat-row ${
                            isAdmin ? "outgoing" : "incoming"
                          }`}
                        >
                          {!isAdmin && (
                            <span className="admin-message-avatar small">
                              {(selectedConversation.name || "V")
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          )}

                          <div
                            className={`admin-chat-bubble ${
                              isAdmin ? "agency" : "client"
                            }`}
                          >
                            <p>{msg.message || "No message content."}</p>
                            <span>{formatChatTime(msg)}</span>
                          </div>
                        </div>

                        {msg.reply && (
                          <div className="admin-chat-row outgoing">
                            <div className="admin-chat-bubble agency">
                              <p>{msg.reply}</p>
                              {(msg.repliedAtTime || msg.repliedAt) && (
                                <span>{msg.repliedAtTime || msg.repliedAt}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div ref={threadEndRef} />
                </div>

                {replyTargetId && (
                  <div className="admin-messenger-composer">
                    <textarea
                      placeholder="Aa"
                      value={replyDrafts[replyTargetId] || ""}
                      onChange={(e) =>
                        updateReplyText(replyTargetId, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          replyMessage();
                        }
                      }}
                    />

                    <button type="button" onClick={replyMessage}>
                      <FaPaperPlane />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="empty-msg">Select a conversation to read.</p>
            )}
          </div>
        </div>
      </section>

      {showReplyPopup && (
        <div className="message-success-overlay">
          <div className="message-success-popup">
            <div className="message-success-icon">OK</div>

            <h2>Reply Saved</h2>

            <p>Your reply has been saved for this conversation.</p>

            <div className="sent-message-box">{sentReplyText}</div>

            <button type="button" onClick={() => setShowReplyPopup(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
