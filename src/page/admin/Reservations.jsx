import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import API from "../../api";

const EMPTY_FORM = {
  type: "package",
  packageName: "",
  route: "",
  duration: "",
  travelDate: "",
  hotelName: "",
  city: "",
  mealPlan: "",
  checkIn: "",
  checkOut: "",
  roomType: "Double Room",
  fullName: "",
  email: "",
  phone: "",
  travelers: "",
  notes: "",
  totalPrice: "",
};

const getCurrentAdminName = () => {
  try {
    const user =
      JSON.parse(localStorage.getItem("user") || "null") ||
      JSON.parse(sessionStorage.getItem("user") || "null");

    return (
      user?.name ||
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
      user?.email ||
      "Admin"
    );
  } catch {
    return "Admin";
  }
};

const getCreatedBy = (booking = {}) => {
  const role =
    booking.createdByRole ||
    booking.created_by_role ||
    booking.creatorRole ||
    booking.creator_role ||
    booking.source ||
    booking.reservationSource ||
    booking.reservation_source ||
    booking.createdBy?.role ||
    booking.created_by?.role ||
    "";

  const name =
    booking.createdByName ||
    booking.created_by_name ||
    booking.adminName ||
    booking.admin_name ||
    booking.creatorName ||
    booking.creator_name ||
    booking.createdBy?.name ||
    booking.created_by?.name ||
    booking.admin?.name ||
    "";

  const cleanRole = String(role).toLowerCase();

  if (
    cleanRole.includes("admin") ||
    booking.isAdminCreated ||
    booking.is_admin_created ||
    booking.created_by_admin
  ) {
    return name ? `Admin - ${name}` : "Admin";
  }

  if (String(booking.createdBy || booking.created_by || "").toLowerCase() === "admin") {
    return name ? `Admin - ${name}` : "Admin";
  }

  return "User";
};

export default function Reservations({ showSuccess }) {
  const [reservationTab, setReservationTab] = useState("packages");
  const [reservationSearch, setReservationSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const notify = (message) => {
    if (typeof showSuccess === "function") showSuccess(message);
  };

  const getArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.reservations)) return data.reservations;
    if (Array.isArray(data?.bookings)) return data.bookings;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const normalizePackageReservation = (booking, index) => {
    const searchParams =
      booking.search_params || booking.searchParams || booking.package || {};
    const customerInfo = booking.customer_info || booking.customerInfo || {};

    return {
      id: booking.id || booking._id || `package-${index}`,
      type: "package",
      client:
        customerInfo.fullName ||
        customerInfo.full_name ||
        customerInfo.name ||
        booking.fullName ||
        booking.full_name ||
        booking.client ||
        "Client",
      email: customerInfo.email || booking.email || "-",
      phone: customerInfo.phone || booking.phone || "-",
      packageName:
        searchParams.name ||
        searchParams.backendName ||
        searchParams.route ||
        booking.packageName ||
        booking.package_name ||
        "Package",
      date:
        searchParams.travelDate ||
        searchParams.travel_date ||
        booking.travelDate ||
        booking.travel_date ||
        booking.date ||
        "-",
      travelers: customerInfo.travelers || booking.travelers || "-",
      roomType: searchParams.roomType || booking.roomType || booking.room_type || "-",
      status: booking.status || "Pending",
      notes: customerInfo.notes || booking.notes || "",
      createdBy: getCreatedBy(booking),
    };
  };

  const normalizeHotelReservation = (booking, index) => {
    const selectedHotel =
      booking.selected_hotel || booking.selectedHotel || booking.hotel || {};
    const customerInfo = booking.customer_info || booking.customerInfo || {};

    return {
      id: booking.id || booking._id || `hotel-${index}`,
      type: "hotel",
      client:
        customerInfo.fullName ||
        customerInfo.full_name ||
        customerInfo.name ||
        booking.fullName ||
        booking.full_name ||
        booking.client ||
        "Client",
      email: customerInfo.email || booking.email || "-",
      phone: customerInfo.phone || booking.phone || "-",
      hotelName:
        selectedHotel.name ||
        booking.hotelName ||
        booking.hotel_name ||
        "Hotel",
      city: selectedHotel.city || booking.city || "-",
      roomType:
        selectedHotel.roomType ||
        selectedHotel.room_type ||
        booking.roomType ||
        booking.room_type ||
        "-",
      checkIn:
        selectedHotel.checkIn ||
        selectedHotel.check_in ||
        booking.checkIn ||
        booking.check_in ||
        "-",
      checkOut:
        selectedHotel.checkOut ||
        selectedHotel.check_out ||
        booking.checkOut ||
        booking.check_out ||
        "-",
      travelers: customerInfo.travelers || booking.travelers || "-",
      status: booking.status || "Pending",
      notes: customerInfo.notes || booking.notes || "",
      createdBy: getCreatedBy(booking),
    };
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);

      const [packageRes, hotelRes] = await Promise.all([
        API.get("/admin/reservations"),
        API.get("/admin/hotels/reservations"),
      ]);

      const packageBookings = getArray(packageRes.data).map((booking, index) =>
        normalizePackageReservation(booking, index)
      );

      const hotelBookings = getArray(hotelRes.data).map((booking, index) =>
        normalizeHotelReservation(booking, index)
      );

      setBookings([...packageBookings, ...hotelBookings]);
    } catch (err) {
      console.log("Reservations error:", err.response?.data || err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [packageRes, hotelRes] = await Promise.all([
        API.get("/admin/packages"),
        API.get("/hotels"),
      ]);

      setPackages(getArray(packageRes.data));
      setHotels(getArray(hotelRes.data));
    } catch (err) {
      console.log("Reservation options error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchOptions();
  }, []);

  const packageReservations = useMemo(
    () => bookings.filter((booking) => booking.type === "package"),
    [bookings]
  );

  const hotelReservations = useMemo(
    () => bookings.filter((booking) => booking.type === "hotel"),
    [bookings]
  );

  const currentReservations =
    reservationTab === "packages" ? packageReservations : hotelReservations;

  const filteredReservations = currentReservations.filter((booking) =>
    Object.values(booking)
      .join(" ")
      .toLowerCase()
      .includes(reservationSearch.toLowerCase())
  );

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openCreateForm = (
    type = reservationTab === "hotels" ? "hotel" : "package"
  ) => {
    setForm({ ...EMPTY_FORM, type });
    setShowForm(true);
  };

  const closeCreateForm = () => {
    setShowForm(false);
    setForm(EMPTY_FORM);
    setSaving(false);
  };

  const choosePackage = (packageId) => {
    const selectedPackage = packages.find(
      (item) => String(item.id) === String(packageId)
    );

    if (!selectedPackage) return;

    setForm((prev) => ({
      ...prev,
      packageName: selectedPackage.name || selectedPackage.title || "",
      route: selectedPackage.route || "",
      duration: selectedPackage.duration || "",
      totalPrice: selectedPackage.price || "",
    }));
  };

  const chooseHotel = (hotelId) => {
    const selectedHotel = hotels.find(
      (item) => String(item.id) === String(hotelId)
    );

    if (!selectedHotel) return;

    setForm((prev) => ({
      ...prev,
      hotelName: selectedHotel.name || "",
      city: selectedHotel.city || "",
      mealPlan: selectedHotel.meal || "",
      totalPrice: selectedHotel.price || "",
    }));
  };

  const createReservation = async () => {
    if (saving) return;

    const isHotel = form.type === "hotel";

    if (!form.fullName.trim() || !form.email.trim()) {
      notify("Client name and email are required.");
      return;
    }

    if (isHotel && !form.hotelName.trim()) {
      notify("Hotel name is required.");
      return;
    }

    if (!isHotel && !form.packageName.trim()) {
      notify("Package name is required.");
      return;
    }

    const adminName = getCurrentAdminName();

    const payload = {
      ...form,
      createdBy: "admin",
      createdByRole: "admin",
      createdByName: adminName,
      reservationSource: "admin",
      isAdminCreated: true,
    };

    try {
      setSaving(true);

      if (isHotel) {
        await API.post("/admin/hotels/reservations", payload);
      } else {
        await API.post("/admin/reservations", payload);
      }

      notify("Reservation created successfully.");
      closeCreateForm();
      fetchReservations();
    } catch (err) {
      notify(err.response?.data?.error || "Unable to create reservation.");
    } finally {
      setSaving(false);
    }
  };

  const updateReservationStatus = async (booking, status) => {
    const endpoint =
      booking.type === "hotel"
        ? `/admin/hotels/reservations/${booking.id}/status`
        : `/admin/reservations/${booking.id}/status`;

    try {
      await API.put(endpoint, { status });

      setBookings((prev) =>
        prev.map((item) =>
          item.id === booking.id && item.type === booking.type
            ? { ...item, status }
            : item
        )
      );

      notify("Reservation status updated.");
    } catch (err) {
      notify(err.response?.data?.error || "Unable to update status.");
    }
  };

  return (
    <>
      <section className="admin-panel">
        <div className="panel-head">
          <div>
            <h2>Reservations</h2>
            <p>Admin can create hotel and package bookings manually.</p>
          </div>

          <div className="panel-actions">
            <button type="button" onClick={() => openCreateForm()}>
              <FaPlus /> Add Booking
            </button>

            <button type="button" onClick={fetchReservations}>
              Refresh
            </button>
          </div>
        </div>

        <div className="reservation-switcher">
          <button
            type="button"
            className={reservationTab === "packages" ? "active" : ""}
            onClick={() => setReservationTab("packages")}
          >
            Packages Reservations ({packageReservations.length})
          </button>

          <button
            type="button"
            className={reservationTab === "hotels" ? "active" : ""}
            onClick={() => setReservationTab("hotels")}
          >
            Hotels Reservations ({hotelReservations.length})
          </button>
        </div>

        <div className="client-tools">
          <input
            type="text"
            placeholder="Search reservations by client, email, phone, hotel, package, created by or date..."
            value={reservationSearch}
            onChange={(e) => setReservationSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="empty-msg">Loading reservations...</p>
        ) : filteredReservations.length === 0 ? (
          <p className="empty-msg">No reservations found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>{reservationTab === "packages" ? "Package" : "Hotel"}</th>
                  <th>{reservationTab === "packages" ? "Date" : "Check In"}</th>
                  {reservationTab === "hotels" && <th>Check Out</th>}
                  <th>Travelers</th>
                  <th>Room</th>
                  <th>Created By</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredReservations.map((booking) => (
                  <tr key={`${booking.type}-${booking.id}`}>
                    <td>{booking.client}</td>
                    <td>{booking.email}</td>
                    <td>{booking.phone}</td>

                    <td>
                      {booking.type === "package"
                        ? booking.packageName
                        : booking.hotelName}
                    </td>

                    <td>
                      {booking.type === "package"
                        ? booking.date
                        : booking.checkIn}
                    </td>

                    {reservationTab === "hotels" && <td>{booking.checkOut}</td>}

                    <td>{booking.travelers}</td>
                    <td>{booking.roomType || "-"}</td>

                    <td>
                      <span
                        className={
                          booking.createdBy?.toLowerCase().includes("admin")
                            ? "created-by-badge admin"
                            : "created-by-badge user"
                        }
                      >
                        {booking.createdBy}
                      </span>
                    </td>

                    <td>
                      <select
                        className={`status-select ${
                          booking.status === "Confirmed"
                            ? "confirmed"
                            : booking.status === "Cancelled"
                            ? "cancelled"
                            : "pending"
                        }`}
                        value={booking.status || "Pending"}
                        onChange={(e) =>
                          updateReservationStatus(booking, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showForm && (
        <div className="package-popup-overlay">
          <div className="package-popup">
            <div className="package-popup-head">
              <div>
                <h2>Add Booking</h2>
                <p>Create a manual package or hotel reservation.</p>
              </div>

              <button
                type="button"
                className="close-package-popup"
                onClick={closeCreateForm}
              >
                ×
              </button>
            </div>

            <div className="package-popup-form">
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...EMPTY_FORM, type: e.target.value })
                }
              >
                <option value="package">Package Booking</option>
                <option value="hotel">Hotel Booking</option>
              </select>

              {form.type === "package" ? (
                <>
                  <select onChange={(e) => choosePackage(e.target.value)}>
                    <option value="">Choose existing package</option>
                    {packages.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name || item.title}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Package Name"
                    value={form.packageName}
                    onChange={(e) => updateForm("packageName", e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Route"
                    value={form.route}
                    onChange={(e) => updateForm("route", e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Duration"
                    value={form.duration}
                    onChange={(e) => updateForm("duration", e.target.value)}
                  />

                  <input
                    type="date"
                    value={form.travelDate}
                    onChange={(e) => updateForm("travelDate", e.target.value)}
                  />
                </>
              ) : (
                <>
                  <select onChange={(e) => chooseHotel(e.target.value)}>
                    <option value="">Choose existing hotel</option>
                    {hotels.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Hotel Name"
                    value={form.hotelName}
                    onChange={(e) => updateForm("hotelName", e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => updateForm("city", e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Meal Plan"
                    value={form.mealPlan}
                    onChange={(e) => updateForm("mealPlan", e.target.value)}
                  />

                  <input
                    type="date"
                    value={form.checkIn}
                    onChange={(e) => updateForm("checkIn", e.target.value)}
                  />

                  <input
                    type="date"
                    value={form.checkOut}
                    onChange={(e) => updateForm("checkOut", e.target.value)}
                  />
                </>
              )}

              <select
                value={form.roomType}
                onChange={(e) => updateForm("roomType", e.target.value)}
              >
                <option>Single Room</option>
                <option>Double Room</option>
                <option>Triple Room</option>
                <option>Family Room</option>
                <option>Suite</option>
              </select>

              <input
                type="text"
                placeholder="Client Full Name"
                value={form.fullName}
                onChange={(e) => updateForm("fullName", e.target.value)}
              />

              <input
                type="email"
                placeholder="Client Email"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
              />

              <input
                type="text"
                placeholder="Client Phone"
                value={form.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
              />

              <input
                type="number"
                min="1"
                placeholder="Travelers"
                value={form.travelers}
                onChange={(e) => updateForm("travelers", e.target.value)}
              />

              <input
                type="number"
                min="0"
                placeholder="Total Price"
                value={form.totalPrice}
                onChange={(e) => updateForm("totalPrice", e.target.value)}
              />

              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => updateForm("notes", e.target.value)}
              />

              <div className="package-popup-actions">
                <button type="button" onClick={createReservation} disabled={saving}>
                  {saving ? "Saving..." : "Save Booking"}
                </button>

                <button
                  type="button"
                  className="cancel-package-btn"
                  onClick={closeCreateForm}
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