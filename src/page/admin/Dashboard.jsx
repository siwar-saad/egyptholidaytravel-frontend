import { useEffect, useState } from "react";
import API from "../../api";

export default function Dashboard({ onOpenTab }) {
  const [dashboard, setDashboard] = useState({
    packages: 0,
    reservations: 0,
    clients: 0,
    messages: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await API.get("/admin/dashboard");

        setDashboard({
          packages: Number(res.data?.packages ?? 0),
          reservations: Number(res.data?.reservations ?? 0),
          clients: Number(res.data?.clients ?? 0),
          messages: Number(res.data?.messages ?? 0),
        });
      } catch (err) {
        console.log("Dashboard error:", err.response?.data || err.message);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Packages",
      value: dashboard.packages,
      icon: "📦",
      tab: "packages",
    },
    {
      title: "Reservations",
      value: dashboard.reservations,
      icon: "🧾",
      tab: "reservations",
    },
    {
      title: "Clients",
      value: dashboard.clients,
      icon: "👥",
      tab: "clients",
    },
    {
      title: "Messages",
      value: dashboard.messages,
      icon: "💬",
      tab: "messages",
    },
  ];

  const handleOpenTab = (tab) => {
    if (typeof onOpenTab === "function") {
      onOpenTab(tab);
    }
  };

  return (
    <section className="admin-panel">
      <div className="panel-head">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of the admin panel.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {stats.map((item) => (
          <button
            type="button"
            key={item.title}
            className="dashboard-card dashboard-card-clickable"
            onClick={() => handleOpenTab(item.tab)}
          >
            <span className="dashboard-icon">{item.icon}</span>

            <div>
              <h3>{item.value}</h3>
              <p>{item.title}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}