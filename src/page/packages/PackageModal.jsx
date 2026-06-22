import {
  FaBus,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaHotel,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaPlaneDeparture,
  FaTimes,
  FaTrain,
  FaUtensils,
} from "react-icons/fa";

export default function PackageModal({ item, onClose, onBook, onImageError }) {
  const hasItinerary = Array.isArray(item.itinerary) && item.itinerary.length > 0;
  const hasOptions = Array.isArray(item.options) && item.options.length > 0;
  const hasExcluded = Array.isArray(item.excluded) && item.excluded.length > 0;
  const hasFlightDetails =
    Array.isArray(item.flightDetails) && item.flightDetails.length > 0;

  return (
    <div className="package-modal-overlay">
      <div className="package-modal-box">
        <button type="button" className="package-modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="package-modal-image">
          <img src={item.image} alt={item.name} onError={onImageError} />

          <div>
            <span>{item.travelDateText || item.duration}</span>
            <h2>{item.name}</h2>
          </div>
        </div>

        <div className="package-modal-content">
          {item.backendName && (
            <span className="package-back-name modal-back-name">
              Programme: {item.backendName}
            </span>
          )}

          <div className="package-modal-meta">
            <div>
              <FaMapMarkedAlt />
              <span>{item.route}</span>
            </div>

            <div>
              <FaCalendarAlt />
              <span>
                {item.duration}
                {item.travelDateText ? ` - ${item.travelDateText}` : ""}
              </span>
            </div>

            <div>
              {item.route.includes("Luxor") ? <FaTrain /> : <FaBus />}
              <span>{item.transfer}</span>
            </div>
          </div>

          {item.transferReduction && (
            <div className="transfer-reduction-box">
              {item.transferReduction}
            </div>
          )}

          {item.hotelName && !item.hidePrice && (
            <div className="turkey-selected-hotel-box">
              <h3>Selected Hotel Package</h3>
              <p>{item.hotelName}</p>

              <div>
                <span>SGL: {item.sglPrice || "—"}</span>
                <span>DBL: {item.dblPrice || "—"}</span>
                <span>TPL: {item.tplPrice || "—"}</span>
              </div>
            </div>
          )}

          {hasOptions && !item.hidePrice && (
            <div className="package-options">
              {item.options.map((option) => (
                <div className="package-option-card" key={option.title}>
                  <h3>{option.title}</h3>

                  <div className="package-table-wrapper">
                    <table className="package-table">
                      <thead>
                        <tr>
                          <th>City</th>
                          <th>Nights</th>
                          <th>Hotel</th>
                          <th>Meal Plan</th>
                          <th>SGL</th>
                          <th>DBL</th>
                          <th>TPL</th>
                        </tr>
                      </thead>

                      <tbody>
                        {Array.isArray(option.rows) &&
                          option.rows.map((row, index) => (
                            <tr key={`${option.title}-${row.city}-${index}`}>
                              <td>{row.city}</td>
                              <td>{row.nights}</td>
                              <td>{row.hotel}</td>
                              <td>
                                <span className="meal-badge">
                                  <FaUtensils />
                                  {row.meal}
                                </span>
                              </td>
                              <td>{row.sgl || "—"}</td>
                              <td>{row.dbl || "—"}</td>
                              <td>{row.tpl || "—"}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasItinerary && (
            <div className="package-itinerary">
              {item.itinerary.map((day) => (
                <div className="package-day-card" key={day.day}>
                  <div className="package-day-number">{day.day}</div>

                  <div className="package-day-content">
                    <h3>{day.title}</h3>

                    <ul>
                      {Array.isArray(day.details) &&
                        day.details.map((detail, index) => (
                          <li key={`${day.day}-${index}`}>
                            <FaCheckCircle />
                            <span>{detail}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!hasOptions && !hasItinerary && (
            <div className="package-option-card">
              <h3>Programme</h3>
              <p className="package-programme-text">
                {item.programme ||
                  "Package details will be confirmed by our team."}
              </p>
            </div>
          )}

          {item.programme && (hasOptions || hasItinerary) && (
            <div className="package-option-card package-extra-programme">
              <h3>{item.hidePrice ? "Programme Summary" : "Extra Tours"}</h3>
              <p className="package-programme-text">{item.programme}</p>
            </div>
          )}

          {Array.isArray(item.included) && item.included.length > 0 && (
            <div className="package-included-card">
              <h3>{item.hidePrice ? "Programme Includes" : "Price Included"}</h3>

              <ul>
                {item.included.map((text, index) => (
                  <li key={`${item.id}-included-${index}`}>
                    <FaCheckCircle />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasExcluded && (
            <div className="package-included-card package-excluded-card">
              <h3>Programme Excludes</h3>

              <ul>
                {item.excluded.map((text, index) => (
                  <li key={`${item.id}-excluded-${index}`}>
                    <FaTimes />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasFlightDetails && (
            <div className="package-included-card package-flight-card">
              <h3>Flight Details</h3>

              <ul>
                {item.flightDetails.map((text, index) => (
                  <li key={`${item.id}-flight-${index}`}>
                    <FaPlaneDeparture />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!item.hidePrice && (
            <div className="package-note-box">
              <FaHotel />

              <p>
                Above rates are per person per room, including the meals mentioned
                above and the transfer stated in this package.
              </p>
            </div>
          )}

          <div className="package-programme-contact">
            <h4>Need the complete package programme?</h4>

            <p>
              If you would like the full package programme, please contact us by
              email or phone and our team will send you all details.
            </p>

            <div className="package-programme-contact-links">
              <a href="mailto:amr@egyptholiday-travel.com">
                <FaEnvelope />
                amr@egyptholiday-travel.com
              </a>

              <a href="tel:01099959949">
                <FaPhoneAlt />
                01099959949
              </a>
            </div>
          </div>

          <button
            type="button"
            className="package-modal-book"
            onClick={() => onBook(item)}
          >
            <FaPlaneDeparture />
            Book This Package
          </button>
        </div>
      </div>
    </div>
  );
}
