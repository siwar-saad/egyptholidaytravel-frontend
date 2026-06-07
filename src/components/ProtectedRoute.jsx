import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import API from "../api";
import Navbar from "./navbar";

const safeParse = (value) => {
  try {
    return JSON.parse(value || "null");
  } catch {
    return null;
  }
};

const getStoredUser = () =>
  safeParse(localStorage.getItem("user") || sessionStorage.getItem("user"));

const saveStoredUser = (user) => {
  if (!user) return;

  if (localStorage.getItem("user")) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  window.dispatchEvent(new Event("authChanged"));
};

const clearStoredAuth = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
  window.dispatchEvent(new Event("authChanged"));
};

function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const initialUser = getStoredUser();
  const [status, setStatus] = useState(
    initialUser ? "authenticated" : "checking"
  );
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    let isActive = true;

    const verifyToken = async () => {
      const storedUser = getStoredUser();

      if (storedUser) {
        setUser(storedUser);
        setStatus("authenticated");
      } else {
        setStatus("checking");
      }

      try {
        const res = await API.get("/auth/me", { timeout: 5000 });
        const verifiedUser = res.data?.user;

        if (!isActive) return;

        if (!verifiedUser) {
          setUser(null);
          setStatus("guest");
          return;
        }

        setUser(verifiedUser);
        saveStoredUser(verifiedUser);
        setStatus("authenticated");
      } catch (error) {
        if (!isActive) return;

        if (storedUser && (!error.response || error.response.status >= 500)) {
          setUser(storedUser);
          setStatus("authenticated");
          return;
        }

        clearStoredAuth();
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
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: "calc(100vh - 88px)",
            display: "grid",
            placeItems: "center",
            padding: 32,
            background: "#fbf7f1",
          }}
        >
          <div
            style={{
              minWidth: 260,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "18px 22px",
              border: "1px solid rgba(160, 89, 32, 0.16)",
              borderRadius: 8,
              background: "#fff",
              boxShadow: "0 18px 45px rgba(82, 47, 22, 0.08)",
              color: "#5f3418",
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#9b531f",
                display: "inline-block",
              }}
            ></span>
            <p>Checking your session...</p>
          </div>
        </div>
      </>
    );
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
