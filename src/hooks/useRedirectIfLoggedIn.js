import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api";
import { setRuntimeAuthUser } from "../utils/authStorage";

/* ================= AUTH REDIRECT ================= */
export default function useRedirectIfLoggedIn() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const redirectIfLoggedIn = async () => {
      try {
        const res = await API.get("/auth/me", {
          skipAuthRedirect: true,
          timeout: 5000,
          signal: controller.signal,
        });

        const user = res.data?.user;

        if (user) {
          const storage = localStorage.getItem("user")
            ? localStorage
            : sessionStorage;

          storage.setItem("user", JSON.stringify(user));
          setRuntimeAuthUser(user);
          window.dispatchEvent(new Event("authChanged"));

          navigate(user.role === "admin" ? "/admin" : "/profile", {
            replace: true,
          });
        }
      } catch (error) {
        if (error.code !== "ERR_CANCELED" && error.name !== "CanceledError") {
          // A guest can stay on the login page without changing auth state.
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
      controller.abort();
    };
  }, [navigate]);

  return checkingAuth;
}






