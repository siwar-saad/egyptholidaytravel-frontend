import { EGYPT_PACKAGE_KEYWORDS, PACKAGE_COUNTRIES } from "./packageConstants";

export const splitStoredPhone = (phone = "") => {
  const cleanPhone = phone.trim();

  const country =
    PACKAGE_COUNTRIES.find((item) => cleanPhone.startsWith(item.dialCode)) ||
    PACKAGE_COUNTRIES[0];

  return {
    country,
    phone: cleanPhone.replace(country.dialCode, "").trim(),
  };
};

export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const isPastDate = (dateValue) => {
  if (!dateValue) return false;

  const selectedDate = new Date(`${dateValue}T00:00:00`);
  const today = new Date(`${getTodayDate()}T00:00:00`);

  return selectedDate < today;
};

export const cleanPackageTitle = (value) =>
  String(value || "")
    .replace(/[()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const getPackagePriceValue = (price = "") => {
  const cleanPrice = String(price || "").replace(/,/g, "");
  const match = cleanPrice.match(/\d+(?:\.\d+)?/);

  return match ? Number(match[0]) : null;
};

export const matchPriceFilter = (price, filter) => {
  if (filter === "all") return true;
  if (price === null || Number.isNaN(price)) return false;

  if (filter === "under-500") return price < 500;
  if (filter === "500-1000") return price >= 500 && price <= 1000;
  if (filter === "1000-2000") return price > 1000 && price <= 2000;
  if (filter === "over-2000") return price > 2000;

  return true;
};

export const getPackageUniqueKey = (item = {}) =>
  [item.id, item.name, item.duration, item.route, item.backendName]
    .filter(Boolean)
    .join("::")
    .toLowerCase();

export const mergePackagesWithoutDuplicates = (items = []) => {
  const seen = new Set();

  return items.filter((item) => {
    const key = getPackageUniqueKey(item);

    if (!key) return true;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

export const getPackageTextForCategory = (item = {}) =>
  [
    item.name,
    item.backendName,
    item.route,
    item.country,
    item.destination,
    item.city,
    item.location,
    item.region,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const isEgyptPackage = (item = {}) => {
  const forcedCategory = String(item.forceCategory || "")
    .toLowerCase()
    .trim();

  const categoryText = [
    item.forceCategory,
    item.country,
    item.region,
    item.category,
    item.packageCategory,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    forcedCategory === "others" ||
    forcedCategory === "other" ||
    categoryText.includes("turkey") ||
    categoryText.includes("turkiye") ||
    categoryText.includes("türkiye") ||
    categoryText.includes("others") ||
    categoryText.includes("international") ||
    categoryText.includes("europe")
  ) {
    return false;
  }

  if (forcedCategory === "egypt") return true;

  const text = getPackageTextForCategory(item);

  return EGYPT_PACKAGE_KEYWORDS.some((keyword) => text.includes(keyword));
};

export const isTurkeyToEgyptPackage = (item = {}) => {
  const text = getPackageTextForCategory(item);

  const fromTurkey =
    text.includes("turkey") ||
    text.includes("turkiye") ||
    text.includes("türkiye") ||
    text.includes("saw");

  const toEgypt =
    text.includes("egypt") || text.includes("sharm") || text.includes("cairo");

  return fromTurkey && toEgypt;
};

export const getPackageCategoryTitle = (category, route) => {
  if (category === "egypt") return "Egypt Trips";
  if (category === "others" && route === "europe-tour") return "Europe Tour Package";
  if (category === "others") return "International Trips";

  return "Available Packages";
};
