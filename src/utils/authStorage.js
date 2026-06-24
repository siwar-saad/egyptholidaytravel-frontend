let runtimeAuthUser = null;

export const setRuntimeAuthUser = (user) => {
  runtimeAuthUser = user || null;
};

export const getRuntimeAuthUser = () => runtimeAuthUser;

/* ================= AUTH STORAGE ================= */
export const clearStoredAuth = () => {
  const hadStoredAuth = Boolean(
    runtimeAuthUser ||
      localStorage.getItem("user") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("user") ||
      sessionStorage.getItem("token")
  );

  runtimeAuthUser = null;
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");

  if (hadStoredAuth) {
    window.dispatchEvent(new Event("authChanged"));
  }
};
