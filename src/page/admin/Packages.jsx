/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import API from "../../api";

export default function Packages({ showSuccess }) {
  const defaultCover =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

  const [packages, setPackages] = useState([]);
  const [packageSearch, setPackageSearch] = useState("");
  const [showPackageForm, setShowPackageForm] = useState(false);

  const [newPackage, setNewPackage] = useState({
    name: "",
    programme: "",
    price: "",
    visibility: "Private",
    image: "",
  });

  const notify = (message) => {
    if (typeof showSuccess === "function") {
      showSuccess(message);
    }
  };

  const getPackageId = (item) => item.id || item._id;

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await API.get("/admin/packages");
        setPackages(res.data || []);
      } catch (err) {
        console.log("Packages error:", err.response?.data || err.message);
      }
    };

    fetchPackages();
  }, []);

  const filteredPackages = packages.filter((item) =>
    `${item.name || ""} ${item.title || ""} ${item.programme || ""} ${
      item.price || ""
    } ${item.visibility || ""}`
      .toLowerCase()
      .includes(packageSearch.toLowerCase())
  );

  const handlePackageImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setNewPackage((prevPackage) => ({
        ...prevPackage,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removePackageImage = () => {
    setNewPackage((prevPackage) => ({
      ...prevPackage,
      image: "",
    }));
  };

  const addPackage = async () => {
    const name = newPackage.name.trim();
    const programme = newPackage.programme.trim();
    const price = newPackage.price.trim();

    if (!name || !programme || !price) {
      notify("Please fill all package fields.");
      return;
    }

    const packageData = {
      ...newPackage,
      name,
      programme,
      price,
    };

    try {
      const res = await API.post("/admin/packages", packageData);

      setPackages((prevPackages) => [res.data, ...prevPackages]);

      setNewPackage({
        name: "",
        programme: "",
        price: "",
        visibility: "Private",
        image: "",
      });

      setShowPackageForm(false);
      notify("Package added successfully.");
    } catch (err) {
      console.log("Add package error:", err.response?.data || err.message);
      notify("Failed to add package.");
    }
  };

  const updatePackageVisibility = async (id, visibility) => {
    if (!id) {
      notify("Package id not found.");
      return;
    }

    try {
      await API.put(`/admin/packages/${id}/visibility`, {
        visibility,
      });

      setPackages((prevPackages) =>
        prevPackages.map((item) =>
          getPackageId(item) === id ? { ...item, visibility } : item
        )
      );

      notify("Package visibility updated.");
    } catch (err) {
      console.log("Visibility error:", err.response?.data || err.message);
      notify("Failed to update package visibility.");
    }
  };

  const deletePackage = async (id) => {
    if (!id) {
      notify("Package id not found.");
      return;
    }

    try {
      await API.delete(`/admin/packages/${id}`);

      setPackages((prevPackages) =>
        prevPackages.filter((item) => getPackageId(item) !== id)
      );

      notify("Package deleted successfully.");
    } catch (err) {
      console.log("Delete package error:", err.response?.data || err.message);
      notify("Failed to delete package.");
    }
  };

  return (
    <>
      <section className="admin-panel">
        <div className="panel-head">
          <div>
            <h2>Packages</h2>
            <p>Manage your travel packages and programmes.</p>
          </div>

          <button
            type="button"
            className="add-package-btn-pro"
            onClick={() => setShowPackageForm(true)}
          >
            <FaPlus /> Add New Package
          </button>
        </div>

        <div className="client-tools">
          <input
            type="text"
            placeholder="Search packages by name, programme or price..."
            value={packageSearch}
            onChange={(e) => setPackageSearch(e.target.value)}
          />
        </div>

        {filteredPackages.length === 0 ? (
          <p className="empty-msg">No packages found.</p>
        ) : (
          <div className="packages-admin-grid">
            {filteredPackages.map((item, index) => {
              const packageId = getPackageId(item);

              return (
                <div className="package-admin-card" key={packageId || index}>
                  <img
                    src={
                      item.image ||
                      item.image_url ||
                      item.cover ||
                      defaultCover
                    }
                    alt={item.name || "Package"}
                    className="package-admin-image"
                    onError={(e) => {
                      e.currentTarget.src = defaultCover;
                    }}
                  />

                  <div className="package-admin-content">
                    <h3>{item.name || item.title || "Untitled Package"}</h3>

                    <p>
                      {item.programme ||
                        "No programme added for this package yet."}
                    </p>

                    <div className="package-admin-meta">
                      <span>{item.price || "No price"}</span>
                      <span>{item.visibility || "Private"}</span>
                    </div>
                  </div>

                  <div className="package-admin-actions">
                    <select
                      className={`package-select ${
                        item.visibility === "Published"
                          ? "uploaded"
                          : "missing"
                      }`}
                      value={item.visibility || "Private"}
                      onChange={(e) => {
                        if (e.target.value === "Delete") {
                          deletePackage(packageId);
                        } else {
                          updatePackageVisibility(packageId, e.target.value);
                        }
                      }}
                    >
                      <option value="Published">Published</option>
                      <option value="Private">Private</option>
                      <option value="Delete">Delete</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {showPackageForm && (
        <div className="package-popup-overlay">
          <div className="package-popup">
            <div className="package-popup-head">
              <div>
                <h2>Add New Package</h2>
                <p>Create a complete travel package.</p>
              </div>

              <button
                type="button"
                className="close-package-popup"
                onClick={() => setShowPackageForm(false)}
              >
                ×
              </button>
            </div>

            <div className="package-popup-form">
              <input
                type="text"
                placeholder="Package Name"
                value={newPackage.name}
                onChange={(e) =>
                  setNewPackage({
                    ...newPackage,
                    name: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Full Programme"
                value={newPackage.programme}
                onChange={(e) =>
                  setNewPackage({
                    ...newPackage,
                    programme: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Price"
                value={newPackage.price}
                onChange={(e) =>
                  setNewPackage({
                    ...newPackage,
                    price: e.target.value,
                  })
                }
              />

              <input
                type="file"
                accept="image/*"
                onChange={handlePackageImage}
              />

              {newPackage.image && (
                <div className="hotel-preview-grid">
                  <div className="hotel-preview-item">
                    <img src={newPackage.image} alt="preview" />

                    <button type="button" onClick={removePackageImage}>
                      ×
                    </button>
                  </div>
                </div>
              )}

              <select
                value={newPackage.visibility}
                onChange={(e) =>
                  setNewPackage({
                    ...newPackage,
                    visibility: e.target.value,
                  })
                }
              >
                <option value="Published">Published</option>
                <option value="Private">Private</option>
              </select>

              <div className="package-popup-actions">
                <button type="button" onClick={addPackage}>
                  Save Package
                </button>

                <button
                  type="button"
                  className="cancel-package-btn"
                  onClick={() => setShowPackageForm(false)}
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