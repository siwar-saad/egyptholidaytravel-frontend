import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "./InfoPage.css";

/* IMAGES */
import pyra from "../assets/image/pyra.png";
import louxor from "../assets/image/Louxor.jpg";
import aswan from "../assets/image/aswan.jpeg";
import sharm from "../assets/image/sharm.jpeg";

export default function DestinationsInfo() {
  const images = [pyra, louxor, aswan, sharm];
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
          <img src={images[currentImage]} alt="Egypt destinations" />

          <button className="slider-arrow left" onClick={prevImage}>
            ‹
          </button>

          <button className="slider-arrow right" onClick={nextImage}>
            ›
          </button>
        </div>

        <div className="info-text">
          <h1>Cities & Destinations in Egypt</h1>

          <p>
            Egypt is full of unique cities and destinations, each offering a
            different travel experience. From ancient monuments and museums to
            beaches, markets, temples, and desert adventures, every city has its
            own character.
          </p>

          <p>
            Cairo is perfect for history and city life, Alexandria offers a
            Mediterranean atmosphere, Luxor and Aswan are ideal for ancient
            temples and Nile views, while Sharm El Sheikh is famous for beaches,
            diving, and Red Sea activities.
          </p>

          <ul>
            <li><strong>Cairo:</strong> Pyramids, Egyptian Museum, Khan El Khalili</li>
            <li><strong>Alexandria:</strong> Mediterranean coast, history, cafés</li>
            <li><strong>Luxor:</strong> Karnak Temple, Valley of the Kings</li>
            <li><strong>Aswan:</strong> Nile views, Nubian culture, Philae Temple</li>
            <li><strong>Sharm El Sheikh:</strong> Red Sea beaches, diving, snorkeling</li>
          </ul>

          <a href="/" className="back-home-btn">Back Home</a>
        </div>
      </div>
    </div>
  );
}