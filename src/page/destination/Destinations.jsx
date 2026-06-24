import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import API from "../../api";
import "./Destinations.css";

import destination from "../../assets/image/destination.jpg";

const HERO_IMAGE = destination;

const IMAGES = {
  cairo:
    "https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=1400&q=85",
  hurghada:
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=85",
  alexandria:
    "https://images.unsplash.com/photo-1591017403286-fd8493524e1e?auto=format&fit=crop&w=1400&q=85",
  luxor:
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1400&q=85",
};

const getStoredUser = () => {
  try {
    const user =
      JSON.parse(localStorage.getItem("user") || "null") ||
      JSON.parse(sessionStorage.getItem("user") || "null");

    return user || {};
  } catch {
    return {};
  }
};

const getInitialBookingForm = (program = {}) => {
  const user = getStoredUser();

  return {
    packageName: program.title || "",
    route: program.route || "",
    duration: program.duration || "",
    travelDate: "",
    roomType: "Double Room",
    fullName:
      user.name ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      "",
    email: user.email || "",
    phone: user.phone || "",
    travelers: "1",
    notes: "",
  };
};

const PROGRAMS = [
  {
    tag: "File 01",
    stamp: "Egypt",
    title: "Exclusive Travel Offer — Cairo",
    duration: "04 Nights / 05 Days",
    route: "Cairo",
    location: "Cairo, Egypt",
    image: IMAGES.cairo,
    short:
      "Exclusive Cairo travel offer with hotel accommodation, private airport transfers, sightseeing tours, and day by day program.",
    categories: [
      {
        name: "Hotel Accommodation",
        details: "Accommodation in selected Cairo hotel with daily breakfast.",
      },
      {
        name: "Airport Transfers",
        details: "Private luxury vehicle with professional driver.",
      },
      {
        name: "Sightseeing Tours",
        details: "Internal programs.",
      },
    ],
    hotels: [
      {
        hotel: "Ramses Hilton",
        city: "Cairo",
        mealPlan: "Breakfast",
        nights: "04 Night",
        roomType: "Guest Room City View",
      },
      {
        hotel: "Fairmont Nile City, Cairo",
        city: "Cairo",
        mealPlan: "Breakfast",
        nights: "04 Night",
        roomType: "Deluxe Room Partial River View",
      },
    ],
    dayByDay: [
      {
        day: "Day 1",
        title: "Arrival in Cairo",
        details: [
          "Pickup from the airport.",
          "Private transfer from Cairo Airport to the hotel.",
          "Arrival to the hotel.",
          "Check-in and overnight at the hotel.",
        ],
      },
      {
        day: "Day 2",
        title: "Pyramids & Grand Egyptian Museum",
        details: [
          "Breakfast at the hotel.",
          "Visit the Giza Pyramids and the Sphinx.",
          "Lunch at a restaurant overlooking the Pyramids.",
          "Visit the Grand Egyptian Museum.",
          "Return to the hotel.",
        ],
      },
      {
        day: "Day 3",
        title: "Islamic Cairo",
        details: [
          "Breakfast at the hotel.",
          "Visit the Citadel of Salah El-Din and the Mosque of Mohamed Ali.",
          "Lunch.",
          "Tour of Al-Muizz Street.",
          "Visit Khan El Khalili Bazaar.",
          "Return to the hotel.",
        ],
      },
      {
        day: "Day 4",
        title: "Museums & Gardens",
        details: [
          "Breakfast at the hotel.",
          "Visit the National Museum of Egyptian Civilization.",
          "Lunch.",
          "Visit Al-Azhar Park.",
          "Return to the hotel.",
        ],
      },
      {
        day: "Day 5",
        title: "Ahl Misr Promenade",
        details: [
          "Breakfast at the hotel.",
          "In the afternoon, visit the Ahl Misr Promenade.",
          "Lunch.",
          "Relax at a café overlooking the Nile.",
          "Return to the hotel.",
        ],
      },
    ],
    offices: [
      "Head Office: Qanat El-Suiz, Next To El-Eman Mosque, Mansoura.",
      "Branch 1: 22 Abou Dawoud El Zahery St. Next to Arab Investment Bank, Nasr City, Cairo.",
      "Branch 2: Block 187, Beyoglu Business Center, Istiklal, Istanbul.",
    ],
  },
  {
    tag: "File 02",
    stamp: "Egypt",
    title: "Cairo – Hurghada",
    duration: "5 Nights",
    route: "Cairo – Hurghada",
    location: "Cairo & Hurghada, Egypt",
    image: IMAGES.hurghada,
    short:
      "Package with Cairo stay, Hurghada resort stay, meal plan details, and round-trip bus transfer.",
    transfer: "Round-trip transfer by Bus from Cairo to Hurghada.",
    options: [
      {
        title: "Option 01",
        rows: [
          {
            city: "Cairo",
            nights: "2 Nights",
            hotel: "Hilton Cairo Grand Nile",
            mealPlan: "Breakfast",
          },
          {
            city: "Hurghada",
            nights: "3 Nights",
            hotel: "Albatros Aqua Blu Hurghada",
            mealPlan: "All Inclusive",
          },
        ],
      },
      {
        title: "Option 02",
        rows: [
          {
            city: "Cairo",
            nights: "2 Nights",
            hotel: "Ramses Hilton",
            mealPlan: "Breakfast",
          },
          {
            city: "Hurghada",
            nights: "3 Nights",
            hotel: "Cleopatra Luxury Makadi Bay",
            mealPlan: "All Inclusive",
          },
        ],
      },
    ],
    dayByDay: [
      {
        day: "Day 1",
        title: "Arrival in Cairo",
        details: [
          "Pickup from Cairo Airport.",
          "Private transfer to the hotel in Cairo.",
          "Check-in and overnight in Cairo.",
        ],
      },
      {
        day: "Day 2",
        title: "Cairo Visit",
        details: [
          "Breakfast at the hotel.",
          "Free time or optional Cairo sightseeing.",
          "Overnight in Cairo.",
        ],
      },
      {
        day: "Day 3",
        title: "Transfer from Cairo to Hurghada",
        details: [
          "Breakfast at the hotel.",
          "Check-out from Cairo hotel.",
          "Round-trip bus transfer from Cairo to Hurghada.",
          "Arrival to Hurghada hotel.",
          "Check-in and overnight in Hurghada.",
        ],
      },
      {
        day: "Day 4",
        title: "Hurghada Resort Stay",
        details: [
          "Breakfast at the hotel.",
          "Free day at the resort.",
          "Enjoy the beach, pools, and hotel facilities.",
          "Overnight in Hurghada.",
        ],
      },
      {
        day: "Day 5",
        title: "Hurghada Free Day",
        details: [
          "Breakfast at the hotel.",
          "Free time in Hurghada.",
          "Optional sea activities can be arranged with the agency.",
          "Overnight in Hurghada.",
        ],
      },
      {
        day: "Day 6",
        title: "Return to Cairo",
        details: [
          "Breakfast at the hotel.",
          "Check-out from Hurghada hotel.",
          "Bus transfer back to Cairo.",
          "End of program.",
        ],
      },
    ],
  },
  {
    tag: "File 03",
    stamp: "Egypt",
    title: "Cairo – Hurghada",
    duration: "6 Nights",
    route: "Cairo – Hurghada",
    location: "Cairo & Hurghada, Egypt",
    image: IMAGES.hurghada,
    short:
      "Package with Cairo accommodation, Hurghada accommodation, meal plan details, and round-trip bus transfer.",
    transfer: "Round-trip transfer by Bus from Cairo to Hurghada.",
    options: [
      {
        title: "Option 01",
        rows: [
          {
            city: "Cairo",
            nights: "2 Nights",
            hotel: "Hilton Cairo Grand Nile",
            mealPlan: "Breakfast",
          },
          {
            city: "Hurghada",
            nights: "4 Nights",
            hotel: "Albatros Aqua Blu Hurghada",
            mealPlan: "All Inclusive",
          },
        ],
      },
      {
        title: "Option 02",
        rows: [
          {
            city: "Cairo",
            nights: "2 Nights",
            hotel: "Ramses Hilton",
            mealPlan: "Breakfast",
          },
          {
            city: "Hurghada",
            nights: "4 Nights",
            hotel: "Cleopatra Luxury Makadi Bay",
            mealPlan: "All Inclusive",
          },
        ],
      },
    ],
    dayByDay: [
      {
        day: "Day 1",
        title: "Arrival in Cairo",
        details: [
          "Pickup from Cairo Airport.",
          "Private transfer to the hotel.",
          "Check-in and overnight in Cairo.",
        ],
      },
      {
        day: "Day 2",
        title: "Cairo Stay",
        details: [
          "Breakfast at the hotel.",
          "Free time in Cairo or optional sightseeing.",
          "Overnight in Cairo.",
        ],
      },
      {
        day: "Day 3",
        title: "Transfer to Hurghada",
        details: [
          "Breakfast at the hotel.",
          "Check-out from Cairo hotel.",
          "Bus transfer from Cairo to Hurghada.",
          "Check-in at Hurghada hotel.",
          "Overnight in Hurghada.",
        ],
      },
      {
        day: "Day 4",
        title: "Hurghada Resort Day",
        details: [
          "Breakfast at the hotel.",
          "Free day at the resort.",
          "Enjoy beach and hotel facilities.",
          "Overnight in Hurghada.",
        ],
      },
      {
        day: "Day 5",
        title: "Hurghada Free Day",
        details: [
          "Breakfast at the hotel.",
          "Free time in Hurghada.",
          "Optional sea activities.",
          "Overnight in Hurghada.",
        ],
      },
      {
        day: "Day 6",
        title: "Hurghada Relaxation Day",
        details: [
          "Breakfast at the hotel.",
          "Relax at the beach or enjoy hotel activities.",
          "Overnight in Hurghada.",
        ],
      },
      {
        day: "Day 7",
        title: "Return to Cairo",
        details: [
          "Breakfast at the hotel.",
          "Check-out from Hurghada hotel.",
          "Bus transfer back to Cairo.",
          "End of program.",
        ],
      },
    ],
  },
  {
    tag: "File 04",
    stamp: "Egypt",
    title: "Cairo – Alexandria",
    duration: "6 Nights",
    route: "Cairo – Alexandria",
    location: "Cairo & Alexandria, Egypt",
    image: IMAGES.alexandria,
    short:
      "Package with Cairo stay, Alexandria stay, hotel options, breakfast meal plan, and round-trip bus transfer.",
    transfer: "Round-trip transfer by Bus from Cairo to Alexandria.",
    options: [
      {
        title: "Option 01",
        rows: [
          {
            city: "Cairo",
            nights: "4 Nights",
            hotel: "Hilton Cairo Grand Nile",
            mealPlan: "Breakfast",
          },
          {
            city: "Alexandria",
            nights: "2 Nights",
            hotel: "Rixos Montaza Alexandria",
            mealPlan: "Breakfast",
          },
        ],
      },
      {
        title: "Option 02",
        rows: [
          {
            city: "Cairo",
            nights: "4 Nights",
            hotel: "Ramses Hilton",
            mealPlan: "Breakfast",
          },
          {
            city: "Alexandria",
            nights: "2 Nights",
            hotel: "SUNRISE Alex Avenue Resort (Select)",
            mealPlan: "Breakfast",
          },
        ],
      },
    ],
    dayByDay: [
      {
        day: "Day 1",
        title: "Arrival in Cairo",
        details: [
          "Pickup from Cairo Airport.",
          "Private transfer to the hotel.",
          "Check-in and overnight in Cairo.",
        ],
      },
      {
        day: "Day 2",
        title: "Cairo Stay",
        details: [
          "Breakfast at the hotel.",
          "Free time in Cairo or optional sightseeing.",
          "Overnight in Cairo.",
        ],
      },
      {
        day: "Day 3",
        title: "Cairo Free Day",
        details: [
          "Breakfast at the hotel.",
          "Free time for shopping or optional visits.",
          "Overnight in Cairo.",
        ],
      },
      {
        day: "Day 4",
        title: "Cairo Overnight",
        details: [
          "Breakfast at the hotel.",
          "Free time in Cairo.",
          "Prepare for Alexandria transfer.",
          "Overnight in Cairo.",
        ],
      },
      {
        day: "Day 5",
        title: "Transfer to Alexandria",
        details: [
          "Breakfast at the hotel.",
          "Check-out from Cairo hotel.",
          "Round-trip bus transfer from Cairo to Alexandria.",
          "Check-in at Alexandria hotel.",
          "Overnight in Alexandria.",
        ],
      },
      {
        day: "Day 6",
        title: "Alexandria Stay",
        details: [
          "Breakfast at the hotel.",
          "Free time in Alexandria.",
          "Optional visit to the seaside, Montazah, or city highlights.",
          "Overnight in Alexandria.",
        ],
      },
      {
        day: "Day 7",
        title: "Return to Cairo",
        details: [
          "Breakfast at the hotel.",
          "Check-out from Alexandria hotel.",
          "Bus transfer back to Cairo.",
          "End of program.",
        ],
      },
    ],
  },
  {
    tag: "File 05",
    stamp: "Egypt",
    title: "Cairo – Luxor",
    duration: "6 Nights",
    route: "Cairo – Luxor",
    location: "Cairo & Luxor, Egypt",
    image: IMAGES.luxor,
    short:
      "Package with Cairo stay, Luxor stay, hotel options, breakfast meal plan, and sleeping cabin train transfer.",
    transfer: "Round-trip transfer by Sleeping Cabin Train from Cairo to Luxor.",
    options: [
      {
        title: "Option 01",
        rows: [
          {
            city: "Cairo",
            nights: "3 Nights",
            hotel: "Hilton Cairo Grand Nile",
            mealPlan: "Breakfast",
          },
          {
            city: "Luxor",
            nights: "3 Nights",
            hotel: "Steigenberger Nile Palace Hotel Luxor",
            mealPlan: "Breakfast",
          },
        ],
      },
      {
        title: "Option 02",
        rows: [
          {
            city: "Cairo",
            nights: "3 Nights",
            hotel: "Ramses Hilton",
            mealPlan: "Breakfast",
          },
          {
            city: "Luxor",
            nights: "3 Nights",
            hotel: "To be confirmed",
            mealPlan: "Breakfast",
          },
        ],
      },
    ],
    dayByDay: [
      {
        day: "Day 1",
        title: "Arrival in Cairo",
        details: [
          "Pickup from Cairo Airport.",
          "Private transfer to the hotel.",
          "Check-in and overnight in Cairo.",
        ],
      },
      {
        day: "Day 2",
        title: "Cairo Stay",
        details: [
          "Breakfast at the hotel.",
          "Free time in Cairo or optional sightseeing.",
          "Overnight in Cairo.",
        ],
      },
      {
        day: "Day 3",
        title: "Cairo Overnight",
        details: [
          "Breakfast at the hotel.",
          "Free time in Cairo.",
          "Prepare for Luxor transfer.",
          "Overnight in Cairo.",
        ],
      },
      {
        day: "Day 4",
        title: "Sleeping Cabin Train to Luxor",
        details: [
          "Breakfast at the hotel.",
          "Check-out from Cairo hotel.",
          "Transfer to the train station.",
          "Sleeping cabin train from Cairo to Luxor.",
          "Arrival to Luxor and check-in at the hotel.",
        ],
      },
      {
        day: "Day 5",
        title: "Luxor Stay",
        details: [
          "Breakfast at the hotel.",
          "Free time in Luxor.",
          "Optional visit to Luxor temples and Nile area.",
          "Overnight in Luxor.",
        ],
      },
      {
        day: "Day 6",
        title: "Luxor Free Day",
        details: [
          "Breakfast at the hotel.",
          "Free time to explore Luxor.",
          "Optional sightseeing can be arranged with the agency.",
          "Overnight in Luxor.",
        ],
      },
      {
        day: "Day 7",
        title: "Return to Cairo",
        details: [
          "Breakfast at the hotel.",
          "Check-out from Luxor hotel.",
          "Sleeping cabin train transfer back to Cairo.",
          "End of program.",
        ],
      },
    ],
  },
];

export default function Destinations() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSaving, setBookingSaving] = useState(false);
  const [bookingNotice, setBookingNotice] = useState(null);
  const [bookingForm, setBookingForm] = useState(getInitialBookingForm());

  useEffect(() => {
    if (!selectedProgram && !bookingOpen) return;

    const oldBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldBodyOverflow;
    };
  }, [selectedProgram, bookingOpen]);

  const closeProgramPopup = () => {
    setSelectedProgram(null);
    setBookingOpen(false);
    setBookingNotice(null);
  };

  const openBookingPopup = () => {
    if (!selectedProgram) return;

    setBookingForm(getInitialBookingForm(selectedProgram));
    setBookingNotice(null);
    setBookingOpen(true);
  };

  const closeBookingPopup = () => {
    if (bookingSaving) return;

    setBookingOpen(false);
    setBookingNotice(null);
  };

  const updateBookingForm = (field, value) => {
    setBookingForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitBooking = async (e) => {
    e.preventDefault();

    if (!selectedProgram) return;

    if (
      !bookingForm.fullName.trim() ||
      !bookingForm.email.trim() ||
      !bookingForm.phone.trim() ||
      !bookingForm.travelDate ||
      !bookingForm.travelers
    ) {
      setBookingNotice({
        type: "error",
        message: "Please fill all required information.",
      });
      return;
    }

    const payload = {
      type: "package",
      packageName: selectedProgram.title,
      route: selectedProgram.route,
      duration: selectedProgram.duration,
      travelDate: bookingForm.travelDate,
      roomType: bookingForm.roomType,
      fullName: bookingForm.fullName,
      email: bookingForm.email,
      phone: bookingForm.phone,
      travelers: bookingForm.travelers,
      notes: bookingForm.notes,

      search_params: {
        name: selectedProgram.title,
        backendName: selectedProgram.title,
        route: selectedProgram.route,
        duration: selectedProgram.duration,
        travelDate: bookingForm.travelDate,
        travel_date: bookingForm.travelDate,
        roomType: bookingForm.roomType,
        room_type: bookingForm.roomType,
      },

      customer_info: {
        fullName: bookingForm.fullName,
        full_name: bookingForm.fullName,
        email: bookingForm.email,
        phone: bookingForm.phone,
        travelers: bookingForm.travelers,
        notes: bookingForm.notes,
      },
    };

    try {
      setBookingSaving(true);

      await API.post("/reservations", payload);

      setBookingNotice({
        type: "success",
        message: "Booking request sent successfully.",
      });

      setTimeout(() => {
        setBookingOpen(false);
        setSelectedProgram(null);
        setBookingNotice(null);
      }, 1000);
    } catch (err) {
      setBookingNotice({
        type: "error",
        message: err.response?.data?.error || "Unable to send booking request.",
      });
    } finally {
      setBookingSaving(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="destination-page">
        <section
          className="destination-hero"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        >
          <div className="destination-hero-overlay"></div>

          <div className="destination-hero-content">
            <span className="destination-hero-label">
              Egypt Holiday Travel
            </span>

            <h1>Destination Programs</h1>

            <p>
              Explore our Egypt travel files. Each block contains hotel
              accommodation, transfers, and a complete day by day program without
              showing prices.
            </p>

            <div className="destination-hero-stats">
              <div>
                <strong>{PROGRAMS.length}</strong>
                <span>Blocks</span>
              </div>

              <div>
                <strong>Egypt</strong>
                <span>Main Country</span>
              </div>

              <div>
                <strong>No Prices</strong>
                <span>Details Only</span>
              </div>
            </div>
          </div>
        </section>

        <section className="program-section">
          <div className="program-section-head">
            <span>Travel Files</span>

            <h2>Programs</h2>

            <p>
              Every file is displayed as a separate block. Click on a block to
              read all details and book your program.
            </p>
          </div>

          <div className="program-grid">
            {PROGRAMS.map((program, index) => (
              <article
                className="program-card"
                key={index}
                onClick={() => setSelectedProgram(program)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSelectedProgram(program);
                }}
              >
                <div
                  className="program-card-cover"
                  style={{ backgroundImage: `url(${program.image})` }}
                >
                  <div className="program-cover-layer"></div>

                  <span className="program-tag">{program.tag}</span>
                  <span className="program-stamp">{program.stamp}</span>

                  <div className="program-cover-text">
                    <h3>{program.title}</h3>

                    <p>
                      {program.duration} • {program.location}
                    </p>
                  </div>
                </div>

                <div className="program-card-body">
                  <p className="program-short-text">{program.short}</p>

                  <div className="program-card-info">
                    <span>{program.duration}</span>
                    <span>{program.route}</span>
                    <span>Day by Day</span>
                    {program.transfer && <span>Transfer Included</span>}
                  </div>

                  <button
                    type="button"
                    className="program-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProgram(program);
                    }}
                  >
                    View Program
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {selectedProgram && (
        <div className="program-popup-overlay" onClick={closeProgramPopup}>
          <div className="program-popup" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="program-popup-close"
              onClick={closeProgramPopup}
            >
              ×
            </button>

            <div
              className="program-popup-image"
              style={{ backgroundImage: `url(${selectedProgram.image})` }}
            >
              <div className="program-popup-image-overlay"></div>

              <div className="program-popup-image-text">
                <span>{selectedProgram.tag}</span>
                <h3>{selectedProgram.title}</h3>
                <p>
                  {selectedProgram.duration} • {selectedProgram.location}
                </p>
              </div>
            </div>

            <div className="program-popup-content">
              <span className="program-popup-label">Full File Details</span>

              <h2>{selectedProgram.title}</h2>

              <div className="program-summary-box">
                <p>{selectedProgram.short}</p>

                <div>
                  <span>{selectedProgram.duration}</span>
                  <span>{selectedProgram.route}</span>
                  <span>{selectedProgram.location}</span>
                </div>
              </div>

              {selectedProgram.categories && (
                <div className="program-popup-section">
                  <h3>Package Category</h3>

                  <div className="program-category-grid">
                    {selectedProgram.categories.map((item, index) => (
                      <div className="program-category-card" key={index}>
                        <span>{item.name}</span>
                        <p>{item.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProgram.hotels && (
                <div className="program-popup-section">
                  <h3>Hotel Accommodation</h3>

                  <div className="program-table-wrap">
                    <table className="program-table">
                      <thead>
                        <tr>
                          <th>Hotel</th>
                          <th>City</th>
                          <th>Meal Plan</th>
                          <th>Nights</th>
                          <th>Room Type</th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedProgram.hotels.map((hotel, index) => (
                          <tr key={index}>
                            <td>{hotel.hotel}</td>
                            <td>{hotel.city}</td>
                            <td>{hotel.mealPlan}</td>
                            <td>{hotel.nights}</td>
                            <td>{hotel.roomType}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedProgram.transfer && (
                <div className="program-popup-section">
                  <h3>Transfer</h3>

                  <div className="program-transfer-box">
                    {selectedProgram.transfer}
                  </div>
                </div>
              )}

              {selectedProgram.options && (
                <div className="program-popup-section">
                  <h3>Hotel Options</h3>

                  <div className="program-options-grid">
                    {selectedProgram.options.map((option, optionIndex) => (
                      <div className="program-option-card" key={optionIndex}>
                        <h4>{option.title}</h4>

                        <div className="program-table-wrap">
                          <table className="program-table">
                            <thead>
                              <tr>
                                <th>City</th>
                                <th>Nights</th>
                                <th>Hotel</th>
                                <th>Meal Plan</th>
                              </tr>
                            </thead>

                            <tbody>
                              {option.rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                  <td>{row.city}</td>
                                  <td>{row.nights}</td>
                                  <td>{row.hotel}</td>
                                  <td>{row.mealPlan}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProgram.dayByDay && (
                <div className="program-popup-section">
                  <h3>Day by Day Program</h3>

                  <div className="program-timeline">
                    {selectedProgram.dayByDay.map((item, index) => (
                      <div className="program-day-card" key={index}>
                        <div className="program-day-number">{item.day}</div>

                        <div className="program-day-content">
                          <h4>{item.title}</h4>

                          <ul>
                            {item.details.map((detail, detailIndex) => (
                              <li key={detailIndex}>{detail}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProgram.offices && (
                <div className="program-popup-section">
                  <h3>Our Offices</h3>

                  <div className="program-offices">
                    {selectedProgram.offices.map((office, index) => (
                      <p key={index}>{office}</p>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                className="program-popup-btn"
                onClick={openBookingPopup}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {bookingOpen && selectedProgram && (
        <div className="booking-popup-overlay" onClick={closeBookingPopup}>
          <div className="booking-popup" onClick={(e) => e.stopPropagation()}>
            <div className="booking-popup-head">
              <div>
                <span>Egypt Holiday Travel</span>
                <h2>Book Now</h2>
                <p>Fill your information to send your booking request.</p>
              </div>

              <button
                type="button"
                className="booking-popup-close"
                onClick={closeBookingPopup}
                disabled={bookingSaving}
              >
                ×
              </button>
            </div>

            {bookingNotice && (
              <div className={`booking-notice ${bookingNotice.type}`}>
                {bookingNotice.message}
              </div>
            )}

            <form className="booking-form" onSubmit={submitBooking}>
              <div className="booking-form-grid">
                <div className="booking-field booking-full">
                  <label>Selected Program</label>
                  <input
                    type="text"
                    value={selectedProgram.title}
                    readOnly
                    className="booking-readonly"
                  />
                </div>

                <div className="booking-field">
                  <label>Route</label>
                  <input
                    type="text"
                    value={selectedProgram.route}
                    readOnly
                    className="booking-readonly"
                  />
                </div>

                <div className="booking-field">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={selectedProgram.duration}
                    readOnly
                    className="booking-readonly"
                  />
                </div>

                <div className="booking-field">
                  <label>Travel Date *</label>
                  <input
                    type="date"
                    value={bookingForm.travelDate}
                    onChange={(e) =>
                      updateBookingForm("travelDate", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="booking-field">
                  <label>Room Type</label>
                  <select
                    value={bookingForm.roomType}
                    onChange={(e) =>
                      updateBookingForm("roomType", e.target.value)
                    }
                  >
                    <option>Single Room</option>
                    <option>Double Room</option>
                    <option>Triple Room</option>
                    <option>Family Room</option>
                    <option>Suite</option>
                  </select>
                </div>

                <div className="booking-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={bookingForm.fullName}
                    onChange={(e) =>
                      updateBookingForm("fullName", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="booking-field">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={bookingForm.email}
                    onChange={(e) =>
                      updateBookingForm("email", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="booking-field">
                  <label>Phone *</label>
                  <input
                    type="text"
                    placeholder="Enter your phone"
                    value={bookingForm.phone}
                    onChange={(e) =>
                      updateBookingForm("phone", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="booking-field">
                  <label>Travelers *</label>
                  <input
                    type="number"
                    min="1"
                    value={bookingForm.travelers}
                    onChange={(e) =>
                      updateBookingForm("travelers", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="booking-field booking-full">
                  <label>Notes</label>
                  <textarea
                    placeholder="Write any special request..."
                    value={bookingForm.notes}
                    onChange={(e) =>
                      updateBookingForm("notes", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="booking-popup-actions">
                <button
                  type="submit"
                  className="booking-submit-btn"
                  disabled={bookingSaving}
                >
                  {bookingSaving ? "Sending..." : "Send Booking Request"}
                </button>

                <button
                  type="button"
                  className="booking-cancel-btn"
                  onClick={closeBookingPopup}
                  disabled={bookingSaving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}