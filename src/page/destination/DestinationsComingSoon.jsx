import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "./DestinationsComingSoon.css";

export default function DestinationsComingSoon() {
  return (
    <>
      <Navbar />

      <main className="destinations-coming-page">
        <section className="destinations-coming-section">
          <div className="destinations-coming-card">
            <span className="destinations-coming-label">
              Egypt Holiday Travel
            </span>

            <h1>Destinations</h1>

            <h2>Coming Soon</h2>

            <p className="destinations-coming-text">
              We are preparing a beautiful destinations page with the best
              places to visit in Egypt. Stay tuned for more details.
            </p>

            <div className="destinations-contact-box">
              <h3>Need More Details?</h3>

              <p>
                If you would like to know more about our destinations, trips, or
                travel programs, please contact our agency. Our team will be
                happy to help you choose the perfect destination.
              </p>

              <div className="destinations-contact-list">
                <a href="tel:01099999234">01099999234</a>
                <a href="tel:01050971444">01050971444</a>
                <a href="tel:01050383173">01050383173</a>
                <a href="tel:0111787867">0111787867</a>
                <a href="mailto:info@egyptholidaytravel.com">
                  info@egyptholidaytravel.com
                </a>
              </div>
            </div>

            <a href="/" className="destinations-coming-btn">
              Back To Home
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}