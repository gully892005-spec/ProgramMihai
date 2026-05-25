/**
 * SmartTravel AI · app.js v4.0 – LIVE APIs via Cloudflare Worker
 * Înlocuiește WORKER_URL cu URL-ul tău după deploy pe Cloudflare.
 */

/* ============================================================
   ⚙️  SETEAZĂ URL-UL WORKER-ULUI DUPĂ DEPLOY
   Exemplu: "https://smarttravel.TU.workers.dev"
   ============================================================ */
const WORKER_URL = "https://smarttravel.gully892005.workers.dev"; // ← schimbă după deploy

const RAPIDAPI_KEY = "2c53b6cecbmshd2d367eb5471d47p1a90f8jsn50507c92fabc";

/* ============================================================
   DESTINATIONS AUTOCOMPLETE
   ============================================================ */
const DESTINATIONS = [
  { name:"Paris",       country:"Franța",    flag:"🇫🇷", icon:"🗼", type:"Oraș",   destId:"-1456928",  iata:"CDG" },
  { name:"Roma",        country:"Italia",    flag:"🇮🇹", icon:"🏛️", type:"Oraș",   destId:"-126693",   iata:"FCO" },
  { name:"Barcelona",   country:"Spania",    flag:"🇪🇸", icon:"🌊", type:"Oraș",   destId:"-372490",   iata:"BCN" },
  { name:"Praga",       country:"Cehia",     flag:"🇨🇿", icon:"🏰", type:"Oraș",   destId:"-553173",   iata:"PRG" },
  { name:"Amsterdam",   country:"Olanda",    flag:"🇳🇱", icon:"🌷", type:"Oraș",   destId:"-2140479",  iata:"AMS" },
  { name:"Viena",       country:"Austria",   flag:"🇦🇹", icon:"🎻", type:"Oraș",   destId:"-1995499",  iata:"VIE" },
  { name:"Londra",      country:"UK",        flag:"🇬🇧", icon:"🎡", type:"Oraș",   destId:"-2601889",  iata:"LHR" },
  { name:"Berlin",      country:"Germania",  flag:"🇩🇪", icon:"🐻", type:"Oraș",   destId:"-1746443",  iata:"BER" },
  { name:"Budapesta",   country:"Ungaria",   flag:"🇭🇺", icon:"🏰", type:"Oraș",   destId:"-850553",   iata:"BUD" },
  { name:"Lisabona",    country:"Portugalia",flag:"🇵🇹", icon:"🍷", type:"Oraș",   destId:"-2167973",  iata:"LIS" },
  { name:"Santorini",   country:"Grecia",    flag:"🇬🇷", icon:"🏝️", type:"Insulă", destId:"-827927",   iata:"JTR" },
  { name:"Mykonos",     country:"Grecia",    flag:"🇬🇷", icon:"🌅", type:"Insulă", destId:"-815085",   iata:"JMK" },
  { name:"Creta",       country:"Grecia",    flag:"🇬🇷", icon:"🐚", type:"Insulă", destId:"-819772",   iata:"HER" },
  { name:"Antalya",     country:"Turcia",    flag:"🇹🇷", icon:"☀️", type:"Litoral",destId:"-748104",   iata:"AYT" },
  { name:"Istanbul",    country:"Turcia",    flag:"🇹🇷", icon:"🕌", type:"Oraș",   destId:"-755070",   iata:"IST" },
  { name:"Dubai",       country:"EAU",       flag:"🇦🇪", icon:"✨", type:"Luxury", destId:"-782831",   iata:"DXB" },
  { name:"Marrakech",   country:"Maroc",     flag:"🇲🇦", icon:"🏜️", type:"Exotic", destId:"-38833",    iata:"RAK" },
  { name:"Tenerife",    country:"Spania",    flag:"🇪🇸", icon:"🌋", type:"Insulă", destId:"-390755",   iata:"TFS" },
  { name:"Mallorca",    country:"Spania",    flag:"🇪🇸", icon:"🏖️", type:"Insulă", destId:"-389257",   iata:"PMI" },
  { name:"Mamaia",      country:"România",   flag:"🇷🇴", icon:"🏖️", type:"Litoral",destId:"-601315",   iata:"CND" },
  { name:"Constanța",   country:"România",   flag:"🇷🇴", icon:"⚓", type:"Litoral",destId:"-601315",   iata:"CND" },
  { name:"Sinaia",      country:"România",   flag:"🇷🇴", icon:"⛷️", type:"Munte",  destId:"-594490",   iata:"OTP" },
  { name:"Brașov",      country:"România",   flag:"🇷🇴", icon:"🏔️", type:"Munte",  destId:"-575893",   iata:"OTP" },
  { name:"Bali",        country:"Indonezia", flag:"🇮🇩", icon:"🌺", type:"Exotic", destId:"-1079654",  iata:"DPS" },
  { name:"New York",    country:"SUA",       flag:"🇺🇸", icon:"🗽", type:"Oraș",   destId:"-74017",    iata:"JFK" },
  { name:"Bangkok",     country:"Thailanda", flag:"🇹🇭", icon:"🛕", type:"Exotic", destId:"-3077214",  iata:"BKK" },
];

/* ============================================================
   DEMO FALLBACK – afișat dacă API-ul nu răspunde
   ============================================================ */
const DEMO_OFFERS = [
  { id:"d1",  name:"Grand Hotel Eiffel",       dest:"Paris",     country:"Franța",    flag:"🇫🇷", stars:4, rating:8.7, reviews:2341, pricePerPerson:189, nights:3, checkIn:"2026-07-10", checkOut:"2026-07-13", image:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80", room:"Cameră Dublă Standard", included:["Mic dejun","Wi-Fi gratuit","Anulare gratuită"], badge:"🏙️", availability:"Ultimele 3 camere!", transport:"avion" },
  { id:"d2",  name:"Santorini Blue Suites",    dest:"Santorini", country:"Grecia",    flag:"🇬🇷", stars:5, rating:9.2, reviews:1876, pricePerPerson:599, nights:7, checkIn:"2026-08-01", checkOut:"2026-08-08", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", room:"Suite cu vedere la mare", included:["Mic dejun & cină","Transfer","Piscină"], badge:"🏝️", availability:"", transport:"avion" },
  { id:"d3",  name:"Hotel Plaza Roma",         dest:"Roma",      country:"Italia",    flag:"🇮🇹", stars:4, rating:8.4, reviews:3102, pricePerPerson:149, nights:4, checkIn:"2026-06-15", checkOut:"2026-06-19", image:"https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80", room:"Cameră Superioară", included:["Wi-Fi","Anulare gratuită"], badge:"🏛️", availability:"", transport:"avion" },
  { id:"d4",  name:"Rixos Premium Antalya",    dest:"Antalya",   country:"Turcia",    flag:"🇹🇷", stars:5, rating:9.0, reviews:4521, pricePerPerson:459, nights:7, checkIn:"2026-07-20", checkOut:"2026-07-27", image:"https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80", room:"All Inclusive", included:["All Inclusive","Plajă","Spa","Animație"], badge:"🔥", availability:"Ofertă limitată!", transport:"avion" },
  { id:"d5",  name:"Hotel Arts Barcelona",     dest:"Barcelona", country:"Spania",    flag:"🇪🇸", stars:5, rating:9.1, reviews:2890, pricePerPerson:299, nights:5, checkIn:"2026-09-10", checkOut:"2026-09-15", image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", room:"Cameră Ocean View", included:["Mic dejun","Wi-Fi","Parcare"], badge:"🌊", availability:"", transport:"avion" },
  { id:"d6",  name:"Mosaic House Prague",      dest:"Praga",     country:"Cehia",     flag:"🇨🇿", stars:4, rating:8.8, reviews:1654, pricePerPerson:129, nights:3, checkIn:"2026-10-02", checkOut:"2026-10-05", image:"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=600&q=80", room:"Cameră Deluxe", included:["Mic dejun","Wi-Fi"], badge:"🏰", availability:"", transport:"avion" },
  { id:"d7",  name:"JW Marriott Dubai",        dest:"Dubai",     country:"EAU",       flag:"🇦🇪", stars:5, rating:9.4, reviews:3210, pricePerPerson:899, nights:5, checkIn:"2026-11-15", checkOut:"2026-11-20", image:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", room:"Deluxe Marina View", included:["Mic dejun","Piscină","Spa","Transfer"], badge:"✨", availability:"", transport:"avion" },
  { id:"d8",  name:"Mamaia Beach Resort",      dest:"Mamaia",    country:"România",   flag:"🇷🇴", stars:4, rating:8.2, reviews:987,  pricePerPerson:89,  nights:7, checkIn:"2026-08-10", checkOut:"2026-08-17", image:"https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80", room:"Cameră cu vedere la mare", included:["Mic dejun","Plajă","Parcare"], badge:"🏖️", availability:"", transport:"masina" },
  { id:"d9",  name:"W Verbier Sinaia",         dest:"Sinaia",    country:"România",   flag:"🇷🇴", stars:5, rating:8.9, reviews:654,  pricePerPerson:249, nights:5, checkIn:"2026-12-20", checkOut:"2026-12-25", image:"https://images.unsplash.com/photo-1548777123-e216912f42cc?w=600&q=80", room:"Suite Panoramică", included:["Demipensiune","Ski pass","Echipament"], badge:"⛷️", availability:"Ultimele locuri!", transport:"masina" },
  { id:"d10", name:"Hilton Amsterdam",         dest:"Amsterdam", country:"Olanda",    flag:"🇳🇱", stars:5, rating:8.6, reviews:2100, pricePerPerson:229, nights:4, checkIn:"2026-09-05", checkOut:"2026-09-09", image:"https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80", room:"Canal View", included:["Wi-Fi","Biciclete","Mic dejun"], badge:"🌷", availability:"", transport:"avion" },
  { id:"d11", name:"Bosphorus Palace Istanbul",dest:"Istanbul",  country:"Turcia",    flag:"🇹🇷", stars:5, rating:9.0, reviews:1789, pricePerPerson:199, nights:4, checkIn:"2026-10-15", checkOut:"2026-10-19", image:"https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80", room:"Bosphorus View", included:["Mic dejun","Wi-Fi","Tur"], badge:"🕌", availability:"", transport:"avion" },
  { id:"d12", name:"Atlantis Bali Villa",      dest:"Bali",      country:"Indonezia", flag:"🇮🇩", stars:5, rating:9.3, reviews:4320, pricePerPerson:799, nights:10,checkIn:"2026-06-01", checkOut:"2026-06-11", image:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", room:"Villa piscină privată", included:["All Inclusive","Spa","Transfer","Activități"], badge:"🌺", availability:"", transport:"avion" },
];

/* ============================================================
   STATE
   ============================================================ */
const State = {
  dest: "", destId: "", destIata: "",
  checkIn: null, checkOut: null,
  adults: 2, children: 0, rooms: 1,
  sortBy: "relevance",
  allResults: [], displayedCount: 0, PAGE_SIZE: 6,
  isLive: false,
};

const MONTHS_RO = ["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"];
const DAYS_RO   = ["Lu","Ma","Mi","Jo","Vi","Sâ","Du"];
let calViewYear  = new Date().getFullYear();
let calViewMonth = new Date().getMonth();
let calStep      = "checkin";

/* ============================================================
   API CALLS via WORKER
   ============================================================ */
async function apiGet(route, params = {}) {
  const url = new URL(WORKER_URL + route);
  Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Worker error ${res.status}`);
  return res.json();
}

async function searchHotelsLive() {
  const destInfo = DESTINATIONS.find(d => d.name === State.dest);
  const destId   = destInfo?.destId || "-1456928";

  const params = {
    dest_id:        destId,
    search_type:    "CITY",
    arrival_date:   fmtDate(State.checkIn)  || getTomorrow(),
    departure_date: fmtDate(State.checkOut) || getNextWeek(),
    adults:         State.adults,
    room_qty:       State.rooms,
  };

  const data   = await apiGet("/hotels", params);
  const hotels = data?.data?.hotels || data?.hotels || [];

  return hotels.slice(0, 20).map((h, i) => {
    const prop    = h?.property || h;
    const price   = prop?.priceBreakdown?.grossPrice?.value || prop?.minCost || 0;
    const nights  = State.checkIn && State.checkOut
      ? Math.round((State.checkOut - State.checkIn) / 86400000) : 3;
    const perNight = nights > 0 ? Math.round(price / nights) : Math.round(price);

    return {
      id:            `live_${i}`,
      name:          prop?.name || "Hotel",
      dest:          State.dest,
      country:       destInfo?.country || "",
      flag:          destInfo?.flag || "🌍",
      stars:         Math.round(prop?.propertyClass || prop?.reviewScore / 2 || 3),
      rating:        parseFloat(prop?.reviewScore || 7.5),
      reviews:       prop?.reviewCount || 0,
      pricePerPerson:Math.round(perNight / State.adults),
      nights,
      checkIn:       fmtDate(State.checkIn),
      checkOut:      fmtDate(State.checkOut),
      image:         prop?.photoUrls?.[0] || prop?.mainPhotoUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
      room:          prop?.unitConfiguration?.[0]?.unitName || "Cameră standard",
      included:      buildIncluded(prop),
      badge:         "🏨",
      availability:  prop?.isAvailable === false ? "Indisponibil" : "",
      offerUrl:      prop?.reviewScoreWord ? `https://booking.com` : "#",
      transport:     "avion",
      isLive:        true,
    };
  });
}

function buildIncluded(prop) {
  const tags = [];
  if (prop?.mealPlanIncluded)        tags.push("Mic dejun inclus");
  if (prop?.freeCancellation)        tags.push("Anulare gratuită");
  if (prop?.hasFreeParkingContext)   tags.push("Parcare gratuită");
  if (prop?.hasWifi)                 tags.push("Wi-Fi gratuit");
  if (tags.length === 0)             tags.push("Wi-Fi gratuit");
  return tags;
}

/* ============================================================
   CALENDAR
   ============================================================ */
function renderCalendar() {
  const cal = document.getElementById("bk-cal");
  if (!cal) return;
  const months = [
    { year: calViewYear, month: calViewMonth },
    { year: calViewMonth === 11 ? calViewYear+1 : calViewYear, month: (calViewMonth+1)%12 }
  ];
  cal.innerHTML = months.map((m,i) => buildMonthHTML(m.year, m.month, i)).join("");
  cal.querySelectorAll(".bk-cal__nav").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const dir = btn.dataset.dir === "prev" ? -1 : 1;
      calViewMonth += dir;
      if (calViewMonth < 0)  { calViewMonth=11; calViewYear--; }
      if (calViewMonth > 11) { calViewMonth=0;  calViewYear++; }
      renderCalendar();
    });
  });
  cal.querySelectorAll(".bk-cal__day:not(.disabled):not(.empty)").forEach(day => {
    day.addEventListener("click", () => {
      const d = new Date(+day.dataset.year, +day.dataset.month, +day.dataset.day);
      if (calStep === "checkin") {
        State.checkIn = d; State.checkOut = null; calStep = "checkout";
      } else {
        if (d <= State.checkIn) { State.checkIn = d; State.checkOut = null; calStep = "checkout"; }
        else { State.checkOut = d; calStep = "checkin"; closeAllDropdowns(); }
      }
      updateDateDisplays(); renderCalendar();
    });
  });
}

function buildMonthHTML(year, month, idx) {
  const now = new Date(); now.setHours(0,0,0,0);
  const firstDow   = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const offset      = (firstDow+6)%7;
  let cells = "";
  for (let i=0;i<offset;i++) cells += `<div class="bk-cal__day empty"></div>`;
  for (let d=1;d<=daysInMonth;d++) {
    const date = new Date(year,month,d);
    let cls = "bk-cal__day";
    if (date < now)                                                              cls += " disabled";
    if (date.toDateString()===now.toDateString())                                cls += " today";
    if (State.checkIn  && date.toDateString()===State.checkIn.toDateString())   cls += " checkin";
    if (State.checkOut && date.toDateString()===State.checkOut.toDateString())  cls += " checkout";
    if (State.checkIn && State.checkOut && date>State.checkIn && date<State.checkOut) cls += " in-range";
    cells += `<div class="${cls}" data-year="${year}" data-month="${month}" data-day="${d}">${d}</div>`;
  }
  const prev = idx===0 ? `<button class="bk-cal__nav" data-dir="prev">‹</button>` : `<div></div>`;
  const next = idx===1 ? `<button class="bk-cal__nav" data-dir="next">›</button>` : `<div></div>`;
  return `<div class="bk-cal__month">
    <div class="bk-cal__header">${prev}<span>${MONTHS_RO[month]} ${year}</span>${next}</div>
    <div class="bk-cal__grid">
      ${DAYS_RO.map(d=>`<div class="bk-cal__dow">${d}</div>`).join("")}${cells}
    </div>
  </div>`;
}

function updateCalStatus() {
  const status = document.getElementById("bk-cal-status");
  const badge  = document.getElementById("bk-nights-badge");
  if (!State.checkIn) { if(status) status.textContent="Selectează check-in"; if(badge) badge.classList.add("hidden"); }
  else if (!State.checkOut) { if(status) status.textContent="Acum selectează check-out"; if(badge) badge.classList.add("hidden"); }
  else {
    const n = Math.round((State.checkOut-State.checkIn)/86400000);
    if(status) status.textContent="Perioadă selectată ✓";
    if(badge) { badge.classList.remove("hidden"); badge.textContent=`${n} nopți`; }
  }
}

function formatDate(d) {
  if (!d) return "";
  return `${d.getDate()} ${MONTHS_RO[d.getMonth()].slice(0,3)} ${d.getFullYear()}`;
}
function fmtDate(d) {
  if (!d) return "";
  return d.toISOString().split("T")[0];
}
function getTomorrow() { const d=new Date();d.setDate(d.getDate()+1);return fmtDate(d); }
function getNextWeek()  { const d=new Date();d.setDate(d.getDate()+8);return fmtDate(d); }

function updateDateDisplays() {
  const ci=document.getElementById("bk-checkin-display");
  const co=document.getElementById("bk-checkout-display");
  if(ci){ci.textContent=State.checkIn?formatDate(State.checkIn):"Adaugă dată";ci.className="bk-field__value"+(State.checkIn?"":" placeholder");}
  if(co){co.textContent=State.checkOut?formatDate(State.checkOut):"Adaugă dată";co.className="bk-field__value"+(State.checkOut?"":" placeholder");}
  updateCalStatus();
}

/* ============================================================
   GUESTS
   ============================================================ */
function updateGuestsDisplay() {
  const el=document.getElementById("bk-guests-display");
  if(!el)return;
  let txt=`${State.adults} adult${State.adults!==1?"ți":""}`;
  if(State.children>0) txt+=` · ${State.children} cop${State.children!==1?"ii":"il"}`;
  txt+=` · ${State.rooms} camer${State.rooms!==1?"e":"ă"}`;
  el.textContent=txt;
}
function setCounter(field,val) {
  const mins={adults:1,children:0,rooms:1}, maxs={adults:16,children:10,rooms:8};
  State[field]=Math.max(mins[field],Math.min(maxs[field],val));
  const id=field==="adults"?"adults":field==="children"?"children":"rooms";
  const el=document.getElementById(`${id}-val`);
  if(el) el.textContent=State[field];
  document.getElementById(`${id}-minus`).disabled=State[field]<=mins[field];
  updateGuestsDisplay();
}

/* ============================================================
   AUTOCOMPLETE
   ============================================================ */
function showAutocomplete(q) {
  const box=document.getElementById("bk-autocomplete");
  if(!box)return;
  if(!q||q.length<1){box.classList.remove("open");return;}
  const results=DESTINATIONS.filter(d=>
    d.name.toLowerCase().includes(q.toLowerCase())||
    d.country.toLowerCase().includes(q.toLowerCase())
  ).slice(0,7);
  if(!results.length){box.classList.remove("open");return;}
  box.innerHTML=results.map(d=>`
    <div class="bk-autocomplete__item" data-name="${d.name}">
      <span class="bk-autocomplete__icon">${d.icon}</span>
      <div>
        <span class="bk-autocomplete__name">${d.name}</span>
        <span class="bk-autocomplete__country">${d.flag} ${d.country} · ${d.type}</span>
      </div>
    </div>`).join("");
  box.querySelectorAll(".bk-autocomplete__item").forEach(item=>{
    item.addEventListener("click",()=>selectDest(item.dataset.name));
  });
  box.classList.add("open");
}

function selectDest(name) {
  State.dest=name;
  const found=DESTINATIONS.find(d=>d.name===name);
  if(found){State.destId=found.destId||""; State.destIata=found.iata||"";}
  const input=document.getElementById("bk-dest-input");
  const display=document.getElementById("bk-dest-display");
  const box=document.getElementById("bk-autocomplete");
  if(input){input.value=name;}
  if(display){display.textContent=name;display.className="bk-field__value";}
  if(box) box.classList.remove("open");
  openDropdown("bk-calendar-drop");
  calStep="checkin"; renderCalendar();
}

/* ============================================================
   DROPDOWNS
   ============================================================ */
function openDropdown(id) {
  closeAllDropdowns();
  document.getElementById(id)?.classList.add("open");
  document.getElementById("bk-overlay")?.classList.add("open");
}
function closeAllDropdowns() {
  document.querySelectorAll(".bk-autocomplete,.bk-calendar-drop,.bk-guests-drop")
    .forEach(el=>el.classList.remove("open"));
  document.getElementById("bk-overlay")?.classList.remove("open");
}

/* ============================================================
   MAIN SEARCH
   ============================================================ */
async function doSearch() {
  if (!State.dest.trim()) { showToast("Introduceți o destinație! 📍"); return; }
  if (!State.checkIn)     { showToast("Selectați data de check-in! 📅"); openDropdown("bk-calendar-drop"); renderCalendar(); return; }
  if (!State.checkOut)    { showToast("Selectați data de check-out! 📅"); openDropdown("bk-calendar-drop"); calStep="checkout"; renderCalendar(); return; }

  showSkeleton(true);
  showResultsSection(false);

  let results = [];
  State.isLive = false;

  // Încearcă API-ul live via Worker
  try {
    showStatusBar("🔄 Se caută oferte live...");
    results = await searchHotelsLive();
    if (results.length > 0) {
      State.isLive = true;
      showStatusBar(`✅ ${results.length} oferte găsite live`);
    } else {
      showStatusBar("ℹ️ Nicio ofertă live — se afișează oferte similare");
    }
  } catch(err) {
    console.warn("Worker error:", err.message);
    showStatusBar("⚠️ API indisponibil — se afișează oferte demo");
  }

  // Fallback la demo dacă live nu are rezultate
  if (results.length === 0) {
    results = filterDemo();
  }

  results = sortOffers(results, State.sortBy);
  State.allResults = results;
  State.displayedCount = 0;

  showSkeleton(false);
  showResultsSection(true);
  renderCards(true);
  updateResultsMeta();
  scrollToResults();
}

function filterDemo() {
  let r = [...DEMO_OFFERS];
  if (State.dest) {
    const filtered = r.filter(o => o.dest.toLowerCase().includes(State.dest.toLowerCase()));
    if (filtered.length > 0) r = filtered;
  }
  return r;
}

function sortOffers(arr, by) {
  const s=[...arr];
  if(by==="price-asc")  s.sort((a,b)=>a.pricePerPerson-b.pricePerPerson);
  if(by==="price-desc") s.sort((a,b)=>b.pricePerPerson-a.pricePerPerson);
  if(by==="rating")     s.sort((a,b)=>b.rating-a.rating);
  return s;
}

/* ============================================================
   RENDER CARDS
   ============================================================ */
function renderCards(reset=false) {
  const grid=document.getElementById("bk-cards");
  const empty=document.getElementById("bk-empty");
  const loadMore=document.getElementById("bk-load-more");
  if(!grid)return;
  if(reset){grid.innerHTML="";State.displayedCount=0;}
  const slice=State.allResults.slice(State.displayedCount,State.displayedCount+State.PAGE_SIZE);
  State.displayedCount+=slice.length;
  if(slice.length===0&&State.displayedCount===0){
    if(empty) empty.classList.add("show");
    if(loadMore) loadMore.classList.remove("show");
    return;
  }
  if(empty) empty.classList.remove("show");
  slice.forEach((o,i)=>grid.insertAdjacentHTML("beforeend",buildCard(o,i)));
  if(loadMore) loadMore.classList.toggle("show", State.displayedCount<State.allResults.length);
}

function buildCard(o,idx) {
  const stars="★".repeat(Math.min(5,Math.max(0,o.stars)))+"☆".repeat(Math.max(0,5-o.stars));
  const scoreLabel=o.rating>=9?"Excepțional":o.rating>=8?"Foarte bun":o.rating>=7?"Bun":"OK";
  const nights=State.checkIn&&State.checkOut?Math.round((State.checkOut-State.checkIn)/86400000):o.nights||3;
  const total=o.pricePerPerson*State.adults;
  const tags=(o.included||[]).map(t=>`<span class="bk-card__tag">✓ ${t}</span>`).join("");
  const avail=o.availability?`<div class="bk-card__availability">⚠️ ${o.availability}</div>`:"";
  const liveBadge=o.isLive?`<span style="background:#0a3;color:#fff;font-size:0.6rem;padding:2px 6px;border-radius:4px;margin-left:6px;">LIVE</span>`:"";

  return `
  <article class="bk-card" style="animation-delay:${idx*0.05}s">
    <div class="bk-card__img-wrap">
      <img src="${o.image}" alt="${o.name}" class="bk-card__img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'"/>
      ${o.badge?`<div class="bk-card__badge">${o.badge}</div>`:""}
    </div>
    <div class="bk-card__body">
      <div class="bk-card__name">${o.name}${liveBadge}</div>
      <div class="bk-card__stars">${stars}</div>
      <div class="bk-card__location">📍 ${o.dest}${o.flag?" · "+o.flag+" "+o.country:""}</div>
      <div class="bk-card__type">${o.room||"Cameră standard"}</div>
      <div class="bk-card__score-wrap">
        <div class="bk-card__score">${(+o.rating).toFixed(1)}</div>
        <div>
          <div class="bk-card__score-label">${scoreLabel}</div>
          <div class="bk-card__score-count">${(o.reviews||0).toLocaleString("ro-RO")} recenzii</div>
        </div>
      </div>
      <div class="bk-card__included">${tags}</div>
    </div>
    <div class="bk-card__price-col">
      <div class="bk-card__nights">${nights} nopți · ${State.adults} pers.</div>
      <div class="bk-card__price">${total.toLocaleString("ro-RO")} €</div>
      <div class="bk-card__price-sub">${o.pricePerPerson} € / pers.</div>
      ${avail}
      <button class="bk-card__cta" onclick="window.open('${o.offerUrl||"#"}','_blank')">
        ${o.isLive?"Rezervă acum →":"Vezi oferta →"}
      </button>
    </div>
  </article>`;
}

function updateResultsMeta() {
  const title=document.getElementById("bk-results-title");
  const meta=document.getElementById("bk-results-meta");
  const nights=State.checkIn&&State.checkOut?Math.round((State.checkOut-State.checkIn)/86400000):0;
  const liveTag=State.isLive?" · 🟢 Live":"· ⚪ Demo";
  if(title) title.textContent=`${State.allResults.length} oferte în ${State.dest}`;
  if(meta)  meta.textContent=`${formatDate(State.checkIn)} → ${formatDate(State.checkOut)} · ${nights} nopți · ${State.adults} pers.${liveTag}`;
}

/* ============================================================
   UI HELPERS
   ============================================================ */
function showSkeleton(show) { document.getElementById("bk-skeleton")?.classList.toggle("show",show); }
function showResultsSection(show) { const s=document.getElementById("bk-results-section"); if(s) s.style.display=show?"block":"none"; }
function scrollToResults() { document.getElementById("bk-results-section")?.scrollIntoView({behavior:"smooth",block:"start"}); }
function showStatusBar(msg) {
  let bar=document.getElementById("bk-status-bar");
  if(!bar){bar=document.createElement("div");bar.id="bk-status-bar";bar.style.cssText="position:fixed;top:0;left:0;right:0;background:#003580;color:#fff;text-align:center;padding:8px;font-size:0.8rem;z-index:9999;font-weight:600;";document.body.prepend(bar);}
  bar.textContent=msg;
  clearTimeout(bar._t);
  bar._t=setTimeout(()=>bar.remove(),4000);
}
function showToast(msg,d=3000) {
  const t=document.getElementById("bk-toast");
  if(!t)return;
  t.textContent=msg; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),d);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  const destInput=document.getElementById("bk-dest-input");
  const destDisplay=document.getElementById("bk-dest-display");

  if(destInput){
    destInput.addEventListener("focus",()=>{destInput.style.opacity="1";if(destDisplay)destDisplay.style.display="none";});
    destInput.addEventListener("blur",()=>{setTimeout(()=>{if(destDisplay)destDisplay.style.display="";if(!State.dest)destInput.value="";},150);});
    destInput.addEventListener("input",e=>showAutocomplete(e.target.value));
    destInput.addEventListener("keydown",e=>{if(e.key==="Enter"&&destInput.value)selectDest(destInput.value);});
  }
  document.getElementById("dest-field")?.addEventListener("click",()=>destInput?.focus());

  document.getElementById("checkin-field")?.addEventListener("click",e=>{e.stopPropagation();openDropdown("bk-calendar-drop");calStep="checkin";renderCalendar();});
  document.getElementById("checkout-field")?.addEventListener("click",e=>{e.stopPropagation();openDropdown("bk-calendar-drop");calStep=State.checkIn?"checkout":"checkin";renderCalendar();});
  document.getElementById("bk-cal-clear")?.addEventListener("click",e=>{e.stopPropagation();State.checkIn=null;State.checkOut=null;calStep="checkin";updateDateDisplays();renderCalendar();});

  document.getElementById("guests-field")?.addEventListener("click",e=>{e.stopPropagation();openDropdown("bk-guests-drop");});
  [["adults","adults"],["children","children"],["rooms","rooms"]].forEach(([f,p])=>{
    document.getElementById(`${p}-plus`)?.addEventListener("click",e=>{e.stopPropagation();setCounter(f,State[f]+1);});
    document.getElementById(`${p}-minus`)?.addEventListener("click",e=>{e.stopPropagation();setCounter(f,State[f]-1);});
  });
  document.getElementById("bk-guests-done")?.addEventListener("click",e=>{e.stopPropagation();closeAllDropdowns();});

  document.getElementById("bk-overlay")?.addEventListener("click",closeAllDropdowns);

  document.querySelectorAll(".bk-quick-dest").forEach(btn=>btn.addEventListener("click",()=>selectDest(btn.dataset.dest)));
  document.querySelectorAll(".destination-card").forEach(el=>el.addEventListener("click",()=>{const d=el.dataset.dest;if(d)selectDest(d);}));

  document.getElementById("bk-search-btn")?.addEventListener("click",doSearch);
  document.getElementById("bk-sort")?.addEventListener("change",e=>{State.sortBy=e.target.value;State.allResults=sortOffers(State.allResults,State.sortBy);renderCards(true);});
  document.getElementById("bk-load-more-btn")?.addEventListener("click",()=>renderCards(false));

  document.getElementById("hamburger")?.addEventListener("click",()=>{
    const nav=document.getElementById("mobile-nav");
    nav?.classList.toggle("hidden");
  });
  document.querySelectorAll(".mobile-nav__link").forEach(l=>l.addEventListener("click",()=>document.getElementById("mobile-nav")?.classList.add("hidden")));

  updateGuestsDisplay();
  updateDateDisplays();

  if("serviceWorker" in navigator) navigator.serviceWorker.register("service-worker.js").catch(()=>{});

  console.log("✅ SmartTravel AI v4.0 | Worker:",WORKER_URL);
});
