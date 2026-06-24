import { useEffect, useMemo, useState } from "react";
import {
  FaChevronDown,
  FaPlus,
  FaUserShield,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";
import API from "../../api";

const COUNTRIES = [
  { flag: "https://flagcdn.com/fr.svg", name: "France", dialCode: "+33" },
  { flag: "https://flagcdn.com/de.svg", name: "Germany", dialCode: "+49" },
  { flag: "https://flagcdn.com/lu.svg", name: "Luxembourg", dialCode: "+352" },
  { flag: "https://flagcdn.com/tr.svg", name: "Turkey", dialCode: "+90" },
  { flag: "https://flagcdn.com/tn.svg", name: "Tunisia", dialCode: "+216" },
  { flag: "https://flagcdn.com/ma.svg", name: "Morocco", dialCode: "+212" },
  { flag: "https://flagcdn.com/ba.svg", name: "Bosnia", dialCode: "+387" },
];

const ADMIN_TASKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "View dashboard statistics and overview.",
  },
  {
    key: "packages",
    label: "Packages",
    description: "Add, edit and delete travel packages.",
  },
  {
    key: "hotels",
    label: "Hotels",
    description: "Manage hotels and hotel information.",
  },
  {
    key: "reservations",
    label: "Reservations",
    description: "View and manage client reservations.",
  },
  {
    key: "create_reservation",
    label: "Create Reservation",
    description: "Create reservations for clients.",
  },
  {
    key: "users",
    label: "Users",
    description: "Manage clients and admin accounts.",
  },
  {
    key: "payments",
    label: "Payments",
    description: "View and manage payments.",
  },
  {
    key: "messages",
    label: "Messages",
    description: "Read and reply to client messages.",
  },
  {
    key: "reviews",
    label: "Reviews",
    description: "Approve, hide or delete reviews.",
  },
  {
    key: "settings",
    label: "Settings",
    description: "Access website and account settings.",
  },
];

const DEFAULT_ADMIN_PERMISSIONS = ADMIN_TASKS.map((task) => task.key);

const EMPTY_USER_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "user",
};

const EMPTY_DELETE_CONFIRM = {
  show: false,
  user: null,
  loading: false,
};

const EMPTY_NOTICE = {
  show: false,
  type: "success",
  title: "",
  message: "",
};

const normalizePermissions = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [activeUserTab, setActiveUserTab] = useState("clients");
  const [userSearch, setUserSearch] = useState("");

  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [userForm, setUserForm] = useState(EMPTY_USER_FORM);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [openCountry, setOpenCountry] = useState(false);

  const [adminTypeChoice, setAdminTypeChoice] = useState("general_admin");
  const [adminPermissions, setAdminPermissions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(EMPTY_DELETE_CONFIRM);
  const [notice, setNotice] = useState(EMPTY_NOTICE);

  const storedAdmin = useMemo(() => {
    try {
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  }, []);

  const currentAdmin = useMemo(() => {
    if (!storedAdmin) return null;

    const storedId = storedAdmin.id || storedAdmin._id;
    const storedEmail = storedAdmin.email;

    const adminFromList = users.find((user) => {
      const userId = user.id || user._id;

      return (
        (storedId && String(userId) === String(storedId)) ||
        (storedEmail &&
          user.email &&
          user.email.toLowerCase() === storedEmail.toLowerCase())
      );
    });

    return {
      ...storedAdmin,
      ...(adminFromList || {}),
    };
  }, [storedAdmin, users]);

  const currentAdminPermissions = useMemo(() => {
    return normalizePermissions(
      currentAdmin?.permissions ||
        currentAdmin?.tasks ||
        currentAdmin?.adminPermissions
    );
  }, [currentAdmin]);

  const currentAdminType = String(
    currentAdmin?.admin_type || currentAdmin?.adminType || ""
  ).toLowerCase();

  const isCurrentGeneralAdmin =
    String(currentAdmin?.role || "").toLowerCase() === "admin" &&
    (currentAdminType === "general_admin" ||
      currentAdmin?.email === "admin@gmail.com" ||
      (!currentAdminType && currentAdminPermissions.length === 0) ||
      DEFAULT_ADMIN_PERMISSIONS.every((permission) =>
        currentAdminPermissions.includes(permission)
      ));

  const notify = (message, type = "success") => {
    setNotice({
      show: true,
      type,
      title: type === "success" ? "Success" : "Action Required",
      message,
    });
  };

  const closeNotice = () => {
    setNotice(EMPTY_NOTICE);
  };

  const getUserId = (user) => {
    return user?._id || user?.id;
  };

  const getUserRole = (user) => {
    const role = (user?.role || user?.type || "user").toLowerCase();
    return role === "admin" ? "admin" : "user";
  };

  const getUserPermissions = (user) => {
    const role = (user?.role || user?.type || "user").toLowerCase();

    const adminType = String(
      user?.admin_type || user?.adminType || ""
    ).toLowerCase();

    const permissions = normalizePermissions(
      user?.permissions || user?.tasks || user?.adminPermissions
    );

    if (role === "admin" && user?.email === "admin@gmail.com") {
      return DEFAULT_ADMIN_PERMISSIONS;
    }

    if (role === "admin" && adminType === "general_admin") {
      return DEFAULT_ADMIN_PERMISSIONS;
    }

    if (role === "admin" && !adminType && permissions.length === 0) {
      return DEFAULT_ADMIN_PERMISSIONS;
    }

    return permissions;
  };

  const getTaskLabel = (key) => {
    return ADMIN_TASKS.find((task) => task.key === key)?.label || key;
  };

  const isGeneralAdminByPermissions = (permissions = []) => {
    return DEFAULT_ADMIN_PERMISSIONS.every((permission) =>
      permissions.includes(permission)
    );
  };

  const getAdminTypeLabel = (user) => {
    const role = (user?.role || user?.type || "user").toLowerCase();

    const adminType = String(
      user?.admin_type || user?.adminType || ""
    ).toLowerCase();

    const rawPermissions = normalizePermissions(
      user?.permissions || user?.tasks || user?.adminPermissions
    );

    if (role === "admin" && user?.email === "admin@gmail.com") {
      return "General Admin";
    }

    if (role === "admin" && adminType === "general_admin") {
      return "General Admin";
    }

    if (role === "admin" && adminType === "sub_admin") {
      return "Sub Admin";
    }

    if (role === "admin" && !adminType && rawPermissions.length === 0) {
      return "General Admin";
    }

    return isGeneralAdminByPermissions(rawPermissions)
      ? "General Admin"
      : "Sub Admin";
  };

  const isEmailVerified = (user) => {
    return Boolean(
      user?.emailVerified ||
        user?.email_verified ||
        user?.isEmailVerified ||
        user?.is_email_verified ||
        user?.verified ||
        user?.isVerified ||
        user?.emailVerifiedAt ||
        user?.email_verified_at
    );
  };

  const getUserName = (user) => {
    if (!user) return "";
    if (user.name) return user.name;

    const firstName = user.firstName || user.first_name || "";
    const lastName = user.lastName || user.last_name || "";

    return `${firstName} ${lastName}`.trim();
  };

  const getUsersArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.clients)) return data.clients;
    if (Array.isArray(data?.users)) return data.users;
    if (Array.isArray(data?.data)) return data.data;

    return [];
  };

  const getUserFromResponse = (data, fallback) => {
    if (data?.client) return data.client;
    if (data?.user) return data.user;
    if (data?.data) return data.data;

    return fallback;
  };

  const splitPhone = (phone = "") => {
    const cleanPhone = phone.trim();

    const foundCountry =
      COUNTRIES.find((country) => cleanPhone.startsWith(country.dialCode)) ||
      COUNTRIES[0];

    const phoneNumber = cleanPhone.replace(foundCountry.dialCode, "").trim();

    return {
      country: foundCountry,
      phone: phoneNumber,
    };
  };

  const getCountryFromUser = (user, fallbackCountry) => {
    return (
      COUNTRIES.find(
        (country) =>
          country.name.toLowerCase() ===
          (user?.country || "").trim().toLowerCase()
      ) || fallbackCountry
    );
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/clients");
      setUsers(getUsersArray(res.data));
    } catch (err) {
      console.log("Users error:", err.response?.data || err.message);
      setUsers([]);
      notify("Unable to load users.", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const clients = useMemo(() => {
    return users.filter((user) => getUserRole(user) !== "admin");
  }, [users]);

  const admins = useMemo(() => {
    return users.filter((user) => getUserRole(user) === "admin");
  }, [users]);

  const filteredUsers = useMemo(() => {
    const source = activeUserTab === "admins" ? admins : clients;

    return source.filter((user) => {
      const text = `${getUserName(user)} ${user?.email || ""} ${
        user?.phone || ""
      } ${user?.country || ""}`;

      return text.toLowerCase().includes(userSearch.toLowerCase());
    });
  }, [activeUserTab, admins, clients, userSearch]);

  const openAddUser = (role = "user") => {
    if (role === "admin" && !isCurrentGeneralAdmin) {
      notify("Only a general admin can add another admin.", "error");
      return;
    }

    setEditingUser(null);

    setUserForm({
      ...EMPTY_USER_FORM,
      role,
    });

    setSelectedCountry(COUNTRIES[0]);
    setAdminTypeChoice(role === "admin" ? "general_admin" : "");
    setAdminPermissions(role === "admin" ? DEFAULT_ADMIN_PERMISSIONS : []);
    setOpenCountry(false);
    setShowUserForm(true);
  };

  const openEditUser = (user) => {
    const role = getUserRole(user);

    if (role === "admin" && !isCurrentGeneralAdmin) {
      notify("Only a general admin can edit admin accounts.", "error");
      return;
    }

    const phoneData = splitPhone(user?.phone || "");
    const userCountry = getCountryFromUser(user, phoneData.country);

    const permissions = role === "admin" ? getUserPermissions(user) : [];
    const savedAdminType = String(
      user?.admin_type || user?.adminType || ""
    ).toLowerCase();

    const currentAdminTypeForEdit =
      user?.email === "admin@gmail.com"
        ? "general_admin"
        : savedAdminType === "general_admin"
        ? "general_admin"
        : savedAdminType === "sub_admin"
        ? "sub_admin"
        : permissions.length === 0
        ? "general_admin"
        : isGeneralAdminByPermissions(permissions)
        ? "general_admin"
        : "sub_admin";

    setEditingUser(user);

    setUserForm({
      firstName: user?.firstName || user?.first_name || "",
      lastName: user?.lastName || user?.last_name || "",
      email: user?.email || "",
      phone: phoneData.phone,
      role,
    });

    setSelectedCountry(userCountry);
    setAdminTypeChoice(role === "admin" ? currentAdminTypeForEdit : "");
    setAdminPermissions(
      role === "admin"
        ? currentAdminTypeForEdit === "general_admin"
          ? DEFAULT_ADMIN_PERMISSIONS
          : permissions
        : []
    );
    setOpenCountry(false);
    setShowUserForm(true);
  };

  const closeUserPopup = () => {
    setShowUserForm(false);
    setEditingUser(null);
    setUserForm(EMPTY_USER_FORM);
    setSelectedCountry(COUNTRIES[0]);
    setAdminTypeChoice("general_admin");
    setAdminPermissions([]);
    setOpenCountry(false);
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setUserForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const chooseCountry = (country) => {
    setSelectedCountry(country);
    setOpenCountry(false);
  };

  const handleAdminTypeChange = (value) => {
    setAdminTypeChoice(value);

    if (value === "general_admin") {
      setAdminPermissions(DEFAULT_ADMIN_PERMISSIONS);
    } else {
      setAdminPermissions([]);
    }
  };

  const toggleAdminPermission = (permissionKey) => {
    setAdminPermissions((prev) => {
      if (prev.includes(permissionKey)) {
        return prev.filter((item) => item !== permissionKey);
      }

      return [...prev, permissionKey];
    });
  };

  const selectAllAdminPermissions = () => {
    setAdminPermissions(DEFAULT_ADMIN_PERMISSIONS);
  };

  const clearAdminPermissions = () => {
    setAdminPermissions([]);
  };

  const isGeneralAdminAccount =
    userForm.role === "admin" && adminTypeChoice === "general_admin";

  const saveUser = async () => {
    const firstName = userForm.firstName.trim();
    const lastName = userForm.lastName.trim();
    const email = userForm.email.trim();
    const phone = userForm.phone.trim();
    const role = userForm.role === "admin" ? "admin" : "user";

    if (role === "admin" && !isCurrentGeneralAdmin) {
      notify("Only a general admin can create or edit admin tasks.", "error");
      return;
    }

    const adminType =
      role === "admin" && adminTypeChoice === "general_admin"
        ? "general_admin"
        : "sub_admin";

    const finalAdminPermissions =
      role === "admin"
        ? adminType === "general_admin"
          ? DEFAULT_ADMIN_PERMISSIONS
          : adminPermissions
        : [];

    if (!firstName || !lastName || !email || !phone) {
      notify("Please fill first name, last name, email and phone.", "error");
      return;
    }

    if (
      role === "admin" &&
      adminType === "sub_admin" &&
      finalAdminPermissions.length === 0
    ) {
      notify("Please select at least one admin task for this sub admin.", "error");
      return;
    }

    const fullPhone = `${selectedCountry.dialCode} ${phone}`;

    const userData = {
      first_name: firstName,
      last_name: lastName,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      phone: fullPhone,
      country: selectedCountry.name,
      role,
      admin_type: role === "admin" ? adminType : null,
      adminType: role === "admin" ? adminType : null,
      permissions: finalAdminPermissions,
      tasks: finalAdminPermissions,
    };

    try {
      setLoading(true);

      if (editingUser) {
        const userId = getUserId(editingUser);

        if (!userId) {
          notify("User id not found.", "error");
          setLoading(false);
          return;
        }

        const res = await API.put(`/admin/clients/${userId}`, userData);

        const updatedUser = getUserFromResponse(res.data, {
          ...editingUser,
          ...userData,
        });

        setUsers((prev) =>
          prev.map((user) => (getUserId(user) === userId ? updatedUser : user))
        );

        notify(
          role === "admin"
            ? "Admin updated successfully."
            : "Client updated successfully."
        );
      } else {
        const res = await API.post("/admin/clients", userData);

        const newUser = getUserFromResponse(res.data, {
          id: Date.now(),
          ...userData,
        });

        setUsers((prev) => [newUser, ...prev]);

        notify(
          res.data?.message ||
            (role === "admin"
              ? "Admin added successfully and password email sent."
              : "Client added successfully and password email sent.")
        );
      }

      setActiveUserTab(role === "admin" ? "admins" : "clients");
      closeUserPopup();
      fetchUsers();
    } catch (err) {
      console.log("Save user error:", err.response?.data || err.message);

      notify(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Unable to save user.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirm = (user) => {
    const userId = getUserId(user);
    const role = getUserRole(user);

    if (!userId) {
      notify("User id not found.", "error");
      return;
    }

    if (role === "admin" && !isCurrentGeneralAdmin) {
      notify("Only a general admin can delete admin accounts.", "error");
      return;
    }

    setDeleteConfirm({
      show: true,
      user,
      loading: false,
    });
  };

  const closeDeleteConfirm = () => {
    if (deleteConfirm.loading) return;
    setDeleteConfirm(EMPTY_DELETE_CONFIRM);
  };

  const confirmDeleteUser = async () => {
    const user = deleteConfirm.user;
    const userId = getUserId(user);
    const role = getUserRole(user);

    if (!userId) {
      notify("User id not found.", "error");
      setDeleteConfirm(EMPTY_DELETE_CONFIRM);
      return;
    }

    try {
      setDeleteConfirm((prev) => ({
        ...prev,
        loading: true,
      }));

      await API.delete(`/admin/clients/${userId}`);

      setUsers((prev) => prev.filter((item) => getUserId(item) !== userId));

      setDeleteConfirm(EMPTY_DELETE_CONFIRM);

      notify(
        role === "admin"
          ? "Admin deleted successfully."
          : "Client deleted successfully."
      );
    } catch (err) {
      console.log("Delete user error:", err.response?.data || err.message);

      setDeleteConfirm(EMPTY_DELETE_CONFIRM);

      notify(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Unable to delete user.",
        "error"
      );
    }
  };

  return (
    <>
      <section className="admin-panel">
        <div className="panel-head">
          <div>
            <h2>Users</h2>
            <p>Manage agency clients and admin accounts.</p>
          </div>

          <div className="users-head-actions">
            <button type="button" onClick={() => openAddUser("user")}>
              <FaPlus /> Add Client
            </button>

            {isCurrentGeneralAdmin && (
              <button
                type="button"
                className="add-admin-btn"
                onClick={() => openAddUser("admin")}
              >
                <FaUserShield /> Add Admin
              </button>
            )}
          </div>
        </div>

        <div className="user-tabs">
          <button
            type="button"
            className={activeUserTab === "clients" ? "active" : ""}
            onClick={() => setActiveUserTab("clients")}
          >
            <FaUsers />
            Clients ({clients.length})
          </button>

          <button
            type="button"
            className={activeUserTab === "admins" ? "active" : ""}
            onClick={() => setActiveUserTab("admins")}
          >
            <FaUserShield />
            Admins ({admins.length})
          </button>
        </div>

        <div className="client-tools">
          <input
            type="text"
            placeholder={
              activeUserTab === "admins"
                ? "Search admins by name, email or phone..."
                : "Search clients by name, email or phone..."
            }
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
        </div>

        {filteredUsers.length === 0 ? (
          <p className="empty-msg">
            {activeUserTab === "admins"
              ? "No admins found."
              : "No clients found."}
          </p>
        ) : (
          <div className="clients-grid">
            {filteredUsers.map((user, index) => {
              const role = getUserRole(user);
              const emailVerified = isEmailVerified(user);
              const permissions = getUserPermissions(user);

              return (
                <div className="client-card" key={getUserId(user) || index}>
                  <div>
                    <div className="user-card-title">
                      <h3>{getUserName(user) || "User"}</h3>

                      <span
                        className={
                          role === "admin"
                            ? "user-role-badge admin"
                            : "user-role-badge client"
                        }
                      >
                        {role === "admin" ? "Admin" : "Client"}
                      </span>
                    </div>

                    {role === "admin" && (
                      <span className="admin-type-badge">
                        {getAdminTypeLabel(user)}
                      </span>
                    )}

                    <div className="user-email-line">
                      <p>{user?.email || "No email"}</p>

                      <span
                        className={
                          emailVerified
                            ? "email-status-badge verified"
                            : "email-status-badge not-verified"
                        }
                      >
                        {emailVerified
                          ? "Email verified"
                          : "Email not verified"}
                      </span>
                    </div>

                    <span>{user?.phone || "No phone"}</span>
                    <span>{user?.country || "No country"}</span>

                    {role === "admin" && (
                      <div className="admin-card-permissions">
                        <strong>Tasks:</strong>

                        {permissions.length > 0 ? (
                          <div className="admin-card-permission-list">
                            {permissions.slice(0, 5).map((permission) => (
                              <span key={permission}>
                                {getTaskLabel(permission)}
                              </span>
                            ))}

                            {permissions.length > 5 && (
                              <span>+{permissions.length - 5} more</span>
                            )}
                          </div>
                        ) : (
                          <p>No tasks selected</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="client-actions">
                    {(role !== "admin" || isCurrentGeneralAdmin) && (
                      <button type="button" onClick={() => openEditUser(user)}>
                        Edit
                      </button>
                    )}

                    {(role !== "admin" || isCurrentGeneralAdmin) && (
                      <button
                        type="button"
                        className="delete-client-btn"
                        onClick={() => openDeleteConfirm(user)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {showUserForm && (
        <div className="package-popup-overlay">
          <div className="package-popup client-signup-popup">
            <div className="package-popup-head">
              <div>
                <h2>
                  {editingUser
                    ? userForm.role === "admin"
                      ? "Edit Admin"
                      : "Edit Client"
                    : userForm.role === "admin"
                    ? "Add New Admin"
                    : "Add New Client"}
                </h2>

                <p>
                  {userForm.role === "admin"
                    ? "Create an admin account and choose exactly what this admin can manage."
                    : "Create a client account for your agency customers."}
                </p>
              </div>

              <button
                type="button"
                className="close-package-popup"
                onClick={closeUserPopup}
              >
                x
              </button>
            </div>

            <div className="package-popup-form client-signup-form">
              <div
                className={
                  userForm.role === "admin"
                    ? "selected-user-type-card admin"
                    : "selected-user-type-card client"
                }
              >
                {userForm.role === "admin" ? <FaUserShield /> : <FaUsers />}

                <div className="account-type-content">
                  <span>Account Type</span>

                  {userForm.role === "admin" ? (
                    isCurrentGeneralAdmin ? (
                      <select
                        className="admin-type-select"
                        value={adminTypeChoice}
                        onChange={(e) => handleAdminTypeChange(e.target.value)}
                      >
                        <option value="general_admin">General Admin</option>
                        <option value="sub_admin">Sub Admin</option>
                      </select>
                    ) : (
                      <strong>
                        {adminTypeChoice === "general_admin"
                          ? "General Admin"
                          : "Sub Admin"}
                      </strong>
                    )
                  ) : (
                    <strong>Client Account</strong>
                  )}

                  {userForm.role === "admin" && (
                    <p className="account-type-note">
                      {isGeneralAdminAccount
                        ? "Full access to all admin panel tasks."
                        : "Limited access based on selected tasks."}
                    </p>
                  )}
                </div>
              </div>

              <div className="client-signup-row">
                <input
                  type="text"
                  placeholder="First Name"
                  value={userForm.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Last Name"
                  value={userForm.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                />
              </div>

              <input
                type="email"
                placeholder="Email"
                value={userForm.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />

              <div className="client-phone-field">
                <div
                  className={`admin-country-select ${
                    openCountry ? "active" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="admin-country-btn"
                    onClick={() => setOpenCountry((prev) => !prev)}
                  >
                    <div className="admin-country-left">
                      <img
                        src={selectedCountry.flag}
                        alt={selectedCountry.name}
                      />

                      <div>
                        <small>Country</small>
                        <strong>{selectedCountry.name}</strong>
                      </div>
                    </div>

                    <FaChevronDown />
                  </button>

                  {openCountry && (
                    <div className="admin-country-menu">
                      {COUNTRIES.map((country) => (
                        <button
                          type="button"
                          key={country.dialCode}
                          className={
                            selectedCountry.dialCode === country.dialCode
                              ? "admin-country-option selected"
                              : "admin-country-option"
                          }
                          onClick={() => chooseCountry(country)}
                        >
                          <img src={country.flag} alt={country.name} />
                          <span>{country.name}</span>
                          <strong>{country.dialCode}</strong>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-phone-input">
                  <span>{selectedCountry.dialCode}</span>

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={userForm.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
              </div>

              {userForm.role === "admin" && isCurrentGeneralAdmin && (
                <div className="admin-permissions-box">
                  <div className="admin-permissions-head">
                    <div>
                      <h3>
                        {adminTypeChoice === "general_admin"
                          ? "General Admin Tasks"
                          : "Sub Admin Tasks"}
                      </h3>

                      <p>
                        {adminTypeChoice === "general_admin"
                          ? "This admin has access to all admin panel tasks."
                          : "Select exactly what this sub admin can manage."}
                      </p>
                    </div>

                    {adminTypeChoice === "sub_admin" && (
                      <div className="admin-permissions-actions">
                        <button
                          type="button"
                          onClick={selectAllAdminPermissions}
                        >
                          Select all
                        </button>

                        <button type="button" onClick={clearAdminPermissions}>
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="admin-permissions-grid">
                    {ADMIN_TASKS.map((task) => {
                      const checked =
                        adminTypeChoice === "general_admin"
                          ? true
                          : adminPermissions.includes(task.key);

                      return (
                        <button
                          type="button"
                          key={task.key}
                          className={
                            checked
                              ? "admin-permission-item active"
                              : "admin-permission-item"
                          }
                          onClick={() => {
                            if (adminTypeChoice === "sub_admin") {
                              toggleAdminPermission(task.key);
                            }
                          }}
                        >
                          <span className="admin-permission-check">
                            {checked && <FaCheckCircle />}
                          </span>

                          <div>
                            <strong>{task.label}</strong>
                            <p>{task.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="package-popup-actions">
                <button type="button" onClick={saveUser} disabled={loading}>
                  {loading
                    ? "Saving..."
                    : editingUser
                    ? "Save Changes"
                    : userForm.role === "admin"
                    ? "Add Admin"
                    : "Add Client"}
                </button>

                <button
                  type="button"
                  className="cancel-package-btn"
                  onClick={closeUserPopup}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm.show && (
        <DeleteConfirmPopup
          user={deleteConfirm.user}
          role={getUserRole(deleteConfirm.user)}
          name={getUserName(deleteConfirm.user)}
          loading={deleteConfirm.loading}
          onCancel={closeDeleteConfirm}
          onConfirm={confirmDeleteUser}
        />
      )}

      {notice.show && <UserNoticePopup notice={notice} onClose={closeNotice} />}
    </>
  );
}

function DeleteConfirmPopup({ user, role, name, loading, onCancel, onConfirm }) {
  const isAdmin = role === "admin";

  return (
    <div className="admin-delete-confirm-overlay">
      <div className="admin-delete-confirm-popup">
        <button
          type="button"
          className="admin-delete-confirm-close"
          onClick={onCancel}
          disabled={loading}
        >
          x
        </button>

        <div className={isAdmin ? "delete-icon admin" : "delete-icon client"}>
          !
        </div>

        <h2>{isAdmin ? "Delete Admin" : "Delete Client"}</h2>

        <p>
          Are you sure you want to delete{" "}
          <strong>{name || user?.email || "this user"}</strong>?
        </p>

        <span>
          This action will remove the account from the admin panel. You cannot
          undo this action.
        </span>

        <div className="admin-delete-confirm-actions">
          <button
            type="button"
            className="delete-confirm-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-confirm-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function UserNoticePopup({ notice, onClose }) {
  const isSuccess = notice.type === "success";

  return (
    <div className="user-notice-overlay" onClick={onClose}>
      <div
        className={`user-notice-popup ${notice.type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="user-notice-close" onClick={onClose}>
          x
        </button>

        <div className={`user-notice-icon ${notice.type}`}>
          {isSuccess ? <FaCheckCircle /> : "!"}
        </div>

        <div className="user-notice-content">
          <span>{isSuccess ? "Completed" : "Please Check"}</span>

          <h2>{notice.title}</h2>

          <p>{notice.message}</p>
        </div>

        <button type="button" className="user-notice-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

