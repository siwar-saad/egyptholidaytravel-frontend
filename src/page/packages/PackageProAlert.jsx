import { FaTimes } from "react-icons/fa";

export default function PackageProAlert({ alert, onClose, onLogin, onSignup }) {
  const isLoginAlert = alert.type === "login";

  return (
    <div className="package-pro-alert-overlay">
      <div className={`package-pro-alert ${alert.type}`}>
        <button
          type="button"
          className="package-pro-alert-close"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <div className="package-pro-alert-icon">
          {alert.type === "success" ? "✓" : isLoginAlert ? "🔐" : "!"}
        </div>

        <h3>{alert.title}</h3>
        <p>{alert.message}</p>

        {isLoginAlert ? (
          <div className="package-pro-alert-actions">
            <button
              type="button"
              className="package-pro-alert-btn"
              onClick={onLogin}
            >
              Login
            </button>

            <button
              type="button"
              className="package-pro-alert-secondary"
              onClick={onSignup}
            >
              Create Account
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="package-pro-alert-btn"
            onClick={onClose}
          >
            OK
          </button>
        )}
      </div>
    </div>
  );
}
