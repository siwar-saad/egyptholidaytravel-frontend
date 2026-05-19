import cai from "../../assets/image/cai.jpg";
import Louxor from "../../assets/image/Louxor.jpg";
import shar from "../../assets/image/shar.jpg";
import diving from "../../assets/image/diving.jpg";
import farsha from "../../assets/image/farsha.jpg";
import safari from "../../assets/image/safari.jpg";

import photo from "../../assets/image/photo.jpg";
import aesthetic from "../../assets/image/aesthetic.jpg";
import AbuSemble from "../../assets/image/AbuSemble.jpg";

import geography from "../../assets/image/geography.jpg";
import desert from "../../assets/image/desert.jpg";
import nile from "../../assets/image/nile.jpg";

import pyra from "../../assets/image/pyra.png";
import aswan from "../../assets/image/aswan.jpeg";
import sharm from "../../assets/image/sharm.jpeg";

import egyptian from "../../assets/image/egyptian.jpg";
import food from "../../assets/image/food.jpg";
import koshari from "../../assets/image/koshari.jpg";
import mlokhia from "../../assets/image/mlokhia.jpg";
import fattah from "../../assets/image/fattah.jpg";

export const infoSections = [
  {
    id: "basic",
    cardTitle: "Basic Facts",
    popupTitle: "Basic Facts About Egypt",
    side: "left",
    images: [cai, Louxor, shar, diving, farsha, safari],
    cardItems: [
      "Egypt is in Northeast Africa",
      "Capital: Cairo",
      "Language: Arabic",
      "Currency: Egyptian Pound (EGP)",
    ],
    paragraphs: [
      "Egypt, officially the Arab Republic of Egypt, is a transcontinental country located primarily in North Africa, with the Sinai Peninsula serving as a land bridge to Asia.",
      "It is often referred to as the gift of the Nile because the country’s population and agriculture are concentrated along the banks of the Nile River.",
    ],
    details: [
      ["Capital", "Cairo"],
      ["Language", "Arabic"],
      ["Currency", "Egyptian Pound"],
      ["Population", "100+ million"],
    ],
  },
  {
    id: "history",
    cardTitle: "History",
    popupTitle: "History of Egypt",
    side: "left",
    images: [photo, aesthetic, AbuSemble],
    cardItems: [
      "Over 5,000 years old",
      "Famous for pyramids and pharaohs",
      "Influenced by Greek, Roman, and Islamic cultures",
    ],
    paragraphs: [
      "Egypt has one of the oldest and richest histories in the world, dating back over 5,000 years.",
      "Ancient Egyptians built a powerful civilization along the Nile River. Their culture was famous for architecture, writing, art, religion, medicine, and astronomy.",
    ],
    details: [
      ["Age", "Over 5,000 years of history"],
      ["Famous For", "Pyramids, pharaohs, temples, and the Sphinx"],
      ["Ancient Capitals", "Memphis and Thebes"],
      ["Key Periods", "Pharaonic, Greek, Roman, Islamic, and modern eras"],
      ["Legacy", "Hieroglyphics, monuments, mummies, and ancient knowledge"],
    ],
  },
  {
    id: "geography",
    cardTitle: "Geography",
    popupTitle: "Geography of Egypt",
    side: "left",
    images: [geography, desert, nile],
    cardItems: [
      "Nile River is the main river",
      "Includes Nile Valley, deserts, Sinai, Red Sea",
    ],
    paragraphs: [
      "Egypt’s geography is shaped by the Nile River, which is the longest river in the world and the main source of life in the country.",
      "The country also includes vast deserts, the Sinai Peninsula, and beautiful coastal areas along the Red Sea and the Mediterranean Sea.",
    ],
    details: [
      ["Main River", "Nile River"],
      ["Regions", "Nile Valley, Nile Delta, Western Desert"],
      ["Peninsula", "Sinai"],
      ["Coasts", "Red Sea and Mediterranean Sea"],
      ["Climate", "Mostly hot desert climate"],
    ],
  },
  {
    id: "destinations",
    cardTitle: "Cities & Destinations",
    popupTitle: "Cities & Destinations in Egypt",
    side: "right",
    images: [pyra, Louxor, aswan, sharm],
    cardItems: ["Cairo", "Alexandria", "Luxor", "Aswan", "Sharm El Sheikh"],
    paragraphs: [
      "Egypt is full of unique cities and destinations, each offering a different travel experience.",
      "Cairo is perfect for history and city life, Alexandria offers a Mediterranean atmosphere, Luxor and Aswan are ideal for ancient temples, while Sharm El Sheikh is famous for beaches and diving.",
    ],
    details: [
      ["Cairo", "Pyramids, Egyptian Museum, Khan El Khalili"],
      ["Alexandria", "Mediterranean coast, history, cafés"],
      ["Luxor", "Karnak Temple, Valley of the Kings"],
      ["Aswan", "Nile views, Nubian culture, Philae Temple"],
      ["Sharm El Sheikh", "Red Sea beaches, diving, snorkeling"],
    ],
  },
  {
    id: "activities",
    cardTitle: "Activities",
    popupTitle: "Activities in Egypt",
    side: "right",
    images: [AbuSemble, nile, safari, diving],
    cardItems: [
      "Visit monuments",
      "Nile cruises",
      "Diving in the Red Sea",
      "Desert safari",
    ],
    paragraphs: [
      "Egypt offers a wide range of unforgettable activities for every traveler.",
      "From exploring ancient monuments and cruising the Nile River to diving in the Red Sea and enjoying desert adventures, Egypt combines culture, nature, and excitement.",
    ],
    details: [
      ["Visit Monuments", "Pyramids, temples, museums"],
      ["Nile Cruises", "Relaxing trips between Luxor and Aswan"],
      ["Diving", "Red Sea coral reefs and marine life"],
      ["Desert Safari", "4x4 adventures and camping"],
      ["Cultural Tours", "Markets, local life, traditions"],
    ],
  },
  {
    id: "food",
    cardTitle: "Food",
    popupTitle: "Egyptian Food",
    side: "right",
    images: [egyptian, food, koshari, mlokhia, fattah],
    cardItems: ["Koshari", "Ful medames", "Molokhia", "Fattah"],
    paragraphs: [
      "Egyptian food is rich, warm, and full of flavor. It reflects the country’s history, culture, and daily life.",
      "From popular street food to traditional family meals, Egyptian cuisine offers delicious dishes that every traveler should try.",
    ],
    details: [
      [
        "Koshari",
        "Rice, pasta, lentils, chickpeas, tomato sauce, and crispy onions",
      ],
      [
        "Ful Medames",
        "Slow-cooked fava beans served with olive oil, lemon, and bread",
      ],
      ["Molokhia", "A green soup made from jute leaves"],
      ["Fattah", "Rice, bread, meat, and garlic tomato sauce"],
      ["Taameya", "Egyptian falafel made with fava beans"],
    ],
  },
];