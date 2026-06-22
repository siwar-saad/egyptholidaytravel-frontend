import {
  FaBus,
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaTrain,
} from "react-icons/fa";

export default function PackageCard({ item, onOpen, onBook, onImageError }) {
  return (
    <article className="package-card-pro">
      <div className="package-img-box">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          onError={onImageError}
        />

        <div className="package-img-overlay">
          <span>{item.badgeText || item.duration}</span>
        </div>
      </div>

      <div className="package-card-body">
        {item.cardSubtitle && (
          <span className="package-back-name">{item.cardSubtitle}</span>
        )}

        <h3>{item.name}</h3>

        <div className="package-info-row">
          <FaMapMarkedAlt />
          <span>{item.route}</span>
        </div>

        <div className="package-info-row">
          <FaCalendarAlt />
          <span>{item.duration}</span>
        </div>

        <div className="package-info-row">
          {item.route.includes("Luxor") ? <FaTrain /> : <FaBus />}
          <span>{item.transfer}</span>
        </div>

        {!item.hidePrice && item.startPrice && (
          <div className="package-price-box">
            <small>Starting Price</small>
            <strong>{item.startPrice}</strong>
          </div>
        )}

        <div className="package-card-actions">
          <button type="button" onClick={() => onOpen(item)}>
            View Details
          </button>

          <button
            type="button"
            className="package-book-btn"
            onClick={() => onBook(item)}
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
}
