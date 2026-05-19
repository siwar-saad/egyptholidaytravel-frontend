import { useEffect, useState } from "react";
import API from "../../api";

export default function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await API.get("/admin/payments");
        setPayments(res.data || []);
      } catch (err) {
        console.log("Payments error:", err.response?.data || err.message);
      }
    };

    fetchPayments();
  }, []);

  return (
    <section className="admin-panel">
      <h2>Payments</h2>

      {payments.length === 0 ? (
        <p className="empty-msg">No payments yet.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.invoice}</td>
                  <td>{payment.client}</td>
                  <td>{payment.amount}</td>

                  <td>
                    <span className={payment.status === "Paid" ? "paid" : "unpaid"}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
