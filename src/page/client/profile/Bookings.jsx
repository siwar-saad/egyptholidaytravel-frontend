import { useState } from "react";

const badTitles = [
  "package",
  "packages",
  "hotel",
  "hotels",
  "destination",
  "destinations",
  "booking",
  "reservation",
];

const getByPath = (obj, path) => {
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
      value.destinationName ||
      value.packageName ||
      value.hotelName ||
      value.title ||
      value.name ||
      value.label ||
      value.value ||
      value.country ||
      ""
    );
  }

  return String(value).trim();
};

const getValue = (booking, keys, fallback = "") => {
  for (const key of keys) {
    const value = getByPath(booking, key);
    const text = toText(value);

    if (text && !badTitles.includes(text.toLowerCase())) {
      return text;
    }
  }

  return fallback;
};

const InfoItem = ({ label, value }) => (
  <div className="booking-info-item">
    <span>{label}</span>
    <strong>{value || "-"}</strong>
  </div>
);

const PHONE_COUNTRIES = [
  { name: "France", dialCode: "+33" },
  { name: "Germany", dialCode: "+49" },
  { name: "Luxembourg", dialCode: "+352" },
  { name: "Turkey", dialCode: "+90" },
  { name: "Tunisia", dialCode: "+216" },
  { name: "Morocco", dialCode: "+212" },
  { name: "Bosnia", dialCode: "+387" },
  { name: "Egypt", dialCode: "+20" },
];

const ROOM_LABELS = {
  SGL: "Single Room",
  SINGLE: "Single Room",
  "SINGLE ROOM": "Single Room",
  DBL: "Double Room",
  DOUBLE: "Double Room",
  "DOUBLE ROOM": "Double Room",
  TPL: "Triple Room",
  TRIPLE: "Triple Room",
  "TRIPLE ROOM": "Triple Room",
};

const getCountryFromPhone = (phone = "") => {
  const cleanPhone = String(phone).trim();

  const country = PHONE_COUNTRIES.find((item) =>
    cleanPhone.startsWith(item.dialCode)
  );

  return country?.name || "";
};

const getRoomLabel = (room = "") => {
  const cleanRoom = String(room).trim();
  return ROOM_LABELS[cleanRoom.toUpperCase()] || cleanRoom;
};

const normalizeDestinationReservation = (booking, index) => {
  const searchParams = booking.search_params || booking.searchParams || {};
  const customerInfo = booking.customer_info || booking.customerInfo || {};

  return {
    ...booking,
    id: booking.id || `destination-${index}`,
    type: "destination",
    destinationName:
      searchParams.name || searchParams.destinationName ||
      booking.destinationName || booking.destination_name ||
      booking.title || booking.name || "Destination Reservation",
    destinationCountry:
      searchParams.country || booking.destinationCountry ||
      booking.destination_country || booking.country || "Egypt",
    destinationLocation:
      searchParams.location || searchParams.route ||
      booking.destinationLocation || booking.destination_location ||
      booking.location || "",
    duration:
      searchParams.duration || booking.duration ||
      booking.destinationDuration || "",
    travelDate:
      searchParams.travelDate || searchParams.travel_date ||
      booking.travelDate || booking.travel_date ||
      booking.destinationTravelDate || booking.date || "",
    fullName:
      customerInfo.fullName || customerInfo.full_name ||
      booking.fullName || booking.client || booking.clientName || "",
    email: customerInfo.email || booking.email || booking.clientEmail || "",
    phone: customerInfo.phone || booking.phone || booking.clientPhone || "",
    travelers: customerInfo.travelers || booking.travelers || "",
    roomType:
      searchParams.roomType || searchParams.room_type ||
      booking.roomType || booking.room_type || "",
    notes: customerInfo.notes || booking.notes || "",
    status: booking.status || "Pending",
  };
};

export default function Bookings({
  bookings = [],
  bookingTab = "packages",
  setBookingTab = () => {},
}) {
  const [bookingSearch, setBookingSearch] = useState("");

  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const getBookingTitle = (booking) => {
    if (bookingTab === "hotels" || booking.type === "hotel") {
      return getValue(
        booking,
        [
          "hotelName",
          "hotelTitle",
          "selectedHotelName",
          "hotel.name",
          "hotel.title",
          "selectedHotel.name",
          "selectedHotel.title",
        ],
        "Hotel Reservation"
      );
    }

    if (bookingTab === "destinations" || booking.type === "destination") {
      return getValue(
        booking,
        [
          "destinationName",
          "destinationTitle",
          "destination.name",
          "destination.title",
          "selectedDestination.name",
          "selectedDestination.title",
          "placeName",
          "tourName",
          "title",
          "name",
        ],
        "Destination Reservation"
      );
    }

    return getValue(
      booking,
      [
        "packageName",
        "packageTitle",
        "selectedPackageName",
        "selectedPackageTitle",
        "package.name",
        "package.title",
        "package.packageName",
        "selectedPackage.name",
        "selectedPackage.title",
        "selectedPackage.packageName",
        "search_params.name",
        "search_params.backendName",
        "search_params.backend_name",
        "search_params.route",
        "searchParams.name",
        "searchParams.backendName",
        "searchParams.route",
        "packageData.name",
        "packageData.title",
        "packageData.packageName",
        "tripName",
        "tripTitle",
        "trip.name",
        "trip.title",
        "route",
        "tourName",
        "tourTitle",
      ],
      "Package Reservation"
    );
  };

  const getClientName = (booking) =>
    getValue(
      booking,
      [
        "clientName",
        "customerName",
        "fullName",
        "userName",
        "client.name",
        "customer.name",
        "customer_info.fullName",
        "customer_info.full_name",
        "customer_info.name",
        "customerInfo.fullName",
        "customerInfo.name",
        "user.name",
        "formData.name",
        "name",
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
        "customer_info.email",
        "customerInfo.email",
        "user.email",
        "formData.email",
      ],
      "No email"
    );

  const getPhone = (booking) => {
    const dialCode = getValue(booking, [
      "dialCode",
      "phoneCode",
      "countryCode",
      "country.dialCode",
      "country.phoneCode",
      "formData.dialCode",
      "formData.phoneCode",
    ]);

    const phone = getValue(booking, [
      "phone",
      "phoneNumber",
      "whatsapp",
      "whatsappNumber",
      "clientPhone",
      "customerPhone",
      "customer_info.phone",
      "customerInfo.phone",
      "mobile",
      "formData.phone",
      "formData.phoneNumber",
    ]);

    if (dialCode && phone) return `${dialCode} ${phone}`;
    return phone || "No phone";
  };

  const getCountry = (booking) => {
    const countryValue =
      booking.destinationCountry ||
      booking.destination_country ||
      booking.country ||
      booking.clientCountry ||
      booking.customerCountry ||
      booking.nationality ||
      booking.customer_info?.country ||
      booking.customerInfo?.country ||
      booking.search_params?.country ||
      booking.searchParams?.country ||
      booking.formData?.country;

    if (countryValue && typeof countryValue === "object") {
      const city = countryValue.city || countryValue.state || "";
      const country =
        countryValue.country ||
        countryValue.countryName ||
        countryValue.name ||
        countryValue.label ||
        countryValue.value ||
        "";

      if (city && country && city !== country) return `${city} / ${country}`;
      return country || city || "No country";
    }

    return toText(countryValue) || getCountryFromPhone(getPhone(booking)) || "No country";
  };

  const getLocation = (booking) =>
    getValue(
      booking,
      [
        "destinationLocation",
        "destination_location",
        "location",
        "city",
        "destination.location",
        "selectedDestination.location",
      ],
      ""
    );

  const getDuration = (booking) =>
    getValue(
      booking,
      [
        "duration",
        "destinationDuration",
        "destination_duration",
        "package.duration",
        "selectedPackage.duration",
        "search_params.duration",
        "searchParams.duration",
      ],
      ""
    );

  const getTravelDate = (booking) =>
    getValue(
      booking,
      [
        "travelDate",
        "travel_date",
        "destinationTravelDate",
        "date",
        "bookingDate",
        "startDate",
        "arrivalDate",
        "checkIn",
        "formData.travelDate",
        "customer_info.travelDate",
        "customerInfo.travelDate",
        "search_params.travelDate",
        "search_params.travel_date",
        "searchParams.travelDate",
        "searchParams.date",
        "formData.date",
      ],
      "No date"
    );

  const getTravelers = (booking) =>
    getValue(
      booking,
      [
        "travelers",
        "travellers",
        "numberOfTravelers",
        "numberOfTravellers",
        "guests",
        "people",
        "persons",
        "numberOfGuests",
        "formData.travelers",
        "customer_info.travelers",
        "customerInfo.travelers",
      ],
      "No travelers"
    );

  const getRoom = (booking) =>
    getRoomLabel(
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
          "search_params.roomType",
          "search_params.room_type",
          "searchParams.roomType",
          "selected_hotel.roomType",
          "selected_hotel.room_type",
          "selectedHotel.roomType",
          "formData.room",
        ],
        "No room"
      )
    );

  const getNotes = (booking) =>
    getValue(booking, [
      "notes",
      "note",
      "specialRequest",
      "specialRequests",
      "request",
      "message",
      "details",
      "formData.notes",
      "customer_info.notes",
      "customerInfo.notes",
    ]);

  const getStatus = (booking) =>
    toText(booking.status || booking.bookingStatus) || "Pending";

  const packageBookings = safeBookings.filter((booking) => {
    if (booking.type === "destination") return false;
    if (booking.type === "hotel") return false;

    return (
      booking.type === "package" ||
      booking.packageName ||
      booking.packageTitle ||
      booking.selectedPackageName ||
      booking.package ||
      booking.selectedPackage ||
      booking.packageData ||
      booking.trip ||
      (!booking.hotelName && !booking.destinationName)
    );
  });

  const hotelBookings = safeBookings.filter(
    (booking) =>
      booking.type === "hotel" ||
      booking.hotelName ||
      booking.hotelTitle ||
      booking.selectedHotelName ||
      booking.hotel ||
      booking.selectedHotel
  );

  const destinationBookings = safeBookings
    .filter(
      (booking) =>
        booking.type === "destination" ||
        booking.booking_type === "destination"
    )
    .map(normalizeDestinationReservation);

  const getSearchContent = (booking) =>
    [
      getBookingTitle(booking),
      getClientName(booking),
      getEmail(booking),
      getCountry(booking),
      getLocation(booking),
      getDuration(booking),
      getPhone(booking),
      getTravelDate(booking),
      getTravelers(booking),
      getRoom(booking),
      getNotes(booking),
      getStatus(booking),
    ]
      .join(" ")
      .toLowerCase();

  const filterBookings = (items) => {
    const search = bookingSearch.trim().toLowerCase();
    if (!search) return items;

    return items.filter((booking) => getSearchContent(booking).includes(search));
  };

  const visibleBookings =
    bookingTab === "hotels"
      ? filterBookings(hotelBookings)
      : bookingTab === "destinations"
      ? filterBookings(destinationBookings)
      : filterBookings(packageBookings);

  const emptyLabel =
    bookingTab === "hotels"
      ? "hotel"
      : bookingTab === "destinations"
      ? "destination"
      : "package";

  return (
    <section className="page-section">
      <div className="section-head">
        <div>
          <h2>My Booking</h2>
          <p>Manage your reservations and travel details.</p>
        </div>
      </div>

      <div className="booking-tabs booking-tabs-three">
        <button
          type="button"
          className={bookingTab === "packages" ? "active" : ""}
          onClick={() => setBookingTab("packages")}
        >
          Packages Reservations
        </button>

        <button
          type="button"
          className={bookingTab === "hotels" ? "active" : ""}
          onClick={() => setBookingTab("hotels")}
        >
          Hotels Reservations
        </button>

        <button
          type="button"
          className={bookingTab === "destinations" ? "active" : ""}
          onClick={() => setBookingTab("destinations")}
        >
          Destinations Reservations
        </button>
      </div>

      <input
        className="booking-search"
        type="text"
        placeholder="Search by client, email, phone, package, hotel, destination or date..."
        value={bookingSearch}
        onChange={(e) => setBookingSearch(e.target.value)}
      />

      <div className="booking-list">
        {visibleBookings.length === 0 ? (
          <p className="empty-msg">No {emptyLabel} reservations found.</p>
        ) : (
          visibleBookings.map((booking, index) => {
            const title = getBookingTitle(booking);
            const status = getStatus(booking);
            const notes = getNotes(booking);
            const location = getLocation(booking);
            const duration = getDuration(booking);

            return (
              <div
                className="booking-pro-card"
                key={booking._id || booking.id || index}
              >
                <div className="booking-card-top">
                  <div>
                    <h3>{title}</h3>
                  </div>

                  <span
                    className={`status ${
                      status.toLowerCase() === "confirmed"
                        ? "confirmed"
                        : status.toLowerCase() === "cancelled"
                        ? "cancelled"
                        : "pending"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="booking-info-grid">
                  <InfoItem label="Client" value={getClientName(booking)} />
                  <InfoItem label="Email" value={getEmail(booking)} />
                  <InfoItem label="Country" value={getCountry(booking)} />

                  {bookingTab === "destinations" && location && (
                    <InfoItem label="Location" value={location} />
                  )}

                  {duration && <InfoItem label="Duration" value={duration} />}

                  <InfoItem label="Phone / WhatsApp" value={getPhone(booking)} />
                  <InfoItem label="Travel Date" value={getTravelDate(booking)} />
                  <InfoItem label="Travelers" value={getTravelers(booking)} />
                  <InfoItem label="Room" value={getRoom(booking)} />
                </div>

                {notes && (
                  <div className="booking-notes">
                    <span>Special requests or notes</span>
                    <p>{notes}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
