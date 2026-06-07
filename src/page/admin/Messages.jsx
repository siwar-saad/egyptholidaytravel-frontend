import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaCircle,
  FaInbox,
  FaPaperPlane,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";
import API from "../../api";

const safeText = (value) => String(value || "").trim();

const getMessageId = (msg = {}) =>
  msg.id || msg._id || msg.message_id || msg.messageId || null;

const getUserId = (msg = {}) =>
  msg.clientId ||
  msg.userId ||
  msg.client_id ||
  msg.user_id ||
  msg.client?._id ||
  msg.client?.id ||
  msg.user?._id ||
  msg.user?.id ||
  null;

const getConversationKey = (msg = {}) => {
  const userId = getUserId(msg);

  if (userId) return `user-${String(userId).toLowerCase()}`;

  return safeText(
    msg.email || msg.phone || msg.name || `visitor-${getMessageId(msg) || ""}`
  ).toLowerCase();
};

const getMessageKey = (msg = {}, index = 0) =>
  getMessageId(msg) ||
  `${safeText(getConversationKey(msg))}-${safeText(
    msg.createdAt || msg.created_at || msg.dateTime || msg.date || index
  )}-${index}`;

const getMessageDate = (msg = {}) => {
  const rawDate =
    msg.createdAt ||
    msg.created_at ||
    msg.repliedAt ||
    msg.replied_at ||
    msg.dateTime ||
    msg.date ||
    new Date();

  const date = new Date(rawDate);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

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

const formatDateValue = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

const getInitial = (name = "Visitor") =>
  safeText(name || "Visitor").charAt(0).toUpperCase() || "V";

export default function Messages({ showSuccess, onUnreadChange }) {
  const [messages, setMessages] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [selectedConversationKey, setSelectedConversationKey] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);

  const threadEndRef = useRef(null);

  const notify = useCallback(
    (message) => {
      if (typeof showSuccess === "function") {
        showSuccess(message);
      }
    },
    [showSuccess]
  );

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await API.get("/admin/messages");

      const loadedMessages = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setMessages(loadedMessages);

      setSelectedConversationKey((currentKey) => {
        if (
          currentKey &&
          loadedMessages.some((msg) => getConversationKey(msg) === currentKey)
        ) {
          return currentKey;
        }

        return loadedMessages[0] ? getConversationKey(loadedMessages[0]) : null;
      });

      setReplyDrafts((currentDrafts) => {
        const nextDrafts = { ...currentDrafts };

        loadedMessages.forEach((msg) => {
          const id = getMessageId(msg);

          if (id && nextDrafts[id] === undefined) {
            nextDrafts[id] = "";
          }
        });

        return nextDrafts;
      });
    } catch (err) {
      console.log("Messages error:", err.response?.data || err.message);
      notify("Failed to load messages.");
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const conversations = useMemo(() => {
    const map = new Map();

    messages.forEach((msg) => {
      const key = getConversationKey(msg);

      if (!key) return;

      const current = map.get(key) || {
        key,
        clientId: getUserId(msg),
        name: msg.name || msg.client?.name || msg.user?.name || "Visitor",
        email: msg.email || msg.client?.email || msg.user?.email || "",
        phone: msg.phone || msg.client?.phone || msg.user?.phone || "",
        isRegisteredUser: Boolean(msg.isRegisteredUser || getUserId(msg)),
        messages: [],
      };

      current.messages.push(msg);
      current.clientId = current.clientId || getUserId(msg);
      current.name =
        current.name ||
        msg.name ||
        msg.client?.name ||
        msg.user?.name ||
        "Visitor";
      current.email =
        current.email || msg.email || msg.client?.email || msg.user?.email || "";
      current.phone =
        current.phone || msg.phone || msg.client?.phone || msg.user?.phone || "";
      current.isRegisteredUser =
        current.isRegisteredUser ||
        Boolean(msg.isRegisteredUser || getUserId(msg));

      map.set(key, current);
    });

    return Array.from(map.values())
      .map((conversation) => {
        const sortedConversationMessages = [...conversation.messages].sort(
          (a, b) => getMessageDate(a).getTime() - getMessageDate(b).getTime()
        );

        const unreadCount = sortedConversationMessages.filter(
          (msg) => (msg.sender || "client") !== "admin" && !msg.isRead
        ).length;

        const latest =
          sortedConversationMessages[sortedConversationMessages.length - 1];

        const latestSender = latest?.sender || "client";
        const hasReply = latestSender === "admin" || Boolean(latest?.reply);

        return {
          ...conversation,
          messages: sortedConversationMessages,
          latest,
          unreadCount,
          hasReply,
        };
      })
      .sort(
        (a, b) =>
          getMessageDate(b.latest).getTime() - getMessageDate(a.latest).getTime()
      );
  }, [messages]);

  const filteredConversations = useMemo(() => {
    const cleanSearch = search.toLowerCase().trim();

    if (!cleanSearch) return conversations;

    return conversations.filter((conversation) =>
      `${conversation.name} ${conversation.email} ${
        conversation.phone
      } ${conversation.messages
        .map((msg) => `${msg.message || ""} ${msg.reply || ""}`)
        .join(" ")}`
        .toLowerCase()
        .includes(cleanSearch)
    );
  }, [conversations, search]);

  const selectedConversation = useMemo(() => {
    return (
      filteredConversations.find(
        (conversation) => conversation.key === selectedConversationKey
      ) || filteredConversations[0]
    );
  }, [filteredConversations, selectedConversationKey]);

  const selectedMessages = selectedConversation?.messages || [];

  const lastMessage = selectedMessages[selectedMessages.length - 1];

  const lastClientMessage = useMemo(
    () =>
      [...selectedMessages]
        .reverse()
        .find((msg) => (msg.sender || "client") !== "admin"),
    [selectedMessages]
  );

  const replyTarget = useMemo(
    () =>
      [...selectedMessages]
        .reverse()
        .find((msg) => (msg.sender || "client") !== "admin" && !msg.reply) ||
      lastClientMessage ||
      lastMessage,
    [selectedMessages, lastClientMessage, lastMessage]
  );

  const replyTargetId = replyTarget ? getMessageId(replyTarget) : null;
  const currentReplyText = replyTargetId ? replyDrafts[replyTargetId] || "" : "";

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.key, selectedMessages.length]);

  useEffect(() => {
    if (!selectedConversation || selectedConversation.unreadCount === 0) return;

    const markAsRead = async () => {
      const payload = {
        conversationKey: selectedConversation.key,
        clientId: selectedConversation.clientId,
        email: selectedConversation.email,
        phone: selectedConversation.phone,
      };

      try {
        await API.put("/admin/messages/read", payload);

        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (
              (msg.sender || "client") === "admin" ||
              msg.isRead ||
              getConversationKey(msg) !== selectedConversation.key
            ) {
              return msg;
            }

            return { ...msg, isRead: true };
          })
        );

        if (typeof onUnreadChange === "function") {
          onUnreadChange((current) =>
            Math.max(0, current - selectedConversation.unreadCount)
          );
        }
      } catch (err) {
        console.log("Read messages error:", err.response?.data || err.message);
      }
    };

    markAsRead();
  }, [selectedConversation, onUnreadChange]);

  const replyMessage = async () => {
    if (replyTargetId === null || replyTargetId === undefined) {
      notify("This message has no ID, so it cannot be replied to.");
      return;
    }

    const cleanReply = currentReplyText.trim();

    if (!cleanReply) {
      notify("Please write a reply first.");
      return;
    }

    try {
      setIsSendingReply(true);

      const res = await API.put(`/admin/messages/${replyTargetId}/reply`, {
        reply: cleanReply,
      });

      const savedMessage = res.data?.data || {};

      const repliedAt =
        savedMessage.repliedAt ||
        savedMessage.replied_at ||
        savedMessage.updatedAt ||
        savedMessage.updated_at ||
        new Date().toISOString();

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          String(getMessageId(msg)) === String(replyTargetId)
            ? {
                ...msg,
                reply: cleanReply,
                repliedAt,
                repliedAtTime: formatDateValue(repliedAt),
                isRead: true,
              }
            : msg
        )
      );

      setReplyDrafts((prevDrafts) => ({
        ...prevDrafts,
        [replyTargetId]: "",
      }));

      notify(res.data?.message || "Reply saved successfully.");
    } catch (err) {
      console.log("Reply error:", err.response?.data || err.message);
      notify(err.response?.data?.error || "Failed to save reply.");
    } finally {
      setIsSendingReply(false);
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
            <p>Each client has one clean conversation with the agency.</p>
          </div>

          <button type="button" onClick={loadMessages} disabled={isLoading}>
            <FaSyncAlt />
            {isLoading ? "Loading..." : "Refresh"}
          </button>
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
              <div className="admin-empty-state">
                <h3>No conversations</h3>
                <p>No client messages match your search.</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  type="button"
                  className={`admin-messenger-item ${
                    conversation.key === selectedConversation?.key ? "active" : ""
                  }`}
                  key={conversation.key}
                  onClick={() => setSelectedConversationKey(conversation.key)}
                >
                  <span className="admin-message-avatar">
                    {getInitial(conversation.name)}
                  </span>

                  <span className="admin-mail-preview">
                    <strong>{conversation.name || "Visitor"}</strong>
                    <small>{conversation.email || "No email"}</small>
                    <small>{conversation.phone || "No phone"}</small>

                    <em
                      className={
                        conversation.unreadCount > 0
                          ? "status-new"
                          : conversation.hasReply
                          ? "status-replied"
                          : "status-opened"
                      }
                    >
                      {conversation.unreadCount > 0
                        ? `${conversation.unreadCount} new`
                        : conversation.hasReply
                        ? "Replied"
                        : "Opened"}
                    </em>
                  </span>

                  <span className="admin-mail-date">
                    {formatConversationTime(conversation.latest)}
                  </span>
                </button>
              ))
            )}
          </aside>

          <div className="admin-messenger-pane">
            {selectedConversation ? (
              <>
                <div className="admin-messenger-head">
                  <div>
                    <h3>{selectedConversation.name || "Visitor"}</h3>

                    <p className="admin-client-status">
                      <FaCircle />
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
                  {selectedMessages.map((msg, index) => {
                    const isAdmin = (msg.sender || "client") === "admin";
                    const currentDate = getMessageDate(msg);
                    const previousMessage = selectedMessages[index - 1];

                    const showDateDivider =
                      !previousMessage ||
                      !isSameDay(currentDate, getMessageDate(previousMessage));

                    return (
                      <div
                        className="conversation-group"
                        key={getMessageKey(msg, index)}
                      >
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
                              {getInitial(selectedConversation.name)}
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
                                <span>
                                  {formatDateValue(
                                    msg.repliedAtTime || msg.repliedAt
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div ref={threadEndRef} />
                </div>

                {replyTargetId !== null && replyTargetId !== undefined && (
                  <div className="admin-messenger-composer">
                    <textarea
                      placeholder="Write a reply..."
                      value={currentReplyText}
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

                    <button
                      type="button"
                      onClick={replyMessage}
                      disabled={isSendingReply || !currentReplyText.trim()}
                      title="Send reply"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="admin-empty-state large">
                <h3>Select a conversation</h3>
                <p>Choose a client from the left side to read the full thread.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}