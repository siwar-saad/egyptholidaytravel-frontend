import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useEffect } from "react";
import "./Packages.css";

import {
  FaSuitcaseRolling,
  FaClock,
  FaEnvelope,
  FaPhoneAlt,
  FaBell,
  FaArrowLeft,
  FaCheckCircle,
  FaHeadset,
  FaPlaneDeparture,
} from "react-icons/fa";

export default function Packages() {
  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, []);
  return (
    <div className="packages-page">
      <Navbar />

      <main className="packages-soon-page">
        <section className="packages-soon-hero">
          <span className="packages-circle packages-circle-1"></span>
          <span className="packages-circle packages-circle-2"></span>
          <span className="packages-circle packages-circle-3"></span>

          <div className="packages-soon-card">
            <div className="packages-top-icon">
              <FaSuitcaseRolling />
            </div>

            <span className="packages-small-badge">Egypt Holiday Travel</span>

            <h1>Travel Packages Coming Soon</h1>

            <p className="packages-main-text">
              Our packages page is currently being prepared to offer you a more
              elegant, clear, and professional travel booking experience.
            </p>

            <div className="packages-status-box">
              <FaBell />
              <span>
                New travel packages will be available soon. For current package
                details, contact our team directly.
              </span>
            </div>

            <div className="packages-mini-grid">
              <div className="packages-mini-card">
                <FaClock />
                <h3>Coming Soon</h3>
                <p>We are updating our travel offers.</p>
              </div>

              <div className="packages-mini-card">
                <FaPlaneDeparture />
                <h3>Better Trips</h3>
                <p>More organized and clear programs.</p>
              </div>

              <div className="packages-mini-card">
                <FaHeadset />
                <h3>Direct Support</h3>
                <p>Contact us for available packages.</p>
              </div>
            </div>

            <div className="packages-contact-panel">
              <div className="packages-contact-header">
                <FaCheckCircle />
                <div>
                  <h2>Need Package Information?</h2>
                  <p>
                    Contact us now and our team will help you with the available
                    packages.
                  </p>
                </div>
              </div>

              <div className="packages-contact-links">
                <a href="mailto:amr@egyptholiday-travel.com">
                  <span className="packages-contact-icon">
                    <FaEnvelope />
                  </span>

                  <div>
                    <small>Email Us</small>
                    <strong>amr@egyptholiday-travel.com</strong>
                  </div>
                </a>

                <a href="tel:01099959949">
                  <span className="packages-contact-icon">
                    <FaPhoneAlt />
                  </span>

                  <div>
                    <small>Call Us</small>
                    <strong>01099959949</strong>
                  </div>
                </a>
              </div>
            </div>

            <div className="packages-actions">
              <a href="/" className="packages-back-btn">
                <FaArrowLeft />
                Back Home
              </a>

             
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}