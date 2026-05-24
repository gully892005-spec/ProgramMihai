/**
 * SmartTravel AI · app.js
 * Versiune: 2.0.0
 * Logica completă: Search, API integration, DOM manipulation, PWA, Filters
 *
 * ============================================================
 * CONFIGURARE API – toate cheile sunt deja completate
 * ============================================================
 */

const RAPIDAPI_KEY = "2c53b6cecbmshd2d367eb5471d47p1a90f8jsn50507c92fabc";

const API_CONFIG = {
  /**
   * BOOKING.COM via RapidAPI (hoteluri)
   * https://rapidapi.com/DataCrawler/api/booking-com15
   */
  BOOKING: {
    ENABLED: true,
    KEY: RAPIDAPI_KEY,
    HOST: "booking-com15.p.rapidapi.com",
    BASE_URL: "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels",
  },

  /**
   * BOOKING.COM – Car Rentals
   * https://booking-com15.p.rapidapi.com/api/v1/cars/searchCarRentals
   */
  CAR_RENTALS: {
    ENABLED: true,
    KEY: RAPIDAPI_KEY,
    HOST: "booking-com15.p.rapidapi.com",
    BASE_URL: "https://booking-com15.p.rapidapi.com/api/v1/cars/searchCarRentals",
  },

  /**
   * SKYSCANNER via RapidAPI
   * https://rapidapi.com/skyscanner-flights4/api/skyscanner-flights4
   */
  SKYSCANNER: {
    ENABLED: true,
    KEY: RAPIDAPI_KEY,
    HOST: "skyscanner-flights4.p.rapidapi.com",
    BASE_URL: "https://skyscanner-flights4.p.rapidapi.com/api/v1",
    SEAT_CLASSES_URL: "https://skyscanner-flights4.p.rapidapi.com/api/v1/meta/seat-classes",
  },

  /**
   * GOOGLE FLIGHTS via RapidAPI
   * https://rapidapi.com/google-flights2/api/google-flights2
   */
  GOOGLE_FLIGHTS: {
    ENABLED: true,
    KEY: RAPIDAPI_KEY,
    HOST: "google-flights2.p.rapidapi.com",
    BASE_URL: "https://google-flights2.p.rapidapi.com/api/v1/searchFlights",
  },

  /**
   * AIRBNB via RapidAPI
   * https://rapidapi.com/airbnb19/api/airbnb19
   */
  AIRBNB: {
    ENABLED: true,
    KEY: RAPIDAPI_KEY,
    HOST: "airbnb19.p.rapidapi.com",
    BASE_URL: "https://airbnb19.p.rapidapi.com/api/v2/searchPropertyByPlaceId",
  },

  /**
   * TRIPADVISOR via RapidAPI (restaurante)
   * https://rapidapi.com/tripadvisor16/api/tripadvisor16
   */
  TRIPADVISOR: {
    ENABLED: true,
    KEY: RAPIDAPI_KEY,
    HOST: "tripadvisor16.p.rapidapi.com",
    BASE_URL: "https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants",
  },

  /**
   * HOTELS.COM via RapidAPI
   * https://rapidapi.com/hotels4/api/hotels4
   */
  HOTELS: {
    ENABLED: true,
    KEY: RAPIDAPI_KEY,
    HOST: "hotels4.p.rapidapi.com",
    BASE_URL: "https://hotels4.p.rapidapi.com/properties/get-details",
  },

  /**
   * RYANAIR via RapidAPI (calendar disponibilitate)
   * https://rapidapi.com/ryanair2/api/ryanair2
   */
  RYANAIR: {
    ENABLED: true,
    KEY: RAPIDAPI_KEY,
    HOST: "ryanair2.p.rapidapi.com",
    BASE_URL: "https://ryanair2.p.rapidapi.com/api/v1/availabilityCalendar",
  },

  /**
   * AERODATABOX / Flight Schedules
   * https://rapidapi.com/aerodatabox/api/aerodatabox
   */
  FLIGHTS: {
    ENABLED: true,
    KEY: RAPIDAPI_KEY,
    HOST: "aerodatabox.p.rapidapi.com",
    BASE_URL: "https://aerodatabox.p.rapidapi.com/flights",
  },
};

/* ============================================================
   STAREA APLICAȚIEI
   ============================================================ */
const AppState = {
  query: "",
  filters: {
    type: "all",
    transport: "all",
    persons: 0,
    budgetMax: 5000,
    nights: 0,          // 0 = orice; altfel nr exact (10 = 10+)
    monthFrom: null,    // "2026-07-01" – prima zi a lunii selectate
    monthTo: null,      // "2026-07-31" – ultima zi a lunii selectate
  },
  results: [],
  displayedCount: 0,
  PAGE_SIZE: 9,
  sortBy: "relevance",
  viewMode: "grid",        // "grid" | "list"
  isLoading: false,
  lastQuery: null,
  wishlist: new Set(JSON.parse(localStorage.getItem("st_wishlist") || "[]")),
};

/* ============================================================
   DATE DEMO (afișate când API-urile nu sunt configurate)
   Acestea simulează răspunsul real al unui API de travel.
   ============================================================ */
const DEMO_OFFERS = [
  {
    id: "demo_1",
    title: "Hotel Baia Mare Resort & Spa",
    destination: "Mamaia, România",
    type: "litoral",
    transport: "masina",
    stars: 4,
    rating: 9.1,
    pricePerPerson: 149,
    persons: 2,
    nights: 7,
    checkIn: "2026-06-15",
    checkOut: "2026-06-22",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    imageAlt: "Piscina hotel Mamaia",
    source: "Booking.com",
    sourceLogo: "🏨",
    badge: "litoral",
    badgeLabel: "🏖️ LITORAL",
    room: "Cameră dublă cu vedere la mare",
    included: ["Mic dejun", "Piscină", "Wi-Fi"],
    offerUrl: "https://booking.com",
    description: "Sejur relaxant pe litoralul românesc. Hotel 4 stele cu piscină exterioară, SPA și acces direct la plajă.",
  },
  {
    id: "demo_2",
    title: "Fly & Stay: Santorini Dream",
    destination: "Santorini, Grecia",
    type: "litoral",
    transport: "avion",
    stars: 5,
    rating: 9.6,
    pricePerPerson: 399,
    persons: 2,
    nights: 5,
    checkIn: "2026-07-10",
    checkOut: "2026-07-15",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
    imageAlt: "Santorini apus de soare",
    source: "Skyscanner",
    sourceLogo: "✈️",
    badge: "last-minute",
    badgeLabel: "🔥 LAST MINUTE",
    room: "Suite cu vedere la caldera",
    included: ["Zbor dus-întors din București", "Transfer hotel", "Mic dejun"],
    offerUrl: "https://skyscanner.com",
    description: "Ofertă last-minute cu zbor inclus! Cazare în suita cu priveliște directă la caldera vulcanică.",
  },
  {
    id: "demo_3",
    title: "City Break: La Belle Paris",
    destination: "Paris, Franța",
    type: "city-break",
    transport: "avion",
    stars: 4,
    rating: 8.8,
    pricePerPerson: 279,
    persons: 2,
    nights: 4,
    checkIn: "2026-06-01",
    checkOut: "2026-06-05",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
    imageAlt: "Paris Eiffel Tower",
    source: "Booking.com",
    sourceLogo: "🏨",
    badge: "city-break",
    badgeLabel: "🏙️ CITY BREAK",
    room: "Cameră superioară cu balcon",
    included: ["Zbor Wien Air", "Mic dejun continental", "City card 3 zile"],
    offerUrl: "https://booking.com",
    description: "City break de 4 nopți în inima Parisului. Hotel 4 stele la 10 minute de Turnul Eiffel.",
  },
  {
    id: "demo_4",
    title: "Bulgaria All-Inclusive Express",
    destination: "Sunny Beach, Bulgaria",
    type: "litoral",
    transport: "autocar",
    stars: 4,
    rating: 8.3,
    pricePerPerson: 289,
    persons: 4,
    nights: 7,
    checkIn: "2026-08-02",
    checkOut: "2026-08-09",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    imageAlt: "Plaja Sunny Beach Bulgaria",
    source: "Christian Tour",
    sourceLogo: "🚌",
    badge: "last-minute",
    badgeLabel: "🔥 LAST MINUTE",
    room: "Cameră family (2 adulți + 2 copii)",
    included: ["Autocar dus-întors", "All-inclusive", "Animație"],
    offerUrl: "https://christiantour.ro",
    description: "Oferta perfectă pentru familii cu 4 persoane! All-inclusive complet, animație zi și noapte.",
  },
  {
    id: "demo_5",
    title: "Roma Eterna – City Break Exclusiv",
    destination: "Roma, Italia",
    type: "city-break",
    transport: "avion",
    stars: 4,
    rating: 9.0,
    pricePerPerson: 339,
    persons: 2,
    nights: 3,
    checkIn: "2026-05-30",
    checkOut: "2026-06-02",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80",
    imageAlt: "Colosseul Roma pe timp de noapte",
    source: "Aerotravel",
    sourceLogo: "✈️",
    badge: "city-break",
    badgeLabel: "🏙️ CITY BREAK",
    room: "Cameră standard superior",
    included: ["Zbor Wizz Air", "Tur ghidat Vatican", "Mic dejun"],
    offerUrl: "https://aerotravel.ro",
    description: "3 nopți în Roma cu tur ghidat inclus la Vatican și Coloseu. Zbor direct din București Otopeni.",
  },
  {
    id: "demo_6",
    title: "Antalya Riviera – Summer Deal",
    destination: "Antalya, Turcia",
    type: "litoral",
    transport: "avion",
    stars: 5,
    rating: 9.3,
    pricePerPerson: 459,
    persons: 2,
    nights: 7,
    checkIn: "2026-07-20",
    checkOut: "2026-07-27",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
    imageAlt: "Resort Antalya Turcia",
    source: "Booking.com",
    sourceLogo: "🏨",
    badge: "litoral",
    badgeLabel: "🏖️ SEJUR",
    room: "Cameră deluxe cu vedere la mare",
    included: ["Zbor charter", "All-inclusive Ultra", "SPA acces"],
    offerUrl: "https://booking.com",
    description: "Resort de 5 stele pe Riviera turcă. All-inclusive ultra cu 8 restaurante și acces nelimitat SPA.",
  },
  {
    id: "demo_7",
    title: "Weekend Magic în Praga",
    destination: "Praga, Cehia",
    type: "city-break",
    transport: "avion",
    stars: 3,
    rating: 8.5,
    pricePerPerson: 189,
    persons: 2,
    nights: 3,
    checkIn: "2026-06-06",
    checkOut: "2026-06-09",
    image: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80",
    imageAlt: "Centrul vechi al Pragăi",
    source: "Skyscanner",
    sourceLogo: "✈️",
    badge: "city-break",
    badgeLabel: "🏙️ CITY BREAK",
    room: "Cameră standard",
    included: ["Zbor Ryanair", "Mic dejun"],
    offerUrl: "https://skyscanner.com",
    description: "Weekend romantic în Praga, în centrul istoric. Hotel 3 stele la 5 minute de Piața Veche.",
  },
  {
    id: "demo_8",
    title: "Corfu Island Escape",
    destination: "Corfu, Grecia",
    type: "litoral",
    transport: "avion",
    stars: 4,
    rating: 8.9,
    pricePerPerson: 319,
    persons: 3,
    nights: 7,
    checkIn: "2026-08-15",
    checkOut: "2026-08-22",
    image: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80",
    imageAlt: "Plaja din Corfu Grecia",
    source: "eTurism",
    sourceLogo: "🌊",
    badge: "litoral",
    badgeLabel: "🏖️ LITORAL",
    room: "Junior suite cu terasă",
    included: ["Zbor charter", "Demipensiune", "Transfer"],
    offerUrl: "https://eturism.ro",
    description: "Săptămână de vis pe insula Corfu. Hotel 4 stele cu plajă privată și mâncare tradițională grecească.",
  },
  {
    id: "demo_9",
    title: "Ski Poiana Brașov – Revelion 2027",
    destination: "Poiana Brașov, România",
    type: "ski",
    transport: "masina",
    stars: 4,
    rating: 8.7,
    pricePerPerson: 249,
    persons: 2,
    nights: 5,
    checkIn: "2026-12-28",
    checkOut: "2027-01-02",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&q=80",
    imageAlt: "Pârtie de ski Poiana Brasov iarna",
    source: "Booking.com",
    sourceLogo: "🏔️",
    badge: "last-minute",
    badgeLabel: "🔥 LAST MINUTE",
    room: "Cameră twin cu vedere la pârtie",
    included: ["Mic dejun", "Ski pass 3 zile", "Petrecere Revelion"],
    offerUrl: "https://booking.com",
    description: "Revelion la munte în Poiana Brașov! Ski pass inclus 3 zile + petrecere de Revelion în hotel.",
  },
  {
    id: "demo_10",
    title: "Marrakech Discovery Tour",
    destination: "Marrakech, Maroc",
    type: "city-break",
    transport: "avion",
    stars: 4,
    rating: 9.2,
    pricePerPerson: 349,
    persons: 2,
    nights: 4,
    checkIn: "2026-10-15",
    checkOut: "2026-10-19",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80",
    imageAlt: "Piata Djemaa el-Fna Marrakech",
    source: "Skyscanner",
    sourceLogo: "✈️",
    badge: "city-break",
    badgeLabel: "✨ EXOTIC",
    room: "Riad tradițional",
    included: ["Zbor direct", "Tur medina", "Cina tradițională"],
    offerUrl: "https://skyscanner.com",
    description: "Explorează magia Marrakech-ului! Cazare în riad tradițional în Medina, cu tur ghidat inclus.",
  },
  {
    id: "demo_11",
    title: "Zakynthos Blue Caves Resort",
    destination: "Zakynthos, Grecia",
    type: "litoral",
    transport: "avion",
    stars: 5,
    rating: 9.4,
    pricePerPerson: 489,
    persons: 2,
    nights: 7,
    checkIn: "2026-07-01",
    checkOut: "2026-07-08",
    image: "https://images.unsplash.com/photo-1601936130697-fb4e9e23fd3b?w=600&q=80",
    imageAlt: "Plaja Navagio Zakynthos",
    source: "Booking.com",
    sourceLogo: "🏨",
    badge: "litoral",
    badgeLabel: "⭐ TOP RATED",
    room: "Pool villa cu piscină privată",
    included: ["Zbor direct", "Mic dejun", "Excursie la Navagio Beach"],
    offerUrl: "https://booking.com",
    description: "Cea mai votată destinație 2026! Villa cu piscină privată și excursie la faimoasa plajă Navagio.",
  },
  {
    id: "demo_12",
    title: "Barcelona Gaudí Weekend",
    destination: "Barcelona, Spania",
    type: "city-break",
    transport: "avion",
    stars: 4,
    rating: 8.8,
    pricePerPerson: 299,
    persons: 2,
    nights: 4,
    checkIn: "2026-09-10",
    checkOut: "2026-09-14",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    imageAlt: "Sagrada Familia Barcelona",
    source: "eTurism",
    sourceLogo: "🏛️",
    badge: "city-break",
    badgeLabel: "🏙️ CITY BREAK",
    room: "Cameră superioară",
    included: ["Zbor Vueling", "City card 3 zile", "Tur Sagrada Familia"],
    offerUrl: "https://eturism.ro",
    description: "4 nopți în Barcelona cu tur la Sagrada Família și Casa Batlló inclus. Hotel 4 stele în Eixample.",
  },
];

/* ============================================================
   UTILITĂȚI GLOBALE
   ============================================================ */

/**
 * Afișează un mesaj toast temporar.
 * @param {string} message - Textul mesajului
 * @param {"success"|"error"|"info"} type - Tipul toast-ului
 * @param {number} duration - Durata în ms
 */
function showToast(message, type = "info", duration = 3500) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast toast--${type} show`;
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

/**
 * Formatează prețul în Euro cu separator de mii.
 * @param {number} price
 * @returns {string}
 */
function formatPrice(price) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Generează ratingul ca stele Unicode.
 * @param {number} stars - 1-5
 * @returns {string}
 */
function renderStars(stars) {
  const full = "★".repeat(Math.floor(stars));
  const empty = "☆".repeat(5 - Math.floor(stars));
  return full + empty;
}

/**
 * Debounce – întârzie execuția funcției.
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Sanitizează HTML pentru a preveni XSS.
 * @param {string} str
 * @returns {string}
 */
function sanitize(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ============================================================
   PARSER LIMBAJ NATURAL
   Extrage intenții și filtre din textul scris de utilizator.
   ============================================================ */

/**
 * Analizează query-ul în limbaj natural și returnează filtre detectate.
 * @param {string} query
 * @returns {{ type: string, transport: string, persons: number, destination: string, budget: number }}
 */
function parseNaturalLanguage(query) {
  const q = query.toLowerCase();
  const result = {
    type: "all",
    transport: "all",
    persons: 0,
    destination: "",
    budget: 5000,
  };

  // Detectare tip vacanță
  if (/last.?minut|urgent|dispon|imediat/i.test(q)) result.type = "last-minute";
  else if (/city.?break|weekend|scurt[aă]|câteva zile/i.test(q)) result.type = "city-break";
  else if (/litoral|plaj[aă]|mare|coast[aă]|beach|sejur/i.test(q)) result.type = "litoral";
  else if (/ski|schi|munte|z[aă]pad[aă]|iarn[aă]/i.test(q)) result.type = "ski";

  // Detectare transport
  if (/cu avion|zbor|fly|flight|aerian/i.test(q)) result.transport = "avion";
  else if (/mașin[aă]|auto(?:turism)?|fără avion|f[aă]r[aă] zbor/i.test(q)) result.transport = "masina";
  else if (/autocar|autobuz|coach/i.test(q)) result.transport = "autocar";

  // Detectare număr persoane
  const persMatch = q.match(/(\d+)\s*pers(?:oane|oană)?/i)
    || q.match(/pentru\s+(\d+)/i)
    || q.match(/(\d+)\s+adult/i);
  if (persMatch) {
    const n = parseInt(persMatch[1], 10);
    result.persons = n >= 4 ? 4 : n;
  }

  // Detectare buget
  const budgetMatch = q.match(/(?:buget|maxim|p[aâ]n[aă] la|sub)\s*(\d+)/i)
    || q.match(/(\d+)\s*(?:euro|eur|€)/i);
  if (budgetMatch) result.budget = parseInt(budgetMatch[1], 10);

  // Detectare destinație principală
  const destinations = [
    "paris", "roma", "roma", "barcelona", "madrid", "amsterdam",
    "praga", "viena", "londra", "berlin", "atena", "istanbul",
    "santorini", "mykonos", "corfu", "zakynthos", "creta",
    "antalya", "bodrum", "istanbul", "dubai", "marrakech",
    "mamaia", "constanța", "eforie", "neptun", "jupiter",
    "bulgaria", "sunny beach", "nisipurile de aur",
    "italia", "grecia", "spania", "franța", "turcia",
    "portugalia", "croatia", "muntenegru",
    "poiana brasov", "sinaia", "busteni",
  ];
  for (const dest of destinations) {
    if (q.includes(dest)) {
      result.destination = dest;
      break;
    }
  }

  return result;
}

/* ============================================================
   FUNCȚII API – BOOKING.COM via RapidAPI
   ============================================================ */

/**
 * Caută hoteluri pe Booking.com via RapidAPI.
 * @param {Object} params - Parametrii de căutare
 * @returns {Promise<Array>}
 */
async function fetchBookingHotels(params) {
  if (!API_CONFIG.BOOKING.ENABLED) return [];

  const { destination, checkIn, checkOut, adults, nights } = params;

  // ── PASUL 1: Obține dest_id ──
  const destUrl = new URL("https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination");
  destUrl.searchParams.set("query", destination);

  const destResponse = await fetch(destUrl.toString(), {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": API_CONFIG.BOOKING.KEY,
      "X-RapidAPI-Host": API_CONFIG.BOOKING.HOST,
    },
  });

  if (!destResponse.ok) {
    throw new Error(`Booking dest error: ${destResponse.status}`);
  }

  const destData = await destResponse.json();
  const destId = destData?.data?.[0]?.dest_id;
  const searchType = destData?.data?.[0]?.search_type || "city";

  if (!destId) return [];

  // ── PASUL 2: Caută hoteluri ──
  const searchUrl = new URL(API_CONFIG.BOOKING.BASE_URL);
  searchUrl.searchParams.set("dest_id", destId);
  searchUrl.searchParams.set("search_type", searchType);
  searchUrl.searchParams.set("arrival_date", checkIn);
  searchUrl.searchParams.set("departure_date", checkOut);
  searchUrl.searchParams.set("adults", String(adults));
  searchUrl.searchParams.set("room_qty", "1");
  searchUrl.searchParams.set("languagecode", "ro");
  searchUrl.searchParams.set("currency_code", "EUR");
  searchUrl.searchParams.set("sort_by", "popularity");

  const searchResponse = await fetch(searchUrl.toString(), {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": API_CONFIG.BOOKING.KEY,
      "X-RapidAPI-Host": API_CONFIG.BOOKING.HOST,
    },
  });

  if (!searchResponse.ok) {
    throw new Error(`Booking search error: ${searchResponse.status}`);
  }

  const searchData = await searchResponse.json();
  const hotels = searchData?.data?.hotels || [];

  // ── Transformă datele Booking.com în formatul intern SmartTravel ──
  return hotels.slice(0, 12).map((hotel) => {
    const priceRaw = hotel?.property?.priceBreakdown?.grossPrice?.value || 0;
    const pricePerPerson = Math.round(priceRaw / Math.max(adults, 1));

    return {
      id: `booking_${hotel.hotel_id}`,
      title: sanitize(hotel?.property?.name || "Hotel"),
      destination: sanitize(destination),
      type: "litoral",
      transport: "avion",
      stars: hotel?.property?.propertyClass || 3,
      rating: parseFloat(hotel?.property?.reviewScore || "7.0"),
      pricePerPerson,
      persons: adults,
      nights,
      checkIn,
      checkOut,
      image: hotel?.property?.photoUrls?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
      imageAlt: hotel?.property?.name || "Hotel",
      source: "Booking.com",
      sourceLogo: "🏨",
      badge: pricePerPerson < 150 ? "last-minute" : "litoral",
      badgeLabel: pricePerPerson < 150 ? "🔥 LAST MINUTE" : "🏨 BOOKING",
      room: hotel?.property?.wishlistName || "Cameră standard",
      included: ["Wi-Fi gratuit"],
      offerUrl: `https://booking.com/hotel/${hotel.hotel_id}`,
      description: `Hotel ${hotel?.property?.propertyClass || 3} stele în ${destination}. Rating: ${hotel?.property?.reviewScore || "N/A"}/10.`,
    };
  });
}

/* ============================================================
   FUNCȚII API – SKYSCANNER via RapidAPI
   ============================================================ */

/**
 * Caută zboruri pe Skyscanner via RapidAPI.
 * @param {Object} params
 * @returns {Promise<Array>}
 */
async function fetchSkyscannerFlights(params) {
  if (!API_CONFIG.SKYSCANNER.ENABLED) return [];

  const { origin, destination, departureDate, adults } = params;

  const url = new URL(API_CONFIG.SKYSCANNER.BASE_URL);
  url.searchParams.set("fromEntityId", origin || "BUCH");      // Cod IATA origine
  url.searchParams.set("toEntityId", destination || "anywhere");
  url.searchParams.set("departDate", departureDate);
  url.searchParams.set("adults", String(adults));
  url.searchParams.set("currency", "EUR");
  url.searchParams.set("locale", "ro-RO");
  url.searchParams.set("market", "RO");
  url.searchParams.set("cabinClass", "economy");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": API_CONFIG.SKYSCANNER.KEY,
      "X-RapidAPI-Host": API_CONFIG.SKYSCANNER.HOST,
    },
  });

  if (!response.ok) {
    throw new Error(`Skyscanner error: ${response.status}`);
  }

  const data = await response.json();
  const itineraries = data?.data?.itineraries || [];

  // ── Transformă în format intern ──
  return itineraries.slice(0, 6).map((item, idx) => {
    const price = item?.price?.raw || 0;
    const legs = item?.legs || [];
    const firstLeg = legs[0] || {};

    return {
      id: `sky_${idx}_${Date.now()}`,
      title: `Zbor ${firstLeg?.origin?.city || origin} → ${firstLeg?.destination?.city || destination}`,
      destination: sanitize(firstLeg?.destination?.city || destination),
      type: "city-break",
      transport: "avion",
      stars: 0,
      rating: 0,
      pricePerPerson: Math.round(price),
      persons: adults,
      nights: 0,
      checkIn: departureDate,
      checkOut: departureDate,
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
      imageAlt: "Avion pe pistă",
      source: "Skyscanner",
      sourceLogo: "✈️",
      badge: "city-break",
      badgeLabel: "✈️ ZBOR",
      room: `Clasa economy · ${firstLeg?.durationInMinutes ? Math.round(firstLeg.durationInMinutes / 60) + "h" : "Direct"}`,
      included: ["Bagaj de mână"],
      offerUrl: item?.deeplink || "https://skyscanner.com",
      description: `Zbor direct din ${firstLeg?.origin?.city || "București"} spre ${firstLeg?.destination?.city || destination}. Durată: ${firstLeg?.durationInMinutes ? Math.round(firstLeg.durationInMinutes / 60) + "h " + (firstLeg.durationInMinutes % 60) + "min" : "N/A"}.`,
    };
  });
}

/* ============================================================
   FUNCȚIA PRINCIPALĂ DE CĂUTARE
   Combină API-urile reale (dacă sunt active) cu datele demo.
   ============================================================ */

/**
 * Caută oferte pe baza query-ului și filtrelor active.
 * @param {string} query - Textul căutării
 * @returns {Promise<void>}
 */
async function searchOffers(query) {
  if (AppState.isLoading) return;
  AppState.isLoading = true;
  AppState.lastQuery = query;

  setLoadingState(true);
  hideAllStates();

  try {
    const parsed = parseNaturalLanguage(query);

    // Actualizează filtrele din parsarea automată (dacă utilizatorul nu le-a setat manual)
    if (AppState.filters.type === "all" && parsed.type !== "all") {
      AppState.filters.type = parsed.type;
      syncFilterUI();
    }
    if (AppState.filters.transport === "all" && parsed.transport !== "all") {
      AppState.filters.transport = parsed.transport;
      syncFilterUI();
    }
    if (AppState.filters.persons === 0 && parsed.persons > 0) {
      AppState.filters.persons = parsed.persons;
      syncFilterUI();
    }

    let results = [];

    // ── APELURI API REALE (dacă sunt configurate) ──
    const apiCalls = [];

    if (API_CONFIG.BOOKING.ENABLED) {
      const today = new Date();
      const checkIn = today.toISOString().split("T")[0];
      const checkOut = new Date(today.getTime() + 7 * 86400000).toISOString().split("T")[0];

      apiCalls.push(
        fetchBookingHotels({
          destination: parsed.destination || query,
          checkIn,
          checkOut,
          adults: parsed.persons || 2,
          nights: 7,
        }).catch((err) => {
          console.warn("Booking API error:", err);
          return [];
        })
      );
    }

    if (API_CONFIG.SKYSCANNER.ENABLED) {
      const today = new Date();
      const depart = new Date(today.getTime() + 14 * 86400000).toISOString().split("T")[0];

      apiCalls.push(
        fetchSkyscannerFlights({
          origin: "BUCH",
          destination: parsed.destination || "anywhere",
          departureDate: depart,
          adults: parsed.persons || 2,
        }).catch((err) => {
          console.warn("Skyscanner API error:", err);
          return [];
        })
      );
    }

    if (apiCalls.length > 0) {
      const apiResults = await Promise.all(apiCalls);
      results = apiResults.flat();
    }

    // ── FALLBACK LA DATE DEMO dacă API-urile nu returnează date ──
    if (results.length === 0) {
      results = [...DEMO_OFFERS];
    }

    // ── APLICARE FILTRE ──
    results = applyFilters(results);

    // ── SCORING & SORTARE RELEVANTĂ ──
    results = scoreAndSort(results, query, parsed);

    AppState.results = results;
    AppState.displayedCount = 0;

    if (results.length === 0) {
      showEmptyState();
    } else {
      renderResults(true);
    }

  } catch (error) {
    console.error("Search error:", error);
    showErrorState(
      "Eroare la căutare",
      error.message || "A apărut o problemă. Te rog încearcă din nou."
    );
  } finally {
    AppState.isLoading = false;
    setLoadingState(false);
  }
}

/* ============================================================
   FILTRARE & SCORING
   ============================================================ */

/**
 * Aplică filtrele active (tip, transport, persoane, buget, perioadă).
 * @param {Array} offers
 * @returns {Array}
 */
function applyFilters(offers) {
  return offers.filter((offer) => {
    // Filtru tip
    if (AppState.filters.type !== "all" && offer.type !== AppState.filters.type) return false;

    // Filtru transport
    if (AppState.filters.transport !== "all" && offer.transport !== AppState.filters.transport) return false;

    // Filtru persoane
    if (AppState.filters.persons > 0) {
      const reqPersons = AppState.filters.persons;
      if (reqPersons === 4) {
        if (offer.persons < 4) return false;
      } else {
        if (offer.persons !== reqPersons) return false;
      }
    }

    // Filtru buget
    if (AppState.filters.budgetMax < 5000 && offer.pricePerPerson > AppState.filters.budgetMax) return false;

    // Filtru nopți / durata sejurului
    if (AppState.filters.nights > 0) {
      const offerNights = offer.nights || 0;
      if (AppState.filters.nights === 10) {
        // 10+ nopți
        if (offerNights < 10) return false;
      } else if (AppState.filters.nights === 14) {
        // 2 săptămâni = 14+
        if (offerNights < 14) return false;
      } else {
        // Toleranță ±1 noapte pentru potrivire flexibilă
        if (Math.abs(offerNights - AppState.filters.nights) > 1) return false;
      }
    }

    // Filtru lună selectată din panoul Flexibil
    if (AppState.filters.monthFrom && AppState.filters.monthTo) {
      if (offer.checkIn) {
        const checkIn = new Date(offer.checkIn);
        const from = new Date(AppState.filters.monthFrom);
        const to   = new Date(AppState.filters.monthTo);
        if (checkIn < from || checkIn > to) return false;
      }
      // dacă oferta nu are checkIn, o lăsăm să treacă
    }

    // Filtru perioadă (Date Picker interval exact)
    const { from, to } = getActiveDateRange();
    if (from || to) {
      if (!offer.checkIn) return true; // dacă oferta nu are dată, o lăsăm
      const checkIn = new Date(offer.checkIn);
      if (from && checkIn < from) return false;
      if (to && checkIn > to) return false;
    }

    return true;
  });
}

/**
 * Calculează un scor de relevanță și sortează ofertele.
 * @param {Array} offers
 * @param {string} query
 * @param {Object} parsed
 * @returns {Array}
 */
function scoreAndSort(offers, query, parsed) {
  const q = query.toLowerCase();
  const sort = AppState.sortBy;

  if (sort === "price-asc") {
    return [...offers].sort((a, b) => a.pricePerPerson - b.pricePerPerson);
  }
  if (sort === "price-desc") {
    return [...offers].sort((a, b) => b.pricePerPerson - a.pricePerPerson);
  }
  if (sort === "rating") {
    return [...offers].sort((a, b) => b.rating - a.rating);
  }

  // Sortare implicită: relevanță (scoring)
  const scored = offers.map((offer) => {
    let score = 0;

    // Scor destinație
    if (parsed.destination && offer.destination.toLowerCase().includes(parsed.destination)) {
      score += 50;
    }

    // Scor tip
    if (parsed.type !== "all" && offer.type === parsed.type) score += 30;

    // Scor transport
    if (parsed.transport !== "all" && offer.transport === parsed.transport) score += 20;

    // Scor persoane
    if (parsed.persons > 0 && offer.persons === parsed.persons) score += 15;

    // Scor rating
    score += offer.rating * 3;

    // Bonus pentru last-minute dacă s-a menționat
    if (/last.?minut|urgent/i.test(q) && offer.badge === "last-minute") score += 25;

    // Scor keyword general
    const keywords = q.split(/\s+/).filter((w) => w.length > 3);
    for (const kw of keywords) {
      if (offer.title.toLowerCase().includes(kw)) score += 5;
      if (offer.destination.toLowerCase().includes(kw)) score += 10;
      if (offer.description.toLowerCase().includes(kw)) score += 3;
    }

    return { ...offer, _score: score };
  });

  return scored.sort((a, b) => b._score - a._score);
}

/* ============================================================
   RENDERING
   ============================================================ */

/**
 * Randează carduri de ofertă în grila de rezultate.
 * @param {boolean} reset - Dacă true, șterge rezultatele anterioare
 */
function renderResults(reset = false) {
  const grid = document.getElementById("results-grid");
  const resultsSection = document.getElementById("results-section");
  const metaEl = document.getElementById("results-meta");
  const loadMoreWrap = document.getElementById("load-more-wrap");

  if (reset) {
    grid.innerHTML = "";
    AppState.displayedCount = 0;
  }

  const start = AppState.displayedCount;
  const end = Math.min(start + AppState.PAGE_SIZE, AppState.results.length);
  const toRender = AppState.results.slice(start, end);

  toRender.forEach((offer, idx) => {
    const card = createOfferCard(offer, start + idx);
    grid.appendChild(card);
  });

  AppState.displayedCount = end;

  // Actualizează meta
  metaEl.textContent = `${AppState.results.length} ofert${AppState.results.length === 1 ? "ă" : "e"} găsit${AppState.results.length === 1 ? "ă" : "e"} · Afișate: ${AppState.displayedCount}`;

  // Afișează sau ascunde "Încarcă mai multe"
  if (AppState.displayedCount >= AppState.results.length) {
    loadMoreWrap.classList.add("hidden");
  } else {
    loadMoreWrap.classList.remove("hidden");
  }

  // Afișează secțiunea de rezultate
  resultsSection.classList.remove("hidden");
  grid.className = `results-grid ${AppState.viewMode === "list" ? "list-view" : ""}`;

  // Scroll la rezultate la primul load
  if (reset) {
    setTimeout(() => {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
}

/**
 * Creează elementul DOM pentru un card de ofertă.
 * @param {Object} offer
 * @param {number} index - Indexul pentru animație staggerată
 * @returns {HTMLElement}
 */
function createOfferCard(offer, index) {
  const totalPrice = offer.pricePerPerson * offer.persons;
  const isWishlisted = AppState.wishlist.has(offer.id);

  const card = document.createElement("article");
  card.className = "offer-card";
  card.setAttribute("role", "listitem");
  card.style.animationDelay = `${(index % AppState.PAGE_SIZE) * 50}ms`;
  card.dataset.offerId = offer.id;

  card.innerHTML = `
    <div class="offer-card__img-wrap">
      <img
        src="${sanitize(offer.image)}"
        alt="${sanitize(offer.imageAlt)}"
        class="offer-card__img"
        loading="lazy"
        onerror="this.src='https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80'"
      />
      <div class="offer-card__badges">
        <span class="badge badge--${sanitize(offer.badge)}">${sanitize(offer.badgeLabel)}</span>
        <span class="badge badge--source">${sanitize(offer.sourceLogo)} ${sanitize(offer.source)}</span>
      </div>
      <button
        class="offer-card__wishlist ${isWishlisted ? "active" : ""}"
        data-offer-id="${sanitize(offer.id)}"
        aria-label="${isWishlisted ? "Elimină din favorite" : "Adaugă la favorite"}"
        aria-pressed="${isWishlisted}"
      >${isWishlisted ? "♥" : "♡"}</button>
    </div>
    <div class="offer-card__body">
      <div class="offer-card__source-row">
        <span class="offer-card__source-name">📍 ${sanitize(offer.destination)}</span>
        ${offer.stars > 0 ? `<span class="offer-card__stars" aria-label="${offer.stars} stele">${renderStars(offer.stars)}</span>` : ""}
      </div>
      <h3 class="offer-card__title">${sanitize(offer.title)}</h3>
      <div class="offer-card__details">
        <span class="offer-card__detail-tag">🌙 ${offer.nights > 0 ? offer.nights + " nopți" : "Zbor dus-întors"}</span>
        <span class="offer-card__detail-tag">${offer.transport === "avion" ? "✈️" : offer.transport === "autocar" ? "🚌" : "🚗"} ${offer.transport === "avion" ? "Cu avion" : offer.transport === "autocar" ? "Autocar" : "Cu mașina"}</span>
        <span class="offer-card__detail-tag">👤 ${offer.persons} ${offer.persons === 1 ? "persoană" : "persoane"}</span>
        ${offer.rating > 0 ? `<span class="offer-card__detail-tag">⭐ ${offer.rating}/10</span>` : ""}
      </div>
      ${offer.included && offer.included.length > 0 ? `
        <div class="offer-card__details">
          ${offer.included.slice(0, 3).map((item) => `<span class="offer-card__detail-tag">✓ ${sanitize(item)}</span>`).join("")}
        </div>
      ` : ""}
      <div class="offer-card__footer">
        <div class="offer-card__price-block">
          <span class="offer-card__price-label">Preț / persoană</span>
          <span class="offer-card__price">${formatPrice(offer.pricePerPerson)}</span>
          ${offer.persons > 1 ? `<span class="offer-card__price-total">Total ${offer.persons} pers: ${formatPrice(totalPrice)}</span>` : ""}
        </div>
        <a
          href="${sanitize(offer.offerUrl)}"
          class="offer-card__cta"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Vezi oferta pentru ${sanitize(offer.title)}"
          onclick="trackOfferClick('${sanitize(offer.id)}', '${sanitize(offer.source)}')"
        >
          Vezi Oferta ↗
        </a>
      </div>
    </div>
  `;

  // Click pe card → deschide modal
  card.addEventListener("click", (e) => {
    if (e.target.closest(".offer-card__wishlist") || e.target.closest(".offer-card__cta")) return;
    openOfferModal(offer);
  });

  // Click pe wishlist
  const wishBtn = card.querySelector(".offer-card__wishlist");
  wishBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleWishlist(offer.id, wishBtn);
  });

  return card;
}

/* ============================================================
   WISHLIST
   ============================================================ */

/**
 * Adaugă / elimină o ofertă din wishlist.
 * @param {string} offerId
 * @param {HTMLElement} btn
 */
function toggleWishlist(offerId, btn) {
  if (AppState.wishlist.has(offerId)) {
    AppState.wishlist.delete(offerId);
    btn.textContent = "♡";
    btn.classList.remove("active");
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", "Adaugă la favorite");
    showToast("Eliminat din favorite", "info");
  } else {
    AppState.wishlist.add(offerId);
    btn.textContent = "♥";
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    btn.setAttribute("aria-label", "Elimină din favorite");
    showToast("Adăugat la favorite ♥", "success");
  }

  // Persistă în localStorage
  localStorage.setItem("st_wishlist", JSON.stringify([...AppState.wishlist]));
}

/* ============================================================
   MODAL DETALII OFERTĂ
   ============================================================ */

/**
 * Deschide modalul cu detaliile complete ale ofertei.
 * @param {Object} offer
 */
function openOfferModal(offer) {
  const overlay = document.getElementById("modal-overlay");
  const content = document.getElementById("modal-content");
  const totalPrice = offer.pricePerPerson * offer.persons;

  content.innerHTML = `
    <img src="${sanitize(offer.image)}" alt="${sanitize(offer.imageAlt)}" onerror="this.src='https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80'" />
    <div class="offer-card__badges" style="margin-bottom: 12px;">
      <span class="badge badge--${sanitize(offer.badge)}">${sanitize(offer.badgeLabel)}</span>
    </div>
    <h2 class="modal__title" id="modal-title">${sanitize(offer.title)}</h2>
    <p style="color: var(--color-text-muted); font-size: var(--text-sm); margin-bottom: 8px;">📍 ${sanitize(offer.destination)} · ${sanitize(offer.sourceLogo)} ${sanitize(offer.source)}</p>
    <p class="modal__desc">${sanitize(offer.description)}</p>

    <div class="modal__details-grid">
      ${offer.nights > 0 ? `<div class="modal__detail-item"><label>Durata sejurului</label><strong>${offer.nights} nopți</strong></div>` : ""}
      ${offer.checkIn ? `<div class="modal__detail-item"><label>Check-in</label><strong>${offer.checkIn}</strong></div>` : ""}
      ${offer.checkOut ? `<div class="modal__detail-item"><label>Check-out</label><strong>${offer.checkOut}</strong></div>` : ""}
      <div class="modal__detail-item"><label>Persoane</label><strong>${offer.persons} ${offer.persons === 1 ? "persoană" : "persoane"}</strong></div>
      <div class="modal__detail-item"><label>Transport</label><strong>${offer.transport === "avion" ? "✈️ Avion" : offer.transport === "autocar" ? "🚌 Autocar" : "🚗 Mașina proprie"}</strong></div>
      ${offer.room ? `<div class="modal__detail-item"><label>Tip cameră</label><strong>${sanitize(offer.room)}</strong></div>` : ""}
      ${offer.rating > 0 ? `<div class="modal__detail-item"><label>Rating</label><strong>⭐ ${offer.rating}/10</strong></div>` : ""}
      ${offer.stars > 0 ? `<div class="modal__detail-item"><label>Clasificare hotel</label><strong>${renderStars(offer.stars)} (${offer.stars}★)</strong></div>` : ""}
    </div>

    ${offer.included && offer.included.length > 0 ? `
      <div style="margin-bottom: 20px;">
        <p style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-muted); margin-bottom: 8px;">INCLUS ÎN PACHET</p>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${offer.included.map((item) => `<span class="offer-card__detail-tag" style="color: var(--color-success);">✓ ${sanitize(item)}</span>`).join("")}
        </div>
      </div>
    ` : ""}

    <div class="modal__cta-row">
      <div class="modal__price-block">
        <span class="label">Preț per persoană</span>
        <div class="price">${formatPrice(offer.pricePerPerson)}</div>
        ${offer.persons > 1 ? `<span style="font-size: var(--text-xs); color: var(--color-text-muted);">Total: ${formatPrice(totalPrice)} pentru ${offer.persons} persoane</span>` : ""}
      </div>
      <a
        href="${sanitize(offer.offerUrl)}"
        class="btn btn--hero"
        target="_blank"
        rel="noopener noreferrer"
        style="font-size: var(--text-sm);"
        onclick="trackOfferClick('${sanitize(offer.id)}', '${sanitize(offer.source)}')"
      >
        Rezervă acum ↗
      </a>
    </div>
  `;

  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // Accesibilitate: focus pe modal
  const modalCloseBtn = document.getElementById("modal-close");
  setTimeout(() => modalCloseBtn.focus(), 100);
}

/**
 * Închide modalul.
 */
function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
}

/* ============================================================
   TRACKING (analytics placeholder)
   ============================================================ */

/**
 * Tracking click pe ofertă (placeholder pentru Google Analytics / custom analytics).
 * @param {string} offerId
 * @param {string} source
 */
function trackOfferClick(offerId, source) {
  // Înlocuiește cu apelul real de analytics
  // Ex: gtag('event', 'offer_click', { offer_id: offerId, source });
  console.info("[SmartTravel Analytics] Offer click:", { offerId, source, timestamp: new Date().toISOString() });
}

/* ============================================================
   STĂRI VIZUALE
   ============================================================ */

function setLoadingState(loading) {
  const btn = document.getElementById("search-btn");
  const btnText = btn.querySelector(".btn__text");
  const btnSpinner = btn.querySelector(".btn__spinner");
  const skeleton = document.getElementById("skeleton-loader");

  if (loading) {
    btnText.classList.add("hidden");
    btnSpinner.classList.remove("hidden");
    btn.disabled = true;
    skeleton.classList.remove("hidden");
    document.getElementById("results-section").classList.add("hidden");
  } else {
    btnText.classList.remove("hidden");
    btnSpinner.classList.add("hidden");
    btn.disabled = false;
    skeleton.classList.add("hidden");
  }
}

function hideAllStates() {
  document.getElementById("results-section").classList.add("hidden");
  document.getElementById("empty-state").classList.add("hidden");
  document.getElementById("error-state").classList.add("hidden");
  document.getElementById("skeleton-loader").classList.add("hidden");
}

function showEmptyState() {
  document.getElementById("empty-state").classList.remove("hidden");
  document.getElementById("empty-state").scrollIntoView({ behavior: "smooth", block: "start" });
}

function showErrorState(title, message) {
  document.getElementById("error-title").textContent = title;
  document.getElementById("error-message").textContent = message;
  document.getElementById("error-state").classList.remove("hidden");
}

function syncFilterUI() {
  // Re-sincronizează UI-ul filtrelor cu AppState
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    const filter = chip.dataset.filter;
    const value = chip.dataset.value;

    if (!filter) return;

    const activeValue = AppState.filters[filter] !== undefined
      ? String(AppState.filters[filter])
      : "all";

    const isActive = value === activeValue;
    chip.classList.toggle("filter-chip--active", isActive);
    chip.setAttribute("aria-checked", String(isActive));
  });
}

/* ============================================================
   INIȚIALIZARE EVENT LISTENERS
   ============================================================ */

function initEventListeners() {
  const searchInput = document.getElementById("natural-search");
  const searchBtn = document.getElementById("search-btn");
  const clearBtn = document.getElementById("clear-search");
  const budgetSlider = document.getElementById("budget-slider");
  const sortSelect = document.getElementById("sort-select");
  const loadMoreBtn = document.getElementById("load-more-btn");
  const gridViewBtn = document.getElementById("grid-view-btn");
  const listViewBtn = document.getElementById("list-view-btn");

  // ── SEARCH INPUT ──
  searchInput.addEventListener("input", debounce((e) => {
    const val = e.target.value.trim();
    clearBtn.classList.toggle("hidden", val.length === 0);
  }, 100));

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = searchInput.value.trim();
      if (q) searchOffers(q);
    }
  });

  // ── SEARCH BUTTON ──
  searchBtn.addEventListener("click", () => {
    const q = searchInput.value.trim();
    if (q) {
      AppState.query = q;
      searchOffers(q);
    } else {
      showToast("Scrie ceva în bara de căutare 😊", "info");
      searchInput.focus();
    }
  });

  // ── CLEAR BUTTON ──
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearBtn.classList.add("hidden");
    searchInput.focus();
  });

  // ── SUGGESTION CHIPS ──
  document.querySelectorAll(".suggestion-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const query = chip.dataset.query;
      searchInput.value = query;
      clearBtn.classList.remove("hidden");
      AppState.query = query;
      searchOffers(query);
    });
  });

  // ── FILTER CHIPS ──
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;
      const value = chip.dataset.value;

      if (!filter) return;

      // Actualizează AppState
      if (filter === "persons") {
        AppState.filters.persons = parseInt(value, 10);
      } else {
        AppState.filters[filter] = value;
      }

      // Actualizează UI
      document.querySelectorAll(`.filter-chip[data-filter="${filter}"]`).forEach((c) => {
        c.classList.remove("filter-chip--active");
        c.setAttribute("aria-checked", "false");
      });
      chip.classList.add("filter-chip--active");
      chip.setAttribute("aria-checked", "true");

      // Re-caută dacă există un query activ
      if (AppState.lastQuery) {
        searchOffers(AppState.lastQuery);
      }
    });
  });

  // ── BUDGET SLIDER ──
  budgetSlider.addEventListener("input", debounce((e) => {
    const val = parseInt(e.target.value, 10);
    AppState.filters.budgetMax = val;
    const budgetDisplay = document.getElementById("budget-value");
    budgetDisplay.textContent = val >= 5000 ? "Fără limită" : `${val} €`;

    if (AppState.lastQuery) {
      searchOffers(AppState.lastQuery);
    }
  }, 400));

  // ── SORT SELECT ──
  sortSelect.addEventListener("change", (e) => {
    AppState.sortBy = e.target.value;
    if (AppState.results.length > 0) {
      AppState.results = scoreAndSort(AppState.results, AppState.lastQuery || "", {});
      renderResults(true);
    }
  });

  // ── VIEW TOGGLE ──
  gridViewBtn.addEventListener("click", () => {
    AppState.viewMode = "grid";
    gridViewBtn.classList.add("view-btn--active");
    gridViewBtn.setAttribute("aria-pressed", "true");
    listViewBtn.classList.remove("view-btn--active");
    listViewBtn.setAttribute("aria-pressed", "false");
    document.getElementById("results-grid").classList.remove("list-view");
  });

  listViewBtn.addEventListener("click", () => {
    AppState.viewMode = "list";
    listViewBtn.classList.add("view-btn--active");
    listViewBtn.setAttribute("aria-pressed", "true");
    gridViewBtn.classList.remove("view-btn--active");
    gridViewBtn.setAttribute("aria-pressed", "false");
    document.getElementById("results-grid").classList.add("list-view");
  });

  // ── LOAD MORE ──
  loadMoreBtn.addEventListener("click", () => {
    renderResults(false);
  });

  // ── DESTINATION CARDS ──
  document.querySelectorAll(".destination-card").forEach((card) => {
    const cta = card.querySelector(".destination-card__cta");
    if (cta) {
      cta.addEventListener("click", (e) => {
        e.stopPropagation();
        const dest = card.dataset.dest;
        if (dest) {
          const searchInput = document.getElementById("natural-search");
          searchInput.value = `Oferte vacanță în ${dest}`;
          clearBtn.classList.remove("hidden");
          AppState.query = searchInput.value;
          document.getElementById("search-section").scrollIntoView({ behavior: "smooth" });
          setTimeout(() => searchOffers(searchInput.value), 300);
        }
      });
    }
  });

  // ── MODAL ──
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modal-overlay")) closeModal();
  });

  // ── ESCAPE KEY ──
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      // Chiude mobile nav
      closeMobileNav();
    }
  });

  // ── RESET SEARCH ──
  document.getElementById("reset-search").addEventListener("click", () => {
    searchInput.value = "";
    clearBtn.classList.add("hidden");
    AppState.query = "";
    AppState.lastQuery = null;
    AppState.filters = { type: "all", transport: "all", persons: 0, budgetMax: 5000, nights: 0, monthFrom: null, monthTo: null };
    syncFilterUI();
    hideAllStates();
  });

  // ── RETRY ──
  document.getElementById("retry-btn").addEventListener("click", () => {
    if (AppState.lastQuery) {
      searchOffers(AppState.lastQuery);
    }
  });

  // ── API NOTICE ──
  document.getElementById("api-notice-close").addEventListener("click", () => {
    document.getElementById("api-notice").classList.add("hidden");
  });

  // ── HAMBURGER ──
  document.getElementById("hamburger").addEventListener("click", toggleMobileNav);

  // ── SCROLL HEADER ──
  window.addEventListener("scroll", debounce(() => {
    const header = document.querySelector(".site-header");
    header.classList.toggle("scrolled", window.scrollY > 60);
  }, 50), { passive: true });

  // ── MOBILE NAV LINKS ──
  document.querySelectorAll(".mobile-nav__link").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });
}

/* ============================================================
   HAMBURGER / MOBILE NAV
   ============================================================ */

function toggleMobileNav() {
  const btn = document.getElementById("hamburger");
  const nav = document.getElementById("mobile-nav");
  const isOpen = !nav.classList.contains("hidden");

  if (isOpen) {
    closeMobileNav();
  } else {
    nav.classList.remove("hidden");
    btn.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  }
}

function closeMobileNav() {
  const btn = document.getElementById("hamburger");
  const nav = document.getElementById("mobile-nav");
  nav.classList.add("hidden");
  btn.classList.remove("open");
  btn.setAttribute("aria-expanded", "false");
}

/* ============================================================
   PWA – SERVICE WORKER REGISTRATION
   ============================================================ */

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("./service-worker.js", {
          scope: "./",
        });
        console.info("[SmartTravel SW] Înregistrat cu succes:", registration.scope);

        // Verifică update-uri
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              showToast("Actualizare disponibilă! Reîncarcă pagina pentru a aplica.", "info", 6000);
            }
          });
        });
      } catch (error) {
        console.warn("[SmartTravel SW] Înregistrare eșuată:", error);
      }
    });
  }
}

/* ============================================================
   PWA – INSTALL PROMPT (A2HS)
   ============================================================ */

let deferredInstallPrompt = null;

function initInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;

    // Arată banner-ul de instalare după 3 secunde
    setTimeout(() => {
      const banner = document.getElementById("install-banner");
      if (!localStorage.getItem("st_install_dismissed")) {
        banner.classList.remove("hidden");
      }
    }, 3000);
  });

  // Buton de instalare
  document.getElementById("install-btn").addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;

    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;

    if (outcome === "accepted") {
      showToast("SmartTravel AI a fost instalat! ✅", "success");
    }

    deferredInstallPrompt = null;
    document.getElementById("install-banner").classList.add("hidden");
  });

  // Dismiss banner
  document.getElementById("install-dismiss").addEventListener("click", () => {
    document.getElementById("install-banner").classList.add("hidden");
    localStorage.setItem("st_install_dismissed", "1");
  });

  // Detectare instalare completă
  window.addEventListener("appinstalled", () => {
    document.getElementById("install-banner").classList.add("hidden");
    deferredInstallPrompt = null;
    showToast("Aplicație instalată cu succes! 🎉", "success", 5000);
  });
}

/* ============================================================
   INIȚIALIZARE PRINCIPALĂ
   ============================================================ */

/* ============================================================
   DATE PICKER – LOGICĂ COMPLETĂ
   ============================================================ */

/** Starea filtrelor de dată */
const DateState = {
  mode: "flexible",     // "month" | "range" | "flexible"
  selectedMonths: [],  // ex: [{ year: 2026, month: 7 }]
  dateFrom: null,      // ISO string
  dateTo: null,        // ISO string
  flexNights: 0,
  flexPeriod: "any",
};

/** Lunile anului în română */
const MONTHS_RO = [
  "Ian", "Feb", "Mar", "Apr", "Mai", "Iun",
  "Iul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTHS_RO_FULL = [
  "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
  "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie",
];

/**
 * Construiește grila de luni – 12 luni de azi înainte.
 */
function buildMonthPicker() {
  const container = document.getElementById("month-picker");
  if (!container) return;

  container.innerHTML = "";

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  // Generăm 15 luni viitoare (incluzând luna curentă)
  for (let i = 0; i < 15; i++) {
    const d = new Date(currentYear, currentMonth + i, 1);
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-indexed
    const isPast = false; // toate sunt viitoare

    const btn = document.createElement("button");
    btn.className = "month-btn";
    btn.dataset.year = year;
    btn.dataset.month = month;
    btn.setAttribute("aria-label", `${MONTHS_RO_FULL[month]} ${year}`);
    btn.innerHTML = `
      <span class="month-btn__name">${MONTHS_RO[month]}</span>
      <span class="month-btn__year">${year}</span>
    `;

    btn.addEventListener("click", () => toggleMonthSelection(btn, year, month));
    container.appendChild(btn);
  }
}

/**
 * Selectează / deselectează o lună.
 */
function toggleMonthSelection(btn, year, month) {
  const idx = DateState.selectedMonths.findIndex(
    (m) => m.year === year && m.month === month
  );

  if (idx > -1) {
    DateState.selectedMonths.splice(idx, 1);
    btn.classList.remove("month-btn--active");
  } else {
    DateState.selectedMonths.push({ year, month });
    btn.classList.add("month-btn--active");
  }

  updateDateFilterBadge();

  // Re-caută dacă există query activ
  if (AppState.lastQuery) {
    searchOffers(AppState.lastQuery);
  }
}

/**
 * Actualizează badge-ul/afișajul perioadei selectate.
 */
function updateDateFilterBadge() {
  if (DateState.mode === "month" && DateState.selectedMonths.length > 0) {
    const labels = DateState.selectedMonths
      .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
      .map((m) => `${MONTHS_RO_FULL[m.month]} ${m.year}`)
      .join(", ");
    showToast(`📅 Perioadă selectată: ${labels}`, "info", 2500);
  }
}

/**
 * Returnează intervalul de date pentru filtrare în funcție de modul activ.
 * @returns {{ from: Date|null, to: Date|null }}
 */
function getActiveDateRange() {
  if (DateState.mode === "range") {
    return {
      from: DateState.dateFrom ? new Date(DateState.dateFrom) : null,
      to: DateState.dateTo ? new Date(DateState.dateTo) : null,
    };
  }

  if (DateState.mode === "month" && DateState.selectedMonths.length > 0) {
    const sorted = [...DateState.selectedMonths].sort(
      (a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month
    );
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    return {
      from: new Date(first.year, first.month, 1),
      to: new Date(last.year, last.month + 1, 0), // ultima zi a ultimei luni selectate
    };
  }

  if (DateState.mode === "flexible") {
    const now = new Date();
    let from = null;
    let to = null;

    switch (DateState.flexPeriod) {
      case "1m":
        from = now;
        to = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        break;
      case "3m":
        from = now;
        to = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
        break;
      case "summer":
        from = new Date(2026, 5, 1);  // Iunie 2026
        to = new Date(2026, 8, 30);   // Septembrie 2026
        break;
      case "winter":
        from = new Date(2026, 11, 1); // Decembrie 2026
        to = new Date(2027, 1, 28);   // Februarie 2027
        break;
      default:
        return { from: null, to: null };
    }
    return { from, to };
  }

  return { from: null, to: null };
}

/**
 * Filtrează ofertele după intervalul de date activ.
 * @param {Array} offers
 * @returns {Array}
 */
function filterByDate(offers) {
  const { from, to } = getActiveDateRange();
  if (!from && !to) return offers; // fără filtru dată activ

  return offers.filter((offer) => {
    if (!offer.checkIn) return true;
    const checkIn = new Date(offer.checkIn);
    if (from && checkIn < from) return false;
    if (to && checkIn > to) return false;
    return true;
  });
}

/**
 * Inițializează event listenerii pentru date picker.
 */
function initDatePicker() {
  buildMonthPicker();

  // Setează min date pentru inputurile de tip date
  const today = new Date().toISOString().split("T")[0];
  const dateFrom = document.getElementById("date-from");
  const dateTo = document.getElementById("date-to");
  if (dateFrom) { dateFrom.min = today; dateFrom.value = ""; }
  if (dateTo) { dateTo.min = today; dateTo.value = ""; }

  // Tab switcher (Lună / Interval exact / Flexibil)
  document.querySelectorAll(".date-mode-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const mode = tab.dataset.mode;
      DateState.mode = mode;

      // Update tab UI
      document.querySelectorAll(".date-mode-tab").forEach((t) => {
        t.classList.remove("date-mode-tab--active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("date-mode-tab--active");
      tab.setAttribute("aria-selected", "true");

      // Arată / ascunde paneluri
      document.querySelectorAll(".date-panel").forEach((p) => p.classList.add("hidden"));
      const panel = document.getElementById(`panel-${mode}`);
      if (panel) panel.classList.remove("hidden");
    });
  });

  // Date range inputs
  if (dateFrom) {
    dateFrom.addEventListener("change", () => {
      DateState.dateFrom = dateFrom.value;
      if (dateTo) dateTo.min = dateFrom.value;
      updateRangeSummary();
    });
  }

  if (dateTo) {
    dateTo.addEventListener("change", () => {
      DateState.dateTo = dateTo.value;
      updateRangeSummary();
      if (AppState.lastQuery) searchOffers(AppState.lastQuery);
    });
  }

  // Clear range
  const clearBtn = document.getElementById("date-clear-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      DateState.dateFrom = null;
      DateState.dateTo = null;
      if (dateFrom) dateFrom.value = "";
      if (dateTo) dateTo.value = "";
      document.getElementById("date-range-summary")?.classList.add("hidden");
      if (AppState.lastQuery) searchOffers(AppState.lastQuery);
    });
  }

  // Flexible chips (nopți)
  document.querySelectorAll("[data-flex='nights']").forEach((chip) => {
    chip.addEventListener("click", () => {
      DateState.flexNights = parseInt(chip.dataset.value, 10);
      document.querySelectorAll("[data-flex='nights']").forEach((c) => {
        c.classList.remove("filter-chip--active");
        c.setAttribute("aria-checked", "false");
      });
      chip.classList.add("filter-chip--active");
      chip.setAttribute("aria-checked", "true");
    });
  });

  // Flexible chips (perioadă)
  document.querySelectorAll("[data-flex='period']").forEach((chip) => {
    chip.addEventListener("click", () => {
      DateState.flexPeriod = chip.dataset.value;
      document.querySelectorAll("[data-flex='period']").forEach((c) => {
        c.classList.remove("filter-chip--active");
        c.setAttribute("aria-checked", "false");
      });
      chip.classList.add("filter-chip--active");
      chip.setAttribute("aria-checked", "true");
      if (AppState.lastQuery) searchOffers(AppState.lastQuery);
    });
  });
}

/**
 * Afișează rezumatul intervalului selectat.
 */
function updateRangeSummary() {
  const summary = document.getElementById("date-range-summary");
  const summaryText = document.getElementById("date-summary-text");
  if (!summary || !summaryText) return;

  if (DateState.dateFrom && DateState.dateTo) {
    const from = new Date(DateState.dateFrom);
    const to = new Date(DateState.dateTo);
    const nights = Math.round((to - from) / 86400000);

    summaryText.textContent = `📅 ${from.toLocaleDateString("ro-RO", { day: "numeric", month: "long" })} → ${to.toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" })} · ${nights} nopți`;
    summary.classList.remove("hidden");
  } else if (DateState.dateFrom) {
    const from = new Date(DateState.dateFrom);
    summaryText.textContent = `📅 Plecare: ${from.toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" })}`;
    summary.classList.remove("hidden");
  } else {
    summary.classList.add("hidden");
  }
}

/* ============================================================
   PATCH: filterByDate integrat în applyFilters
   Suprascrie funcția originală pentru a include și filtrul de dată.
   ============================================================ */
const _originalApplyFilters = applyFilters;
// Nu putem redefini direct, deci integrăm în searchOffers prin monkey-patch
// la nivelul scriptului – applyFilters este extinsă mai jos:

const applyFiltersWithDate = (offers) => {
  let filtered = _originalApplyFilters(offers);
  return filterByDate(filtered);
};

/* ============================================================
   FLIGHTS SECTION – LOGICĂ COMPLETĂ
   ============================================================ */

/** Starea formularului de zboruri */
const FlightState = {
  tripType: "roundtrip",   // "roundtrip" | "oneway" | "multicity"
  from: "București (OTP)",
  to: "",
  departDate: "",
  returnDate: "",
  adults: 1,
  children: 0,
  cabinClass: "economy",
  filters: {
    direct: false,
    baggage: false,
    flexible: false,
    morning: false,
    evening: false,
  },
  priceAlert: false,
};

/** Date demo pentru zboruri */
const DEMO_FLIGHTS = [
  {
    id: "fl_1",
    airline: "TAROM",
    airlineLogo: "🇷🇴",
    flightNo: "RO201",
    from: "OTP",
    to: "CDG",
    fromCity: "București",
    toCity: "Paris",
    departTime: "06:30",
    arriveTime: "09:15",
    returnDepartTime: "18:00",
    returnArriveTime: "22:40",
    duration: "3h 45min",
    stops: 0,
    pricePerPerson: 189,
    tags: ["Bagaj 23kg inclus", "Mese la bord"],
    bookUrl: "https://tarom.ro",
    class: "economy",
    flexible: false,
  },
  {
    id: "fl_2",
    airline: "Wizz Air",
    airlineLogo: "💜",
    flightNo: "W63701",
    from: "OTP",
    to: "FCO",
    fromCity: "București",
    toCity: "Roma",
    departTime: "08:00",
    arriveTime: "09:50",
    returnDepartTime: "17:20",
    returnArriveTime: "21:00",
    duration: "1h 50min",
    stops: 0,
    pricePerPerson: 79,
    tags: ["Direct", "Bagaj de mână inclus"],
    bookUrl: "https://wizzair.com",
    class: "economy",
    flexible: true,
  },
  {
    id: "fl_3",
    airline: "Ryanair",
    airlineLogo: "💛",
    flightNo: "FR1234",
    from: "OTP",
    to: "BCN",
    fromCity: "București",
    toCity: "Barcelona",
    departTime: "11:30",
    arriveTime: "13:45",
    returnDepartTime: "14:50",
    returnArriveTime: "19:00",
    duration: "2h 15min",
    stops: 0,
    pricePerPerson: 64,
    tags: ["Direct", "Cel mai ieftin"],
    bookUrl: "https://ryanair.com",
    class: "economy",
    flexible: false,
  },
  {
    id: "fl_4",
    airline: "Lufthansa",
    airlineLogo: "✈️",
    flightNo: "LH1456",
    from: "OTP",
    to: "JFK",
    fromCity: "București",
    toCity: "New York",
    departTime: "09:00",
    arriveTime: "16:30",
    returnDepartTime: "19:00",
    returnArriveTime: "10:20",
    duration: "12h 30min (1 escală FRA)",
    stops: 1,
    pricePerPerson: 520,
    tags: ["1 escală Frankfurt", "Masă inclus", "Bagaj 23kg"],
    bookUrl: "https://lufthansa.com",
    class: "economy",
    flexible: true,
  },
  {
    id: "fl_5",
    airline: "Turkish Airlines",
    airlineLogo: "🌙",
    flightNo: "TK1874",
    from: "OTP",
    to: "AYT",
    fromCity: "București",
    toCity: "Antalya",
    departTime: "14:20",
    arriveTime: "16:45",
    returnDepartTime: "20:30",
    returnArriveTime: "22:50",
    duration: "2h 25min",
    stops: 0,
    pricePerPerson: 142,
    tags: ["Direct", "Bagaj 23kg", "Masă la bord"],
    bookUrl: "https://turkishairlines.com",
    class: "economy",
    flexible: false,
  },
  {
    id: "fl_6",
    airline: "Blue Air",
    airlineLogo: "🔵",
    flightNo: "0B211",
    from: "OTP",
    to: "ATH",
    fromCity: "București",
    toCity: "Atena",
    departTime: "07:15",
    arriveTime: "09:30",
    returnDepartTime: "10:30",
    returnArriveTime: "12:45",
    duration: "2h 15min",
    stops: 0,
    pricePerPerson: 98,
    tags: ["Direct", "Bagaj de mână"],
    bookUrl: "https://blueairweb.com",
    class: "economy",
    flexible: true,
  },
  {
    id: "fl_7",
    airline: "Air France",
    airlineLogo: "🇫🇷",
    flightNo: "AF1091",
    from: "OTP",
    to: "NCE",
    fromCity: "București",
    toCity: "Nisa",
    departTime: "10:05",
    arriveTime: "12:55",
    returnDepartTime: "15:10",
    returnArriveTime: "19:00",
    duration: "2h 50min",
    stops: 0,
    pricePerPerson: 156,
    tags: ["Direct", "Bagaj 23kg", "Mese"],
    bookUrl: "https://airfrance.com",
    class: "economy",
    flexible: false,
  },
  {
    id: "fl_8",
    airline: "easyJet",
    airlineLogo: "🟠",
    flightNo: "U27011",
    from: "OTP",
    to: "AMS",
    fromCity: "București",
    toCity: "Amsterdam",
    departTime: "16:40",
    arriveTime: "19:20",
    returnDepartTime: "07:00",
    returnArriveTime: "11:35",
    duration: "2h 40min",
    stops: 0,
    pricePerPerson: 115,
    tags: ["Direct", "Bilet flexibil"],
    bookUrl: "https://easyjet.com",
    class: "economy",
    flexible: true,
  },
];

/**
 * Caută zboruri (demo sau API real).
 */
async function searchFlights() {
  const btn = document.getElementById("flights-search-btn");
  const btnText = btn.querySelector(".btn__text");
  const btnSpinner = btn.querySelector(".btn__spinner");
  const resultsEl = document.getElementById("flights-results");
  const skeletonEl = document.getElementById("flights-skeleton");
  const emptyEl = document.getElementById("flights-empty");
  const listEl = document.getElementById("flights-results-list");

  // Validare minimă
  if (!FlightState.departDate) {
    showToast("Selectează data de plecare ✈️", "info");
    document.getElementById("flight-depart").focus();
    return;
  }
  if (!FlightState.to.trim()) {
    showToast("Introdu destinația 🌍", "info");
    document.getElementById("flight-to").focus();
    return;
  }

  // Loading state
  btnText.classList.add("hidden");
  btnSpinner.classList.remove("hidden");
  btn.disabled = true;
  resultsEl.classList.add("hidden");
  emptyEl.classList.add("hidden");
  skeletonEl.classList.remove("hidden");

  try {
    let flights = [];

    // Dacă Skyscanner API este activat, folosim API real
    if (API_CONFIG.SKYSCANNER.ENABLED) {
      flights = await fetchSkyscannerFlights({
        origin: extractIATA(FlightState.from),
        destination: extractIATA(FlightState.to),
        departureDate: FlightState.departDate,
        adults: FlightState.adults,
      });
    }

    // Fallback demo
    if (flights.length === 0) {
      await new Promise((r) => setTimeout(r, 800)); // simulare latență
      flights = filterDemoFlights([...DEMO_FLIGHTS]);
    }

    skeletonEl.classList.add("hidden");

    if (flights.length === 0) {
      emptyEl.classList.remove("hidden");
    } else {
      listEl.innerHTML = "";
      flights.forEach((flight, idx) => {
        const card = createFlightCard(flight, idx);
        listEl.appendChild(card);
      });

      const metaEl = document.getElementById("flights-results-meta");
      metaEl.textContent = `${flights.length} zbor${flights.length === 1 ? "" : "uri"} găsit${flights.length === 1 ? "" : "e"} · ${FlightState.from} → ${FlightState.to}`;

      resultsEl.classList.remove("hidden");
      resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (err) {
    console.error("Flights search error:", err);
    skeletonEl.classList.add("hidden");
    showToast("Eroare la căutarea zborurilor. Încearcă din nou.", "error");
  } finally {
    btnText.classList.remove("hidden");
    btnSpinner.classList.add("hidden");
    btn.disabled = false;
  }
}

/**
 * Extrage codul IATA din string-ul de aeroport.
 * ex: "București (OTP)" → "OTP"
 */
function extractIATA(airportStr) {
  const match = airportStr.match(/\(([A-Z]{3})\)/);
  return match ? match[1] : airportStr.slice(0, 3).toUpperCase();
}

/**
 * Filtrează zborurile demo după preferințele active.
 */
function filterDemoFlights(flights) {
  return flights.filter((f) => {
    if (FlightState.filters.direct && f.stops !== 0) return false;
    if (FlightState.filters.flexible && !f.flexible) return false;
    if (FlightState.filters.morning) {
      const h = parseInt(f.departTime.split(":")[0], 10);
      if (h >= 12) return false;
    }
    if (FlightState.filters.evening) {
      const h = parseInt(f.departTime.split(":")[0], 10);
      if (h < 18) return false;
    }
    return true;
  }).sort((a, b) => a.pricePerPerson - b.pricePerPerson);
}

/**
 * Creează un card de zbor.
 */
function createFlightCard(flight, index) {
  const totalPrice = flight.pricePerPerson * FlightState.adults;
  const isRoundtrip = FlightState.tripType === "roundtrip";

  const card = document.createElement("article");
  card.className = "flight-card";
  card.setAttribute("role", "listitem");
  card.style.animationDelay = `${index * 60}ms`;
  card.dataset.flightId = flight.id;

  card.innerHTML = `
    <div class="flight-card__airline">
      <span class="flight-card__airline-logo" aria-hidden="true">${sanitize(flight.airlineLogo)}</span>
      <span class="flight-card__airline-name">${sanitize(flight.airline)}</span>
      <span style="font-size:var(--text-xs);color:var(--color-text-dim)">${sanitize(flight.flightNo)}</span>
    </div>

    <div class="flight-card__route">
      <div class="flight-card__endpoint">
        <span class="flight-card__time">${sanitize(flight.departTime)}</span>
        <span class="flight-card__airport">${sanitize(flight.from)}</span>
        <span style="font-size:var(--text-xs);color:var(--color-text-dim)">${sanitize(flight.fromCity)}</span>
      </div>

      <div class="flight-card__flight-line">
        <span class="flight-card__duration">${sanitize(flight.duration)}</span>
        <div class="flight-card__line" aria-hidden="true"></div>
        <span class="flight-card__stops ${flight.stops === 0 ? "flight-card__stops--direct" : ""}">
          ${flight.stops === 0 ? "✈ Direct" : `${flight.stops} escală`}
        </span>
      </div>

      <div class="flight-card__endpoint">
        <span class="flight-card__time">${sanitize(flight.arriveTime)}</span>
        <span class="flight-card__airport">${sanitize(flight.to)}</span>
        <span style="font-size:var(--text-xs);color:var(--color-text-dim)">${sanitize(flight.toCity)}</span>
      </div>

      ${isRoundtrip && flight.returnDepartTime ? `
        <div style="width:1px;height:40px;background:var(--color-border);margin:0 8px;flex-shrink:0" aria-hidden="true"></div>
        <div class="flight-card__endpoint">
          <span class="flight-card__time">${sanitize(flight.returnDepartTime)}</span>
          <span class="flight-card__airport">${sanitize(flight.to)}</span>
          <span style="font-size:var(--text-xs);color:var(--color-text-dim)">Întoarcere</span>
        </div>
        <div class="flight-card__flight-line" style="flex:0.5">
          <span class="flight-card__duration" style="visibility:hidden">-</span>
          <div class="flight-card__line" aria-hidden="true"></div>
          <span class="flight-card__stops">↩ Retur</span>
        </div>
        <div class="flight-card__endpoint">
          <span class="flight-card__time">${sanitize(flight.returnArriveTime)}</span>
          <span class="flight-card__airport">${sanitize(flight.from)}</span>
          <span style="font-size:var(--text-xs);color:var(--color-text-dim)">${sanitize(flight.fromCity)}</span>
        </div>
      ` : ""}
    </div>

    <div class="flight-card__tags">
      ${flight.tags.slice(0, 2).map((t) => `
        <span class="flight-tag ${flight.stops === 0 && t.includes("Direct") ? "flight-tag--green" : ""}">
          ${sanitize(t)}
        </span>
      `).join("")}
    </div>

    <div class="flight-card__price-col">
      <span class="flight-card__price-label">de la / persoană</span>
      <span class="flight-card__price">${formatPrice(flight.pricePerPerson)}</span>
      ${FlightState.adults > 1 ? `<span class="flight-card__price-sub">Total ${FlightState.adults} pers: ${formatPrice(totalPrice)}</span>` : ""}
      <a
        href="${sanitize(flight.bookUrl)}"
        class="flight-card__book-btn"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Rezervă zborul ${sanitize(flight.airline)} ${sanitize(flight.from)}→${sanitize(flight.to)}"
      >Rezervă ↗</a>
    </div>
  `;

  return card;
}

/**
 * Inițializează toți event listenerii pentru secțiunea de zboruri.
 */
function initFlightsSection() {
  // Setează data minimă = azi
  const today = new Date().toISOString().split("T")[0];
  const departInput = document.getElementById("flight-depart");
  const returnInput = document.getElementById("flight-return");
  if (departInput) {
    departInput.min = today;
    departInput.addEventListener("change", () => {
      FlightState.departDate = departInput.value;
      if (returnInput) returnInput.min = departInput.value;
    });
  }
  if (returnInput) {
    returnInput.min = today;
    returnInput.addEventListener("change", () => {
      FlightState.returnDate = returnInput.value;
    });
  }

  // Input-uri rută
  const fromInput = document.getElementById("flight-from");
  const toInput = document.getElementById("flight-to");
  if (fromInput) fromInput.addEventListener("change", () => { FlightState.from = fromInput.value; });
  if (toInput) toInput.addEventListener("change", () => { FlightState.to = toInput.value; });

  // Swap rută
  document.getElementById("route-swap")?.addEventListener("click", () => {
    const tmp = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = tmp;
    FlightState.from = fromInput.value;
    FlightState.to = toInput.value;
    // Animație vizuală
    fromInput.closest(".route-input-wrap").style.transform = "scale(0.96)";
    setTimeout(() => { fromInput.closest(".route-input-wrap").style.transform = ""; }, 200);
  });

  // Trip type tabs
  document.querySelectorAll(".trip-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      FlightState.tripType = tab.dataset.trip;
      document.querySelectorAll(".trip-tab").forEach((t) => {
        t.classList.remove("trip-tab--active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("trip-tab--active");
      tab.setAttribute("aria-selected", "true");

      // Ascunde câmpul de întoarcere pentru zbor dus
      const returnGroup = document.getElementById("flight-return-group");
      if (returnGroup) {
        returnGroup.style.display = FlightState.tripType === "oneway" ? "none" : "";
      }
    });
  });

  // Pasageri counters
  function setupCounter(minusId, plusId, valId, stateKey, min = 0, max = 9) {
    const minus = document.getElementById(minusId);
    const plus = document.getElementById(plusId);
    const val = document.getElementById(valId);

    const update = (delta) => {
      FlightState[stateKey] = Math.max(min, Math.min(max, FlightState[stateKey] + delta));
      if (val) val.textContent = FlightState[stateKey];
      if (minus) minus.disabled = FlightState[stateKey] <= min;
      if (plus) plus.disabled = FlightState[stateKey] >= max;
    };

    minus?.addEventListener("click", () => update(-1));
    plus?.addEventListener("click", () => update(1));
    if (minus) minus.disabled = FlightState[stateKey] <= min;
  }

  setupCounter("pax-adult-minus", "pax-adult-plus", "pax-adult-val", "adults", 1, 9);
  setupCounter("pax-child-minus", "pax-child-plus", "pax-child-val", "children", 0, 8);

  // Clasă zbor
  document.getElementById("flight-class")?.addEventListener("change", (e) => {
    FlightState.cabinClass = e.target.value;
  });

  // Quick filters zbor (toggle)
  document.querySelectorAll("[data-flight-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.flightFilter;
      FlightState.filters[filter] = !FlightState.filters[filter];
      chip.classList.toggle("filter-chip--active", FlightState.filters[filter]);
      chip.setAttribute("aria-pressed", String(FlightState.filters[filter]));
    });
  });

  // Price alert toggle
  document.getElementById("price-alert-toggle")?.addEventListener("change", (e) => {
    FlightState.priceAlert = e.target.checked;
    if (FlightState.priceAlert) {
      showToast("🔔 Alertă preț activată! Vei fi notificat când prețul scade.", "success");
    }
  });

  // Buton căutare
  document.getElementById("flights-search-btn")?.addEventListener("click", searchFlights);

  // Class select
  document.getElementById("flight-class")?.addEventListener("change", (e) => {
    FlightState.cabinClass = e.target.value;
  });
}


document.addEventListener("DOMContentLoaded", () => {
  initEventListeners();
  initInstallPrompt();
  registerServiceWorker();
  initDatePicker();
  initFlightsSection();

  // Afișează notificarea API dacă niciun API nu este configurat
  const anyApiEnabled = Object.values(API_CONFIG).some((c) => c.ENABLED);
  if (anyApiEnabled) {
    document.getElementById("api-notice").classList.add("hidden");
  }

  // Header scroll la start (dacă pagina e deja scrollată)
  if (window.scrollY > 60) {
    document.querySelector(".site-header").classList.add("scrolled");
  }

  console.info(
    "%c SmartTravel AI v1.1 %c Date Picker + Flights Module activ! ",
    "background: #3d8ef8; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;",
    "background: #0d1220; color: #7a8aaa; padding: 4px 8px; border-radius: 0 4px 4px 0;"
  );
});
