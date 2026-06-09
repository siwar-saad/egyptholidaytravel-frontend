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
                <a href="tel:+201099999234">+201099999234</a>
                <a href="tel:+201050971444">+201050971444</a>
                <a href="tel:+201050383173">+201050383173</a>
                <a href="tel:+201001579926">+201001579926</a>
                <a href="tel:+201050971555">+201050971555</a>
                <a href="tel:+201018357333">+201018357333</a>

                <a href="amr@egyptholiday-travel.com">
                  amr@egyptholiday-travel.com
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
