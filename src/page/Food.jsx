import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "./InfoPage.css";

/* IMAGES */
import egyptian from "../assets/image/egyptian.jpg";
import food from "../assets/image/food.jpg";
import koshari from "../assets/image/koshari.jpg";
import mlokhia from "../assets/image/mlokhia.jpg";
import fattah from "../assets/image/fattah.jpg";

export default function Food() {
  const images = [egyptian, food, koshari, mlokhia, fattah];
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
          <img src={images[currentImage]} alt="Egyptian food" />

          <button className="slider-arrow left" onClick={prevImage}>
            ‹
          </button>

          <button className="slider-arrow right" onClick={nextImage}>
            ›
          </button>
        </div>

        <div className="info-text">
          <h1>Egyptian Food</h1>

          <p>
            Egyptian food is rich, warm, and full of flavor. It reflects the
            country’s history, culture, and daily life, using simple ingredients
            like rice, beans, bread, vegetables, herbs, and spices.
          </p>

          <p>
            From popular street food to traditional family meals, Egyptian
            cuisine offers delicious dishes that every traveler should try.
          </p>

          <ul>
            <li><strong>Koshari:</strong> Rice, pasta, lentils, chickpeas, tomato sauce, and crispy onions</li>
            <li><strong>Ful Medames:</strong> Slow-cooked fava beans served with olive oil, lemon, and bread</li>
            <li><strong>Molokhia:</strong> A green soup made from jute leaves, usually served with rice or chicken</li>
            <li><strong>Fattah:</strong> Rice, bread, meat, and garlic tomato sauce, often served on special occasions</li>
            <li><strong>Taameya:</strong> Egyptian falafel made with fava beans</li>
            <li><strong>Seafood:</strong> Popular in Alexandria, Hurghada, and Red Sea cities</li>
          </ul>

          <a href="/" className="back-home-btn">Back Home</a>
        </div>
      </div>
    </div>
  );
}