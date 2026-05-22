import { useState } from "react";

const badTitles = ["package", "packages", "hotel", "hotels", "booking", "reservation"];

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
      value.packageName ||
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
    <strong>{value}</strong>
  </div>
);

export default function Bookings({
  bookings = [],
  bookingTab = "packages",
  setBookingTab = () => {},
}) {
  const [bookingSearch, setBookingSearch] = useState("");

  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const getBookingTitle = (booking) => {
    if (bookingTab === "hotels") {
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
        "packageData.name",
        "packageData.title",
        "packageData.packageName",
        "tripName",
        "tripTitle",
        "trip.name",
        "trip.title",
        "destination",
        "placeName",
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
        "user.email",
        "formData.email",
      ],
      "No email"
    );

  const getCountry = (booking) => {
    const countryValue =
      booking.country ||
      booking.clientCountry ||
      booking.customerCountry ||
      booking.nationality ||
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

    return toText(countryValue) || "No country";
  };

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
      "mobile",
      "formData.phone",
      "formData.phoneNumber",
    ]);

    if (dialCode && phone) return `${dialCode} ${phone}`;
    return phone || "No phone";
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
      ],
      "No travelers"
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
      ],
      "No room"
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
    ]);

  const getStatus = (booking) =>
    toText(booking.status || booking.bookingStatus) || "Pending";

  const packageBookings = safeBookings.filter(
    (booking) =>
      booking.type === "package" ||
      booking.packageName ||
      booking.packageTitle ||
      booking.selectedPackageName ||
      booking.package ||
      booking.selectedPackage ||
      booking.packageData ||
      booking.trip ||
      booking.destination ||
      (!booking.hotelName && booking.type !== "hotel")
  );

  const hotelBookings = safeBookings.filter(
    (booking) =>
      booking.type === "hotel" ||
      booking.hotelName ||
      booking.hotelTitle ||
      booking.selectedHotelName ||
      booking.hotel ||
      booking.selectedHotel
  );

  const getSearchContent = (booking) =>
    [
      getBookingTitle(booking),
      getClientName(booking),
      getEmail(booking),
      getCountry(booking),
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

    return items.filter((booking) =>
      getSearchContent(booking).includes(search)
    );
  };

  const visibleBookings =
    bookingTab === "packages"
      ? filterBookings(packageBookings)
      : filterBookings(hotelBookings);

  return (
    <section className="page-section">
      <div className="section-head">
        <div>
          <h2>My Booking</h2>
          <p>Manage your reservations and travel details.</p>
        </div>
      </div>

      <div className="booking-tabs">
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
      </div>

      <input
        className="booking-search"
        type="text"
        placeholder="Search by client, email, phone, package or date..."
        value={bookingSearch}
        onChange={(e) => setBookingSearch(e.target.value)}
      />

      <div className="booking-list">
        {visibleBookings.length === 0 ? (
          <p className="empty-msg">
            No {bookingTab === "packages" ? "package" : "hotel"} reservations found.
          </p>
        ) : (
          visibleBookings.map((booking, index) => {
            const title = getBookingTitle(booking);
            const status = getStatus(booking);
            const notes = getNotes(booking);

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