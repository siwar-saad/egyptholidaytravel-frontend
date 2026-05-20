import { useEffect, useState } from "react";
import "./Home.css";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
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
import uzbekistan from "../assets/image/uzbekistan.jpg";
import hurghad from "../assets/image/hurghad.jpg";
import turkey from "../assets/image/turkey.jpg";

/* CUSTOMERS */
import customer1 from "../assets/image/sara.png";
import customer2 from "../assets/image/ahmed.png";
import customer3 from "../assets/image/lara.png";

export default function Home() {
  const navigate = useNavigate();

  const [showButton, setShowButton] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [openWhy, setOpenWhy] = useState(null);

  const destinations = [
    { name: "Cairo", desc: "Explore Egypt", img: cairoCover },
    { name: "Dahab", desc: "Explore Egypt", img: dahabImg },
    { name: "Sharm El Sheikh", desc: "Explore Egypt", img: sharmImg },
    { name: "Luxor", desc: "Explore Egypt", img: LuxorImg },
  ];

  const packages = [
    { name: "Uzbekistan", desc: "Explore Central Asia", img: uzbekistan },
    { name: "Hurghada", desc: "Explore Egypt", img: hurghad },
    { name: "Turkey", desc: "Explore Turkey", img: turkey },
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const email = subscriberEmail.trim();

    if (!email) return;

    try {
      await API.post("/subscribe", { email });

      alert("Thank you for subscribing!");
      setSubscriberEmail("");
    } catch (err) {
      alert(err.response?.data?.error || "Subscription failed");
    }
  };

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

  const handleBookNow = () => {
    navigate("/packages");
  };

  return (
    <div className="home-page">
      <section className="hero-section" id="hero">
        <Navbar />

        <img src={bgImg} alt="Egypt"  loading="lazy"  className="hero-image" />
        <div className="hero-overlay"></div>
      </section>

      <HomeInfoSection onOpen={setSelectedInfo} />

      <section className="destinations-section" id="destinations">
        <h2 className="section-title">Top Destinations</h2>

        <div className="destinations-grid">
          {destinations.map((item, index) => (
            <div key={index} className="destination-card-new">
              <img src={item.img} alt={item.name}  loading="lazy" />
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
          {packages.map((item, index) => (
            <div className="featured-package-card" key={index}>
              <img src={item.img}  loading="lazy" alt={item.name} />
              <h3>Cart {index + 1}</h3>
              <h4>{item.name} Trip</h4>
              <button type="button">View details</button>
            </div>
          ))}
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
  <div className="why-left why-accordion">
    <div className={`why-accordion-item ${openWhy === "visit" ? "active" : ""}`}>
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
          Egypt offers history, beaches, and adventure at an affordable price,
          making it a unique travel destination.
        </p>
      </div>
    </div>

    <div className={`why-accordion-item ${openWhy === "choose" ? "active" : ""}`}>
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
    <img src={dahabImg}  loading="lazy" alt="Travel" />
  </div>
</section>

      <section className="testimonials-section">
        <h2>Customers Say</h2>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-top">
              <img src={customer1} alt="Sarah M."  loading="lazy" className="customer-img" />

              <div className="testimonial-user-info">
                <h4>Sarah M.</h4>
                <div className="stars">⭐⭐⭐⭐⭐</div>
              </div>
            </div>

            <p>
              Everything Was Perfectly Organized. The Team Made Our Trip Easy,
              Safe, And Full Of Beautiful Moments. Highly Recommended!
            </p>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-top">
              <img src={customer2} alt="Ahmed K"  loading="lazy"  className="customer-img" />

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
              <img src={customer3} alt="Laura P."  loading="lazy" className="customer-img" />

              <div className="testimonial-user-info">
                <h4>Laura P.</h4>
                <div className="stars">⭐⭐⭐⭐⭐</div>
              </div>
            </div>

            <p>
              I discovered Egypt in a completely new way. The planning, timing,
              and professionalism were outstanding.
            </p>
          </div>
        </div>
      </section>

      <section className="newsletter-pro">
        <div className="newsletter-pro-left">
          <img src={pyra} alt="Pyramids"  loading="lazy" className="newsletter-pro-image" />
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

          <Footer />

      {showButton && (
        <button className="book-now-btn" type="button" onClick={handleBookNow}>
          Book Now
        </button>
      )}

      <InfoPopup item={selectedInfo} onClose={() => setSelectedInfo(null)} />
    </div>
  );
}