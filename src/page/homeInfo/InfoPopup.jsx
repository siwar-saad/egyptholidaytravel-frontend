import { useEffect, useState } from "react";

export default function InfoPopup({ item, onClose }) {
  const [currentImage, setCurrentImage] = useState(0);

  const images = item?.images || [];
  const imageIndex = images.length > 0 ? currentImage % images.length : 0;

  useEffect(() => {
    if (!item || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [item, images.length]);

  useEffect(() => {
    if (!item) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [item, onClose]);

  if (!item) return null;

  const nextImage = () => {
    if (images.length === 0) return;

    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (images.length === 0) return;

    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="info-popup-overlay" onClick={onClose}>
      <div className="info-popup" onClick={(e) => e.stopPropagation()}>
        <button
          className="info-popup-close"
          type="button"
          onClick={onClose}
          aria-label="Close popup"
        >
          ×
        </button>

        <div className="info-popup-image">
          {images.length > 0 && (
            <img
              src={images[imageIndex]}
              alt={item.popupTitle || "Egypt information"}
            />
          )}

          <div className="info-popup-gradient"></div>

          <div className="info-popup-image-text">
            <span>Explore Egypt</span>
            <h3>{item.cardTitle}</h3>
          </div>

          {images.length > 1 && (
            <>
              <button
                className="popup-arrow left"
                type="button"
                onClick={prevImage}
                aria-label="Previous image"
              >
                ‹
              </button>

              <button
                className="popup-arrow right"
                type="button"
                onClick={nextImage}
                aria-label="Next image"
              >
                ›
              </button>

              <div className="popup-dots">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={index === imageIndex ? "active" : ""}
                    onClick={() => setCurrentImage(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="info-popup-content">
          <span className="info-popup-badge">Egypt Holiday Travel</span>

          <h2>{item.popupTitle || item.cardTitle}</h2>

          {(item.paragraphs || []).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          <div className="popup-details">
            {(item.details || []).map(([label, value], index) => (
              <div className="popup-detail-item" key={index}>
                <strong>{label}</strong>
                <span>{value}</span>
              </div>
            ))}
          </div>

          <button className="popup-done-btn" type="button" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}