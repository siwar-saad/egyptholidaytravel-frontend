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

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [packagesData, setPackagesData] = useState([]);
  const [hotelsData, setHotelsData] = useState([]);
  const [user, setUser] = useState(null);
  const [tripType, setTripType] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);

  const [lead, setLead] = useState({
    type: "",
    destination: "",
    budget: null,
  });

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "Welcome to Egypt Holiday Travel 👋\n\nI am your smart travel advisor. I can help you choose the best package or hotel according to your budget, destination, and travel needs.\n\nWhat are you looking for?",
      actions: ["I want a package", "I want a hotel", "Contact", "Help me choose"],
    },
  ]);

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

        if (res.data?.user) {
          setUser(res.data.user);
        }
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
    period?.from || period?.fromDate || period?.startDate || "-";

  const getPeriodTo = (period) =>
    period?.to || period?.toDate || period?.endDate || "-";

  const getHotelPeriods = (hotel) => {
    if (Array.isArray(hotel?.periods)) return hotel.periods;

    if (hotel?.fromDate || hotel?.toDate || hotel?.from || hotel?.to) {
      return [
        {
          from: hotel.from || hotel.fromDate,
          to: hotel.to || hotel.toDate,
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
    const match = clean.match(/\d+(\.\d+)?/);

    return match ? Number(match[0]) : null;
  };

  const extractBudget = (text) => {
    const clean = normalize(text).replace(/,/g, "");
    const match = clean.match(/\d+(\.\d+)?/);

    if (!match) return null;

    const number = Number(match[0]);

    const hasBudgetWord =
      clean.includes("budget") ||
      clean.includes("pudget") ||
      clean.includes("price") ||
      clean.includes("cost") ||
      clean.includes("dollar") ||
      clean.includes("usd") ||
      clean.includes("$") ||
      clean.includes("under") ||
      clean.includes("less") ||
      clean.includes("flous") ||
      clean.includes("prix");

    if (hasBudgetWord || number >= 100) return number;

    return null;
  };

  const extractDestination = (text) => {
    const q = normalize(text);

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

    return lead.type || tripType || "package";
  };

  const destinationMatches = (text, destination) => {
    if (!destination || destination === "Any destination") return true;
    return normalize(text).includes(normalize(destination));
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

  const getHotelRoomOptions = (hotel) => {
    const periods = getHotelPeriods(hotel);

    return periods.flatMap((period) => {
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

  const askType = () => {
    return {
      text:
        `Hello ${userName} 👋\n\nI can guide you step by step like a travel advisor.\n\nFirst, tell me what you want to search for.`,
      actions: ["I want a package", "I want a hotel", "Contact"],
    };
  };

  const askDestination = (type) => {
    const label = type === "hotel" ? "hotel" : "package";

    return {
      text:
        `Perfect. You are looking for a ${label}.\n\nWhich destination do you prefer?\n\nYou can choose a destination, or you can skip this step and give me your budget directly.`,
      actions: [
        "Cairo",
        "Sharm El Sheikh",
        "Hurghada",
        "Luxor",
        "Any destination",
        "Budget 500$",
      ],
    };
  };

  const askBudget = (type, destination = "") => {
    const label = type === "hotel" ? "hotel" : "package";

    return {
      text:
        `Great choice${destination ? `: ${destination}` : ""}.\n\n` +
        `Now tell me your budget for this ${label}. I will only suggest options that fit your budget.\n\n` +
        "Example:\n" +
        "• 300 dollars\n" +
        "• 500 dollars\n" +
        "• 900 dollars",
      actions: ["Budget 300$", "Budget 500$", "Budget 900$", "Contact"],
    };
  };

  const noDataAnswer = (type) => {
    return {
      text:
        `I could not access enough live ${type} data right now.\n\n` +
        "Professional advice: contact our agency team. They can confirm updated prices, availability, dates, and the best offer for you.",
      actions: ["Contact", "WhatsApp", "Call Agency", "Email Agency"],
      feedback: true,
    };
  };

  const recommendPackagesByBudget = (budget, destination = "") => {
    const allPackages = preparePackageOptions();

    if (allPackages.length === 0) {
      return noDataAnswer("package");
    }

    const filteredPackages = allPackages.filter((option) =>
      destinationMatches(`${option.name} ${option.place}`, destination)
    );

    const source = filteredPackages.length > 0 ? filteredPackages : allPackages;

    const options = source
      .filter((option) => option.priceNumber <= budget)
      .sort((a, b) => b.priceNumber - a.priceNumber)
      .slice(0, 3);

    if (options.length === 0) {
      const closest = source
        .filter((option) => option.priceNumber > budget)
        .sort((a, b) => a.priceNumber - b.priceNumber)[0];

      return {
        text:
          `I checked the available packages with your budget of ${budget}$` +
          `${destination ? ` for ${destination}` : ""}.\n\n` +
          "Right now, I did not find a package clearly inside this budget.\n\n" +
          (closest
            ? `The closest package I found is:\n${closest.name} — ${closest.priceText}\n\n`
            : "") +
          "Professional advice: contact our team to check updated prices, discounts, dates, and availability.",
        actions: ["Open Packages", "Contact", "WhatsApp"],
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
      ].filter(Boolean),
      reason:
        index === 0
          ? "Best value inside your budget"
          : "Good alternative inside your budget",
      action: "Open Packages",
    }));

    const best = options[0];

    return {
      text:
        `Based on your budget of ${budget}$` +
        `${destination ? ` and destination ${destination}` : ""}` +
        `, I found the best matching packages for you.\n\n` +
        `Best recommendation: ${best.name}.\n\n` +
        "Why? It gives you strong value while staying inside your budget.",
      actions: ["Open Packages", "Contact", "WhatsApp"],
      cards,
      feedback: true,
    };
  };

  const recommendHotelsByBudget = (budget, destination = "") => {
    const allHotelOptions = hotelsData.flatMap((hotel) =>
      getHotelRoomOptions(hotel)
    );

    if (allHotelOptions.length === 0) {
      return noDataAnswer("hotel");
    }

    const filteredHotels = allHotelOptions.filter((option) =>
      destinationMatches(
        `${getHotelName(option.hotel)} ${getHotelCity(option.hotel)}`,
        destination
      )
    );

    const source = filteredHotels.length > 0 ? filteredHotels : allHotelOptions;

    const hotelOptions = source
      .filter((option) => option.priceNumber <= budget)
      .sort((a, b) => b.priceNumber - a.priceNumber)
      .slice(0, 3);

    if (hotelOptions.length === 0) {
      const closest = source
        .filter((option) => option.priceNumber > budget)
        .sort((a, b) => a.priceNumber - b.priceNumber)[0];

      return {
        text:
          `I checked the hotel prices with your budget of ${budget}$` +
          `${destination ? ` for ${destination}` : ""}.\n\n` +
          "Right now, I did not find a hotel room clearly inside this budget.\n\n" +
          (closest
            ? `The closest hotel option I found is:\n${getHotelName(
                closest.hotel
              )} — ${closest.room} — ${closest.priceText}\n\n`
            : "") +
          "Professional advice: contact our team to confirm updated hotel prices, travel periods, and availability.",
        actions: ["Open Hotels", "Contact", "WhatsApp"],
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
        `Meal: ${getHotelMeal(option.hotel)}`,
        getHotelStars(option.hotel) ? `Category: ${getHotelStars(option.hotel)}` : "",
        `Period: ${getPeriodFrom(option.period)} → ${getPeriodTo(option.period)}`,
      ].filter(Boolean),
      reason:
        index === 0
          ? "Best hotel option inside your budget"
          : "Suitable alternative inside your budget",
      action: "Open Hotels",
    }));

    const best = hotelOptions[0];

    return {
      text:
        `Based on your budget of ${budget}$` +
        `${destination ? ` and destination ${destination}` : ""}` +
        `, I found suitable hotel options for you.\n\n` +
        `Best recommendation: ${getHotelName(best.hotel)}.\n\n` +
        "Why? It fits your budget and gives you a clear room price and travel period.",
      actions: ["Open Hotels", "Contact", "WhatsApp"],
      cards,
      feedback: true,
    };
  };

  const recommendByBudget = (question) => {
    const budget = extractBudget(question);
    const type = detectType(question);
    const destination = extractDestination(question) || lead.destination || "";

    if (!budget) return askBudget(type, destination);

    setLead((prev) => ({
      ...prev,
      type,
      destination,
      budget,
    }));

    if (type === "hotel") return recommendHotelsByBudget(budget, destination);

    return recommendPackagesByBudget(budget, destination);
  };

  const packageDetails = (item) => {
    return {
      text:
        `${getPackageName(item)}\n\n` +
        `${getPackagePlace(item) ? `Destination: ${getPackagePlace(item)}\n` : ""}` +
        `${getPackageDuration(item) ? `Duration: ${getPackageDuration(item)}\n` : ""}` +
        `Price: ${getPackagePriceText(item) || "Contact us"}\n\n` +
        "Tell me your budget and I will check if this package fits you.",
      actions: ["Budget 300$", "Budget 500$", "Budget 900$", "Open Packages"],
      feedback: true,
    };
  };

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
        "Tell me your budget and I will check which room and period fit you best.",
      actions: ["Budget 300$", "Budget 500$", "Budget 900$", "Open Hotels"],
      feedback: true,
    };
  };

  const accountAnswer = () => {
    if (isLoggedIn) {
      return {
        text:
          `Perfect ✅ ${userName}, you already have an account.\n\nYou can choose an offer, send a booking request, and follow everything from your profile.`,
        actions: ["I want a package", "I want a hotel", "Budget 500$"],
        feedback: true,
      };
    }

    return {
      text:
        "You can create an account from the website navigation.\n\nWith an account, you can send booking requests, follow your reservations, and receive faster support from our team.",
      actions: ["I want a package", "I want a hotel", "Contact"],
      feedback: true,
    };
  };

  const bookingAnswer = () => {
    return {
      text: isLoggedIn
        ? "To book: open Packages or Hotels, choose your offer, click Book Now, select your date, and send the request. You can follow it later from your profile."
        : "To book: open Packages or Hotels, choose your offer, then follow the booking steps. For faster confirmation, contact our agency team.",
      actions: ["Open Packages", "Open Hotels", "Contact"],
      feedback: true,
    };
  };

  const contactAnswer = () => {
    return {
      text:
        "Of course. Here are Egypt Holiday Travel contact details:\n\n" +
        `WhatsApp: ${AGENCY_CONTACT.whatsappDisplay}\n` +
        `Phone: ${AGENCY_CONTACT.phoneDisplay}\n` +
        `Email: ${AGENCY_CONTACT.email}\n\n` +
        "You can contact us to confirm prices, travel dates, hotel availability, packages, and booking details.",
      actions: ["WhatsApp", "Call Agency", "Email Agency"],
      feedback: true,
    };
  };

  const getAnswer = (question) => {
    const q = normalize(question);
    const budget = extractBudget(question);
    const destination = extractDestination(question);

    if (
      q.includes("help me choose") ||
      q.includes("start") ||
      q.includes("guide me")
    ) {
      return askType();
    }

    if (
      q.includes("contact") ||
      q.includes("phone") ||
      q.includes("number") ||
      q.includes("numero") ||
      q.includes("numro") ||
      q.includes("ra9em") ||
      q.includes("رقم") ||
      q.includes("whatsapp") ||
      q.includes("whatssap") ||
      q.includes("watsap") ||
      q.includes("whats") ||
      q.includes("email") ||
      q.includes("gmail") ||
      q.includes("call") ||
      q.includes("give me the number")
    ) {
      return contactAnswer();
    }

    if (budget) return recommendByBudget(question);

    if (destination || q.includes("any destination")) {
      const selectedDestination = q.includes("any destination")
        ? "Any destination"
        : destination;

      setLead((prev) => ({
        ...prev,
        destination: selectedDestination,
      }));

      return askBudget(detectType(question), selectedDestination);
    }

    if (
      q.includes("package") ||
      q.includes("packages") ||
      q.includes("pack") ||
      q.includes("pac") ||
      q.includes("paka") ||
      q.includes("trip")
    ) {
      setTripType("package");

      setLead((prev) => ({
        ...prev,
        type: "package",
      }));

      return askDestination("package");
    }

    if (
      q.includes("hotel") ||
      q.includes("hotels") ||
      q.includes("room") ||
      q.includes("rooms")
    ) {
      setTripType("hotel");

      setLead((prev) => ({
        ...prev,
        type: "hotel",
      }));

      return askDestination("hotel");
    }

    if (
      q.includes("budget") ||
      q.includes("pudget") ||
      q.includes("price") ||
      q.includes("cost") ||
      q.includes("dollar") ||
      q.includes("usd") ||
      q.includes("$") ||
      q.includes("flous") ||
      q.includes("prix")
    ) {
      return askBudget(detectType(question), lead.destination);
    }

    const selectedHotel = findHotel(question);

    if (selectedHotel) {
      setTripType("hotel");

      setLead((prev) => ({
        ...prev,
        type: "hotel",
        destination: getHotelCity(selectedHotel),
      }));

      return hotelDetails(selectedHotel);
    }

    const selectedPackage = findPackage(question);

    if (selectedPackage) {
      setTripType("package");

      setLead((prev) => ({
        ...prev,
        type: "package",
        destination: getPackagePlace(selectedPackage),
      }));

      return packageDetails(selectedPackage);
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

    return {
      text:
        "I can guide you professionally.\n\nTell me first what you want: a package or a hotel. Then choose a destination and give me your budget. I will recommend the best suitable options from the site.\n\nIf you need our agency contact, write: WhatsApp, phone number, or email.",
      actions: ["I want a package", "I want a hotel", "Contact", "Help me choose"],
    };
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
        actions: type === "bad" ? ["Contact", "WhatsApp"] : ["I want a package", "I want a hotel"],
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
      sendMessage("Give me the agency contact details");
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

    if (action === "I want a package") {
      setTripType("package");
      setLead((prev) => ({ ...prev, type: "package" }));
      sendMessage("I want a package");
      return;
    }

    if (action === "I want a hotel") {
      setTripType("hotel");
      setLead((prev) => ({ ...prev, type: "hotel" }));
      sendMessage("I want a hotel");
      return;
    }

    if (action === "Help me choose") {
      sendMessage("Help me choose");
      return;
    }

    if (DESTINATIONS.includes(action) || action === "Any destination") {
      setLead((prev) => ({
        ...prev,
        destination: action,
      }));

      sendMessage(`My destination is ${action}`);
      return;
    }

    if (action === "Budget 300$") {
      sendMessage(
        `My budget is 300 dollars for ${lead.type || tripType || "package"} ${
          lead.destination ? `in ${lead.destination}` : ""
        }`
      );
      return;
    }

    if (action === "Budget 500$") {
      sendMessage(
        `My budget is 500 dollars for ${lead.type || tripType || "package"} ${
          lead.destination ? `in ${lead.destination}` : ""
        }`
      );
      return;
    }

    if (action === "Budget 900$") {
      sendMessage(
        `My budget is 900 dollars for ${lead.type || tripType || "package"} ${
          lead.destination ? `in ${lead.destination}` : ""
        }`
      );
    }
  };

  const getActionIcon = (action) => {
    const lower = normalize(action);

    if (lower.includes("package")) return <FaSuitcaseRolling />;
    if (lower.includes("hotel")) return <FaHotel />;
    if (lower.includes("budget")) return <FaMoneyBillWave />;
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
                      <div className="eht-reco-card" key={`${card.title}-${cardIndex}`}>
                        <div className="eht-reco-top">
                          <div className="eht-reco-icon">
                            {card.type === "hotel" ? <FaHotel /> : <FaSuitcaseRolling />}
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

                {msg.actions && msg.sender === "bot" && msg.actions.length > 0 && (
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
              placeholder="Ask about packages, hotels, budget, destination..."
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