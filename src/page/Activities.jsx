import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "./InfoPage.css";

/* IMAGES */
import AbuSemble from "../assets/image/AbuSemble.jpg";
import nile from "../assets/image/nile.jpg";
import safari from "../assets/image/safari.jpg";
import diving from "../assets/image/diving.jpg";

export default function Activities() {
  const images = [AbuSemble, nile, safari, diving];
  const [currentImage, setCurrentImage] = useState(0);

  /* slider 3s */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="info-page">
      <Navbar />

      <div className="info-page-card info-flex">

        {/* IMAGE */}
        <div className="info-image-box">
          <img src={images[currentImage]} alt="Egypt activities" />

          <button className="slider-arrow left" onClick={prevImage}>
            ‹
          </button>

          <button className="slider-arrow right" onClick={nextImage}>
            ›
          </button>
        </div>

        {/* TEXT */}
        <div className="info-text">
          <h1>Activities in Egypt</h1>

          <p>
            Egypt offers a wide range of unforgettable activities for every
            traveler. Whether you love history, adventure, or relaxation,
            you will always find something amazing to do.
          </p>

          <p>
            From exploring ancient monuments and cruising the Nile River
            to diving in the Red Sea and enjoying desert adventures,
            Egypt combines culture, nature, and excitement in one destination.
          </p>

          <ul>
            <li><strong>Visit Monuments:</strong> Pyramids, temples, museums</li>
            <li><strong>Nile Cruises:</strong> Relaxing trips between Luxor & Aswan</li>
            <li><strong>Diving:</strong> Red Sea coral reefs and marine life</li>
            <li><strong>Desert Safari:</strong> 4x4 adventures and camping</li>
            <li><strong>Snorkeling:</strong> Crystal clear water experience</li>
            <li><strong>Cultural Tours:</strong> Markets, local life, traditions</li>
          </ul>

          <a href="/" className="back-home-btn">Back Home</a>
        </div>

      </div>
    </div>
  );
}