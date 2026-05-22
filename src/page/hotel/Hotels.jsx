import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

import API from "../../api";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "./Hotels.css";

import heroImg from "../../assets/image/bghotel.jpg";

const apiOrigin =
  (import.meta.env.VITE_API_URL || "/api").replace(/\/api\/?$/, "") || "";

const getImageUrl = (src) => {
  if (!src) return "";
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith("/images/")) return `${apiOrigin}${src}`;
  return src;
};

const EMPTY_BOOKING_DATA = {
  fullName: "",
  email: "",
  phone: "",
  travelers: "",
  checkIn: "",
  checkOut: "",
  roomType: "Single Room",
  notes: "",
};

const BOOKING_COUNTRIES = [
  {
    flag: "https://flagcdn.com/fr.svg",
    name: "Paris / France",
    dialCode: "+33",
  },
  {
    flag: "https://flagcdn.com/de.svg",
    name: "Germany",
    dialCode: "+49",
  },
  {
    flag: "https://flagcdn.com/lu.svg",
    name: "Luxembourg",
    dialCode: "+352",
  },
  {
    flag: "https://flagcdn.com/tr.svg",
    name: "Turkey",
    dialCode: "+90",
  },
  {
    flag: "https://flagcdn.com/tn.svg",
    name: "Tunisia",
    dialCode: "+216",
  },
  {
    flag: "https://flagcdn.com/ma.svg",
    name: "Morocco",
    dialCode: "+212",
  },
  {
    flag: "https://flagcdn.com/ba.svg",
    name: "Bosnia",
    dialCode: "+387",
  },
  {
    flag: "https://flagcdn.com/eg.svg",
    name: "Egypt",
    dialCode: "+20",
  },
];

const getStoredClient = () => {
  try {
    return JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
    );
  } catch {
    return {};
  }
};

const splitStoredPhone = (phone = "") => {
  const cleanPhone = phone.trim();
  const country =
    BOOKING_COUNTRIES.find((item) => cleanPhone.startsWith(item.dialCode)) ||
    BOOKING_COUNTRIES[0];

  return {
    country,
    phone: cleanPhone.replace(country.dialCode, "").trim(),
  };
};

export default function Hotels() {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [bookingData, setBookingData] = useState(EMPTY_BOOKING_DATA);

  const [selectedBookingCountry, setSelectedBookingCountry] = useState(
    BOOKING_COUNTRIES[0]
  );

  const [openBookingCountry, setOpenBookingCountry] = useState(false);

  const [hotelAlert, setHotelAlert] = useState({
    show: false,
    type: "error",
    title: "",
    message: "",
  });

  const showHotelAlert = (message, type = "error") => {
    const titles = {
      success: "Booking Sent",
      error: "Missing Information",
      login: "Login Required",
    };

    setHotelAlert({
      show: true,
      type,
      title: titles[type] || "Notice",
      message,
    });
  };

  const closeHotelAlert = () => {
    setHotelAlert({
      show: false,
      type: "error",
      title: "",
      message: "",
    });
  };

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const response = await API.get("/hotels");
        setHotels(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(
          "Unable to load hotels",
          error.response?.data || error.message
        );

        showHotelAlert(
          "Unable to load hotels right now. Please try again later."
        );
      }
    };

    loadHotels();
  }, []);

  const openHotel = (hotel) => {
    setSelectedHotel(hotel);
    setMainImage(hotel.image);
    setShowBookingForm(false);
    setOpenBookingCountry(false);
  };

  const closeHotel = () => {
    setSelectedHotel(null);
    setMainImage(null);
    setShowBookingForm(false);
    setOpenBookingCountry(false);
  };

  const openBooking = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      showHotelAlert(
        "Please login or create an account before booking.",
        "login"
      );
      return;
    }

    let storedClient = getStoredClient();

    try {
      const res = await API.get("/client/profile");
      storedClient = {
        ...storedClient,
        ...res.data,
      };
    } catch (err) {
      console.log("Hotel profile prefill error:", err.response?.data || err.message);
    }

    const phoneData = splitStoredPhone(storedClient.phone || "");

    setBookingData({
      ...EMPTY_BOOKING_DATA,
      fullName:
        storedClient.name ||
        `${storedClient.firstName || ""} ${storedClient.lastName || ""}`.trim(),
      email: storedClient.email || "",
      phone: phoneData.phone,
    });

    setSelectedBookingCountry(phoneData.country);

    setShowBookingForm(true);
    setOpenBookingCountry(false);
  };

  const closeBooking = () => {
    setShowBookingForm(false);
    setOpenBookingCountry(false);
  };

  const hotelGroups = hotels.reduce((groups, hotel) => {
    const title = hotel.group_title || "Our Hotels";
    const subtitle =
      hotel.group_subtitle || "Discover our best hotels across Egypt";

    if (!groups[title]) {
      groups[title] = {
        title,
        subtitle,
        hotels: [],
      };
    }

    groups[title].hotels.push(hotel);
    return groups;
  }, {});

  const handleBookingSubmit = async () => {
    if (!selectedHotel || bookingLoading) return;

    const requiredFields = [
      bookingData.fullName,
      bookingData.email,
      bookingData.phone,
      bookingData.travelers,
      bookingData.checkIn,
      bookingData.checkOut,
    ];

    const hasEmptyField = requiredFields.some(
      (field) => !String(field).trim()
    );

    if (hasEmptyField) {
      showHotelAlert(
        "Please complete your full name, email, phone, travelers, check-in and check-out dates."
      );
      return;
    }

    const fullPhone = `${selectedBookingCountry.dialCode} ${bookingData.phone.trim()}`;

    try {
      setBookingLoading(true);

      const response = await API.post("/hotels_reservation/reserve", {
        selected_hotel: {
          name: selectedHotel.name,
          city: selectedHotel.city,
          mealPlan: selectedHotel.meal,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          roomType: bookingData.roomType,
        },

        customer_info: {
          fullName: bookingData.fullName.trim(),
          email: bookingData.email.trim(),
          phone: fullPhone,
          travelers: bookingData.travelers,
          notes: bookingData.notes,
        },

        totalPrice:
          selectedHotel.single_room ||
          selectedHotel.double_room ||
          selectedHotel.price ||
          0,
      });

      console.log("Booking success:", response.data);

      setBookingData(EMPTY_BOOKING_DATA);
      setSelectedBookingCountry(BOOKING_COUNTRIES[0]);
      setOpenBookingCountry(false);

      setShowBookingForm(false);
      setSelectedHotel(null);
      setMainImage(null);

      showHotelAlert(
        "Your booking request has been sent successfully. Our team will contact you soon.",
        "success"
      );
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);

      showHotelAlert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Booking request failed. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="hotels-page">
        <section
          className="hotels-hero"
          style={{
            backgroundImage: `linear-gradient(rgba(42,33,23,.58), rgba(42,33,23,.58)), url(${heroImg})`,
          }}
        >
          <span>Egypt Holiday Travel</span>

          <h1>Our Partner Hotels</h1>

          <p>
            Discover premium hotels with elegant comfort, clear prices, and
            carefully selected stays for your perfect holiday in Egypt.
          </p>
        </section>

        {Object.values(hotelGroups).map((group) => (
          <HotelSection
            key={group.title}
            title={group.title}
            subtitle={group.subtitle}
            hotels={group.hotels}
            onSelect={openHotel}
          />
        ))}

        {selectedHotel && (
          <HotelModal
            hotel={selectedHotel}
            mainImage={mainImage}
            setMainImage={setMainImage}
            onClose={closeHotel}
            onBook={openBooking}
          />
        )}

        {showBookingForm && selectedHotel && (
          <BookingForm
            hotel={selectedHotel}
            bookingData={bookingData}
            setBookingData={setBookingData}
            selectedCountry={selectedBookingCountry}
            setSelectedCountry={setSelectedBookingCountry}
            openCountry={openBookingCountry}
            setOpenCountry={setOpenBookingCountry}
            countries={BOOKING_COUNTRIES}
            onClose={closeBooking}
            onSubmit={handleBookingSubmit}
            loading={bookingLoading}
          />
        )}

        {hotelAlert.show && (
          <HotelProAlert
            alert={hotelAlert}
            onClose={closeHotelAlert}
            onLogin={() => {
              closeHotelAlert();
              navigate("/login");
            }}
            onSignup={() => {
              closeHotelAlert();
              navigate("/signup");
            }}
          />
        )}
      </main>

      <Footer />
    </>
  );
}

function HotelSection({ title, subtitle, hotels, onSelect }) {
  return (
    <section className="hotel-section">
      <div className="hotel-section-head">
        <span>Premium Hotels</span>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {hotels.length === 0 ? (
        <p className="empty-msg">No hotels available yet.</p>
      ) : (
        <div className="hotels-grid">
          {hotels.map((hotel, index) => (
            <article
              className="hotel-cover-card"
              key={hotel.id || hotel._id || `${hotel.name}-${index}`}
              onClick={() => onSelect(hotel)}
            >
              <img
                src={getImageUrl(hotel.image)}
                alt={hotel.name || "Hotel"}
                loading="lazy"
              />

              <div className="hotel-cover-overlay">
                <span>{hotel.city || "Egypt"}</span>
                <h3>{hotel.name || "Hotel"}</h3>
                <button type="button">View Details</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function HotelModal({ hotel, mainImage, setMainImage, onClose, onBook }) {
  const gallery = Array.isArray(hotel.gallery) ? hotel.gallery : [];
  const periods = Array.isArray(hotel.periods) ? hotel.periods : [];

  return (
    <div className="hotel-modal">
      <div className="hotel-modal-box">
        <button type="button" className="close-modal" onClick={onClose}>
          ×
        </button>

        <div className="modal-img">
          <img
            src={getImageUrl(mainImage || hotel.image)}
            alt={hotel.name || "Hotel"}
          />
        </div>

        <div className="modal-content">
          <span className="modal-city">{hotel.city || "Egypt"}</span>

          <h2>{hotel.name || "Hotel"}</h2>

          {gallery.length > 0 && (
            <div className="hotel-gallery">
              {gallery.map((img, index) => (
                <img
                  key={`${hotel.name}-gallery-${index}`}
                  src={getImageUrl(img)}
                  alt={hotel.name || "Hotel gallery"}
                  loading="lazy"
                  onClick={() => setMainImage(img)}
                  className={
                    (mainImage || hotel.image) === img ? "active-thumb" : ""
                  }
                />
              ))}
            </div>
          )}

          <div className="modal-info">
            <p>
              <strong>City:</strong> {hotel.city || "-"}
            </p>

            <p>
              <strong>Meal Plan:</strong> {hotel.meal || "-"}
            </p>

            <p>
              <strong>Travel Periods:</strong> {periods.length} available
              periods
            </p>
          </div>

          <div className="modal-prices">
            <h4>Rates & Travel Periods</h4>

            {periods.length === 0 ? (
              <p className="empty-msg">No periods available.</p>
            ) : (
              periods.map((period, index) => (
                <div
                  className="period-card"
                  key={`${hotel.name}-period-${index}`}
                >
                  <div className="period-date">
                    <span>From: {period.from || "-"}</span>
                    <span>To: {period.to || "-"}</span>
                  </div>

                  <div className="price-line">
                    <span>Single Room</span>
                    <b>{period.single || "—"}</b>
                  </div>

                  <div className="price-line">
                    <span>Double Room</span>
                    <b>{period.double || "—"}</b>
                  </div>

                  <div className="price-line">
                    <span>Triple Room / Note</span>
                    <b>{period.triple || "—"}</b>
                  </div>
                </div>
              ))
            )}
          </div>

          <button type="button" className="book-btn" onClick={onBook}>
            Book This Hotel
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingForm({
  hotel,
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
}) {
  const updateBooking = (field, value) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const chooseCountry = (country) => {
    setSelectedCountry(country);
    setOpenCountry(false);
  };

  return (
    <div className="booking-popup">
      <div className="booking-box">
        <button type="button" className="booking-close" onClick={onClose}>
          ×
        </button>

        <h2>Book Your Stay</h2>

        <p>
          Complete the form below and our travel team will contact you with the
          best offer.
        </p>

        <div className="booking-hotel-summary">
          <strong>{hotel.name}</strong>
          <span>{hotel.city}</span>
          <span>{hotel.meal}</span>
        </div>

        <div className="booking-form">
          <input
            type="text"
            placeholder="Full Name"
            value={bookingData.fullName}
            onChange={(e) => updateBooking("fullName", e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={bookingData.email}
            onChange={(e) => updateBooking("email", e.target.value)}
          />

          <div className="hotel-booking-phone">
            <div
              className={`hotel-booking-country ${
                openCountry ? "active" : ""
              }`}
            >
              <button
                type="button"
                className="hotel-booking-country-btn"
                onClick={() => setOpenCountry((prev) => !prev)}
              >
                <div className="hotel-booking-country-left">
                  <img src={selectedCountry.flag} alt={selectedCountry.name} />

                  <div>
                    <small>Country</small>
                    <strong>{selectedCountry.name}</strong>
                  </div>
                </div>

                <FaChevronDown />
              </button>

              {openCountry && (
                <div className="hotel-booking-country-menu">
                  {countries.map((country) => (
                    <button
                      type="button"
                      key={country.dialCode}
                      className={
                        selectedCountry.dialCode === country.dialCode
                          ? "hotel-booking-country-option selected"
                          : "hotel-booking-country-option"
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

            <div className="hotel-booking-phone-input">
              <span>{selectedCountry.dialCode}</span>

              <input
                type="tel"
                placeholder="Phone Number / WhatsApp"
                value={bookingData.phone}
                onChange={(e) => updateBooking("phone", e.target.value)}
              />
            </div>
          </div>

          <input
            type="number"
            placeholder="Number of Travelers"
            min="1"
            value={bookingData.travelers}
            onChange={(e) => updateBooking("travelers", e.target.value)}
          />

          <div className="booking-date-field">
            <label>Check-in Date</label>

            <input
              type="date"
              value={bookingData.checkIn}
              onChange={(e) => updateBooking("checkIn", e.target.value)}
            />
          </div>

          <div className="booking-date-field">
            <label>Check-out Date</label>

            <input
              type="date"
              value={bookingData.checkOut}
              onChange={(e) => updateBooking("checkOut", e.target.value)}
            />
          </div>

          <select
            value={bookingData.roomType}
            onChange={(e) => updateBooking("roomType", e.target.value)}
          >
            <option>Single Room</option>
            <option>Double Room</option>
            <option>Triple Room</option>
            <option>Family Room</option>
            <option>Suite</option>
          </select>

          <textarea
            placeholder="Special requests or notes"
            value={bookingData.notes}
            onChange={(e) => updateBooking("notes", e.target.value)}
          />

          <button
            type="button"
            className="submit-booking"
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

function HotelProAlert({ alert, onClose, onLogin, onSignup }) {
  const isLoginAlert = alert.type === "login";

  return (
    <div className="hotel-pro-alert-overlay">
      <div className={`hotel-pro-alert ${alert.type}`}>
        <button
          type="button"
          className="hotel-pro-alert-close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="hotel-pro-alert-icon">
          {alert.type === "success" ? "✓" : isLoginAlert ? "🔐" : "!"}
        </div>

        <h3>{alert.title}</h3>
        <p>{alert.message}</p>

        {isLoginAlert ? (
          <div className="hotel-pro-alert-actions">
            <button
              type="button"
              className="hotel-pro-alert-btn"
              onClick={onLogin}
            >
              Login
            </button>

            <button
              type="button"
              className="hotel-pro-alert-secondary"
              onClick={onSignup}
            >
              Create Account
            </button>
          </div>
        ) : (
          <button type="button" className="hotel-pro-alert-btn" onClick={onClose}>
            OK
          </button>
        )}
      </div>
    </div>
  );
}
