import Navbar from "../components/navbar";
import "./Packages.css";


import hurghadaImg from "../assets/image/hurghad.jpg";
import dahabImg from "../assets/image/dahab1.jpg";
import sahelImg from "../assets/image/sahel.png";
import turkeyImg from "../assets/image/turkey.jpg";
import luxorImg from "../assets/image/Lux.jpg";
import sharmImg from "../assets/image/sharm.jpeg";
import uzbekistanImg from "../assets/image/uzbekistan.jpg";
import fayoumImg from "../assets/image/fayoum.jpg";
import cairoImg from "../assets/image/cai.jpg";
import alexandriaImg from "../assets/image/alexandria.png";
import aswanImg from "../assets/image/aswan.png";
import siwaImg from "../assets/image/siwa.jpg";
import sokhnaImg from "../assets/image/ainsokhna.jpg";
import marsaImg from "../assets/image/marsaalam.jpg";

export default function Packages() {
  const packages = [
    { title: "Hurghada", img: hurghadaImg, pdf: "/pdf/HURGHADA.pdf" },
    { title: "Dahab", img: dahabImg, pdf: "/pdf/DAHAB.pdf" },
    { title: "Sahel", img: sahelImg, pdf: "/pdf/sahel.pdf" },
    { title: "Turkey Trip", img: turkeyImg, pdf: "/pdf/turkey.pdf" },
    { title: "Luxor", img: luxorImg, pdf: "/pdf/LUXOR.pdf" },
    { title: "Sharm El Sheikh", img: sharmImg, pdf: "/pdf/sharmelsheikh.pdf" },
    { title: "Uzbekistan Trip", img: uzbekistanImg, pdf: "/pdf/Uzbekistan.pdf" },
    { title: "Fayoum", img: fayoumImg, pdf: "/pdf/Fayoum.pdf" },
    { title: "Cairo", img: cairoImg, pdf: "/pdf/Cairo.pdf" },
    { title: "Alexandria", img: alexandriaImg, pdf: "/pdf/Alexandria.pdf" },
    { title: "Aswan", img: aswanImg, pdf: "/pdf/ASWAN.pdf" },
    { title: "Siwa Oasis", img: siwaImg, pdf: "/pdf/SIWA.pdf" },
    { title: "Ain Sokhna", img: sokhnaImg, pdf: "/pdf/AINSOKHNA.pdf" },
    { title: "Marsa Alam", img: marsaImg, pdf: "/pdf/MARSAALAM.pdf" },
  ];

  return (
    <div className="packages-page">
      <Navbar />

      <section className="packages-hero">
        <div className="packages-hero-content">
          <span>Egypt Holiday Travel</span>
          <h1>Our Travel Packages</h1>
          <p>
            Choose your perfect trip and open the full PDF program with all details.
          </p>
        </div>
      </section>

      <section className="packages-section">
        <h2>Choose Your Package</h2>

        <div className="packages-grid">
          {packages.map((item, index) => (
            <div className="package-card" key={index}>
              <div className="package-img-box">
                <img src={item.img} alt={item.title} />
              </div>

              <div className="package-content">
                <h3>{item.title}</h3>
                <p>
                  Discover the full travel program, hotels, activities, and trip details.
                </p>

                <a
                  href={item.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="package-btn"
                >
                  View PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}