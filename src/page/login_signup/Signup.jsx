import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

import API from "../../api";
import "./Login.css";

import pyramid from "../../assets/image/pyramid.webp";
import passport from "../../assets/image/passport.webp";
import visa from "../../assets/image/visa.webp";
import login from "../../assets/image/login.png";
import Navbar from "../../components/navbar";

const COUNTRIES = [
  {
    flag: "https://flagcdn.com/fr.svg",
    name: "France",
    dialCode: "+33",
  },
  {
    flag: "https://flagcdn.com/de.svg",
    name: "Germany",
    dialCode: "+49",
  },
  {
    flag: "https://flagcdn.com/lu.svg",
    name: "Luxembourg",
    dialCode: "+352",
  },
  {
    flag: "https://flagcdn.com/tr.svg",
    name: "Turkey",
    dialCode: "+90",
  },
  {
    flag: "https://flagcdn.com/tn.svg",
    name: "Tunisia",
    dialCode: "+216",
  },
  {
    flag: "https://flagcdn.com/ma.svg",
    name: "Morocco",
    dialCode: "+212",
  },
  {
    flag: "https://flagcdn.com/ba.svg",
    name: "Bosnia",
    dialCode: "+387",
  },
];

export default function Signup() {
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const chooseCountry = (country) => {
    setSelectedCountry(country);
    setOpenCountry(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    const fullPhone = `${selectedCountry.dialCode} ${phone.trim()}`;

    try {
      setLoading(true);

      const response = await API.post("/auth/signup", {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phone: fullPhone,
        country: selectedCountry.name,
      });

      if (response.data.success) {
        setShowSuccess(true);

        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="auth-page">
        <div className="auth-card signup-card">
          <div className="auth-left">
            <div className="auth-shape"></div>

            <img src={login} alt="Egypt Holiday"  loading="lazy" className="auth-brand-image" />

            <img
              src={pyramid}
              className="auth-icon icon-pyramid"
              loading="lazy"
              alt="pyramid"
            />

            <img
              src={passport}
              className="auth-icon icon-passport"
              loading="lazy"
              alt="passport"
            />

            <img src={visa} className="auth-icon icon-visa" loading="lazy" alt="visa" />
          </div>

          <div className="auth-right signup-right">
            <form className="auth-form signup-form" onSubmit={handleSignup}>
              <div className="signup-title-box">
                <h2>Sign Up</h2>

                <p>
                  Create your account and manage your bookings easily with us.
                </p>
              </div>

              <div className="signup-row">
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Last Name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="signup-row">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="phone-field">
                <div
                  className={`custom-country ${openCountry ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="custom-country-btn"
                    onClick={() => setOpenCountry(!openCountry)}
                  >
                    <div className="country-left">
                      <img
                        src={selectedCountry.flag}
                        alt={selectedCountry.name}
                         loading="lazy"
                        className="country-flag"
                      />

                      <div className="country-text">
                        <small>Country</small>
                        <strong>{selectedCountry.name}</strong>
                      </div>
                    </div>

                    <div className="country-right">
                      <FaChevronDown />
                    </div>
                  </button>

                  {openCountry && (
                    <div className="country-menu">
                      {COUNTRIES.map((country) => (
                        <button
                          type="button"
                          key={country.dialCode}
                          className={
                            selectedCountry.dialCode === country.dialCode
                              ? "country-option selected"
                              : "country-option"
                          }
                          onClick={() => chooseCountry(country)}
                        >
                          <img
                            src={country.flag}
                            alt={country.name}
                             loading="lazy"
                            className="country-option-flag"
                          />

                          <span className="country-option-name">
                            {country.name}
                          </span>

                          <span className="country-option-code">
                            {country.dialCode}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="phone-input-box">
                  <span className="phone-country-code">
                    {selectedCountry.dialCode}
                  </span>

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {error && <span className="auth-error">{error}</span>}

              <button type="submit" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              <p className="auth-switch">
                Already have an account?{" "}
                <span onClick={() => navigate("/login")}>Log in</span>
              </p>
            </form>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-icon">✓</div>

            <h2>Account Created</h2>

            <p>Your Egypt Holiday account has been created successfully.</p>

            <button
              type="button"
              onClick={() => {
                setShowSuccess(false);
                navigate("/profile");
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
