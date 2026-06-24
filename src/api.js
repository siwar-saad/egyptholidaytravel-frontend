import axios from "axios";
import { clearStoredAuth } from "./utils/authStorage";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

/* RESPONSE INTERCEPTOR */
API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.skipAuthRedirect
    ) {
      clearStoredAuth();
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    return Promise.reject(error);
  }
);

export const logoutClient = async () => {
  try {
    await API.post("/auth/logout", {}, { skipAuthRedirect: true });
  } catch (err) {
    console.log("Logout API error:", err.response?.data || err.message);
  } finally {
    clearStoredAuth();

    delete API.defaults.headers.common.Authorization;
    delete API.defaults.headers.common.authorization;

    window.dispatchEvent(new Event("authChanged"));
    window.location.replace("/login");
  }
};

export default API;


