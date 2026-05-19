/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import API from "../../api";

export default function Reservations({ showSuccess }) {
  const [reservationTab, setReservationTab] = useState("packages");
  const [reservationSearch, setReservationSearch] = useState("");
  const [bookings, setBookings] = useState([]);

  const notify = (message) => {
    if (typeof showSuccess === "function") {
      showSuccess(message);
    }
  };

  const getBookingId = (booking) => booking.id || booking._id;

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const packageReservationsRes = await API.get("/admin/reservations");
        const hotelReservationsRes = await API.get("/hotels/bookings");

        const packageBookings = (packageReservationsRes.data || []).map(
          (item) => ({
            ...item,
            type: item.type || "package",
          })
        );

        const hotelBookings = (hotelReservationsRes.data || []).map((item) => ({
          ...item,
          type: item.type || "hotel",
        }));

        setBookings([...packageBookings, ...hotelBookings]);
      } catch (err) {
        console.log("Reservations error:", err.response?.data || err.message);
      }
    };

    fetchReservations();
  }, []);

  const packageReservations = bookings.filter(
    (item) => item.type === "package" || item.packageName || item.trip
  );

  const hotelReservations = bookings.filter(
    (item) => item.type === "hotel" || item.hotelName
  );

  const searchedPackageReservations = packageReservations.filter((booking) =>
    `${booking.name || ""} ${booking.client || ""} ${
      booking.packageName || ""
    } ${booking.trip || ""} ${booking.date || ""} ${booking.status || ""}`
      .toLowerCase()
      .includes(reservationSearch.toLowerCase())
  );

  const searchedHotelReservations = hotelReservations.filter((booking) =>
    `${booking.name || ""} ${booking.client || ""} ${
      booking.hotelName || ""
    } ${booking.checkIn || ""} ${booking.checkOut || ""} ${
      booking.status || ""
    }`
      .toLowerCase()
      .includes(reservationSearch.toLowerCase())
  );

  const updateReservationStatus = async (booking, status) => {
    const id = getBookingId(booking);

    if (!id) {
      notify("Reservation id not found.");
      return;
    }

    try {
      if (booking.type === "hotel" || booking.hotelName) {
        await API.put(`/hotels/bookings/${id}/status`, { status });
      } else {
        await API.put(`/admin/reservations/${id}/status`, { status });
      }

      setBookings((prevBookings) =>
        prevBookings.map((item) =>
          getBookingId(item) === id ? { ...item, status } : item
        )
      );

      notify("Reservation status updated.");
    } catch (err) {
      console.log("Reservation error:", err.response?.data || err.message);
      notify("Failed to update reservation status.");
    }
  };

  return (
    <section className="admin-panel">
      <div className="panel-head">
        <div>
          <h2>Reservations</h2>
          <p>Manage package and hotel reservations separately.</p>
        </div>
      </div>

      <div className="reservation-switcher">
        <button
          type="button"
          className={reservationTab === "packages" ? "active" : ""}
          onClick={() => setReservationTab("packages")}
        >
          Packages Reservations
        </button>

        <button
          type="button"
          className={reservationTab === "hotels" ? "active" : ""}
          onClick={() => setReservationTab("hotels")}
        >
          Hotels Reservations
        </button>
      </div>

      <div className="client-tools">
        <input
          type="text"
          placeholder="Search reservations by client, trip, hotel or date..."
          value={reservationSearch}
          onChange={(e) => setReservationSearch(e.target.value)}
        />
      </div>

      {reservationTab === "packages" &&
        (searchedPackageReservations.length === 0 ? (
          <p className="empty-msg">No package reservations found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Package</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {searchedPackageReservations.map((booking, index) => {
                  const bookingId = getBookingId(booking);

                  return (
                    <tr key={bookingId || index}>
                      <td>{booking.name || booking.client || "Client"}</td>
                      <td>
                        {booking.packageName || booking.trip || "Package"}
                      </td>
                      <td>{booking.date || "-"}</td>

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
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

      {reservationTab === "hotels" &&
        (searchedHotelReservations.length === 0 ? (
          <p className="empty-msg">No hotel reservations found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Hotel</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {searchedHotelReservations.map((booking, index) => {
                  const bookingId = getBookingId(booking);

                  return (
                    <tr key={bookingId || index}>
                      <td>{booking.name || booking.client || "Client"}</td>
                      <td>{booking.hotelName || "Hotel"}</td>
                      <td>{booking.checkIn || booking.date || "-"}</td>
                      <td>{booking.checkOut || "-"}</td>

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
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
    </section>
  );
}