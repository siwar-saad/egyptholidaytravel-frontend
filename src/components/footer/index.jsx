import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaPhoneAlt,
  FaTiktok,
  FaMapMarkerAlt,
} from "react-icons/fa";

import "./style.css";

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-col footer-about">
          <h2 className="footer-logo">Egypt Holiday</h2>

          <p className="footer-desc">
            Discover Egypt with us. We offer the best travel experiences, luxury
            packages, and unforgettable adventures.
          </p>

          <div className="footer-socials">
            <a
              href="https://www.facebook.com/share/18deN5D3jr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com/egyptholidaytravel0?igsh=OXVtdjM4YWF0N3Fz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>

            <a
              href="https://wa.me/201099999234"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
            </a>

            <a
              className="tiktok-link"
              href="https://www.tiktok.com/@egyptholiday.travel"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h3>Company</h3>
          <a href="#hero">Home</a>
          <a href="/packages">Packages</a>
          <a href="/hotels">Hotels</a>
          <a href="/flights">Flights</a>
          <a href="/destinations">Destination</a>
        </div>

        <div className="footer-col">
          <h3>Support</h3>
          <a href="#">Reservation Info</a>
          <a href="#">Cancellation Policy</a>
          <a href="#">Terms & Conditions</a>
        </div>

        <div className="footer-col contact-col">
          <h3>Contact</h3>

          <div className="contact-card">
            <div className="contact-icon">
              <FaPhoneAlt />
            </div>

            <div className="contact-info">
              <h4>Phone Numbers</h4>
              <a href="tel:01099999234">01099999234</a>
              <a href="tel:01050971444">01050971444</a>
              <a href="tel:01050383173">01050383173</a>
              <a href="tel:0111787867">0111787867</a>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <FaMapMarkerAlt />
            </div>

            <div className="contact-info">
              <h4>Mansoura Branch</h4>
              <p>El-Siiz Area, next to El-Eman Mosque.</p>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <FaMapMarkerAlt />
            </div>

            <div className="contact-info">
              <h4>Cairo Branch</h4>
              <p>22 Abou Dawoud El Zahery Street.</p>
              <p>Next to Arab Investment Bank.</p>
              <p>Nasr City, Cairo, Egypt.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 Egypt Holiday Travel — All rights reserved
      </div>
    </footer>
  );
}
