import cairoImg from "../../assets/image/egy.webp";
import { infoSections } from "./infoData";

export default function HomeInfoSection({ onOpen }) {
  const leftItems = infoSections.filter((item) => item.side === "left");
  const rightItems = infoSections.filter((item) => item.side === "right");

  const renderCard = (item) => (
    <div
      key={item.id}
      className="info-block clickable-info"
      onClick={() => onOpen(item)}
    >
      <h3>{item.cardTitle}</h3>

      <ul>
        {item.cardItems.map((text, index) => (
          <li key={index}>{text}</li>
        ))}
      </ul>

      <button
        className="read-btn"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpen(item);
        }}
      >
        Read More →
      </button>
    </div>
  );

  return (
    <section className="info-section" id="info">
      <h2>Information About Egypt</h2>

      <div className="info-layout">
        <div className="info-side left-side">{leftItems.map(renderCard)}</div>

        <div className="cinematic-card">
          <img src={cairoImg} alt="Egypt statue"  loading="lazy" className="cinematic-image" />
          <span className="cinematic-light"></span>
        </div>

        <div className="info-side right-side">{rightItems.map(renderCard)}</div>
      </div>
    </section>
  );
}