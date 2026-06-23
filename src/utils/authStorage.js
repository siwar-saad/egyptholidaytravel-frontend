/* ================= AUTH STORAGE ================= */
export const clearStoredAuth = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
  window.dispatchEvent(new Event("authChanged"));
};
