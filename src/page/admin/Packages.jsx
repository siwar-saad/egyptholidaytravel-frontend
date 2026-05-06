import "./AdminPages.css";
import AdminLayout from "./AdminLayout";

export default function Packages() {
  const packages = [
    { name: "Hurghada", price: "$580", pdf: "Uploaded" },
    { name: "Turkey Trip", price: "$750", pdf: "Uploaded" },
    { name: "Cairo", price: "$450", pdf: "Missing" },
  ];

  return (
    <AdminLayout>
      <div className="admin-page-content">
        <h1>Manage Packages</h1>

        <button className="main-btn">+ Add New Package</button>

        <div className="card-list">
          {packages.map((p, i) => (
            <div className="card" key={i}>
              <h3>{p.name}</h3>
              <p>{p.price}</p>

              <span className={p.pdf === "Uploaded" ? "ok" : "bad"}>
                {p.pdf}
              </span>

              <div className="card-actions">
                <button>Edit</button>
                <button className="danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}