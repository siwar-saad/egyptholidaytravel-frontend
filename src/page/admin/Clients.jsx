import { useEffect, useState } from "react";
import { FaChevronDown, FaPlus } from "react-icons/fa";
import API from "../../api";

const COUNTRIES = [
  {
    flag: "https://flagcdn.com/fr.svg",
    name: "Paris / France",
    dialCode: "+33",
  },
  {
    flag: "https://flagcdn.com/de.svg",
    name: "Germany",
    dialCode: "+49",
  },
  {
    flag: "https://flagcdn.com/lu.svg",
    name: "Luxembourg",
    dialCode: "+352",
  },
  {
    flag: "https://flagcdn.com/tr.svg",
    name: "Turkey",
    dialCode: "+90",
  },
  {
    flag: "https://flagcdn.com/tn.svg",
    name: "Tunisia",
    dialCode: "+216",
  },
  {
    flag: "https://flagcdn.com/ma.svg",
    name: "Morocco",
    dialCode: "+212",
  },
  {
    flag: "https://flagcdn.com/ba.svg",
    name: "Bosnia",
    dialCode: "+387",
  },
];

const EMPTY_CLIENT_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

export default function Clients({ showSuccess }) {
  const [clients, setClients] = useState([]);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [clientForm, setClientForm] = useState(EMPTY_CLIENT_FORM);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [openCountry, setOpenCountry] = useState(false);
  const [loading, setLoading] = useState(false);

  const notify = (message) => {
    if (typeof showSuccess === "function") {
      showSuccess(message);
    } else {
      alert(message);
    }
  };

  const getClientId = (client) => {
    return client?._id || client?.id;
  };

  const getClientName = (client) => {
    if (!client) return "";

    if (client.name) return client.name;

    const firstName = client.firstName || client.first_name || "";
    const lastName = client.lastName || client.last_name || "";

    return `${firstName} ${lastName}`.trim();
  };

  const getClientsArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.clients)) return data.clients;
    if (Array.isArray(data?.users)) return data.users;
    if (Array.isArray(data?.data)) return data.data;

    return [];
  };

  const getClientFromResponse = (data, fallback) => {
    if (data?.client) return data.client;
    if (data?.user) return data.user;
    if (data?.data) return data.data;

    return fallback;
  };

  const splitName = (name = "") => {
    const parts = name.trim().split(" ");

    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
    };
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

  const fetchClients = async () => {
    try {
      const res = await API.get("/admin/clients");
      setClients(getClientsArray(res.data));
    } catch (err) {
      console.log("Clients error:", err.response?.data || err.message);
      setClients([]);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const text = `${getClientName(client)} ${client?.email || ""} ${
      client?.phone || ""
    }`;

    return text.toLowerCase().includes(clientSearch.toLowerCase());
  });

  const openAddClient = () => {
    setEditingClient(null);
    setClientForm(EMPTY_CLIENT_FORM);
    setSelectedCountry(COUNTRIES[0]);
    setOpenCountry(false);
    setShowClientForm(true);
  };

  const openEditClient = (client) => {
    const clientName = getClientName(client);
    const { firstName, lastName } = splitName(clientName);
    const phoneData = splitPhone(client?.phone || "");

    setEditingClient(client);

    setClientForm({
      firstName: client?.firstName || client?.first_name || firstName,
      lastName: client?.lastName || client?.last_name || lastName,
      email: client?.email || "",
      phone: phoneData.phone,
    });

    setSelectedCountry(phoneData.country);
    setOpenCountry(false);
    setShowClientForm(true);
  };

  const closeClientPopup = () => {
    setShowClientForm(false);
    setEditingClient(null);
    setClientForm(EMPTY_CLIENT_FORM);
    setSelectedCountry(COUNTRIES[0]);
    setOpenCountry(false);
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setClientForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const chooseCountry = (country) => {
    setSelectedCountry(country);
    setOpenCountry(false);
  };

  const saveClient = async () => {
    const firstName = clientForm.firstName.trim();
    const lastName = clientForm.lastName.trim();
    const email = clientForm.email.trim();
    const phone = clientForm.phone.trim();

    if (!firstName || !lastName || !email || !phone) {
      notify("Please fill first name, last name, email and phone.");
      return;
    }


    const fullPhone = `${selectedCountry.dialCode} ${phone}`;

    const clientData = {
      first_name: firstName,
      last_name: lastName,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      phone: fullPhone,
      role: "user",
    };


    try {
      setLoading(true);

      if (editingClient) {
        const clientId = getClientId(editingClient);

        if (!clientId) {
          notify("Client id not found.");
          setLoading(false);
          return;
        }

        const res = await API.put(`/admin/clients/${clientId}`, clientData);

        const updatedClient = getClientFromResponse(res.data, {
          ...editingClient,
          ...clientData,
        });

        setClients((prev) =>
          prev.map((client) =>
            getClientId(client) === clientId ? updatedClient : client
          )
        );

        notify("Client updated successfully.");
      } else {
        const res = await API.post("/admin/clients", clientData);

        const newClient = getClientFromResponse(res.data, {
          id: Date.now(),
          ...clientData,
        });

        setClients((prev) => [newClient, ...prev]);

        notify("Client added successfully.");
      }

      closeClientPopup();
      fetchClients();
    } catch (err) {
      console.log("Save client error:", err.response?.data || err.message);

      notify(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Unable to save client."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id) => {
    if (!id) {
      notify("Client id not found.");
      return;
    }

    try {
      await API.delete(`/admin/clients/${id}`);

      setClients((prev) => prev.filter((client) => getClientId(client) !== id));

      notify("Client deleted successfully.");
    } catch (err) {
      console.log("Delete client error:", err.response?.data || err.message);

      notify(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Unable to delete client."
      );
    }
  };

  return (
    <>
      <section className="admin-panel">
        <div className="panel-head">
          <div>
            <h2>Clients</h2>
            <p>Manage your agency clients.</p>
          </div>

          <button type="button" onClick={openAddClient}>
            <FaPlus /> Add Client
          </button>
        </div>

        <div className="client-tools">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
          />
        </div>

        {filteredClients.length === 0 ? (
          <p className="empty-msg">No clients found.</p>
        ) : (
          <div className="clients-grid">
            {filteredClients.map((client, index) => {
              const clientId = getClientId(client);

              return (
                <div className="client-card" key={clientId || index}>
                  <div>
                    <h3>{getClientName(client) || "Client"}</h3>
                    <p>{client?.email || "No email"}</p>
                    <span>{client?.phone || "No phone"}</span>
                  </div>

                  <div className="client-actions">
                    <button type="button" onClick={() => openEditClient(client)}>
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-client-btn"
                      onClick={() => deleteClient(clientId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {showClientForm && (
        <div className="package-popup-overlay">
          <div className="package-popup client-signup-popup">
            <div className="package-popup-head">
              <div>
                <h2>{editingClient ? "Edit Client" : "Add New Client"}</h2>
                <p>Add the same information used in the signup form.</p>
              </div>

              <button
                type="button"
                className="close-package-popup"
                onClick={closeClientPopup}
              >
                ×
              </button>
            </div>

            <div className="package-popup-form client-signup-form">
              <div className="client-signup-row">
                <input
                  type="text"
                  placeholder="First Name"
                  value={clientForm.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Last Name"
                  value={clientForm.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                />
              </div>

              <input
                type="email"
                placeholder="Email"
                value={clientForm.email}
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
                    value={clientForm.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="package-popup-actions">
                <button type="button" onClick={saveClient} disabled={loading}>
                  {loading
                    ? "Saving..."
                    : editingClient
                    ? "Save Changes"
                    : "Add Client"}
                </button>

                <button
                  type="button"
                  className="cancel-package-btn"
                  onClick={closeClientPopup}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
