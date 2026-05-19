import { useState } from "react";

export default function Bookings({ bookings, bookingTab, setBookingTab }) {
  const [bookingSearch, setBookingSearch] = useState("");

  const packageBookings = bookings.filter(
    (booking) =>
      booking.type === "package" ||
      booking.packageName ||
      booking.trip ||
      (!booking.hotelName && booking.type !== "hotel")
  );

  const hotelBookings = bookings.filter(
    (booking) => booking.type === "hotel" || booking.hotelName
  );

  const filterBookings = (items) =>
    items.filter((booking) =>
      `${booking.title || ""} ${booking.name || ""} ${booking.packageName || ""} ${
        booking.trip || ""
      } ${booking.hotelName || ""} ${booking.date || ""} ${booking.status || ""}`
        .toLowerCase()
        .includes(bookingSearch.toLowerCase())
    );

  const visibleBookings =
    bookingTab === "packages"
      ? filterBookings(packageBookings)
      : filterBookings(hotelBookings);

  const renderBookingTitle = (booking) => {
    if (bookingTab === "hotels") {
      return booking.hotelName || booking.title || booking.name || "Hotel";
    }

    return booking.packageName || booking.trip || booking.title || booking.name || "Package";
  };

  return (
    <section className="page-section">
      <h2>My Booking</h2>

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
        placeholder="Search reservations by client, trip, hotel or date..."
        value={bookingSearch}
        onChange={(e) => setBookingSearch(e.target.value)}
      />

      <div className="booking-list">
        {visibleBookings.length === 0 ? (
          <p className="empty-msg">
            No {bookingTab === "packages" ? "package" : "hotel"} reservations found.
          </p>
        ) : (
          visibleBookings.map((booking, index) => (
            <div className="booking-pro-card" key={booking.id || booking._id || index}>
              <div>
                <h3>{renderBookingTitle(booking)}</h3>

                <p>
                  {booking.checkIn || booking.date || "No date"}
                  {booking.checkOut ? ` → ${booking.checkOut}` : ""} •{" "}
                  {booking.details || booking.status || "No details"}
                </p>
              </div>

              <span
                className={`status ${
                  booking.status === "Confirmed" ? "confirmed" : "pending"
                }`}
              >
                {booking.status || "Pending"}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
