import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaRobot,
  FaPaperPlane,
  FaUserPlus,
  FaSuitcaseRolling,
  FaHotel,
  FaSignInAlt,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
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

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [packagesData, setPackagesData] = useState([]);
  const [hotelsData, setHotelsData] = useState([]);
  const [user, setUser] = useState(null);
  const [tripType, setTripType] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "Welcome to Egypt Holiday Travel 👋\n\nI am your smart travel advisor. I can help you choose the best package or hotel according to your budget, travel dates, and destination.\n\nWhat are you looking for?",
      actions: ["I want a package", "I want a hotel", "Create Account", "Log In"],
    },
  ]);

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
      console.log("Chatbot packages error:", err.response?.data || err.message);
    }

    try {
      const res = await API.get("/hotels");
      setHotelsData(makeArray(res.data));
    } catch (err) {
      console.log("Chatbot hotels error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    loadUser();
    loadBotData();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const isLoggedIn = Boolean(user);

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

    return tripType || "package";
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

  const askBudget = (type) => {
    const label = type === "hotel" ? "hotel" : "package";

    return {
      text:
        `Excellent. I can help you choose the right ${label}.\n\n` +
        "Before I recommend anything, please tell me your budget. I will only suggest options that fit your budget.\n\n" +
        "Example:\n" +
        "• 300 dollars\n" +
        "• 500 dollars\n" +
        "• 900 dollars",
      actions: ["Budget 300$", "Budget 500$", "Budget 900$", "Create Account"],
    };
  };

  const recommendPackagesByBudget = (budget) => {
    const allPackages = preparePackageOptions();

    const options = allPackages
      .filter((option) => option.priceNumber <= budget)
      .sort((a, b) => b.priceNumber - a.priceNumber)
      .slice(0, 3);

    if (options.length === 0) {
      const closest = allPackages
        .filter((option) => option.priceNumber > budget)
        .sort((a, b) => a.priceNumber - b.priceNumber)[0];

      return {
        text:
          `I checked the packages available on the site with your budget of ${budget}$.\n\n` +
          "Right now, I did not find a package clearly inside this budget.\n\n" +
          (closest
            ? `The closest package I found is:\n${closest.name} — ${closest.priceText}\n\n`
            : "") +
          "Professional advice: create an account and send a request. Our team can check updated prices, travel dates, and availability to find the closest offer for you.",
        actions: isLoggedIn
          ? ["Open Packages", "Contact"]
          : ["Create Account", "Open Packages", "Contact"],
      };
    }

    const list = options
      .map((option, index) => {
        return (
          `${index + 1}. ${option.name}\n` +
          `${option.place ? `   Destination: ${option.place}\n` : ""}` +
          `${option.duration ? `   Duration: ${option.duration}\n` : ""}` +
          `   Price: ${option.priceText}`
        );
      })
      .join("\n\n");

    const best = options[0];

    return {
      text:
        `Based on your budget of ${budget}$, these are the best packages I found from the site:\n\n` +
        `${list}\n\n` +
        `Best recommendation: ${best.name}.\n\n` +
        "Why? It gives you the strongest value while staying inside your budget.\n\n" +
        (isLoggedIn
          ? "You can now open Packages and send your booking request."
          : "To book faster and follow your request, create an account first."),
      actions: isLoggedIn
        ? ["Open Packages", "Contact"]
        : ["Create Account", "Open Packages", "Contact"],
    };
  };

  const recommendHotelsByBudget = (budget) => {
    const allHotelOptions = hotelsData.flatMap((hotel) =>
      getHotelRoomOptions(hotel)
    );

    const hotelOptions = allHotelOptions
      .filter((option) => option.priceNumber <= budget)
      .sort((a, b) => b.priceNumber - a.priceNumber)
      .slice(0, 3);

    if (hotelOptions.length === 0) {
      const closest = allHotelOptions
        .filter((option) => option.priceNumber > budget)
        .sort((a, b) => a.priceNumber - b.priceNumber)[0];

      return {
        text:
          `I checked the real hotel prices available on the site with your budget of ${budget}$.\n\n` +
          "Right now, I did not find a hotel room clearly inside this budget.\n\n" +
          (closest
            ? `The closest hotel option I found is:\n${getHotelName(
                closest.hotel
              )} — ${closest.room} — ${closest.priceText}\n\n`
            : "") +
          "Professional advice: create an account and send a request. Our team can check updated hotel prices, dates, and availability for you.",
        actions: isLoggedIn
          ? ["Open Hotels", "Contact"]
          : ["Create Account", "Open Hotels", "Contact"],
      };
    }

    const list = hotelOptions
      .map((option, index) => {
        return (
          `${index + 1}. ${getHotelName(option.hotel)}\n` +
          `   City: ${getHotelCity(option.hotel)}\n` +
          `   Meal Plan: ${getHotelMeal(option.hotel)}\n` +
          `${getHotelStars(option.hotel) ? `   Category: ${getHotelStars(option.hotel)}\n` : ""}` +
          `   Period: ${getPeriodFrom(option.period)} → ${getPeriodTo(option.period)}\n` +
          `   Room: ${option.room}\n` +
          `   Price: ${option.priceText}`
        );
      })
      .join("\n\n");

    const best = hotelOptions[0];

    return {
      text:
        `Based on your budget of ${budget}$, I found these hotel options from the real hotel data on the site:\n\n` +
        `${list}\n\n` +
        `Best recommendation: ${getHotelName(best.hotel)}.\n\n` +
        "Why? It fits your budget, has a clear travel period, and gives you a suitable room price without going above your limit.\n\n" +
        (isLoggedIn
          ? "You can now open Hotels and send your booking request."
          : "To book faster and follow your request, create an account first."),
      actions: isLoggedIn
        ? ["Open Hotels", "Contact"]
        : ["Create Account", "Open Hotels", "Contact"],
    };
  };

  const recommendByBudget = (question) => {
    const budget = extractBudget(question);
    const type = detectType(question);

    if (!budget) return askBudget(type);

    if (type === "hotel") return recommendHotelsByBudget(budget);

    return recommendPackagesByBudget(budget);
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
                `${index + 1}. ${getPeriodFrom(period)} → ${getPeriodTo(period)}\n` +
                `   Single: ${
                  period.single || period.singleRoom || period.single_room || "—"
                }\n` +
                `   Double: ${
                  period.double || period.doubleRoom || period.double_room || "—"
                }\n` +
                `   Triple: ${
                  period.triple || period.tripleRoom || period.triple_room || "—"
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
    };
  };

  const accountAnswer = () => {
    if (isLoggedIn) {
      return {
        text:
          "Perfect ✅ You already have an account. You can choose your offer, send a booking request, and follow everything from your profile.",
        actions: ["I want a package", "I want a hotel", "Budget 500$"],
      };
    }

    return {
      text:
        "Creating an account is the best first step.\n\nWith an account you become an official client, you can send booking requests, follow your reservations, and our team can contact you faster with the best available offer.",
      actions: ["Create Account", "Log In", "I want a package", "I want a hotel"],
    };
  };

  const bookingAnswer = () => {
    return {
      text: isLoggedIn
        ? "To book: open Packages or Hotels, choose your offer, click Book Now, select your date, and send the request. You can follow it later from your profile."
        : "To book: create an account first, then choose a package or hotel, select your date, and send your request. This helps our team confirm your booking faster.",
      actions: isLoggedIn
        ? ["Open Packages", "Open Hotels"]
        : ["Create Account", "Open Packages", "Open Hotels"],
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
      actions: ["WhatsApp", "Call Agency", "Email Agency", "Create Account"],
    };
  };

  const getAnswer = (question) => {
    const q = normalize(question);
    const budget = extractBudget(question);

    if (budget) return recommendByBudget(question);

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

    if (
      q.includes("package") ||
      q.includes("packages") ||
      q.includes("pack") ||
      q.includes("pac") ||
      q.includes("paka") ||
      q.includes("trip")
    ) {
      setTripType("package");
      return askBudget("package");
    }

    if (
      q.includes("hotel") ||
      q.includes("hotels") ||
      q.includes("room") ||
      q.includes("rooms")
    ) {
      setTripType("hotel");
      return askBudget("hotel");
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
      return askBudget(detectType(question));
    }

    const selectedHotel = findHotel(question);
    if (selectedHotel) {
      setTripType("hotel");
      return hotelDetails(selectedHotel);
    }

    const selectedPackage = findPackage(question);
    if (selectedPackage) {
      setTripType("package");
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
        "I can guide you professionally.\n\nPlease tell me what you want first: a package or a hotel. After that, give me your budget and I will recommend the best suitable option from the site.\n\nIf you need our agency contact, write: WhatsApp, phone number, or email.",
      actions: ["I want a package", "I want a hotel", "Contact", "Create Account"],
    };
  };

  const sendMessage = (customText = null) => {
    const question = (customText || input).trim();
    if (!question) return;

    const answer = getAnswer(question);

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: question },
      { sender: "bot", text: answer.text, actions: answer.actions },
    ]);

    setInput("");
  };

  const handleAction = (action) => {
    if (action === "Create Account") {
      navigate("/signup");
      return;
    }

    if (action === "Log In") {
      navigate("/login");
      return;
    }

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
      window.open(AGENCY_CONTACT.whatsappUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (action === "Call Agency") {
      window.location.href = `tel:${AGENCY_CONTACT.phoneCall}`;
      return;
    }

    if (action === "Email Agency") {
      window.location.href = `mailto:${AGENCY_CONTACT.email}`;
      return;
    }

    if (action === "I want a package") {
      setTripType("package");
      sendMessage("I want a package");
      return;
    }

    if (action === "I want a hotel") {
      setTripType("hotel");
      sendMessage("I want a hotel");
      return;
    }

    if (action === "Budget 300$") {
      sendMessage(`My budget is 300 dollars for ${tripType || "package"}`);
      return;
    }

    if (action === "Budget 500$") {
      sendMessage(`My budget is 500 dollars for ${tripType || "package"}`);
      return;
    }

    if (action === "Budget 900$") {
      sendMessage(`My budget is 900 dollars for ${tripType || "package"}`);
    }
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
              <p>Smart travel advisor</p>
            </div>

            <button type="button" onClick={() => setOpen(false)}>
              <FaTimes />
            </button>
          </div>

          {!isLoggedIn && (
            <div className="eht-client-card">
              <div className="eht-client-icon">
                <FaUserPlus />
              </div>

              <div>
                <strong>Become our client</strong>
                <span>Create an account to book and follow your request.</span>
              </div>

              <button type="button" onClick={() => navigate("/signup")}>
                Sign Up
              </button>
            </div>
          )}

          <div className="eht-chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`eht-message ${msg.sender}`}>
                <p>{msg.text}</p>

                {msg.actions && msg.sender === "bot" && (
                  <div className="eht-actions">
                    {msg.actions.map((action) => (
                      <button
                        type="button"
                        key={action}
                        onClick={() => handleAction(action)}
                        title={action}
                      >
                        {action.includes("Account") && <FaUserPlus />}
                        {action.includes("Log") && <FaSignInAlt />}
                        {action.toLowerCase().includes("package") && (
                          <FaSuitcaseRolling />
                        )}
                        {action.toLowerCase().includes("hotel") && <FaHotel />}
                        {action.includes("Budget") && <FaMoneyBillWave />}
                        {action.includes("Contact") && <FaPhoneAlt />}
                        {action.includes("WhatsApp") && <FaWhatsapp />}
                        {action.includes("Call") && <FaPhoneAlt />}
                        {action.includes("Email") && <FaEnvelope />}
                        <span>{action}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div ref={endRef} />
          </div>

          <div className="eht-chatbot-input">
            <input
              type="text"
              placeholder="Ask about packages, hotels, budget, contact..."
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