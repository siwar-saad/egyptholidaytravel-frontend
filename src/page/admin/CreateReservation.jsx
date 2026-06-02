import { useState } from "react";
import "./CreateReservation.css";

const STORAGE_KEY = "adminCreatedReservations";

function getSavedAdminReservations() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function CreateReservation({ showSuccess }) {
  const getCurrentAdmin = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user") ||
          sessionStorage.getItem("user") ||
          "null"
      );
    } catch {
      return null;
    }
  };

  const admin = getCurrentAdmin();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    type: "hotel",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    packageName: "",
    hotelName: "",
    travelDate: "",
    checkInDate: "",
    checkOutDate: "",
    travelers: 1,
    roomType: "Double Room",
    notes: "",
  });

  const [success, setSuccess] = useState("");
  const [adminReservations, setAdminReservations] = useState(() =>
    getSavedAdminReservations()
  );

  const packages = [
    "Cairo - Hurghada | 6 Nights",
    "Cairo - Alexandria | 4 Nights",
    "Cairo - Luxor - Aswan | 7 Nights",
    "Sharm El Sheikh | 5 Nights",
  ];

  const hotels = [
    "Hilton Cairo",
    "Steigenberger Hotel",
    "Marriott Mena House",
    "Sunrise Arabian Beach Resort",
  ];

  const getNights = () => {
    if (!form.checkInDate || !form.checkOutDate) return 0;

    const checkIn = new Date(form.checkInDate);
    const checkOut = new Date(form.checkOutDate);
    const diff = checkOut - checkIn;
    const nights = diff / (1000 * 60 * 60 * 24);

    return nights > 0 ? nights : 0;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updatedForm = {
        ...prev,
        [name]: value,
      };

      if (name === "type") {
        updatedForm.packageName = "";
        updatedForm.hotelName = "";
        updatedForm.travelDate = "";
        updatedForm.checkInDate = "";
        updatedForm.checkOutDate = "";
      }

      if (name === "checkInDate") {
        updatedForm.checkOutDate = "";
      }

      return updatedForm;
    });
  };

  const resetForm = () => {
    setForm({
      type: "hotel",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      packageName: "",
      hotelName: "",
      travelDate: "",
      checkInDate: "",
      checkOutDate: "",
      travelers: 1,
      roomType: "Double Room",
      notes: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("");

    if (!form.clientName || !form.clientEmail) {
      setSuccess("Please fill client name and client email.");
      return;
    }

    if (form.type === "package") {
      if (!form.packageName || !form.travelDate) {
        setSuccess("Please choose a package and travel date.");
        return;
      }
    }

    if (form.type === "hotel") {
      if (!form.hotelName || !form.checkInDate || !form.checkOutDate) {
        setSuccess("Please choose hotel, check-in and check-out dates.");
        return;
      }

      if (new Date(form.checkOutDate) <= new Date(form.checkInDate)) {
        setSuccess("Check-out date must be after check-in date.");
        return;
      }
    }

    const createdAt = new Date().toISOString();

    const newReservation = {
      id: Date.now(),
      type: form.type,

      clientName: form.clientName,
      clientEmail: form.clientEmail.toLowerCase(),
      clientPhone: form.clientPhone,

      packageName: form.type === "package" ? form.packageName : "",
      hotelName: form.type === "hotel" ? form.hotelName : "",

      travelDate: form.type === "package" ? form.travelDate : form.checkInDate,

      checkInDate: form.type === "hotel" ? form.checkInDate : "",
      checkOutDate: form.type === "hotel" ? form.checkOutDate : "",
      nights: form.type === "hotel" ? getNights() : "",

      travelers: Number(form.travelers) || 1,
      roomType: form.roomType,
      notes: form.notes,

      status: "confirmed",

      createdBy: "admin",
      adminName: admin?.name || admin?.username || "Admin EgyptHoliday",
      adminEmail: admin?.email || "",
      createdAt,
    };

    const oldReservations = getSavedAdminReservations();
    const updatedReservations = [newReservation, ...oldReservations];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReservations));
    setAdminReservations(updatedReservations);

    setSuccess("Reservation created successfully for client.");

    if (showSuccess) {
      showSuccess("Reservation created successfully for client.");
    }

    resetForm();
  };

  return (
    <div className="create-reservation-page">
      <div className="create-reservation-card">
        <div className="create-reservation-header">
          <div>
            <h1>Create Client Reservation</h1>
            <p>
              Add a hotel or package reservation for a client from the admin
              panel.
            </p>
          </div>

          <div className="admin-mini-card">
            <span>Created by</span>
            <strong>
              {admin?.name || admin?.username || "Admin EgyptHoliday"}
            </strong>
          </div>
        </div>

        {success && <div className="reservation-alert">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="reservation-form-grid">
            <div className="form-group">
              <label>Reservation Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="hotel">Hotel</option>
                <option value="package">Package</option>
              </select>
            </div>

            <div className="form-group">
              <label>Client Full Name</label>
              <input
                type="text"
                name="clientName"
                value={form.clientName}
                onChange={handleChange}
                placeholder="Client full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Client Email</label>
              <input
                type="email"
                name="clientEmail"
                value={form.clientEmail}
                onChange={handleChange}
                placeholder="Client account email"
                required
              />
            </div>

            <div className="form-group">
              <label>Client Phone</label>
              <input
                type="text"
                name="clientPhone"
                value={form.clientPhone}
                onChange={handleChange}
                placeholder="Phone / WhatsApp"
              />
            </div>

            {form.type === "package" && (
              <>
                <div className="form-group">
                  <label>Package</label>
                  <select
                    name="packageName"
                    value={form.packageName}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose package</option>
                    {packages.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Travel Date</label>
                  <input
                    type="date"
                    name="travelDate"
                    value={form.travelDate}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </div>
              </>
            )}

            {form.type === "hotel" && (
              <>
                <div className="form-group">
                  <label>Hotel</label>
                  <select
                    name="hotelName"
                    value={form.hotelName}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose hotel</option>
                    {hotels.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={form.checkInDate}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Check-out Date</label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={form.checkOutDate}
                    onChange={handleChange}
                    min={form.checkInDate || today}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nights</label>
                  <input
                    type="text"
                    value={
                      getNights() > 0
                        ? `${getNights()} Night${getNights() > 1 ? "s" : ""}`
                        : "Choose check-in and check-out"
                    }
                    readOnly
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Number of Travelers</label>
              <input
                type="number"
                name="travelers"
                value={form.travelers}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Room Type</label>
              <select
                name="roomType"
                value={form.roomType}
                onChange={handleChange}
              >
                <option value="Single Room">Single Room</option>
                <option value="Double Room">Double Room</option>
                <option value="Triple Room">Triple Room</option>
                <option value="Family Room">Family Room</option>
              </select>
            </div>
          </div>

          <div className="form-group full">
            <label>Special Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Special requests or notes..."
            />
          </div>

          <button type="submit" className="create-reservation-btn">
            Create Reservation
          </button>
        </form>

        <div className="admin-created-history">
          <div className="history-header">
            <div>
              <h2>Admin Created Reservations</h2>
              <p>Reservations created manually by admins for clients.</p>
            </div>

            <span>{adminReservations.length} Reservation(s)</span>
          </div>

          {adminReservations.length === 0 ? (
            <div className="empty-history">
              No admin reservations created yet.
            </div>
          ) : (
            <div className="history-table-wrap">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Type</th>
                    <th>Reservation</th>
                    <th>Travel / Stay</th>
                    <th>Travelers</th>
                    <th>Room</th>
                    <th>Admin</th>
                    <th>Created Date</th>
                    <th>Created Time</th>
                  </tr>
                </thead>

                <tbody>
                  {adminReservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>
                        <strong>{reservation.clientName}</strong>
                        <span>{reservation.clientEmail}</span>
                      </td>

                      <td>
                        <span className={`type-badge ${reservation.type}`}>
                          {reservation.type === "hotel" ? "Hotel" : "Package"}
                        </span>
                      </td>

                      <td>
                        {reservation.type === "hotel"
                          ? reservation.hotelName
                          : reservation.packageName}
                      </td>

                      <td>
                        {reservation.type === "hotel" ? (
                          <>
                            <strong>In:</strong>{" "}
                            {reservation.checkInDate || "-"}
                            <br />
                            <strong>Out:</strong>{" "}
                            {reservation.checkOutDate || "-"}
                            <br />
                            <small>
                              {reservation.nights
                                ? `${reservation.nights} night(s)`
                                : ""}
                            </small>
                          </>
                        ) : (
                          reservation.travelDate || "-"
                        )}
                      </td>

                      <td>{reservation.travelers}</td>
                      <td>{reservation.roomType}</td>
                      <td>{reservation.adminName || "Admin"}</td>
                      <td>{formatDate(reservation.createdAt)}</td>
                      <td>{formatTime(reservation.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}