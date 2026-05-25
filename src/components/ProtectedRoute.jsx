import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import API from "../api";

function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const [status, setStatus] = useState("checking");
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isActive = true;

    const verifyToken = async () => {
      setStatus("checking");

      try {
        const res = await API.get("/auth/me");
        const verifiedUser = res.data?.user;

        if (!isActive) return;

        if (!verifiedUser) {
          setUser(null);
          setStatus("guest");
          return;
        }

        setUser(verifiedUser);
        setStatus("authenticated");
      } catch {
        if (!isActive) return;

        setUser(null);
        setStatus("guest");
      }
    };

    const handleUnauthorized = () => {
      setUser(null);
      setStatus("guest");
    };

    verifyToken();

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      isActive = false;
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [location.pathname]);

  if (status === "checking") {
    return null;
  }

  if (status === "guest") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
