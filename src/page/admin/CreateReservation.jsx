import { useEffect, useMemo, useState } from "react";
import API from "../../api";
import "./CreateReservation.css";

const DESTINATIONS_STORAGE_KEY = "egypt_holiday_destinations";
const DESTINATION_RESERVATIONS_KEY = "egypt_holiday_destination_reservations";

const EMPTY_FORM = {
  type: "hotel",

  fullName: "",
  email: "",
  phone: "",

  packageId: "",
  packageName: "",
  route: "",
  duration: "",
  travelDate: "",

  hotelId: "",
  hotelName: "",
  city: "",
  mealPlan: "",
  checkIn: "",
  checkOut: "",
  nights: "",

  destinationId: "",
  destinationName: "",
  destinationCountry: "",
  destinationLocation: "",
  destinationDuration: "",
  destinationTravelDate: "",

  travelers: "",
  roomType: "Double Room",
  totalPrice: "",
  notes: "",
};

const getArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.packages)) return data.packages;
  if (Array.isArray(data?.hotels)) return data.hotels;
  if (Array.isArray(data?.reservations)) return data.reservations;
  return [];
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
      "Admin EgyptHoliday"
    );
  } catch {
    return "Admin EgyptHoliday";
  }
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
  localStorage.setItem(
    DESTINATION_RESERVATIONS_KEY,
    JSON.stringify(reservations)
  );
};

const makeLocalId = () => {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();

  return `destination-reservation-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
};

export default function CreateReservation() {
  const [form, setForm] = useState(EMPTY_FORM);

  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const [saving, setSaving] = useState(false);

  const [notice, setNotice] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const adminName = useMemo(() => getCurrentAdminName(), []);

  const showNotice = (type, message) => {
    setNotice({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setNotice({
        show: false,
        type: "success",
        message: "",
      });
    }, 2600);
  };

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const changeType = (type) => {
    setForm({
      ...EMPTY_FORM,
      type,
    });
  };

  const fetchOptions = async () => {
    try {
      const [packagesRes, hotelsRes] = await Promise.all([
        API.get("/admin/packages"),
        API.get("/hotels"),
      ]);

      setPackages(getArray(packagesRes.data));
      setHotels(getArray(hotelsRes.data));
      setDestinations(getStoredDestinations());
    } catch (error) {
      console.log("Create reservation options error:", error);
      setDestinations(getStoredDestinations());
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const choosePackage = (packageId) => {
    const selectedPackage = packages.find(
      (item) => String(item.id || item._id) === String(packageId)
    );

    if (!selectedPackage) return;

    setForm((prev) => ({
      ...prev,
      packageId,
      packageName: selectedPackage.name || selectedPackage.title || "",
      route: selectedPackage.route || selectedPackage.programme || "",
      duration: selectedPackage.duration || "",
      totalPrice:
        selectedPackage.price ||
        selectedPackage.totalPrice ||
        selectedPackage.total_price ||
        "",
    }));
  };

  const chooseHotel = (hotelId) => {
    const selectedHotel = hotels.find(
      (item) => String(item.id || item._id) === String(hotelId)
    );

    if (!selectedHotel) return;

    setForm((prev) => ({
      ...prev,
      hotelId,
      hotelName: selectedHotel.name || selectedHotel.title || "",
      city: selectedHotel.city || "",
      mealPlan:
        selectedHotel.meal ||
        selectedHotel.mealPlan ||
        selectedHotel.meal_plan ||
        "",
      totalPrice:
        selectedHotel.price ||
        selectedHotel.totalPrice ||
        selectedHotel.total_price ||
        "",
    }));
  };

  const chooseDestination = (destinationId) => {
    const selectedDestination = destinations.find(
      (item) => String(item.id || item._id) === String(destinationId)
    );

    if (!selectedDestination) return;

    setForm((prev) => ({
      ...prev,
      destinationId,
      destinationName:
        selectedDestination.title || selectedDestination.name || "",
      destinationCountry: selectedDestination.country || "Egypt",
      destinationLocation: selectedDestination.location || "",
      destinationDuration: selectedDestination.duration || "",
      totalPrice:
        selectedDestination.price ||
        selectedDestination.totalPrice ||
        selectedDestination.total_price ||
        "",
    }));
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      showNotice("error", "Client full name is required.");
      return false;
    }

    if (!form.email.trim()) {
      showNotice("error", "Client email is required.");
      return false;
    }

    if (form.type === "package" && !form.packageName.trim()) {
      showNotice("error", "Package name is required.");
      return false;
    }

    if (form.type === "hotel" && !form.hotelName.trim()) {
      showNotice("error", "Hotel name is required.");
      return false;
    }

    if (form.type === "destination" && !form.destinationName.trim()) {
      showNotice("error", "Destination name is required.");
      return false;
    }

    return true;
  };

  const buildCommonPayload = () => ({
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    travelers: form.travelers,
    roomType: form.roomType,
    notes: form.notes,
    totalPrice: form.totalPrice,

    createdBy: "admin",
    createdByRole: "admin",
    createdByName: adminName,
    reservationSource: "admin",
    isAdminCreated: true,

    updatedBy: "admin",
    updatedByRole: "admin",
    updatedByName: adminName,
    updatedAt: new Date().toISOString(),
  });

  const savePackageReservation = async () => {
    const payload = {
      ...buildCommonPayload(),
      type: "package",
      packageName: form.packageName,
      route: form.route,
      duration: form.duration,
      travelDate: form.travelDate,
    };

    await API.post("/admin/reservations", payload);
  };

  const saveHotelReservation = async () => {
    const payload = {
      ...buildCommonPayload(),
      type: "hotel",
      hotelName: form.hotelName,
      city: form.city,
      mealPlan: form.mealPlan,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      nights: form.nights,
    };

    await API.post("/admin/hotels/reservations", payload);
  };

  const saveDestinationReservation = () => {
    const saved = getStoredDestinationReservations();

    const payload = {
      id: makeLocalId(),
      type: "destination",

      destinationId: form.destinationId,
      destinationName: form.destinationName.trim(),
      destinationCountry: form.destinationCountry.trim() || "Egypt",
      destinationLocation: form.destinationLocation.trim(),
      duration: form.destinationDuration.trim(),
      travelDate: form.destinationTravelDate,

      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      travelers: form.travelers,
      roomType: form.roomType,
      totalPrice: form.totalPrice,
      notes: form.notes,

      status: "Pending",
      createdBy: `Admin - ${adminName}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveStoredDestinationReservations([payload, ...saved]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;
    if (!validateForm()) return;

    try {
      setSaving(true);

      if (form.type === "package") {
        await savePackageReservation();
      } else if (form.type === "hotel") {
        await saveHotelReservation();
      } else {
        saveDestinationReservation();
      }

      showNotice("success", "Reservation created successfully.");
      setForm({
        ...EMPTY_FORM,
        type: form.type,
      });
    } catch (error) {
      showNotice(
        "error",
        error.response?.data?.error || "Unable to create reservation."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="create-reservation-page">
      {notice.show && (
        <div className={`create-reservation-notice ${notice.type}`}>
          {notice.message}
        </div>
      )}

      <div className="create-reservation-card">
        <div className="create-reservation-head">
          <div>
            <h1>Create Client Reservation</h1>
            <p>
              Add a hotel, package or destination reservation for a client from
              the admin panel.
            </p>
          </div>

          <div className="created-by-card">
            <span>Created by</span>
            <strong>{adminName}</strong>
          </div>
        </div>

        <form className="create-reservation-form" onSubmit={handleSubmit}>
          <div className="create-reservation-grid">
            <label>
              Reservation Type
              <select
                value={form.type}
                onChange={(event) => changeType(event.target.value)}
              >
                <option value="hotel">Hotel</option>
                <option value="package">Package</option>
                <option value="destination">Destination</option>
              </select>
            </label>

            <label>
              Client Full Name
              <input
                type="text"
                placeholder="Client full name"
                value={form.fullName}
                onChange={(event) => updateForm("fullName", event.target.value)}
              />
            </label>

            <label>
              Client Email
              <input
                type="email"
                placeholder="Client account email"
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
              />
            </label>

            <label>
              Client Phone
              <input
                type="text"
                placeholder="Phone / WhatsApp"
                value={form.phone}
                onChange={(event) => updateForm("phone", event.target.value)}
              />
            </label>

            {form.type === "hotel" && (
              <>
                <label>
                  Hotel
                  <select
                    value={form.hotelId}
                    onChange={(event) => chooseHotel(event.target.value)}
                  >
                    <option value="">Choose hotel</option>
                    {hotels.map((hotel) => (
                      <option value={hotel.id || hotel._id} key={hotel.id || hotel._id}>
                        {hotel.name || hotel.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Check-in Date
                  <input
                    type="date"
                    value={form.checkIn}
                    onChange={(event) =>
                      updateForm("checkIn", event.target.value)
                    }
                  />
                </label>

                <label>
                  Check-out Date
                  <input
                    type="date"
                    value={form.checkOut}
                    onChange={(event) =>
                      updateForm("checkOut", event.target.value)
                    }
                  />
                </label>

                <label>
                  Nights
                  <input
                    type="number"
                    min="1"
                    placeholder="Number of nights"
                    value={form.nights}
                    onChange={(event) => updateForm("nights", event.target.value)}
                  />
                </label>

                <label>
                  Hotel Name
                  <input
                    type="text"
                    placeholder="Hotel name"
                    value={form.hotelName}
                    onChange={(event) =>
                      updateForm("hotelName", event.target.value)
                    }
                  />
                </label>

                <label>
                  City
                  <input
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={(event) => updateForm("city", event.target.value)}
                  />
                </label>

                <label>
                  Meal Plan
                  <input
                    type="text"
                    placeholder="Meal plan"
                    value={form.mealPlan}
                    onChange={(event) =>
                      updateForm("mealPlan", event.target.value)
                    }
                  />
                </label>
              </>
            )}

            {form.type === "package" && (
              <>
                <label>
                  Package
                  <select
                    value={form.packageId}
                    onChange={(event) => choosePackage(event.target.value)}
                  >
                    <option value="">Choose package</option>
                    {packages.map((item) => (
                      <option value={item.id || item._id} key={item.id || item._id}>
                        {item.name || item.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Travel Date
                  <input
                    type="date"
                    value={form.travelDate}
                    onChange={(event) =>
                      updateForm("travelDate", event.target.value)
                    }
                  />
                </label>

                <label>
                  Package Name
                  <input
                    type="text"
                    placeholder="Package name"
                    value={form.packageName}
                    onChange={(event) =>
                      updateForm("packageName", event.target.value)
                    }
                  />
                </label>

                <label>
                  Route
                  <input
                    type="text"
                    placeholder="Route"
                    value={form.route}
                    onChange={(event) => updateForm("route", event.target.value)}
                  />
                </label>

                <label>
                  Duration
                  <input
                    type="text"
                    placeholder="Duration"
                    value={form.duration}
                    onChange={(event) =>
                      updateForm("duration", event.target.value)
                    }
                  />
                </label>
              </>
            )}

            {form.type === "destination" && (
              <>
                <label>
                  Destination
                  <select
                    value={form.destinationId}
                    onChange={(event) => chooseDestination(event.target.value)}
                  >
                    <option value="">Choose destination</option>
                    {destinations.map((destination) => (
                      <option
                        value={destination.id || destination._id}
                        key={destination.id || destination._id}
                      >
                        {destination.title || destination.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Travel Date
                  <input
                    type="date"
                    value={form.destinationTravelDate}
                    onChange={(event) =>
                      updateForm("destinationTravelDate", event.target.value)
                    }
                  />
                </label>

                <label>
                  Destination Name
                  <input
                    type="text"
                    placeholder="Destination name"
                    value={form.destinationName}
                    onChange={(event) =>
                      updateForm("destinationName", event.target.value)
                    }
                  />
                </label>

                <label>
                  Country
                  <input
                    type="text"
                    placeholder="Country"
                    value={form.destinationCountry}
                    onChange={(event) =>
                      updateForm("destinationCountry", event.target.value)
                    }
                  />
                </label>

                <label>
                  Location
                  <input
                    type="text"
                    placeholder="Location"
                    value={form.destinationLocation}
                    onChange={(event) =>
                      updateForm("destinationLocation", event.target.value)
                    }
                  />
                </label>

                <label>
                  Duration
                  <input
                    type="text"
                    placeholder="04 Nights / 05 Days"
                    value={form.destinationDuration}
                    onChange={(event) =>
                      updateForm("destinationDuration", event.target.value)
                    }
                  />
                </label>
              </>
            )}

            <label>
              Room Type
              <select
                value={form.roomType}
                onChange={(event) => updateForm("roomType", event.target.value)}
              >
                <option>Single Room</option>
                <option>Double Room</option>
                <option>Triple Room</option>
                <option>Family Room</option>
                <option>Suite</option>
              </select>
            </label>

            <label>
              Travelers
              <input
                type="number"
                min="1"
                placeholder="Travelers"
                value={form.travelers}
                onChange={(event) => updateForm("travelers", event.target.value)}
              />
            </label>

            <label>
              Total Price
              <input
                type="number"
                min="0"
                placeholder="Total price"
                value={form.totalPrice}
                onChange={(event) => updateForm("totalPrice", event.target.value)}
              />
            </label>

            <label className="full">
              Notes
              <textarea
                placeholder="Reservation notes"
                value={form.notes}
                onChange={(event) => updateForm("notes", event.target.value)}
              />
            </label>
          </div>

          <div className="create-reservation-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Reservation"}
            </button>

            <button
              type="button"
              className="reset"
              onClick={() => setForm({ ...EMPTY_FORM, type: form.type })}
              disabled={saving}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}