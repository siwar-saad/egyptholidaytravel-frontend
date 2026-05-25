import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

/* RESPONSE INTERCEPTOR */
API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    return Promise.reject(error);
  }
);

export default API;
