import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "./InfoPage.css";

/* IMAGES */
import photo from "../assets/image/photo.jpg";
import aesthetic from "../assets/image/aesthetic.jpg";
import AbuSemble from "../assets/image/AbuSemble.jpg";

export default function History() {
  const images = [photo, aesthetic, AbuSemble];
  const [currentImage, setCurrentImage] = useState(0);

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
        <div className="info-image-box">
          <img src={images[currentImage]} alt="Egypt history" />

          <button className="slider-arrow left" onClick={prevImage}>
            ‹
          </button>

          <button className="slider-arrow right" onClick={nextImage}>
            ›
          </button>
        </div>

        <div className="info-text">
          <h1>History of Egypt</h1>

          <p>
            Egypt has one of the oldest and richest histories in the world,
            dating back over 5,000 years. It is known as the land of pharaohs,
            pyramids, temples, and ancient achievements that still attract
            millions of visitors every year.
          </p>

          <p>
            Ancient Egyptians built a powerful civilization along the Nile River.
            Their culture was famous for architecture, writing, art, religion,
            medicine, and astronomy. Later, Egypt was influenced by Greek,
            Roman, Islamic, and modern cultures, creating a unique identity.
          </p>

          <ul>
            <li><strong>Age:</strong> Over 5,000 years of history</li>
            <li><strong>Famous For:</strong> Pyramids, pharaohs, temples, and the Sphinx</li>
            <li><strong>Ancient Capital:</strong> Memphis and Thebes were major historic centers</li>
            <li><strong>Key Periods:</strong> Pharaonic, Greek, Roman, Islamic, and modern eras</li>
            <li><strong>Legacy:</strong> Hieroglyphics, monuments, mummies, and ancient knowledge</li>
            <li><strong>Top Historical Cities:</strong> Cairo, Luxor, Aswan, and Alexandria</li>
          </ul>

          <a href="/" className="back-home-btn">Back Home</a>
        </div>
      </div>
    </div>
  );
}