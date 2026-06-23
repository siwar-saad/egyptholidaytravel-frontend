import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api";
import { clearStoredAuth } from "../utils/authStorage";

/* ================= AUTH REDIRECT ================= */
export default function useRedirectIfLoggedIn() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    const redirectIfLoggedIn = async () => {
      try {
        const res = await API.get("/auth/me", {
          skipAuthRedirect: true,
        });

        const user = res.data?.user;

        if (user) {
          const storage = localStorage.getItem("user")
            ? localStorage
            : sessionStorage;

          storage.setItem("user", JSON.stringify(user));
          window.dispatchEvent(new Event("authChanged"));

          navigate(user.role === "admin" ? "/admin" : "/profile", {
            replace: true,
          });
        }
      } catch (error) {
        if (error.response?.status === 401) {
          clearStoredAuth();
        }
      } finally {
        if (mounted) {
          setCheckingAuth(false);
        }
      }
    };

    redirectIfLoggedIn();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return checkingAuth;
}
