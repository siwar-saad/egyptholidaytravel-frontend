import { useEffect, useState } from "react";
import API from "../../api";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  const stats = [
    { title: "Packages", value: dashboard?.packages ?? 0, icon: "📦" },
    { title: "Reservations", value: dashboard?.reservations ?? 0, icon: "🧾" },
    { title: "Clients", value: dashboard?.clients ?? 0, icon: "👥" },
    { title: "Messages", value: dashboard?.messages ?? 0, icon: "💬" },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
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

    fetchDashboard();
  }, []);

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
          <div key={item.title} className="dashboard-card">
            <span className="dashboard-icon">{item.icon}</span>

            <div>
              <h3>{item.value}</h3>
              <p>{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
