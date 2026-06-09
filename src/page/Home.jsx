import { useEffect, useState } from "react";
import "./Home.css";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { FaSuitcaseRolling } from "react-icons/fa";
import API from "../api";
import Footer from "../components/footer";

import HomeInfoSection from "./homeInfo/HomeInfoSection";
import InfoPopup from "./homeInfo/InfoPopup";

/* IMAGES */
import cairoCover from "../assets/image/cairo.jpeg";
import dahabImg from "../assets/image/dahab.jpeg";
import sharmImg from "../assets/image/sharm.jpeg";
import bgImg from "../assets/image/bg.png";
import LuxorImg from "../assets/image/Luxor.jpg";
import pyra from "../assets/image/pyra.png";

/* FEATURED PACKAGES IMAGES */
import cairoHurghadaPackage from "../assets/image/cairo-hurghada1.png";
import cairoSharmPackage from "../assets/image/cairo-sharm.png";
import cairoLuxorPackage from "../assets/image/cairo-luxor2.png";


const SITE_NAME = "Egypt Holiday Travel";
const SITE_URL = "https://egyptholidaytravel.com/";
const SITE_DESCRIPTION =
  "Egypt Holiday Travel offers personalized travel packages, hotels, tours, and holiday experiences across Egypt.";

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
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
};

const getHotelUniqueId = (hotel, index = 0) => {
  return String(
    hotel.id ||
      hotel._id ||
      hotel.hotelId ||
      `${hotel.name || "hotel"}-${hotel.city || "city"}-${index}`
  );
};

const selectTopHotelsByDestination = (hotelsData = []) => {
  const destinationsWanted = [
    {
      label: "Sharm El Sheikh",
      keywords: ["sharm", "sharm el sheikh"],
    },
    {
      label: "Cairo",
      keywords: ["cairo"],
    },
    {
      label: "Hurghada",
      keywords: ["hurghada"],
    },
    {
      label: "Dahab",
      keywords: ["dahab"],
    },
  ];

  const selectedHotels = [];
  const usedIds = new Set();

  destinationsWanted.forEach((destination) => {
    const foundHotel = hotelsData.find((hotel, index) => {
      const hotelId = getHotelUniqueId(hotel, index);

      if (usedIds.has(hotelId)) return false;

      const hotelText = normalizeText(
        `${hotel.name || ""} ${hotel.title || ""} ${hotel.city || ""} ${
          hotel.group_title || ""
        } ${hotel.group_subtitle || ""}`
      );

      return destination.keywords.some((keyword) =>
        hotelText.includes(normalizeText(keyword))
      );
    });

    if (foundHotel) {
      const foundIndex = hotelsData.indexOf(foundHotel);
      usedIds.add(getHotelUniqueId(foundHotel, foundIndex));
      selectedHotels.push(foundHotel);
    }
  });

  if (selectedHotels.length < 4) {
    hotelsData.forEach((hotel, index) => {
      const hotelId = getHotelUniqueId(hotel, index);

      if (!usedIds.has(hotelId) && selectedHotels.length < 4) {
        usedIds.add(hotelId);
        selectedHotels.push(hotel);
      }
    });
  }

  return selectedHotels.slice(0, 4);
};

const REVIEW_META = [
  {
    code: "tn",
    country: "Tunisia",
  },
  {
    code: "tr",
    country: "Turkey",
  },
  {
    code: "ma",
    country: "Morocco",
  },
];

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    text: "Everything was perfectly organized. The team made our trip easy, safe, and full of beautiful moments. Highly recommended!",
    code: "tn",
    country: "Tunisia",
  },
  {
    id: 2,
    name: "Emre Y.",
    rating: 5,
    text: "Great experience! The communication was clear, and every destination was exactly as described. Excellent service.",
    code: "tr",
    country: "Turkey",
  },
  {
    id: 3,
    name: "Laura P.",
    rating: 5,
    text: "I discovered Egypt in a completely new way. The planning, timing, and professionalism were outstanding.",
    code: "ma",
    country: "Morocco",
  },
];

const getReviewData = (review, index) => {
  const meta = REVIEW_META[index % REVIEW_META.length];
  const code = getFlagCode(review.code || review.flag || review.country || meta.code);

  return {
    ...review,
    code,
    country: review.country || meta.country,
  };
};

const getFlagCode = (value = "") => {
  const clean = String(value).trim().toLowerCase();

  if (clean.includes("🇹🇳") || clean.includes("tunisia") || clean === "tn") {
    return "tn";
  }

  if (clean.includes("🇹🇷") || clean.includes("turkey") || clean === "tr") {
    return "tr";
  }

  if (clean.includes("🇲🇦") || clean.includes("morocco") || clean === "ma") {
    return "ma";
  }

  return REVIEW_META[0].code;
};

const renderStars = (rating) => {
  const value = Math.max(1, Math.min(5, Number(rating) || 5));

  return Array.from({ length: 5 }).map((_, index) => (
    <span key={index} className={index < value ? "active" : ""}>
      ★
    </span>
  ));
};

export default function Home() {
  const navigate = useNavigate();

  const [showButton, setShowButton] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [openWhy, setOpenWhy] = useState(null);

  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [topHotels, setTopHotels] = useState([]);

  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    text: "",
  });

  const [reviewPopup, setReviewPopup] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const destinations = [
    { name: "Cairo", desc: "Explore Egypt", img: cairoCover },
    { name: "Dahab", desc: "Explore Egypt", img: dahabImg },
    { name: "Sharm El Sheikh", desc: "Explore Egypt", img: sharmImg },
    { name: "Luxor", desc: "Explore Egypt", img: LuxorImg },
  ];

  const packages = [
    {
      name: "Cairo – Hurghada",
      desc: "Cairo & Red Sea Package",
      img: cairoHurghadaPackage,
      packageId: "cairo-hurghada-5",
    },
    {
      name: "Cairo – Sharm El Sheikh",
      desc: "6 Days / 5 Nights Program",
      img: cairoSharmPackage,
      packageId: "cairo-sharm-6-days",
    },
    {
      name: "Cairo – Luxor",
      desc: "Ancient Egypt & Nile Package",
      img: cairoLuxorPackage,
      packageId: "cairo-luxor-6",
    },
  ];

  useEffect(() => {
    document.title = SITE_NAME;

    const setMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    const setPropertyMeta = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    const setLink = (rel, href) => {
      let link = document.querySelector(`link[rel="${rel}"]`);

      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        document.head.appendChild(link);
      }

      link.setAttribute("href", href);
    };

    setMeta("description", SITE_DESCRIPTION);
    setMeta(
      "keywords",
      "Egypt Holiday Travel, Egypt tours, Egypt packages, Egypt hotels, travel agency Egypt, Cairo trips, Sharm El Sheikh, Hurghada"
    );
    setMeta("author", SITE_NAME);

    setPropertyMeta("og:type", "website");
    setPropertyMeta("og:site_name", SITE_NAME);
    setPropertyMeta("og:title", SITE_NAME);
    setPropertyMeta("og:description", SITE_DESCRIPTION);
    setPropertyMeta("og:url", SITE_URL);
    setPropertyMeta("og:image", `${SITE_URL}logo-512.png`);

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", SITE_NAME);
    setMeta("twitter:description", SITE_DESCRIPTION);
    setMeta("twitter:image", `${SITE_URL}logo-512.png`);

    setLink("canonical", SITE_URL);

    let schema = document.getElementById("eht-website-schema");

    if (!schema) {
      schema = document.createElement("script");
      schema.id = "eht-website-schema";
      schema.type = "application/ld+json";
      document.head.appendChild(schema);
    }

    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      alternateName: ["Egypt Holiday Travel", "EHT"],
      url: SITE_URL,
    });
  }, []);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await API.get("/reviews");
        const databaseReviews = Array.isArray(res.data) ? res.data : [];

        const formattedDatabaseReviews = databaseReviews.map((review, index) =>
          getReviewData(review, index)
        );

        setReviews([...formattedDatabaseReviews, ...DEFAULT_REVIEWS]);
      } catch (error) {
        console.log("Reviews load error:", error.response?.data || error.message);
        setReviews(DEFAULT_REVIEWS);
      }
    };

    loadReviews();
  }, []);

  useEffect(() => {
    const loadTopHotels = async () => {
      try {
        const res = await API.get("/hotels");
        const hotelsData = Array.isArray(res.data) ? res.data : [];

        setTopHotels(selectTopHotelsByDestination(hotelsData));
      } catch (error) {
        console.log(
          "Top hotels load error:",
          error.response?.data || error.message
        );

        setTopHotels([]);
      }
    };

    loadTopHotels();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const infoSection = document.getElementById("info");

      if (infoSection) {
        const rect = infoSection.getBoundingClientRect();
        setShowButton(rect.top <= window.innerHeight / 1.25);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeReviewPopup = () => {
    setReviewPopup({
      open: false,
      type: "success",
      title: "",
      message: "",
    });
  };

  const openPackageFromHome = (packageId) => {
    navigate("/packages", {
      state: { openPackageId: packageId },
    });
  };

  const openHotelFromHome = (hotel) => {
    navigate("/hotels", {
      state: {
        openHotelId: hotel.id || hotel._id || hotel.hotelId,
        openHotelName: hotel.name || hotel.title,
        openHotelCity: hotel.city || "",
      },
    });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const email = subscriberEmail.trim();

    if (!email) return;

    try {
      await API.post("/subscribers", { email });
      alert("Thank you for subscribing!");
      setSubscriberEmail("");
    } catch (err) {
      alert(err.response?.data?.error || "Subscription failed");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewForm.name.trim() || !reviewForm.text.trim()) {
      setReviewPopup({
        open: true,
        type: "error",
        title: "Review Incomplete",
        message:
          "Please enter your name and share your review before submitting. We truly value your feedback and would be happy to hear about your experience with Egypt Holiday Travel.",
      });
      return;
    }

    try {
      await API.post("/reviews", {
        name: reviewForm.name.trim(),
        rating: Number(reviewForm.rating),
        text: reviewForm.text.trim(),
      });

      setReviewForm({
        name: "",
        rating: 5,
        text: "",
      });

      setReviewPopup({
        open: true,
        type: "success",
        title: "Thank You for Your Review",
        message:
          "We sincerely appreciate your time and kind feedback. Your review has been submitted successfully and will appear after admin approval.",
      });
    } catch (error) {
      setReviewPopup({
        open: true,
        type: "error",
        title: "Review Not Submitted",
        message:
          error.response?.data?.error ||
          "We could not submit your review right now. Please try again.",
      });
    }
  };

  const handleBookNow = () => {
    navigate("/packages");
  };

  return (
    <div className="home-page">
      <section className="hero-section" id="hero">
        <Navbar />

        <img
          src={bgImg}
          alt="Egypt Holiday Travel"
          loading="lazy"
          className="hero-image"
        />

        <div className="hero-overlay"></div>

        <h1 className="seo-site-title">Egypt Holiday Travel</h1>
      </section>

      <HomeInfoSection onOpen={setSelectedInfo} />

      <section className="destinations-section" id="destinations">
        <h2 className="section-title">Top Destinations</h2>

        <div className="destinations-grid">
          {destinations.map((item, index) => (
            <div key={index} className="destination-card-new">
              <img src={item.img} alt={item.name} loading="lazy" />
              <div className="card-overlay"></div>

              <div className="card-text">
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="destinations-note">
          For more details about our destinations, please contact our agency.
          Our team will be happy to help you choose the perfect trip.
        </p>
      </section>

      <section className="featured-packages-section">
        <h2>Top Packages</h2>

        <div className="featured-packages-grid">
          {packages.map((item, index) => (
            <div
              className="featured-package-card"
              key={index}
              onClick={() => openPackageFromHome(item.packageId)}
            >
              <img src={item.img} loading="lazy" alt={item.name} />

              <h3>Package {index + 1}</h3>
              <h4>{item.name} Trip</h4>
              <p>{item.desc}</p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openPackageFromHome(item.packageId);
                }}
              >
                View details
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="destinations-section top-hotels-section" id="top-hotels">
        <h2 className="section-title">Top Hotels</h2>

        {topHotels.length > 0 ? (
          <div className="destinations-grid top-hotels-grid">
            {topHotels.map((hotel, index) => (
              <div
                key={hotel.id || hotel._id || `${hotel.name}-${index}`}
                className="destination-card-new top-hotel-card"
                onClick={() => openHotelFromHome(hotel)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") openHotelFromHome(hotel);
                }}
              >
                <img
                  src={getImageUrl(hotel.image)}
                  alt={hotel.name || "Hotel"}
                  loading="lazy"
                />

                <div className="card-overlay"></div>

                <div className="card-text">
                  <h3>{hotel.name || "Hotel"}</h3>
                  <p>{hotel.city || "Explore Hotel"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="destinations-note">
            No hotels available yet. Please add hotels from the admin panel.
          </p>
        )}

        {topHotels.length > 0 && (
          <p className="destinations-note">
            Choose one of our selected hotels and view more details on the hotels page.
          </p>
        )}
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
        <div className="why-left why-accordion">
          <div
            className={`why-accordion-item ${
              openWhy === "visit" ? "active" : ""
            }`}
          >
            <button
              type="button"
              className="why-accordion-title"
              onClick={() => setOpenWhy(openWhy === "visit" ? null : "visit")}
            >
              <span>Why Visit Egypt?</span>
              <span className="why-arrow">⌄</span>
            </button>

            <div className="why-accordion-content">
              <p>
                Egypt offers history, beaches, and adventure at an affordable
                price, making it a unique travel destination.
              </p>
            </div>
          </div>

          <div
            className={`why-accordion-item ${
              openWhy === "choose" ? "active" : ""
            }`}
          >
            <button
              type="button"
              className="why-accordion-title"
              onClick={() => setOpenWhy(openWhy === "choose" ? null : "choose")}
            >
              <span>Why Choose Us</span>
              <span className="why-arrow">⌄</span>
            </button>

            <div className="why-accordion-content">
              <ul>
                <li>Experienced travel experts</li>
                <li>Personalized travel packages</li>
                <li>Professional and friendly team</li>
                <li>Attention to every detail for a perfect trip</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="why-right">
          <img src={dahabImg} loading="lazy" alt="Travel in Egypt" />
        </div>
      </section>

      <section className="testimonials-section improved-testimonials-section">
        <div className="testimonials-head">
          

          <h2>Customers Say</h2>

          <div className="testimonials-divider">
            <span></span>
            <i></i>
            <span></span>
          </div>
        </div>

        <div className="testimonials-grid improved-testimonials-grid">
          {reviews.slice(0, 3).map((review, index) => {
            const item = getReviewData(review, index);

            return (
              <article
                className="testimonial-card improved-testimonial-card"
                key={item.id || `${item.name}-${index}`}
                style={{ "--delay": `${index * 0.12}s` }}
              >
                <span className="testimonial-quote">“</span>

                <div className="testimonial-top improved-testimonial-top">
                  <div className="testimonial-user-info improved-user-info">
                    <h4>
                      {item.name}
                      <span
                        className={`review-flag review-flag-${item.code}`}
                        title={item.country}
                        aria-label={`${item.country} flag`}
                      ></span>
                    </h4>

                    <p className="review-country">{item.country} traveler</p>
                  </div>

                  <span className="verified-review">Verified</span>
                </div>

                <div
                  className="testimonial-stars"
                  aria-label={`${item.rating || 5} star rating`}
                >
                  {renderStars(item.rating)}
                </div>


                <p className="review-text">“{item.text}”</p>
              </article>
            );
          })}
        </div>

        <div className="customer-review-form-box">
          <div className="customer-review-form-head">
            <span>Share Your Experience</span>

            <h3>Write Your Point Of View</h3>

            <p>
              Tell us about your experience with Egypt Holiday Travel. Your
              review helps other travelers choose with confidence.
            </p>
          </div>

          <form className="customer-review-form" onSubmit={handleReviewSubmit}>
            <div className="customer-review-field">
              <label>Your Name</label>

              <input
                type="text"
                placeholder="Example: Mohamed A."
                value={reviewForm.name}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, name: e.target.value })
                }
              />
            </div>

            <div className="customer-review-field">
              <label>Rating</label>

              <select
                value={reviewForm.rating}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, rating: e.target.value })
                }
              >
                <option value="5">★★★★★ Excellent</option>
                <option value="4">★★★★☆ Very Good</option>
                <option value="3">★★★☆☆ Good</option>
                <option value="2">★★☆☆☆ Average</option>
                <option value="1">★☆☆☆☆ Poor</option>
              </select>
            </div>

            <div className="customer-review-field full">
              <label>Your Review</label>

              <textarea
                placeholder="Write your opinion about our service..."
                value={reviewForm.text}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, text: e.target.value })
                }
              />
            </div>

            <button type="submit" className="customer-review-submit">
              Submit Review
            </button>
          </form>
        </div>
      </section>

      <section className="newsletter-pro">
        <div className="newsletter-pro-left">
          <img
            src={pyra}
            alt="Pyramids"
            loading="lazy"
            className="newsletter-pro-image"
          />
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

          <form className="newsletter-pro-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email address..."
              value={subscriberEmail}
              onChange={(e) => setSubscriberEmail(e.target.value)}
              required
            />

            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      {reviewPopup.open && (
        <div className="review-popup-overlay" onClick={closeReviewPopup}>
          <div
            className={`review-popup-card ${reviewPopup.type}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="review-popup-close"
              type="button"
              onClick={closeReviewPopup}
            >
              ×
            </button>

            <div className={`review-popup-icon ${reviewPopup.type}`}>
              {reviewPopup.type === "success" ? "✓" : "!"}
            </div>

            <h3>{reviewPopup.title}</h3>
            <p>{reviewPopup.message}</p>

            <button
              className="review-popup-btn"
              type="button"
              onClick={closeReviewPopup}
            >
              Done
            </button>
          </div>
        </div>
      )}

      <Footer />

      {showButton && (
        <button
          className="book-now-btn"
          type="button"
          onClick={handleBookNow}
          aria-label="Book now"
          title="Book Now"
        >
          <FaSuitcaseRolling />
        </button>
      )}

      <InfoPopup item={selectedInfo} onClose={() => setSelectedInfo(null)} />
    </div>
  );
}