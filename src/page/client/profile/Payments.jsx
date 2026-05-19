export default function Payments({ payments }) {
  return (
    <section className="page-section">
      <h2>Payment</h2>

      <div className="booking-list">
        {payments.length === 0 ? (
          <p className="empty-msg">No payments yet.</p>
        ) : (
          payments.map((payment, index) => (
            <div className="payment-card-pro" key={payment.id || payment._id || index}>
              <span>{payment.invoice || `Invoice #${payment.id || index + 1}`}</span>

              <span className={payment.status === "Paid" ? "paid" : "unpaid"}>
                {payment.status || "Not Paid"}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
