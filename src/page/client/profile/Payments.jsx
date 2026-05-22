import { FaCreditCard, FaClock, FaShieldAlt } from "react-icons/fa";

export default function Payments() {
  return (
    <section className="page-section payments-coming-section">
      <div className="payments-coming-card">
        <div className="payments-icon-wrap">
          <FaCreditCard />
        </div>

        <span className="payments-badge">
          <FaClock />
          Coming Soon
        </span>

        <h2>Payment</h2>

        <p>
          Online payment will be available soon. You will be able to view your
          invoices, payment status, and secure transactions directly from your
          account.
        </p>

        <div className="payments-features">
          <div>
            <FaShieldAlt />
            <span>Secure Payment</span>
          </div>

          <div>
            <FaCreditCard />
            <span>Invoices Tracking</span>
          </div>
        </div>
      </div>
    </section>
  );
}