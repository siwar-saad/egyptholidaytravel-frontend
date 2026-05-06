import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "./InfoPage.css";

/* IMAGES  */
import cai from "../assets/image/cai.jpg";
import Louxor from "../assets/image/Louxor.jpg";
import shar from "../assets/image/shar.jpg";
import diving from "../assets/image/diving.jpg";
import farsha from "../assets/image/farsha.jpg";
import safari from "../assets/image/safari.jpg";

export default function BasicFacts() {
  const images = [cai, Louxor, shar , diving , farsha, safari];
  const [currentImage, setCurrentImage] = useState(0);

  /* auto slider */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* arrows */
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

        {/* IMAGE LEFT */}
        <div className="info-image-box">
          <img src={images[currentImage]} alt="Egypt" />

          <button className="slider-arrow left" onClick={prevImage}>
            ‹
          </button>

          <button className="slider-arrow right" onClick={nextImage}>
            ›
          </button>
        </div>

        {/* TEXT RIGHT */}
        <div className="info-text">
          <h1>Basic Facts About Egypt</h1>

          <p>
            Egypt, officially the Arab Republic of Egypt, is a transcontinental country located primarily in North Africa, 
            with the Sinai Peninsula serving as a land bridge to Asia
          </p>
            It is often referred to as the "gift of the Nile" because the country’s,
             population and agriculture are concentrated along the banks of the world's longest river, which flows from south to north through the Sahara Desert.
          <p></p>

          <ul>
            <li><strong>Capital:</strong> Cairo</li>
            <li><strong>Language:</strong> Arabic</li>
            <li><strong>Currency:</strong> Egyptian Pound</li>
            <li><strong>Population:</strong> 100+ million</li>
          </ul>

          <a href="/" className="back-home-btn">Back Home</a>
        </div>

      </div>
    </div>
  );
}