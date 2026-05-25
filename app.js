/**
 * SmartTravel AI · app.js v3.0
 * Booking-style search engine – calendar vizual, autocomplete, guests counter
 * Toate API-urile cu cheia RapidAPI setată. Fallback demo garantat.
 */

/* ============================================================
   API CONFIG – cheia este deja setată
   ============================================================ */
const RAPIDAPI_KEY = "2c53b6cecbmshd2d367eb5471d47p1a90f8jsn50507c92fabc";
const API_CONFIG = {
  BOOKING:        { ENABLED: false, KEY: RAPIDAPI_KEY, HOST: "booking-com15.p.rapidapi.com",       BASE_URL: "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels" },
  CAR_RENTALS:    { ENABLED: false, KEY: RAPIDAPI_KEY, HOST: "booking-com15.p.rapidapi.com",       BASE_URL: "https://booking-com15.p.rapidapi.com/api/v1/cars/searchCarRentals" },
  SKYSCANNER:     { ENABLED: false, KEY: RAPIDAPI_KEY, HOST: "skyscanner-flights4.p.rapidapi.com", BASE_URL: "https://skyscanner-flights4.p.rapidapi.com/api/v1" },
  GOOGLE_FLIGHTS: { ENABLED: false, KEY: RAPIDAPI_KEY, HOST: "google-flights2.p.rapidapi.com",    BASE_URL: "https://google-flights2.p.rapidapi.com/api/v1/searchFlights" },
  AIRBNB:         { ENABLED: false, KEY: RAPIDAPI_KEY, HOST: "airbnb19.p.rapidapi.com",            BASE_URL: "https://airbnb19.p.rapidapi.com/api/v2/searchPropertyByPlaceId" },
  TRIPADVISOR:    { ENABLED: false, KEY: RAPIDAPI_KEY, HOST: "tripadvisor16.p.rapidapi.com",       BASE_URL: "https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants" },
  HOTELS:         { ENABLED: false, KEY: RAPIDAPI_KEY, HOST: "hotels4.p.rapidapi.com",             BASE_URL: "https://hotels4.p.rapidapi.com/properties/get-details" },
  RYANAIR:        { ENABLED: false, KEY: RAPIDAPI_KEY, HOST: "ryanair2.p.rapidapi.com",            BASE_URL: "https://ryanair2.p.rapidapi.com/api/v1/availabilityCalendar" },
  FLIGHTS:        { ENABLED: false, KEY: RAPIDAPI_KEY, HOST: "aerodatabox.p.rapidapi.com",         BASE_URL: "https://aerodatabox.p.rapidapi.com/flights" },
};

/* ============================================================
   DESTINATIONS AUTOCOMPLETE DATABASE
   ============================================================ */
const DESTINATIONS = [
  { name:"Paris",       country:"Franța",       flag:"🇫🇷", icon:"🗼", type:"Oraș" },
  { name:"Roma",        country:"Italia",        flag:"🇮🇹", icon:"🏛️", type:"Oraș" },
  { name:"Barcelona",   country:"Spania",        flag:"🇪🇸", icon:"🌊", type:"Oraș" },
  { name:"Praga",       country:"Cehia",         flag:"🇨🇿", icon:"🏰", type:"Oraș" },
  { name:"Amsterdam",   country:"Olanda",        flag:"🇳🇱", icon:"🌷", type:"Oraș" },
  { name:"Viena",       country:"Austria",       flag:"🇦🇹", icon:"🎻", type:"Oraș" },
  { name:"Londra",      country:"UK",            flag:"🇬🇧", icon:"🎡", type:"Oraș" },
  { name:"Berlin",      country:"Germania",      flag:"🇩🇪", icon:"🐻", type:"Oraș" },
  { name:"Budapesta",   country:"Ungaria",       flag:"🇭🇺", icon:"🏰", type:"Oraș" },
  { name:"Lisabona",    country:"Portugalia",    flag:"🇵🇹", icon:"🍷", type:"Oraș" },
  { name:"Santorini",   country:"Grecia",        flag:"🇬🇷", icon:"🏝️", type:"Insulă" },
  { name:"Mykonos",     country:"Grecia",        flag:"🇬🇷", icon:"🌅", type:"Insulă" },
  { name:"Creta",       country:"Grecia",        flag:"🇬🇷", icon:"🐚", type:"Insulă" },
  { name:"Rodos",       country:"Grecia",        flag:"🇬🇷", icon:"🏛️", type:"Insulă" },
  { name:"Antalya",     country:"Turcia",        flag:"🇹🇷", icon:"☀️", type:"Litoral" },
  { name:"Bodrum",      country:"Turcia",        flag:"🇹🇷", icon:"⛵", type:"Litoral" },
  { name:"Istanbul",    country:"Turcia",        flag:"🇹🇷", icon:"🕌", type:"Oraș" },
  { name:"Dubai",       country:"EAU",           flag:"🇦🇪", icon:"✨", type:"Luxury" },
  { name:"Marrakech",   country:"Maroc",         flag:"🇲🇦", icon:"🏜️", type:"Exotic" },
  { name:"Tenerife",    country:"Spania",        flag:"🇪🇸", icon:"🌋", type:"Insulă" },
  { name:"Mallorca",    country:"Spania",        flag:"🇪🇸", icon:"🏖️", type:"Insulă" },
  { name:"Mamaia",      country:"România",       flag:"🇷🇴", icon:"🏖️", type:"Litoral" },
  { name:"Constanța",   country:"România",       flag:"🇷🇴", icon:"⚓", type:"Litoral" },
  { name:"Sinaia",      country:"România",       flag:"🇷🇴", icon:"⛷️", type:"Munte" },
  { name:"Brașov",      country:"România",       flag:"🇷🇴", icon:"🏔️", type:"Munte" },
  { name:"Cluj-Napoca", country:"România",       flag:"🇷🇴", icon:"🏙️", type:"Oraș" },
  { name:"Bali",        country:"Indonezia",     flag:"🇮🇩", icon:"🌺", type:"Exotic" },
  { name:"Maldive",     country:"Maldive",       flag:"🇲🇻", icon:"🐠", type:"Exotic" },
  { name:"New York",    country:"SUA",           flag:"🇺🇸", icon:"🗽", type:"Oraș" },
  { name:"Bangkok",     country:"Thailanda",     flag:"🇹🇭", icon:"🛕", type:"Exotic" },
];

/* ============================================================
   OFERTE DEMO – afișate când API-urile sunt inactive
   ============================================================ */
const DEMO_OFFERS = [
  {
    id:"d1", name:"Grand Hotel Eiffel Paris", dest:"Paris", country:"Franța", flag:"🇫🇷",
    type:"city-break", stars:4, rating:8.7, reviews:2341,
    pricePerPerson:189, persons:2, nights:3,
    checkIn:"2026-07-10", checkOut:"2026-07-13",
    image:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
    room:"Cameră Dublă Standard", included:["Mic dejun inclus","Wi-Fi gratuit","Anulare gratuită"],
    badge:"city-break", badgeLabel:"🏙️ City Break",
    transport:"avion", offerUrl:"#", availability:"Ultimele 3 camere!"
  },
  {
    id:"d2", name:"Santorini Blue Suites", dest:"Santorini", country:"Grecia", flag:"🇬🇷",
    type:"litoral", stars:5, rating:9.2, reviews:1876,
    pricePerPerson:599, persons:2, nights:7,
    checkIn:"2026-08-01", checkOut:"2026-08-08",
    image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
    room:"Suite cu vedere la mare", included:["Mic dejun & cină","Transfer aeroport","Piscină privată"],
    badge:"litoral", badgeLabel:"🏝️ Litoral",
    transport:"avion", offerUrl:"#", availability:""
  },
  {
    id:"d3", name:"Hotel Plaza Roma Centro", dest:"Roma", country:"Italia", flag:"🇮🇹",
    type:"city-break", stars:4, rating:8.4, reviews:3102,
    pricePerPerson:149, persons:2, nights:4,
    checkIn:"2026-06-15", checkOut:"2026-06-19",
    image:"https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80",
    room:"Cameră Superioară", included:["Wi-Fi gratuit","Anulare gratuită"],
    badge:"city-break", badgeLabel:"🏛️ City Break",
    transport:"avion", offerUrl:"#", availability:""
  },
  {
    id:"d4", name:"Rixos Premium Belek Antalya", dest:"Antalya", country:"Turcia", flag:"🇹🇷",
    type:"litoral", stars:5, rating:9.0, reviews:4521,
    pricePerPerson:459, persons:2, nights:7,
    checkIn:"2026-07-20", checkOut:"2026-07-27",
    image:"https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
    room:"Cameră Deluxe All Inclusive", included:["All Inclusive","Plajă privată","Spa","Animație"],
    badge:"last-minute", badgeLabel:"🔥 Last Minute",
    transport:"avion", offerUrl:"#", availability:"Ofertă limitată!"
  },
  {
    id:"d5", name:"Hotel Arts Barcelona", dest:"Barcelona", country:"Spania", flag:"🇪🇸",
    type:"city-break", stars:5, rating:9.1, reviews:2890,
    pricePerPerson:299, persons:2, nights:5,
    checkIn:"2026-09-10", checkOut:"2026-09-15",
    image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    room:"Cameră Ocean View", included:["Mic dejun","Wi-Fi","Parcare"],
    badge:"city-break", badgeLabel:"🌊 City Break",
    transport:"avion", offerUrl:"#", availability:""
  },
  {
    id:"d6", name:"Mosaic House Prague", dest:"Praga", country:"Cehia", flag:"🇨🇿",
    type:"city-break", stars:4, rating:8.8, reviews:1654,
    pricePerPerson:129, persons:2, nights:3,
    checkIn:"2026-10-02", checkOut:"2026-10-05",
    image:"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=600&q=80",
    room:"Cameră Deluxe", included:["Mic dejun","Wi-Fi","Tur orașului"],
    badge:"city-break", badgeLabel:"🏰 City Break",
    transport:"avion", offerUrl:"#", availability:""
  },
  {
    id:"d7", name:"JW Marriott Dubai", dest:"Dubai", country:"EAU", flag:"🇦🇪",
    type:"luxury", stars:5, rating:9.4, reviews:3210,
    pricePerPerson:899, persons:2, nights:5,
    checkIn:"2026-11-15", checkOut:"2026-11-20",
    image:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    room:"Cameră Deluxe Marina View", included:["Mic dejun","Piscină infinity","Spa","Transfer"],
    badge:"luxury", badgeLabel:"✨ Luxury",
    transport:"avion", offerUrl:"#", availability:""
  },
  {
    id:"d8", name:"Hotel Mamaia Beach Resort", dest:"Mamaia", country:"România", flag:"🇷🇴",
    type:"litoral", stars:4, rating:8.2, reviews:987,
    pricePerPerson:89, persons:2, nights:7,
    checkIn:"2026-08-10", checkOut:"2026-08-17",
    image:"https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
    room:"Cameră cu vedere la mare", included:["Mic dejun","Plajă privată","Parcare"],
    badge:"litoral", badgeLabel:"🏖️ Litoral",
    transport:"masina", offerUrl:"#", availability:""
  },
  {
    id:"d9", name:"W Verbier Sinaia", dest:"Sinaia", country:"România", flag:"🇷🇴",
    type:"ski", stars:5, rating:8.9, reviews:654,
    pricePerPerson:249, persons:2, nights:5,
    checkIn:"2026-12-20", checkOut:"2026-12-25",
    image:"https://images.unsplash.com/photo-1548777123-e216912f42cc?w=600&q=80",
    room:"Suite Panoramică", included:["Demipensiune","Ski pass","Echipament schi"],
    badge:"ski", badgeLabel:"⛷️ Ski & Munte",
    transport:"masina", offerUrl:"#", availability:"Ultimele locuri!"
  },
  {
    id:"d10", name:"Hilton Amsterdam", dest:"Amsterdam", country:"Olanda", flag:"🇳🇱",
    type:"city-break", stars:5, rating:8.6, reviews:2100,
    pricePerPerson:229, persons:2, nights:4,
    checkIn:"2026-09-05", checkOut:"2026-09-09",
    image:"https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80",
    room:"Cameră Canal View", included:["Wi-Fi","Biciclete incluse","Mic dejun"],
    badge:"city-break", badgeLabel:"🌷 City Break",
    transport:"avion", offerUrl:"#", availability:""
  },
  {
    id:"d11", name:"Bosphorus Palace Istanbul", dest:"Istanbul", country:"Turcia", flag:"🇹🇷",
    type:"city-break", stars:5, rating:9.0, reviews:1789,
    pricePerPerson:199, persons:2, nights:4,
    checkIn:"2026-10-15", checkOut:"2026-10-19",
    image:"https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80",
    room:"Cameră Bosphorus View", included:["Mic dejun","Wi-Fi","Tur Bosphorus"],
    badge:"city-break", badgeLabel:"🕌 City Break",
    transport:"avion", offerUrl:"#", availability:""
  },
  {
    id:"d12", name:"Atlantis Paradise Island Bali", dest:"Bali", country:"Indonezia", flag:"🇮🇩",
    type:"exotic", stars:5, rating:9.3, reviews:4320,
    pricePerPerson:799, persons:2, nights:10,
    checkIn:"2026-06-01", checkOut:"2026-06-11",
    image:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    room:"Villa cu piscină privată", included:["All Inclusive","Spa","Transfer","Activități"],
    badge:"exotic", badgeLabel:"🌺 Exotic",
    transport:"avion", offerUrl:"#", availability:""
  },
];

/* ============================================================
   STATE
   ============================================================ */
const State = {
  dest: "",
  checkIn: null,   // Date object
  checkOut: null,  // Date object
  adults: 2,
  children: 0,
  rooms: 1,
  sortBy: "relevance",
  allResults: [],
  displayedCount: 0,
  PAGE_SIZE: 6,
};

/* ============================================================
   CALENDAR
   ============================================================ */
let calViewYear  = new Date().getFullYear();
let calViewMonth = new Date().getMonth();   // 0-based
let calStep      = "checkin";               // "checkin" | "checkout"

const MONTHS_RO = ["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie",
                   "Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"];
const DAYS_RO   = ["Lu","Ma","Mi","Jo","Vi","Sâ","Du"];

function renderCalendar() {
  const cal = document.getElementById("bk-cal");
  if (!cal) return;

  // Show 2 months
  const months = [
    { year: calViewYear, month: calViewMonth },
    { year: calViewMonth === 11 ? calViewYear + 1 : calViewYear,
      month: (calViewMonth + 1) % 12 }
  ];

  cal.innerHTML = months.map((m, mi) => buildMonthHTML(m.year, m.month, mi)).join("");

  // Nav buttons
  cal.querySelectorAll(".bk-cal__nav").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const dir = btn.dataset.dir === "prev" ? -1 : 1;
      calViewMonth += dir;
      if (calViewMonth < 0)  { calViewMonth = 11; calViewYear--; }
      if (calViewMonth > 11) { calViewMonth = 0;  calViewYear++; }
      renderCalendar();
    });
  });

  // Day clicks
  cal.querySelectorAll(".bk-cal__day:not(.disabled):not(.empty)").forEach(day => {
    day.addEventListener("click", () => {
      const d = new Date(parseInt(day.dataset.year), parseInt(day.dataset.month), parseInt(day.dataset.day));
      if (calStep === "checkin") {
        State.checkIn  = d;
        State.checkOut = null;
        calStep = "checkout";
        updateCalStatus();
      } else {
        if (d <= State.checkIn) {
          State.checkIn = d;
          State.checkOut = null;
          calStep = "checkout";
        } else {
          State.checkOut = d;
          calStep = "checkin";
          closeAllDropdowns();
        }
      }
      updateDateDisplays();
      renderCalendar();
    });
  });
}

function buildMonthHTML(year, month, idx) {
  const now     = new Date(); now.setHours(0,0,0,0);
  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Shift so Monday=0
  const offset = (firstDow + 6) % 7;

  let cells = "";
  // Empty cells
  for (let i = 0; i < offset; i++) cells += `<div class="bk-cal__day empty"></div>`;
  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const isPast = date < now;
    let cls = "bk-cal__day";
    if (isPast) cls += " disabled";
    if (date.toDateString() === now.toDateString()) cls += " today";
    if (State.checkIn && date.toDateString() === State.checkIn.toDateString()) cls += " checkin";
    if (State.checkOut && date.toDateString() === State.checkOut.toDateString()) cls += " checkout";
    if (State.checkIn && State.checkOut && date > State.checkIn && date < State.checkOut) cls += " in-range";
    cells += `<div class="${cls}" data-year="${year}" data-month="${month}" data-day="${d}">${d}</div>`;
  }

  const prevBtn = idx === 0 ? `<button class="bk-cal__nav" data-dir="prev">‹</button>` : `<div></div>`;
  const nextBtn = idx === 1 ? `<button class="bk-cal__nav" data-dir="next">›</button>` : `<div></div>`;

  return `
    <div class="bk-cal__month">
      <div class="bk-cal__header">
        ${prevBtn}
        <span>${MONTHS_RO[month]} ${year}</span>
        ${nextBtn}
      </div>
      <div class="bk-cal__grid">
        ${DAYS_RO.map(d => `<div class="bk-cal__dow">${d}</div>`).join("")}
        ${cells}
      </div>
    </div>`;
}

function updateCalStatus() {
  const status = document.getElementById("bk-cal-status");
  const badge  = document.getElementById("bk-nights-badge");
  if (!status) return;
  if (!State.checkIn) {
    status.textContent = "Selectează check-in";
    badge && badge.classList.add("hidden");
  } else if (!State.checkOut) {
    status.textContent = "Acum selectează check-out";
    badge && badge.classList.add("hidden");
  } else {
    const nights = Math.round((State.checkOut - State.checkIn) / 86400000);
    status.textContent = "Perioadă selectată ✓";
    if (badge) { badge.classList.remove("hidden"); badge.textContent = `${nights} nopți`; }
  }
}

function formatDate(d) {
  if (!d) return "";
  return `${d.getDate()} ${MONTHS_RO[d.getMonth()].slice(0,3)} ${d.getFullYear()}`;
}

function updateDateDisplays() {
  const ci = document.getElementById("bk-checkin-display");
  const co = document.getElementById("bk-checkout-display");
  if (ci) { ci.textContent = State.checkIn ? formatDate(State.checkIn) : "Adaugă dată"; ci.className = "bk-field__value" + (State.checkIn ? "" : " placeholder"); }
  if (co) { co.textContent = State.checkOut ? formatDate(State.checkOut) : "Adaugă dată"; co.className = "bk-field__value" + (State.checkOut ? "" : " placeholder"); }
  updateCalStatus();
}

/* ============================================================
   GUESTS
   ============================================================ */
function updateGuestsDisplay() {
  const el = document.getElementById("bk-guests-display");
  if (!el) return;
  let txt = `${State.adults} adult${State.adults !== 1 ? "ți" : ""}`;
  if (State.children > 0) txt += ` · ${State.children} cop${State.children !== 1 ? "ii" : "il"}`;
  txt += ` · ${State.rooms} camer${State.rooms !== 1 ? "e" : "ă"}`;
  el.textContent = txt;
}

function setCounter(field, val) {
  const mins = { adults:1, children:0, rooms:1 };
  const maxs = { adults:16, children:10, rooms:8 };
  State[field] = Math.max(mins[field], Math.min(maxs[field], val));
  const el = document.getElementById(`${field === "adults" ? "adults" : field === "children" ? "children" : "rooms"}-val`);
  if (el) el.textContent = State[field];
  document.getElementById(`${field === "adults" ? "adults" : field === "children" ? "children" : "rooms"}-minus`).disabled = State[field] <= mins[field];
  updateGuestsDisplay();
}

/* ============================================================
   AUTOCOMPLETE
   ============================================================ */
function showAutocomplete(q) {
  const box = document.getElementById("bk-autocomplete");
  const input = document.getElementById("bk-dest-input");
  if (!box) return;
  if (!q || q.length < 1) { box.classList.remove("open"); return; }
  const results = DESTINATIONS.filter(d =>
    d.name.toLowerCase().includes(q.toLowerCase()) ||
    d.country.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 6);

  if (!results.length) { box.classList.remove("open"); return; }

  box.innerHTML = results.map(d => `
    <div class="bk-autocomplete__item" data-name="${d.name}">
      <span class="bk-autocomplete__icon">${d.icon}</span>
      <div>
        <span class="bk-autocomplete__name">${d.name}</span>
        <span class="bk-autocomplete__country">${d.flag} ${d.country} · ${d.type}</span>
      </div>
    </div>`).join("");

  box.querySelectorAll(".bk-autocomplete__item").forEach(item => {
    item.addEventListener("click", () => {
      selectDest(item.dataset.name);
    });
  });

  box.classList.add("open");
}

function selectDest(name) {
  State.dest = name;
  const input   = document.getElementById("bk-dest-input");
  const display = document.getElementById("bk-dest-display");
  const box     = document.getElementById("bk-autocomplete");
  if (input)   { input.value = name; input.blur(); }
  if (display) { display.textContent = name; display.className = "bk-field__value"; }
  if (box)     box.classList.remove("open");
  // Auto-open calendar
  openDropdown("bk-calendar-drop");
  calStep = "checkin";
  renderCalendar();
}

/* ============================================================
   DROPDOWN MANAGEMENT
   ============================================================ */
function openDropdown(id) {
  closeAllDropdowns();
  const el = document.getElementById(id);
  if (el) el.classList.add("open");
  const overlay = document.getElementById("bk-overlay");
  if (overlay) overlay.classList.add("open");
}

function closeAllDropdowns() {
  document.querySelectorAll(".bk-autocomplete, .bk-calendar-drop, .bk-guests-drop").forEach(el => el.classList.remove("open"));
  const overlay = document.getElementById("bk-overlay");
  if (overlay) overlay.classList.remove("open");
}

/* ============================================================
   SEARCH & FILTER
   ============================================================ */
async function doSearch() {
  const dest = State.dest.trim();
  if (!dest) { showToast("Introduceți o destinație! 📍"); return; }

  showSkeleton(true);
  showResults(false);

  // Simulate network delay for realism
  await new Promise(r => setTimeout(r, 800));

  // Filter DEMO_OFFERS
  let results = [...DEMO_OFFERS];

  // Filter by destination
  if (dest) {
    results = results.filter(o =>
      o.dest.toLowerCase().includes(dest.toLowerCase()) ||
      o.country.toLowerCase().includes(dest.toLowerCase())
    );
    // If no match, show all (user searched a valid destination not in demo)
    if (results.length === 0) results = [...DEMO_OFFERS];
  }

  // Filter by check-in month
  if (State.checkIn) {
    const ci = State.checkIn;
    results = results.filter(o => {
      if (!o.checkIn) return true;
      const d = new Date(o.checkIn);
      return d.getFullYear() === ci.getFullYear() && d.getMonth() === ci.getMonth();
    });
    if (results.length === 0) results = [...DEMO_OFFERS]; // fallback
  }

  // Filter by nights
  if (State.checkIn && State.checkOut) {
    const nights = Math.round((State.checkOut - State.checkIn) / 86400000);
    if (nights > 0) {
      const filtered = results.filter(o => Math.abs(o.nights - nights) <= 2);
      if (filtered.length > 0) results = filtered;
    }
  }

  // Sort
  results = sortOffers(results, State.sortBy);

  State.allResults    = results;
  State.displayedCount = 0;

  showSkeleton(false);
  showResults(true);
  renderCards(true);
  updateResultsMeta(dest, results.length);
  scrollToResults();
}

function sortOffers(arr, by) {
  const sorted = [...arr];
  if (by === "price-asc")  sorted.sort((a,b) => a.pricePerPerson - b.pricePerPerson);
  if (by === "price-desc") sorted.sort((a,b) => b.pricePerPerson - a.pricePerPerson);
  if (by === "rating")     sorted.sort((a,b) => b.rating - a.rating);
  return sorted;
}

function renderCards(reset = false) {
  const grid = document.getElementById("bk-cards");
  const empty = document.getElementById("bk-empty");
  const loadMore = document.getElementById("bk-load-more");
  if (!grid) return;

  if (reset) { grid.innerHTML = ""; State.displayedCount = 0; }

  const slice = State.allResults.slice(State.displayedCount, State.displayedCount + State.PAGE_SIZE);
  State.displayedCount += slice.length;

  if (slice.length === 0 && State.displayedCount === 0) {
    if (empty) empty.classList.add("show");
    if (loadMore) loadMore.classList.remove("show");
    return;
  }

  if (empty) empty.classList.remove("show");

  slice.forEach((offer, i) => {
    const card = buildCard(offer, i);
    grid.insertAdjacentHTML("beforeend", card);
  });

  // Load more visibility
  if (loadMore) {
    if (State.displayedCount < State.allResults.length) {
      loadMore.classList.add("show");
    } else {
      loadMore.classList.remove("show");
    }
  }
}

function buildCard(o, idx) {
  const stars = "★".repeat(o.stars) + "☆".repeat(5 - o.stars);
  const scoreLabel = o.rating >= 9 ? "Excepțional" : o.rating >= 8 ? "Foarte bun" : o.rating >= 7 ? "Bun" : "Decent";
  const nights = State.checkIn && State.checkOut
    ? Math.round((State.checkOut - State.checkIn) / 86400000)
    : o.nights;
  const total = o.pricePerPerson * State.adults;
  const tags  = (o.included || []).map(t => `<span class="bk-card__tag">✓ ${t}</span>`).join("");
  const avail = o.availability ? `<div class="bk-card__availability">⚠️ ${o.availability}</div>` : "";
  const badge = o.badgeLabel ? `<div class="bk-card__badge ${o.badge === "city-break" ? "" : "bk-card__badge--genius"}">${o.badgeLabel}</div>` : "";

  return `
  <article class="bk-card" style="animation-delay:${idx * 0.05}s" role="listitem">
    <div class="bk-card__img-wrap">
      <img src="${o.image}" alt="${o.name}" class="bk-card__img" loading="lazy" />
      ${badge}
    </div>
    <div class="bk-card__body">
      <div class="bk-card__top">
        <div>
          <div class="bk-card__name">${o.name}</div>
          <div class="bk-card__stars">${stars}</div>
        </div>
      </div>
      <div class="bk-card__location">📍 ${o.dest}, ${o.flag} ${o.country}</div>
      <div class="bk-card__type">${o.room}</div>
      <div class="bk-card__score-wrap">
        <div class="bk-card__score">${o.rating.toFixed(1)}</div>
        <div>
          <div class="bk-card__score-label">${scoreLabel}</div>
          <div class="bk-card__score-count">${o.reviews.toLocaleString("ro-RO")} recenzii</div>
        </div>
      </div>
      <div class="bk-card__included">${tags}</div>
    </div>
    <div class="bk-card__price-col">
      <div class="bk-card__nights">${nights} nopți · ${State.adults} adult${State.adults !== 1 ? "ți" : ""}</div>
      <div class="bk-card__price">${total.toLocaleString("ro-RO")} €</div>
      <div class="bk-card__price-sub">${o.pricePerPerson} € / persoană</div>
      ${avail}
      <button class="bk-card__cta" onclick="window.open('${o.offerUrl}','_blank')">Vezi oferta →</button>
    </div>
  </article>`;
}

function updateResultsMeta(dest, total) {
  const title = document.getElementById("bk-results-title");
  const meta  = document.getElementById("bk-results-meta");
  const nights = State.checkIn && State.checkOut
    ? Math.round((State.checkOut - State.checkIn) / 86400000) : "–";
  const period = State.checkIn
    ? `${formatDate(State.checkIn)}${State.checkOut ? " → " + formatDate(State.checkOut) : ""}`
    : "";
  if (title) title.textContent = `${total} oferte${dest ? " în " + dest : ""}`;
  if (meta)  meta.textContent  = `${period}${nights !== "–" ? " · " + nights + " nopți" : ""} · ${State.adults} adult${State.adults !== 1 ? "ți" : ""}`;
}

function showSkeleton(show) {
  const sk = document.getElementById("bk-skeleton");
  if (sk) sk.classList.toggle("show", show);
}

function showResults(show) {
  const sec = document.getElementById("bk-results-section");
  if (sec) sec.style.display = show ? "block" : "none";
}

function scrollToResults() {
  const el = document.getElementById("bk-results-section");
  if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
}

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg, duration = 3000) {
  const t = document.getElementById("bk-toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), duration);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  // ── DESTINATION INPUT ──
  const destInput = document.getElementById("bk-dest-input");
  const destDisplay = document.getElementById("bk-dest-display");

  if (destInput) {
    destInput.addEventListener("focus", () => {
      destInput.style.opacity = "1";
      if (destDisplay) destDisplay.style.display = "none";
    });
    destInput.addEventListener("blur", () => {
      setTimeout(() => {
        if (destDisplay) destDisplay.style.display = "";
        if (!State.dest) destInput.value = "";
      }, 150);
    });
    destInput.addEventListener("input", e => showAutocomplete(e.target.value));
    destInput.addEventListener("keydown", e => {
      if (e.key === "Enter") { selectDest(destInput.value); }
    });
  }

  document.getElementById("dest-field")?.addEventListener("click", () => {
    destInput?.focus();
  });

  // ── CALENDAR ──
  const checkinField = document.getElementById("checkin-field");
  const checkoutField = document.getElementById("checkout-field");
  const calDrop = document.getElementById("bk-calendar-drop");

  checkinField?.addEventListener("click", e => {
    e.stopPropagation();
    openDropdown("bk-calendar-drop");
    calStep = "checkin";
    renderCalendar();
  });
  checkoutField?.addEventListener("click", e => {
    e.stopPropagation();
    openDropdown("bk-calendar-drop");
    calStep = State.checkIn ? "checkout" : "checkin";
    renderCalendar();
  });

  document.getElementById("bk-cal-clear")?.addEventListener("click", e => {
    e.stopPropagation();
    State.checkIn = null; State.checkOut = null;
    calStep = "checkin";
    updateDateDisplays();
    renderCalendar();
  });

  // ── GUESTS ──
  const guestsField = document.getElementById("guests-field");
  guestsField?.addEventListener("click", e => {
    e.stopPropagation();
    openDropdown("bk-guests-drop");
  });

  [["adults","adults"],["children","children"],["rooms","rooms"]].forEach(([field, prefix]) => {
    document.getElementById(`${prefix}-plus`)?.addEventListener("click",  e => { e.stopPropagation(); setCounter(field, State[field] + 1); });
    document.getElementById(`${prefix}-minus`)?.addEventListener("click", e => { e.stopPropagation(); setCounter(field, State[field] - 1); });
  });
  document.getElementById("bk-guests-done")?.addEventListener("click", e => { e.stopPropagation(); closeAllDropdowns(); });

  // ── OVERLAY (close) ──
  document.getElementById("bk-overlay")?.addEventListener("click", closeAllDropdowns);

  // ── QUICK DESTINATIONS ──
  document.querySelectorAll(".bk-quick-dest").forEach(btn => {
    btn.addEventListener("click", () => selectDest(btn.dataset.dest));
  });

  // ── DESTINATION CARDS ──
  document.querySelectorAll(".destination-card__cta, .destination-card").forEach(el => {
    el.addEventListener("click", () => {
      const card = el.closest(".destination-card");
      if (card?.dataset.dest) selectDest(card.dataset.dest);
    });
  });

  // ── SEARCH BUTTON ──
  document.getElementById("bk-search-btn")?.addEventListener("click", doSearch);

  // ── SORT ──
  document.getElementById("bk-sort")?.addEventListener("change", e => {
    State.sortBy = e.target.value;
    State.allResults = sortOffers(State.allResults, State.sortBy);
    renderCards(true);
  });

  // ── LOAD MORE ──
  document.getElementById("bk-load-more-btn")?.addEventListener("click", () => renderCards(false));

  // ── HAMBURGER ──
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");
  hamburger?.addEventListener("click", () => {
    const open = !mobileNav.classList.contains("hidden");
    mobileNav.classList.toggle("hidden", open);
    hamburger.setAttribute("aria-expanded", String(!open));
  });

  // ── MOBILE NAV LINKS ──
  document.querySelectorAll(".mobile-nav__link").forEach(link => {
    link.addEventListener("click", () => mobileNav.classList.add("hidden"));
  });

  // ── INIT DISPLAYS ──
  updateGuestsDisplay();
  updateDateDisplays();

  // ── SERVICE WORKER ──
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
      .catch(err => console.warn("SW:", err));
  }

  console.log("✅ SmartTravel AI v3.0 ready | RAPIDAPI_KEY set ✓");
});
