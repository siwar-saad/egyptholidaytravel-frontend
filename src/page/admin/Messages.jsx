import "./AdminPages.css";
import AdminLayout from "./AdminLayout";

export default function Messages() {
  return (
    <AdminLayout>
    <div className="admin-page-content">
      <h1>Messages</h1>

      <div className="card">
        <h3>Sarah</h3>
        <p>Hello, I want more info about Hurghada trip.</p>
      </div>

      <div className="card">
        <h3>Ahmed</h3>
        <p>Can I change my reservation date?</p>
      </div>
    </div>
    </AdminLayout>
  );
}