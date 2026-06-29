import { useEffect, useMemo, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaImage,
  FaSave,
} from "react-icons/fa";

import "./Admin.css";

const DESTINATIONS_STORAGE_KEY = "egypt_holiday_destinations";

const defaultCover =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#935426"/>
          <stop offset="1" stop-color="#24160f"/>
        </linearGradient>
      </defs>
      <rect width="900" height="600" fill="url(#g)"/>
      <polygon points="130,470 300,220 470,470" fill="rgba(255,255,255,0.25)"/>
      <polygon points="320,470 520,170 720,470" fill="rgba(255,255,255,0.32)"/>
      <text x="50%" y="54%" text-anchor="middle" fill="white" font-size="58" font-family="Georgia" font-weight="700">
        Egypt Destination
      </text>
    </svg>
  `);

const defaultDestinations = [
  {
    id: "exclusive-cairo",
    country: "Egypt",
    badge: "Cairo Program",
    title: "Exclusive Cairo Experience",
    duration: "04 Nights / 05 Days",
    location: "Cairo, Egypt",
    images: [defaultCover],
    image: defaultCover,
    isPublished: true,
    description:
      "A beautiful Cairo travel program including private airport transfers, hotel accommodation, daily breakfast, and the most famous sightseeing tours.",
    highlights: [
      "Giza Pyramids",
      "The Sphinx",
      "Grand Egyptian Museum",
      "Islamic Cairo",
      "Khan El Khalili",
    ],
    included: [
      "Hotel accommodation with daily breakfast",
      "Private airport transfers",
      "Sightseeing tours",
      "Agency travel support",
    ],
    days: [
      {
        day: "Day 1",
        title: "Arrival to Cairo",
        activities: [
          "Pickup from Cairo International Airport",
          "Private transfer to the hotel",
          "Hotel check-in and free time to relax",
        ],
      },
      {
        day: "Day 2",
        title: "Pyramids & Grand Egyptian Museum",
        activities: [
          "Breakfast at the hotel",
          "Visit the Giza Pyramids and the Sphinx",
          "Lunch at a restaurant overlooking the Pyramids",
          "Visit the Grand Egyptian Museum",
          "Return to the hotel",
        ],
      },
    ],
  },
];

const emptyForm = {
  country: "Egypt",
  badge: "",
  title: "",
  duration: "",
  location: "",
  images: [],
  description: "",
  highlightsText: "",
  includedText: "",
  isPublished: true,
  days: [
    {
      day: "Day 1",
      title: "",
      activitiesText: "",
    },
  ],
};

function normalizeDestination(destination) {
  const images =
    Array.isArray(destination.images) && destination.images.length > 0
      ? destination.images
      : destination.image
      ? [destination.image]
      : [defaultCover];

  return {
    ...destination,
    images,
    image: images[0] || defaultCover,
    isPublished: destination.isPublished !== false,
  };
}

function getDestinations() {
  try {
    const saved = localStorage.getItem(DESTINATIONS_STORAGE_KEY);

    if (!saved) {
      localStorage.setItem(
        DESTINATIONS_STORAGE_KEY,
        JSON.stringify(defaultDestinations)
      );
      return defaultDestinations.map(normalizeDestination);
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      localStorage.setItem(
        DESTINATIONS_STORAGE_KEY,
        JSON.stringify(defaultDestinations)
      );
      return defaultDestinations.map(normalizeDestination);
    }

    return parsed.map(normalizeDestination);
  } catch {
    return defaultDestinations.map(normalizeDestination);
  }
}

function saveDestinations(destinations) {
  localStorage.setItem(DESTINATIONS_STORAGE_KEY, JSON.stringify(destinations));
}

function makeDestinationId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `destination-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [notice, setNotice] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    setDestinations(getDestinations());
  }, []);

  const showNotice = (type, message) => {
    setNotice({ show: true, type, message });

    setTimeout(() => {
      setNotice({ show: false, type: "success", message: "" });
    }, 2200);
  };

  const persist = (nextList) => {
    setDestinations(nextList);
    saveDestinations(nextList);
  };

  const filteredDestinations = useMemo(() => {
    const key = search.trim().toLowerCase();

    if (!key) return destinations;

    return destinations.filter((destination) => {
      const status = destination.isPublished ? "published" : "private";

      return [
        destination.title,
        destination.country,
        destination.badge,
        destination.duration,
        destination.location,
        status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(key);
    });
  }, [destinations, search]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (destination) => {
    const normalized = normalizeDestination(destination);

    setEditingId(normalized.id);

    setForm({
      country: normalized.country || "Egypt",
      badge: normalized.badge || "",
      title: normalized.title || "",
      duration: normalized.duration || "",
      location: normalized.location || "",
      images: normalized.images || [],
      description: normalized.description || "",
      highlightsText: (normalized.highlights || []).join("\n"),
      includedText: (normalized.included || []).join("\n"),
      isPublished: normalized.isPublished !== false,
      days:
        normalized.days?.length > 0
          ? normalized.days.map((item) => ({
              day: item.day || "",
              title: item.title || "",
              activitiesText: (item.activities || []).join("\n"),
            }))
          : emptyForm.days,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagesUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      showNotice("error", "Please choose only valid images.");
    }

    try {
      const newImages = await Promise.all(validFiles.map(fileToDataUrl));

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));

      event.target.value = "";
    } catch {
      showNotice("error", "Image upload failed.");
    }
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const addDay = () => {
    setForm((prev) => ({
      ...prev,
      days: [
        ...prev.days,
        {
          day: `Day ${prev.days.length + 1}`,
          title: "",
          activitiesText: "",
        },
      ],
    }));
  };

  const removeDay = (index) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updateDay = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.map((day, itemIndex) =>
        itemIndex === index ? { ...day, [field]: value } : day
      ),
    }));
  };

  const textToArray = (text) => {
    return text
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      showNotice("error", "Destination title is required.");
      return;
    }

    if (!form.duration.trim()) {
      showNotice("error", "Duration is required.");
      return;
    }

    if (!form.location.trim()) {
      showNotice("error", "Location is required.");
      return;
    }

    const finalImages = form.images.length > 0 ? form.images : [defaultCover];

    const destinationData = {
      id: editingId || makeDestinationId(),
      country: form.country.trim() || "Egypt",
      badge: form.badge.trim() || "Destination Program",
      title: form.title.trim(),
      duration: form.duration.trim(),
      location: form.location.trim(),
      images: finalImages,
      image: finalImages[0],
      description: form.description.trim(),
      highlights: textToArray(form.highlightsText),
      included: textToArray(form.includedText),
      isPublished: form.isPublished,
      days: form.days
        .map((day) => ({
          day: day.day.trim(),
          title: day.title.trim(),
          activities: textToArray(day.activitiesText),
        }))
        .filter((day) => day.day && day.title),
    };

    let nextList;

    if (editingId) {
      nextList = destinations.map((item) =>
        item.id === editingId ? destinationData : item
      );
      showNotice("success", "Destination updated successfully.");
    } else {
      nextList = [destinationData, ...destinations];
      showNotice("success", "New destination added successfully.");
    }

    persist(nextList);
    closeModal();
  };

  const togglePublish = (destinationId) => {
    const nextList = destinations.map((item) =>
      item.id === destinationId
        ? { ...item, isPublished: !item.isPublished }
        : item
    );

    persist(nextList);
    showNotice("success", "Destination status changed.");
  };

  const deleteDestination = (destinationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this destination?"
    );

    if (!confirmDelete) return;

    const nextList = destinations.filter((item) => item.id !== destinationId);
    persist(nextList);
    showNotice("success", "Destination deleted successfully.");
  };

  return (
    <div className="admin-destination-admin-page">
      {notice.show && (
        <div className={`admin-destination-notice ${notice.type}`}>
          {notice.message}
        </div>
      )}

      <div className="admin-destination-panel">
        <div className="admin-destination-header">
          <div>
            <h1>Destinations</h1>
            <p>Manage your destination programs and website visibility.</p>
          </div>

          <button
            type="button"
            className="admin-destination-add-btn"
            onClick={openAddModal}
          >
            <FaPlus />
            Add New Destination
          </button>
        </div>

        <input
          className="admin-destination-search"
          type="text"
          placeholder="Search destinations by name, country, programme or visibility..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="admin-destination-list">
          {filteredDestinations.length === 0 ? (
            <div className="admin-destination-empty">
              <FaMapMarkerAlt />
              <h3>No destinations found</h3>
              <p>Add a new destination or change your search.</p>
            </div>
          ) : (
            filteredDestinations.map((destination) => {
              const cover =
                destination.images?.[0] || destination.image || defaultCover;

              return (
                <div className="admin-destination-card" key={destination.id}>
                  <div className="admin-destination-image-box">
                    <img
                      src={cover}
                      alt={destination.title}
                      className="admin-destination-image"
                    />

                    {destination.images?.length > 1 && (
                      <span className="admin-destination-image-count">
                        +{destination.images.length - 1}
                      </span>
                    )}
                  </div>

                  <div className="admin-destination-info">
                    <h2>{destination.title}</h2>

                    <p>{destination.description || destination.location}</p>

                    <div className="admin-destination-tags">
                      <span>{destination.country}</span>
                      <span>{destination.duration}</span>
                      <span>{destination.badge || "Program"}</span>
                      <span>
                        {destination.isPublished ? "Published" : "Private"}
                      </span>
                    </div>
                  </div>

                  <div className="admin-destination-actions">
                    <button
                      type="button"
                      className="admin-destination-action edit"
                      onClick={() => openEditModal(destination)}
                    >
                      <FaEdit />
                      Edit
                    </button>

                    <button
                      type="button"
                      className={
                        destination.isPublished
                          ? "admin-destination-action private"
                          : "admin-destination-action publish"
                      }
                      onClick={() => togglePublish(destination.id)}
                    >
                      {destination.isPublished ? <FaEyeSlash /> : <FaEye />}
                      {destination.isPublished ? "Private" : "Publish"}
                    </button>

                    <button
                      type="button"
                      className="admin-destination-action delete"
                      onClick={() => deleteDestination(destination.id)}
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="admin-destination-modal-overlay">
          <div className="admin-destination-modal">
            <button
              type="button"
              className="admin-destination-close"
              onClick={closeModal}
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <div className="admin-destination-modal-head">
              <h2>{editingId ? "Edit Destination" : "Add New Destination"}</h2>
              <p>
                Fill the program details. Published destinations appear on the
                website.
              </p>
            </div>

            <form className="admin-destination-form" onSubmit={handleSubmit}>
              <div className="admin-destination-form-grid">
                <label>
                  Country
                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Egypt"
                  />
                </label>

                <label>
                  Program Name
                  <input
                    type="text"
                    name="badge"
                    value={form.badge}
                    onChange={handleChange}
                    placeholder="Cairo Program"
                  />
                </label>

                <label>
                  Destination Title
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Exclusive Cairo Experience"
                  />
                </label>

                <label>
                  Duration
                  <input
                    type="text"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="04 Nights / 05 Days"
                  />
                </label>

                <label className="full">
                  Location
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Cairo, Egypt"
                  />
                </label>

                <label className="full">
                  Description
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Write a short description..."
                  />
                </label>

                <label className="full">
                  Highlights
                  <textarea
                    name="highlightsText"
                    value={form.highlightsText}
                    onChange={handleChange}
                    placeholder={
                      "Giza Pyramids\nGrand Egyptian Museum\nKhan El Khalili"
                    }
                  />
                </label>

                <label className="full">
                  Included Services
                  <textarea
                    name="includedText"
                    value={form.includedText}
                    onChange={handleChange}
                    placeholder={
                      "Private airport transfers\nSightseeing tours\nTravel support"
                    }
                  />
                </label>

                <div className="admin-destination-upload full">
                  <div>
                    <h4>Cover Images</h4>
                    <p>
                      Upload one or more images. The first image will be used as
                      the cover.
                    </p>
                  </div>

                  <label className="admin-destination-upload-btn">
                    <FaImage />
                    Choose Images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesUpload}
                    />
                  </label>

                  {form.images.length > 0 && (
                    <div className="admin-destination-images-preview-grid">
                      {form.images.map((image, index) => (
                        <div
                          className="admin-destination-image-preview-item"
                          key={`${image}-${index}`}
                        >
                          <img src={image} alt={`Preview ${index + 1}`} />

                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            aria-label="Remove image"
                          >
                            <FaTimes />
                          </button>

                          {index === 0 && (
                            <span className="admin-destination-cover-label">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-destination-days-box">
                <div className="admin-destination-days-head">
                  <h3>Program Days</h3>

                  <button type="button" onClick={addDay}>
                    <FaPlus />
                    Add Day
                  </button>
                </div>

                {form.days.map((day, index) => (
                  <div className="admin-destination-day-form" key={index}>
                    <div className="admin-destination-day-row">
                      <input
                        type="text"
                        value={day.day}
                        onChange={(event) =>
                          updateDay(index, "day", event.target.value)
                        }
                        placeholder="Day 1"
                      />

                      <input
                        type="text"
                        value={day.title}
                        onChange={(event) =>
                          updateDay(index, "title", event.target.value)
                        }
                        placeholder="Arrival to Cairo"
                      />

                      {form.days.length > 1 && (
                        <button
                          type="button"
                          className="admin-destination-remove-day"
                          onClick={() => removeDay(index)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>

                    <textarea
                      value={day.activitiesText}
                      onChange={(event) =>
                        updateDay(index, "activitiesText", event.target.value)
                      }
                      placeholder={
                        "Breakfast at the hotel\nVisit the Pyramids\nReturn to the hotel"
                      }
                    />
                  </div>
                ))}
              </div>

              <label className="admin-destination-publish-check">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      isPublished: event.target.checked,
                    }))
                  }
                />
                Publish this destination on website
              </label>

              <div className="admin-destination-form-actions">
                <button type="button" className="cancel" onClick={closeModal}>
                  Cancel
                </button>

                <button type="submit" className="save">
                  <FaSave />
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}