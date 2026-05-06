import "./AdminPages.css";
import AdminLayout from "./AdminLayout";

export default function Clients() {
  const clients = [
    { name: "Siwar", email: "siwar@email.com" },
    { name: "Ahmed", email: "ahmed@email.com" },
  ];

  return (
    <AdminLayout>
      <div className="admin-page-content">
        <h1>Clients</h1>

      <div className="card-list">
        {clients.map((c, i) => (
          <div className="card" key={i}>
            <h3>{c.name}</h3>
            <p>{c.email}</p>
            <button>View Profile</button>
          </div>
        ))}
      </div>
    </div>
    </AdminLayout>
  );
}