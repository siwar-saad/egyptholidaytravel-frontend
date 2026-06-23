import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCloudUploadAlt,
  FaImage,
} from "react-icons/fa";
import API from "../../api";

const PACKAGES_PER_PAGE = 12;

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
  tripType: "egypt",
  image: "",
  images: [],
  displayOrder: 0,
};

const getEmptyPackage = () => ({
  ...EMPTY_PACKAGE,
  images: [],
});

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [packageSearch, setPackageSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showPackageForm, setShowPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState(getEmptyPackage());
  const [editingPackage, setEditingPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const normalizeTripType = (value) => {
    const clean = String(value || "").toLowerCase().trim();

    if (
      clean === "international" ||
      clean === "international trips" ||
      clean === "other" ||
      clean === "others"
    ) {
      return "international";
    }

    return "egypt";
  };

  const getTripTypeLabel = (value) => {
    return normalizeTripType(value) === "international"
      ? "International Trips"
      : "Egypt Trips";
  };

  const normalizeImagesValue = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }

    if (typeof value === "string") {
      const clean = value.trim();

      if (!clean) return [];

      try {
        const parsed = JSON.parse(clean);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [clean];
      } catch {
        return [clean];
      }
    }

    if (typeof value === "object") {
      return [value];
    }

    return [];
  };

  const uniqueImages = (images) => {
    const seen = new Set();

    return images.filter((image) => {
      const key =
        typeof image === "object"
          ? image.url ||
            image.src ||
            image.image ||
            image.path ||
            JSON.stringify(image)
          : String(image);

      if (!key || seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  };

  const getPackageImages = (item) => {
    const galleryImages = normalizeImagesValue(
      item?.images ||
        item?.gallery ||
        item?.photos ||
        item?.imageUrls ||
        item?.image_urls
    );

    const mainImages = normalizeImagesValue(
      item?.image || item?.image_url || item?.cover
    );

    return uniqueImages([...galleryImages, ...mainImages]);
  };

  const getImageUrl = (image) => {
    if (!image) return DEFAULT_COVER;

    let cleanImage = image;

    if (Array.isArray(cleanImage)) cleanImage = cleanImage[0];

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

    if (cleanImage.startsWith("/")) return `${origin}${cleanImage}`;

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
    } ${item?.visibility || ""} ${
      item?.tripType || item?.trip_type || item?.category || ""
    }`
      .toLowerCase()
      .includes(packageSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPackages.length / PACKAGES_PER_PAGE);

  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * PACKAGES_PER_PAGE,
    currentPage * PACKAGES_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [packageSearch]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openPackageForm = () => {
    setEditingPackage(null);
    setNewPackage(getEmptyPackage());
    setShowPackageForm(true);
  };

  const openEditPackage = (item) => {
    setEditingPackage(item);

    const packageImages = getPackageImages(item);

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
      tripType: normalizeTripType(
        item?.tripType || item?.trip_type || item?.category || item?.type
      ),
      image: packageImages[0] || "",
      images: packageImages,
      displayOrder: item?.displayOrder || item?.display_order || 0,
    });

    setShowPackageForm(true);
  };

  const closePackageForm = () => {
    setShowPackageForm(false);
    setNewPackage(getEmptyPackage());
    setEditingPackage(null);
    setSaving(false);
    setUploadingImage(false);
  };

  const updatePackageField = (field, value) => {
    setNewPackage((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const uploadSinglePackageImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = () => {
        reject(new Error("Unable to read image file."));
      };

      reader.onloadend = async () => {
        try {
          const res = await API.post("/admin/packages/upload-image", {
            image: reader.result,
          });

          resolve(
            res.data?.image ||
              res.data?.url ||
              res.data?.path ||
              reader.result
          );
        } catch (err) {
          reject(err);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handlePackageImages = async (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    try {
      setUploadingImage(true);

      const results = await Promise.allSettled(
        files.map((file) => uploadSinglePackageImage(file))
      );

      const uploadedImages = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      if (uploadedImages.length > 0) {
        setNewPackage((prev) => {
          const finalImages = uniqueImages([
            ...(prev.images || []),
            ...uploadedImages,
          ]);

          return {
            ...prev,
            images: finalImages,
            image: finalImages[0] || "",
          };
        });
      }

      if (uploadedImages.length !== files.length) {
        notify(
          "Some images could not be uploaded.",
          "error",
          "Upload Warning"
        );
      }
    } catch (err) {
      notify(
        err.response?.data?.error || "Unable to upload package images.",
        "error",
        "Upload Failed"
      );
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const removePackageImage = (indexToRemove) => {
    setNewPackage((prev) => {
      const newImages = (prev.images || []).filter(
        (_, index) => index !== indexToRemove
      );

      return {
        ...prev,
        images: newImages,
        image: newImages[0] || "",
      };
    });
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
      closePackageForm();

      notify(
        "Package ID not found. Please refresh the page and try again.",
        "error",
        "Update Failed"
      );
      return;
    }

    const packageImages = Array.isArray(newPackage.images)
      ? newPackage.images.filter(Boolean)
      : [];

    const selectedTripType = normalizeTripType(newPackage.tripType);

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

      tripType: selectedTripType,
      trip_type: selectedTripType,
      category: selectedTripType,
      type: selectedTripType,

      image: packageImages[0] || "",
      images: packageImages,

      displayOrder: Number(newPackage.displayOrder || 0),
      options: safeArray(editingPackage?.options),
      itinerary: safeArray(editingPackage?.itinerary),
    };

    try {
      setSaving(true);

      const res = isEditing
        ? await API.put(`/admin/packages/${editingPackageId}`, packageData)
        : await API.post("/admin/packages", packageData);

      const responsePackage = getPackageFromResponse(res.data, {
        id: editingPackageId || Date.now(),
        ...packageData,
      });

      const savedPackage = {
        ...responsePackage,
        image: responsePackage?.image || packageImages[0] || "",
        images:
          normalizeImagesValue(responsePackage?.images).length > 0
            ? normalizeImagesValue(responsePackage?.images)
            : packageImages,
        tripType: normalizeTripType(
          responsePackage?.tripType ||
            responsePackage?.trip_type ||
            responsePackage?.category ||
            selectedTripType
        ),
      };

      setPackages((prevPackages) =>
        isEditing
          ? prevPackages.map((item) =>
              getPackageId(item) === editingPackageId ? savedPackage : item
            )
          : [savedPackage, ...prevPackages]
      );

      closePackageForm();

      notify(
        isEditing
          ? "Package edited successfully."
          : "New package added successfully.",
        "success",
        isEditing ? "Package Updated" : "Package Added"
      );

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

      notify(
        visibility === "Published"
          ? "Package published successfully."
          : "Package moved to private successfully.",
        "success",
        visibility === "Published" ? "Published" : "Updated"
      );
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

      notify("Package deleted successfully.", "success", "Package Deleted");
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
            placeholder="Search packages by name, programme, category or price..."
            value={packageSearch}
            onChange={(e) => setPackageSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="empty-msg">Loading packages...</p>
        ) : filteredPackages.length === 0 ? (
          <p className="empty-msg">No packages found.</p>
        ) : (
          <>
            <div className="packages-admin-grid">
              {paginatedPackages.map((item, index) => {
                const packageId = getPackageId(item);
                const visibility = item?.visibility || "Private";
                const packageImages = getPackageImages(item);
                const tripType = normalizeTripType(
                  item?.tripType ||
                    item?.trip_type ||
                    item?.category ||
                    item?.type
                );

                return (
                  <div
                    className="package-admin-card package-card-pro"
                    key={packageId || index}
                  >
                    <div className="package-admin-image-wrap">
                      <img
                        src={getImageUrl(packageImages[0])}
                        alt={item?.name || item?.title || "Package"}
                        className="package-admin-image"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_COVER;
                        }}
                      />

                      {packageImages.length > 1 && (
                        <span className="package-image-number">
                          +{packageImages.length - 1}
                        </span>
                      )}
                    </div>

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

                        <span>{getTripTypeLabel(tripType)}</span>

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

            {totalPages > 1 && (
              <div className="admin-pagination">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <div className="admin-pagination-numbers">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;

                    return (
                      <button
                        type="button"
                        key={page}
                        className={currentPage === page ? "active" : ""}
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
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
                <h3>Trip Category</h3>

                <select
                  className="package-trip-type-select"
                  value={newPackage.tripType}
                  onChange={(e) =>
                    updatePackageField("tripType", e.target.value)
                  }
                >
                  <option value="egypt">Egypt Trips</option>
                  <option value="international">International Trips</option>
                </select>
              </div>

              <div className="package-form-section">
                <h3>Package Images</h3>

                <div className="package-multi-upload-box">
                  <label className="package-image-upload-modern">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePackageImages}
                    />

                    <FaCloudUploadAlt />
                    <span>
                      {uploadingImage ? "Uploading..." : "Choose Images"}
                    </span>
                    <small>You can select more than one image</small>
                  </label>

                  {newPackage.images?.length > 0 ? (
                    <>
                      <p className="package-images-count">
                        {newPackage.images.length} image
                        {newPackage.images.length > 1 ? "s" : ""} selected
                      </p>

                      <div className="package-images-preview-grid">
                        {newPackage.images.map((image, index) => (
                          <div
                            className="package-image-preview-card"
                            key={`${index}-${String(getImageUrl(image))}`}
                          >
                            <img
                              src={getImageUrl(image)}
                              alt={`Package preview ${index + 1}`}
                            />

                            <button
                              type="button"
                              className="package-image-remove-x"
                              onClick={() => removePackageImage(index)}
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="package-image-empty-box full">
                      <FaImage />
                      <span>No images selected</span>
                    </div>
                  )}
                </div>

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
                  disabled={saving || uploadingImage}
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
        <div
          className="package-message-popup-overlay"
          onClick={closeMessagePopup}
        >
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