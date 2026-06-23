/* ================= DEBUG LOG ================= */
export const debugLog = (...args) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};
