import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
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
  displayOrder: 0,
};

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [packageSearch, setPackageSearch] = useState("");
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState(EMPTY_PACKAGE);
  const [editingPackage, setEditingPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [packagePopup, setPackagePopup] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const notify = (message, type = "success", title = "") => {
    setPackagePopup({
      open: true,
      type,
      title: title || (type === "error" ? "Action Failed" : "Success"),
      message,
    });
  };

  const closeMessagePopup = () => {
    setPackagePopup({
      open: false,
      type: "success",
      title: "",
      message: "",
    });
  };

  const getPackageId = (item) => {
    return (
      item?._id ||
      item?.id ||
      item?.packageId ||
      item?.package_id ||
      item?.packageID ||
      item?.uuid ||
      null
    );
  };

  const getPackagesArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.packages)) return data.packages;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.rows)) return data.rows;
    if (Array.isArray(data?.result)) return data.result;
    if (Array.isArray(data?.results)) return data.results;

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

    let cleanImage = image;

    if (Array.isArray(cleanImage)) {
      cleanImage = cleanImage[0];
    }

    if (typeof cleanImage === "object") {
      cleanImage =
        cleanImage.url ||
        cleanImage.src ||
        cleanImage.image ||
        cleanImage.path ||
        "";
    }

    cleanImage = String(cleanImage || "").trim();

    if (!cleanImage) return DEFAULT_COVER;

    if (
      cleanImage.startsWith("http") ||
      cleanImage.startsWith("data:") ||
      cleanImage.startsWith("blob:")
    ) {
      return cleanImage;
    }

    const apiBase = API.defaults.baseURL || "/api";
    const origin = apiBase.replace(/\/api\/?$/, "");

    if (cleanImage.startsWith("/")) {
      return `${origin}${cleanImage}`;
    }

    return cleanImage;
  };

  const safeArray = (value) => {
    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  };

  useEffect(() => {
    if (!showPackageForm) return;

    const oldBodyOverflow = document.body.style.overflow;
    const oldHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldBodyOverflow;
      document.documentElement.style.overflow = oldHtmlOverflow;
    };
  }, [showPackageForm]);

  const fetchPackages = async () => {
    try {
      setLoading(true);

      let res;

      try {
        res = await API.get("/admin/packages");
      } catch (adminError) {
        console.log(
          "Admin packages route failed. Trying public /packages:",
          adminError.response?.data || adminError.message
        );

        res = await API.get("/packages");
      }

      const loadedPackages = getPackagesArray(res.data);
      setPackages(loadedPackages);
    } catch (err) {
      console.log("Packages error:", err.response?.data || err.message);

      notify(
        err.response?.data?.error || "Unable to load packages.",
        "error",
        "Loading Failed"
      );

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
      transferReduction:
        item?.transferReduction || item?.transfer_reduction || "",
      startPrice: item?.startPrice || item?.start_price || item?.price || "",
      programme: item?.programme || "",
      price: item?.price || item?.startPrice || item?.start_price || "",
      visibility: item?.visibility || "Private",
      image: item?.image || item?.image_url || item?.cover || "",
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
          image: res.data?.image || res.data?.url || "",
        }));

        notify(
          "Package image uploaded successfully.",
          "success",
          "Image Uploaded"
        );
      } catch (err) {
        notify(
          err.response?.data?.error || "Unable to upload package image.",
          "error",
          "Upload Failed"
        );
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
      notify("Please enter package name.", "error", "Missing Information");
      return;
    }

    const isEditing = Boolean(editingPackage);
    const editingPackageId = getPackageId(editingPackage);

    if (isEditing && !editingPackageId) {
      setShowPackageForm(false);
      setNewPackage(EMPTY_PACKAGE);
      setEditingPackage(null);

      notify(
        "Package ID not found. Please refresh the page and try again.",
        "error",
        "Update Failed"
      );
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
      displayOrder: Number(newPackage.displayOrder || 0),

      options: safeArray(editingPackage?.options),
      itinerary: safeArray(editingPackage?.itinerary),
    };

    try {
      setSaving(true);

      const res = isEditing
        ? await API.put(`/admin/packages/${editingPackageId}`, packageData)
        : await API.post("/admin/packages", packageData);

      const savedPackage = getPackageFromResponse(res.data, {
        id: editingPackageId || Date.now(),
        ...packageData,
      });

      setPackages((prevPackages) =>
        isEditing
          ? prevPackages.map((item) =>
              getPackageId(item) === editingPackageId ? savedPackage : item
            )
          : [savedPackage, ...prevPackages]
      );

      notify(
        isEditing
          ? "Package updated successfully."
          : "Package added successfully.",
        "success",
        "Saved Successfully"
      );

      closePackageForm();
      fetchPackages();
    } catch (err) {
      console.log("Save package error:", err.response?.data || err.message);

      notify(
        err.response?.data?.error ||
          err.response?.data?.message ||
          (isEditing ? "Unable to update package." : "Unable to add package."),
        "error",
        isEditing ? "Update Failed" : "Save Failed"
      );
    } finally {
      setSaving(false);
    }
  };

  const updatePackageVisibility = async (id, visibility) => {
    if (!id) {
      notify("Package id not found.", "error", "Missing Package ID");
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

      notify("Package visibility updated.", "success", "Updated");
    } catch (err) {
      console.log("Visibility error:", err.response?.data || err.message);

      notify(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update package visibility.",
        "error",
        "Update Failed"
      );
    }
  };

  const deletePackage = async (id) => {
    if (!id) {
      notify("Package id not found.", "error", "Missing Package ID");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this package?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/admin/packages/${id}`);

      setPackages((prevPackages) =>
        prevPackages.filter((item) => getPackageId(item) !== id)
      );

      notify("Package deleted successfully.", "success", "Deleted");
    } catch (err) {
      console.log("Delete package error:", err.response?.data || err.message);

      notify(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to delete package.",
        "error",
        "Delete Failed"
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
            className="package-main-action-btn"
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
              const visibility = item?.visibility || "Private";

              return (
                <div
                  className="package-admin-card package-card-pro"
                  key={packageId || index}
                >
                  <img
                    src={getImageUrl(
                      item?.image || item?.image_url || item?.cover
                    )}
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
                      <span>
                        {item?.startPrice ||
                          item?.start_price ||
                          item?.price ||
                          "No price"}
                      </span>

                      <span>{visibility}</span>
                    </div>
                  </div>

                  <div className="package-admin-actions package-actions-pro">
                    <button
                      type="button"
                      className="package-edit-action-btn"
                      onClick={() => openEditPackage(item)}
                    >
                      <FaEdit /> Edit
                    </button>

                    <select
                      className={`package-visibility-select ${
                        visibility === "Published" ? "published" : "private"
                      }`}
                      value={visibility}
                      onChange={(e) =>
                        updatePackageVisibility(packageId, e.target.value)
                      }
                    >
                      <option value="Published">Published</option>
                      <option value="Private">Private</option>
                    </select>

                    <button
                      type="button"
                      className="package-delete-action-btn"
                      onClick={() => deletePackage(packageId)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {showPackageForm && (
        <div className="package-popup-overlay">
          <div className="package-popup package-popup-pro">
            <div className="package-popup-head package-popup-head-sticky">
              <div>
                <h2>{editingPackage ? "Edit Package" : "Add New Package"}</h2>
                <p>Create and manage a professional travel package.</p>
              </div>

              <button
                type="button"
                className="close-package-popup"
                onClick={closePackageForm}
              >
                ×
              </button>
            </div>

            <div className="package-popup-form package-popup-form-scroll">
              <div className="package-form-section">
                <h3>Basic Information</h3>

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
                  onChange={(e) =>
                    updatePackageField("backendName", e.target.value)
                  }
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
                  onChange={(e) =>
                    updatePackageField("duration", e.target.value)
                  }
                />
              </div>

              <div className="package-form-section">
                <h3>Price & Transfer</h3>

                <input
                  type="text"
                  placeholder="Transfer"
                  value={newPackage.transfer}
                  onChange={(e) =>
                    updatePackageField("transfer", e.target.value)
                  }
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
                  onChange={(e) =>
                    updatePackageField("startPrice", e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Price"
                  value={newPackage.price}
                  onChange={(e) => updatePackageField("price", e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Display Order"
                  value={newPackage.displayOrder}
                  onChange={(e) =>
                    updatePackageField("displayOrder", e.target.value)
                  }
                />
              </div>

              <div className="package-form-section">
                <h3>Programme</h3>

                <textarea
                  className="big-textarea"
                  placeholder="Write the full programme here..."
                  value={newPackage.programme}
                  onChange={(e) =>
                    updatePackageField("programme", e.target.value)
                  }
                />
              </div>

              <div className="package-form-section">
                <h3>Package Image</h3>

                <label className="package-image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePackageImage}
                  />

                  <span>Choose package image</span>
                  <small>PNG, JPG, JPEG or WEBP</small>
                </label>

                {newPackage.image && (
                  <div className="hotel-preview-grid">
                    <div className="hotel-preview-item">
                      <img
                        src={getImageUrl(newPackage.image)}
                        alt="Package preview"
                      />

                      <button
                        type="button"
                        className="package-remove-image-btn"
                        onClick={removePackageImage}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                <select
                  className={`package-visibility-select ${
                    newPackage.visibility === "Published"
                      ? "published"
                      : "private"
                  }`}
                  value={newPackage.visibility}
                  onChange={(e) =>
                    updatePackageField("visibility", e.target.value)
                  }
                >
                  <option value="Published">Published</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              <div className="package-popup-actions package-popup-actions-sticky">
                <button
                  type="button"
                  className="package-save-action-btn"
                  onClick={savePackage}
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingPackage
                    ? "Save Changes"
                    : "Save Package"}
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

      {packagePopup.open && (
        <div className="package-message-popup-overlay" onClick={closeMessagePopup}>
          <div
            className={`package-message-popup ${packagePopup.type}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="package-message-popup-close"
              onClick={closeMessagePopup}
            >
              ×
            </button>

            <div className={`package-message-popup-icon ${packagePopup.type}`}>
              {packagePopup.type === "error" ? "!" : "✓"}
            </div>

            <h3>{packagePopup.title}</h3>
            <p>{packagePopup.message}</p>

            <button
              type="button"
              className="package-message-popup-btn"
              onClick={closeMessagePopup}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}