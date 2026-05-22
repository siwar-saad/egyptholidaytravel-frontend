import { useEffect, useMemo, useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

const BAD_VALUES = [
  "package",
  "packages",
  "hotel",
  "hotels",
  "booking",
  "bookings",
  "reservation",
  "reservations",
];

const readPath = (obj, path) => {
  if (!obj || !path) return "";
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

const toText = (value) => {
  if (value === null || value === undefined) return "";

  if (Array.isArray(value)) {
    return value.map(toText).filter(Boolean).join(", ");
  }

  if (typeof value === "object") {
    return (
      value.packageName ||
      value.hotelName ||
      value.title ||
      value.name ||
      value.label ||
      value.value ||
      value.countryName ||
      value.country ||
      value.city ||
      ""
    );
  }

  return String(value).trim();
};

const cleanText = (value) => {
  const text = toText(value);

  if (!text) return "";

  const lower = text.toLowerCase();

  if (BAD_VALUES.includes(lower)) return "";

  if (/^[a-f0-9]{24}$/i.test(text)) return "";

  return text;
};

const getValue = (booking, keys, fallback = "-") => {
  for (const key of keys) {
    const value = cleanText(readPath(booking, key));
    if (value) return value;
  }

  return fallback;
};

const getPackageName = (booking) =>
  getValue(
    booking,
    [
      "packageName",
      "packageTitle",
      "selectedPackageName",
      "selectedPackageTitle",

      "package.packageName",
      "package.title",
      "package.name",

      "selectedPackage.packageName",
      "selectedPackage.title",
      "selectedPackage.name",

      "packageData.packageName",
      "packageData.title",
      "packageData.name",

      "trip.packageName",
      "trip.title",
      "trip.name",

      "tripName",
      "tripTitle",
      "tourName",
      "tourTitle",
      "destination",
      "placeName",
      "route",
      "title",
    ],
    "No package name"
  );

const getHotelName = (booking) =>
  getValue(
    booking,
    [
      "hotelName",
      "hotelTitle",
      "selectedHotelName",
      "hotel.hotelName",
      "hotel.title",
      "hotel.name",
      "selectedHotel.hotelName",
      "selectedHotel.title",
      "selectedHotel.name",
      "title",
    ],
    "No hotel name"
  );

const getClientName = (booking) =>
  getValue(
    booking,
    [
      "clientName",
      "customerName",
      "fullName",
      "userName",
      "username",
      "name",
      "client.name",
      "customer.name",
      "user.name",
      "formData.name",
      "bookingData.name",
    ],
    "No client name"
  );

const getEmail = (booking) =>
  getValue(
    booking,
    [
      "email",
      "clientEmail",
      "customerEmail",
      "userEmail",
      "client.email",
      "customer.email",
      "user.email",
      "formData.email",
      "bookingData.email",
    ],
    "No email"
  );

const getPhone = (booking) => {
  const dialCode = getValue(
    booking,
    [
      "dialCode",
      "phoneCode",
      "countryCode",
      "clientDialCode",
      "country.dialCode",
      "country.phoneCode",
      "formData.dialCode",
      "formData.phoneCode",
      "formData.countryCode",
    ],
    ""
  );

  const phone = getValue(
    booking,
    [
      "phone",
      "phoneNumber",
      "whatsapp",
      "whatsappNumber",
      "clientPhone",
      "customerPhone",
      "mobile",
      "formData.phone",
      "formData.phoneNumber",
      "formData.whatsapp",
      "bookingData.phone",
    ],
    ""
  );

  if (dialCode && phone) return `${dialCode} ${phone}`;

  return phone || "No phone";
};

const getCountry = (booking) => {
  const countryValue =
    booking.country ||
    booking.clientCountry ||
    booking.customerCountry ||
    booking.nationality ||
    booking.formData?.country ||
    booking.bookingData?.country;

  if (countryValue && typeof countryValue === "object") {
    const city = cleanText(
      countryValue.city || countryValue.state || countryValue.location
    );

    const country = cleanText(
      countryValue.country ||
        countryValue.countryName ||
        countryValue.name ||
        countryValue.label ||
        countryValue.value
    );

    if (city && country && city !== country) return `${city} / ${country}`;

    return country || city || "No country";
  }

  return cleanText(countryValue) || "No country";
};

const getTravelDate = (booking) =>
  getValue(
    booking,
    [
      "travelDate",
      "date",
      "bookingDate",
      "startDate",
      "arrivalDate",
      "checkIn",
      "formData.travelDate",
      "formData.date",
      "bookingData.travelDate",
    ],
    "-"
  );

const getTravelers = (booking) =>
  getValue(
    booking,
    [
      "travelers",
      "travellers",
      "numberOfTravelers",
      "numberOfTravellers",
      "numberOfGuests",
      "guests",
      "people",
      "persons",
      "adults",
      "pax",
      "formData.travelers",
      "formData.numberOfTravelers",
      "bookingData.travelers",
    ],
    "-"
  );

const getRoom = (booking) =>
  getValue(
    booking,
    [
      "roomType",
      "room",
      "roomName",
      "selectedRoom",
      "selectedRoom.name",
      "selectedRoom.title",
      "formData.roomType",
      "formData.room",
      "bookingData.roomType",
    ],
    "-"
  );

const getNotes = (booking) =>
  getValue(
    booking,
    [
      "notes",
      "note",
      "specialRequest",
      "specialRequests",
      "request",
      "message",
      "details",
      "formData.notes",
      "formData.specialRequests",
      "bookingData.notes",
    ],
    ""
  );

const getStatus = (booking) =>
  cleanText(booking.status || booking.bookingStatus) || "Pending";

const normalizeStatusClass = (status) =>
  status.toLowerCase().replace(/\s+/g, "-");

export default function Reservations({
  bookings,
  reservations,
  setBookings,
  setReservations,
  refreshBookings,
  refreshReservations,
  updateBookingStatus,
}) {
  const [localBookings, setLocalBookings] = useState([]);
  const [reservationTab, setReservationTab] = useState("packages");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const propsBookings = Array.isArray(bookings)
    ? bookings
    : Array.isArray(reservations)
    ? reservations
    : [];

  const allBookings =
    propsBookings.length > 0 ? propsBookings : localBookings;

  const fetchBookings = async () => {
    setLoading(true);

    const endpoints = [
      `${API_URL}/api/bookings`,
      `${API_URL}/api/reservations`,
      `${API_URL}/bookings`,
    ];

    try {
      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint);

          if (!res.ok) continue;

          const data = await res.json();

          const list = Array.isArray(data)
            ? data
            : data.bookings || data.reservations || data.data || [];

          if (Array.isArray(list)) {
            setLocalBookings(list);
            break;
          }
        } catch {
          continue;
        }
      }
    } catch (error) {
      console.error("Fetch reservations error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateReservationsState = (updater) => {
    setLocalBookings(updater);

    if (typeof setBookings === "function") {
      setBookings(updater);
    }

    if (typeof setReservations === "function") {
      setReservations(updater);
    }
  };

  const handleRefresh = async () => {
    if (typeof refreshBookings === "function") {
      await refreshBookings();
      return;
    }

    if (typeof refreshReservations === "function") {
      await refreshReservations();
      return;
    }

    await fetchBookings();
  };

  const isHotelBooking = (booking) =>
    booking.type === "hotel" ||
    cleanText(booking.hotelName) ||
    cleanText(booking.hotelTitle) ||
    cleanText(booking.selectedHotelName) ||
    booking.hotel ||
    booking.selectedHotel;

  const isPackageBooking = (booking) =>
    booking.type === "package" ||
    cleanText(booking.packageName) ||
    cleanText(booking.packageTitle) ||
    cleanText(booking.selectedPackageName) ||
    booking.package ||
    booking.selectedPackage ||
    booking.packageData ||
    booking.trip ||
    booking.tripName ||
    booking.tripTitle ||
    booking.destination ||
    (!isHotelBooking(booking) && booking.type !== "hotel");

  const packageReservations = useMemo(() => {
    return allBookings.filter(isPackageBooking);
  }, [allBookings]);

  const hotelReservations = useMemo(() => {
    return allBookings.filter(isHotelBooking);
  }, [allBookings]);

  const currentReservations =
    reservationTab === "packages" ? packageReservations : hotelReservations;

  const filteredReservations = currentReservations.filter((booking) => {
    const text = [
      getClientName(booking),
      getEmail(booking),
      getPhone(booking),
      getCountry(booking),
      getPackageName(booking),
      getHotelName(booking),
      getTravelDate(booking),
      getTravelers(booking),
      getRoom(booking),
      getStatus(booking),
      getNotes(booking),
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(search.trim().toLowerCase());
  });

  const handleStatusChange = async (booking, newStatus) => {
    const bookingId = booking._id || booking.id;
    const oldStatus = getStatus(booking);

    updateReservationsState((prev) =>
      Array.isArray(prev)
        ? prev.map((item) =>
            (item._id || item.id) === bookingId
              ? { ...item, status: newStatus }
              : item
          )
        : prev
    );

    try {
      if (typeof updateBookingStatus === "function") {
        await updateBookingStatus(bookingId, newStatus);
        return;
      }

      if (!bookingId) return;

      const endpoints = [
        `${API_URL}/api/bookings/${bookingId}/status`,
        `${API_URL}/api/bookings/${bookingId}`,
        `${API_URL}/api/reservations/${bookingId}/status`,
        `${API_URL}/api/reservations/${bookingId}`,
      ];

      let success = false;

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          });

          if (res.ok) {
            success = true;
            break;
          }
        } catch {
          continue;
        }
      }

      if (!success) {
        throw new Error("Status update failed");
      }
    } catch (error) {
      console.error("Update status error:", error);

      updateReservationsState((prev) =>
        Array.isArray(prev)
          ? prev.map((item) =>
              (item._id || item.id) === bookingId
                ? { ...item, status: oldStatus }
                : item
            )
          : prev
      );
    }
  };

  return (
    <section className="admin-section reservations-section">
      <div className="admin-section-head">
        <div>
          <h2>Reservations</h2>
          <p>All hotel and package bookings made by users appear here.</p>
        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="reservation-tabs">
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

      <input
        className="reservation-search"
        type="text"
        placeholder="Search reservations by client, email, phone, hotel, package or date..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredReservations.length === 0 ? (
        <div className="reservation-empty">
          No {reservationTab === "packages" ? "package" : "hotel"} reservations found.
        </div>
      ) : (
        <div className="reservation-table-wrap">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Email</th>
                <th>Phone</th>
                <th>{reservationTab === "packages" ? "Package" : "Hotel"}</th>
                <th>Date</th>
                <th>Travelers</th>
                <th>Country</th>
                <th>Room</th>
                <th>Notes</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredReservations.map((booking, index) => {
                const status = getStatus(booking);

                return (
                  <tr key={booking._id || booking.id || index}>
                    <td>
                      <strong>{getClientName(booking)}</strong>
                    </td>

                    <td>{getEmail(booking)}</td>
                    <td>{getPhone(booking)}</td>

                    <td>
                      <strong>
                        {reservationTab === "packages"
                          ? getPackageName(booking)
                          : getHotelName(booking)}
                      </strong>
                    </td>

                    <td>{getTravelDate(booking)}</td>
                    <td>{getTravelers(booking)}</td>
                    <td>{getCountry(booking)}</td>
                    <td>{getRoom(booking)}</td>

                    <td>
                      {getNotes(booking) ? (
                        <span className="reservation-note">
                          {getNotes(booking)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      <select
                        className={`reservation-status ${normalizeStatusClass(
                          status
                        )}`}
                        value={status}
                        onChange={(e) =>
                          handleStatusChange(booking, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}