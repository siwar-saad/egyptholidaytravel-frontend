import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaRobot,
  FaPaperPlane,
  FaSuitcaseRolling,
  FaHotel,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaThumbsUp,
  FaThumbsDown,
  FaStar,
  FaGlobeAfrica,
  FaCheckCircle,
} from "react-icons/fa";

import API from "../api";
import "./HomeChatbot.css";

export default function HomeChatbot() {
  const navigate = useNavigate();
  const endRef = useRef(null);

  const AGENCY_CONTACT = {
    phoneDisplay: "+20 109 999 9234",
    phoneCall: "+201099999234",
    whatsappDisplay: "+20 109 999 9234",
    whatsappUrl: "https://wa.me/201099999234",
    email: "egyptholidaytravel0@gmail.com",
  };

  const DESTINATIONS = [
    "Cairo",
    "Sharm El Sheikh",
    "Hurghada",
    "Luxor",
    "Aswan",
    "Alexandria",
    "Dahab",
    "Siwa",
    "Fayoum",
    "North Coast",
    "Ain Sokhna",
  ];

  const INITIAL_LEAD = {
    type: "",
    destination: "",
    checkIn: "",
    checkOut: "",
    datesFlexible: "",
    travelers: null,
    adults: null,
    children: 0,
    budget: null,
    budgetType: "",
    tripStyle: "",
    hotelCategory: "",
    roomType: "",
    mealPlan: "",
    activities: [],
    transport: "",
    flightHelp: "",
    specialRequests: "",
    contactPreference: "",
  };

  const INITIAL_MESSAGE = {
    sender: "bot",
    text:
      "Welcome to Egypt Holiday Travel 👋\n\n" +
      "I am your smart travel advisor. I can help you choose the best package or hotel according to your destination, budget, travel dates, travelers, room preferences, meal plan, and activities.\n\n" +
      "What are you looking for?",
    actions: ["I want a package", "I want a hotel", "Contact", "Help me choose"],
  };

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [packagesData, setPackagesData] = useState([]);
  const [hotelsData, setHotelsData] = useState([]);
  const [user, setUser] = useState(null);
  const [, setTripType] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [lead, setLead] = useState(INITIAL_LEAD);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);

  const openLink = (url, target = "_self") => {
    if (!url) return;

    if (
      typeof globalThis !== "undefined" &&
      typeof globalThis.open === "function"
    ) {
      globalThis.open(
        url,
        target,
        target === "_blank" ? "noopener,noreferrer" : undefined
      );
    }
  };

  useEffect(() => {
    const makeArray = (data) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.packages)) return data.packages;
      if (Array.isArray(data?.hotels)) return data.hotels;
      return [];
    };

    const loadUser = async () => {
      const savedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          return;
        } catch {
          setUser(null);
        }
      }

      try {
        const res = await API.get("/auth/me", { skipAuthRedirect: true });
        if (res.data?.user) setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };

    const loadBotData = async () => {
      try {
        const res = await API.get("/packages");
        setPackagesData(makeArray(res.data));
      } catch (err) {
        console.log(
          "Chatbot packages error:",
          err.response?.data || err.message
        );
      }

      try {
        const res = await API.get("/hotels");
        setHotelsData(makeArray(res.data));
      } catch (err) {
        console.log("Chatbot hotels error:", err.response?.data || err.message);
      }
    };

    loadUser();
    loadBotData();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, isTyping]);

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const isLoggedIn = Boolean(user);

  const userName =
    user?.name ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.email ||
    "dear client";

  const resetChat = () => {
    setLead(INITIAL_LEAD);
    setTripType("");
    setFeedbackDone(false);
    setMessages([INITIAL_MESSAGE]);
  };

  const getPackageName = (item) =>
    item?.name ||
    item?.title ||
    item?.packageName ||
    item?.backendName ||
    item?.trip ||
    "Package";

  const getPackagePlace = (item) =>
    item?.city ||
    item?.place ||
    item?.location ||
    item?.destination ||
    item?.country ||
    item?.route ||
    "";

  const getPackageDuration = (item) => item?.duration || item?.days || "";

  const getPackagePriceText = (item) =>
    item?.price ||
    item?.startPrice ||
    item?.start_price ||
    item?.startingPrice ||
    item?.amount ||
    item?.cost ||
    "";

  const getHotelName = (hotel) =>
    hotel?.name || hotel?.title || hotel?.hotelName || "Hotel";

  const getHotelCity = (hotel) =>
    hotel?.city || hotel?.place || hotel?.location || "Egypt";

  const getHotelMeal = (hotel) =>
    hotel?.meal ||
    hotel?.mealPlan ||
    hotel?.meal_plan ||
    hotel?.board ||
    "To be confirmed";

  const getHotelStars = (hotel) =>
    hotel?.stars || hotel?.rating || hotel?.category || "";

  const getPeriodFrom = (period) =>
    period?.from ||
    period?.fromDate ||
    period?.startDate ||
    period?.checkIn ||
    "-";

  const getPeriodTo = (period) =>
    period?.to ||
    period?.toDate ||
    period?.endDate ||
    period?.checkOut ||
    "-";

  const getHotelPeriods = (hotel) => {
    if (Array.isArray(hotel?.periods)) return hotel.periods;

    if (
      hotel?.fromDate ||
      hotel?.toDate ||
      hotel?.from ||
      hotel?.to ||
      hotel?.startDate ||
      hotel?.endDate
    ) {
      return [
        {
          from: hotel.from || hotel.fromDate || hotel.startDate,
          to: hotel.to || hotel.toDate || hotel.endDate,
          single: hotel.single || hotel.singleRoom || hotel.single_room,
          double: hotel.double || hotel.doubleRoom || hotel.double_room,
          triple: hotel.triple || hotel.tripleRoom || hotel.triple_room,
        },
      ];
    }

    return [];
  };

  const getPriceNumber = (price) => {
    if (!price) return null;
    if (typeof price === "number") return price;

    const clean = String(price).replace(/,/g, "");
    const match = clean.match(new RegExp("\\d+(\\.\\d+)?"));

    return match ? Number(match[0]) : null;
  };

  const parseDateValue = (value) => {
    if (!value) return "";

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toISOString().slice(0, 10);
    }

    const clean = String(value).trim();

    const isoRegex = new RegExp(
      "^(\\d{4})[/-](\\d{1,2})[/-](\\d{1,2})$"
    );
    const iso = clean.match(isoRegex);

    if (iso) {
      const [, y, m, d] = iso;
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(
        2,
        "0"
      )}`;
    }

    const normalRegex = new RegExp(
      "^(\\d{1,2})[/-](\\d{1,2})[/-](\\d{2,4})$"
    );
    const normal = clean.match(normalRegex);

    if (normal) {
      let [, d, m, y] = normal;

      if (y.length === 2) y = `20${y}`;

      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(
        2,
        "0"
      )}`;
    }

    return "";
  };

  const formatDateForUser = (date) => {
    if (!date) return "";

    const parsed = parseDateValue(date);
    if (!parsed) return date;

    const [year, month, day] = parsed.split("-");
    if (!year || !month || !day) return date;

    return `${day}/${month}/${year}`;
  };

  const extractDateRange = (text) => {
    const q = String(text || "");

    const dateRegex = new RegExp(
      "(\\d{4}[/-]\\d{1,2}[/-]\\d{1,2}|\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4})",
      "g"
    );

    const matches = q.match(dateRegex);

    if (!matches || matches.length < 2) {
      return { checkIn: "", checkOut: "" };
    }

    return {
      checkIn: parseDateValue(matches[0]),
      checkOut: parseDateValue(matches[1]),
    };
  };

  const removeDatesFromText = (text) => {
    const dateRegex = new RegExp(
      "(\\d{4}[/-]\\d{1,2}[/-]\\d{1,2}|\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4})",
      "g"
    );

    return String(text || "").replace(dateRegex, " ");
  };

  const isValidDateRange = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return false;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return false;
    }

    return end > start;
  };

  const isDateInsidePeriod = (checkIn, checkOut, period) => {
    if (!checkIn || !checkOut) return true;

    const periodFrom = parseDateValue(getPeriodFrom(period));
    const periodTo = parseDateValue(getPeriodTo(period));

    if (!periodFrom || !periodTo) return false;

    const userStart = new Date(checkIn);
    const userEnd = new Date(checkOut);
    const availableStart = new Date(periodFrom);
    const availableEnd = new Date(periodTo);

    if (
      Number.isNaN(userStart.getTime()) ||
      Number.isNaN(userEnd.getTime()) ||
      Number.isNaN(availableStart.getTime()) ||
      Number.isNaN(availableEnd.getTime())
    ) {
      return false;
    }

    return userStart >= availableStart && userEnd <= availableEnd;
  };

  const extractBudget = (text) => {
    const clean = normalize(removeDatesFromText(text)).replace(/,/g, "");

    const patterns = [
      new RegExp(
        "(budget|pudget|price|cost|under|less|flous|prix)[^0-9]{0,20}(\\d+(\\.\\d+)?)"
      ),
      new RegExp("\\$\\s*(\\d+(\\.\\d+)?)"),
      new RegExp("(\\d+(\\.\\d+)?)\\s*(dollar|dollars|usd|\\$)"),
    ];

    for (const pattern of patterns) {
      const match = clean.match(pattern);

      if (match) {
        const value = Number(match[2] || match[1]);
        if (!Number.isNaN(value)) return value;
      }
    }

    const fallback = clean.match(new RegExp("\\d+(\\.\\d+)?"));
    if (!fallback) return null;

    const number = Number(fallback[0]);
    return number >= 100 ? number : null;
  };

  const extractDestination = (text) => {
    const q = normalize(text);

    if (q.includes("any destination")) return "Any destination";

    const found = DESTINATIONS.find((destination) =>
      q.includes(normalize(destination))
    );

    if (found) return found;

    if (q.includes("sharm")) return "Sharm El Sheikh";
    if (q.includes("sokhna")) return "Ain Sokhna";
    if (q.includes("north")) return "North Coast";

    return "";
  };

  const detectType = (question) => {
    const q = normalize(question);

    if (
      q.includes("hotel") ||
      q.includes("hotels") ||
      q.includes("room") ||
      q.includes("rooms")
    ) {
      return "hotel";
    }

    if (
      q.includes("package") ||
      q.includes("packages") ||
      q.includes("pack") ||
      q.includes("pac") ||
      q.includes("paka") ||
      q.includes("trip") ||
      q.includes("program")
    ) {
      return "package";
    }

    return "";
  };

  const extractTravelers = (text) => {
    const q = normalize(text);

    const adultsMatch = q.match(new RegExp("(\\d+)\\s*(adult|adults)"));
    const childrenMatch = q.match(
      new RegExp("(\\d+)\\s*(child|children|kid|kids)")
    );
    const travelersMatch = q.match(
      new RegExp("(\\d+)\\s*(traveler|travelers|people|persons|guests)")
    );

    const adults = adultsMatch ? Number(adultsMatch[1]) : null;
    const children = childrenMatch ? Number(childrenMatch[1]) : 0;
    const travelers = travelersMatch ? Number(travelersMatch[1]) : null;

    if (adults !== null) {
      return {
        adults,
        children,
        travelers: adults + children,
      };
    }

    if (travelers !== null) {
      return {
        adults: travelers,
        children: 0,
        travelers,
      };
    }

    return {};
  };

  const extractBudgetType = (text) => {
    const q = normalize(text);

    if (q.includes("per person")) return "Per person";
    if (q.includes("total budget") || q.includes("total")) return "Total budget";
    if (q.includes("not sure")) return "Not sure";

    return "";
  };

  const extractTripStyle = (text) => {
    const q = normalize(text);

    if (q.includes("family")) return "Family trip";
    if (q.includes("couple")) return "Couple trip";
    if (q.includes("honeymoon")) return "Honeymoon";
    if (q.includes("friends")) return "Friends trip";
    if (q.includes("business")) return "Business trip";
    if (q.includes("solo")) return "Solo travel";

    return "";
  };

  const extractHotelCategory = (text) => {
    const q = normalize(text);

    if (q.includes("3 stars") || q.includes("3 star")) return "3 stars";
    if (q.includes("4 stars") || q.includes("4 star")) return "4 stars";
    if (q.includes("5 stars") || q.includes("5 star")) return "5 stars";
    if (q.includes("luxury")) return "Luxury hotel";
    if (q.includes("budget hotel")) return "Budget hotel";

    return "";
  };

  const extractRoomType = (text) => {
    const q = normalize(text);

    if (q.includes("single")) return "Single Room";
    if (q.includes("double")) return "Double Room";
    if (q.includes("triple")) return "Triple Room";
    if (q.includes("family room")) return "Family Room";
    if (q.includes("suite")) return "Suite";

    return "";
  };

  const extractMealPlan = (text) => {
    const q = normalize(text);

    if (q.includes("breakfast")) return "Breakfast only";
    if (q.includes("half board")) return "Half board";
    if (q.includes("full board")) return "Full board";
    if (q.includes("all inclusive")) return "All inclusive";

    return "";
  };

  const extractDatesFlexible = (text) => {
    const q = normalize(text);

    if (q.includes("flexible dates") || q.includes("yes, flexible")) {
      return "Flexible";
    }

    if (q.includes("fixed dates") || q.includes("not flexible")) {
      return "Fixed";
    }

    return "";
  };

  const extractActivities = (text) => {
    const q = normalize(text);
    const activities = [];

    if (q.includes("beach")) activities.push("Beach");
    if (q.includes("safari")) activities.push("Safari");
    if (q.includes("diving")) activities.push("Diving");
    if (q.includes("historical") || q.includes("history")) {
      activities.push("Historical tours");
    }
    if (q.includes("nile")) activities.push("Nile cruise");
    if (q.includes("shopping")) activities.push("Shopping");
    if (q.includes("relaxation") || q.includes("relax")) {
      activities.push("Relaxation");
    }
    if (q.includes("adventure")) activities.push("Adventure");
    if (q.includes("activities: not sure")) activities.push("Not sure");

    return activities;
  };

  const extractTransport = (text) => {
    const q = normalize(text);

    if (q.includes("airport transfer")) return "Airport transfer";
    if (q.includes("private car")) return "Private car";
    if (q.includes("bus")) return "Bus";
    if (q.includes("no transportation")) return "No transportation needed";

    return "";
  };

  const extractFlightHelp = (text) => {
    const q = normalize(text);

    if (q.includes("need flight help") || q.includes("flight assistance")) {
      return "Yes, I need flight help";
    }

    if (q.includes("no flight needed") || q.includes("no flight")) {
      return "No flight needed";
    }

    return "";
  };

  const extractSpecialRequests = (text) => {
    const q = normalize(text);
    const requests = [];

    if (q.includes("sea view")) requests.push("Sea view");
    if (q.includes("city center")) requests.push("Near city center");
    if (q.includes("honeymoon setup")) requests.push("Honeymoon setup");
    if (q.includes("child-friendly")) requests.push("Child-friendly hotel");
    if (q.includes("quiet")) requests.push("Quiet hotel");
    if (q.includes("wheelchair")) requests.push("Wheelchair access");
    if (q.includes("no special")) return "None";

    return requests.join(", ");
  };

  const extractContactPreference = (text) => {
    const q = normalize(text);

    if (q.includes("contact by whatsapp")) return "WhatsApp";
    if (q.includes("contact by phone")) return "Phone call";
    if (q.includes("contact by email")) return "Email";

    return "";
  };

  const extractLeadUpdates = (question) => {
    const updates = {};
    const q = normalize(question);

    const detectedType = detectType(question);
    const destination = extractDestination(question);
    const dates = extractDateRange(question);
    const budget = extractBudget(question);
    const travelersData = extractTravelers(question);
    const budgetType = extractBudgetType(question);
    const tripStyle = extractTripStyle(question);
    const hotelCategory = extractHotelCategory(question);
    const roomType = extractRoomType(question);
    const mealPlan = extractMealPlan(question);
    const datesFlexible = extractDatesFlexible(question);
    const activities = extractActivities(question);
    const transport = extractTransport(question);
    const flightHelp = extractFlightHelp(question);
    const specialRequests = extractSpecialRequests(question);
    const contactPreference = extractContactPreference(question);

    if (detectedType) updates.type = detectedType;
    if (destination) updates.destination = destination;
    if (dates.checkIn) updates.checkIn = dates.checkIn;
    if (dates.checkOut) updates.checkOut = dates.checkOut;
    if (budget) updates.budget = budget;
    if (budgetType) updates.budgetType = budgetType;
    if (tripStyle) updates.tripStyle = tripStyle;
    if (hotelCategory) updates.hotelCategory = hotelCategory;
    if (roomType) updates.roomType = roomType;
    if (mealPlan) updates.mealPlan = mealPlan;
    if (datesFlexible) updates.datesFlexible = datesFlexible;
    if (activities.length > 0) updates.activities = activities;
    if (transport) updates.transport = transport;
    if (flightHelp) updates.flightHelp = flightHelp;
    if (specialRequests) updates.specialRequests = specialRequests;
    if (contactPreference) updates.contactPreference = contactPreference;

    if (travelersData.travelers) {
      updates.travelers = travelersData.travelers;
      updates.adults = travelersData.adults;
      updates.children = travelersData.children;
    }

    if (q.includes("i want a package")) updates.type = "package";
    if (q.includes("i want a hotel")) updates.type = "hotel";

    return updates;
  };

  const destinationMatches = (text, destination) => {
    if (!destination || destination === "Any destination") return true;
    return normalize(text).includes(normalize(destination));
  };

  const roomMatches = (optionRoom, selectedRoom) => {
    if (!selectedRoom) return true;

    const selected = normalize(selectedRoom);

    if (selected.includes("family") || selected.includes("suite")) {
      return true;
    }

    return normalize(optionRoom).includes(selected.split(" ")[0]);
  };

  const categoryMatches = (hotel, selectedCategory) => {
    if (!selectedCategory) return true;

    const category = normalize(
      `${getHotelStars(hotel)} ${hotel?.category || ""}`
    );
    const selected = normalize(selectedCategory);

    if (selected.includes("luxury") || selected.includes("budget hotel")) {
      return true;
    }

    if (selected.includes("3")) return category.includes("3");
    if (selected.includes("4")) return category.includes("4");
    if (selected.includes("5")) return category.includes("5");

    return true;
  };

  const mealMatches = (hotel, selectedMeal) => {
    if (!selectedMeal) return true;

    const meal = normalize(getHotelMeal(hotel));
    const selected = normalize(selectedMeal);

    if (selected.includes("breakfast")) return meal.includes("breakfast");
    if (selected.includes("half board")) return meal.includes("half");
    if (selected.includes("full board")) return meal.includes("full");
    if (selected.includes("all inclusive")) return meal.includes("inclusive");

    return true;
  };

  const getLowestHotelPrice = (hotel) => {
    const periods = getHotelPeriods(hotel);

    const prices = periods
      .flatMap((period) => [
        period.single,
        period.double,
        period.triple,
        period.singleRoom,
        period.doubleRoom,
        period.tripleRoom,
        period.single_room,
        period.double_room,
        period.triple_room,
      ])
      .map((price) => ({
        text: price,
        number: getPriceNumber(price),
      }))
      .filter((price) => price.number);

    if (prices.length === 0) {
      const fallback =
        hotel?.price ||
        hotel?.startPrice ||
        hotel?.single ||
        hotel?.double ||
        hotel?.triple ||
        hotel?.singleRoom ||
        hotel?.doubleRoom ||
        hotel?.tripleRoom;

      return {
        text: fallback || "Contact us",
        number: getPriceNumber(fallback),
      };
    }

    return prices.sort((a, b) => a.number - b.number)[0];
  };

  const getHotelRoomOptions = (hotel, currentLead) => {
    const periods = getHotelPeriods(hotel);

    if (periods.length === 0) return [];

    const checkIn = currentLead.checkIn;
    const checkOut = currentLead.checkOut;

    return periods
      .filter((period) => {
        if (currentLead.datesFlexible === "Flexible" && !checkIn && !checkOut) {
          return true;
        }

        return isDateInsidePeriod(checkIn, checkOut, period);
      })
      .flatMap((period) => {
        const rooms = [
          {
            room: "Single Room",
            priceText: period.single || period.singleRoom || period.single_room,
          },
          {
            room: "Double Room",
            priceText: period.double || period.doubleRoom || period.double_room,
          },
          {
            room: "Triple Room",
            priceText: period.triple || period.tripleRoom || period.triple_room,
          },
        ];

        return rooms
          .map((room) => ({
            hotel,
            period,
            room: room.room,
            priceText: room.priceText,
            priceNumber: getPriceNumber(room.priceText),
          }))
          .filter((option) => option.priceNumber);
      });
  };

  const preparePackageOptions = () => {
    return packagesData
      .map((item) => {
        const priceText = getPackagePriceText(item);
        const priceNumber = getPriceNumber(priceText);

        return {
          item,
          name: getPackageName(item),
          place: getPackagePlace(item),
          duration: getPackageDuration(item),
          priceText: priceText || "Contact us",
          priceNumber,
        };
      })
      .filter((option) => option.priceNumber);
  };

  const findPackage = (question) => {
    const q = normalize(question);

    return packagesData.find((item) => {
      const name = normalize(getPackageName(item));
      const place = normalize(getPackagePlace(item));
      const words = name.split(" ").filter((word) => word.length > 3);

      return (
        (name && q.includes(name)) ||
        (place && q.includes(place)) ||
        words.some((word) => q.includes(word))
      );
    });
  };

  const findHotel = (question) => {
    const q = normalize(question);

    return hotelsData.find((hotel) => {
      const name = normalize(getHotelName(hotel));
      const city = normalize(getHotelCity(hotel));
      const meal = normalize(getHotelMeal(hotel));
      const words = name.split(" ").filter((word) => word.length > 3);

      return (
        (name && q.includes(name)) ||
        (city && q.includes(city)) ||
        (meal && q.includes(meal)) ||
        words.some((word) => q.includes(word))
      );
    });
  };

  const askType = () => ({
    text:
      `Hello ${userName} 👋\n\n` +
      "I can guide you step by step like a professional travel advisor.\n\n" +
      "First, tell me what you want to search for.",
    actions: ["I want a package", "I want a hotel", "Contact"],
  });

  const askDestination = (type) => ({
    text:
      `Perfect. You are looking for a ${
        type === "hotel" ? "hotel" : "package"
      }.\n\nWhich destination do you prefer?`,
    actions: [
      "Cairo",
      "Sharm El Sheikh",
      "Hurghada",
      "Luxor",
      "Dahab",
      "Any destination",
    ],
  });

  const askDate = () => ({
    text:
      "What are your travel dates?\n\n" +
      "Example:\n" +
      "• from 20/06/2026 to 25/06/2026\n" +
      "• 20-06-2026 to 25-06-2026\n\n" +
      "If your dates are flexible, choose flexible dates.",
    actions: [
      "Dates: 20/06/2026 to 25/06/2026",
      "Yes, flexible dates",
      "Contact",
    ],
  });

  const askTravelers = () => ({
    text:
      "How many travelers are you?\n\n" +
      "You can also mention adults and children.",
    actions: [
      "1 adult",
      "2 adults",
      "2 adults and 1 child",
      "Family: 2 adults and 2 children",
    ],
  });

  const askBudget = (type, destination = "") => ({
    text:
      `Great${destination ? `, destination: ${destination}` : ""}.\n\n` +
      `What is your budget for this ${
        type === "hotel" ? "hotel" : "package"
      }?\n\nExample:\n• 300 dollars\n• 500 dollars\n• 900 dollars`,
    actions: ["Budget 300$", "Budget 500$", "Budget 900$", "Contact"],
  });

  const askBudgetType = () => ({
    text: "Is your budget per person or total?",
    actions: ["Per person", "Total budget", "I am not sure"],
  });

  const askTripStyle = () => ({
    text: "What type of trip are you looking for?",
    actions: [
      "Family trip",
      "Couple trip",
      "Honeymoon",
      "Friends trip",
      "Business trip",
      "Solo travel",
    ],
  });

  const askHotelCategory = () => ({
    text: "What hotel category do you prefer?",
    actions: ["3 stars", "4 stars", "5 stars", "Luxury hotel", "Budget hotel"],
  });

  const askRoomType = () => ({
    text: "Which room type do you prefer?",
    actions: [
      "Single Room",
      "Double Room",
      "Triple Room",
      "Family Room",
      "Suite",
    ],
  });

  const askMealPlan = () => ({
    text: "Which meal plan do you prefer?",
    actions: ["Breakfast only", "Half board", "Full board", "All inclusive"],
  });

  const askActivities = () => ({
    text: "What activities are you interested in?",
    actions: [
      "Beach",
      "Safari",
      "Diving",
      "Historical tours",
      "Nile cruise",
      "Shopping",
      "Relaxation",
      "Adventure",
      "Activities: Not sure",
    ],
  });

  const askTransport = () => ({
    text: "Do you need transportation or airport transfer?",
    actions: [
      "Airport transfer",
      "Private car",
      "Bus",
      "No transportation needed",
    ],
  });

  const askFlight = () => ({
    text:
      "Do you need flight assistance?\n\n" +
      "Flights are coming soon on the website, but the agency team can still help you directly.",
    actions: ["Need flight help", "No flight needed"],
  });

  const askSpecialRequests = () => ({
    text: "Do you have any special requests?",
    actions: [
      "Sea view",
      "Near city center",
      "Honeymoon setup",
      "Child-friendly hotel",
      "Quiet hotel",
      "Wheelchair access",
      "No special requests",
    ],
  });

  const askContactPreference = () => ({
    text: "How do you prefer our team to contact you?",
    actions: [
      "Contact by WhatsApp",
      "Contact by Phone call",
      "Contact by Email",
    ],
  });

  const dateErrorAnswer = () => ({
    text:
      "The travel dates are not correct.\n\n" +
      "Please send them like this:\n" +
      "from 20/06/2026 to 25/06/2026\n\n" +
      "The check-out date must be after the check-in date.",
    actions: ["Dates: 20/06/2026 to 25/06/2026", "Yes, flexible dates"],
  });

  const getNextQuestion = (currentLead) => {
    if (!currentLead.type) return askType();

    if (!currentLead.destination) return askDestination(currentLead.type);

    if (
      currentLead.datesFlexible !== "Flexible" &&
      (!currentLead.checkIn || !currentLead.checkOut)
    ) {
      return askDate();
    }

    if (
      currentLead.checkIn &&
      currentLead.checkOut &&
      !isValidDateRange(currentLead.checkIn, currentLead.checkOut)
    ) {
      return dateErrorAnswer();
    }

    if (!currentLead.travelers) return askTravelers();

    if (!currentLead.budget) {
      return askBudget(currentLead.type, currentLead.destination);
    }

    if (!currentLead.budgetType) return askBudgetType();

    if (!currentLead.tripStyle) return askTripStyle();

    if (currentLead.type === "hotel") {
      if (!currentLead.hotelCategory) return askHotelCategory();
      if (!currentLead.roomType) return askRoomType();
      if (!currentLead.mealPlan) return askMealPlan();
    }

    if (!currentLead.activities || currentLead.activities.length === 0) {
      return askActivities();
    }

    if (!currentLead.transport) return askTransport();

    if (!currentLead.flightHelp) return askFlight();

    if (!currentLead.specialRequests) return askSpecialRequests();

    if (!currentLead.contactPreference) return askContactPreference();

    return null;
  };

  const noDataAnswer = (type) => ({
    text:
      `I could not access enough live ${type} data right now.\n\n` +
      "Professional advice: contact our agency team. They can confirm updated prices, availability, dates, and the best offer for you.",
    actions: ["Contact", "WhatsApp", "Call Agency", "Email Agency"],
    feedback: true,
  });

  const recommendPackagesByBudget = (currentLead) => {
    const allPackages = preparePackageOptions();

    if (allPackages.length === 0) return noDataAnswer("package");

    const filteredPackages = allPackages.filter((option) =>
      destinationMatches(`${option.name} ${option.place}`, currentLead.destination)
    );

    const source = filteredPackages.length > 0 ? filteredPackages : allPackages;

    const options = source
      .filter((option) => option.priceNumber <= currentLead.budget)
      .sort((a, b) => b.priceNumber - a.priceNumber)
      .slice(0, 3);

    if (options.length === 0) {
      const closest = source
        .filter((option) => option.priceNumber > currentLead.budget)
        .sort((a, b) => a.priceNumber - b.priceNumber)[0];

      return {
        text:
          `I checked the available packages with your budget of ${currentLead.budget}$` +
          `${
            currentLead.destination
              ? ` for ${currentLead.destination}`
              : ""
          }.\n\n` +
          "Right now, I did not find a package clearly inside this budget.\n\n" +
          (closest
            ? `The closest package I found is:\n${closest.name} — ${closest.priceText}\n\n`
            : "") +
          "Professional advice: contact our team to check updated prices, discounts, dates, and availability.",
        actions: ["Open Packages", "Contact", "WhatsApp", "Start New Search"],
        feedback: true,
      };
    }

    const cards = options.map((option, index) => ({
      type: "package",
      title: option.name,
      subtitle: option.place || "Tour Package",
      price: option.priceText,
      meta: [
        option.duration ? `Duration: ${option.duration}` : "",
        option.place ? `Destination: ${option.place}` : "",
        `Travelers: ${currentLead.travelers}`,
        `Budget: ${currentLead.budget}$ ${currentLead.budgetType}`,
        currentLead.tripStyle ? `Trip type: ${currentLead.tripStyle}` : "",
        currentLead.activities?.length
          ? `Activities: ${currentLead.activities.join(", ")}`
          : "",
      ].filter(Boolean),
      reason:
        index === 0
          ? "Best value inside your budget"
          : "Good alternative inside your budget",
      action: "Open Packages",
    }));

    return {
      text:
        `Based on your budget of ${currentLead.budget}$` +
        `${
          currentLead.destination
            ? ` and destination ${currentLead.destination}`
            : ""
        }` +
        ", I found the best matching packages for you.\n\n" +
        `Best recommendation: ${options[0].name}.\n\n` +
        "Why? It gives you strong value while staying inside your budget.",
      actions: ["Open Packages", "Contact", "WhatsApp", "Start New Search"],
      cards,
      feedback: true,
    };
  };

  const recommendHotelsByBudget = (currentLead) => {
    const allHotelOptions = hotelsData.flatMap((hotel) =>
      getHotelRoomOptions(hotel, currentLead)
    );

    if (allHotelOptions.length === 0) {
      return {
        text:
          "I could not find hotel options available for these travel dates.\n\n" +
          "Professional advice: contact our agency team to confirm updated hotel availability, prices, and possible alternatives.",
        actions: ["Contact", "WhatsApp", "Call Agency", "Open Hotels"],
        feedback: true,
      };
    }

    let source = allHotelOptions.filter((option) =>
      destinationMatches(
        `${getHotelName(option.hotel)} ${getHotelCity(option.hotel)}`,
        currentLead.destination
      )
    );

    if (source.length === 0) source = allHotelOptions;

    const categoryFiltered = source.filter((option) =>
      categoryMatches(option.hotel, currentLead.hotelCategory)
    );

    if (categoryFiltered.length > 0) source = categoryFiltered;

    const mealFiltered = source.filter((option) =>
      mealMatches(option.hotel, currentLead.mealPlan)
    );

    if (mealFiltered.length > 0) source = mealFiltered;

    const roomFiltered = source.filter((option) =>
      roomMatches(option.room, currentLead.roomType)
    );

    if (roomFiltered.length > 0) source = roomFiltered;

    const hotelOptions = source
      .filter((option) => option.priceNumber <= currentLead.budget)
      .sort((a, b) => b.priceNumber - a.priceNumber)
      .slice(0, 3);

    if (hotelOptions.length === 0) {
      const closest = source
        .filter((option) => option.priceNumber > currentLead.budget)
        .sort((a, b) => a.priceNumber - b.priceNumber)[0];

      return {
        text:
          `I checked hotels with your budget of ${currentLead.budget}$` +
          `${
            currentLead.destination
              ? ` in ${currentLead.destination}`
              : ""
          }` +
          `${
            currentLead.checkIn && currentLead.checkOut
              ? ` from ${formatDateForUser(
                  currentLead.checkIn
                )} to ${formatDateForUser(currentLead.checkOut)}`
              : ""
          }.\n\n` +
          "I did not find a hotel clearly inside this budget and preference range.\n\n" +
          (closest
            ? `Closest option found:\n${getHotelName(closest.hotel)} — ${
                closest.room
              } — ${closest.priceText}\n\n`
            : "") +
          "Please contact our agency team to confirm availability, updated prices, and possible offers.",
        actions: ["Contact", "WhatsApp", "Open Hotels", "Start New Search"],
        feedback: true,
      };
    }

    const cards = hotelOptions.map((option, index) => ({
      type: "hotel",
      title: getHotelName(option.hotel),
      subtitle: getHotelCity(option.hotel),
      price: option.priceText,
      meta: [
        `Room: ${option.room}`,
        `Preferred room: ${currentLead.roomType}`,
        `Meal: ${getHotelMeal(option.hotel)}`,
        currentLead.hotelCategory
          ? `Preferred category: ${currentLead.hotelCategory}`
          : "",
        getHotelStars(option.hotel)
          ? `Hotel category: ${getHotelStars(option.hotel)}`
          : "",
        `Available period: ${getPeriodFrom(option.period)} → ${getPeriodTo(
          option.period
        )}`,
        currentLead.checkIn && currentLead.checkOut
          ? `Your dates: ${formatDateForUser(
              currentLead.checkIn
            )} → ${formatDateForUser(currentLead.checkOut)}`
          : `Dates: ${currentLead.datesFlexible}`,
        `Travelers: ${currentLead.travelers}`,
      ].filter(Boolean),
      reason:
        index === 0
          ? "Best hotel option for your budget and preferences"
          : "Suitable alternative for your budget and preferences",
      action: "Open Hotels",
    }));

    return {
      text:
        `Based on your budget of ${currentLead.budget}$` +
        `${
          currentLead.destination
            ? `, destination ${currentLead.destination}`
            : ""
        }` +
        `${
          currentLead.checkIn && currentLead.checkOut
            ? `, and dates from ${formatDateForUser(
                currentLead.checkIn
              )} to ${formatDateForUser(currentLead.checkOut)}`
            : ""
        }` +
        ", I found suitable hotel options for you.\n\n" +
        `Best recommendation: ${getHotelName(hotelOptions[0].hotel)}.\n\n` +
        "Why? It fits your budget, travel period, and hotel preferences.",
      actions: ["Open Hotels", "Contact", "WhatsApp", "Start New Search"],
      cards,
      feedback: true,
    };
  };

  const buildSummary = (currentLead) => {
    return (
      "Great, here is what I understood:\n\n" +
      `Type: ${currentLead.type === "hotel" ? "Hotel" : "Package"}\n` +
      `Destination: ${currentLead.destination || "Any destination"}\n` +
      `Dates: ${
        currentLead.checkIn && currentLead.checkOut
          ? `${formatDateForUser(currentLead.checkIn)} → ${formatDateForUser(
              currentLead.checkOut
            )}`
          : currentLead.datesFlexible || "Not specified"
      }\n` +
      `Travelers: ${currentLead.travelers || "Not specified"}${
        currentLead.adults
          ? ` (${currentLead.adults} adults, ${
              currentLead.children || 0
            } children)`
          : ""
      }\n` +
      `Budget: ${currentLead.budget || "Not specified"}$ ${
        currentLead.budgetType || ""
      }\n` +
      `Trip style: ${currentLead.tripStyle || "Not specified"}\n` +
      `${
        currentLead.type === "hotel"
          ? `Hotel category: ${
              currentLead.hotelCategory || "Not specified"
            }\nRoom type: ${
              currentLead.roomType || "Not specified"
            }\nMeal plan: ${currentLead.mealPlan || "Not specified"}\n`
          : ""
      }` +
      `Activities: ${
        currentLead.activities?.length
          ? currentLead.activities.join(", ")
          : "Not specified"
      }\n` +
      `Transportation: ${currentLead.transport || "Not specified"}\n` +
      `Flight help: ${currentLead.flightHelp || "Not specified"}\n` +
      `Special requests: ${currentLead.specialRequests || "None"}\n` +
      `Contact preference: ${currentLead.contactPreference || "Not specified"}`
    );
  };

  const finalRecommendation = (currentLead) => {
    const recommendation =
      currentLead.type === "hotel"
        ? recommendHotelsByBudget(currentLead)
        : recommendPackagesByBudget(currentLead);

    const flightNote =
      currentLead.flightHelp === "Yes, I need flight help"
        ? "\n\nNote: Flights are coming soon on the website, but our agency team can assist you directly with flight details."
        : "";

    return {
      ...recommendation,
      text:
        buildSummary(currentLead) +
        flightNote +
        "\n\nNow I will show you the best matching options.\n\n" +
        recommendation.text,
    };
  };

  const packageDetails = (item) => ({
    text:
      `${getPackageName(item)}\n\n` +
      `${
        getPackagePlace(item)
          ? `Destination: ${getPackagePlace(item)}\n`
          : ""
      }` +
      `${
        getPackageDuration(item)
          ? `Duration: ${getPackageDuration(item)}\n`
          : ""
      }` +
      `Price: ${getPackagePriceText(item) || "Contact us"}\n\n` +
      "Tell me your budget and I will check if this package fits you.",
    actions: ["Budget 300$", "Budget 500$", "Budget 900$", "Open Packages"],
    feedback: true,
  });

  const hotelDetails = (hotel) => {
    const periods = getHotelPeriods(hotel);
    const lowest = getLowestHotelPrice(hotel);

    const periodText =
      periods.length > 0
        ? periods
            .slice(0, 3)
            .map((period, index) => {
              return (
                `${index + 1}. ${getPeriodFrom(period)} → ${getPeriodTo(
                  period
                )}\n` +
                `   Single: ${
                  period.single ||
                  period.singleRoom ||
                  period.single_room ||
                  "—"
                }\n` +
                `   Double: ${
                  period.double ||
                  period.doubleRoom ||
                  period.double_room ||
                  "—"
                }\n` +
                `   Triple: ${
                  period.triple ||
                  period.tripleRoom ||
                  period.triple_room ||
                  "—"
                }`
              );
            })
            .join("\n\n")
        : "No travel periods available right now.";

    return {
      text:
        `${getHotelName(hotel)}\n\n` +
        `City: ${getHotelCity(hotel)}\n` +
        `Meal Plan: ${getHotelMeal(hotel)}\n` +
        `${getHotelStars(hotel) ? `Category: ${getHotelStars(hotel)}\n` : ""}` +
        `Starting From: ${lowest.text}\n\n` +
        `Available periods:\n${periodText}\n\n` +
        "Tell me your budget and travel dates. I will check which room and period fit you best.",
      actions: [
        "Budget 300$",
        "Budget 500$",
        "Dates: 20/06/2026 to 25/06/2026",
        "Open Hotels",
      ],
      feedback: true,
    };
  };

  const accountAnswer = () => {
    if (isLoggedIn) {
      return {
        text:
          `Perfect ✅ ${userName}, you already have an account.\n\n` +
          "You can choose an offer, send a booking request, and follow everything from your profile.",
        actions: ["I want a package", "I want a hotel", "Budget 500$"],
        feedback: true,
      };
    }

    return {
      text:
        "You can create an account from the website navigation.\n\n" +
        "With an account, you can send booking requests, follow your reservations, and receive faster support from our team.",
      actions: ["I want a package", "I want a hotel", "Contact"],
      feedback: true,
    };
  };

  const bookingAnswer = () => ({
    text: isLoggedIn
      ? "To book: open Packages or Hotels, choose your offer, click Book Now, select your date, and send the request. You can follow it later from your profile."
      : "To book: open Packages or Hotels, choose your offer, then follow the booking steps. For faster confirmation, contact our agency team.",
    actions: ["Open Packages", "Open Hotels", "Contact"],
    feedback: true,
  });

  const contactAnswer = () => ({
    text:
      "Of course. Here are Egypt Holiday Travel contact details:\n\n" +
      `WhatsApp: ${AGENCY_CONTACT.whatsappDisplay}\n` +
      `Phone: ${AGENCY_CONTACT.phoneDisplay}\n` +
      `Email: ${AGENCY_CONTACT.email}\n\n` +
      "You can contact us to confirm prices, travel dates, hotel availability, packages, and booking details.",
    actions: ["WhatsApp", "Call Agency", "Email Agency"],
    feedback: true,
  });

  const isContactRequest = (q) => {
    if (q.includes("contact by")) return false;

    return (
      q === "contact" ||
      q.includes("phone") ||
      q.includes("number") ||
      q.includes("numero") ||
      q.includes("numro") ||
      q.includes("ra9em") ||
      q.includes("رقم") ||
      q.includes("whatsapp") ||
      q.includes("whatssap") ||
      q.includes("watsap") ||
      q.includes("email") ||
      q.includes("gmail") ||
      q.includes("call") ||
      q.includes("give me the number")
    );
  };

  const getAnswer = (question) => {
    const q = normalize(question);

    if (q.includes("start new search") || q.includes("new search")) {
      setLead(INITIAL_LEAD);
      setTripType("");
      setFeedbackDone(false);
      return INITIAL_MESSAGE;
    }

    if (isContactRequest(q)) return contactAnswer();

    if (
      q.includes("help me choose") ||
      q.includes("start") ||
      q.includes("guide me")
    ) {
      return askType();
    }

    if (
      q.includes("account") ||
      q.includes("compte") ||
      q.includes("signup") ||
      q.includes("login") ||
      q.includes("client")
    ) {
      return accountAnswer();
    }

    if (
      q.includes("book") ||
      q.includes("booking") ||
      q.includes("reservation") ||
      q.includes("reserve")
    ) {
      return bookingAnswer();
    }

    const selectedHotel = findHotel(question);
    if (selectedHotel && !q.includes("i want a hotel")) {
      setTripType("hotel");
      setLead((prev) => ({
        ...prev,
        type: "hotel",
        destination: getHotelCity(selectedHotel),
      }));
      return hotelDetails(selectedHotel);
    }

    const selectedPackage = findPackage(question);
    if (selectedPackage && !q.includes("i want a package")) {
      setTripType("package");
      setLead((prev) => ({
        ...prev,
        type: "package",
        destination: getPackagePlace(selectedPackage),
      }));
      return packageDetails(selectedPackage);
    }

    const updates = extractLeadUpdates(question);
    const currentLead = {
      ...lead,
      ...updates,
    };

    if (updates.type) {
      setTripType(updates.type);
    }

    setLead(currentLead);

    const nextQuestion = getNextQuestion(currentLead);

    if (nextQuestion) return nextQuestion;

    return finalRecommendation(currentLead);
  };

  const sendMessage = (customText = null) => {
    const question = (customText || input).trim();

    if (!question || isTyping) return;

    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const answer = getAnswer(question);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: answer.text,
          actions: answer.actions || [],
          cards: answer.cards || [],
          feedback: Boolean(answer.feedback),
        },
      ]);

      setIsTyping(false);
    }, 650);
  };

  const handleFeedback = (type) => {
    if (feedbackDone) return;

    setFeedbackDone(true);

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text:
          type === "good"
            ? "Thank you for your feedback ✅ I am happy I helped you."
            : "Thank you for your feedback. I will try to guide you better. You can also contact our agency team for direct support.",
        actions:
          type === "bad"
            ? ["Contact", "WhatsApp"]
            : ["I want a package", "I want a hotel"],
      },
    ]);
  };

  const handleAction = (action) => {
    if (action === "Open Packages") {
      navigate("/packages");
      return;
    }

    if (action === "Open Hotels") {
      navigate("/hotels");
      return;
    }

    if (action === "Contact") {
      sendMessage("Contact");
      return;
    }

    if (action === "WhatsApp") {
      openLink(AGENCY_CONTACT.whatsappUrl, "_blank");
      return;
    }

    if (action === "Call Agency") {
      openLink(`tel:${AGENCY_CONTACT.phoneCall}`);
      return;
    }

    if (action === "Email Agency") {
      openLink(`mailto:${AGENCY_CONTACT.email}`);
      return;
    }

    if (action === "Start New Search") {
      resetChat();
      return;
    }

    sendMessage(action);
  };

  const getActionIcon = (action) => {
    const lower = normalize(action);

    if (lower.includes("package")) return <FaSuitcaseRolling />;
    if (lower.includes("hotel")) return <FaHotel />;

    if (lower.includes("budget") || lower.includes("$")) {
      return <FaMoneyBillWave />;
    }

    if (
      lower.includes("date") ||
      lower.includes("flexible") ||
      lower.includes("fixed")
    ) {
      return <FaCheckCircle />;
    }

    if (
      lower.includes("adult") ||
      lower.includes("child") ||
      lower.includes("family") ||
      lower.includes("traveler")
    ) {
      return <FaCheckCircle />;
    }

    if (
      lower.includes("single") ||
      lower.includes("double") ||
      lower.includes("triple") ||
      lower.includes("suite") ||
      lower.includes("room")
    ) {
      return <FaHotel />;
    }

    if (
      lower.includes("breakfast") ||
      lower.includes("board") ||
      lower.includes("inclusive")
    ) {
      return <FaCheckCircle />;
    }

    if (
      lower.includes("transfer") ||
      lower.includes("car") ||
      lower.includes("bus") ||
      lower.includes("transport")
    ) {
      return <FaCheckCircle />;
    }

    if (lower.includes("flight")) return <FaCheckCircle />;
    if (lower.includes("contact")) return <FaPhoneAlt />;
    if (lower.includes("whatsapp")) return <FaWhatsapp />;
    if (lower.includes("call")) return <FaPhoneAlt />;
    if (lower.includes("email")) return <FaEnvelope />;
    if (lower.includes("help")) return <FaCheckCircle />;

    if (DESTINATIONS.includes(action) || action === "Any destination") {
      return <FaMapMarkerAlt />;
    }

    return <FaGlobeAfrica />;
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          className="eht-chatbot-fab"
          onClick={() => setOpen(true)}
          aria-label="Open Egypt Holiday assistant"
        >
          <FaRobot />
        </button>
      )}

      {open && (
        <div className="eht-chatbot-window">
          <div className="eht-chatbot-header">
            <div className="eht-chatbot-avatar">
              <FaRobot />
            </div>

            <div>
              <h3>Egypt Holiday Assistant</h3>
              <p>
                <span className="eht-status-dot"></span>
                Smart travel advisor
              </p>
            </div>

            <button type="button" onClick={() => setOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="eht-chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`eht-message ${msg.sender}`}>
                <p>{msg.text}</p>

                {msg.cards?.length > 0 && (
                  <div className="eht-recommendations">
                    {msg.cards.map((card, cardIndex) => (
                      <div
                        className="eht-reco-card"
                        key={`${card.title}-${cardIndex}`}
                      >
                        <div className="eht-reco-top">
                          <div className="eht-reco-icon">
                            {card.type === "hotel" ? (
                              <FaHotel />
                            ) : (
                              <FaSuitcaseRolling />
                            )}
                          </div>

                          <div>
                            <h4>{card.title}</h4>
                            <span>
                              <FaMapMarkerAlt /> {card.subtitle}
                            </span>
                          </div>
                        </div>

                        <div className="eht-reco-price">
                          <FaMoneyBillWave />
                          <strong>{card.price}</strong>
                        </div>

                        <div className="eht-reco-meta">
                          {card.meta.map((item) => (
                            <small key={item}>{item}</small>
                          ))}
                        </div>

                        <div className="eht-reco-reason">
                          <FaStar />
                          <span>{card.reason}</span>
                        </div>

                        <button
                          type="button"
                          className="eht-reco-action"
                          onClick={() => handleAction(card.action)}
                        >
                          View details
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {msg.actions &&
                  msg.sender === "bot" &&
                  msg.actions.length > 0 && (
                    <div className="eht-actions">
                      {msg.actions.map((action) => (
                        <button
                          type="button"
                          key={action}
                          onClick={() => handleAction(action)}
                          title={action}
                        >
                          {getActionIcon(action)}
                          <span>{action}</span>
                        </button>
                      ))}
                    </div>
                  )}

                {msg.feedback && msg.sender === "bot" && !feedbackDone && (
                  <div className="eht-feedback">
                    <span>Was this helpful?</span>

                    <button type="button" onClick={() => handleFeedback("good")}>
                      <FaThumbsUp /> Yes
                    </button>

                    <button type="button" onClick={() => handleFeedback("bad")}>
                      <FaThumbsDown /> No
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="eht-message bot eht-typing">
                <div className="eht-typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <small>Assistant is typing...</small>
              </div>
            )}

            <div ref={endRef} />
          </div>

          <div className="eht-chatbot-input">
            <input
              type="text"
              placeholder="Ask about packages, hotels, budget, destination, dates..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />

            <button type="button" onClick={() => sendMessage()}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
}