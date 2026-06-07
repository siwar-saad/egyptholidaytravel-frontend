import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import API from "../api";
import "./Packages.css";

import cairoHurghada5 from "../assets/image/cairo-hurghada1.png";
// import cairoHurghada6 from "../assets/image/cairo-hurghada2.png";
// import cairoAlexandria6 from "../assets/image/cairo-alexandria1.png";
// import cairoLuxor6 from "../assets/image/cairo-luxor2.png";
// import cairoSharm from "../assets/image/cairo-sharm.png";
// import cairoNorthCoast from "../assets/image/alexandria.png";
// import cairoAinSokhna from "../assets/image/ainsokhna.jpg";

import {
  FaChevronDown,
  FaArrowLeft,
  FaBus,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaHotel,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaPlaneDeparture,
  FaTimes,
  FaTrain,
  FaUtensils,
} from "react-icons/fa";

const PACKAGES_DATA = [
  // {
  //    id: "cairo-hurghada-5",
  //    name: "( Cairo – Hurghada ) 5 Nights",
  //    backendName: "( Cairo – Hurghada ) 5 Nights",
  //   route: "Cairo – Hurghada",
  //   duration: "5 Nights",
  //   transfer: "Round-trip transfer by Bus from Cairo to Hurghada",
  //   startPrice: "From 345$",
  //   image: cairoHurghada5,
  //   options: [
  //     {
  //       title: "Option 01",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "2 Nights",
  //           hotel: "Hilton Cairo Grand Nile",
  //           meal: "Breakfast",
  //           sgl: "710$",
  //           dbl: "400$",
  //           tpl: "345$",
  //         },
  //         {
  //           city: "Hurghada",
  //           nights: "3 Nights",
  //           hotel: "Albatros Aqua Blu Hurghada",
  //           meal: "All Inclusive",
  //           sgl: "",
  //           dbl: "",
  //           tpl: "",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Option 02",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "2 Nights",
  //           hotel: "Ramses Hilton",
  //           meal: "Breakfast",
  //           sgl: "790$",
  //           dbl: "465$",
  //           tpl: "430$",
  //         },
  //         {
  //           city: "Hurghada",
  //           nights: "3 Nights",
  //           hotel: "Cleopatra Luxury Makadi Bay",
  //           meal: "All Inclusive",
  //           sgl: "",
  //           dbl: "",
  //           tpl: "",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "cairo-hurghada-6",
  //   name: "( Cairo – Hurghada ) 6 Nights",
  //   backendName: "( Cairo – Hurghada ) 6 Nights",
  //   route: "Cairo – Hurghada",
  //   duration: "6 Nights",
  //   transfer: "Round-trip transfer by Bus from Cairo to Hurghada",
  //   startPrice: "From 415$",
  //   image: cairoHurghada6,
  //   options: [
  //     {
  //       title: "Option 01",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "2 Nights",
  //           hotel: "Hilton Cairo Grand Nile",
  //           meal: "Breakfast",
  //           sgl: "845$",
  //           dbl: "475$",
  //           tpl: "415$",
  //         },
  //         {
  //           city: "Hurghada",
  //           nights: "4 Nights",
  //           hotel: "Albatros Aqua Blu Hurghada",
  //           meal: "All Inclusive",
  //           sgl: "",
  //           dbl: "",
  //           tpl: "",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Option 02",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "2 Nights",
  //           hotel: "Ramses Hilton",
  //           meal: "Breakfast",
  //           sgl: "930$",
  //           dbl: "555$",
  //           tpl: "515$",
  //         },
  //         {
  //           city: "Hurghada",
  //           nights: "4 Nights",
  //           hotel: "Cleopatra Luxury Makadi Bay",
  //           meal: "All Inclusive",
  //           sgl: "",
  //           dbl: "",
  //           tpl: "",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "cairo-alexandria-6",
  //   name: "( Cairo – Alexandria ) 6 Nights",
  //   backendName: "( Cairo – Alexandria ) 6 Nights",
  //   route: "Cairo – Alexandria",
  //   duration: "6 Nights",
  //   transfer: "Round-trip transfer by Bus from Cairo to Alexandria",
  //   startPrice: "From 445$",
  //   image: cairoAlexandria6,
  //   options: [
  //     {
  //       title: "Option 01",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "4 Nights",
  //           hotel: "Hilton Cairo Grand Nile",
  //           meal: "Breakfast",
  //           sgl: "980$",
  //           dbl: "545$",
  //           tpl: "445$",
  //         },
  //         {
  //           city: "Alexandria",
  //           nights: "2 Nights",
  //           hotel: "Rixos Montaza Alexandria",
  //           meal: "Breakfast",
  //           sgl: "",
  //           dbl: "",
  //           tpl: "",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Option 02",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "4 Nights",
  //           hotel: "Ramses Hilton",
  //           meal: "Breakfast",
  //           sgl: "1060$",
  //           dbl: "575$",
  //           tpl: "460$",
  //         },
  //         {
  //           city: "Alexandria",
  //           nights: "2 Nights",
  //           hotel: "SUNRISE Alex Avenue Resort (Select)",
  //           meal: "Breakfast",
  //           sgl: "",
  //           dbl: "",
  //           tpl: "",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "cairo-luxor-6",
  //   name: "( Cairo – Luxor ) 6 Nights",
  //   backendName: "( Cairo – Luxor ) 6 Nights",
  //   route: "Cairo – Luxor",
  //   duration: "6 Nights",
  //   transfer: "Round-trip transfer by Sleeping Cabin Train from Cairo to Luxor",
  //   transferReduction: "Transfer Reduction: 320$ per person",
  //   startPrice: "From 620$ / 535 EUR",
  //   image: cairoLuxor6,
  //   options: [
  //     {
  //       title: "Option 01",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "3 Nights",
  //           hotel: "Hilton Cairo Grand Nile",
  //           meal: "Breakfast",
  //           sgl: "995$",
  //           dbl: "690$",
  //           tpl: "620$",
  //         },
  //         {
  //           city: "Luxor",
  //           nights: "3 Nights",
  //           hotel: "Steigenberger Nile Palace Hotel Luxor",
  //           meal: "Breakfast",
  //           sgl: "",
  //           dbl: "",
  //           tpl: "",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Option 02",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "3 Nights",
  //           hotel: "Ramses Hilton",
  //           meal: "Breakfast",
  //           sgl: "Contact us",
  //           dbl: "Contact us",
  //           tpl: "Contact us",
  //         },
  //         {
  //           city: "Luxor",
  //           nights: "3 Nights",
  //           hotel: "To be confirmed",
  //           meal: "Breakfast",
  //           sgl: "",
  //           dbl: "",
  //           tpl: "",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "cairo-sharm-6-days",
  //   name: "Cairo & Sharm El Sheikh Program",
  //   backendName: "Cairo & Sharm El Sheikh Program",
  //   route: "Cairo – Sharm El Sheikh",
  //   duration: "6 Days / 5 Nights",
  //   transfer: "Private transfers included during the program",
  //   startPrice: "Contact us",
  //   image: cairoSharm,
  //   options: [],
  //   itinerary: [
  //     {
  //       day: "Day 1",
  //       title: "Arrival in Cairo & Pyramids Tour",
  //       details: [
  //         "Meet & assist service upon arrival at Cairo Airport.",
  //         "Private transfer to the hotel.",
  //         "Check-in and overnight in Cairo.",
  //         "Full-day tour including Giza Pyramids, The Sphinx, and Grand Egyptian Museum.",
  //         "Professional English-speaking tour guide during the tour.",
  //         "Return to the hotel and overnight.",
  //       ],
  //     },
  //     {
  //       day: "Day 2",
  //       title: "Islamic Cairo Tour",
  //       details: [
  //         "Breakfast at the hotel.",
  //         "Full-day tour in Islamic Cairo including Al Muizz Street, Al Hussein Mosque, Khan El Khalili Bazaar, and Al Azhar Mosque.",
  //         "Free time for shopping and exploring the historical atmosphere.",
  //         "Private transportation and professional tour guide included.",
  //         "Return to the hotel and overnight.",
  //       ],
  //     },
  //     {
  //       day: "Day 3",
  //       title: "Transfer to Sharm El Sheikh",
  //       details: [
  //         "Transfer to the hotel and check-in.",
  //         "Free time at leisure.",
  //         "Overnight in Sharm El Sheikh.",
  //       ],
  //     },
  //     {
  //       day: "Day 4",
  //       title: "Boat Trip & Snorkeling",
  //       details: [
  //         "Boat trip to Tiran Island or Ras Mohammed National Park.",
  //         "Snorkeling experience with lunch onboard.",
  //         "Round-trip transfers included.",
  //         "Overnight in Sharm El Sheikh.",
  //       ],
  //     },
  //     {
  //       day: "Day 5",
  //       title: "Desert Safari Experience",
  //       details: [
  //         "Desert safari experience with quad biking or buggy ride.",
  //         "Bedouin dinner with oriental show.",
  //         "Overnight in Sharm El Sheikh.",
  //       ],
  //     },
  //     {
  //       day: "Day 6",
  //       title: "Departure",
  //       details: [
  //         "Breakfast at the hotel.",
  //         "Transfer to Cairo airport for final departure.",
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "cairo-north-coast-6",
  //   name: "Cairo & North Coast Package",
  //   backendName: "Cairo & North Coast Package – 6 Nights / 7 Days",
  //   route: "Cairo – North Coast",
  //   duration: "6 Nights / 7 Days",
  //   transfer:
  //     "3 Nights in Cairo + 3 Nights in North Coast with transfer included",
  //   startPrice: "From 1,293$",
  //   image: cairoNorthCoast,
  //   options: [
  //     {
  //       title: "Luxury Package",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "3 Nights",
  //           hotel: "Hilton Ramses",
  //           meal: "To be confirmed",
  //           sgl: "1,562$",
  //           dbl: "1,781$",
  //           tpl: "2,346$",
  //         },
  //         {
  //           city: "North Coast",
  //           nights: "3 Nights",
  //           hotel: "Rixos Premium Alamein",
  //           meal: "To be confirmed",
  //           sgl: "",
  //           dbl: "",
  //           tpl: "",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Premium Package",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "3 Nights",
  //           hotel: "Fairmont Nile City",
  //           meal: "To be confirmed",
  //           sgl: "1,925$",
  //           dbl: "2,150$",
  //           tpl: "2,500$",
  //         },
  //         {
  //           city: "North Coast",
  //           nights: "3 Nights",
  //           hotel: "Gewan Palace",
  //           meal: "To be confirmed",
  //           sgl: "",
  //           dbl: "",
  //           tpl: "",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Standard Package",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "3 Nights",
  //           hotel: "Hilton Ramses",
  //           meal: "To be confirmed",
  //           sgl: "1,293$",
  //           dbl: "1,457$",
  //           tpl: "1,902$",
  //         },
  //         {
  //           city: "North Coast",
  //           nights: "3 Nights",
  //           hotel: "Azur One Eleven",
  //           meal: "To be confirmed",
  //           sgl: "",
  //           dbl: "",
  //           tpl: "",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "cairo-ain-sokhna-6",
  //   name: "Cairo & Ain El Sokhna Package",
  //   backendName: "Cairo & Ain El Sokhna Package – 6 Nights / 7 Days",
  //   route: "Cairo – Ain El Sokhna",
  //   duration: "6 Nights / 7 Days",
  //   transfer:
  //     "3 Nights in Cairo + 3 Nights in Ain El Sokhna with transfer included",
  //   startPrice: "From 1,072$",
  //   image: cairoAinSokhna,
  //   options: [
  //     {
  //       title: "Luxury Package",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "3 Nights",
  //           hotel: "The St. Regis Cairo",
  //           meal: "To be confirmed",
  //           sgl: "1,825$",
  //           dbl: "1,900$",
  //           tpl: "2,500$",
  //         },
  //         {
  //           city: "Ain El Sokhna",
  //           nights: "3 Nights",
  //           hotel: "Movenpick El Sokhna",
  //           meal: "To be confirmed",
  //           sgl: "",
  //           dbl: "",
  //           tpl: "",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Premium Package",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "3 Nights",
  //           hotel: "Hilton Ramses",
  //           meal: "To be confirmed",
  //           sgl: "1,084$",
  //           dbl: "1,260$",
  //           tpl: "1,716$",
  //         },
  //         {
  //           city: "Ain El Sokhna",
  //           nights: "3 Nights",
  //           hotel: "Coral Sea Beach",
  //           meal: "To be confirmed",
  //           sgl: "",
  //           dbl: "",
  //           tpl: "",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Standard Package",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "3 Nights",
  //           hotel: "Fairmont Nile City",
  //           meal: "To be confirmed",
  //           sgl: "1,072$",
  //           dbl: "1,214$",
  //           tpl: "1,656$",
  //         },
  //         {
  //           city: "Ain El Sokhna",
  //           nights: "3 Nights",
  //           hotel: "Stella Grand",
  //           meal: "To be confirmed",
  //           sgl: "",
  //           dbl: "",
  //           tpl: "",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "hilton-zamalek-5-6",
  //   name: "Hilton Zamalek Package",
  //   backendName: "Hilton Zamalek – 5 Nights / 6 Days",
  //   route: "Cairo",
  //   duration: "5 Nights / 6 Days",
  //   transfer: "Pick up & drop off with Cairo tours and transportation included",
  //   startPrice: "From 414$",
  //   image: cairoNorthCoast,
  //   included: [
  //     "Accommodation in hotel with breakfast",
  //     "Pick up & drop off",
  //     "Pyramids & Sphinx tour with ticket & transportation",
  //     "Grand Egyptian Museum tour with ticket & transportation",
  //     "Khan El Khalili and Old Egypt tour & mall",
  //     "All taxes included",
  //     "Flight ticket optional by request",
  //   ],
  //   options: [
  //     {
  //       title: "Price Per Person",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "5 Nights",
  //           hotel: "Hilton Zamalek",
  //           meal: "Breakfast",
  //           sgl: "555$",
  //           dbl: "444$",
  //           tpl: "414$",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Children Price",
  //       rows: [
  //         { city: "Child", nights: "0 - 2 Year", hotel: "—", meal: "—", sgl: "Free", dbl: "Free", tpl: "Free" },
  //         { city: "Child", nights: "2 - 12 Year", hotel: "—", meal: "—", sgl: "99$", dbl: "99$", tpl: "99$" },
  //         { city: "Child", nights: "6 - 12 Year", hotel: "—", meal: "—", sgl: "265$", dbl: "265$", tpl: "Second child: 265$" },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "hilton-ramsis-3-4",
  //   name: "Hilton Ramsis Package",
  //   backendName: "Hilton Ramsis – 3 Nights / 4 Days",
  //   route: "Cairo",
  //   duration: "3 Nights / 4 Days",
  //   transfer: "Pick up & drop off with Cairo tours and transportation included",
  //   startPrice: "From 249$",
  //   image: cairoAinSokhna,
  //   included: [
  //     "Accommodation in hotel with breakfast",
  //     "Pick up & drop off",
  //     "Pyramids & Sphinx tour with ticket & transportation",
  //     "Grand Egyptian Museum tour with ticket & transportation",
  //     "All taxes included",
  //     "Flight ticket optional by request",
  //   ],
  //   options: [
  //     {
  //       title: "Price Per Person",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "3 Nights",
  //           hotel: "Hilton Ramsis",
  //           meal: "Breakfast",
  //           sgl: "370$",
  //           dbl: "269$",
  //           tpl: "249$",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Children Price",
  //       rows: [
  //         { city: "Child", nights: "0 - 2 Year", hotel: "—", meal: "—", sgl: "Free", dbl: "Free", tpl: "Free" },
  //         { city: "Child", nights: "2 - 12 Year", hotel: "—", meal: "—", sgl: "99$", dbl: "99$", tpl: "99$" },
  //         { city: "Child", nights: "6 - 12 Year", hotel: "—", meal: "—", sgl: "199$", dbl: "199$", tpl: "Second child: 199$" },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "hilton-ramsis-5-6",
  //   name: "Hilton Ramsis Package",
  //   backendName: "Hilton Ramsis – 5 Nights / 6 Days",
  //   route: "Cairo",
  //   duration: "5 Nights / 6 Days",
  //   transfer: "Pick up & drop off with Cairo tours and transportation included",
  //   startPrice: "From 379$",
  //   image: cairoAlexandria6,
  //   included: [
  //     "Accommodation in hotel with breakfast",
  //     "Pick up & drop off",
  //     "Pyramids & Sphinx tour with ticket & transportation",
  //     "Grand Egyptian Museum tour with ticket & transportation",
  //     "Khan El Khalili and Old Egypt tour & mall",
  //     "All taxes included",
  //     "Flight ticket optional by request",
  //   ],
  //   options: [
  //     {
  //       title: "Price Per Person",
  //       rows: [
  //         {
  //           city: "Cairo",
  //           nights: "5 Nights",
  //           hotel: "Hilton Ramsis",
  //           meal: "Breakfast",
  //           sgl: "499$",
  //           dbl: "389$",
  //           tpl: "379$",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Children Price",
  //       rows: [
  //         { city: "Child", nights: "0 - 2 Year", hotel: "—", meal: "—", sgl: "Free", dbl: "Free", tpl: "Free" },
  //         { city: "Child", nights: "2 - 12 Year", hotel: "—", meal: "—", sgl: "99$", dbl: "99$", tpl: "99$" },
  //         { city: "Child", nights: "6 - 12 Year", hotel: "—", meal: "—", sgl: "265$", dbl: "265$", tpl: "Second child: 265$" },
  //       ],
  //     },
  //   ],
  // }
];

const NEW_HILTON_PACKAGE_IDS = new Set([
  "hilton-zamalek-5-6",
  "hilton-ramsis-3-4",
  "hilton-ramsis-5-6",
]);

const getPackageKey = (item) =>
  String(item?.id || item?.backendName || item?.backend_name || item?.name || item?.title || "")
    .trim()
    .toLowerCase();

const mergeBackendWithLocalPackages = (backendPackages, localPackages) => {
  const result = [];
  const addedKeys = new Set();

  const addPackage = (item) => {
    const key = getPackageKey(item);
    if (!key || addedKeys.has(key)) return;

    addedKeys.add(key);
    result.push(item);
  };

  // Put the new Hilton offers first so they are easy to find.
  localPackages
    .filter((item) => NEW_HILTON_PACKAGE_IDS.has(item.id))
    .forEach(addPackage);

  backendPackages.forEach(addPackage);

  // Keep the old local packages as a fallback, without duplicating backend data.
  localPackages
    .filter((item) => !NEW_HILTON_PACKAGE_IDS.has(item.id))
    .forEach(addPackage);

  return result;
};

const EMPTY_PACKAGE_BOOKING = {
  fullName: "",
  email: "",
  phone: "",
  travelers: "",
  travelDate: "",
  roomType: "DBL",
  notes: "",
};

const EMPTY_LOCKED_FIELDS = {
  fullName: false,
  email: false,
  phone: false,
};

const PACKAGE_COUNTRIES = [
  {
    flag: "https://flagcdn.com/fr.svg",
    name: "Paris / France",
    dialCode: "+33",
  },
  { flag: "https://flagcdn.com/de.svg", name: "Germany", dialCode: "+49" },
  { flag: "https://flagcdn.com/lu.svg", name: "Luxembourg", dialCode: "+352" },
  { flag: "https://flagcdn.com/tr.svg", name: "Turkey", dialCode: "+90" },
  { flag: "https://flagcdn.com/tn.svg", name: "Tunisia", dialCode: "+216" },
  { flag: "https://flagcdn.com/ma.svg", name: "Morocco", dialCode: "+212" },
  { flag: "https://flagcdn.com/ba.svg", name: "Bosnia", dialCode: "+387" },
  { flag: "https://flagcdn.com/eg.svg", name: "Egypt", dialCode: "+20" },
];

const splitStoredPhone = (phone = "") => {
  const cleanPhone = phone.trim();
  const country =
    PACKAGE_COUNTRIES.find((item) => cleanPhone.startsWith(item.dialCode)) ||
    PACKAGE_COUNTRIES[0];

  return {
    country,
    phone: cleanPhone.replace(country.dialCode, "").trim(),
  };
};

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const isPastDate = (dateValue) => {
  if (!dateValue) return false;

  const selectedDate = new Date(`${dateValue}T00:00:00`);
  const today = new Date(`${getTodayDate()}T00:00:00`);

  return selectedDate < today;
};

export default function Packages() {
  const navigate = useNavigate();
  const location = useLocation();

  const [packagesData, setPackagesData] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingPackage, setBookingPackage] = useState(null);
  const [showPackageBookingForm, setShowPackageBookingForm] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingAsAdmin, setBookingAsAdmin] = useState(false);

  const [packageBookingData, setPackageBookingData] = useState(
    EMPTY_PACKAGE_BOOKING
  );

  const [lockedClientFields, setLockedClientFields] =
    useState(EMPTY_LOCKED_FIELDS);

  const [selectedPackageCountry, setSelectedPackageCountry] = useState(
    PACKAGE_COUNTRIES[0]
  );

  const [openPackageCountry, setOpenPackageCountry] = useState(false);

  const [packageAlert, setPackageAlert] = useState({
    show: false,
    type: "error",
    title: "",
    message: "",
  });

  const getImageUrl = (image) => {
    if (!image) return "";

    const imageValue = String(image);

    if (
      imageValue.startsWith("http") ||
      imageValue.startsWith("data:") ||
      imageValue.startsWith("blob:") ||
      imageValue.startsWith("/src/") ||
      imageValue.startsWith("/assets/")
    ) {
      return imageValue;
    }

    const apiBase = API.defaults.baseURL || "/api";
    const origin = apiBase.replace(/\/api\/?$/, "");
    const cleanPath = imageValue.startsWith("/") ? imageValue : `/${imageValue}`;

    return `${origin}${cleanPath}`;
  };

  const normalizePackage = (item) => ({
    id: item.id,
    name: item.name || item.title || "Package",
    backendName:
      item.backendName || item.backend_name || item.title || item.name || "",
    route: item.route || "",
    duration: item.duration || "",
    transfer: item.transfer || "",
    transferReduction: item.transferReduction || item.transfer_reduction || "",
    startPrice:
      item.startPrice || item.start_price || item.price || "Contact us",
    image: getImageUrl(item.image) || cairoHurghada5,
    options: Array.isArray(item.options) ? item.options : [],
    itinerary: Array.isArray(item.itinerary) ? item.itinerary : [],
    programme: item.programme || "",
    included: Array.isArray(item.included) ? item.included : [],
  });

  useEffect(() => {
    const fetchPackages = async () => {
      const localPackages = PACKAGES_DATA.map(normalizePackage);

      try {
        setPackagesLoading(true);
        const res = await API.get("/packages");
        const loadedPackages = Array.isArray(res.data) ? res.data : [];
        const backendPackages = loadedPackages.map(normalizePackage);

        setPackagesData(
          mergeBackendWithLocalPackages(backendPackages, localPackages)
        );
      } catch (err) {
        console.log("Public packages error:", err.response?.data || err.message);
        setPackagesData(localPackages);
      } finally {
        setPackagesLoading(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    const openPackageId = location.state?.openPackageId;

    if (!openPackageId) return;
    if (packagesLoading) return;

    const packageToOpen = packagesData.find((item) => item.id === openPackageId);

    if (packageToOpen) {
      setSelectedPackage(packageToOpen);
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate, packagesData, packagesLoading]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const openPackage = (item) => {
    setSelectedPackage(item);
  };

  const closePackage = () => {
    setSelectedPackage(null);
  };

  const showPackageAlert = (message, type = "error") => {
    const titles = {
      success: "Booking Sent",
      error: "Missing Information",
      login: "Login Required",
    };

    setPackageAlert({
      show: true,
      type,
      title: titles[type] || "Notice",
      message,
    });
  };

  const closePackageAlert = () => {
    setPackageAlert({
      show: false,
      type: "error",
      title: "",
      message: "",
    });
  };

  const openPackageBooking = async (item) => {
    let authUser = null;

    try {
      const authRes = await API.get("/auth/me");
      authUser = authRes.data?.user || null;
    } catch {
      showPackageAlert(
        "Please login or create an account before booking.",
        "login"
      );
      return;
    }

    const isAdmin = (authUser?.role || "").toLowerCase() === "admin";

    if (isAdmin) {
      setBookingAsAdmin(true);
      setSelectedPackage(null);
      setBookingPackage(item);
      setPackageBookingData({
        ...EMPTY_PACKAGE_BOOKING,
        roomType: "DBL",
      });

      setLockedClientFields(EMPTY_LOCKED_FIELDS);
      setSelectedPackageCountry(PACKAGE_COUNTRIES[0]);
      setShowPackageBookingForm(true);
      setOpenPackageCountry(false);
      return;
    }

    let storedClient = {
      ...authUser,
    };

    try {
      const res = await API.get("/client/profile");

      storedClient = {
        ...storedClient,
        ...res.data,
      };
    } catch (err) {
      console.log("Profile prefill error:", err.response?.data || err.message);
    }

    const phoneData = splitStoredPhone(storedClient.phone || "");

    const clientFullName =
      storedClient.name ||
      `${storedClient.firstName || ""} ${storedClient.lastName || ""}`.trim();

    const clientEmail = storedClient.email || "";
    const clientPhone = phoneData.phone || "";

    setSelectedPackage(null);
    setBookingAsAdmin(false);
    setBookingPackage(item);

    setPackageBookingData({
      ...EMPTY_PACKAGE_BOOKING,
      fullName: clientFullName,
      email: clientEmail,
      phone: clientPhone,
      roomType: "DBL",
    });

    setLockedClientFields({
      fullName: Boolean(clientFullName),
      email: Boolean(clientEmail),
      phone: Boolean(clientPhone),
    });

    setSelectedPackageCountry(phoneData.country);
    setShowPackageBookingForm(true);
    setOpenPackageCountry(false);
  };

  const closePackageBooking = () => {
    setShowPackageBookingForm(false);
    setBookingPackage(null);
    setBookingAsAdmin(false);
    setOpenPackageCountry(false);
    setLockedClientFields(EMPTY_LOCKED_FIELDS);
  };

  const submitPackageBooking = async () => {
    if (!bookingPackage || bookingLoading) return;

    const requiredFields = [
      packageBookingData.fullName,
      packageBookingData.email,
      packageBookingData.phone,
      packageBookingData.travelers,
      packageBookingData.travelDate,
    ];

    const hasEmptyField = requiredFields.some((field) => !String(field).trim());

    if (hasEmptyField) {
      showPackageAlert(
        "Please complete your full name, email, phone, travelers and travel date."
      );
      return;
    }

    if (isPastDate(packageBookingData.travelDate)) {
      showPackageAlert("Please choose today or a future travel date.");
      return;
    }

    const fullPhone = `${selectedPackageCountry.dialCode} ${packageBookingData.phone.trim()}`;

    const reservationData = {
      booking_type: "package",
      search_params: {
        name: bookingPackage.name,
        backendName: bookingPackage.backendName,
        route: bookingPackage.route,
        duration: bookingPackage.duration,
        transfer: bookingPackage.transfer,
        roomType: packageBookingData.roomType,
        travelDate: packageBookingData.travelDate,
        startPrice: bookingPackage.startPrice,
      },
      customer_info: {
        fullName: packageBookingData.fullName.trim(),
        email: packageBookingData.email.trim(),
        country: selectedPackageCountry.name,
        phone: fullPhone,
        travelers: packageBookingData.travelers,
        notes: packageBookingData.notes,
      },
      total_price: 0,
    };

    try {
      setBookingLoading(true);

      if (bookingAsAdmin) {
        await API.post("/admin/reservations", {
          packageName: bookingPackage.name,
          route: bookingPackage.route,
          duration: bookingPackage.duration,
          travelDate: packageBookingData.travelDate,
          roomType: packageBookingData.roomType,
          fullName: packageBookingData.fullName.trim(),
          email: packageBookingData.email.trim(),
          phone: fullPhone,
          travelers: packageBookingData.travelers,
          notes: packageBookingData.notes,
          totalPrice: 0,
        });
      } else {
        await API.post("/client/bookings", reservationData);
      }

      setPackageBookingData(EMPTY_PACKAGE_BOOKING);
      setSelectedPackageCountry(PACKAGE_COUNTRIES[0]);
      setOpenPackageCountry(false);
      setShowPackageBookingForm(false);
      setBookingPackage(null);
      setBookingAsAdmin(false);
      setLockedClientFields(EMPTY_LOCKED_FIELDS);

      showPackageAlert(
        "Your package booking request has been sent successfully. Our team will contact you soon.",
        "success"
      );
    } catch (error) {
      console.error("Package booking error:", error.message);
      showPackageAlert("Package booking request failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="packages-page">
      <Navbar />

      <main className="packages-main">
        <section className="packages-hero-pro">
          <div className="packages-hero-overlay"></div>

          <div className="packages-hero-content">
            <h1>Egypt Travel Packages</h1>

            <p>
              Discover organized Egypt packages with clear hotels, meal plans,
              transfers, and prices per person per room.
            </p>

            <div className="packages-hero-stats">
              <div>
                <strong>{packagesData.length}</strong>
                <span>Packages</span>
              </div>

              <div>
                <strong>4★ / 5★</strong>
                <span>Hotels</span>
              </div>

              <div>
                <strong>Bus / Train</strong>
                <span>Transfers</span>
              </div>
            </div>
          </div>
        </section>

        <section className="packages-list-section">
          <div className="packages-section-head">
            <span>Our Offers</span>
            <h2>Available Packages</h2>
            <p>
              Each card below represents one complete package with its own
              backend name.
            </p>
          </div>

          <div className="packages-grid-pro">
            {packagesLoading ? (
              <p className="empty-packages-message">Loading packages...</p>
            ) : packagesData.length === 0 ? (
              <p className="empty-packages-message">No published packages yet.</p>
            ) : (
              packagesData.map((item) => (
                <article className="package-card-pro" key={item.id}>
                  <div className="package-img-box">
                    <img src={item.image} alt={item.name} loading="lazy" />

                    <div className="package-img-overlay">
                      <span>{item.duration}</span>
                    </div>
                  </div>

                  <div className="package-card-body">

                    <h3>{item.name}</h3>

                    <div className="package-info-row">
                      <FaMapMarkedAlt />
                      <span>{item.route}</span>
                    </div>

                    <div className="package-info-row">
                      <FaCalendarAlt />
                      <span>{item.duration}</span>
                    </div>

                    <div className="package-info-row">
                      {item.route.includes("Luxor") ? <FaTrain /> : <FaBus />}
                      <span>{item.transfer}</span>
                    </div>

                    <div className="package-price-box">
                      <small>Starting Price</small>
                      <strong>{item.startPrice}</strong>
                    </div>

                    <div className="package-card-actions">
                      <button type="button" onClick={() => openPackage(item)}>
                        View Details
                      </button>

                      <button
                        type="button"
                        className="package-book-btn"
                        onClick={() => openPackageBooking(item)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="packages-contact-pro" id="packages-contact">
          <div className="packages-contact-card">
            <div className="packages-contact-title">
              <FaCheckCircle />

              <div>
                <h2>You Need More Information About Package?</h2>
                <p>
                  Contact our team and mention the package name you want. We
                  will help you choose the best option.
                </p>
              </div>
            </div>

            <div className="packages-contact-links">
              <a href="mailto:amr@egyptholiday-travel.com">
                <span>
                  <FaEnvelope />
                </span>

                <div>
                  <small>Email Us</small>
                  <strong>amr@egyptholiday-travel.com</strong>
                </div>
              </a>

              <a href="tel:01099959949">
                <span>
                  <FaPhoneAlt />
                </span>

                <div>
                  <small>Call Us</small>
                  <strong>01099959949</strong>
                </div>
              </a>
            </div>

            <a href="/" className="packages-back-home">
              <FaArrowLeft />
              Back Home
            </a>
          </div>
        </section>
      </main>

      {selectedPackage && (
        <PackageModal
          item={selectedPackage}
          onClose={closePackage}
          onBook={openPackageBooking}
        />
      )}

      {showPackageBookingForm && bookingPackage && (
        <PackageBookingForm
          item={bookingPackage}
          bookingData={packageBookingData}
          setBookingData={setPackageBookingData}
          selectedCountry={selectedPackageCountry}
          setSelectedCountry={setSelectedPackageCountry}
          openCountry={openPackageCountry}
          setOpenCountry={setOpenPackageCountry}
          countries={PACKAGE_COUNTRIES}
          onClose={closePackageBooking}
          onSubmit={submitPackageBooking}
          loading={bookingLoading}
          lockedClientFields={lockedClientFields}
        />
      )}

      {packageAlert.show && (
        <PackageProAlert
          alert={packageAlert}
          onClose={closePackageAlert}
          onLogin={() => {
            closePackageAlert();
            navigate("/login", {
              state: {
                redirectTo: "/packages",
              },
            });
          }}
          onSignup={() => {
            closePackageAlert();
            navigate("/signup");
          }}
        />
      )}

      <Footer />
    </div>
  );
}

function PackageModal({ item, onClose, onBook }) {
  const hasItinerary = Array.isArray(item.itinerary) && item.itinerary.length > 0;
  const hasOptions = Array.isArray(item.options) && item.options.length > 0;

  return (
    <div className="package-modal-overlay">
      <div className="package-modal-box">
        <button type="button" className="package-modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="package-modal-image">
          <img src={item.image} alt={item.name} />

          <div>
            <span>{item.duration}</span>
            <h2>{item.name}</h2>
          </div>
        </div>

        <div className="package-modal-content">
          <span className="package-back-name modal-back-name">
            Back Name: {item.backendName}
          </span>

          <div className="package-modal-meta">
            <div>
              <FaMapMarkedAlt />
              <span>{item.route}</span>
            </div>

            <div>
              <FaCalendarAlt />
              <span>{item.duration}</span>
            </div>

            <div>
              {item.route.includes("Luxor") ? <FaTrain /> : <FaBus />}
              <span>{item.transfer}</span>
            </div>
          </div>

          {item.transferReduction && (
            <div className="transfer-reduction-box">
              {item.transferReduction}
            </div>
          )}

          {hasItinerary ? (
            <div className="package-itinerary">
              {item.itinerary.map((day) => (
                <div className="package-day-card" key={day.day}>
                  <div className="package-day-number">{day.day}</div>

                  <div className="package-day-content">
                    <h3>{day.title}</h3>

                    <ul>
                      {day.details.map((detail, index) => (
                        <li key={`${day.day}-${index}`}>
                          <FaCheckCircle />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : hasOptions ? (
            <div className="package-options">
              {item.options.map((option) => (
                <div className="package-option-card" key={option.title}>
                  <h3>{option.title}</h3>

                  <div className="package-table-wrapper">
                    <table className="package-table">
                      <thead>
                        <tr>
                          <th>City</th>
                          <th>Nights</th>
                          <th>Hotel</th>
                          <th>Meal Plan</th>
                          <th>SGL</th>
                          <th>DBL</th>
                          <th>TPL</th>
                        </tr>
                      </thead>

                      <tbody>
                        {option.rows.map((row, index) => (
                          <tr key={`${option.title}-${row.city}-${index}`}>
                            <td>{row.city}</td>
                            <td>{row.nights}</td>
                            <td>{row.hotel}</td>
                            <td>
                              <span className="meal-badge">
                                <FaUtensils />
                                {row.meal}
                              </span>
                            </td>
                            <td>{row.sgl || "—"}</td>
                            <td>{row.dbl || "—"}</td>
                            <td>{row.tpl || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="package-option-card">
              <h3>Programme</h3>
              <p className="package-programme-text">
                {item.programme ||
                  "Package details will be confirmed by our team."}
              </p>
            </div>
          )}


          {Array.isArray(item.included) && item.included.length > 0 && (
            <div className="package-included-card">
              <h3>Price Included</h3>

              <ul>
                {item.included.map((text, index) => (
                  <li key={`${item.id}-included-${index}`}>
                    <FaCheckCircle />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="package-note-box">
            <FaHotel />

            <p>
              Above rates are per person per room, including the meals mentioned
              above and the transfer stated in this package.
            </p>
          </div>

          <div className="package-programme-contact">
            <h4>Need the complete package programme?</h4>

            <p>
              If you would like the full package programme, please contact us by
              email or phone and our team will send you all details.
            </p>

            <div className="package-programme-contact-links">
              <a href="mailto:amr@egyptholiday-travel.com">
                <FaEnvelope />
                amr@egyptholiday-travel.com
              </a>

              <a href="tel:01099959949">
                <FaPhoneAlt />
                01099959949
              </a>
            </div>
          </div>

          <button
            type="button"
            className="package-modal-book"
            onClick={() => onBook(item)}
          >
            <FaPlaneDeparture />
            Book This Package
          </button>
        </div>
      </div>
    </div>
  );
}

function PackageBookingForm({
  item,
  bookingData,
  setBookingData,
  selectedCountry,
  setSelectedCountry,
  openCountry,
  setOpenCountry,
  countries,
  onClose,
  onSubmit,
  loading,
  lockedClientFields,
}) {
  const todayDate = getTodayDate();

  const isClientDataLocked =
    lockedClientFields?.fullName ||
    lockedClientFields?.email ||
    lockedClientFields?.phone;

  const updateBooking = (field, value) => {
    if (lockedClientFields?.[field]) return;

    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const chooseCountry = (country) => {
    if (lockedClientFields?.phone) return;

    setSelectedCountry(country);
    setOpenCountry(false);
  };

  return (
    <div className="package-booking-popup">
      <div className="package-booking-box">
        <button
          type="button"
          className="package-booking-close"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <h2>Book This Package</h2>

        <p>
          Complete the form below and our travel team will contact you with the
          best offer.
        </p>

        <div className="package-booking-summary">
          <strong>{item.name}</strong>
          <span>{item.route}</span>
          <span>{item.duration}</span>
          <span>{item.startPrice}</span>
        </div>

        {isClientDataLocked && (
          <div className="booking-locked-note">
            Your name, email and phone are taken from your account and cannot be
            changed here.
          </div>
        )}

        <div className="package-booking-form">
          <input
            type="text"
            placeholder="Full Name"
            value={bookingData.fullName}
            readOnly={lockedClientFields?.fullName}
            className={lockedClientFields?.fullName ? "booking-locked-input" : ""}
            onChange={(e) => updateBooking("fullName", e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={bookingData.email}
            readOnly={lockedClientFields?.email}
            className={lockedClientFields?.email ? "booking-locked-input" : ""}
            onChange={(e) => updateBooking("email", e.target.value)}
          />

          <div className="package-booking-phone">
            <div
              className={`package-booking-country ${
                openCountry ? "active" : ""
              } ${lockedClientFields?.phone ? "booking-locked-country" : ""}`}
            >
              <button
                type="button"
                className="package-booking-country-btn"
                disabled={lockedClientFields?.phone}
                onClick={() => {
                  if (lockedClientFields?.phone) return;
                  setOpenCountry((prev) => !prev);
                }}
              >
                <div className="package-booking-country-left">
                  <img src={selectedCountry.flag} alt={selectedCountry.name} />

                  <div>
                    <small>Country</small>
                    <strong>{selectedCountry.name}</strong>
                  </div>
                </div>

                <FaChevronDown />
              </button>

              {openCountry && !lockedClientFields?.phone && (
                <div className="package-booking-country-menu">
                  {countries.map((country) => (
                    <button
                      type="button"
                      key={country.dialCode}
                      className={
                        selectedCountry.dialCode === country.dialCode
                          ? "package-booking-country-option selected"
                          : "package-booking-country-option"
                      }
                      onClick={() => chooseCountry(country)}
                    >
                      <img src={country.flag} alt={country.name} />
                      <span>{country.name}</span>
                      <strong>{country.dialCode}</strong>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="package-booking-phone-input">
              <span>{selectedCountry.dialCode}</span>

              <input
                type="tel"
                placeholder="Phone Number / WhatsApp"
                value={bookingData.phone}
                readOnly={lockedClientFields?.phone}
                className={lockedClientFields?.phone ? "booking-locked-input" : ""}
                onChange={(e) => updateBooking("phone", e.target.value)}
              />
            </div>
          </div>

          <input
            type="number"
            min="1"
            placeholder="Number of Travelers"
            value={bookingData.travelers}
            onChange={(e) => updateBooking("travelers", e.target.value)}
          />

          <div className="package-date-field">
            <label>Travel Date</label>

            <input
              type="date"
              min={todayDate}
              value={bookingData.travelDate}
              onChange={(e) => updateBooking("travelDate", e.target.value)}
            />
          </div>

          <select
            value={bookingData.roomType}
            onChange={(e) => updateBooking("roomType", e.target.value)}
          >
            <option value="SGL">Single Room</option>
            <option value="DBL">Double Room</option>
            <option value="TPL">Triple Room</option>
          </select>

          <textarea
            placeholder="Special requests or notes"
            value={bookingData.notes}
            onChange={(e) => updateBooking("notes", e.target.value)}
          />

          <button
            type="button"
            className="submit-package-booking"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Booking Request"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PackageProAlert({ alert, onClose, onLogin, onSignup }) {
  const isLoginAlert = alert.type === "login";

  return (
    <div className="package-pro-alert-overlay">
      <div className={`package-pro-alert ${alert.type}`}>
        <button
          type="button"
          className="package-pro-alert-close"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <div className="package-pro-alert-icon">
          {alert.type === "success" ? "✓" : isLoginAlert ? "🔐" : "!"}
        </div>

        <h3>{alert.title}</h3>
        <p>{alert.message}</p>

        {isLoginAlert ? (
          <div className="package-pro-alert-actions">
            <button
              type="button"
              className="package-pro-alert-btn"
              onClick={onLogin}
            >
              Login
            </button>

            <button
              type="button"
              className="package-pro-alert-secondary"
              onClick={onSignup}
            >
              Create Account
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="package-pro-alert-btn"
            onClick={onClose}
          >
            OK
          </button>
        )}
      </div>
    </div>
  );
}