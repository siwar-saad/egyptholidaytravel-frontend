import { useEffect, useState } from "react";
import API from "../../api";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "./Hotels.css";

import heroImg from "../../assets/image/bghotel.jpg";

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const [bookingData, setBookingData] = useState({
    fullName: "",
    email: "",
    phone: "",
    travelers: "",
    checkIn: "",
    checkOut: "",
    roomType: "Single Room",
    notes: "",
  });

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const response = await API.get("/hotels");
        setHotels(response.data || []);
      } catch (error) {
        console.error("Unable to load hotels", error.response?.data || error.message);
      }
    };

    loadHotels();
  }, []);

  const openHotel = (hotel) => {
    setSelectedHotel(hotel);
    setMainImage(hotel.image);
    setShowBookingForm(false);
  };

  const closeHotel = () => {
    setSelectedHotel(null);
    setMainImage(null);
    setShowBookingForm(false);
  };

  const handleBookingSubmit = async () => {
    if (!selectedHotel) return;

    if (
      !bookingData.fullName ||
      !bookingData.email ||
      !bookingData.phone ||
      !bookingData.travelers ||
      !bookingData.checkIn ||
      !bookingData.checkOut
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const response = await API.post("/hotels/reserve", {
        hotel: {
          name: selectedHotel.name,
          city: selectedHotel.city,
          mealPlan: selectedHotel.meal,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          roomType: bookingData.roomType,
        },

        customerInfo: {
          fullName: bookingData.fullName,
          email: bookingData.email,
          phone: bookingData.phone,
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

      alert("Booking request sent successfully.");

      setBookingData({
        fullName: "",
        email: "",
        phone: "",
        travelers: "",
        checkIn: "",
        checkOut: "",
        roomType: "Single Room",
        notes: "",
      });

      setShowBookingForm(false);
      setSelectedHotel(null);
      setMainImage(null);
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Booking request failed.");
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

        <HotelSection
          title="Our Hotels"
          subtitle="Discover our best hotels across Egypt"
          hotels={hotels}
          onSelect={openHotel}
        />

        {selectedHotel && (
          <HotelModal
            hotel={selectedHotel}
            mainImage={mainImage}
            setMainImage={setMainImage}
            onClose={closeHotel}
            onBook={() => setShowBookingForm(true)}
          />
        )}

        {showBookingForm && selectedHotel && (
          <BookingForm
            hotel={selectedHotel}
            bookingData={bookingData}
            setBookingData={setBookingData}
            onClose={() => setShowBookingForm(false)}
            onSubmit={handleBookingSubmit}
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
              <img src={hotel.image} alt={hotel.name || "Hotel"} />

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
  const gallery = hotel.gallery || [];
  const periods = hotel.periods || [];

  return (
    <div className="hotel-modal">
      <div className="hotel-modal-box">
        <button type="button" className="close-modal" onClick={onClose}>
          ×
        </button>

        <div className="modal-img">
          <img src={mainImage || hotel.image} alt={hotel.name || "Hotel"} />
        </div>

        <div className="modal-content">
          <span className="modal-city">{hotel.city || "Egypt"}</span>

          <h2>{hotel.name || "Hotel"}</h2>

          {gallery.length > 0 && (
            <div className="hotel-gallery">
              {gallery.map((img, index) => (
                <img
                  key={`${hotel.name}-gallery-${index}`}
                  src={img}
                  alt={hotel.name || "Hotel gallery"}
                  onClick={() => setMainImage(img)}
                  className={(mainImage || hotel.image) === img ? "active-thumb" : ""}
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
              <strong>Travel Periods:</strong> {periods.length} available periods
            </p>
          </div>

          <div className="modal-prices">
            <h4>Rates & Travel Periods</h4>

            {periods.length === 0 ? (
              <p className="empty-msg">No periods available.</p>
            ) : (
              periods.map((period, index) => (
                <div className="period-card" key={`${hotel.name}-period-${index}`}>
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

function BookingForm({ hotel, bookingData, setBookingData, onClose, onSubmit }) {
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
            onChange={(e) =>
              setBookingData({ ...bookingData, fullName: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email Address"
            value={bookingData.email}
            onChange={(e) =>
              setBookingData({ ...bookingData, email: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Phone Number / WhatsApp"
            value={bookingData.phone}
            onChange={(e) =>
              setBookingData({ ...bookingData, phone: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Number of Travelers"
            value={bookingData.travelers}
            onChange={(e) =>
              setBookingData({ ...bookingData, travelers: e.target.value })
            }
          />

          <input
            type="date"
            value={bookingData.checkIn}
            onChange={(e) =>
              setBookingData({ ...bookingData, checkIn: e.target.value })
            }
          />

          <input
            type="date"
            value={bookingData.checkOut}
            onChange={(e) =>
              setBookingData({ ...bookingData, checkOut: e.target.value })
            }
          />

          <select
            value={bookingData.roomType}
            onChange={(e) =>
              setBookingData({ ...bookingData, roomType: e.target.value })
            }
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
            onChange={(e) =>
              setBookingData({ ...bookingData, notes: e.target.value })
            }
          />

          <button type="button" className="submit-booking" onClick={onSubmit}>
            Send Booking Request
          </button>
        </div>
      </div>
    </div>
  );
}