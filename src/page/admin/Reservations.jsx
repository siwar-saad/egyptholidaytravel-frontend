import "./AdminPages.css";
import AdminLayout from "./AdminLayout";

export default function Reservations() {
  const data = [
    { name: "Sarah", trip: "Hurghada", status: "Confirmed" },
    { name: "Ahmed", trip: "Turkey", status: "Pending" },
  ];

  return (
    <AdminLayout>
    <div className="admin-page-content">
      <h1>Reservations</h1>

      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Trip</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.name}</td>
              <td>{d.trip}</td>
              <td>
                <span className={d.status === "Confirmed" ? "ok" : "pending"}>
                  {d.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </AdminLayout>
  );
}