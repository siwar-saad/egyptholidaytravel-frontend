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
    if (error.response?.status === 401) {
      clearStoredAuth();

      if (!error.config?.skipAuthRedirect) {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }
    }

    return Promise.reject(error);
  }
);

export default API;
