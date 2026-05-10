import { useState } from "react";
import Navbar from "../../components/navbar";
import "./Hotels.css";

import heroImg from "../../assets/image/bghotel.jpg";

/* HOTEL 1 */
import hotel1 from "../../assets/image/hotel1-1.jpg";
import hotel1a from "../../assets/image/hotel1-2.jpg";
import hotel1b from "../../assets/image/hotel1-3.jpg";
import hotel1c from "../../assets/image/hotel1-4.jpg";
import hotel1d from "../../assets/image/hotel1-5.jpg";
import hotel1e from "../../assets/image/hotel1-6.jpg";
import hotel1f from "../../assets/image/hotel1-7.jpg";
import hotel1g from "../../assets/image/hotel1-8.jpg";
import hotel1h from "../../assets/image/hotel1-9.jpg";
import hotel1k from "../../assets/image/hotel1-11.jpg";
import hotel1l from "../../assets/image/hotel1-22.jpg";
import hotel1m from "../../assets/image/hotel1-23.jpg";
import hotel1n from "../../assets/image/hotel1.jpg";
import hotel1q from "../../assets/image/hotel111.jpg";

/* HOTEL 2 */
import hotel2 from "../../assets/image/safir1.jpg";
import hotel2a from "../../assets/image/safir.jpg";
import hotel2c from "../../assets/image/safir2.jpg";
import hotel2d from "../../assets/image/safir3.jpg";
import hotel2e from "../../assets/image/safir4.jpg";
import hotel2f from "../../assets/image/safir5.jpg";
import hotel2g from "../../assets/image/safir6.jpg";
import hotel2h from "../../assets/image/safir7.jpg";
import hotel2k from "../../assets/image/safir8.jpg";
import hotel2l from "../../assets/image/safir9.jpg";
import hotel2m from "../../assets/image/safir10.jpg";

/* HOTEL 3 */
import hotel3 from "../../assets/image/charmillion.jpg";
import hotel3a from "../../assets/image/charmillion1.jpg";
import hotel3b from "../../assets/image/charmillion2.jpg";
import hotel3c from "../../assets/image/charmillion3.jpg";
import hotel3d from "../../assets/image/charmillion4.jpg";
import hotel3e from "../../assets/image/charmillion5.jpg";
import hotel3f from "../../assets/image/charmillion6.jpg";
import hotel3g from "../../assets/image/charmillion7.jpg";
import hotel3h from "../../assets/image/charmillion8.jpg";
import hotel3k from "../../assets/image/charmillion9.jpg";
import hotel3l from "../../assets/image/charmillion10.jpg";
import hotel3m from "../../assets/image/charmillion11.jpg";
import hotel3n from "../../assets/image/charmillion12.jpg";

/* HOTEL 4 */
import hotel4 from "../../assets/image/Park.jpg";
import hotel4a from "../../assets/image/Park1.jpg";
import hotel4b from "../../assets/image/Park2.jpg";
import hotel4c from "../../assets/image/Park3.jpg";
import hotel4d from "../../assets/image/Park4.jpg";
import hotel4e from "../../assets/image/Park5.jpg";
import hotel4f from "../../assets/image/Park6.jpg";
import hotel4g from "../../assets/image/Park7.jpg";
import hotel4h from "../../assets/image/Park8.jpg";
import hotel4k from "../../assets/image/Park9.jpg";
import hotel4l from "../../assets/image/Park10.jpg";
import hotel4m from "../../assets/image/Park11.jpg";
import hotel4n from "../../assets/image/Park12.jpg";

const sharmHotels = [
  {
    image: hotel1,
    gallery: [hotel1, hotel1a, hotel1b, hotel1c, hotel1d, hotel1e, hotel1f, hotel1g, hotel1h, hotel1k, hotel1l, hotel1m, hotel1n, hotel1q],
    name: "Renaissance Sharm El Sheikh",
    nights: "3 Nights",
    city: "Sharm El Sheikh",
    meal: "Soft All Inclusive",
    single: "705 USD",
    double: "410 USD",
    triple: "375 USD",
  },
  {
    image: hotel2,
    gallery: [hotel2, hotel2a, hotel2c, hotel2d, hotel2e, hotel2f, hotel2g, hotel2h, hotel2k, hotel2l, hotel2m],
    name: "Safir Sharm Waterfalls Resort",
    nights: "3 Nights",
    city: "Sharm El Sheikh",
    meal: "Soft All Inclusive",
    single: "720 USD",
    double: "425 USD",
    triple: "903 USD",
  },
  {
    image: hotel3,
    gallery: [hotel3, hotel3a, hotel3b, hotel3c, hotel3d, hotel3e, hotel3f, hotel3g, hotel3h, hotel3k, hotel3l, hotel3m, hotel3n],
    name: "Charmillion Gardens Aqua Park",
    nights: "3 Nights",
    city: "Sharm El Sheikh",
    meal: "Soft All Inclusive",
    single: "815 USD",
    double: "485 USD",
    triple: "450 USD",
  },
  {
    image: hotel4,
    gallery: [hotel4, hotel4a, hotel4b, hotel4c, hotel4d, hotel4e, hotel4f, hotel4g, hotel4h, hotel4k, hotel4l, hotel4m, hotel4n],
    name: "Park Regency Resort",
    nights: "3 Nights",
    city: "Sharm El Sheikh",
    meal: "Soft All Inclusive",
    single: "840 USD",
    double: "500 USD",
    triple: "480 USD",
  },
];

const cairoHotels = [
  {
    image: hotel1,
    gallery: [hotel1, hotel1a, hotel1b, hotel1c, hotel1d, hotel1e, hotel1f, hotel1g, hotel1h, hotel1k, hotel1l, hotel1m, hotel1n, hotel1q],
    name: "Holiday Inn Cairo Citystars",
    nights: "2 Nights",
    city: "Cairo",
    meal: "Breakfast",
    single: "705 USD",
    double: "410 USD",
    triple: "375 USD",
  },
  {
    image: hotel2,
    gallery: [hotel2, hotel2a, hotel2c, hotel2d, hotel2e, hotel2f, hotel2g, hotel2h, hotel2k, hotel2l, hotel2m],
    name: "Holiday Inn Cairo Citystars",
    nights: "2 Nights",
    city: "Cairo",
    meal: "Breakfast",
    single: "720 USD",
    double: "425 USD",
    triple: "903 USD",
  },
  {
    image: hotel3,
    gallery: [hotel3, hotel3a, hotel3b, hotel3c, hotel3d, hotel3e, hotel3f, hotel3g, hotel3h, hotel3k, hotel3l, hotel3m, hotel3n],
    name: "Hilton Cairo Heliopolis",
    nights: "3 Nights",
    city: "Cairo",
    meal: "Half Board",
    single: "430 USD",
    double: "320 USD",
    triple: "290 USD",
  },
];

function HotelSection({ title, subtitle, hotels, onSelect }) {
  return (
    <div className="hotel-section">
      <div className="hotel-section-head">
        <span>Premium Hotels</span>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="hotels-grid">
        {hotels.map((hotel, index) => (
          <div
            className="hotel-cover-card"
            key={index}
            onClick={() => onSelect(hotel)}
          >
            <img src={hotel.image} alt={hotel.name} />

            <div className="hotel-cover-overlay">
              <span>{hotel.city}</span>
              <h3>{hotel.name}</h3>
              <button>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hotels() {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  const openHotel = (hotel) => {
    setSelectedHotel(hotel);
    setMainImage(hotel.image);
  };

  const closeHotel = () => {
    setSelectedHotel(null);
    setMainImage(null);
  };

  return (
    <>
      <Navbar />

      <section className="hotels-page">
        <div
          className="hotels-hero"
          style={{
            backgroundImage: `linear-gradient(rgba(42,33,23,.55), rgba(42,33,23,.55)), url(${heroImg})`,
          }}
        >
          <span>Egypt Holiday Travel</span>

          <h1>Our Partner Hotels</h1>

          <p>
            Discover premium hotels with elegant comfort, luxury experiences,
            and carefully selected stays for your perfect holiday in Egypt.
          </p>
        </div>

        <HotelSection
          title="Hotels in Sharm El Sheikh"
          subtitle="Luxury beach resorts, Red Sea views, and unforgettable relaxing stays."
          hotels={sharmHotels}
          onSelect={openHotel}
        />

        <HotelSection
          title="Hotels in Cairo"
          subtitle="Premium city hotels close to culture, shopping, and iconic landmarks."
          hotels={cairoHotels}
          onSelect={openHotel}
        />

        {selectedHotel && (
          <div className="hotel-modal">
            <div className="hotel-modal-box">
              <button className="close-modal" onClick={closeHotel}>
                ×
              </button>

              <div className="modal-img">
                <img src={mainImage} alt={selectedHotel.name} />
              </div>

              <div className="modal-content">
                <span className="modal-city">{selectedHotel.city}</span>

                <h2>{selectedHotel.name}</h2>

                <div className="hotel-gallery">
                  {selectedHotel.gallery.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={selectedHotel.name}
                      onClick={() => setMainImage(img)}
                      className={mainImage === img ? "active-thumb" : ""}
                    />
                  ))}
                </div>

                <div className="modal-info">
                  <p>
                    <strong>Nights:</strong> {selectedHotel.nights}
                  </p>

                  <p>
                    <strong>City:</strong> {selectedHotel.city}
                  </p>

                  <p>
                    <strong>Meal Plan:</strong> {selectedHotel.meal}
                  </p>
                </div>

                <div className="modal-prices">
                  <h4>Package Per Pax</h4>

                  <div className="price-line">
                    <span>In Single Room</span>
                    <b>{selectedHotel.single}</b>
                  </div>

                  <div className="price-line">
                    <span>In Double Room</span>
                    <b>{selectedHotel.double}</b>
                  </div>

                  <div className="price-line">
                    <span>In Triple Room</span>
                    <b>{selectedHotel.triple}</b>
                  </div>
                </div>

                <button className="book-btn">Book This Hotel</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}