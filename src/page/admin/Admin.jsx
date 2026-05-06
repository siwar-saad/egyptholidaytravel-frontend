import { useNavigate } from "react-router-dom";
import "./Admin.css";

export default function Admin() {
  const navigate = useNavigate();

  const stats = [
    { title: "Total Packages", value: "14", icon: "📦" },
    { title: "Reservations", value: "128", icon: "🧾" },
    { title: "Clients", value: "320", icon: "👥" },
    { title: "Revenue", value: "$12.5K", icon: "💰" },
  ];

  const bookings = [
    { name: "Sarah M.", trip: "Hurghada", date: "15 Jun 2026", status: "Confirmed" },
    { name: "Ahmed K.", trip: "Turkey Trip", date: "22 Jul 2026", status: "Pending" },
    { name: "Laura P.", trip: "Sharm El Sheikh", date: "03 Aug 2026", status: "Confirmed" },
    { name: "Omar S.", trip: "Luxor", date: "11 Sep 2026", status: "Cancelled" },
  ];

  const packages = [
    { name: "Hurghada", price: "$580", pdf: "Uploaded" },
    { name: "Turkey Trip", price: "$750", pdf: "Uploaded" },
    { name: "Cairo", price: "$450", pdf: "Missing" },
  ];

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="brand-icon">✈</div>
          <div>
            <h2>Egypt Holiday</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav>
          <a className="active" onClick={() => navigate("/admin")}>Dashboard</a>
          <a onClick={() => navigate("/admin/packages")}>Packages</a>
          <a onClick={() => navigate("/admin/reservations")}>Reservations</a>
          <a onClick={() => navigate("/admin/clients")}>Clients</a>
          <a onClick={() => navigate("/admin/payments")}>Payments</a>
          <a onClick={() => navigate("/admin/messages")}>Messages</a>
          <a onClick={() => navigate("/admin/settings")}>Settings</a>
        </nav>

        <button className="admin-logout" onClick={() => navigate("/login")}>
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-top">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage packages, reservations, clients and agency content.</p>
          </div>

          <div className="admin-actions">
            <button className="outline-btn">Export Report</button>
            <button onClick={() => navigate("/admin/packages")}>
              Add Package
            </button>
          </div>
        </header>

        <section className="admin-stats">
          {stats.map((item, index) => (
            <div className="admin-stat-card" key={index}>
              <div>
                <p>{item.title}</p>
                <h3>{item.value}</h3>
              </div>
              <span>{item.icon}</span>
            </div>
          ))}
        </section>

        <section className="admin-content">
          <div className="admin-panel big">
            <div className="panel-head">
              <h2>Recent Reservations</h2>
              <button onClick={() => navigate("/admin/reservations")}>
                View All
              </button>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Package</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.trip}</td>
                      <td>{item.date}</td>
                      <td>
                        <span className={`status ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-panel">
            <h2>Quick Actions</h2>
            <button>Edit Home Page</button>
            <button onClick={() => navigate("/admin/packages")}>
              Upload Package PDF
            </button>
            <button onClick={() => navigate("/admin/packages")}>
              Manage Packages
            </button>
            <button onClick={() => navigate("/admin/messages")}>
              Check Messages
            </button>
          </div>

          <div className="admin-panel">
            <h2>Packages Status</h2>

            {packages.map((item, index) => (
              <div className="package-row" key={index}>
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.price}</p>
                </div>
                <span className={item.pdf === "Uploaded" ? "pdf-ok" : "pdf-missing"}>
                  {item.pdf}
                </span>
              </div>
            ))}
          </div>

          <div className="admin-panel">
            <h2>Notifications</h2>
            <div className="notify-item">🔔 New reservation request received</div>
            <div className="notify-item">📄 Cairo package PDF is missing</div>
            <div className="notify-item">💬 3 new customer messages</div>
          </div>
        </section>
      </main>
    </div>
  );
}