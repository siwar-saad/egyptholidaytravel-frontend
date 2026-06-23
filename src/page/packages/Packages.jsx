import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import API from "../../api";
import "./Packages.css";

import turkeyPackage1 from "../../assets/image/turkey-package-1.webp";

import {
  FaArrowLeft,
  FaCheckCircle,
  FaEnvelope,
  FaFilter,
  FaPhoneAlt,
} from "react-icons/fa";

import PackageCategoryChooser from "./PackageCategoryChooser";
import OtherRoutesChooser from "./OtherRoutesChooser";
import TurkeyHotelPackageCard from "./TurkeyHotelPackageCard";
import PackageCard from "./PackageCard";
import PackageModal from "./PackageModal";
import PackageBookingForm from "./PackageBookingForm";
import PackageProAlert from "./PackageProAlert";
import Pagination from "./Pagination";

import {
  EMPTY_LOCKED_FIELDS,
  EMPTY_PACKAGE_BOOKING,
  ITEMS_PER_PAGE,
  PACKAGE_COUNTRIES,
} from "./packageConstants";
import {
  cleanPackageTitle,
  getPackageCategoryTitle,
  getPackagePriceValue,
  isEgyptPackage,
  isPastDate,
  isTurkeyToEgyptPackage,
  matchPriceFilter,
  splitStoredPhone,
} from "./packageUtils";

const handlePackageImageError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = turkeyPackage1;
};

export default function Packages() {
  const navigate = useNavigate();
  const location = useLocation();

  const [packagesData, setPackagesData] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [currentPackagePage, setCurrentPackagePage] = useState(1);

  const [selectedPackageCategory, setSelectedPackageCategory] = useState(null);
  const [selectedOtherRoute, setSelectedOtherRoute] = useState(null);
  const [selectedPackageNameFilter, setSelectedPackageNameFilter] = useState("all");
  const [selectedDurationFilter, setSelectedDurationFilter] = useState("all");
  const [selectedPriceFilter, setSelectedPriceFilter] = useState("all");

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
    id: item.id || item._id,
    name: cleanPackageTitle(item.name || item.title || "Package"),
    backendName:
      item.backendName || item.backend_name || item.title || item.name || "",
    route: item.route || "",
    duration: item.duration || "",
    travelDateText: item.travelDateText || item.travel_date_text || "",
    transfer: item.transfer || "",
    transferReduction: item.transferReduction || item.transfer_reduction || "",
    startPrice: item.startPrice || item.start_price || item.price || "Contact us",
    hidePrice: Boolean(item.hidePrice || item.hide_price),
    image: getImageUrl(item.image),
    country: item.country || item.destinationCountry || item.destination_country || "",
    destination: item.destination || item.destinationName || item.destination_name || "",
    city: item.city || "",
    location: item.location || "",
    region:
      item.region ||
      item.category ||
      item.packageCategory ||
      item.package_category ||
      "",
    forceCategory:
      item.forceCategory ||
      item.force_category ||
      item.categoryType ||
      item.category_type ||
      "",
    cardTitle: item.cardTitle || item.card_title || "",
    cardSubtitle: item.cardSubtitle || item.card_subtitle || "",
    badgeText: item.badgeText || item.badge_text || "",
    hotelName: item.hotelName || item.hotel_name || "",
    hotelMeal: item.hotelMeal || item.hotel_meal || "",
    hotelNights: item.hotelNights || item.hotel_nights || "",
    sglPrice: item.sglPrice || item.sgl_price || "",
    dblPrice: item.dblPrice || item.dbl_price || "",
    tplPrice: item.tplPrice || item.tpl_price || "",
    packageGroupId: item.packageGroupId || item.package_group_id || "",
    packageGroupTitle: item.packageGroupTitle || item.package_group_title || "",
    packageGroupSubtitle: item.packageGroupSubtitle || item.package_group_subtitle || "",
    packageGroupShortTitle:
      item.packageGroupShortTitle || item.package_group_short_title || "",
    options: Array.isArray(item.options) ? item.options : [],
    itinerary: Array.isArray(item.itinerary) ? item.itinerary : [],
    programme: item.programme || "",
    included: Array.isArray(item.included) ? item.included : [],
    excluded: Array.isArray(item.excluded) ? item.excluded : [],
    flightDetails: Array.isArray(item.flightDetails) ? item.flightDetails : [],
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setPackagesLoading(true);

        const res = await API.get("/packages");
        const loadedPackages = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.value)
          ? res.data.value
          : [];

        setPackagesData(loadedPackages.map(normalizePackage));
      } catch (err) {
        console.log("Public packages error:", err.response?.data || err.message);
        setPackagesData([]);
      } finally {
        setPackagesLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const egyptPackages = useMemo(
    () => packagesData.filter((item) => isEgyptPackage(item)),
    [packagesData]
  );

  const getRouteText = (item = {}) =>
    [
      item.name,
      item.backendName,
      item.route,
      item.country,
      item.destination,
      item.region,
      item.packageGroupId,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

  const routePackages = (matcher) =>
    packagesData.filter((item) => {
      if (isEgyptPackage(item)) return false;
      return matcher(getRouteText(item), item);
    });

  const turkeyIstanbulSummerPackages = useMemo(
    () =>
      routePackages((text) =>
        text.includes("istanbul summer") ||
        text.includes("turkey istanbul") ||
        text.includes("istanbul 8")
      ),
    [packagesData]
  );

  const turkeyToEgyptPackages = useMemo(
    () =>
      routePackages((text, item) =>
        Boolean(item.packageGroupId) ||
        Boolean(item.package_group_id) ||
        (isTurkeyToEgyptPackage(item) &&
          !text.includes("turkey istanbul") &&
          !text.includes("istanbul - 8") &&
          !text.includes("8 days / 7 nights") &&
          !text.includes("turkey & egypt") &&
          !text.includes("istanbul - sharm") &&
          !text.includes("istanbul / sharm"))
      ),
    [packagesData]
  );

  const turkeyEgyptIstanbulSharmPackages = useMemo(
    () =>
      routePackages((text) =>
        text.includes("turkey & egypt") ||
        text.includes("istanbul - sharm") ||
        text.includes("istanbul / sharm") ||
        text.includes("istanbul sharm el-sheikh")
      ),
    [packagesData]
  );

  const europeTourPackages = useMemo(
    () =>
      routePackages((text) =>
        text.includes("europe tour") ||
        text.includes("prague") ||
        text.includes("budapest")
      ),
    [packagesData]
  );

  const franceBelgiumHollandPackages = useMemo(
    () =>
      routePackages((text) =>
        text.includes("france") &&
        text.includes("belgium") &&
        text.includes("holland")
      ),
    [packagesData]
  );

  const moroccoSpainPackages = useMemo(
    () =>
      routePackages((text) =>
        text.includes("morocco") ||
        text.includes("marrakech") ||
        (text.includes("spain") &&
          !text.includes("italy") &&
          !text.includes("switzerland") &&
          !text.includes("milan") &&
          !text.includes("barcelona"))
      ),
    [packagesData]
  );

  const italySwitzerlandFranceSpainPackages = useMemo(
    () =>
      routePackages((text) =>
        text.includes("italy") ||
        text.includes("switzerland") ||
        text.includes("milan") ||
        text.includes("barcelona")
      ),
    [packagesData]
  );

  const franciaParisPackages = useMemo(
    () =>
      routePackages((text) =>
        text.includes("francia paris") ||
        text.includes("paris city") ||
        text.includes("seine")
      ),
    [packagesData]
  );

  const turkeyPackageGroups = useMemo(() => {
    const groupsMap = new Map();

    turkeyToEgyptPackages
      .filter((item) => item.packageGroupId || item.package_group_id)
      .forEach((item) => {
        const groupId = item.packageGroupId || item.package_group_id;

        if (!groupsMap.has(groupId)) {
          groupsMap.set(groupId, {
            id: groupId,
            title: item.packageGroupTitle || "Turkey Package",
            subtitle: item.packageGroupSubtitle || item.duration,
            shortTitle: item.packageGroupShortTitle || item.duration,
            packages: [],
          });
        }

        groupsMap.get(groupId).packages.push(item);
      });

    turkeyToEgyptPackages
      .filter((item) => !item.packageGroupId && !item.package_group_id)
      .forEach((item) => {
        const text = getRouteText(item);
        let groupId = "";

        if (text.includes("5 nights") || text.includes("5nights")) {
          groupId = "turkey-sharm-cairo-5n6d";
        } else if (text.includes("deluxe")) {
          groupId = "turkey-sharm-cairo-7n8d-5-2";
        } else if (text.includes("7 nights") || text.includes("7nights")) {
          groupId = "turkey-sharm-cairo-7n8d-6-1";
        }

        if (!groupId || !groupsMap.has(groupId)) return;

        groupsMap.get(groupId).packages.unshift({
          ...item,
          isGroupMainPackage: true,
        });
      });

    return Array.from(groupsMap.values());
  }, [turkeyToEgyptPackages]);

const categoryPackages = useMemo(() => {
  if (selectedPackageCategory === "egypt") return egyptPackages;

  if (selectedPackageCategory === "others") {
    if (selectedOtherRoute === "turkey-egypt") return turkeyToEgyptPackages;
    if (selectedOtherRoute === "turkey-egypt-istanbul-sharm") {
      return turkeyEgyptIstanbulSharmPackages;
    }
    if (selectedOtherRoute === "europe-tour") return europeTourPackages;
    if (selectedOtherRoute === "france-belgium-holland") {
      return franceBelgiumHollandPackages;
    }
    if (selectedOtherRoute === "morocco-spain") return moroccoSpainPackages;
    if (selectedOtherRoute === "italy-switzerland-france-spain") {
      return italySwitzerlandFranceSpainPackages;
    }
    if (selectedOtherRoute === "francia-paris") return franciaParisPackages;
    if (selectedOtherRoute === "turkey-istanbul-summer") {
  return turkeyIstanbulSummerPackages;
}

    return [];
  }

  return [];
}, [
  egyptPackages,
  turkeyToEgyptPackages,
  turkeyEgyptIstanbulSharmPackages,
  europeTourPackages,
  franceBelgiumHollandPackages,
  moroccoSpainPackages,
  italySwitzerlandFranceSpainPackages,
  franciaParisPackages,
  selectedPackageCategory,
  selectedOtherRoute,
  turkeyIstanbulSummerPackages,
]);

  const showPriceFilter = categoryPackages.some((item) => !item.hidePrice);

  const packageNameOptions = useMemo(() => {
    const names = categoryPackages
      .map((item) => item.name)
      .filter(Boolean)
      .map((name) => String(name).trim());

    return [...new Set(names)];
  }, [categoryPackages]);

  const durationOptions = useMemo(() => {
    const durations = categoryPackages
      .map((item) => item.duration)
      .filter(Boolean)
      .map((duration) => String(duration).trim());

    return [...new Set(durations)];
  }, [categoryPackages]);

  const filteredPackages = useMemo(() => {
    return categoryPackages.filter((item) => {
      const matchesName =
        selectedPackageNameFilter === "all" ||
        String(item.name || "") === selectedPackageNameFilter;

      const matchesDuration =
        selectedDurationFilter === "all" ||
        String(item.duration || "") === selectedDurationFilter;

      const itemPrice = getPackagePriceValue(item.startPrice);
      const matchesPrice = item.hidePrice
        ? true
        : matchPriceFilter(itemPrice, selectedPriceFilter);

      return matchesName && matchesDuration && matchesPrice;
    });
  }, [
    categoryPackages,
    selectedPackageNameFilter,
    selectedDurationFilter,
    selectedPriceFilter,
  ]);

  const hasActivePackageFilters =
    selectedPackageNameFilter !== "all" ||
    selectedDurationFilter !== "all" ||
    (showPriceFilter && selectedPriceFilter !== "all");

  const totalPackagePages = Math.max(
    1,
    Math.ceil(filteredPackages.length / ITEMS_PER_PAGE)
  );

  const packageStartIndex = (currentPackagePage - 1) * ITEMS_PER_PAGE;

  const paginatedPackages = filteredPackages.slice(
    packageStartIndex,
    packageStartIndex + ITEMS_PER_PAGE
  );

  const resetPackageFilters = () => {
    setSelectedPackageNameFilter("all");
    setSelectedDurationFilter("all");
    setSelectedPriceFilter("all");
  };

  const choosePackageCategory = (category) => {
    setSelectedPackageCategory(category);
    setSelectedOtherRoute(null);
    resetPackageFilters();
    setCurrentPackagePage(1);

    setTimeout(() => {
      document
        .querySelector(
          category === "others" ? ".packages-other-routes-section" : ".packages-list-section"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 80);
  };

  const chooseOtherRoute = (route) => {
    setSelectedOtherRoute(route);
    resetPackageFilters();
    setCurrentPackagePage(1);

    setTimeout(() => {
      document.querySelector(".packages-list-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  const backToOtherRoutes = () => {
    setSelectedOtherRoute(null);
    resetPackageFilters();
    setCurrentPackagePage(1);

    setTimeout(() => {
      document.querySelector(".packages-other-routes-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  const backToPackageCategories = () => {
    setSelectedPackageCategory(null);
    setSelectedOtherRoute(null);
    resetPackageFilters();
    setCurrentPackagePage(1);

    setTimeout(() => {
      document.querySelector(".packages-category-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  useEffect(() => {
    setCurrentPackagePage(1);
  }, [
    selectedPackageCategory,
    selectedOtherRoute,
    selectedPackageNameFilter,
    selectedDurationFilter,
    selectedPriceFilter,
  ]);

  useEffect(() => {
    if (currentPackagePage > totalPackagePages) {
      setCurrentPackagePage(totalPackagePages);
    }
  }, [currentPackagePage, totalPackagePages]);

  const goToPackagePage = (page) => {
    const safePage = Math.min(Math.max(page, 1), totalPackagePages);

    setCurrentPackagePage(safePage);

    document.querySelector(".packages-list-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const openPackageId = location.state?.openPackageId;

    if (!openPackageId) return;
    if (packagesLoading) return;

    const allPackagesToOpen = [
      ...packagesData,
      ...turkeyToEgyptPackages,
      ...turkeyEgyptIstanbulSharmPackages,
      ...europeTourPackages,
      ...franceBelgiumHollandPackages,
      ...moroccoSpainPackages,
      ...italySwitzerlandFranceSpainPackages,
      ...franciaParisPackages,
      ...turkeyIstanbulSummerPackages,
    ];

    const packageToOpen = allPackagesToOpen.find(
      (item) => String(item.id) === String(openPackageId)
    );

    if (packageToOpen) {
      if (isEgyptPackage(packageToOpen)) {
        setSelectedPackageCategory("egypt");
        setSelectedOtherRoute(null);
      } else {
        setSelectedPackageCategory("others");
        if (isTurkeyToEgyptPackage(packageToOpen)) {
          setSelectedOtherRoute("turkey-egypt");
        } else if (String(packageToOpen.region || "").toLowerCase().includes("europe")) {
          setSelectedOtherRoute("europe-tour");
        }
      }

      setSelectedPackage(packageToOpen);
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [
    location.state,
    location.pathname,
    navigate,
    packagesData,
    turkeyToEgyptPackages,
    turkeyEgyptIstanbulSharmPackages,
    europeTourPackages,
    franceBelgiumHollandPackages,
    moroccoSpainPackages,
    italySwitzerlandFranceSpainPackages,
    franciaParisPackages,
    turkeyIstanbulSummerPackages,
    packagesLoading,
  ]);

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
        travelDateText: bookingPackage.travelDateText,
        transfer: bookingPackage.transfer,
        roomType: packageBookingData.roomType,
        travelDate: packageBookingData.travelDate,
        startPrice: bookingPackage.hidePrice ? "" : bookingPackage.startPrice,
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

  const listTitle = getPackageCategoryTitle(selectedPackageCategory, selectedOtherRoute);
  const listDescription =
    selectedOtherRoute === "europe-tour"
      ? "Europe programme without prices. Contact our team to receive the offer details."
      : "Filter packages by name, duration and starting price.";
  const backButtonText = selectedPackageCategory === "others"
    ? "← Back to International Trips"
    : "← Back to Egypt Trips / International Trips";
  const backAction = selectedPackageCategory === "others"
    ? backToOtherRoutes
    : backToPackageCategories;

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
              transfers, and international travel programmes.
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

        {!selectedPackageCategory ? (
          <PackageCategoryChooser
            egyptCount={egyptPackages.length}
            othersCount={8}
            loading={packagesLoading}
            onChoose={choosePackageCategory}
          />
        ) : selectedPackageCategory === "others" && !selectedOtherRoute ? (
          <OtherRoutesChooser
            turkeyCount={turkeyPackageGroups.length}
            europeCount={europeTourPackages.length}
            turkeyEgyptCount={turkeyEgyptIstanbulSharmPackages.length}
            turkeyIstanbulCount={turkeyIstanbulSummerPackages.length}
            franceBelgiumHollandCount={franceBelgiumHollandPackages.length}
            franciaParisCount={franciaParisPackages.length}
            moroccoSpainCount={moroccoSpainPackages.length}
            italySwitzerlandFranceSpainCount={
              italySwitzerlandFranceSpainPackages.length
            }
            loading={packagesLoading}
            onChoose={chooseOtherRoute}
            onBack={backToPackageCategories}
          />
        ) : selectedPackageCategory === "others" &&
          selectedOtherRoute === "turkey-egypt" ? (
          <section className="packages-list-section turkey-hotel-packages-section">
            <div className="packages-section-head">
              <span>International Route</span>

              <h2>From Turkey to Egypt Packages</h2>

              <p>
                Choose one of the three package types. Inside each type, every
                hotel option is displayed as a separate package.
              </p>

              <button
                type="button"
                className="packages-category-back"
                onClick={backToOtherRoutes}
              >
                ← Back to International Trips
              </button>
            </div>

            <div className="turkey-group-nav">
              {turkeyPackageGroups.map((group) => (
                <a href={`#${group.id}`} key={`${group.id}-nav`}>
                  <span>
                    <small>{group.title}</small>
                    <b>{group.shortTitle}</b>
                  </span>
                  <strong>{group.packages.length} packages</strong>
                </a>
              ))}
            </div>

            <div className="turkey-package-groups">
              {turkeyPackageGroups.map((group) => (
                <section
                  className="turkey-package-group-card"
                  id={group.id}
                  key={group.id}
                >
                  <div className="turkey-package-group-head">
                    <div>
                      <span>{group.shortTitle}</span>
                      <h3>{group.title}</h3>
                      <p>{group.subtitle}</p>
                    </div>

                    <strong>{group.packages.length} packages</strong>
                  </div>

                  <div className="packages-grid-pro turkey-hotels-grid">
                    {group.packages.map((item) =>
                      item.isGroupMainPackage ? (
                        <PackageCard
                          key={item.id}
                          item={item}
                          onOpen={openPackage}
                          onBook={openPackageBooking}
                          onImageError={handlePackageImageError}
                        />
                      ) : (
                        <TurkeyHotelPackageCard
                          key={item.id}
                          item={item}
                          onOpen={openPackage}
                          onBook={openPackageBooking}
                          onImageError={handlePackageImageError}
                        />
                      )
                    )}
                  </div>
                </section>
              ))}
            </div>
          </section>
        ) : (
          <section className="packages-list-section">
            <div className="packages-section-head">
              <span>Our Offers</span>

              <h2>{listTitle}</h2>

              <p>{listDescription}</p>

              <button
                type="button"
                className="packages-category-back"
                onClick={backAction}
              >
                {backButtonText}
              </button>
            </div>

            <div className="packages-filter-panel">
              <div className="packages-filter-field">
                <label htmlFor="package-name-filter">Package Name</label>

                <select
                  id="package-name-filter"
                  value={selectedPackageNameFilter}
                  onChange={(e) => setSelectedPackageNameFilter(e.target.value)}
                >
                  <option value="all">All packages</option>
                  {packageNameOptions.map((name) => (
                    <option value={name} key={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="packages-filter-field">
                <label htmlFor="package-duration-filter">Duration</label>

                <select
                  id="package-duration-filter"
                  value={selectedDurationFilter}
                  onChange={(e) => setSelectedDurationFilter(e.target.value)}
                >
                  <option value="all">All durations</option>
                  {durationOptions.map((duration) => (
                    <option value={duration} key={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
              </div>

              {showPriceFilter && (
                <div className="packages-filter-field">
                  <label htmlFor="package-price-filter">Price</label>

                  <select
                    id="package-price-filter"
                    value={selectedPriceFilter}
                    onChange={(e) => setSelectedPriceFilter(e.target.value)}
                  >
                    <option value="all">All prices</option>
                    <option value="under-500">Under 500</option>
                    <option value="500-1000">500 - 1000</option>
                    <option value="1000-2000">1000 - 2000</option>
                    <option value="over-2000">Over 2000</option>
                  </select>
                </div>
              )}

              <button
                type="button"
                className="packages-reset-filter"
                onClick={resetPackageFilters}
                disabled={!hasActivePackageFilters}
              >
                <FaFilter />
                Reset
              </button>
            </div>

            <div className="packages-results-info">
              <span>
                {filteredPackages.length} package
                {filteredPackages.length === 1 ? "" : "s"} found
              </span>

              {hasActivePackageFilters && <small>Filters applied</small>}
            </div>

            <div className="packages-grid-pro">
              {packagesLoading ? (
                <p className="empty-packages-message">Loading packages...</p>
              ) : categoryPackages.length === 0 ? (
                <p className="empty-packages-message">
                  No packages available in this category yet.
                </p>
              ) : filteredPackages.length === 0 ? (
                <p className="empty-packages-message">
                  No packages match the selected filters.
                </p>
              ) : (
                paginatedPackages.map((item) => (
                  <PackageCard
                    key={item.id}
                    item={item}
                    onOpen={openPackage}
                    onBook={openPackageBooking}
                    onImageError={handlePackageImageError}
                  />
                ))
              )}
            </div>

            {!packagesLoading && filteredPackages.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentPackagePage}
                totalPages={totalPackagePages}
                onPageChange={goToPackagePage}
              />
            )}
          </section>
        )}

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
          onImageError={handlePackageImageError}
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
