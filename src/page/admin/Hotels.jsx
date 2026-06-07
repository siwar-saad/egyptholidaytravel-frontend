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

export default function Hotels({ showSuccess }) {
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

  const notify = (message) => {
    if (typeof showSuccess === "function") {
      showSuccess(message);
    }
  };

  const loadHotels = async () => {
    try {
      const res = await API.get("/hotels");
      setHotels(res.data || []);
    } catch (err) {
      notify(err.response?.data?.error || "Unable to load hotels.");
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const filteredHotels = hotels.filter((hotel) =>
    `${hotel.name || ""} ${hotel.city || ""} ${hotel.meal || ""} ${
      hotel.group_title || ""
    }`
      .toLowerCase()
      .includes(hotelSearch.toLowerCase())
  );

  const closeHotelForm = () => {
    setShowHotelForm(false);
    setEditingHotel(null);
    setHotelForm(createEmptyHotel());
    setManualImageUrl("");
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
      groupTitle: hotel.group_title || "",
      groupSubtitle: hotel.group_subtitle || "",
      displayOrder: hotel.display_order || 0,
      periods: periods.length ? periods : [{ ...emptyPeriod }],
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

      notify("Hotel photos uploaded successfully.");
    } catch (err) {
      notify(err.response?.data?.error || "Unable to upload hotel photos.");
    } finally {
      setUploadingImages(false);
    }
  };

  const addManualImage = () => {
    const cleanUrl = manualImageUrl.trim();

    if (!cleanUrl) {
      notify("Please write an image URL first.");
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

    const periods = hotelForm.periods.filter((period) =>
      Object.values(period).some((value) => String(value || "").trim())
    );

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
      periods,
    };
  };

  const saveHotel = async () => {
    const payload = buildPayload();

    if (!payload.name || !payload.city || !payload.meal) {
      notify("Please fill hotel name, city and meal plan.");
      return;
    }

    try {
      setSaving(true);

      if (editingHotel) {
        const res = await API.put(`/admin/${editingHotel.id}`, payload);

        setHotels((current) =>
          current.map((hotel) =>
            hotel.id === editingHotel.id ? res.data : hotel
          )
        );

        notify("Hotel updated successfully.");
      } else {
        const res = await API.post("/admin/add", payload);
        setHotels((current) => [res.data, ...current]);
        notify("Hotel added successfully.");
      }

      closeHotelForm();
    } catch (err) {
      notify(err.response?.data?.error || "Unable to save hotel.");
    } finally {
      setSaving(false);
    }
  };

  const deleteHotel = async (hotelId) => {
    try {
      await API.delete(`/admin/${hotelId}`);
      setHotels((current) => current.filter((hotel) => hotel.id !== hotelId));
      notify("Hotel deleted successfully.");
    } catch (err) {
      notify(err.response?.data?.error || "Unable to delete hotel.");
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
            placeholder="Search hotels by name, city or meal plan..."
            value={hotelSearch}
            onChange={(e) => setHotelSearch(e.target.value)}
          />
        </div>

        {filteredHotels.length === 0 ? (
          <p className="empty-msg">No hotels found.</p>
        ) : (
          <div className="packages-admin-grid">
            {filteredHotels.map((hotel) => {
              const periods = Array.isArray(hotel.periods) ? hotel.periods : [];
              const firstPeriod = periods[0] || {};

              return (
                <div className="package-admin-card" key={hotel.id}>
                  <img
                    src={getImageUrl(hotel.image) || defaultCover}
                    alt={hotel.name}
                    className="package-admin-image"
                    onError={(e) => {
                      e.currentTarget.src = defaultCover;
                    }}
                  />

                  <div className="package-admin-content">
                    <h3>{hotel.name}</h3>

                    <p>
                      <strong>City:</strong> {hotel.city} <br />
                      <strong>Meal Plan:</strong> {hotel.meal} <br />
                      <strong>Group:</strong>{" "}
                      {hotel.group_title || "Our Hotels"} <br />
                      <strong>Periods:</strong> {periods.length}
                    </p>

                    <div className="package-admin-meta">
                      <span>Single: {firstPeriod.single || "-"} </span>
                      <span>Double: {firstPeriod.double || "-"} </span>
                      <span>Triple: {firstPeriod.triple || "-"} </span>
                    </div>
                  </div>

                  <div className="package-admin-actions">
                    <button type="button" onClick={() => openEditHotel(hotel)}>
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-package-btn"
                      onClick={() => deleteHotel(hotel.id)}
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
                    {uploadingImages ? "Uploading photos..." : "Choose hotel photos"}
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
                    <div className="hotel-image-preview-card" key={`${photo}-${index}`}>
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
                  <div className="hotel-period-row" key={index}>
                    <input
                      type="text"
                      placeholder="From"
                      value={period.from}
                      onChange={(e) => updatePeriod(index, "from", e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="To"
                      value={period.to}
                      onChange={(e) => updatePeriod(index, "to", e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="Single"
                      value={period.single}
                      onChange={(e) =>
                        updatePeriod(index, "single", e.target.value)
                      }
                    />

                    <input
                      type="text"
                      placeholder="Double"
                      value={period.double}
                      onChange={(e) =>
                        updatePeriod(index, "double", e.target.value)
                      }
                    />

                    <input
                      type="text"
                      placeholder="Triple / Note"
                      value={period.triple}
                      onChange={(e) =>
                        updatePeriod(index, "triple", e.target.value)
                      }
                    />

                    <button type="button" onClick={() => removePeriod(index)}>
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
    </>
  );
}