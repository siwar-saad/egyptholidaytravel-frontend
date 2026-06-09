import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import API from "../../api";

const emptyPeriod = {
  from: "",
  to: "",
  single: "",
  double: "",
  triple: "",
};

const createEmptyHotel = () => ({
  name: "",
  city: "",
  meal: "",
  image: "",
  gallery: [],
  description: "",
  groupTitle: "",
  groupSubtitle: "",
  displayOrder: 0,
  visibility: "Private",
  periods: [{ ...emptyPeriod }],
});

const apiOrigin =
  (import.meta.env.VITE_API_URL || "/api").replace(/\/api\/?$/, "") || "";

const getImageUrl = (src) => {
  if (!src) return "";
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith("/images/")) return `${apiOrigin}${src}`;
  return src;
};

const cleanUniqueImages = (images = []) =>
  [...new Set(images.map((item) => String(item || "").trim()).filter(Boolean))];

const monthMap = {
  jan: "01",
  january: "01",
  feb: "02",
  february: "02",
  mar: "03",
  march: "03",
  apr: "04",
  april: "04",
  may: "05",
  jun: "06",
  june: "06",
  jul: "07",
  july: "07",
  aug: "08",
  august: "08",
  sep: "09",
  sept: "09",
  september: "09",
  oct: "10",
  october: "10",
  nov: "11",
  november: "11",
  dec: "12",
  december: "12",
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const normalizeDateForInput = (value) => {
  if (!value) return "";

  const cleanValue = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
    return cleanValue;
  }

  const parts = cleanValue.split("-");

  if (parts.length >= 3) {
    const day = String(parts[0]).padStart(2, "0");
    const monthText = String(parts[1]).toLowerCase();
    let year = String(parts[2]).trim();

    if (year.length === 2) {
      year = `20${year}`;
    }

    const month = monthMap[monthText];

    if (month && year.length === 4) {
      return `${year}-${month}-${day}`;
    }
  }

  const date = new Date(cleanValue);

  if (!Number.isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return "";
};

const formatDateForStorage = (value) => {
  if (!value) return "";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const [year, month, day] = value.split("-");
  const monthName = monthNames[Number(month) - 1];

  return `${day}-${monthName}-${year}`;
};

const normalizePeriodsForForm = (periods = []) => {
  if (!Array.isArray(periods) || periods.length === 0) {
    return [{ ...emptyPeriod }];
  }

  return periods.map((period) => ({
    from: normalizeDateForInput(period.from),
    to: normalizeDateForInput(period.to),
    single: period.single || "",
    double: period.double || "",
    triple: period.triple || "",
  }));
};

export default function Hotels() {
  const defaultCover =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

  const [hotels, setHotels] = useState([]);
  const [hotelSearch, setHotelSearch] = useState("");
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [hotelForm, setHotelForm] = useState(createEmptyHotel());

  const [hotelPopup, setHotelPopup] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const notify = (message, type = "success", title = "") => {
    setHotelPopup({
      open: true,
      type,
      title: title || (type === "error" ? "Action Failed" : "Success"),
      message,
    });
  };

  const closeHotelMessagePopup = () => {
    setHotelPopup({
      open: false,
      type: "success",
      title: "",
      message: "",
    });
  };

  const getHotelId = (hotel) => hotel?._id || hotel?.id;

  const loadHotels = async () => {
    try {
      const res = await API.get("/hotels");
      setHotels(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      notify(
        err.response?.data?.error || "Unable to load hotels.",
        "error",
        "Loading Failed"
      );
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const filteredHotels = hotels.filter((hotel) =>
    `${hotel.name || ""} ${hotel.city || ""} ${hotel.meal || ""} ${
      hotel.group_title || hotel.groupTitle || ""
    } ${hotel.visibility || ""}`
      .toLowerCase()
      .includes(hotelSearch.toLowerCase())
  );

  const closeHotelForm = () => {
    setShowHotelForm(false);
    setEditingHotel(null);
    setHotelForm(createEmptyHotel());
    setManualImageUrl("");
    setSaving(false);
  };

  const openAddHotel = () => {
    setEditingHotel(null);
    setHotelForm(createEmptyHotel());
    setManualImageUrl("");
    setShowHotelForm(true);
  };

  const openEditHotel = (hotel) => {
    const gallery = Array.isArray(hotel.gallery) ? hotel.gallery : [];
    const cleanedGallery = cleanUniqueImages([hotel.image, ...gallery]);
    const periods = Array.isArray(hotel.periods) ? hotel.periods : [];

    setEditingHotel(hotel);

    setHotelForm({
      name: hotel.name || "",
      city: hotel.city || "",
      meal: hotel.meal || "",
      image: hotel.image || cleanedGallery[0] || "",
      gallery: cleanedGallery,
      description: hotel.description || "",
      groupTitle: hotel.group_title || hotel.groupTitle || "",
      groupSubtitle: hotel.group_subtitle || hotel.groupSubtitle || "",
      displayOrder: hotel.display_order || hotel.displayOrder || 0,
      visibility: hotel.visibility || "Private",
      periods: normalizePeriodsForForm(periods),
    });

    setManualImageUrl("");
    setShowHotelForm(true);
  };

  const updatePeriod = (index, field, value) => {
    setHotelForm((current) => ({
      ...current,
      periods: current.periods.map((period, periodIndex) =>
        periodIndex === index ? { ...period, [field]: value } : period
      ),
    }));
  };

  const addPeriod = () => {
    setHotelForm((current) => ({
      ...current,
      periods: [...current.periods, { ...emptyPeriod }],
    }));
  };

  const removePeriod = (index) => {
    setHotelForm((current) => ({
      ...current,
      periods:
        current.periods.length > 1
          ? current.periods.filter((_, periodIndex) => periodIndex !== index)
          : [{ ...emptyPeriod }],
    }));
  };

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const uploadHotelImages = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (files.length === 0) return;

    try {
      setUploadingImages(true);

      const uploadedUrls = [];

      for (const file of files) {
        const dataUrl = await readFileAsDataUrl(file);

        const res = await API.post("/admin/upload-image", {
          fileName: file.name,
          dataUrl,
        });

        if (res.data?.url) {
          uploadedUrls.push(res.data.url);
        }
      }

      setHotelForm((current) => {
        const nextGallery = cleanUniqueImages([
          ...current.gallery,
          ...uploadedUrls,
        ]);

        return {
          ...current,
          image: current.image || uploadedUrls[0] || "",
          gallery: nextGallery,
        };
      });

      notify(
        "Hotel photos uploaded successfully.",
        "success",
        "Photos Uploaded"
      );
    } catch (err) {
      notify(
        err.response?.data?.error || "Unable to upload hotel photos.",
        "error",
        "Upload Failed"
      );
    } finally {
      setUploadingImages(false);
    }
  };

  const addManualImage = () => {
    const cleanUrl = manualImageUrl.trim();

    if (!cleanUrl) {
      notify("Please write an image URL first.", "error", "Missing Image URL");
      return;
    }

    setHotelForm((current) => {
      const nextGallery = cleanUniqueImages([...current.gallery, cleanUrl]);

      return {
        ...current,
        image: current.image || cleanUrl,
        gallery: nextGallery,
      };
    });

    setManualImageUrl("");
  };

  const removeHotelImage = (imageUrl) => {
    setHotelForm((current) => {
      const nextGallery = current.gallery.filter((item) => item !== imageUrl);
      const nextCover =
        current.image === imageUrl ? nextGallery[0] || "" : current.image;

      return {
        ...current,
        image: nextCover,
        gallery: nextGallery,
      };
    });
  };

  const setCoverImage = (imageUrl) => {
    setHotelForm((current) => ({
      ...current,
      image: imageUrl,
      gallery: cleanUniqueImages([imageUrl, ...current.gallery]),
    }));
  };

  const buildPayload = () => {
    const gallery = cleanUniqueImages(hotelForm.gallery);
    const coverImage = hotelForm.image.trim() || gallery[0] || "";
    const finalGallery = cleanUniqueImages([coverImage, ...gallery]);

    const periods = hotelForm.periods
      .filter((period) =>
        Object.values(period).some((value) => String(value || "").trim())
      )
      .map((period) => ({
        from: formatDateForStorage(period.from),
        to: formatDateForStorage(period.to),
        single: period.single,
        double: period.double,
        triple: period.triple,
      }));

    return {
      name: hotelForm.name.trim(),
      city: hotelForm.city.trim(),
      meal: hotelForm.meal.trim(),
      image: coverImage,
      gallery: finalGallery,
      description: hotelForm.description.trim(),
      groupTitle: hotelForm.groupTitle.trim(),
      groupSubtitle: hotelForm.groupSubtitle.trim(),
      displayOrder: Number(hotelForm.displayOrder || 0),
      visibility: hotelForm.visibility || "Private",
      periods,
    };
  };

  const saveHotel = async () => {
    const payload = buildPayload();

    if (!payload.name || !payload.city || !payload.meal) {
      notify(
        "Please fill hotel name, city and meal plan.",
        "error",
        "Missing Information"
      );
      return;
    }

    const isEditing = Boolean(editingHotel);
    const hotelId = getHotelId(editingHotel);

    if (isEditing && !hotelId) {
      closeHotelForm();
      notify(
        "Hotel ID not found. Please refresh the page and try again.",
        "error",
        "Update Failed"
      );
      return;
    }

    setSaving(true);

    closeHotelForm();

    try {
      if (isEditing) {
        const res = await API.put(`/admin/${hotelId}`, payload);

        setHotels((current) =>
          current.map((hotel) =>
            getHotelId(hotel) === hotelId ? res.data : hotel
          )
        );

        notify(
          "Hotel updated successfully.",
          "success",
          "Hotel Updated"
        );
      } else {
        const res = await API.post("/admin/add", payload);
        setHotels((current) => [res.data, ...current]);

        notify(
          "Hotel added successfully.",
          "success",
          "Hotel Added"
        );
      }

      loadHotels();
    } catch (err) {
      notify(
        err.response?.data?.error || "Unable to save hotel.",
        "error",
        isEditing ? "Update Failed" : "Save Failed"
      );
    } finally {
      setSaving(false);
    }
  };

  const updateHotelVisibility = async (hotel, visibility) => {
    const hotelId = getHotelId(hotel);

    if (!hotelId) {
      notify("Hotel id not found.", "error", "Missing Hotel ID");
      return;
    }

    try {
      const payload = {
        name: hotel.name || "",
        city: hotel.city || "",
        meal: hotel.meal || "",
        image: hotel.image || "",
        gallery: Array.isArray(hotel.gallery) ? hotel.gallery : [],
        description: hotel.description || "",
        groupTitle: hotel.group_title || hotel.groupTitle || "",
        groupSubtitle: hotel.group_subtitle || hotel.groupSubtitle || "",
        displayOrder: Number(hotel.display_order || hotel.displayOrder || 0),
        visibility,
        periods: Array.isArray(hotel.periods) ? hotel.periods : [],
      };

      await API.put(`/admin/${hotelId}`, payload);

      setHotels((current) =>
        current.map((item) =>
          getHotelId(item) === hotelId ? { ...item, visibility } : item
        )
      );

      notify(
        "Hotel visibility updated.",
        "success",
        "Visibility Updated"
      );
    } catch (err) {
      notify(
        err.response?.data?.error || "Unable to update hotel visibility.",
        "error",
        "Update Failed"
      );
    }
  };

  const deleteHotel = async (hotelId) => {
    if (!hotelId) {
      notify("Hotel id not found.", "error", "Missing Hotel ID");
      return;
    }

    try {
      await API.delete(`/admin/${hotelId}`);

      setHotels((current) =>
        current.filter((hotel) => getHotelId(hotel) !== hotelId)
      );

      notify(
        "Hotel deleted successfully.",
        "success",
        "Hotel Deleted"
      );
    } catch (err) {
      notify(
        err.response?.data?.error || "Unable to delete hotel.",
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
            <h2>Hotels</h2>
            <p>Manage hotel photos, meal plans, prices and travel periods.</p>
          </div>

          <button className="add-package-btn-pro" onClick={openAddHotel}>
            <FaPlus /> Add New Hotel
          </button>
        </div>

        <div className="client-tools">
          <input
            type="text"
            placeholder="Search hotels by name, city, meal plan or visibility..."
            value={hotelSearch}
            onChange={(e) => setHotelSearch(e.target.value)}
          />
        </div>

        {filteredHotels.length === 0 ? (
          <p className="empty-msg">No hotels found.</p>
        ) : (
          <div className="packages-admin-grid">
            {filteredHotels.map((hotel) => {
              const periods = Array.isArray(hotel.periods)
                ? hotel.periods
                : [];

              const firstPeriod = periods[0] || {};
              const hotelId = getHotelId(hotel);

              return (
                <div className="package-admin-card" key={hotelId}>
                  <img
                    src={getImageUrl(hotel.image) || defaultCover}
                    alt={hotel.name || "Hotel"}
                    className="package-admin-image"
                    onError={(e) => {
                      e.currentTarget.src = defaultCover;
                    }}
                  />

                  <div className="package-admin-content">
                    <h3>{hotel.name || "Untitled Hotel"}</h3>

                    <p>
                      <strong>City:</strong> {hotel.city || "-"} <br />
                      <strong>Meal Plan:</strong> {hotel.meal || "-"} <br />
                      <strong>Group:</strong>{" "}
                      {hotel.group_title || hotel.groupTitle || "Our Hotels"}{" "}
                      <br />
                      <strong>Periods:</strong> {periods.length}
                    </p>

                    <div className="package-admin-meta">
                      <span>Single: {firstPeriod.single || "-"}</span>
                      <span>Double: {firstPeriod.double || "-"}</span>
                      <span>{hotel.visibility || "Private"}</span>
                    </div>
                  </div>

                  <div className="package-admin-actions">
                    <button type="button" onClick={() => openEditHotel(hotel)}>
                      Edit
                    </button>

                    <select
                      className={`package-select ${
                        hotel?.visibility === "Published"
                          ? "uploaded"
                          : "missing"
                      }`}
                      value={hotel?.visibility || "Private"}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (value === "Delete") {
                          deleteHotel(hotelId);
                        } else {
                          updateHotelVisibility(hotel, value);
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

      {showHotelForm && (
        <div className="package-popup-overlay">
          <div className="package-popup hotel-popup-fixed">
            <div className="package-popup-head hotel-popup-head-sticky">
              <div>
                <h2>{editingHotel ? "Edit Hotel" : "Add New Hotel"}</h2>
                <p>Add hotel details, photos, prices and travel periods.</p>
              </div>

              <button
                type="button"
                className="close-package-popup"
                onClick={closeHotelForm}
              >
                ×
              </button>
            </div>

            <div className="package-popup-form hotel-popup-scroll">
              <input
                type="text"
                placeholder="Group Title, e.g. Hotels in Cairo"
                value={hotelForm.groupTitle}
                onChange={(e) =>
                  setHotelForm({ ...hotelForm, groupTitle: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Group Subtitle"
                value={hotelForm.groupSubtitle}
                onChange={(e) =>
                  setHotelForm({ ...hotelForm, groupSubtitle: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Display Order"
                value={hotelForm.displayOrder}
                onChange={(e) =>
                  setHotelForm({ ...hotelForm, displayOrder: e.target.value })
                }
              />

              <select
                value={hotelForm.visibility}
                onChange={(e) =>
                  setHotelForm({ ...hotelForm, visibility: e.target.value })
                }
              >
                <option value="Published">Published</option>
                <option value="Private">Private</option>
              </select>

              <input
                type="text"
                placeholder="Hotel Name"
                value={hotelForm.name}
                onChange={(e) =>
                  setHotelForm({ ...hotelForm, name: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="City"
                value={hotelForm.city}
                onChange={(e) =>
                  setHotelForm({ ...hotelForm, city: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Meal Plan"
                value={hotelForm.meal}
                onChange={(e) =>
                  setHotelForm({ ...hotelForm, meal: e.target.value })
                }
              />

              <div className="hotel-upload-zone">
                <label className="hotel-upload-label">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={uploadHotelImages}
                    disabled={uploadingImages}
                  />

                  <span>
                    {uploadingImages
                      ? "Uploading photos..."
                      : "Choose hotel photos"}
                  </span>

                  <small>PNG, JPG, JPEG or WEBP</small>
                </label>

                <div className="hotel-url-row">
                  <input
                    type="text"
                    placeholder="Or paste image URL / path"
                    value={manualImageUrl}
                    onChange={(e) => setManualImageUrl(e.target.value)}
                  />

                  <button type="button" onClick={addManualImage}>
                    Add
                  </button>
                </div>
              </div>

              {hotelForm.gallery.length > 0 && (
                <div className="hotel-images-preview-grid">
                  {hotelForm.gallery.map((photo, index) => (
                    <div
                      className="hotel-image-preview-card"
                      key={`${photo}-${index}`}
                    >
                      <img
                        src={getImageUrl(photo)}
                        alt={`Hotel preview ${index + 1}`}
                        onError={(e) => {
                          e.currentTarget.src = defaultCover;
                        }}
                      />

                      <button
                        type="button"
                        className="remove-hotel-image-btn"
                        onClick={() => removeHotelImage(photo)}
                      >
                        ×
                      </button>

                      {hotelForm.image === photo ? (
                        <span className="hotel-cover-badge">Cover</span>
                      ) : (
                        <button
                          type="button"
                          className="set-cover-btn"
                          onClick={() => setCoverImage(photo)}
                        >
                          Set cover
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <textarea
                placeholder="Description"
                value={hotelForm.description}
                onChange={(e) =>
                  setHotelForm({ ...hotelForm, description: e.target.value })
                }
              />

              <div className="hotel-period-editor">
                <div className="hotel-period-editor-head">
                  <h3>Rates & Travel Periods</h3>

                  <button type="button" onClick={addPeriod}>
                    Add Period
                  </button>
                </div>

                {hotelForm.periods.map((period, index) => (
                  <div className="hotel-period-row-clean" key={index}>
                    <div className="hotel-period-field">
                      <label>From</label>
                      <input
                        type="date"
                        value={period.from}
                        onChange={(e) =>
                          updatePeriod(index, "from", e.target.value)
                        }
                      />
                    </div>

                    <div className="hotel-period-field">
                      <label>To</label>
                      <input
                        type="date"
                        value={period.to}
                        onChange={(e) =>
                          updatePeriod(index, "to", e.target.value)
                        }
                      />
                    </div>

                    <div className="hotel-period-field">
                      <label>Single Room</label>
                      <input
                        type="text"
                        placeholder="ex: 40 USD"
                        value={period.single}
                        onChange={(e) =>
                          updatePeriod(index, "single", e.target.value)
                        }
                      />
                    </div>

                    <div className="hotel-period-field">
                      <label>Double Room</label>
                      <input
                        type="text"
                        placeholder="ex: 60 USD"
                        value={period.double}
                        onChange={(e) =>
                          updatePeriod(index, "double", e.target.value)
                        }
                      />
                    </div>

                    <div className="hotel-period-field">
                      <label>Triple / Note</label>
                      <input
                        type="text"
                        placeholder="ex: 80 USD"
                        value={period.triple}
                        onChange={(e) =>
                          updatePeriod(index, "triple", e.target.value)
                        }
                      />
                    </div>

                    <button
                      type="button"
                      className="remove-period-btn"
                      onClick={() => removePeriod(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="package-popup-actions">
                <button type="button" onClick={saveHotel} disabled={saving}>
                  {saving ? "Saving..." : "Save Hotel"}
                </button>

                <button
                  type="button"
                  className="cancel-package-btn"
                  onClick={closeHotelForm}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {hotelPopup.open && (
        <div
          className="hotel-message-popup-overlay"
          onClick={closeHotelMessagePopup}
        >
          <div
            className={`hotel-message-popup ${hotelPopup.type}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="hotel-message-popup-close"
              onClick={closeHotelMessagePopup}
            >
              ×
            </button>

            <div className={`hotel-message-popup-icon ${hotelPopup.type}`}>
              {hotelPopup.type === "error" ? "!" : "✓"}
            </div>

            <h3>{hotelPopup.title}</h3>
            <p>{hotelPopup.message}</p>

            <button
              type="button"
              className="hotel-message-popup-btn"
              onClick={closeHotelMessagePopup}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}