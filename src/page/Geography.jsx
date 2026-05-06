import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "./InfoPage.css";

/* IMAGES */
import geography from "../assets/image/geography.jpg";
import desert from "../assets/image/desert.jpg";
import nile from "../assets/image/nile.jpg";

export default function Geography() {
  const images = [geography, desert, nile];
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
          <img src={images[currentImage]} alt="Egypt geography" />

          <button className="slider-arrow left" onClick={prevImage}>
            ‹
          </button>

          <button className="slider-arrow right" onClick={nextImage}>
            ›
          </button>
        </div>

        {/* TEXT */}
        <div className="info-text">
          <h1>Geography of Egypt</h1>

          <p>
            Egypt’s geography is shaped by the Nile River, which is the longest
            river in the world and the main source of life in the country.
            Most of the population lives along the Nile Valley and Delta.
          </p>

          <p>
            The country also includes vast deserts, the Sinai Peninsula,
            and beautiful coastal areas along the Red Sea, offering
            diverse landscapes from green fields to golden الرمال and crystal waters.
          </p>

          <ul>
            <li><strong>Main River:</strong> Nile River</li>
            <li><strong>Regions:</strong> Nile Valley, Nile Delta, Western Desert</li>
            <li><strong>Peninsula:</strong> Sinai (between Africa & Asia)</li>
            <li><strong>Coasts:</strong> Red Sea & Mediterranean Sea</li>
            <li><strong>Famous Areas:</strong> Sahara Desert, Siwa Oasis, Sinai Mountains</li>
            <li><strong>Climate:</strong> Mostly hot desert climate</li>
          </ul>

          <a href="/" className="back-home-btn">Back Home</a>
        </div>

      </div>
    </div>
  );
}