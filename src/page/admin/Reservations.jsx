import { useEffect, useMemo, useState } from "react";
import API from "../../api";

export default function Reservations({ showSuccess }) {
  const [reservationTab, setReservationTab] = useState("packages");
  const [reservationSearch, setReservationSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const notify = (message) => {
    if (typeof showSuccess === "function") {
      showSuccess(message);
    }
  };

  const getArrayFromResponse = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.reservations)) return data.reservations;
    if (Array.isArray(data?.bookings)) return data.bookings;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;

    return [];
  };

  const requestFirstWorkingEndpoint = async (endpoints) => {
    for (const endpoint of endpoints) {
      try {
        const res = await API.get(endpoint);
        return getArrayFromResponse(res.data);
      } catch (err) {
        console.log(`Endpoint failed: ${endpoint}`, err.response?.data || err.message);
      }
    }

    return [];
  };

  const normalizePackageReservation = (booking, index) => {
    return {
      ...booking,
      id: booking.id || booking._id || `package-${index}`,
      type: "package",
      client:
        booking.client ||
        booking.name ||
        booking.fullName ||
        booking.customerName ||
        booking.customer_info?.fullName ||
        "Client",
      email:
        booking.email ||
        booking.customerEmail ||
        booking.customer_info?.email ||
        "-",
      phone:
        booking.phone ||
        booking.customerPhone ||
        booking.customer_info?.phone ||
        "-",
      packageName:
        booking.packageName ||
        booking.package_name ||
        booking.trip ||
        booking.title ||
        booking.selected_package?.name ||
        booking.package?.name ||
        "Package",
      date:
        booking.date ||
        booking.travelDate ||
        booking.selected_package?.date ||
        booking.createdAt?.slice?.(0, 10) ||
        "-",
      travelers:
        booking.travelers ||
        booking.people ||
        booking.customer_info?.travelers ||
        "-",
      status: booking.status || "Pending",
      notes: booking.notes || booking.customer_info?.notes || "",
    };
  };

  const normalizeHotelReservation = (booking, index) => {
    const selectedHotel = booking.selected_hotel || booking.hotel || {};
    const customerInfo = booking.customer_info || booking.customerInfo || {};

    return {
      ...booking,
      id: booking.id || booking._id || `hotel-${index}`,
      type: "hotel",
      client:
        booking.client ||
        booking.name ||
        booking.fullName ||
        customerInfo.fullName ||
        "Client",
      email: booking.email || customerInfo.email || "-",
      phone: booking.phone || customerInfo.phone || "-",
      hotelName:
        booking.hotelName ||
        booking.hotel_name ||
        selectedHotel.name ||
        booking.name ||
        "Hotel",
      city: booking.city || selectedHotel.city || "-",
      mealPlan: booking.mealPlan || selectedHotel.mealPlan || selectedHotel.meal || "-",
      checkIn: booking.checkIn || selectedHotel.checkIn || booking.date || "-",
      checkOut: booking.checkOut || selectedHotel.checkOut || "-",
      roomType: booking.roomType || selectedHotel.roomType || "-",
      travelers: booking.travelers || customerInfo.travelers || "-",
      totalPrice: booking.totalPrice || booking.price || "-",
      status: booking.status || "Pending",
      notes: booking.notes || customerInfo.notes || "",
    };
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);

      const packageReservations = await requestFirstWorkingEndpoint([
        "/admin/reservations",
        "/reservations",
        "/bookings",
      ]);

      const hotelReservations = await requestFirstWorkingEndpoint([
        "/admin/hotels-reservations",
        "/hotels_reservation",
        "/hotels_reservation/bookings",
        "/hotels_reservation/reservations",
        "/hotels/bookings",
      ]);

      const normalizedPackages = packageReservations.map((booking, index) =>
        normalizePackageReservation(booking, index)
      );

      const normalizedHotels = hotelReservations.map((booking, index) =>
        normalizeHotelReservation(booking, index)
      );

      setBookings([...normalizedPackages, ...normalizedHotels]);
    } catch (err) {
      console.log("Reservations error:", err.response?.data || err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const packageReservations = useMemo(() => {
    return bookings.filter((item) => item.type === "package");
  }, [bookings]);

  const hotelReservations = useMemo(() => {
    return bookings.filter((item) => item.type === "hotel");
  }, [bookings]);

  const searchedPackageReservations = packageReservations.filter((booking) =>
    `${booking.client || ""} ${booking.email || ""} ${booking.phone || ""} ${
      booking.packageName || ""
    } ${booking.date || ""} ${booking.status || ""}`
      .toLowerCase()
      .includes(reservationSearch.toLowerCase())
  );

  const searchedHotelReservations = hotelReservations.filter((booking) =>
    `${booking.client || ""} ${booking.email || ""} ${booking.phone || ""} ${
      booking.hotelName || ""
    } ${booking.city || ""} ${booking.checkIn || ""} ${booking.checkOut || ""} ${
      booking.status || ""
    }`
      .toLowerCase()
      .includes(reservationSearch.toLowerCase())
  );

  const tryUpdateStatus = async (booking, status) => {
    const id = booking.id || booking._id;

    if (!id) {
      notify("Reservation id not found.");
      return false;
    }

    const packageEndpoints = [
      `/admin/reservations/${id}/status`,
      `/reservations/${id}/status`,
      `/bookings/${id}/status`,
    ];

    const hotelEndpoints = [
      `/admin/hotels-reservations/${id}/status`,
      `/hotels_reservation/${id}/status`,
      `/hotels_reservation/bookings/${id}/status`,
      `/hotels/bookings/${id}/status`,
      `/admin/reservations/${id}/status`,
    ];

    const endpoints = booking.type === "hotel" ? hotelEndpoints : packageEndpoints;

    for (const endpoint of endpoints) {
      try {
        await API.put(endpoint, { status });
        return true;
      } catch (err) {
        console.log(`Update failed: ${endpoint}`, err.response?.data || err.message);
      }
    }

    return false;
  };

  const updateReservationStatus = async (booking, status) => {
    const success = await tryUpdateStatus(booking, status);

    setBookings((prev) =>
      prev.map((item) =>
        item.id === booking.id && item.type === booking.type
          ? { ...item, status }
          : item
      )
    );

    if (success) {
      notify("Reservation status updated.");
    } else {
      notify("Status changed locally, but backend status route was not found.");
    }
  };

  return (
    <section className="admin-panel">
      <div className="panel-head">
        <div>
          <h2>Reservations</h2>
          <p>All hotel and package bookings made by users appear here.</p>
        </div>

        <button type="button" onClick={fetchReservations}>
          Refresh
        </button>
      </div>

      <div className="reservation-switcher">
        <button
          type="button"
          className={reservationTab === "packages" ? "active" : ""}
          onClick={() => setReservationTab("packages")}
        >
          Packages Reservations ({searchedPackageReservations.length})
        </button>

        <button
          type="button"
          className={reservationTab === "hotels" ? "active" : ""}
          onClick={() => setReservationTab("hotels")}
        >
          Hotels Reservations ({searchedHotelReservations.length})
        </button>
      </div>

      <div className="client-tools">
        <input
          type="text"
          placeholder="Search reservations by client, email, phone, hotel, package or date..."
          value={reservationSearch}
          onChange={(e) => setReservationSearch(e.target.value)}
        />
      </div>

      {loading && <p className="empty-msg">Loading reservations...</p>}

      {!loading && reservationTab === "packages" && (
        searchedPackageReservations.length === 0 ? (
          <p className="empty-msg">No package reservations found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Package</th>
                  <th>Date</th>
                  <th>Travelers</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {searchedPackageReservations.map((booking) => (
                  <tr key={`${booking.type}-${booking.id}`}>
                    <td>{booking.client}</td>
                    <td>{booking.email}</td>
                    <td>{booking.phone}</td>
                    <td>{booking.packageName}</td>
                    <td>{booking.date}</td>
                    <td>{booking.travelers}</td>

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
        )
      )}

      {!loading && reservationTab === "hotels" && (
        searchedHotelReservations.length === 0 ? (
          <p className="empty-msg">No hotel reservations found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Hotel</th>
                  <th>City</th>
                  <th>Room</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Travelers</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {searchedHotelReservations.map((booking) => (
                  <tr key={`${booking.type}-${booking.id}`}>
                    <td>{booking.client}</td>
                    <td>{booking.email}</td>
                    <td>{booking.phone}</td>
                    <td>{booking.hotelName}</td>
                    <td>{booking.city}</td>
                    <td>{booking.roomType}</td>
                    <td>{booking.checkIn}</td>
                    <td>{booking.checkOut}</td>
                    <td>{booking.travelers}</td>

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
        )
      )}
    </section>
  );
}