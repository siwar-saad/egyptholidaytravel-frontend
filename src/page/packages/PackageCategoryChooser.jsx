import { FaMapMarkedAlt, FaPlaneDeparture } from "react-icons/fa";

export default function PackageCategoryChooser({ egyptCount, othersCount, loading, onChoose }) {
  return (
    <section className="packages-category-section">
      <div className="packages-section-head">
        <span>Choose Destination</span>
        <h2>Select Your Package Type</h2>
        <p>Choose Egypt trips or explore other international trips.</p>
      </div>

      <div className="packages-category-grid">
        <button
          type="button"
          className="package-category-card egypt"
          onClick={() => onChoose("egypt")}
          disabled={loading}
        >
          <div className="package-category-overlay"></div>

          <div className="package-category-content">
            <span className="package-category-icon">
              <FaMapMarkedAlt />
            </span>

            <h3>Egypt Trips</h3>
            <p>
              Discover Cairo, Nile cruises, Red Sea stays, Luxor, Aswan and top
              Egypt holiday packages.
            </p>

            <strong>{loading ? "Loading..." : `${egyptCount} packages`}</strong>
          </div>
        </button>

        <button
          type="button"
          className="package-category-card others"
          onClick={() => onChoose("others")}
          disabled={loading}
        >
          <div className="package-category-overlay"></div>

          <div className="package-category-content">
            <span className="package-category-icon">
              <FaPlaneDeparture />
            </span>

            <h3>International Trips</h3>
            <p>
              Explore Turkey, Europe and international offers inside the
              international trips block.
            </p>

            <strong>
              {loading
                ? "Loading..."
                : `${othersCount} destination${othersCount === 1 ? "" : "s"}`}
            </strong>
          </div>
        </button>
      </div>
    </section>
  );
}
