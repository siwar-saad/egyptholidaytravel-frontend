import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import API from "../../api";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

const EMPTY_PACKAGE = {
  name: "",
  backendName: "",
  route: "",
  duration: "",
  transfer: "",
  transferReduction: "",
  startPrice: "",
  programme: "",
  price: "",
  visibility: "Private",
  image: "",
  options: "",
  itinerary: "",
  displayOrder: 0,
};

export default function Packages({ showSuccess }) {
  const [packages, setPackages] = useState([]);
  const [packageSearch, setPackageSearch] = useState("");
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState(EMPTY_PACKAGE);
  const [editingPackage, setEditingPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const notify = (message) => {
    if (typeof showSuccess === "function") {
      showSuccess(message);
    } else {
      console.log(message);
    }
  };

  const getPackageId = (item) => item?._id || item?.id;

  const getPackagesArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.packages)) return data.packages;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;

    return [];
  };

  const getPackageFromResponse = (data, fallback) => {
    if (data?.package) return data.package;
    if (data?.data) return data.data;
    if (data?.item) return data.item;

    return data || fallback;
  };

  const getImageUrl = (image) => {
    if (!image) return DEFAULT_COVER;
    if (image.startsWith("http") || image.startsWith("data:")) return image;

    const apiBase = API.defaults.baseURL || "/api";
    const origin = apiBase.replace(/\/api\/?$/, "");

    return `${origin}${image}`;
  };

  const stringifyJson = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return "";
    }
  };

  const parseJson = (value, fieldName) => {
    if (!value?.trim()) return [];

    try {
      const parsed = JSON.parse(value);

      if (!Array.isArray(parsed)) {
        throw new Error(`${fieldName} must be an array`);
      }

      return parsed;
    } catch (error) {
      throw new Error(`${fieldName} must be valid JSON array`);
    }
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/packages");

      setPackages(getPackagesArray(res.data));
    } catch (err) {
      console.log("Packages error:", err.response?.data || err.message);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const filteredPackages = packages.filter((item) =>
    `${item?.name || ""} ${item?.title || ""} ${item?.programme || ""} ${
      item?.price || ""
    } ${item?.visibility || ""}`
      .toLowerCase()
      .includes(packageSearch.toLowerCase())
  );

  const openPackageForm = () => {
    setEditingPackage(null);
    setNewPackage(EMPTY_PACKAGE);
    setShowPackageForm(true);
  };

  const openEditPackage = (item) => {
    setEditingPackage(item);
    setNewPackage({
      name: item?.name || item?.title || "",
      backendName: item?.backendName || item?.backend_name || "",
      route: item?.route || "",
      duration: item?.duration || "",
      transfer: item?.transfer || "",
      transferReduction: item?.transferReduction || item?.transfer_reduction || "",
      startPrice: item?.startPrice || item?.start_price || item?.price || "",
      programme: item?.programme || "",
      price: item?.price || item?.startPrice || "",
      visibility: item?.visibility || "Private",
      image: item?.image || "",
      options: stringifyJson(item?.options),
      itinerary: stringifyJson(item?.itinerary),
      displayOrder: item?.displayOrder || item?.display_order || 0,
    });
    setShowPackageForm(true);
  };

  const closePackageForm = () => {
    setShowPackageForm(false);
    setNewPackage(EMPTY_PACKAGE);
    setEditingPackage(null);
    setSaving(false);
  };

  const updatePackageField = (field, value) => {
    setNewPackage((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePackageImage = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const res = await API.post("/admin/packages/upload-image", {
          image: reader.result,
        });

        setNewPackage((prevPackage) => ({
          ...prevPackage,
          image: res.data.image,
        }));
      } catch (err) {
        notify(err.response?.data?.error || "Unable to upload package image.");
      }
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

  const savePackage = async () => {
    if (saving) return;

    const name = newPackage.name.trim();

    if (!name) {
      notify("Please enter package name.");
      return;
    }

    let options = [];
    let itinerary = [];

    try {
      options = parseJson(newPackage.options, "Options");
      itinerary = parseJson(newPackage.itinerary, "Itinerary");
    } catch (error) {
      notify(error.message);
      return;
    }

    const packageData = {
      name,
      title: name,
      backendName: newPackage.backendName.trim() || name,
      route: newPackage.route.trim(),
      duration: newPackage.duration.trim(),
      transfer: newPackage.transfer.trim(),
      transferReduction: newPackage.transferReduction.trim(),
      startPrice: newPackage.startPrice.trim() || newPackage.price.trim(),
      programme: newPackage.programme.trim(),
      price: newPackage.price.trim() || newPackage.startPrice.trim(),
      visibility: newPackage.visibility || "Private",
      image: newPackage.image,
      options,
      itinerary,
      displayOrder: Number(newPackage.displayOrder || 0),
    };

    try {
      setSaving(true);

      const res = editingPackage
        ? await API.put(`/admin/packages/${getPackageId(editingPackage)}`, packageData)
        : await API.post("/admin/packages", packageData);

      const savedPackage = getPackageFromResponse(res.data, {
        id: Date.now(),
        ...packageData,
      });

      setPackages((prevPackages) =>
        editingPackage
          ? prevPackages.map((item) =>
              getPackageId(item) === getPackageId(editingPackage)
                ? savedPackage
                : item
            )
          : [savedPackage, ...prevPackages]
      );

      closePackageForm();
      notify(editingPackage ? "Package updated successfully." : "Package added successfully.");

      fetchPackages();
    } catch (err) {
      console.log("Save package error:", err.response?.data || err.message);

      notify(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to save package."
      );
    } finally {
      setSaving(false);
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

      notify(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update package visibility."
      );
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

      notify(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to delete package."
      );
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
            onClick={openPackageForm}
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

        {loading ? (
          <p className="empty-msg">Loading packages...</p>
        ) : filteredPackages.length === 0 ? (
          <p className="empty-msg">No packages found.</p>
        ) : (
          <div className="packages-admin-grid">
            {filteredPackages.map((item, index) => {
              const packageId = getPackageId(item);

              return (
                <div className="package-admin-card" key={packageId || index}>
                  <img
                    src={
                      getImageUrl(
                        item?.image ||
                          item?.image_url ||
                          item?.cover
                      )
                    }
                    alt={item?.name || item?.title || "Package"}
                    className="package-admin-image"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_COVER;
                    }}
                  />

                  <div className="package-admin-content">
                    <h3>{item?.name || item?.title || "Untitled Package"}</h3>

                    <p>
                      {item?.programme ||
                        item?.transfer ||
                        "No programme added for this package yet."}
                    </p>

                    <div className="package-admin-meta">
                      <span>{item?.startPrice || item?.start_price || item?.price || "No price"}</span>
                      <span>{item?.visibility || "Private"}</span>
                    </div>
                  </div>

                  <div className="package-admin-actions">
                    <button type="button" onClick={() => openEditPackage(item)}>
                      Edit
                    </button>

                    <select
                      className={`package-select ${
                        item?.visibility === "Published"
                          ? "uploaded"
                          : "missing"
                      }`}
                      value={item?.visibility || "Private"}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (value === "Delete") {
                          deletePackage(packageId);
                        } else {
                          updatePackageVisibility(packageId, value);
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
                <h2>{editingPackage ? "Edit Package" : "Add New Package"}</h2>
                <p>Create a complete travel package.</p>
              </div>

              <button
                type="button"
                className="close-package-popup"
                onClick={closePackageForm}
              >
                ×
              </button>
            </div>

            <div className="package-popup-form">
              <input
                type="text"
                placeholder="Package Name"
                value={newPackage.name}
                onChange={(e) => updatePackageField("name", e.target.value)}
              />

              <input
                type="text"
                placeholder="Backend Name"
                value={newPackage.backendName}
                onChange={(e) => updatePackageField("backendName", e.target.value)}
              />

              <input
                type="text"
                placeholder="Route, e.g. Cairo - Hurghada"
                value={newPackage.route}
                onChange={(e) => updatePackageField("route", e.target.value)}
              />

              <input
                type="text"
                placeholder="Duration, e.g. 6 Nights"
                value={newPackage.duration}
                onChange={(e) => updatePackageField("duration", e.target.value)}
              />

              <input
                type="text"
                placeholder="Transfer"
                value={newPackage.transfer}
                onChange={(e) => updatePackageField("transfer", e.target.value)}
              />

              <input
                type="text"
                placeholder="Transfer Reduction"
                value={newPackage.transferReduction}
                onChange={(e) =>
                  updatePackageField("transferReduction", e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Starting Price"
                value={newPackage.startPrice}
                onChange={(e) => updatePackageField("startPrice", e.target.value)}
              />

              <textarea
                placeholder="Full Programme"
                value={newPackage.programme}
                onChange={(e) =>
                  updatePackageField("programme", e.target.value)
                }
              />

              <textarea
                placeholder='Options JSON array, e.g. [{"title":"Option 01","rows":[{"city":"Cairo","nights":"2 Nights","hotel":"Hotel","meal":"Breakfast","sgl":"100$","dbl":"80$","tpl":"70$"}]}]'
                value={newPackage.options}
                onChange={(e) => updatePackageField("options", e.target.value)}
              />

              <textarea
                placeholder='Itinerary JSON array, e.g. [{"day":"Day 1","title":"Arrival","details":["Meet and assist"]}]'
                value={newPackage.itinerary}
                onChange={(e) => updatePackageField("itinerary", e.target.value)}
              />

              <input
                type="number"
                placeholder="Display Order"
                value={newPackage.displayOrder}
                onChange={(e) => updatePackageField("displayOrder", e.target.value)}
              />

              <input
                type="text"
                placeholder="Price"
                value={newPackage.price}
                onChange={(e) => updatePackageField("price", e.target.value)}
              />

              <input
                type="file"
                accept="image/*"
                onChange={handlePackageImage}
              />

              {newPackage.image && (
                <div className="hotel-preview-grid">
                  <div className="hotel-preview-item">
                    <img src={getImageUrl(newPackage.image)} alt="Package preview" />

                    <button type="button" onClick={removePackageImage}>
                      ×
                    </button>
                  </div>
                </div>
              )}

              <select
                value={newPackage.visibility}
                onChange={(e) =>
                  updatePackageField("visibility", e.target.value)
                }
              >
                <option value="Published">Published</option>
                <option value="Private">Private</option>
              </select>

              <div className="package-popup-actions">
                <button type="button" onClick={savePackage} disabled={saving}>
                  {saving ? "Saving..." : editingPackage ? "Save Changes" : "Save Package"}
                </button>

                <button
                  type="button"
                  className="cancel-package-btn"
                  onClick={closePackageForm}
                  disabled={saving}
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
