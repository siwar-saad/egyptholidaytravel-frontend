import { useNavigate } from "react-router-dom";
import {
  FaPlaneDeparture,
  FaClock,
  FaBell,
  FaArrowLeft,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";

import Navbar from "../../components/navbar";
import "./flightcomingsoon.css";

export default function FlightComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="flight-coming-page">
      <Navbar />

      <section className="flight-coming-hero">
        <div className="flight-circle circle-1"></div>
        <div className="flight-circle circle-2"></div>

        <div className="flight-coming-card">
          <div className="flight-icon">
            <FaPlaneDeparture />
          </div>

          <span className="flight-badge">Coming Soon</span>

          <h1>Flights Booking</h1>

          <p>
            Our flight booking service is coming soon. You will soon be able to
            search, compare and book flights easily with Egypt Holiday Travel.
          </p>

          <div className="flight-features">
            <div className="flight-feature">
              <FaClock />
              <span>Fast Search</span>
            </div>

            <div className="flight-feature">
              <FaShieldAlt />
              <span>Secure Booking</span>
            </div>

            <div className="flight-feature">
              <FaHeadset />
              <span>24/7 Support</span>
            </div>
          </div>

          <div className="flight-notify">
            <FaBell />
            <span>Stay tuned. This service will be available soon.</span>
          </div>

          <div className="flight-actions">
            <button type="button" onClick={() => navigate("/")}>
              <FaArrowLeft />
              Back Home
            </button>

            <button
              type="button"
              className="flight-secondary-btn"
              onClick={() => navigate("/packages")}
            >
              Explore Packages
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}