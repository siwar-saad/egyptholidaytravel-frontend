export default function ContactPopup({ onClose }) {
  return (
    <div className="contact-popup-overlay">
      <div className="contact-popup">
        <div className="contact-header">
          <h2>Contact Our Agency</h2>

          <p>
            Our Egypt Holiday support team is available anytime to help you with
            bookings, flights, hotels, and travel details.
          </p>
        </div>

        <div className="contact-grid">
          <a href="tel:01099999234">☎️ 01099999234</a>
          <a href="tel:01050971444">☎️ 01050971444</a>
          <a href="tel:01050383173">☎️ 01050383173</a>
          <a href="tel:01111787867">☎️ 01111787867</a>

          <a href="mailto:ghaddabnessrine@gmail.com">
            📧 ghaddabnessrine@gmail.com
          </a>

          <a href="https://wa.me/201099999234" target="_blank" rel="noreferrer">
            💬 WhatsApp Support
          </a>
        </div>

        <button type="button" className="close-contact-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
