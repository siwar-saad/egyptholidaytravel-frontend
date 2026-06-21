import { FaChevronDown, FaTimes } from "react-icons/fa";
import { getTodayDate } from "./packageUtils";

export default function PackageBookingForm({
  item,
  bookingData,
  setBookingData,
  selectedCountry,
  setSelectedCountry,
  openCountry,
  setOpenCountry,
  countries,
  onClose,
  onSubmit,
  loading,
  lockedClientFields,
}) {
  const todayDate = getTodayDate();

  const isClientDataLocked =
    lockedClientFields?.fullName ||
    lockedClientFields?.email ||
    lockedClientFields?.phone;

  const updateBooking = (field, value) => {
    if (lockedClientFields?.[field]) return;

    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const chooseCountry = (country) => {
    if (lockedClientFields?.phone) return;

    setSelectedCountry(country);
    setOpenCountry(false);
  };

  return (
    <div className="package-booking-popup">
      <div className="package-booking-box">
        <button
          type="button"
          className="package-booking-close"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <h2>Book This Package</h2>

        <p>
          Complete the form below and our travel team will contact you with the
          best offer.
        </p>

        <div className="package-booking-summary">
          <strong>{item.name}</strong>
          <span>{item.route}</span>
          <span>{item.duration}</span>
          {item.travelDateText && <span>{item.travelDateText}</span>}
          {!item.hidePrice && item.startPrice && <span>{item.startPrice}</span>}
        </div>

        {isClientDataLocked && (
          <div className="booking-locked-note">
            Your name, email and phone are taken from your account and cannot be
            changed here.
          </div>
        )}

        <div className="package-booking-form">
          <input
            type="text"
            placeholder="Full Name"
            value={bookingData.fullName}
            readOnly={lockedClientFields?.fullName}
            className={lockedClientFields?.fullName ? "booking-locked-input" : ""}
            onChange={(e) => updateBooking("fullName", e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={bookingData.email}
            readOnly={lockedClientFields?.email}
            className={lockedClientFields?.email ? "booking-locked-input" : ""}
            onChange={(e) => updateBooking("email", e.target.value)}
          />

          <div className="package-booking-phone">
            <div
              className={`package-booking-country ${
                openCountry ? "active" : ""
              } ${lockedClientFields?.phone ? "booking-locked-country" : ""}`}
            >
              <button
                type="button"
                className="package-booking-country-btn"
                disabled={lockedClientFields?.phone}
                onClick={() => {
                  if (lockedClientFields?.phone) return;
                  setOpenCountry((prev) => !prev);
                }}
              >
                <div className="package-booking-country-left">
                  <img src={selectedCountry.flag} alt={selectedCountry.name} />

                  <div>
                    <small>Country</small>
                    <strong>{selectedCountry.name}</strong>
                  </div>
                </div>

                <FaChevronDown />
              </button>

              {openCountry && !lockedClientFields?.phone && (
                <div className="package-booking-country-menu">
                  {countries.map((country) => (
                    <button
                      type="button"
                      key={country.dialCode}
                      className={
                        selectedCountry.dialCode === country.dialCode
                          ? "package-booking-country-option selected"
                          : "package-booking-country-option"
                      }
                      onClick={() => chooseCountry(country)}
                    >
                      <img src={country.flag} alt={country.name} />
                      <span>{country.name}</span>
                      <strong>{country.dialCode}</strong>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="package-booking-phone-input">
              <span>{selectedCountry.dialCode}</span>

              <input
                type="tel"
                placeholder="Phone Number / WhatsApp"
                value={bookingData.phone}
                readOnly={lockedClientFields?.phone}
                className={lockedClientFields?.phone ? "booking-locked-input" : ""}
                onChange={(e) => updateBooking("phone", e.target.value)}
              />
            </div>
          </div>

          <input
            type="number"
            min="1"
            placeholder="Number of Travelers"
            value={bookingData.travelers}
            onChange={(e) => updateBooking("travelers", e.target.value)}
          />

          <div className="package-date-field">
            <label>Travel Date</label>

            <input
              type="date"
              min={todayDate}
              value={bookingData.travelDate}
              onChange={(e) => updateBooking("travelDate", e.target.value)}
            />
          </div>

          <select
            value={bookingData.roomType}
            onChange={(e) => updateBooking("roomType", e.target.value)}
          >
            <option value="SGL">Single Room</option>
            <option value="DBL">Double Room</option>
            <option value="TPL">Triple Room</option>
          </select>

          <textarea
            placeholder="Special requests or notes"
            value={bookingData.notes}
            onChange={(e) => updateBooking("notes", e.target.value)}
          />

          <button
            type="button"
            className="submit-package-booking"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Booking Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
