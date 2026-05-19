/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import API from "../../api";

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [subscriberSearch, setSubscriberSearch] = useState("");

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await API.get("/admin/subscribers");
        setSubscribers(res.data || []);
      } catch (err) {
        console.log("Subscribers error:", err.response?.data || err.message);
      }
    };

    fetchSubscribers();
  }, []);

  const filteredSubscribers = subscribers.filter((item) =>
    `${item.email || ""} ${item.created_at || ""}`
      .toLowerCase()
      .includes(subscriberSearch.toLowerCase())
  );

  return (
    <section className="admin-panel">
      <div className="panel-head">
        <div>
          <h2>Email Subscribers</h2>
          <p>Users who subscribed from the home page newsletter.</p>
        </div>

        <div className="admin-search-box">
          <input
            type="text"
            placeholder="Search subscriber..."
            value={subscriberSearch}
            onChange={(e) => setSubscriberSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredSubscribers.length === 0 ? (
        <p className="empty-msg">No subscribers found.</p>
      ) : (
        <div className="subscribers-grid">
          {filteredSubscribers.map((item, index) => (
            <div className="subscriber-card" key={item.id || item._id || index}>
              <div>
                <h3>{item.email || "No email"}</h3>

                <p>{item.created_at || item.createdAt || "New subscriber"}</p>
              </div>

              <span>Subscribed</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}