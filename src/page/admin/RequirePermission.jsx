import { Navigate } from "react-router-dom";
import { getStoredUser, hasPermission } from "./adminPermissions";
import "./Admin.css";

export default function RequirePermission({ permission, children }) {
  const user = getStoredUser();

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(user, permission)) {
    return (
      <div className="admin-access-wrapper">
        <div className="access-denied-card">
          <h2>Access Denied</h2>
          <p>You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
}