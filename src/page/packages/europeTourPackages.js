const europeTourBg =
  "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1600&q=85";

export const EUROPE_TOUR_PACKAGES = [
  {
    id: "europe-tour-prague-salzburg-hallstatt-vienna-budapest-bratislava",
    forceCategory: "others",
    country: "Europe",
    destination: "Europe Tour",
    region: "others",

    name: "Europe Tour",
    backendName:
      "EUROPE TOUR - PRAGUE - SALZBURG - HALLSTATT - VIENNA - BUDAPEST - BRATISLAVA",

    route:
      "Cairo → Prague → Salzburg → Hallstatt → Vienna → Budapest → Bratislava → Cairo",

    duration: "11 Days / 10 Nights",
    transfer: "Flight + A/C Coach Transfers + City Tours",
    transferReduction: "July 23 - August 02, 2026",

    startPrice: "",
    hidePrice: true,

    image: europeTourBg,

    options: [],

    included: [
      "Flight ticket Cairo / Prague - Budapest / Cairo by Egypt Air",
      "3 nights in Prague at 4* hotel",
      "2 nights in Salzburg at 4* hotel",
      "2 nights in Vienna at 4* hotel",
      "3 nights in Budapest at 4* hotel",
      "Daily breakfast and city tax at hotels",
      "Transfers between hotels, airports and cities by A/C coach",
      "City tours in Prague, Salzburg, Vienna and Budapest",
      "Full day tour from Salzburg to Hallstatt",
      "Full day tour from Budapest to Bratislava and shopping",
      "Tour leader with the group",
    ],

    itinerary: [
      {
        day: "Day 1",
        title: "Cairo to Prague",
        details: [
          "Departure from Cairo by Egypt Air flight to Prague.",
          "Arrival Prague, meet and assist, transfer to hotel and check-in.",
          "Rest of the day free at leisure.",
          "Overnight in Prague.",
        ],
      },
      {
        day: "Day 2",
        title: "Prague City Tour",
        details: [
          "Breakfast at the hotel.",
          "Half day city tour of Prague.",
          "Discover Prague Castle area, State Opera, National Museum area and Wenceslas Square.",
          "Overnight in Prague.",
        ],
      },
      {
        day: "Day 3",
        title: "Shopping in Prague",
        details: [
          "Breakfast at the hotel.",
          "Full day shopping tour at Fashion Arena Outlet.",
          "Free time in Prague.",
          "Overnight in Prague.",
        ],
      },
      {
        day: "Day 4",
        title: "Prague to Salzburg",
        details: [
          "Breakfast at the hotel and check-out.",
          "Transfer by A/C coach from Prague to Salzburg.",
          "Arrival Salzburg and check-in.",
          "City tour of Salzburg including Mirabelle Palace, Salzburg Cathedral and Old Town.",
          "Overnight in Salzburg.",
        ],
      },
      {
        day: "Day 5",
        title: "Hallstatt Full Day Tour",
        details: [
          "Breakfast at the hotel.",
          "Full day tour to Hallstatt.",
          "Visit Hallstatt Lake, old city and Mountain Dachstein area.",
          "Return to Salzburg and overnight.",
        ],
      },
      {
        day: "Day 6",
        title: "Salzburg to Vienna",
        details: [
          "Breakfast at the hotel and check-out.",
          "Transfer by A/C coach from Salzburg to Vienna.",
          "Arrival Vienna and check-in.",
          "Rest of the day free at leisure.",
          "Overnight in Vienna.",
        ],
      },
      {
        day: "Day 7",
        title: "Vienna City Tour",
        details: [
          "Breakfast at the hotel.",
          "Half day city tour of Vienna.",
          "Visit main city highlights and Schönbrunn from outside.",
          "Free time in city centre.",
          "Overnight in Vienna.",
        ],
      },
      {
        day: "Day 8",
        title: "Vienna to Budapest",
        details: [
          "Breakfast at the hotel and check-out.",
          "Transfer by A/C coach from Vienna to Budapest.",
          "Arrival Budapest and check-in.",
          "Rest of the day free at leisure.",
          "Overnight in Budapest.",
        ],
      },
      {
        day: "Day 9",
        title: "Budapest City Tour",
        details: [
          "Breakfast at the hotel.",
          "Half day city tour of Budapest.",
          "Visit Buda, Castle District, Matthias Church, Fishermen’s Bastion and Gellért Hill.",
          "Overnight in Budapest.",
        ],
      },
      {
        day: "Day 10",
        title: "Bratislava Full Day Tour",
        details: [
          "Breakfast at the hotel.",
          "Full day tour to Bratislava.",
          "Visit Bratislava Castle and Bratislava Old Town.",
          "Free time for shopping.",
          "Overnight in Budapest.",
        ],
      },
      {
        day: "Day 11",
        title: "Departure",
        details: [
          "Breakfast at the hotel.",
          "Transfer to the airport for the flight back home.",
        ],
      },
    ],

    programme: "",
  },
];