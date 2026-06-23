import axios from "axios";
import { clearStoredAuth } from "./utils/authStorage";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

export const clearStoredAuth = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("admin");
  localStorage.removeItem("adminToken");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("auth");

  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("admin");
  sessionStorage.removeItem("adminToken");
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("auth");
};

/* REQUEST INTERCEPTOR */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

/* RESPONSE INTERCEPTOR */
API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      clearStoredAuth();

      if (!error.config?.skipAuthRedirect) {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }
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