import {
  FaCity,
  FaGlobeEurope,
  FaLandmark,
  FaMapMarkedAlt,
  FaPlaneDeparture,
  FaUmbrellaBeach,
} from "react-icons/fa";

export default function OtherRoutesChooser({
  turkeyCount = 0,
  loading,
  onChoose,
  onBack,
}) {
  return (
    <section className="packages-other-routes-section">
      <div className="packages-section-head">
        <span>International Trips</span>

        <h2>Choose Your Route</h2>

        <p>
          Select the international programme first. After clicking it, the
          packages for this route will appear.
        </p>

        <button
          type="button"
          className="packages-category-back"
          onClick={onBack}
        >
          ← Back to Egypt Trips / International Trips
        </button>
      </div>

      <div className="other-routes-grid">
        {/* 1 - Turkey to Egypt: Sharm + Cairo */}
        <button
          type="button"
          className="package-category-card from-turkey-egypt"
          onClick={() => onChoose("turkey-egypt")}
          disabled={loading}
        >
          <div className="package-category-overlay"></div>

          <div className="package-category-content">
            <span className="package-category-icon">
              <FaPlaneDeparture />
            </span>

            <h3>From Turkey to Egypt</h3>

            <p>
              Istanbul SAW → Sharm El Sheikh → Cairo with hotels, transfers and
              organized tours.
            </p>

            <strong>
              {loading
                ? "Loading..."
                : `${turkeyCount} package${turkeyCount === 1 ? "" : "s"}`}
            </strong>
          </div>
        </button>

        {/* 2 - Turkey & Egypt: Istanbul + Sharm */}
        <button
          type="button"
          className="package-category-card turkey-egypt-istanbul-sharm"
          onClick={() => onChoose("turkey-egypt-istanbul-sharm")}
          disabled={loading}
        >
          <div className="package-category-overlay"></div>

          <div className="package-category-content">
            <span className="package-category-icon">
              <FaPlaneDeparture />
            </span>

            <h3>Turkey & Egypt</h3>

            <p>
              Istanbul → Sharm El-Sheikh with flights, baggage, hotels and
              optional Istanbul programme.
            </p>

            <strong>11 Days / 10 Nights</strong>
          </div>
        </button>

        {/* 3 - Turkey Istanbul */}
        <button
          type="button"
          className="package-category-card turkey-istanbul-summer"
          onClick={() => onChoose("turkey-istanbul-summer")}
          disabled={loading}
        >
          <div className="package-category-overlay"></div>

          <div className="package-category-content">
            <span className="package-category-icon">
              <FaPlaneDeparture />
            </span>

            <h3>Turkey Istanbul</h3>

            <p>
              Istanbul 8 days programme with hotel, breakfast, airport
              transfers, shopping and optional internal tours.
            </p>

            <strong>8 Days / 7 Nights</strong>
          </div>
        </button>

        {/* 4 - Europe Tour */}
        <button
          type="button"
          className="package-category-card europe-tour"
          onClick={() => onChoose("europe-tour")}
          disabled={loading}
        >
          <div className="package-category-overlay"></div>

          <div className="package-category-content">
            <span className="package-category-icon">
              <FaGlobeEurope />
            </span>

            <h3>Europe Tour</h3>

            <p>
              Prague → Salzburg → Hallstatt → Vienna → Budapest → Bratislava
              with hotels, transfers and guided tours.
            </p>

            <strong>11 Days / 10 Nights</strong>
          </div>
        </button>

        {/* 5 - France / Belgium / Holland */}
        <button
          type="button"
          className="package-category-card france-belgium-holland"
          onClick={() => onChoose("france-belgium-holland")}
          disabled={loading}
        >
          <div className="package-category-overlay"></div>

          <div className="package-category-content">
            <span className="package-category-icon">
              <FaMapMarkedAlt />
            </span>

            <h3>France / Belgium / Holland</h3>

            <p>
              Paris → Brugge → Amsterdam with city tours, transfers and guided
              programme.
            </p>

            <strong>07 Days / 06 Nights</strong>
          </div>
        </button>

        {/* 6 - Francia Paris */}
        <button
          type="button"
          className="package-category-card francia-paris"
          onClick={() => onChoose("francia-paris")}
          disabled={loading}
        >
          <div className="package-category-overlay"></div>

          <div className="package-category-content">
            <span className="package-category-icon">
              <FaCity />
            </span>

            <h3>Francia Paris</h3>

            <p>
              Paris city tour, Seine cruise, Bruges full day tour and shopping
              programme.
            </p>

            <strong>06 Days / 05 Nights</strong>
          </div>
        </button>

        {/* 7 - Morocco & Spain */}
        <button
          type="button"
          className="package-category-card morocco-spain"
          onClick={() => onChoose("morocco-spain")}
          disabled={loading}
        >
          <div className="package-category-overlay"></div>

          <div className="package-category-content">
            <span className="package-category-icon">
              <FaUmbrellaBeach />
            </span>

            <h3>Morocco & Spain</h3>

            <p>
              Marrakech → Ouzoud → Rabat → Tangier → Malaga → Granada → Madrid
              with tours and transfers.
            </p>

            <strong>15 Days / 14 Nights</strong>
          </div>
        </button>

        {/* 8 - Italy / Switzerland / France / Spain */}
        <button
          type="button"
          className="package-category-card italy-switzerland-france-spain"
          onClick={() => onChoose("italy-switzerland-france-spain")}
          disabled={loading}
        >
          <div className="package-category-overlay"></div>

          <div className="package-category-content">
            <span className="package-category-icon">
              <FaLandmark />
            </span>

            <h3>Italy / Switzerland / France / Spain</h3>

            <p>
              Milan → Venice → Como → Lugano → Nice → Cannes → Marseille →
              Barcelona.
            </p>

            <strong>11 Days / 10 Nights</strong>
          </div>
        </button>
      </div>
    </section>
  );
}
