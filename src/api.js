import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

const clearStoredAuth = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
};

/* RESPONSE INTERCEPTOR */
API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      clearStoredAuth();

      if (!error.config?.skipAuthRedirect) {
        window.dispatchEvent(new Event("authChanged"));
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }
    }

    return Promise.reject(error);
  }
);

export default API;
