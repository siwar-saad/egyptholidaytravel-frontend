import {
  FaCreditCard,
  FaClock,
  FaReceipt,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import "./Payments.css";

export default function Payments() {
  return (
    <div className="payments-page">
      <div className="payments-header">
        <div>
          <span className="payments-label">
            <FaClock />
            Coming Soon
          </span>

          <h1>Payments</h1>

          <p>
            The payments management feature is currently under development.
            It will be available soon.
          </p>
        </div>

        <div className="payments-main-icon">
          <FaCreditCard />
        </div>
      </div>

      <div className="payments-cards">
        <div className="payments-card">
          <FaReceipt />
          <h3>Invoices</h3>
          <p>Manage client invoices easily.</p>
        </div>

        <div className="payments-card">
          <FaCreditCard />
          <h3>Payments</h3>
          <p>Track paid and pending payments.</p>
        </div>

        <div className="payments-card">
          <FaShieldAlt />
          <h3>Secure</h3>
          <p>Keep payment information organized.</p>
        </div>
      </div>

      <div className="payments-info">
        <h2>Next Features</h2>

        <div className="payments-feature">
          <FaCheckCircle />
          <span>View payment status</span>
        </div>

        <div className="payments-feature">
          <FaCheckCircle />
          <span>Generate invoices</span>
        </div>

        <div className="payments-feature">
          <FaCheckCircle />
          <span>Follow reservations payments</span>
        </div>
      </div>
    </div>
  );
}