import { useState } from "react";
import Navbar from "../../components/navbar";
import "./Hotels.css";

import heroImg from "../../assets/image/bghotel.jpg";

/* SHARM */
import hotel1 from "../../assets/image/hotel1-1.jpg";
import hotel1a from "../../assets/image/hotel1-2.jpg";
import hotel1b from "../../assets/image/hotel1-3.jpg";

import hotel2 from "../../assets/image/safir1.jpg";
import hotel2a from "../../assets/image/safir.jpg";
import hotel2b from "../../assets/image/safir2.jpg";

import hotel3 from "../../assets/image/charmillion.jpg";
import hotel3a from "../../assets/image/charmillion1.jpg";
import hotel3b from "../../assets/image/charmillion2.jpg";

import hotel4 from "../../assets/image/Park.jpg";
import hotel4a from "../../assets/image/Park1.jpg";
import hotel4b from "../../assets/image/Park2.jpg";

/* CAIRO */
import fairmont from "../../assets/image/Fairmont.jpg";
import fairmont1 from "../../assets/image/Fairmont1.jpg";
import fairmont2 from "../../assets/image/Fairmont2.jpg";
import fairmont3 from "../../assets/image/Fairmont3.jpg";
import fairmont4 from "../../assets/image/Fairmont4.jpg";
import fairmont5 from "../../assets/image/Fairmont5.jpg";

import ramses from "../../assets/image/Ramses.jpg";
import ramses1 from "../../assets/image/Ramses1.jpg";
import ramses2 from "../../assets/image/Ramses2.jpg";
import ramses3 from "../../assets/image/Ramses3.jpg";
import ramses4 from "../../assets/image/Ramses4.jpg";
import ramses5 from "../../assets/image/Ramses5.jpg";

import inter from "../../assets/image/Inter.jpg";
import inter1 from "../../assets/image/Inter1.jpg";
import inter2 from "../../assets/image/Inter2.jpg";
import inter3 from "../../assets/image/Inter3.jpg";
import inter4 from "../../assets/image/Inter4.jpg";

import holiday from "../../assets/image/Holiday.jpg";
import holiday1 from "../../assets/image/Holiday1.jpg";
import holiday2 from "../../assets/image/Holiday2.jpg";
import holiday4 from "../../assets/image/Holiday4.jpg";
import holiday5 from "../../assets/image/Holiday5.jpg";

import stay from "../../assets/image/Stay.jpg";
import stay1 from "../../assets/image/Stay1.jpg";
import stay2 from "../../assets/image/Stay2.jpg";
import stay3 from "../../assets/image/Stay3.jpg";
import stay4 from "../../assets/image/Stay4.jpg";
import stay5 from "../../assets/image/Stay5.jpg";

/* HURGHADA */
import xanadu from "../../assets/image/Xanadu.jpg";
import xanadu1 from "../../assets/image/Xanadu1.jpg";
import xanadu2 from "../../assets/image/Xanadu2.jpg";
import xanadu3 from "../../assets/image/Xanadu3.jpg";

import seven from "../../assets/image/Seven.jpg";
import seven1 from "../../assets/image/Seven1.jpg";
import seven2 from "../../assets/image/Seven2.jpg";
import seven3 from "../../assets/image/Seven3.jpg";

import pharaoh from "../../assets/image/Pharaoh.jpg";
import pharaoh1 from "../../assets/image/Pharaoh1.jpg";
import pharaoh2 from "../../assets/image/Pharaoh2.jpg";
import pharaoh3 from "../../assets/image/Pharaoh3.jpg";

import continental from "../../assets/image/Continental.jpg";
import continental1 from "../../assets/image/Continental1.jpg";
import continental2 from "../../assets/image/Continental2.jpg";
import continental3 from "../../assets/image/Continental3.jpg";

import cleopatra from "../../assets/image/Cleopatra.jpg";
import cleopatra1 from "../../assets/image/Cleopatra1.jpg";
import cleopatra2 from "../../assets/image/Cleopatra2.jpg";
import cleopatra3 from "../../assets/image/Cleopatra3.jpg";

import jazsoma from "../../assets/image/JazSoma.jpg";
import jazsoma1 from "../../assets/image/JazSoma1.jpg";
import jazsoma2 from "../../assets/image/JazSoma2.jpg";
import jazsoma3 from "../../assets/image/JazSoma3.jpg";

/* DAHAB */
import retac from "../../assets/image/Retac.jpg";
import retac1 from "../../assets/image/Retac1.jpg";
import retac2 from "../../assets/image/Retac2.jpg";
import retac3 from "../../assets/image/Retac3.jpg";

import ecootel from "../../assets/image/Ecootel.jpg";
import ecootel1 from "../../assets/image/Ecootel1.jpg";
import ecootel2 from "../../assets/image/Ecootel2.jpg";
import ecootel3 from "../../assets/image/Ecootel3.jpg";

import lagoon from "../../assets/image/Lagoon.jpg";
import lagoon1 from "../../assets/image/Lagoon1.jpg";
import lagoon2 from "../../assets/image/Lagoon2.jpg";
import lagoon3 from "../../assets/image/Lagoon3.jpg";

import jazdahabeya from "../../assets/image/JazDahabeya.jpg";
import jazdahabeya1 from "../../assets/image/JazDahabeya1.jpg";
import jazdahabeya2 from "../../assets/image/JazDahabeya2.jpg";
import jazdahabeya3 from "../../assets/image/JazDahabeya3.jpg";

import happylife from "../../assets/image/HappyLife.jpg";
import happylife1 from "../../assets/image/HappyLife1.jpg";
import happylife2 from "../../assets/image/HappyLife2.jpg";


/* EL ALAMEIN */
import gewanwhite from "../../assets/image/GewanWhite.jpg";
import gewanwhite1 from "../../assets/image/GewanWhite1.jpg";
import gewanwhite2 from "../../assets/image/GewanWhite2.jpg";
import gewanwhite3 from "../../assets/image/GewanWhite3.jpg";

import gewanresort from "../../assets/image/GewanResort.jpg";
import gewanresort1 from "../../assets/image/GewanResort1.jpg";
import gewanresort2 from "../../assets/image/GewanResort2.jpg";
import gewanresort3 from "../../assets/image/GewanResort3.jpg";

import gewanpalace from "../../assets/image/GewanPalace.jpg";
import gewanpalace1 from "../../assets/image/GewanPalace1.jpg";

const sharmHotels = [
  {
    image: hotel1,
    gallery: [hotel1, hotel1a, hotel1b],
    name: "Renaissance Sharm El Sheikh",
    city: "Sharm El Sheikh",
    meal: "Soft All Inclusive",
    periods: [
      { from: "01-May-2026", to: "24-May-2026", single: "40 USD", double: "63 USD", triple: "2 USD Reduction" },
      { from: "25-May-2026", to: "31-May-2026", single: "55 USD", double: "90 USD", triple: "2 USD Reduction" },
      { from: "01-Jun-2026", to: "30-Jun-2026", single: "40 USD", double: "60 USD", triple: "2 USD Reduction" },
      { from: "01-Jul-2026", to: "10-Jul-2026", single: "40 USD", double: "65 USD", triple: "2 USD Reduction" },
      { from: "11-Jul-2026", to: "31-Jul-2026", single: "40 USD", double: "70 USD", triple: "2 USD Reduction" },
      { from: "01-Aug-2026", to: "31-Aug-2026", single: "40 USD", double: "75 USD", triple: "2 USD Reduction" },
      { from: "01-Sep-2026", to: "30-Sep-2026", single: "40 USD", double: "70 USD", triple: "2 USD Reduction" },
      { from: "01-Oct-2026", to: "31-Oct-2026", single: "40 USD", double: "75 USD", triple: "2 USD Reduction" },
    ],
  },
  {
    image: hotel2,
    gallery: [hotel2, hotel2a, hotel2b],
    name: "Safir Sharm Waterfalls Resort",
    city: "Sharm El Sheikh",
    meal: "Soft All Inclusive",
    periods: [
      { from: "01-May-2026", to: "25-May-2026", single: "83 USD", double: "52 USD", triple: "50 USD" },
      { from: "26-May-2026", to: "31-May-2026", single: "144 USD", double: "90 USD", triple: "88 USD" },
      { from: "01-Jun-2026", to: "15-Jul-2026", single: "91 USD", double: "57 USD", triple: "55 USD" },
      { from: "16-Jul-2026", to: "20-Nov-2026", single: "112 USD", double: "70 USD", triple: "68 USD" },
      { from: "21-Nov-2026", to: "27-Dec-2026", single: "91 USD", double: "57 USD", triple: "55 USD" },
      { from: "28-Dec-2026", to: "07-Jan-2027", single: "112 USD", double: "70 USD", triple: "68 USD" },
    ],
  },
  {
    image: hotel3,
    gallery: [hotel3, hotel3a, hotel3b],
    name: "Charmillion Club Aqua Park",
    city: "Sharm El Sheikh",
    meal: "Soft All Inclusive",
    periods: [
      { from: "11-May-2026", to: "25-May-2026", single: "112 USD", double: "70 USD", triple: "68 USD" },
      { from: "26-May-2026", to: "31-May-2026", single: "216 USD", double: "135 USD", triple: "133 USD" },
      { from: "01-Jun-2026", to: "30-Jun-2026", single: "120 USD", double: "75 USD", triple: "73 USD" },
      { from: "01-Jul-2026", to: "10-Jul-2026", single: "168 USD", double: "105 USD", triple: "103 USD" },
      { from: "11-Jul-2026", to: "31-Aug-2026", single: "200 USD", double: "125 USD", triple: "123 USD" },
      { from: "01-Sep-2026", to: "15-Sep-2026", single: "168 USD", double: "105 USD", triple: "103 USD" },
      { from: "16-Sep-2026", to: "31-Oct-2026", single: "136 USD", double: "85 USD", triple: "83 USD" },
    ],
  },
  {
    image: hotel4,
    gallery: [hotel4, hotel4a, hotel4b],
    name: "Park Regency Resort",
    city: "Sharm El Sheikh",
    meal: "Soft All Inclusive",
    periods: [
      { from: "24-Mar-2026", to: "30-Apr-2026", single: "136 USD", double: "85 USD", triple: "—" },
      { from: "01-May-2026", to: "25-May-2026", single: "136 USD", double: "85 USD", triple: "—" },
      { from: "26-May-2026", to: "31-May-2026", single: "160 USD", double: "100 USD", triple: "—" },
      { from: "01-Jun-2026", to: "30-Jun-2026", single: "144 USD", double: "90 USD", triple: "—" },
      { from: "01-Jul-2026", to: "31-Jul-2026", single: "192 USD", double: "120 USD", triple: "—" },
      { from: "01-Aug-2026", to: "31-Aug-2026", single: "200 USD", double: "125 USD", triple: "—" },
      { from: "01-Sep-2026", to: "31-Oct-2026", single: "160 USD", double: "100 USD", triple: "—" },
    ],
  },
];

const cairoHotels = [
  {
    image: fairmont,
    gallery: [fairmont, fairmont1, fairmont2, fairmont3, fairmont4, fairmont5],
    name: "Fairmont Nile City",
    city: "Cairo",
    meal: "Bed & Breakfast",
    periods: [{ from: "01-Jun-2026", to: "30-Sep-2026", single: "170 USD", double: "190 USD", triple: "240 USD" }],
  },
  {
    image: ramses,
    gallery: [ramses, ramses1, ramses2, ramses3, ramses4, ramses5],
    name: "Ramses Hilton",
    city: "Cairo",
    meal: "Bed & Breakfast",
    periods: [{ from: "26-Mar-2026", to: "01-Jun-2026", single: "100 USD", double: "100 USD", triple: "130 USD" }],
  },
  {
    image: inter,
    gallery: [inter, inter1, inter2, inter3, inter4],
    name: "InterContinental Cairo Citystars",
    city: "Cairo",
    meal: "Room Only",
    periods: [
      { from: "05-May-2026", to: "17-May-2026", single: "190 USD", double: "190 USD", triple: "220 USD" },
      { from: "18-May-2026", to: "20-May-2026", single: "220 USD", double: "220 USD", triple: "250 USD" },
      { from: "21-May-2026", to: "04-Jun-2026", single: "190 USD", double: "190 USD", triple: "220 USD" },
      { from: "05-Jun-2026", to: "09-Jun-2026", single: "250 USD", double: "250 USD", triple: "280 USD" },
      { from: "10-Jun-2026", to: "30-Jun-2026", single: "210 USD", double: "210 USD", triple: "240 USD" },
    ],
  },
  {
    image: holiday,
    gallery: [holiday, holiday1, holiday2, holiday4, holiday5],
    name: "Holiday Inn Cairo Citystars",
    city: "Cairo",
    meal: "Room Only",
    periods: [
      { from: "05-May-2026", to: "17-May-2026", single: "115 USD", double: "115 USD", triple: "185 USD" },
      { from: "18-May-2026", to: "20-May-2026", single: "140 USD", double: "140 USD", triple: "195 USD" },
      { from: "21-May-2026", to: "04-Jun-2026", single: "115 USD", double: "115 USD", triple: "185 USD" },
      { from: "05-Jun-2026", to: "09-Jun-2026", single: "150 USD", double: "150 USD", triple: "200 USD" },
      { from: "10-Jun-2026", to: "30-Jun-2026", single: "135 USD", double: "135 USD", triple: "185 USD" },
    ],
  },
  {
    image: stay,
    gallery: [stay, stay1, stay2, stay3, stay4, stay5],
    name: "Staybridge Suites Cairo Citystars",
    city: "Cairo",
    meal: "Bed & Complimentary Buffet Breakfast",
    periods: [{ from: "05-May-2026", to: "30-Jun-2026", single: "180 USD", double: "180 USD", triple: "225 USD" }],
  },
];

const hurghadaHotels = [
  {
    image: xanadu,
    gallery: [xanadu, xanadu1, xanadu2, xanadu3],
    name: "Xanadu Makadi Bay",
    city: "Hurghada / Makadi Bay",
    meal: "High Class All Inclusive",
    periods: [
      { from: "01-May-2026", to: "07-May-2026", single: "255 USD", double: "170 USD", triple: "—" },
      { from: "08-May-2026", to: "20-May-2026", single: "225 USD", double: "150 USD", triple: "—" },
      { from: "21-May-2026", to: "30-Jun-2026", single: "255 USD", double: "170 USD", triple: "—" },
      { from: "01-Jul-2026", to: "31-Aug-2026", single: "270 USD", double: "180 USD", triple: "—" },
      { from: "01-Sep-2026", to: "31-Oct-2026", single: "300 USD", double: "200 USD", triple: "—" },
    ],
  },
  {
    image: seven,
    gallery: [seven, seven1, seven2, seven3],
    name: "Seven Seas Jolie Bay",
    city: "Hurghada / Abu Soma",
    meal: "Ultra All Inclusive",
    periods: [
      { from: "01-May-2026", to: "25-May-2026", single: "93 USD", double: "62 USD", triple: "—" },
      { from: "26-May-2026", to: "31-May-2026", single: "114 USD", double: "76 USD", triple: "—" },
      { from: "01-Jun-2026", to: "30-Jun-2026", single: "102 USD", double: "68 USD", triple: "—" },
      { from: "01-Jul-2026", to: "15-Jul-2026", single: "129 USD", double: "86 USD", triple: "—" },
      { from: "16-Jul-2026", to: "18-Sep-2026", single: "129 USD", double: "86 USD", triple: "—" },
      { from: "19-Sep-2026", to: "31-Oct-2026", single: "114 USD", double: "76 USD", triple: "—" },
    ],
  },
  {
    image: pharaoh,
    gallery: [pharaoh, pharaoh1, pharaoh2, pharaoh3],
    name: "Pharaoh Azur Resort",
    city: "Hurghada",
    meal: "Soft All Inclusive",
    periods: [
      { from: "01-May-2026", to: "08-Jul-2026", single: "81 USD", double: "56 USD", triple: "53 USD" },
      { from: "09-Jul-2026", to: "19-Aug-2026", single: "86 USD", double: "61 USD", triple: "58 USD" },
      { from: "20-Aug-2026", to: "23-Sep-2026", single: "81 USD", double: "56 USD", triple: "53 USD" },
      { from: "24-Sep-2026", to: "31-Oct-2026", single: "86 USD", double: "61 USD", triple: "58 USD" },
    ],
  },
  {
    image: continental,
    gallery: [continental, continental1, continental2, continental3],
    name: "Continental Hotel Hurghada",
    city: "Hurghada",
    meal: "Soft All Inclusive",
    periods: [
      { from: "04-May-2026", to: "25-May-2026", single: "184 USD", double: "115 USD", triple: "113 USD" },
      { from: "26-May-2026", to: "31-May-2026", single: "248 USD", double: "155 USD", triple: "153 USD" },
      { from: "01-Jun-2026", to: "30-Jun-2026", single: "184 USD", double: "115 USD", triple: "113 USD" },
      { from: "01-Jul-2026", to: "31-Oct-2026", single: "216 USD", double: "135 USD", triple: "133 USD" },
    ],
  },
  {
    image: cleopatra,
    gallery: [cleopatra, cleopatra1, cleopatra2, cleopatra3],
    name: "Cleopatra Luxury Makadi Bay",
    city: "Hurghada / Makadi Bay",
    meal: "Soft All Inclusive",
    periods: [
      { from: "01-May-2026", to: "25-May-2026", single: "128 USD", double: "80 USD", triple: "78 USD" },
      { from: "26-May-2026", to: "31-May-2026", single: "160 USD", double: "100 USD", triple: "98 USD" },
      { from: "01-Jun-2026", to: "31-Oct-2026", single: "128 USD", double: "80 USD", triple: "78 USD" },
    ],
  },
  {
    image: jazsoma,
    gallery: [jazsoma, jazsoma1, jazsoma2, jazsoma3],
    name: "Jaz Soma Beach",
    city: "Hurghada / Abu Soma",
    meal: "All Inclusive",
    periods: [
      { from: "01-May-2026", to: "25-Jun-2026", single: "161 USD", double: "92 USD", triple: "—" },
      { from: "26-Jun-2026", to: "06-Aug-2026", single: "175 USD", double: "100 USD", triple: "—" },
      { from: "07-Aug-2026", to: "27-Aug-2026", single: "190.75 USD", double: "109 USD", triple: "—" },
      { from: "28-Aug-2026", to: "01-Oct-2026", single: "175.10 USD", double: "100.06 USD", triple: "—" },
      { from: "02-Oct-2026", to: "31-Oct-2026", single: "187.25 USD", double: "107 USD", triple: "—" },
    ],
  },
];

const dahabHotels = [
  {
    image: retac,
    gallery: [retac, retac1, retac2, retac3],
    name: "Retac Dahab Resort & Spa",
    city: "Dahab",
    meal: "Half Board",
    periods: [
      { from: "15-Mar-2026", to: "17-Mar-2026", single: "85 USD", double: "55 USD", triple: "160 USD" },
      { from: "18-Mar-2026", to: "25-Mar-2026", single: "120 USD", double: "80 USD", triple: "235 USD" },
      { from: "26-Mar-2026", to: "08-Apr-2026", single: "105 USD", double: "70 USD", triple: "205 USD" },
      { from: "09-Apr-2026", to: "14-Apr-2026", single: "135 USD", double: "90 USD", triple: "265 USD" },
      { from: "15-Apr-2026", to: "29-Apr-2026", single: "105 USD", double: "70 USD", triple: "205 USD" },
      { from: "30-Apr-2026", to: "05-May-2026", single: "135 USD", double: "90 USD", triple: "265 USD" },
      { from: "06-May-2026", to: "20-May-2026", single: "105 USD", double: "70 USD", triple: "205 USD" },
      { from: "21-May-2026", to: "31-May-2026", single: "135 USD", double: "90 USD", triple: "265 USD" },
      { from: "01-Jun-2026", to: "15-Jul-2026", single: "105 USD", double: "70 USD", triple: "205 USD" },
      { from: "16-Jul-2026", to: "10-Oct-2026", single: "120 USD", double: "80 USD", triple: "235 USD" },
      { from: "11-Oct-2026", to: "31-Oct-2026", single: "105 USD", double: "70 USD", triple: "205 USD" },
    ],
  },
  {
    image: ecootel,
    gallery: [ecootel, ecootel1, ecootel2, ecootel3],
    name: "Ecotel Dahab Bay View Resort",
    city: "Dahab",
    meal: "Half Board",
    periods: [
      { from: "27-Jan-2026", to: "06-Feb-2026", single: "120 USD", double: "140 USD", triple: "170 USD" },
      { from: "07-Feb-2026", to: "19-Mar-2026", single: "110 USD", double: "130 USD", triple: "160 USD" },
      { from: "20-Mar-2026", to: "27-Mar-2026", single: "120 USD", double: "140 USD", triple: "170 USD" },
      { from: "28-Mar-2026", to: "08-Apr-2026", single: "110 USD", double: "130 USD", triple: "160 USD" },
      { from: "09-Apr-2026", to: "18-Apr-2026", single: "120 USD", double: "140 USD", triple: "170 USD" },
      { from: "19-Apr-2026", to: "25-May-2026", single: "110 USD", double: "130 USD", triple: "160 USD" },
      { from: "26-May-2026", to: "31-May-2026", single: "120 USD", double: "140 USD", triple: "170 USD" },
      { from: "01-Jun-2026", to: "20-Jul-2026", single: "110 USD", double: "130 USD", triple: "160 USD" },
      { from: "21-Jul-2026", to: "31-Oct-2026", single: "120 USD", double: "140 USD", triple: "170 USD" },
    ],
  },
  {
    image: lagoon,
    gallery: [lagoon, lagoon1, lagoon2, lagoon3],
    name: "Dahab Lagoon Club Resort",
    city: "Dahab",
    meal: "Half Board",
    periods: [
      { from: "14-Apr-2026", to: "25-May-2026", single: "96 USD", double: "120 USD", triple: "171 USD" },
      { from: "26-May-2026", to: "31-May-2026", single: "112 USD", double: "140 USD", triple: "201 USD" },
      { from: "01-Jun-2026", to: "09-Jul-2026", single: "96 USD", double: "120 USD", triple: "171 USD" },
      { from: "10-Jul-2026", to: "31-Oct-2026", single: "112 USD", double: "140 USD", triple: "201 USD" },
    ],
  },
  {
    image: jazdahabeya,
    gallery: [jazdahabeya, jazdahabeya1, jazdahabeya2, jazdahabeya3],
    name: "Jaz Dahabeya",
    city: "Dahab",
    meal: "Half Board",
    periods: [
      { from: "01-May-2026", to: "21-May-2026", single: "131 USD", double: "75 USD", triple: "92 USD" },
      { from: "22-May-2026", to: "31-May-2026", single: "228 USD", double: "130 USD", triple: "147 USD" },
      { from: "01-Jun-2026", to: "17-Jul-2026", single: "193 USD", double: "110 USD", triple: "127 USD" },
      { from: "18-Jul-2026", to: "31-Aug-2026", single: "158 USD", double: "90 USD", triple: "107 USD" },
      { from: "01-Sep-2026", to: "30-Sep-2026", single: "201 USD", double: "115 USD", triple: "132 USD" },
      { from: "01-Oct-2026", to: "31-Oct-2026", single: "201 USD", double: "115 USD", triple: "132 USD" },
    ],
  },
  {
    image: happylife,
    gallery: [happylife, happylife1, happylife2],
    name: "Happy Life Village Dahab",
    city: "Dahab",
    meal: "Half Board",
    periods: [
      { from: "01-May-2026", to: "25-May-2026", single: "55 USD", double: "80 USD", triple: "115 USD" },
      { from: "26-May-2026", to: "31-May-2026", single: "70 USD", double: "110 USD", triple: "160 USD" },
      { from: "01-Jun-2026", to: "02-Jul-2026", single: "55 USD", double: "80 USD", triple: "115 USD" },
      { from: "03-Jul-2026", to: "31-Oct-2026", single: "65 USD", double: "100 USD", triple: "145 USD" },
    ],
  },
];

const alameinHotels = [
  {
    image: gewanwhite,
    gallery: [gewanwhite, gewanwhite1, gewanwhite2, gewanwhite3],
    name: "Gewan White Beach Resort",
    city: "New Alamein",
    meal: "Bed & Breakfast",
    periods: [
      { from: "27-May-2026", to: "31-May-2026 / 01-Jul-2026 to 31-Aug-2026", single: "310 USD", double: "330 USD", triple: "Lake View" },
      { from: "01-Jun-2026", to: "15-Jun-2026", single: "175 USD", double: "195 USD", triple: "Lake View" },
      { from: "16-Jun-2026", to: "30-Jun-2026", single: "235 USD", double: "255 USD", triple: "Lake View" },
    ],
  },
  {
    image: gewanresort,
    gallery: [gewanresort, gewanresort1, gewanresort2, gewanresort3],
    name: "Gewan Resort New Alamein",
    city: "New Alamein",
    meal: "Bed & Breakfast",
    periods: [
      { from: "27-May-2026", to: "31-May-2026 / 01-Jul-2026 to 31-Aug-2026", single: "300 USD", double: "320 USD", triple: "Garden View" },
      { from: "01-Jun-2026", to: "15-Jun-2026", single: "165 USD", double: "185 USD", triple: "Garden View" },
      { from: "16-Jun-2026", to: "30-Jun-2026", single: "225 USD", double: "245 USD", triple: "Garden View" },
    ],
  },
  {
    image: gewanpalace,
    gallery: [gewanpalace, gewanpalace1],
    name: "Gewan Palace New Alamein",
    city: "New Alamein",
    meal: "Bed & Breakfast",
    periods: [
      { from: "27-May-2026", to: "31-May-2026 / 01-Jul-2026 to 31-Aug-2026", single: "425 USD", double: "445 USD", triple: "Standard Room" },
      { from: "01-Jun-2026", to: "15-Jun-2026", single: "300 USD", double: "320 USD", triple: "Standard Room" },
      { from: "16-Jun-2026", to: "30-Jun-2026", single: "350 USD", double: "370 USD", triple: "Standard Room" },
    ],
  },
];

const hotelGroups = [
  {
    title: "Hotels in Sharm El Sheikh",
    subtitle: "Luxury beach resorts, Red Sea views, and unforgettable relaxing stays.",
    hotels: sharmHotels,
  },
  {
    title: "Hotels in Cairo",
    subtitle: "Premium city hotels close to culture, shopping, Nile views, and iconic landmarks.",
    hotels: cairoHotels,
  },
  {
    title: "Hotels in Hurghada",
    subtitle: "Premium Red Sea resorts in Hurghada, Makadi Bay, and Abu Soma.",
    hotels: hurghadaHotels,
  },
  {
    title: "Hotels in Dahab",
    subtitle: "Relaxing beach resorts, crystal-clear waters, and peaceful stays.",
    hotels: dahabHotels,
  },
  {
    title: "Hotels in El Alamein",
    subtitle: "Luxury Mediterranean resorts and premium summer escapes.",
    hotels: alameinHotels,
  },
];

export default function Hotels() {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const [bookingData, setBookingData] = useState({
    fullName: "",
    email: "",
    phone: "",
    travelers: "",
    checkIn: "",
    checkOut: "",
    roomType: "Single Room",
    notes: "",
  });

  const openHotel = (hotel) => {
    setSelectedHotel(hotel);
    setMainImage(hotel.image);
    setShowBookingForm(false);
  };

  const closeHotel = () => {
    setSelectedHotel(null);
    setMainImage(null);
    setShowBookingForm(false);
  };

  const handleBookingSubmit = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/hotels/reserve",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            hotel: {
              name: selectedHotel.name,
              city: selectedHotel.city,
              mealPlan: selectedHotel.meal,
              checkIn: bookingData.checkIn,
              checkOut: bookingData.checkOut,
              roomType: bookingData.roomType,
            },

            customerInfo: {
              fullName: bookingData.fullName,
              email: bookingData.email,
              phone: bookingData.phone,
              travelers: bookingData.travelers,
              notes: bookingData.notes,
            },

            totalPrice:
              selectedHotel.singleRoom ||
              selectedHotel.doubleRoom ||
              selectedHotel.price ||
              0,

            userRole:
              JSON.parse(localStorage.getItem("user"))?.role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Booking failed");
        return;
      }

      alert("Booking request sent successfully!");

      setBookingData({
        fullName: "",
        email: "",
        phone: "",
        travelers: "",
        checkIn: "",
        checkOut: "",
        roomType: "Single Room",
        notes: "",
      });

      setShowBookingForm(false);

    } catch (error) {
      console.error(error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="hotels-page">
        <section
          className="hotels-hero"
          style={{
            backgroundImage: `linear-gradient(rgba(42,33,23,.58), rgba(42,33,23,.58)), url(${heroImg})`,
          }}
        >
          <span>Egypt Holiday Travel</span>
          <h1>Our Partner Hotels</h1>
          <p>
            Discover premium hotels with elegant comfort, clear prices, and
            carefully selected stays for your perfect holiday in Egypt.
          </p>
        </section>

        {hotelGroups.map((group) => (
          <HotelSection
            key={group.title}
            title={group.title}
            subtitle={group.subtitle}
            hotels={group.hotels}
            onSelect={openHotel}
          />
        ))}

        {selectedHotel && (
          <HotelModal
            hotel={selectedHotel}
            mainImage={mainImage}
            setMainImage={setMainImage}
            onClose={closeHotel}
            onBook={() => setShowBookingForm(true)}
          />
        )}

        {showBookingForm && selectedHotel && (
          <BookingForm
            hotel={selectedHotel}
            bookingData={bookingData}
            setBookingData={setBookingData}
            onClose={() => setShowBookingForm(false)}
            onSubmit={handleBookingSubmit}
          />
        )}
      </main>
    </>
  );
}

function HotelSection({ title, subtitle, hotels, onSelect }) {
  return (
    <section className="hotel-section">
      <div className="hotel-section-head">
        <span>Premium Hotels</span>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="hotels-grid">
        {hotels.map((hotel, index) => (
          <article
            className="hotel-cover-card"
            key={`${hotel.name}-${index}`}
            onClick={() => onSelect(hotel)}
          >
            <img src={hotel.image} alt={hotel.name} />

            <div className="hotel-cover-overlay">
              <span>{hotel.city}</span>
              <h3>{hotel.name}</h3>
              <button type="button">View Details</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function HotelModal({ hotel, mainImage, setMainImage, onClose, onBook }) {
  const gallery = hotel.gallery || [];
  const periods = hotel.periods || [];

  return (
    <div className="hotel-modal">
      <div className="hotel-modal-box">
        <button type="button" className="close-modal" onClick={onClose}>
          ×
        </button>

        <div className="modal-img">
          <img src={mainImage || hotel.image} alt={hotel.name} />
        </div>

        <div className="modal-content">
          <span className="modal-city">{hotel.city}</span>
          <h2>{hotel.name}</h2>

          <div className="hotel-gallery">
            {gallery.map((img, index) => (
              <img
                key={`${hotel.name}-gallery-${index}`}
                src={img}
                alt={hotel.name}
                onClick={() => setMainImage(img)}
                className={(mainImage || hotel.image) === img ? "active-thumb" : ""}
              />
            ))}
          </div>

          <div className="modal-info">
            <p>
              <strong>City:</strong> {hotel.city}
            </p>
            <p>
              <strong>Meal Plan:</strong> {hotel.meal}
            </p>
            <p>
              <strong>Travel Periods:</strong> {periods.length} available periods
            </p>
          </div>

          <div className="modal-prices">
            <h4>Rates & Travel Periods</h4>

            {periods.map((period, index) => (
              <div className="period-card" key={`${hotel.name}-period-${index}`}>
                <div className="period-date">
                  <span>From: {period.from}</span>
                  <span>To: {period.to}</span>
                </div>

                <div className="price-line">
                  <span>Single Room</span>
                  <b>{period.single}</b>
                </div>

                <div className="price-line">
                  <span>Double Room</span>
                  <b>{period.double}</b>
                </div>

                <div className="price-line">
                  <span>Triple Room / Note</span>
                  <b>{period.triple || "—"}</b>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="book-btn" onClick={onBook}>
            Book This Hotel
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingForm({ hotel, bookingData, setBookingData, onClose, onSubmit }) {
  return (
    <div className="booking-popup">
      <div className="booking-box">
        <button type="button" className="booking-close" onClick={onClose}>
          ×
        </button>

        <h2>Book Your Stay</h2>
        <p>
          Complete the form below and our travel team will contact you with the
          best offer.
        </p>

        <div className="booking-hotel-summary">
          <strong>{hotel.name}</strong>
          <span>{hotel.city}</span>
          <span>{hotel.meal}</span>
        </div>

        <div className="booking-form">
          <input
            type="text"
            placeholder="Full Name"
            value={bookingData.fullName}
            onChange={(e) =>
              setBookingData({ ...bookingData, fullName: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email Address"
            value={bookingData.email}
            onChange={(e) =>
              setBookingData({ ...bookingData, email: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Phone Number / WhatsApp"
            value={bookingData.phone}
            onChange={(e) =>
              setBookingData({ ...bookingData, phone: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Number of Travelers"
            value={bookingData.travelers}
            onChange={(e) =>
              setBookingData({ ...bookingData, travelers: e.target.value })
            }
          />

          <input
            type="date"
            value={bookingData.checkIn}
            onChange={(e) =>
              setBookingData({ ...bookingData, checkIn: e.target.value })
            }
          />

          <input
            type="date"
            value={bookingData.checkOut}
            onChange={(e) =>
              setBookingData({ ...bookingData, checkOut: e.target.value })
            }
          />

          <select
            value={bookingData.roomType}
            onChange={(e) =>
              setBookingData({ ...bookingData, roomType: e.target.value })
            }
          >
            <option>Single Room</option>
            <option>Double Room</option>
            <option>Triple Room</option>
            <option>Family Room</option>
            <option>Suite</option>
          </select>

          <textarea
            placeholder="Special requests or notes"
            value={bookingData.notes}
            onChange={(e) =>
              setBookingData({ ...bookingData, notes: e.target.value })
            }
          />

          <button type="button" className="submit-booking" onClick={onSubmit}>
            Send Booking Request
          </button>
        </div>
      </div>
    </div>
  );
}