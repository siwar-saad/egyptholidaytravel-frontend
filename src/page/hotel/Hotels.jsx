import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

import API from "../../api";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "./Hotels.css";

import heroImg from "../../assets/image/bghotel.webp";

const ITEMS_PER_PAGE = 14;
const TODAY = new Date().toISOString().split("T")[0];

const apiOrigin =
  (import.meta.env.VITE_API_URL || "/api").replace(/\/api\/?$/, "") || "";

const getImageUrl = (src) => {
  if (!src) return "";
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith("/images/")) return `${apiOrigin}${src}`;
  return src;
};

const normalizeText = (value = "") => {
  return String(value)
    .toLowerCase()
    .replace(/hotel/g, "")
    .replace(/resort/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
};

const getHotelPriceValue = (hotel = {}) => {
  const prices = [
    hotel.single_room,
    hotel.double_room,
    hotel.triple_room,
    hotel.price,
    ...(Array.isArray(hotel.periods)
      ? hotel.periods.flatMap((period) => [
          period.single,
          period.double,
          period.triple,
          period.price,
        ])
      : []),
  ]
    .map((price) => {
      const match = String(price || "")
        .replace(/,/g, "")
        .match(/\d+(?:\.\d+)?/);

      return match ? Number(match[0]) : null;
    })
    .filter((price) => price !== null && !Number.isNaN(price));

  return prices.length > 0 ? Math.min(...prices) : null;
};

const matchHotelPriceFilter = (price, filter) => {
  if (filter === "all") return true;
  if (price === null || Number.isNaN(price)) return false;

  if (filter === "under-100") return price < 100;
  if (filter === "100-250") return price >= 100 && price <= 250;
  if (filter === "250-500") return price > 250 && price <= 500;
  if (filter === "over-500") return price > 500;

  return true;
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
  const location = useLocation();

  const [hotels, setHotels] = useState([]);
  const [currentHotelPage, setCurrentHotelPage] = useState(1);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingAsAdmin, setBookingAsAdmin] = useState(false);

  const [bookingData, setBookingData] = useState(EMPTY_BOOKING_DATA);

  const [selectedBookingCountry, setSelectedBookingCountry] = useState(
    BOOKING_COUNTRIES[0]
  );

  const [openBookingCountry, setOpenBookingCountry] = useState(false);
  const [homeHotelHandled, setHomeHotelHandled] = useState(false);

  const [selectedHotelNameFilter, setSelectedHotelNameFilter] = useState("all");
  const [selectedCityFilter, setSelectedCityFilter] = useState("all");
  const [selectedMealFilter, setSelectedMealFilter] = useState("all");
  const [selectedHotelPriceFilter, setSelectedHotelPriceFilter] = useState("all");


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

  useEffect(() => {
    if (homeHotelHandled) return;
    if (!hotels || hotels.length === 0) return;

    const openHotelId = location.state?.openHotelId;
    const openHotelName = location.state?.openHotelName;
    const openHotelCity = location.state?.openHotelCity;

    if (!openHotelId && !openHotelName && !openHotelCity) return;

    const wantedName = normalizeText(openHotelName);
    const wantedCity = normalizeText(openHotelCity);

    const selectedIndex = hotels.findIndex((hotel) => {
      const hotelId = String(hotel.id || hotel._id || hotel.hotelId || "");
      const hotelText = normalizeText(
        `${hotel.name || ""} ${hotel.title || ""} ${hotel.city || ""} ${
          hotel.group_title || ""
        } ${hotel.group_subtitle || ""}`
      );

      if (openHotelId && hotelId === String(openHotelId)) return true;

      if (wantedName && hotelText.includes(wantedName)) return true;
      if (wantedCity && hotelText.includes(wantedCity)) return true;

      const usefulWords = wantedName
        .split(" ")
        .filter((word) => word.length > 2);

      if (usefulWords.length > 0) {
        return usefulWords.every((word) => hotelText.includes(word));
      }

      return false;
    });

    if (selectedIndex !== -1) {
      const selected = hotels[selectedIndex];

      setCurrentHotelPage(Math.floor(selectedIndex / ITEMS_PER_PAGE) + 1);
      setSelectedHotel(selected);
      setMainImage(selected.image);
      setShowBookingForm(false);
      setOpenBookingCountry(false);

      setTimeout(() => {
        document.querySelector(".hotel-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    }

    setHomeHotelHandled(true);
  }, [hotels, location.state, homeHotelHandled]);

  const hotelNameOptions = useMemo(() => {
    const names = hotels
      .map((hotel) => hotel.name || hotel.title)
      .filter(Boolean)
      .map((name) => String(name).trim());

    return [...new Set(names)].sort((a, b) => a.localeCompare(b));
  }, [hotels]);

  const cityOptions = useMemo(() => {
    const cities = hotels
      .map((hotel) => hotel.city)
      .filter(Boolean)
      .map((city) => String(city).trim());

    return [...new Set(cities)].sort((a, b) => a.localeCompare(b));
  }, [hotels]);

  const mealOptions = useMemo(() => {
    const meals = hotels
      .map((hotel) => hotel.meal)
      .filter(Boolean)
      .map((meal) => String(meal).trim());

    return [...new Set(meals)].sort((a, b) => a.localeCompare(b));
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const hotelName = String(hotel.name || hotel.title || "");
      const hotelCity = String(hotel.city || "");
      const hotelMeal = String(hotel.meal || "");
      const hotelPrice = getHotelPriceValue(hotel);

      const matchesName =
        selectedHotelNameFilter === "all" ||
        hotelName === selectedHotelNameFilter;

      const matchesCity =
        selectedCityFilter === "all" || hotelCity === selectedCityFilter;

      const matchesMeal =
        selectedMealFilter === "all" || hotelMeal === selectedMealFilter;

      const matchesPrice = matchHotelPriceFilter(
        hotelPrice,
        selectedHotelPriceFilter
      );

      return matchesName && matchesCity && matchesMeal && matchesPrice;
    });
  }, [
    hotels,
    selectedHotelNameFilter,
    selectedCityFilter,
    selectedMealFilter,
    selectedHotelPriceFilter,
  ]);

  const hasActiveHotelFilters =
    selectedHotelNameFilter !== "all" ||
    selectedCityFilter !== "all" ||
    selectedMealFilter !== "all" ||
    selectedHotelPriceFilter !== "all";

  const totalHotelPages = Math.max(
    1,
    Math.ceil(filteredHotels.length / ITEMS_PER_PAGE)
  );

  const hotelStartIndex = (currentHotelPage - 1) * ITEMS_PER_PAGE;

  const paginatedHotels = filteredHotels.slice(
    hotelStartIndex,
    hotelStartIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentHotelPage(1);
  }, [
    selectedHotelNameFilter,
    selectedCityFilter,
    selectedMealFilter,
    selectedHotelPriceFilter,
  ]);

  useEffect(() => {
    if (currentHotelPage > totalHotelPages) {
      setCurrentHotelPage(totalHotelPages);
    }
  }, [currentHotelPage, totalHotelPages]);

  const resetHotelFilters = () => {
    setSelectedHotelNameFilter("all");
    setSelectedCityFilter("all");
    setSelectedMealFilter("all");
    setSelectedHotelPriceFilter("all");
  };

  const goToHotelPage = (page) => {
    const safePage = Math.min(Math.max(page, 1), totalHotelPages);

    setCurrentHotelPage(safePage);

    document.querySelector(".hotel-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

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
    let authUser = null;

    try {
      const authRes = await API.get("/auth/me");
      authUser = authRes.data?.user || null;
    } catch {
      showHotelAlert(
        "Please login or create an account before booking.",
        "login"
      );
      return;
    }

    const isAdmin = (authUser?.role || "").toLowerCase() === "admin";

    if (isAdmin) {
      setBookingAsAdmin(true);
      setBookingData(EMPTY_BOOKING_DATA);
      setSelectedBookingCountry(BOOKING_COUNTRIES[0]);
      setShowBookingForm(true);
      setOpenBookingCountry(false);
      return;
    }

    let storedClient = {
      ...authUser,
    };

    try {
      const res = await API.get("/client/profile");

      storedClient = {
        ...storedClient,
        ...res.data,
      };
    } catch (err) {
      console.log(
        "Hotel profile prefill error:",
        err.response?.data || err.message
      );
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

    setBookingAsAdmin(false);
    setSelectedBookingCountry(phoneData.country);
    setShowBookingForm(true);
    setOpenBookingCountry(false);
  };

  const closeBooking = () => {
    setShowBookingForm(false);
    setBookingAsAdmin(false);
    setOpenBookingCountry(false);
  };

  const hotelGroups = paginatedHotels.reduce((groups, hotel) => {
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

    if (bookingData.checkIn < TODAY) {
      showHotelAlert("Check-in date cannot be in the past.");
      return;
    }

    if (bookingData.checkOut <= bookingData.checkIn) {
      showHotelAlert("Check-out date must be after check-in date.");
      return;
    }

    const fullPhone = `${selectedBookingCountry.dialCode} ${bookingData.phone.trim()}`;

    try {
      setBookingLoading(true);

      const bookingPayload = {
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
      };

      const response = bookingAsAdmin
        ? await API.post("/admin/hotels/reservations", {
            hotelName: selectedHotel.name,
            city: selectedHotel.city,
            mealPlan: selectedHotel.meal,
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            roomType: bookingData.roomType,
            fullName: bookingData.fullName.trim(),
            email: bookingData.email.trim(),
            phone: fullPhone,
            travelers: bookingData.travelers,
            notes: bookingData.notes,
            totalPrice:
              selectedHotel.single_room ||
              selectedHotel.double_room ||
              selectedHotel.price ||
              0,
          })
        : await API.post("/hotels_reservation/reserve", bookingPayload);

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

        <section className="hotels-filter-section">
          <div className="hotels-filter-panel">
            <div className="hotel-filter-field hotel-filter-wide">
              <label htmlFor="hotel-name-filter">Hotel Name</label>

              <select
                id="hotel-name-filter"
                value={selectedHotelNameFilter}
                onChange={(e) => setSelectedHotelNameFilter(e.target.value)}
              >
                <option value="all">All hotels</option>
                {hotelNameOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="hotel-filter-field">
              <label htmlFor="hotel-city-filter">City</label>

              <select
                id="hotel-city-filter"
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
              >
                <option value="all">All cities</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="hotel-filter-field">
              <label htmlFor="hotel-meal-filter">Meal Plan</label>

              <select
                id="hotel-meal-filter"
                value={selectedMealFilter}
                onChange={(e) => setSelectedMealFilter(e.target.value)}
              >
                <option value="all">All meals</option>
                {mealOptions.map((meal) => (
                  <option key={meal} value={meal}>
                    {meal}
                  </option>
                ))}
              </select>
            </div>

            <div className="hotel-filter-field">
              <label htmlFor="hotel-price-filter">Price</label>

              <select
                id="hotel-price-filter"
                value={selectedHotelPriceFilter}
                onChange={(e) => setSelectedHotelPriceFilter(e.target.value)}
              >
                <option value="all">All prices</option>
                <option value="under-100">Under 100</option>
                <option value="100-250">100 - 250</option>
                <option value="250-500">250 - 500</option>
                <option value="over-500">Over 500</option>
              </select>
            </div>

            <button
              type="button"
              className="hotel-reset-filter"
              onClick={resetHotelFilters}
              disabled={!hasActiveHotelFilters}
            >
              Reset
            </button>
          </div>

          <div className="hotels-results-info">
            <span>
              {filteredHotels.length} hotel
              {filteredHotels.length === 1 ? "" : "s"} found
            </span>

            {hasActiveHotelFilters && <small>Filters applied</small>}
          </div>
        </section>

        {filteredHotels.length === 0 ? (
          <section className="hotel-section">
            <p className="empty-msg">No hotels match the selected filters.</p>
          </section>
        ) : (
          Object.values(hotelGroups).map((group) => (
          <HotelSection
            key={group.title}
            title={group.title}
            subtitle={group.subtitle}
            hotels={group.hotels}
            onSelect={openHotel}
          />
          ))
        )}

        {filteredHotels.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentHotelPage}
            totalPages={totalHotelPages}
            onPageChange={goToHotelPage}
          />
        )}

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
            bookingAsAdmin={bookingAsAdmin}
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
  bookingAsAdmin,
}) {
  const lockClientInfo = !bookingAsAdmin;

  const updateBooking = (field, value) => {
    setBookingData((prev) => {
      if (field === "checkIn") {
        return {
          ...prev,
          checkIn: value,
          checkOut: prev.checkOut && prev.checkOut <= value ? "" : prev.checkOut,
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });
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
            readOnly={lockClientInfo}
            onChange={(e) => updateBooking("fullName", e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={bookingData.email}
            readOnly={lockClientInfo}
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
                disabled={lockClientInfo}
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
                readOnly={lockClientInfo}
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
              min={TODAY}
              value={bookingData.checkIn}
              onChange={(e) => updateBooking("checkIn", e.target.value)}
            />
          </div>

          <div className="booking-date-field">
            <label>Check-out Date</label>

            <input
              type="date"
              min={bookingData.checkIn || TODAY}
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

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-wrap">
      <button
        type="button"
        className="pagination-arrow"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>

      <div className="pagination-pages">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;

          return (
            <button
              type="button"
              key={page}
              className={`page-number-btn ${
                currentPage === page ? "active" : ""
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="pagination-arrow"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}