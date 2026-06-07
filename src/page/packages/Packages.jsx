import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import API from "../../api";
import "./Packages.css";

import {
  FaChevronDown,
  FaArrowLeft,
  FaBus,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaHotel,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaPlaneDeparture,
  FaTimes,
  FaTrain,
  FaUtensils,
} from "react-icons/fa";

const EMPTY_PACKAGE_BOOKING = {
  fullName: "",
  email: "",
  phone: "",
  travelers: "",
  travelDate: "",
  roomType: "DBL",
  notes: "",
};

const EMPTY_LOCKED_FIELDS = {
  fullName: false,
  email: false,
  phone: false,
};

const PACKAGE_COUNTRIES = [
  {
    flag: "https://flagcdn.com/fr.svg",
    name: "Paris / France",
    dialCode: "+33",
  },
  { flag: "https://flagcdn.com/de.svg", name: "Germany", dialCode: "+49" },
  { flag: "https://flagcdn.com/lu.svg", name: "Luxembourg", dialCode: "+352" },
  { flag: "https://flagcdn.com/tr.svg", name: "Turkey", dialCode: "+90" },
  { flag: "https://flagcdn.com/tn.svg", name: "Tunisia", dialCode: "+216" },
  { flag: "https://flagcdn.com/ma.svg", name: "Morocco", dialCode: "+212" },
  { flag: "https://flagcdn.com/ba.svg", name: "Bosnia", dialCode: "+387" },
  { flag: "https://flagcdn.com/eg.svg", name: "Egypt", dialCode: "+20" },
];

const splitStoredPhone = (phone = "") => {
  const cleanPhone = phone.trim();

  const country =
    PACKAGE_COUNTRIES.find((item) => cleanPhone.startsWith(item.dialCode)) ||
    PACKAGE_COUNTRIES[0];

  return {
    country,
    phone: cleanPhone.replace(country.dialCode, "").trim(),
  };
};

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const isPastDate = (dateValue) => {
  if (!dateValue) return false;

  const selectedDate = new Date(`${dateValue}T00:00:00`);
  const today = new Date(`${getTodayDate()}T00:00:00`);

  return selectedDate < today;
};

const cleanPackageTitle = (value) =>
  String(value || "")
    .replace(/[()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export default function Packages() {
  const navigate = useNavigate();
  const location = useLocation();

  const [packagesData, setPackagesData] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingPackage, setBookingPackage] = useState(null);
  const [showPackageBookingForm, setShowPackageBookingForm] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingAsAdmin, setBookingAsAdmin] = useState(false);

  const [packageBookingData, setPackageBookingData] = useState(
    EMPTY_PACKAGE_BOOKING
  );

  const [lockedClientFields, setLockedClientFields] =
    useState(EMPTY_LOCKED_FIELDS);

  const [selectedPackageCountry, setSelectedPackageCountry] = useState(
    PACKAGE_COUNTRIES[0]
  );

  const [openPackageCountry, setOpenPackageCountry] = useState(false);

  const [packageAlert, setPackageAlert] = useState({
    show: false,
    type: "error",
    title: "",
    message: "",
  });

  const getImageUrl = (image) => {
    if (!image) return "";

    const imageValue = String(image);

    if (
      imageValue.startsWith("http") ||
      imageValue.startsWith("data:") ||
      imageValue.startsWith("blob:") ||
      imageValue.startsWith("/src/") ||
      imageValue.startsWith("/assets/")
    ) {
      return imageValue;
    }

    const apiBase = API.defaults.baseURL || "/api";
    const origin = apiBase.replace(/\/api\/?$/, "");
    const cleanPath = imageValue.startsWith("/") ? imageValue : `/${imageValue}`;

    return `${origin}${cleanPath}`;
  };

  const normalizePackage = (item) => ({
    id: item.id || item._id,
    name: cleanPackageTitle(item.name || item.title || "Package"),
    backendName:
      item.backendName || item.backend_name || item.title || item.name || "",
    route: item.route || "",
    duration: item.duration || "",
    transfer: item.transfer || "",
    transferReduction: item.transferReduction || item.transfer_reduction || "",
    startPrice:
      item.startPrice || item.start_price || item.price || "Contact us",
    image: getImageUrl(item.image),
    options: Array.isArray(item.options) ? item.options : [],
    itinerary: Array.isArray(item.itinerary) ? item.itinerary : [],
    programme: item.programme || "",
    included: Array.isArray(item.included) ? item.included : [],
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setPackagesLoading(true);

        const res = await API.get("/packages");
        const loadedPackages = Array.isArray(res.data) ? res.data : [];

        setPackagesData(loadedPackages.map(normalizePackage));
      } catch (err) {
        console.log("Public packages error:", err.response?.data || err.message);
        setPackagesData([]);
      } finally {
        setPackagesLoading(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    const openPackageId = location.state?.openPackageId;

    if (!openPackageId) return;
    if (packagesLoading) return;

    const packageToOpen = packagesData.find(
      (item) => String(item.id) === String(openPackageId)
    );

    if (packageToOpen) {
      setSelectedPackage(packageToOpen);
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate, packagesData, packagesLoading]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const openPackage = (item) => {
    setSelectedPackage(item);
  };

  const closePackage = () => {
    setSelectedPackage(null);
  };

  const showPackageAlert = (message, type = "error") => {
    const titles = {
      success: "Booking Sent",
      error: "Missing Information",
      login: "Login Required",
    };

    setPackageAlert({
      show: true,
      type,
      title: titles[type] || "Notice",
      message,
    });
  };

  const closePackageAlert = () => {
    setPackageAlert({
      show: false,
      type: "error",
      title: "",
      message: "",
    });
  };

  const openPackageBooking = async (item) => {
    let authUser = null;

    try {
      const authRes = await API.get("/auth/me");
      authUser = authRes.data?.user || null;
    } catch {
      showPackageAlert(
        "Please login or create an account before booking.",
        "login"
      );
      return;
    }

    const isAdmin = (authUser?.role || "").toLowerCase() === "admin";

    if (isAdmin) {
      setBookingAsAdmin(true);
      setSelectedPackage(null);
      setBookingPackage(item);
      setPackageBookingData({
        ...EMPTY_PACKAGE_BOOKING,
        roomType: "DBL",
      });

      setLockedClientFields(EMPTY_LOCKED_FIELDS);
      setSelectedPackageCountry(PACKAGE_COUNTRIES[0]);
      setShowPackageBookingForm(true);
      setOpenPackageCountry(false);
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
      console.log("Profile prefill error:", err.response?.data || err.message);
    }

    const phoneData = splitStoredPhone(storedClient.phone || "");

    const clientFullName =
      storedClient.name ||
      `${storedClient.firstName || ""} ${storedClient.lastName || ""}`.trim();

    const clientEmail = storedClient.email || "";
    const clientPhone = phoneData.phone || "";

    setSelectedPackage(null);
    setBookingAsAdmin(false);
    setBookingPackage(item);

    setPackageBookingData({
      ...EMPTY_PACKAGE_BOOKING,
      fullName: clientFullName,
      email: clientEmail,
      phone: clientPhone,
      roomType: "DBL",
    });

    setLockedClientFields({
      fullName: Boolean(clientFullName),
      email: Boolean(clientEmail),
      phone: Boolean(clientPhone),
    });

    setSelectedPackageCountry(phoneData.country);
    setShowPackageBookingForm(true);
    setOpenPackageCountry(false);
  };

  const closePackageBooking = () => {
    setShowPackageBookingForm(false);
    setBookingPackage(null);
    setBookingAsAdmin(false);
    setOpenPackageCountry(false);
    setLockedClientFields(EMPTY_LOCKED_FIELDS);
  };

  const submitPackageBooking = async () => {
    if (!bookingPackage || bookingLoading) return;

    const requiredFields = [
      packageBookingData.fullName,
      packageBookingData.email,
      packageBookingData.phone,
      packageBookingData.travelers,
      packageBookingData.travelDate,
    ];

    const hasEmptyField = requiredFields.some((field) => !String(field).trim());

    if (hasEmptyField) {
      showPackageAlert(
        "Please complete your full name, email, phone, travelers and travel date."
      );
      return;
    }

    if (isPastDate(packageBookingData.travelDate)) {
      showPackageAlert("Please choose today or a future travel date.");
      return;
    }

    const fullPhone = `${selectedPackageCountry.dialCode} ${packageBookingData.phone.trim()}`;

    const reservationData = {
      booking_type: "package",
      search_params: {
        name: bookingPackage.name,
        backendName: bookingPackage.backendName,
        route: bookingPackage.route,
        duration: bookingPackage.duration,
        transfer: bookingPackage.transfer,
        roomType: packageBookingData.roomType,
        travelDate: packageBookingData.travelDate,
        startPrice: bookingPackage.startPrice,
      },
      customer_info: {
        fullName: packageBookingData.fullName.trim(),
        email: packageBookingData.email.trim(),
        country: selectedPackageCountry.name,
        phone: fullPhone,
        travelers: packageBookingData.travelers,
        notes: packageBookingData.notes,
      },
      total_price: 0,
    };

    try {
      setBookingLoading(true);

      if (bookingAsAdmin) {
        await API.post("/admin/reservations", {
          packageName: bookingPackage.name,
          route: bookingPackage.route,
          duration: bookingPackage.duration,
          travelDate: packageBookingData.travelDate,
          roomType: packageBookingData.roomType,
          fullName: packageBookingData.fullName.trim(),
          email: packageBookingData.email.trim(),
          phone: fullPhone,
          travelers: packageBookingData.travelers,
          notes: packageBookingData.notes,
          totalPrice: 0,
        });
      } else {
        await API.post("/client/bookings", reservationData);
      }

      setPackageBookingData(EMPTY_PACKAGE_BOOKING);
      setSelectedPackageCountry(PACKAGE_COUNTRIES[0]);
      setOpenPackageCountry(false);
      setShowPackageBookingForm(false);
      setBookingPackage(null);
      setBookingAsAdmin(false);
      setLockedClientFields(EMPTY_LOCKED_FIELDS);

      showPackageAlert(
        "Your package booking request has been sent successfully. Our team will contact you soon.",
        "success"
      );
    } catch (error) {
      console.error("Package booking error:", error.message);
      showPackageAlert("Package booking request failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="packages-page">
      <Navbar />

      <main className="packages-main">
        <section className="packages-hero-pro">
          <div className="packages-hero-overlay"></div>

          <div className="packages-hero-content">
            <h1>Egypt Travel Packages</h1>

            <p>
              Discover organized Egypt packages with clear hotels, meal plans,
              transfers, and prices per person per room.
            </p>

            <div className="packages-hero-stats">
              <div>
                <strong>{packagesData.length}</strong>
                <span>Packages</span>
              </div>

              <div>
                <strong>4★ / 5★</strong>
                <span>Hotels</span>
              </div>

              <div>
                <strong>Bus / Train</strong>
                <span>Transfers</span>
              </div>
            </div>
          </div>
        </section>

        <section className="packages-list-section">
          <div className="packages-section-head">
            <span>Our Offers</span>
            <h2>Available Packages</h2>
            <p>
              Each card below represents one complete package with its own
              backend name.
            </p>
          </div>

          <div className="packages-grid-pro">
            {packagesLoading ? (
              <p className="empty-packages-message">Loading packages...</p>
            ) : packagesData.length === 0 ? (
              <p className="empty-packages-message">
                No published packages yet.
              </p>
            ) : (
              packagesData.map((item) => (
                <article className="package-card-pro" key={item.id}>
                  <div className="package-img-box">
                    <img src={item.image} alt={item.name} loading="lazy" />

                    <div className="package-img-overlay">
                      <span>{item.duration}</span>
                    </div>
                  </div>

                  <div className="package-card-body">
                    <h3>{item.name}</h3>

                    <div className="package-info-row">
                      <FaMapMarkedAlt />
                      <span>{item.route}</span>
                    </div>

                    <div className="package-info-row">
                      <FaCalendarAlt />
                      <span>{item.duration}</span>
                    </div>

                    <div className="package-info-row">
                      {item.route.includes("Luxor") ? <FaTrain /> : <FaBus />}
                      <span>{item.transfer}</span>
                    </div>

                    <div className="package-price-box">
                      <small>Starting Price</small>
                      <strong>{item.startPrice}</strong>
                    </div>

                    <div className="package-card-actions">
                      <button type="button" onClick={() => openPackage(item)}>
                        View Details
                      </button>

                      <button
                        type="button"
                        className="package-book-btn"
                        onClick={() => openPackageBooking(item)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="packages-contact-pro" id="packages-contact">
          <div className="packages-contact-card">
            <div className="packages-contact-title">
              <FaCheckCircle />

              <div>
                <h2>You Need More Information About Package?</h2>
                <p>
                  Contact our team and mention the package name you want. We
                  will help you choose the best option.
                </p>
              </div>
            </div>

            <div className="packages-contact-links">
              <a href="mailto:amr@egyptholiday-travel.com">
                <span>
                  <FaEnvelope />
                </span>

                <div>
                  <small>Email Us</small>
                  <strong>amr@egyptholiday-travel.com</strong>
                </div>
              </a>

              <a href="tel:01099959949">
                <span>
                  <FaPhoneAlt />
                </span>

                <div>
                  <small>Call Us</small>
                  <strong>01099959949</strong>
                </div>
              </a>
            </div>

            <a href="/" className="packages-back-home">
              <FaArrowLeft />
              Back Home
            </a>
          </div>
        </section>
      </main>

      {selectedPackage && (
        <PackageModal
          item={selectedPackage}
          onClose={closePackage}
          onBook={openPackageBooking}
        />
      )}

      {showPackageBookingForm && bookingPackage && (
        <PackageBookingForm
          item={bookingPackage}
          bookingData={packageBookingData}
          setBookingData={setPackageBookingData}
          selectedCountry={selectedPackageCountry}
          setSelectedCountry={setSelectedPackageCountry}
          openCountry={openPackageCountry}
          setOpenCountry={setOpenPackageCountry}
          countries={PACKAGE_COUNTRIES}
          onClose={closePackageBooking}
          onSubmit={submitPackageBooking}
          loading={bookingLoading}
          lockedClientFields={lockedClientFields}
        />
      )}

      {packageAlert.show && (
        <PackageProAlert
          alert={packageAlert}
          onClose={closePackageAlert}
          onLogin={() => {
            closePackageAlert();
            navigate("/login", {
              state: {
                redirectTo: "/packages",
              },
            });
          }}
          onSignup={() => {
            closePackageAlert();
            navigate("/signup");
          }}
        />
      )}

      <Footer />
    </div>
  );
}

function PackageModal({ item, onClose, onBook }) {
  const hasItinerary = Array.isArray(item.itinerary) && item.itinerary.length > 0;
  const hasOptions = Array.isArray(item.options) && item.options.length > 0;

  return (
    <div className="package-modal-overlay">
      <div className="package-modal-box">
        <button type="button" className="package-modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="package-modal-image">
          <img src={item.image} alt={item.name} />

          <div>
            <span>{item.duration}</span>
            <h2>{item.name}</h2>
          </div>
        </div>

        <div className="package-modal-content">
          <span className="package-back-name modal-back-name">
            Back Name: {item.backendName}
          </span>

          <div className="package-modal-meta">
            <div>
              <FaMapMarkedAlt />
              <span>{item.route}</span>
            </div>

            <div>
              <FaCalendarAlt />
              <span>{item.duration}</span>
            </div>

            <div>
              {item.route.includes("Luxor") ? <FaTrain /> : <FaBus />}
              <span>{item.transfer}</span>
            </div>
          </div>

          {item.transferReduction && (
            <div className="transfer-reduction-box">
              {item.transferReduction}
            </div>
          )}

          {hasItinerary ? (
            <div className="package-itinerary">
              {item.itinerary.map((day) => (
                <div className="package-day-card" key={day.day}>
                  <div className="package-day-number">{day.day}</div>

                  <div className="package-day-content">
                    <h3>{day.title}</h3>

                    <ul>
                      {day.details.map((detail, index) => (
                        <li key={`${day.day}-${index}`}>
                          <FaCheckCircle />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : hasOptions ? (
            <div className="package-options">
              {item.options.map((option) => (
                <div className="package-option-card" key={option.title}>
                  <h3>{option.title}</h3>

                  <div className="package-table-wrapper">
                    <table className="package-table">
                      <thead>
                        <tr>
                          <th>City</th>
                          <th>Nights</th>
                          <th>Hotel</th>
                          <th>Meal Plan</th>
                          <th>SGL</th>
                          <th>DBL</th>
                          <th>TPL</th>
                        </tr>
                      </thead>

                      <tbody>
                        {option.rows.map((row, index) => (
                          <tr key={`${option.title}-${row.city}-${index}`}>
                            <td>{row.city}</td>
                            <td>{row.nights}</td>
                            <td>{row.hotel}</td>
                            <td>
                              <span className="meal-badge">
                                <FaUtensils />
                                {row.meal}
                              </span>
                            </td>
                            <td>{row.sgl || "—"}</td>
                            <td>{row.dbl || "—"}</td>
                            <td>{row.tpl || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="package-option-card">
              <h3>Programme</h3>
              <p className="package-programme-text">
                {item.programme ||
                  "Package details will be confirmed by our team."}
              </p>
            </div>
          )}

          {Array.isArray(item.included) && item.included.length > 0 && (
            <div className="package-included-card">
              <h3>Price Included</h3>

              <ul>
                {item.included.map((text, index) => (
                  <li key={`${item.id}-included-${index}`}>
                    <FaCheckCircle />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="package-note-box">
            <FaHotel />

            <p>
              Above rates are per person per room, including the meals mentioned
              above and the transfer stated in this package.
            </p>
          </div>

          <div className="package-programme-contact">
            <h4>Need the complete package programme?</h4>

            <p>
              If you would like the full package programme, please contact us by
              email or phone and our team will send you all details.
            </p>

            <div className="package-programme-contact-links">
              <a href="mailto:amr@egyptholiday-travel.com">
                <FaEnvelope />
                amr@egyptholiday-travel.com
              </a>

              <a href="tel:01099959949">
                <FaPhoneAlt />
                01099959949
              </a>
            </div>
          </div>

          <button
            type="button"
            className="package-modal-book"
            onClick={() => onBook(item)}
          >
            <FaPlaneDeparture />
            Book This Package
          </button>
        </div>
      </div>
    </div>
  );
}

function PackageBookingForm({
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
          <span>{item.startPrice}</span>
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

function PackageProAlert({ alert, onClose, onLogin, onSignup }) {
  const isLoginAlert = alert.type === "login";

  return (
    <div className="package-pro-alert-overlay">
      <div className={`package-pro-alert ${alert.type}`}>
        <button
          type="button"
          className="package-pro-alert-close"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <div className="package-pro-alert-icon">
          {alert.type === "success" ? "✓" : isLoginAlert ? "🔐" : "!"}
        </div>

        <h3>{alert.title}</h3>
        <p>{alert.message}</p>

        {isLoginAlert ? (
          <div className="package-pro-alert-actions">
            <button
              type="button"
              className="package-pro-alert-btn"
              onClick={onLogin}
            >
              Login
            </button>

            <button
              type="button"
              className="package-pro-alert-secondary"
              onClick={onSignup}
            >
              Create Account
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="package-pro-alert-btn"
            onClick={onClose}
          >
            OK
          </button>
        )}
      </div>
    </div>
  );
}