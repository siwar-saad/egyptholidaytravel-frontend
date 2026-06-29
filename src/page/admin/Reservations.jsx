import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import API from "../../api";

const DESTINATIONS_STORAGE_KEY = "egypt_holiday_destinations";
const DESTINATION_RESERVATIONS_KEY = "egypt_holiday_destination_reservations";

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

  destinationName: "",
  destinationCountry: "",
  destinationLocation: "",

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

const getArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.reservations)) return data.reservations;
  if (Array.isArray(data?.bookings)) return data.bookings;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getCreatedBy = (booking = {}) => {
  const customerInfo = booking.customer_info || booking.customerInfo || {};

  const role =
    booking.createdByRole ||
    booking.created_by_role ||
    booking.creatorRole ||
    booking.creator_role ||
    booking.source ||
    booking.reservationSource ||
    booking.reservation_source ||
    customerInfo.createdByRole ||
    customerInfo.created_by_role ||
    customerInfo.createdBy ||
    customerInfo.created_by ||
    booking.createdBy?.role ||
    booking.created_by?.role ||
    "";

  const name =
    booking.createdByName ||
    booking.created_by_name ||
    booking.adminName ||
    booking.admin_name ||
    customerInfo.adminName ||
    customerInfo.admin_name ||
    customerInfo.createdByName ||
    customerInfo.created_by_name ||
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

  if (
    String(
      booking.createdBy ||
        booking.created_by ||
        customerInfo.createdBy ||
        customerInfo.created_by ||
        ""
    ).toLowerCase() === "admin"
  ) {
    return name ? `Admin - ${name}` : "Admin";
  }

  return "User";
};

const formatCreatedDate = (value) => {
  if (!value || value === "-") return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB");
};

const formatCreatedTime = (value) => {
  if (!value || value === "-") return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStoredDestinations = () => {
  try {
    const saved = localStorage.getItem(DESTINATIONS_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getStoredDestinationReservations = () => {
  try {
    const saved = localStorage.getItem(DESTINATION_RESERVATIONS_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveStoredDestinationReservations = (reservations) => {
  localStorage.setItem(DESTINATION_RESERVATIONS_KEY, JSON.stringify(reservations));
};

const makeLocalId = () => {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `destination-reservation-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
};

export default function Reservations({ showSuccess }) {
  const [reservationTab, setReservationTab] = useState("packages");
  const [reservationSearch, setReservationSearch] = useState("");
  const [bookings, setBookings] = useState([]);

  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const [editMode, setEditMode] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const notify = (message) => {
    if (typeof showSuccess === "function") {
      showSuccess(message);
    } else {
      alert(message);
    }
  };

  const normalizePackageReservation = (booking, index) => {
    const searchParams =
      booking.search_params || booking.searchParams || booking.package || {};
    const customerInfo = booking.customer_info || booking.customerInfo || {};
    const createdAt =
      booking.created_at ||
      booking.createdAt ||
      booking.createdDate ||
      booking.date ||
      "";

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

      route: searchParams.route || booking.route || "",
      duration: searchParams.duration || booking.duration || "",

      totalPrice:
        searchParams.totalPrice ||
        searchParams.total_price ||
        booking.totalPrice ||
        booking.total_price ||
        booking.price ||
        "",

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
      createdDate: formatCreatedDate(createdAt),
      createdTime: formatCreatedTime(createdAt),
    };
  };

  const normalizeHotelReservation = (booking, index) => {
    const selectedHotel =
      booking.selected_hotel || booking.selectedHotel || booking.hotel || {};
    const customerInfo = booking.customer_info || booking.customerInfo || {};
    const createdAt =
      booking.created_at ||
      booking.createdAt ||
      booking.createdDate ||
      booking.date ||
      "";

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
      mealPlan:
        selectedHotel.mealPlan ||
        selectedHotel.meal_plan ||
        selectedHotel.meal ||
        booking.mealPlan ||
        booking.meal_plan ||
        booking.meal ||
        "",

      totalPrice:
        selectedHotel.totalPrice ||
        selectedHotel.total_price ||
        booking.totalPrice ||
        booking.total_price ||
        booking.price ||
        "",

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
      createdDate: formatCreatedDate(createdAt),
      createdTime: formatCreatedTime(createdAt),
    };
  };

  const normalizeDestinationReservation = (booking, index) => {
    const createdAt = booking.createdAt || booking.created_at || "";

    return {
      id: booking.id || `destination-${index}`,
      type: "destination",

      client: booking.fullName || booking.client || "Client",
      email: booking.email || "-",
      phone: booking.phone || "-",

      destinationName:
        booking.destinationName ||
        booking.destination_name ||
        booking.title ||
        "Destination",

      destinationCountry:
        booking.destinationCountry || booking.country || "Egypt",

      destinationLocation:
        booking.destinationLocation || booking.location || "-",

      duration: booking.duration || "",
      date: booking.travelDate || booking.travel_date || booking.date || "-",
      travelers: booking.travelers || "-",
      roomType: booking.roomType || booking.room_type || "-",
      totalPrice: booking.totalPrice || booking.total_price || "",
      status: booking.status || "Pending",
      notes: booking.notes || "",
      createdBy: booking.createdBy || "Admin",
      createdDate: formatCreatedDate(createdAt),
      createdTime: formatCreatedTime(createdAt),
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

      const destinationBookings = getStoredDestinationReservations().map(
        (booking, index) => normalizeDestinationReservation(booking, index)
      );

      setBookings([...packageBookings, ...hotelBookings, ...destinationBookings]);
    } catch (err) {
      console.log("Reservations error:", err.response?.data || err.message);

      const destinationBookings = getStoredDestinationReservations().map(
        (booking, index) => normalizeDestinationReservation(booking, index)
      );

      setBookings(destinationBookings);
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
      setDestinations(getStoredDestinations());
    } catch (err) {
      console.log("Reservation options error:", err.response?.data || err.message);
      setDestinations(getStoredDestinations());
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

  const destinationReservations = useMemo(
    () => bookings.filter((booking) => booking.type === "destination"),
    [bookings]
  );

  const currentReservations =
    reservationTab === "packages"
      ? packageReservations
      : reservationTab === "hotels"
      ? hotelReservations
      : destinationReservations;

  const filteredReservations = currentReservations.filter((booking) =>
    Object.values(booking)
      .join(" ")
      .toLowerCase()
      .includes(reservationSearch.toLowerCase())
  );

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openCreateForm = () => {
    const type =
      reservationTab === "hotels"
        ? "hotel"
        : reservationTab === "destinations"
        ? "destination"
        : "package";

    setEditMode(false);
    setSelectedBooking(null);
    setForm({ ...EMPTY_FORM, type });
    setShowForm(true);
  };

  const openEditForm = (booking) => {
    setEditMode(true);
    setSelectedBooking(booking);

    if (booking.type === "package") {
      setForm({
        ...EMPTY_FORM,
        type: "package",
        packageName: booking.packageName || "",
        route: booking.route || "",
        duration: booking.duration || "",
        travelDate: booking.date !== "-" ? booking.date : "",
        roomType: booking.roomType || "Double Room",
        fullName: booking.client || "",
        email: booking.email !== "-" ? booking.email : "",
        phone: booking.phone !== "-" ? booking.phone : "",
        travelers: booking.travelers !== "-" ? booking.travelers : "",
        notes: booking.notes || "",
        totalPrice: booking.totalPrice || "",
      });
    } else if (booking.type === "hotel") {
      setForm({
        ...EMPTY_FORM,
        type: "hotel",
        hotelName: booking.hotelName || "",
        city: booking.city !== "-" ? booking.city : "",
        mealPlan: booking.mealPlan || "",
        checkIn: booking.checkIn !== "-" ? booking.checkIn : "",
        checkOut: booking.checkOut !== "-" ? booking.checkOut : "",
        roomType: booking.roomType || "Double Room",
        fullName: booking.client || "",
        email: booking.email !== "-" ? booking.email : "",
        phone: booking.phone !== "-" ? booking.phone : "",
        travelers: booking.travelers !== "-" ? booking.travelers : "",
        notes: booking.notes || "",
        totalPrice: booking.totalPrice || "",
      });
    } else {
      setForm({
        ...EMPTY_FORM,
        type: "destination",
        destinationName: booking.destinationName || "",
        destinationCountry: booking.destinationCountry || "Egypt",
        destinationLocation: booking.destinationLocation || "",
        duration: booking.duration || "",
        travelDate: booking.date !== "-" ? booking.date : "",
        roomType: booking.roomType || "Double Room",
        fullName: booking.client || "",
        email: booking.email !== "-" ? booking.email : "",
        phone: booking.phone !== "-" ? booking.phone : "",
        travelers: booking.travelers !== "-" ? booking.travelers : "",
        notes: booking.notes || "",
        totalPrice: booking.totalPrice || "",
      });
    }

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(EMPTY_FORM);
    setSaving(false);
    setEditMode(false);
    setSelectedBooking(null);
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
      mealPlan: selectedHotel.meal || selectedHotel.mealPlan || "",
      totalPrice: selectedHotel.price || "",
    }));
  };

  const chooseDestination = (destinationId) => {
    const selectedDestination = destinations.find(
      (item) => String(item.id) === String(destinationId)
    );

    if (!selectedDestination) return;

    setForm((prev) => ({
      ...prev,
      destinationName:
        selectedDestination.title || selectedDestination.name || "",
      destinationCountry: selectedDestination.country || "Egypt",
      destinationLocation: selectedDestination.location || "",
      duration: selectedDestination.duration || "",
      totalPrice: selectedDestination.price || "",
    }));
  };

  const buildPayload = () => {
    const adminName = getCurrentAdminName();

    return {
      ...form,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),

      createdBy: editMode ? undefined : "admin",
      createdByRole: editMode ? undefined : "admin",
      createdByName: editMode ? undefined : adminName,
      reservationSource: editMode ? undefined : "admin",
      isAdminCreated: editMode ? undefined : true,

      updatedBy: "admin",
      updatedByRole: "admin",
      updatedByName: adminName,
      updatedAt: new Date().toISOString(),
    };
  };

  const buildDestinationPayload = () => {
    const adminName = getCurrentAdminName();

    return {
      id: editMode && selectedBooking ? selectedBooking.id : makeLocalId(),
      type: "destination",
      destinationName: form.destinationName.trim(),
      destinationCountry: form.destinationCountry.trim() || "Egypt",
      destinationLocation: form.destinationLocation.trim(),
      duration: form.duration.trim(),
      travelDate: form.travelDate,
      roomType: form.roomType,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      travelers: form.travelers,
      notes: form.notes,
      totalPrice: form.totalPrice,
      status: selectedBooking?.status || "Pending",
      createdBy:
        editMode && selectedBooking
          ? selectedBooking.createdBy
          : `Admin - ${adminName}`,
      createdAt:
        editMode && selectedBooking?.createdDate !== "-"
          ? selectedBooking.createdAt || new Date().toISOString()
          : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const validateForm = () => {
    const isHotel = form.type === "hotel";
    const isDestination = form.type === "destination";

    if (!form.fullName.trim() || !form.email.trim()) {
      notify("Client name and email are required.");
      return false;
    }

    if (isHotel && !form.hotelName.trim()) {
      notify("Hotel name is required.");
      return false;
    }

    if (isDestination && !form.destinationName.trim()) {
      notify("Destination name is required.");
      return false;
    }

    if (!isHotel && !isDestination && !form.packageName.trim()) {
      notify("Package name is required.");
      return false;
    }

    return true;
  };

  const createDestinationReservation = () => {
    const payload = buildDestinationPayload();
    const saved = getStoredDestinationReservations();

    saveStoredDestinationReservations([payload, ...saved]);

    notify("Destination reservation created successfully.");
    closeForm();
    fetchReservations();
  };

  const editDestinationReservation = () => {
    if (!selectedBooking) return;

    const payload = buildDestinationPayload();
    const saved = getStoredDestinationReservations();

    const nextList = saved.map((item) =>
      String(item.id) === String(selectedBooking.id) ? payload : item
    );

    saveStoredDestinationReservations(nextList);

    notify("Destination reservation updated successfully.");
    closeForm();
    fetchReservations();
  };

  const createReservation = async () => {
    if (saving) return;
    if (!validateForm()) return;

    const isHotel = form.type === "hotel";
    const isDestination = form.type === "destination";

    if (isDestination) {
      createDestinationReservation();
      return;
    }

    const payload = buildPayload();

    try {
      setSaving(true);

      if (isHotel) {
        await API.post("/admin/hotels/reservations", payload);
      } else {
        await API.post("/admin/reservations", payload);
      }

      notify("Reservation created successfully.");
      closeForm();
      fetchReservations();
    } catch (err) {
      notify(err.response?.data?.error || "Unable to create reservation.");
    } finally {
      setSaving(false);
    }
  };

  const editReservation = async () => {
    if (saving) return;
    if (!selectedBooking) return;
    if (!validateForm()) return;

    if (selectedBooking.type === "destination") {
      editDestinationReservation();
      return;
    }

    const payload = buildPayload();

    const endpoint =
      selectedBooking.type === "hotel"
        ? `/admin/hotels/reservations/${selectedBooking.id}`
        : `/admin/reservations/${selectedBooking.id}`;

    try {
      setSaving(true);

      await API.put(endpoint, payload);

      notify("Reservation updated successfully.");
      closeForm();
      fetchReservations();
    } catch (err) {
      notify(err.response?.data?.error || "Unable to update reservation.");
    } finally {
      setSaving(false);
    }
  };

  const saveReservation = () => {
    if (editMode) {
      editReservation();
    } else {
      createReservation();
    }
  };

  const updateDestinationReservationStatus = (booking, status) => {
    const saved = getStoredDestinationReservations();

    const nextList = saved.map((item) =>
      String(item.id) === String(booking.id) ? { ...item, status } : item
    );

    saveStoredDestinationReservations(nextList);

    setBookings((prev) =>
      prev.map((item) =>
        item.id === booking.id && item.type === "destination"
          ? { ...item, status }
          : item
      )
    );

    notify("Destination reservation status updated.");
  };

  const updateReservationStatus = async (booking, status) => {
    if (booking.type === "destination") {
      updateDestinationReservationStatus(booking, status);
      return;
    }

    const endpoint =
      booking.type === "hotel"
        ? `/admin/hotels/reservations/${booking.id}/status`
        : `/admin/reservations/${booking.id}/status`;

    try {
      const res = await API.put(endpoint, { status });

      setBookings((prev) =>
        prev.map((item) =>
          item.id === booking.id && item.type === booking.type
            ? { ...item, status }
            : item
        )
      );

      const emailSent = res.data?.emailSent === true;
      const emailWarning = res.data?.emailWarning;

      notify(
        emailSent
          ? "Reservation status updated and email sent to the client."
          : emailWarning
          ? `Status updated, but email was not sent: ${emailWarning}`
          : "Reservation status updated."
      );
    } catch (err) {
      notify(err.response?.data?.error || "Unable to update status.");
    }
  };

  const getMainColumnTitle = () => {
    if (reservationTab === "packages") return "Package";
    if (reservationTab === "hotels") return "Hotel";
    return "Destination";
  };

  const getDateColumnTitle = () => {
    if (reservationTab === "hotels") return "Check In";
    return "Date";
  };

  const getBookingMainName = (booking) => {
    if (booking.type === "package") return booking.packageName;
    if (booking.type === "hotel") return booking.hotelName;
    return booking.destinationName;
  };

  const getBookingDate = (booking) => {
    if (booking.type === "hotel") return booking.checkIn;
    return booking.date;
  };

  return (
    <>
      <section className="admin-panel">
        <div className="panel-head">
          <div>
            <h2>Reservations</h2>
            <p>
              Admin can create and edit hotel, package and destination bookings
              manually.
            </p>
          </div>

          <div className="panel-actions">
            <button type="button" onClick={openCreateForm}>
              <FaPlus /> Add Booking
            </button>

            <button type="button" onClick={fetchReservations}>
              Refresh
            </button>
          </div>
        </div>

        <div className="reservation-switcher reservation-switcher-three">
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

          <button
            type="button"
            className={reservationTab === "destinations" ? "active" : ""}
            onClick={() => setReservationTab("destinations")}
          >
            Destinations Reservations ({destinationReservations.length})
          </button>
        </div>

        <div className="client-tools">
          <input
            type="text"
            placeholder="Search reservations by client, email, phone, hotel, package, destination, created by or date..."
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
                  <th>{getMainColumnTitle()}</th>
                  <th>{getDateColumnTitle()}</th>
                  {reservationTab === "hotels" && <th>Check Out</th>}
                  <th>Travelers</th>
                  <th>Room</th>
                  <th>Created By</th>
                  <th>Created Date</th>
                  <th>Created Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredReservations.map((booking) => (
                  <tr key={`${booking.type}-${booking.id}`}>
                    <td>{booking.client}</td>
                    <td>{booking.email}</td>
                    <td>{booking.phone}</td>

                    <td>{getBookingMainName(booking)}</td>

                    <td>{getBookingDate(booking)}</td>

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

                    <td>{booking.createdDate || "-"}</td>
                    <td>{booking.createdTime || "-"}</td>

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

                    <td>
                      <button
                        type="button"
                        className="edit-reservation-btn"
                        onClick={() => openEditForm(booking)}
                      >
                        <FaEdit /> Edit
                      </button>
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
                <h2>{editMode ? "Edit Booking" : "Add Booking"}</h2>
                <p>
                  {editMode
                    ? "Update package, hotel or destination reservation information."
                    : "Create a manual package, hotel or destination reservation."}
                </p>
              </div>

              <button
                type="button"
                className="close-package-popup"
                onClick={closeForm}
              >
                ×
              </button>
            </div>

            <div className="package-popup-form">
              <select
                value={form.type}
                disabled={editMode}
                onChange={(e) =>
                  setForm({ ...EMPTY_FORM, type: e.target.value })
                }
              >
                <option value="package">Package Booking</option>
                <option value="hotel">Hotel Booking</option>
                <option value="destination">Destination Booking</option>
              </select>

              {form.type === "package" && (
                <>
                  {!editMode && (
                    <select onChange={(e) => choosePackage(e.target.value)}>
                      <option value="">Choose existing package</option>
                      {packages.map((item) => (
                        <option value={item.id} key={item.id}>
                          {item.name || item.title}
                        </option>
                      ))}
                    </select>
                  )}

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
              )}

              {form.type === "hotel" && (
                <>
                  {!editMode && (
                    <select onChange={(e) => chooseHotel(e.target.value)}>
                      <option value="">Choose existing hotel</option>
                      {hotels.map((item) => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  )}

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

              {form.type === "destination" && (
                <>
                  {!editMode && (
                    <select onChange={(e) => chooseDestination(e.target.value)}>
                      <option value="">Choose existing destination</option>
                      {destinations.map((item) => (
                        <option value={item.id} key={item.id}>
                          {item.title || item.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <input
                    type="text"
                    placeholder="Destination Name"
                    value={form.destinationName}
                    onChange={(e) =>
                      updateForm("destinationName", e.target.value)
                    }
                  />

                  <input
                    type="text"
                    placeholder="Country"
                    value={form.destinationCountry}
                    onChange={(e) =>
                      updateForm("destinationCountry", e.target.value)
                    }
                  />

                  <input
                    type="text"
                    placeholder="Location"
                    value={form.destinationLocation}
                    onChange={(e) =>
                      updateForm("destinationLocation", e.target.value)
                    }
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
                <button type="button" onClick={saveReservation} disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editMode
                    ? "Save Changes"
                    : "Save Booking"}
                </button>

                <button
                  type="button"
                  className="cancel-package-btn"
                  onClick={closeForm}
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