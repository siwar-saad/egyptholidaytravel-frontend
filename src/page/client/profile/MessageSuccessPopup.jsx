export default function MessageSuccessPopup({ sentMessageText, onClose }) {
  return (
    <div className="message-success-overlay">
      <div className="message-success-popup">
        <div className="message-success-icon">✓</div>

        <h2>Message Sent Successfully</h2>

        <p>
          Thank you for contacting Egypt Holiday Travel. Our support team will
          review your message and get back to you as soon as possible.
        </p>

        <div className="sent-message-box">{sentMessageText}</div>

        <button type="button" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
