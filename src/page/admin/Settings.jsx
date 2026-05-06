import "./AdminPages.css";
import AdminLayout from "./AdminLayout";

export default function Settings() {
  return (
    <AdminLayout>
      <div className="admin-page-content">
        <h1>Settings</h1>

      <div className="card">
        <input placeholder="Agency Name" />
        <input placeholder="Email" />
        <input placeholder="Phone" />
        <button className="main-btn">Save Changes</button>
      </div>
    </div>
    </AdminLayout>
  );
}