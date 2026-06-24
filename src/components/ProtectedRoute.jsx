import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import API from "../api";
import Navbar from "./navbar";
import { clearStoredAuth } from "../utils/authStorage";

let verifiedSessionUser = null;

const saveStoredUser = (user) => {
  if (!user) return;

  if (localStorage.getItem("user")) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  window.dispatchEvent(new Event("authChanged"));
};

function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const [status, setStatus] = useState(
    verifiedSessionUser ? "authenticated" : "checking"
  );
  const [user, setUser] = useState(verifiedSessionUser);

  useEffect(() => {
    let isActive = true;

    const verifySession = async () => {
      if (!verifiedSessionUser) {
        setStatus("checking");
      }

      try {
        const res = await API.get("/auth/me", { timeout: 5000 });
        const verifiedUser = res.data?.user;

        if (!isActive) return;

        if (!verifiedUser) {
          verifiedSessionUser = null;
          clearStoredAuth();
          setUser(null);
          setStatus("guest");
          return;
        }

        verifiedSessionUser = verifiedUser;
        setUser(verifiedUser);
        saveStoredUser(verifiedUser);
        setStatus("authenticated");
      } catch {
        if (!isActive) return;

        verifiedSessionUser = null;
        clearStoredAuth();
        setUser(null);
        setStatus("guest");
      }
    };

    const handleUnauthorized = () => {
      verifiedSessionUser = null;
      clearStoredAuth();
      setUser(null);
      setStatus("guest");
    };

    verifySession();
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      isActive = false;
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

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



