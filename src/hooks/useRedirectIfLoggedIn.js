import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api";

/* ================= AUTH REDIRECT ================= */
export default function useRedirectIfLoggedIn() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    const redirectIfLoggedIn = async () => {
      try {
        const storedUser = JSON.parse(
          localStorage.getItem("user") ||
            sessionStorage.getItem("user") ||
            "null"
        );

        if (storedUser) {
          navigate(storedUser.role === "admin" ? "/admin" : "/profile", {
            replace: true,
          });
          return;
        }

        const res = await API.get("/auth/me", {
          skipAuthRedirect: true,
        });

        const user = res.data?.user || res.data;

        if (user) {
          navigate(user.role === "admin" ? "/admin" : "/profile", {
            replace: true,
          });
        }
      } catch {
        // User is not logged in.
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
