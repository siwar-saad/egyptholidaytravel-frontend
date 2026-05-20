import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api";

function clearAuthStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("rememberMe");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
}

function saveVerifiedUser(user) {
  const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
  storage.setItem("user", JSON.stringify(user));
}

function ProtectedRoute({ children, requiredRole }) {
  const [status, setStatus] = useState("checking");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      clearAuthStorage();
      setStatus("guest");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await API.get("/auth/me");
        const verifiedUser = res.data?.user;

        if (!verifiedUser) {
          clearAuthStorage();
          setStatus("guest");
          return;
        }

        saveVerifiedUser(verifiedUser);
        setUser(verifiedUser);
        setStatus("authenticated");
      } catch {
        clearAuthStorage();
        setStatus("guest");
      }
    };

    verifyToken();
  }, []);

  if (status === "checking") {
    return null;
  }

  if (status === "guest") {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
