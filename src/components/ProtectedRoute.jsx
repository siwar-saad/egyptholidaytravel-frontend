import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import API from "../api";
import Navbar from "./navbar";
import {
  clearStoredAuth,
  getRuntimeAuthUser,
  setRuntimeAuthUser,
} from "../utils/authStorage";

const readStoredUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem("user") ||
        sessionStorage.getItem("user") ||
        "null"
    );
  } catch {
    return null;
  }
};

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
  const initialUser = getRuntimeAuthUser() || readStoredUser();
  const [status, setStatus] = useState(
    initialUser ? "authenticated" : "checking"
  );
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    let isActive = true;

    const verifySession = async () => {
      const runtimeUser = getRuntimeAuthUser();

      if (runtimeUser) {
        setUser(runtimeUser);
        setStatus("authenticated");
        return;
      }

      setStatus("checking");

      try {
        const res = await API.get("/auth/me", { timeout: 5000 });
        const verifiedUser = res.data?.user;

        if (!isActive) return;

        if (!verifiedUser) {
          clearStoredAuth();
          setUser(null);
          setStatus("guest");
          return;
        }

        setRuntimeAuthUser(verifiedUser);
        setUser(verifiedUser);
        saveStoredUser(verifiedUser);
        setStatus("authenticated");
      } catch {
        if (!isActive) return;

        clearStoredAuth();
        setUser(null);
        setStatus("guest");
      }
    };

    const handleUnauthorized = () => {
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






