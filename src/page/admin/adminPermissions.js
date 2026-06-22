export const ADMIN_PERMISSIONS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "packages", label: "Packages" },
  { key: "hotels", label: "Hotels" },
  { key: "reservations", label: "Reservations" },
  { key: "create_reservation", label: "Create Reservation" },
  { key: "users", label: "Users" },
  { key: "payments", label: "Payments" },
  { key: "messages", label: "Messages" },
  { key: "reviews", label: "Reviews" },
  { key: "settings", label: "Settings" },
];

export function getStoredUser() {
  try {
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function hasPermission(user, permission) {
  if (!user || user.role !== "admin") return false;

  if (user.isSuperAdmin === true) return true;

  if (!Array.isArray(user.permissions)) return true;

  return user.permissions.includes(permission);
}
