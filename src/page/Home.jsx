import { useEffect, useRef, useState } from "react";
import "./Home.css";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { FaSuitcaseRolling } from "react-icons/fa";
import API from "../api";
import { debugLog } from "../utils/debugLog";
import Footer from "../components/footer";

import HomeInfoSection from "./homeInfo/HomeInfoSection";
import InfoPopup from "./homeInfo/InfoPopup";

/* IMAGES */
import cairoCover from "../assets/image/cairo.webp";
import dahabImg from "../assets/image/dahab.webp";
import sharmImg from "../assets/image/sharm.webp";
import bgImg from "../assets/image/bg.webp";
import LuxorImg from "../assets/image/Luxor.webp";
import pyra from "../assets/image/pyra.webp";

/* VIDEO */
import egyptVideo from "../assets/video/egypt-home.mp4";

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

const getFlagCode = (value = "") => {
  const clean = String(value).trim().toLowerCase();

  if (clean.includes("tunisia") || clean === "tn") {
    return "tn";
  }

  if (clean.includes("turkey") || clean === "tr") {
    return "tr";
  }

  if (clean.includes("morocco") || clean === "ma") {
    return "ma";
  }

  return REVIEW_META[0].code;
};

const getReviewData = (review, index) => {
  const meta = REVIEW_META[index % REVIEW_META.length];
  const code = getFlagCode(review.code || review.flag || review.country || meta.code);

  return {
    ...review,
    code,
    country: review.country || meta.country,
  };
};

const getFlagUrl = (code) => {
  const cleanCode = getFlagCode(code);
  return `https://flagcdn.com/w80/${cleanCode}.png`;
};

const renderStars = (rating) => {
  const value = Math.max(1, Math.min(5, Number(rating) || 5));

  return Array.from({ length: 5 }).map((_, index) => (
    <span key={index} className={index < value ? "active" : ""}>
      {"\u2605"}
    </span>
  ));
};

const isMobileAutoSlider = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 1024px)").matches;
};

const useAutoDragSlider = (speed = 0.85, refreshKey = 0) => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return undefined;

    const state = {
      isPointerDown: false,
      isHovering: false,
      startX: 0,
      startScrollLeft: 0,
      dragged: false,
      initialized: false,
      manualPauseUntil: 0,
      intervalId: null,
    };

    const getLoopWidth = () => slider.scrollWidth / 3;

    const canSlide = () =>
      isMobileAutoSlider() && slider.scrollWidth > slider.clientWidth + 20;

    const centerSlider = () => {
      if (!canSlide()) {
        state.initialized = false;
        return;
      }

      if (state.initialized) return;

      slider.scrollLeft = getLoopWidth();
      state.initialized = true;
    };

    const keepInfinitePosition = () => {
      if (!canSlide()) return;

      const loopWidth = getLoopWidth();

      if (slider.scrollLeft <= 4) {
        slider.scrollLeft += loopWidth;
      }

      if (slider.scrollLeft >= loopWidth * 2) {
        slider.scrollLeft -= loopWidth;
      }
    };

    const pauseManualControl = (duration = 900) => {
      state.manualPauseUntil = Date.now() + duration;
    };

    const autoMove = () => {
      centerSlider();
      keepInfinitePosition();

      if (
        canSlide() &&
        !state.isPointerDown &&
        !state.isHovering &&
        Date.now() > state.manualPauseUntil
      ) {
        slider.scrollLeft += speed;
      }
    };

    const handlePointerDown = (event) => {
      if (!canSlide()) return;
      if (event.button !== undefined && event.button !== 0) return;

      centerSlider();
      keepInfinitePosition();
      pauseManualControl(1500);

      state.isPointerDown = true;
      state.startX = event.clientX;
      state.startScrollLeft = slider.scrollLeft;
      state.dragged = false;

      slider.classList.add("is-dragging");
      slider.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event) => {
      if (!state.isPointerDown) return;

      const distance = event.clientX - state.startX;

      if (Math.abs(distance) > 3) {
        state.dragged = true;
        event.preventDefault();
      }

      slider.scrollLeft = state.startScrollLeft - distance;
      pauseManualControl(1200);
      keepInfinitePosition();
    };

    const stopDragging = (event) => {
      if (!state.isPointerDown) return;

      state.isPointerDown = false;
      slider.classList.remove("is-dragging");

      if (!state.isHovering) {
        slider.classList.remove("is-paused-by-user");
      }

      try {
        slider.releasePointerCapture?.(event.pointerId);
      } catch {
        // Ignore release errors when pointer capture is not active.
      }

      pauseManualControl(1000);
      keepInfinitePosition();

      window.setTimeout(() => {
        state.dragged = false;
      }, 120);
    };

    const stopClickAfterDrag = (event) => {
      if (!state.dragged) return;

      event.preventDefault();
      event.stopPropagation();
    };

    const handleWheel = (event) => {
      if (!canSlide()) return;

      const movement =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      event.preventDefault();
      slider.scrollLeft += movement;
      pauseManualControl(1000);
      keepInfinitePosition();
    };

    const handleResize = () => {
      state.initialized = false;
      centerSlider();
    };

    const handleImagesLoaded = () => {
      state.initialized = false;
      centerSlider();
    };

    const handlePointerEnter = () => {
      if (!canSlide()) return;
      state.isHovering = true;
      slider.classList.add("is-paused-by-user");
    };

    const handlePointerLeave = () => {
      if (!canSlide()) return;
      state.isHovering = false;

      if (!state.isPointerDown) {
        slider.classList.remove("is-paused-by-user");
      }
    };

    slider.addEventListener("pointerenter", handlePointerEnter);
    slider.addEventListener("pointerleave", handlePointerLeave);
    slider.addEventListener("pointerdown", handlePointerDown);
    slider.addEventListener("pointermove", handlePointerMove);
    slider.addEventListener("pointerup", stopDragging);
    slider.addEventListener("pointercancel", stopDragging);
    slider.addEventListener("click", stopClickAfterDrag, true);
    slider.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("resize", handleResize);

    slider.querySelectorAll("img").forEach((img) => {
      img.addEventListener("load", handleImagesLoaded);
    });

    state.intervalId = window.setInterval(autoMove, 16);
    window.setTimeout(handleResize, 80);
    window.setTimeout(handleResize, 500);

    return () => {
      slider.removeEventListener("pointerenter", handlePointerEnter);
      slider.removeEventListener("pointerleave", handlePointerLeave);
      slider.removeEventListener("pointerdown", handlePointerDown);
      slider.removeEventListener("pointermove", handlePointerMove);
      slider.removeEventListener("pointerup", stopDragging);
      slider.removeEventListener("pointercancel", stopDragging);
      slider.removeEventListener("click", stopClickAfterDrag, true);
      slider.removeEventListener("wheel", handleWheel);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("resize", handleResize);

      slider.querySelectorAll("img").forEach((img) => {
        img.removeEventListener("load", handleImagesLoaded);
      });

      if (state.intervalId) {
        window.clearInterval(state.intervalId);
      }
    };
  }, [speed, refreshKey]);

  return sliderRef;
};

export default function Home() {
  const navigate = useNavigate();

  const [showButton, setShowButton] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [openWhy, setOpenWhy] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [topHotels, setTopHotels] = useState([]);

  const destinationsSliderRef = useAutoDragSlider(0.92);
  const packagesSliderRef = useAutoDragSlider(0.82);
  const topHotelsSliderRef = useAutoDragSlider(0.9, topHotels.length);
  const featuresSliderRef = useAutoDragSlider(0.7);

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
      name: "Cairo \u2013 Hurghada",
      desc: "Cairo & Red Sea Package",
      img: cairoHurghadaPackage,
      packageId: "cairo-hurghada-5",
    },
    {
      name: "Cairo \u2013 Sharm El Sheikh",
      desc: "6 Days / 5 Nights Program",
      img: cairoSharmPackage,
      packageId: "cairo-sharm-6-days",
    },
    {
      name: "Cairo \u2013 Luxor",
      desc: "Ancient Egypt & Nile Package",
      img: cairoLuxorPackage,
      packageId: "cairo-luxor-6",
    },
  ];

  const featureCards = [
    {
      icon: "\u{1F6E1}\uFE0F",
      title: "Trust",
      text: "Trusted Global Brand",
    },
    {
      icon: "\u23F1\uFE0F",
      title: "Speed",
      text: "Fast & Efficient Booking",
    },
    {
      icon: "\u{1F4CD}",
      title: "Experience",
      text: "Expert Local Guides",
    },
    {
      icon: "\u{1F3A7}",
      title: "Support",
      text: "24/7 Customer Support",
    },
  ];

  const destinationSliderItems = [...destinations, ...destinations, ...destinations];
  const packageSliderItems = [...packages, ...packages, ...packages];
  const topHotelSliderItems = [...topHotels, ...topHotels, ...topHotels];
  const featureSliderItems = [...featureCards, ...featureCards, ...featureCards];

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

        setReviews(formattedDatabaseReviews);
      } catch (error) {
        debugLog("Reviews load error:", error.response?.data || error.message);
        setReviews([]);
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
        debugLog(
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

      <section className="egypt-video-section" id="egypt-video">
        <div className="egypt-video-media">
          <video
            className="egypt-home-video"
            src={egyptVideo}
            poster={pyra}
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            controlsList="nodownload"
            aria-label="Egypt travel video"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="egypt-video-content">
  <span className="egypt-video-kicker">Discover Egypt in Motion</span>

  <h2>
    Experience Egypt
    <br />
    Like Never Before
  </h2>

  <p>
    Watch the beauty of Egypt through iconic landmarks, Red Sea views,
    golden deserts, and unforgettable travel moments.
  </p>

  <p>
    With Egypt Holiday Travel, every journey is carefully planned to give
    you comfort, discovery, and a memorable travel experience.
  </p>

  <div className="egypt-video-points">
    <span>Iconic landmarks</span>
    <span>Red Sea views</span>
    <span>Tailor-made trips</span>
  </div>

  <button
    type="button"
    className="egypt-video-btn"
    onClick={handleBookNow}
  >
    Explore Packages
  </button>
</div>
      </section>

      <section className="destinations-section" id="destinations">
        <h2 className="section-title">Top Destinations</h2>

        <div
          ref={destinationsSliderRef}
          className="destinations-grid destinations-auto-slider"
        >
          {destinationSliderItems.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className={`destination-card-new ${
                index >= destinations.length ? "mobile-clone" : ""
              }`}
              aria-hidden={index >= destinations.length}
            >
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

        <div
          ref={packagesSliderRef}
          className="featured-packages-grid packages-auto-slider"
        >
          {packageSliderItems.map((item, index) => (
            <div
              className={`featured-package-card ${
                index >= packages.length ? "mobile-clone" : ""
              }`}
              key={`${item.packageId}-${index}`}
              aria-hidden={index >= packages.length}
              onClick={() => openPackageFromHome(item.packageId)}
            >
              <img src={item.img} loading="lazy" alt={item.name} />

              <h3>Package {(index % packages.length) + 1}</h3>
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
          <div
            ref={topHotelsSliderRef}
            className="destinations-grid top-hotels-grid top-hotels-auto-slider"
          >
            {topHotelSliderItems.map((hotel, index) => (
              <div
                key={`${hotel.id || hotel._id || hotel.name || "hotel"}-${index}`}
                className={`destination-card-new top-hotel-card ${
                  index >= topHotels.length ? "mobile-clone" : ""
                }`}
                aria-hidden={index >= topHotels.length}
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

      <section
        ref={featuresSliderRef}
        className="features-strip features-auto-slider"
      >
        {featureSliderItems.map((item, index) => (
          <div
            className={`feature-item ${
              index >= featureCards.length ? "mobile-clone" : ""
            }`}
            key={`${item.title}-${index}`}
            aria-hidden={index >= featureCards.length}
          >
            <div className="feature-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
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
              <span className="why-arrow">{"\u2304"}</span>
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
              <span className="why-arrow">{"\u2304"}</span>
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
                <span className="testimonial-quote">{"\u201C"}</span>

                <div className="testimonial-top improved-testimonial-top">
                  <div className="testimonial-user-info improved-user-info">
                    <h4>
                      {item.name}
                      <img
                        className="review-flag-img"
                        src={getFlagUrl(item.code)}
                        alt={`${item.country} flag`}
                        title={item.country}
                        loading="lazy"
                      />
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

                <p className="review-text">{"\u201C"}{item.text}{"\u201D"}</p>
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
                <option value="5">{"\u2605\u2605\u2605\u2605\u2605 Excellent"}</option>
                <option value="4">{"\u2605\u2605\u2605\u2605\u2606 Very Good"}</option>
                <option value="3">{"\u2605\u2605\u2605\u2606\u2606 Good"}</option>
                <option value="2">{"\u2605\u2605\u2606\u2606\u2606 Average"}</option>
                <option value="1">{"\u2605\u2606\u2606\u2606\u2606 Poor"}</option>
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
          <div className="newsletter-pro-mail">{"\u2709"}</div>

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

            <span className="route-plane">{"\u2708"}</span>
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
              {"\u00D7"}
            </button>

            <div className={`review-popup-icon ${reviewPopup.type}`}>
              {reviewPopup.type === "success" ? "\u2713" : "!"}
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


