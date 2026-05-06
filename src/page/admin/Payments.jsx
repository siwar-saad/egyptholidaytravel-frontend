import "./AdminPages.css";
import AdminLayout from "./AdminLayout";

export default function Payments() {
  return (
    <AdminLayout>
    <div className="admin-page-content">
      <h1>Payments</h1>

      <div className="card">
        <p>Total Revenue</p>
        <h2>$12,500</h2>
      </div>

      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Sarah</td>
            <td>$580</td>
            <td className="ok">Paid</td>
          </tr>
          <tr>
            <td>Ahmed</td>
            <td>$750</td>
            <td className="pending">Pending</td>
          </tr>
        </tbody>
      </table>
    </div>
    </AdminLayout>
  );
}