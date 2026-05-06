import { useEffect, useRef, useState } from "react";
import "./Home.css";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

/* IMAGES */
import cairoCover from "../assets/image/cairo.jpeg";
import cairoImg from "../assets/image/egy.png";
import dahabImg from "../assets/image/dahab.jpeg";
import sharmImg from "../assets/image/sharm.jpeg";
import bgImg from "../assets/image/bg.png";
import LuxorImg from "../assets/image/Luxor.jpg";
import pyra from "../assets/image/pyra.png";
import uzbekistan from "../assets/image/uzbekistan.jpg";
import hurghad from "../assets/image/hurghad.jpg";
import turkey from "../assets/image/turkey.jpg";

/* CUSTOMERS */
import customer1 from "../assets/image/sara.png";
import customer2 from "../assets/image/ahmed.png";
import customer3 from "../assets/image/lara.png";

export default function Home() {
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  const destinations = [
    { name: "Cairo", desc: "Explore Egypt", img: cairoCover },
    { name: "Dahab", desc: "Explore Egypt", img: dahabImg },
    { name: "Sharm El Sheikh", desc: "Explore Egypt", img: sharmImg },
    { name: "Luxor", desc: "Explore Egypt", img: LuxorImg },
    
  ];

  const packages = [{ name: "Uzbekistan", desc: "Explore Central Asia", img: uzbekistan },
    { name: "Hurghada", desc: "Explore Egypt", img: hurghad },
    { name: "Turkey", desc: "Explore Turkey", img: turkey },
  ];

  const locations = [
    "Cairo International Airport – Cairo, Egypt",
    "Hurghada International Airport – Hurghada, Egypt",
    "Sharm El Sheikh International Airport – Sharm El Sheikh, Egypt",
    "Luxor International Airport – Luxor, Egypt",
    "Borg El Arab Airport – Alexandria, Egypt",
    "Tunis-Carthage Airport – Tunis, Tunisia",
    "Charles de Gaulle Airport – Paris, France",
    "Fiumicino Airport – Rome, Italy",
    "Istanbul Airport – Istanbul, Turkey",
    "Dubai International Airport – Dubai, UAE",
    "King Abdulaziz Airport – Jeddah, Saudi Arabia",
  ];

  const [fromCountry, setFromCountry] = useState("Egypt");
  const [toCountry, setToCountry] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showTravellersDropdown, setShowTravellersDropdown] = useState(false);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const travellersRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (fromRef.current && !fromRef.current.contains(event.target)) {
        setShowFromDropdown(false);
      }

      if (toRef.current && !toRef.current.contains(event.target)) {
        setShowToDropdown(false);
      }

      if (
        travellersRef.current &&
        !travellersRef.current.contains(event.target)
      ) {
        setShowTravellersDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const infoSection = document.getElementById("info");

      if (infoSection) {
        const rect = infoSection.getBoundingClientRect();

        if (rect.top <= window.innerHeight / 1.25) {
          setShowButton(true);
        } else {
          setShowButton(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSwap = () => {
    const temp = fromCountry;
    setFromCountry(toCountry);
    setToCountry(temp);
  };

  const increaseAdults = (e) => {
    e.stopPropagation();
    setAdults((prev) => prev + 1);
  };

  const decreaseAdults = (e) => {
    e.stopPropagation();
    setAdults((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increaseChildren = (e) => {
    e.stopPropagation();
    setChildren((prev) => prev + 1);
  };

  const decreaseChildren = (e) => {
    e.stopPropagation();
    setChildren((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleBookNow = () => {
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page">
      <section className="hero-section" id="hero">
        <Navbar />

        <img src={bgImg} alt="Egypt" className="hero-image" />
        <div className="hero-overlay"></div>

        <div className="flight-search">
          <div className="trip-type">
            <select>
              <option>Return</option>
              <option>One way</option>
            </select>
          </div>

          <div className="search-row">
            <div
              className="search-card from-card dropdown-card"
              ref={fromRef}
              onClick={() => {
                setShowFromDropdown((prev) => !prev);
                setShowToDropdown(false);
                setShowTravellersDropdown(false);
              }}
            >
              <span className="label">From</span>
              <h3>{fromCountry || "Select airport"}</h3>

              {showFromDropdown && (
                <div className="search-dropdown">
                  {locations.map((location, index) => (
                    <div
                      key={index}
                      className="search-dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFromCountry(location);
                        setShowFromDropdown(false);
                      }}
                    >
                      {location}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="swap-btn" onClick={handleSwap}></div>

            <div
              className="search-card dropdown-card"
              ref={toRef}
              onClick={() => {
                setShowToDropdown((prev) => !prev);
                setShowFromDropdown(false);
                setShowTravellersDropdown(false);
              }}
            >
              <span className="label">To</span>
              <h3 className={toCountry ? "" : "light-text"}>
                {toCountry || "Airport, city or country"}
              </h3>

              {showToDropdown && (
                <div className="search-dropdown">
                  {locations.map((location, index) => (
                    <div
                      key={index}
                      className="search-dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setToCountry(locations);
                        setShowToDropdown(false);
                      }}
                    >
                      {locations}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="search-card">
              <span className="label">Check in</span>
              <input type="date" />
            </div>

            <div className="search-card">
              <span className="label">Check out</span>
              <input type="date" />
            </div>

            <div
              className="search-card travellers-card dropdown-card"
              ref={travellersRef}
              onClick={() => {
                setShowTravellersDropdown((prev) => !prev);
                setShowFromDropdown(false);
                setShowToDropdown(false);
              }}
            >
              <span className="label">Travellers</span>
              <h3>
                {adults} Adult{adults > 1 ? "s" : ""}
                {children > 0
                  ? `, ${children} Child${children > 1 ? "ren" : ""}`
                  : ""}
              </h3>

              {showTravellersDropdown && (
                <div
                  className="travellers-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="traveller-item">
                    <div className="traveller-info">
                      <h4>Adultes</h4>
                      <span>18 ans et plus</span>
                    </div>

                    <div className="traveller-counter">
                      <button type="button" onClick={decreaseAdults}>
                        −
                      </button>
                      <span>{adults}</span>
                      <button type="button" onClick={increaseAdults}>
                        +
                      </button>
                    </div>
                  </div>

                  <div className="traveller-item">
                    <div className="traveller-info">
                      <h4>Enfants</h4>
                      <span>0 à 17 ans</span>
                    </div>

                    <div className="traveller-counter">
                      <button type="button" onClick={decreaseChildren}>
                        −
                      </button>
                      <span>{children}</span>
                      <button type="button" onClick={increaseChildren}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="search-btn" type="button">
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="info-section" id="info">
        <h2>Information About Egypt</h2>

        <div className="info-layout">
          <div className="info-side left-side">
            <div
              className="info-block clickable-info"
              onClick={() => navigate("/basic-facts")}
            >
              <h3>Basic Facts</h3>
              <ul>
                <li>Egypt is in Northeast Africa</li>
                <li>Capital: Cairo</li>
                <li>Language: Arabic</li>
                <li>Currency: Egyptian Pound (EGP)</li>
              </ul>

              <button
                className="read-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/basic-facts");
                }}
              >
                Read More →
              </button>
            </div>

            <div
              className="info-block clickable-info"
              onClick={() => navigate("/history")}
            >
              <h3>History</h3>
              <ul>
                <li>Over 5,000 years old</li>
                <li>Famous for pyramids and pharaohs</li>
                <li>Influenced by Greek, Roman, and Islamic cultures</li>
              </ul>

              <button
                className="read-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/history");
                }}
              >
                Read More →
              </button>
            </div>

            <div
              className="info-block clickable-info"
              onClick={() => navigate("/geography")}
            >
              <h3>Geography</h3>
              <ul>
                <li>Nile River is the main river</li>
                <li>Includes Nile Valley, deserts, Sinai, Red Sea</li>
              </ul>

              <button
                className="read-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/geography");
                }}
              >
                Read More →
              </button>
            </div>
          </div>

          <div className="cinematic-card">
            <img
              src={cairoImg}
              alt="Egypt statue"
              className="cinematic-image"
            />
            <span className="cinematic-light"></span>
          </div>

          <div className="info-side right-side">
            <div
              className="info-block clickable-info"
              onClick={() => navigate("/destinations-info")}
            >
              <h3>Cities & Destinations</h3>
              <ul>
                <li>Cairo</li>
                <li>Alexandria</li>
                <li>Luxor</li>
                <li>Aswan</li>
                <li>Sharm El Sheikh</li>
              </ul>

              <button
                className="read-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/destinations-info");
                }}
              >
                Read More →
              </button>
            </div>

            <div
              className="info-block clickable-info"
              onClick={() => navigate("/activities")}
            >
              <h3>Activities</h3>
              <ul>
                <li>Visit monuments</li>
                <li>Nile cruises</li>
                <li>Diving in the Red Sea</li>
                <li>Desert safari</li>
              </ul>

              <button
                className="read-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/activities");
                }}
              >
                Read More →
              </button>
            </div>

            <div
              className="info-block clickable-info"
              onClick={() => navigate("/food")}
            >
              <h3>Food</h3>
              <ul>
                <li>Koshari</li>
                <li>Ful medames</li>
                <li>Molokhia</li>
                <li>Fattah</li>
              </ul>
              <button
                className="read-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/food");
                }}
              >
                Read More →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="destinations-section" id="destinations">
        <h2 className="section-title">Top Destinations</h2>

        <div className="destinations-grid">
          {destinations.map((item, index) => (
            <div key={index} className="destination-card-new">
              <img src={item.img} alt={item.name} />
              <div className="card-overlay"></div>
              <div className="card-text">
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-packages-section">
        <h2>Featured Packages</h2>

        <div className="featured-packages-grid">
          <div className="featured-package-card">
            <img src={packages[0].img} alt={packages[0].name} />
            <h3>Cart 1</h3>
            <h4>{packages[0].name} Trip</h4>
            <button type="button">View details</button>
          </div>

          <div className="featured-package-card">
            <img src={packages[1].img} alt={packages[1].name} />
            <h3>Cart 2</h3>
            <h4>{packages[1].name}</h4>
            <button type="button">View details</button>
          </div>

          <div className="featured-package-card">
            <img src={packages[2].img} alt={packages[2].name} />
            <h3>Cart 3</h3>
            <h4>{packages[2].name} Trip</h4>
            <button type="button">View details</button>
          </div>
        </div>
      </section>

      <section className="features-strip">
        <div className="feature-item">
          <div className="feature-icon">🛡️</div>
          <h3>Trust</h3>
          <p>Trusted Global Brand</p>
        </div>

        <div className="feature-divider"></div>

        <div className="feature-item">
          <div className="feature-icon">⏱️</div>
          <h3>Speed</h3>
          <p>Fast & Efficient Booking</p>
        </div>

        <div className="feature-divider"></div>

        <div className="feature-item">
          <div className="feature-icon">📍</div>
          <h3>Experience</h3>
          <p>Expert Local Guides</p>
        </div>

        <div className="feature-divider"></div>

        <div className="feature-item">
          <div className="feature-icon">🎧</div>
          <h3>Support</h3>
          <p>24/7 Customer Support</p>
        </div>
      </section>

      <section className="why-section">
        <div className="why-left">
          <h2>Why Visit Egypt?</h2>
          <p>
            Egypt offers history, beaches, and adventure at an affordable price,
            making it a unique travel destination.
          </p>

          <h2>Why Choose Us</h2>
          <ul>
            <li>1 - Experienced travel experts</li>
            <li>2 - Personalized travel packages</li>
            <li>3 - Professional and friendly team</li>
            <li>4 - Attention to every detail for a perfect trip</li>
          </ul>
        </div>

        <div className="why-right">
          <img src={dahabImg} alt="Travel" />
        </div>
      </section>

      <section className="testimonials-section">
        <h2>Customers Say</h2>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-top">
              <img src={customer1} alt="Sarah M." className="customer-img" />
              <div className="testimonial-user-info">
                <h4>Sarah M.</h4>
                <div className="stars">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p>
              Everything Was Perfectly Organized. The Team Made Our Trip Easy,
              Safe, And Full Of Beautiful Moments. Highly Recommended !
            </p>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-top">
              <img src={customer2} alt="Ahmed K" className="customer-img" />
              <div className="testimonial-user-info">
                <h4>Ahmed K</h4>
                <div className="stars">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p>
              Great experience! The communication was clear, and every
              destination was exactly as described. Excellent service.
            </p>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-top">
              <img src={customer3} alt="Laura P." className="customer-img" />
              <div className="testimonial-user-info">
                <h4>Laura P.</h4>
                <div className="stars">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p>
              I discovered Egypt in a completely new way. The planning, timing,
              and professionalism were outstanding
            </p>
          </div>
        </div>
      </section>

      <section className="newsletter-pro">
        <div className="newsletter-pro-left">
          <img src={pyra} alt="Pyramids" className="newsletter-pro-image" />
        </div>

        <div className="newsletter-pro-right">
          <div className="newsletter-pro-mail">✉</div>

          <h2 className="newsletter-pro-title">
            Ready To Explore
            <br />
            <span>Egypt?</span>
          </h2>

          <div className="newsletter-pro-route">
            <svg
              className="route-svg"
              viewBox="0 0 260 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 80 C 70 20, 120 120, 160 55 S 235 20, 245 65"
                fill="none"
                stroke="#2b1c14"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                strokeLinecap="round"
              />
            </svg>

            <span className="route-plane">✈</span>
          </div>

          <div className="newsletter-pro-subtitle">
            Start Your Journey With Us
          </div>

          <p className="newsletter-pro-text">
            Get exclusive travel deals, hidden destinations, and expert tips
            straight to your inbox. Your next adventure starts here.
          </p>

          <form className="newsletter-pro-form">
            <input type="email" placeholder="Enter your email address..." />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-col">
            <h2 className="footer-logo">Egypt Holiday</h2>
            <p className="footer-desc">
              Discover Egypt with us. We offer the best travel experiences,
              luxury packages, and unforgettable adventures.
            </p>

            <div className="footer-social">
              <a
                href="https://www.facebook.com/share/18deN5D3jr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>

              <a
                href="https://www.instagram.com/egyptholidaytravel0?igsh=OXVtdjM4YWF0N3Fz"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>

              <a
                href="https://wa.me/201099999234"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp"></i>
              </a>

              <a
                href="https://www.tiktok.com/@egyptholiday.travel"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h3>Company</h3>
            <a href="#hero">Home</a>
            <a href="/packages">Packages</a>
            <a href="#">Hotels</a>
            <a href="#">Flights</a>
          </div>

          <div className="footer-col">
            <h3>Support</h3>
            <a href="#">Reservation Info</a>
            <a href="#">Cancellation Policy</a>
            <a href="#">Terms & Conditions</a>
          </div>

          <div className="footer-col contact-col">
            <h3>Contact</h3>

            <div className="contact-block">
              <div className="contact-icon">📞</div>
              <div className="contact-text">
                <p>01099999234</p>
                <p>01050971444</p>
                <p>01050383173</p>
                <p>0111787867</p>
              </div>
            </div>

            <div className="contact-block">
              <div className="contact-icon">📍</div>
              <div className="contact-text">
                <p>El-Siiz Area, next to El-Eman Mosque</p>
                <p>Mansoura Branch</p>
                <p>22 Abou Dawoud El Zahery Street</p>
                <p>Next to Arab Investment Bank</p>
                <p>Nasr City, Cairo, Egypt</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 Egypt Holiday Travel — All rights reserved
        </div>
      </footer>

      {showButton && (
        <button className="book-now-btn" onClick={handleBookNow}>
          Book Now
        </button>
      )}
    </div>
  );
}
