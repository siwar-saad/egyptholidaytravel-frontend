import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import API from "../../api";

export default function Clients({ showSuccess }) {
  const [clients, setClients] = useState([]);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const notify = (message) => {
    if (typeof showSuccess === "function") {
      showSuccess(message);
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await API.get("/admin/clients");
        setClients(res.data || []);
      } catch (err) {
        console.log("Clients error:", err.response?.data || err.message);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    `${client.name || ""} ${client.email || ""} ${client.phone || ""}`
      .toLowerCase()
      .includes(clientSearch.toLowerCase())
  );

  const openAddClient = () => {
    setEditingClient(null);
    setClientForm({
      name: "",
      email: "",
      phone: "",
    });
    setShowClientForm(true);
  };

  const openEditClient = (client) => {
    setEditingClient(client);
    setClientForm({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
    });
    setShowClientForm(true);
  };

  const saveClient = () => {
    const name = clientForm.name.trim();
    const email = clientForm.email.trim();
    const phone = clientForm.phone.trim();

    if (!name || !email) {
      notify("Please fill client name and email.");
      return;
    }

    if (editingClient) {
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === editingClient.id
            ? {
                ...client,
                name,
                email,
                phone,
              }
            : client
        )
      );

      notify("Client updated successfully.");
    } else {
      const newClient = {
        id: Date.now(),
        name,
        email,
        phone,
      };

      setClients((prevClients) => [newClient, ...prevClients]);
      notify("Client added successfully.");
    }

    setShowClientForm(false);
    setEditingClient(null);

    setClientForm({
      name: "",
      email: "",
      phone: "",
    });
  };

  const deleteClient = (id) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== id)
    );

    notify("Client deleted successfully.");
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
            {filteredClients.map((client) => (
              <div className="client-card" key={client.id || client.email}>
                <div>
                  <h3>{client.name}</h3>
                  <p>{client.email}</p>
                  <span>{client.phone || "No phone"}</span>
                </div>

                <div className="client-actions">
                  <button type="button" onClick={() => openEditClient(client)}>
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-client-btn"
                    onClick={() => deleteClient(client.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showClientForm && (
        <div className="package-popup-overlay">
          <div className="package-popup">
            <div className="package-popup-head">
              <div>
                <h2>{editingClient ? "Edit Client" : "Add New Client"}</h2>
                <p>Manage client information professionally.</p>
              </div>

              <button
                type="button"
                className="close-package-popup"
                onClick={() => setShowClientForm(false)}
              >
                ×
              </button>
            </div>

            <div className="package-popup-form">
              <input
                type="text"
                placeholder="Client Name"
                value={clientForm.name}
                onChange={(e) =>
                  setClientForm({ ...clientForm, name: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Client Email"
                value={clientForm.email}
                onChange={(e) =>
                  setClientForm({ ...clientForm, email: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Client Phone"
                value={clientForm.phone}
                onChange={(e) =>
                  setClientForm({ ...clientForm, phone: e.target.value })
                }
              />

              <div className="package-popup-actions">
                <button type="button" onClick={saveClient}>
                  {editingClient ? "Save Changes" : "Add Client"}
                </button>

                <button
                  type="button"
                  className="cancel-package-btn"
                  onClick={() => setShowClientForm(false)}
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