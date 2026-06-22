import {
  FaBus,
  FaCalendarAlt,
  FaHotel,
  FaMapMarkedAlt,
} from "react-icons/fa";

export default function TurkeyHotelPackageCard({ item, onOpen, onBook, onImageError }) {
  const displayTitle = item.cardTitle || item.packageGroupTitle || item.name;
  const displaySubtitle =
    item.cardSubtitle || item.packageGroupSubtitle || item.duration;

  return (
    <article className="package-card-pro turkey-hotel-package-card">
      <div className="package-img-box">
        <img
          src={item.image}
          alt={displayTitle}
          loading="lazy"
          onError={onImageError}
        />

        <div className="package-img-overlay">
          <span>{item.packageGroupShortTitle || item.duration}</span>
        </div>
      </div>

      <div className="package-card-body">
        <span className="turkey-hotel-label">Turkey Package</span>

        <h3>{displayTitle}</h3>

        <div className="package-info-row">
          <FaCalendarAlt />
          <span>{displaySubtitle}</span>
        </div>

        <div className="package-info-row">
          <FaMapMarkedAlt />
          <span>Turkey → Sharm → Cairo</span>
        </div>

        <div className="package-info-row">
          <FaBus />
          <span>Flight + Airport + Bus</span>
        </div>

        <div className="package-info-row turkey-hotel-name">
          <FaHotel />
          <span>{item.hotelName}</span>
        </div>

        <div className="package-price-box">
          <small>Starting Price</small>
          <strong>{item.startPrice}</strong>
        </div>

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
