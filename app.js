/**
 * SmartTravel AI · app.js v5.0
 * Cazări via Cloudflare Worker + Zboruri Flexibile via SkyScanner RapidAPI
 */

const WORKER_URL   = "https://smarttravel.gully892005.workers.dev";
const RAPIDAPI_KEY = "2c53b6cecbmshd2d367eb5471d47p1a90f8jsn50507c92fabc";

/* ============================================================
   DESTINATIONS
   ============================================================ */
const DESTINATIONS = [
  { name:"Paris",       country:"Franța",    flag:"🇫🇷", icon:"🗼", type:"Oraș",   destId:"-1456928",  iata:"CDG", iataFrom:"OTP" },
  { name:"Roma",        country:"Italia",    flag:"🇮🇹", icon:"🏛️", type:"Oraș",   destId:"-126693",   iata:"FCO", iataFrom:"OTP" },
  { name:"Barcelona",   country:"Spania",    flag:"🇪🇸", icon:"🌊", type:"Oraș",   destId:"-372490",   iata:"BCN", iataFrom:"OTP" },
  { name:"Praga",       country:"Cehia",     flag:"🇨🇿", icon:"🏰", type:"Oraș",   destId:"-553173",   iata:"PRG", iataFrom:"OTP" },
  { name:"Amsterdam",   country:"Olanda",    flag:"🇳🇱", icon:"🌷", type:"Oraș",   destId:"-2140479",  iata:"AMS", iataFrom:"OTP" },
  { name:"Viena",       country:"Austria",   flag:"🇦🇹", icon:"🎻", type:"Oraș",   destId:"-1995499",  iata:"VIE", iataFrom:"OTP" },
  { name:"Londra",      country:"UK",        flag:"🇬🇧", icon:"🎡", type:"Oraș",   destId:"-2601889",  iata:"LHR", iataFrom:"OTP" },
  { name:"Berlin",      country:"Germania",  flag:"🇩🇪", icon:"🐻", type:"Oraș",   destId:"-1746443",  iata:"BER", iataFrom:"OTP" },
  { name:"Budapesta",   country:"Ungaria",   flag:"🇭🇺", icon:"🏰", type:"Oraș",   destId:"-850553",   iata:"BUD", iataFrom:"OTP" },
  { name:"Lisabona",    country:"Portugalia",flag:"🇵🇹", icon:"🍷", type:"Oraș",   destId:"-2167973",  iata:"LIS", iataFrom:"OTP" },
  { name:"Santorini",   country:"Grecia",    flag:"🇬🇷", icon:"🏝️", type:"Insulă", destId:"-827927",   iata:"JTR", iataFrom:"OTP" },
  { name:"Mykonos",     country:"Grecia",    flag:"🇬🇷", icon:"🌅", type:"Insulă", destId:"-815085",   iata:"JMK", iataFrom:"OTP" },
  { name:"Creta",       country:"Grecia",    flag:"🇬🇷", icon:"🐚", type:"Insulă", destId:"-819772",   iata:"HER", iataFrom:"OTP" },
  { name:"Antalya",     country:"Turcia",    flag:"🇹🇷", icon:"☀️", type:"Litoral",destId:"-748104",   iata:"AYT", iataFrom:"OTP" },
  { name:"Istanbul",    country:"Turcia",    flag:"🇹🇷", icon:"🕌", type:"Oraș",   destId:"-755070",   iata:"IST", iataFrom:"OTP" },
  { name:"Dubai",       country:"EAU",       flag:"🇦🇪", icon:"✨", type:"Luxury", destId:"-782831",   iata:"DXB", iataFrom:"OTP" },
  { name:"Marrakech",   country:"Maroc",     flag:"🇲🇦", icon:"🏜️", type:"Exotic", destId:"-38833",    iata:"RAK", iataFrom:"OTP" },
  { name:"Tenerife",    country:"Spania",    flag:"🇪🇸", icon:"🌋", type:"Insulă", destId:"-390755",   iata:"TFS", iataFrom:"OTP" },
  { name:"Mallorca",    country:"Spania",    flag:"🇪🇸", icon:"🏖️", type:"Insulă", destId:"-389257",   iata:"PMI", iataFrom:"OTP" },
  { name:"Mamaia",      country:"România",   flag:"🇷🇴", icon:"🏖️", type:"Litoral",destId:"-601315",   iata:"CND", iataFrom:"OTP" },
  { name:"Constanța",   country:"România",   flag:"🇷🇴", icon:"⚓", type:"Litoral",destId:"-601315",   iata:"CND", iataFrom:"OTP" },
  { name:"Sinaia",      country:"România",   flag:"🇷🇴", icon:"⛷️", type:"Munte",  destId:"-594490",   iata:"OTP", iataFrom:"OTP" },
  { name:"Brașov",      country:"România",   flag:"🇷🇴", icon:"🏔️", type:"Munte",  destId:"-575893",   iata:"OTP", iataFrom:"OTP" },
  { name:"Bali",        country:"Indonezia", flag:"🇮🇩", icon:"🌺", type:"Exotic", destId:"-1079654",  iata:"DPS", iataFrom:"OTP" },
  { name:"New York",    country:"SUA",       flag:"🇺🇸", icon:"🗽", type:"Oraș",   destId:"-74017",    iata:"JFK", iataFrom:"OTP" },
  { name:"Bangkok",     country:"Thailanda", flag:"🇹🇭", icon:"🛕", type:"Exotic", destId:"-3077214",  iata:"BKK", iataFrom:"OTP" },
];

/* ============================================================
   DEMO HOTELS FALLBACK
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
   STATE – HOTELS
   ============================================================ */
const State = {
  dest:"", destId:"", destIata:"",
  checkIn:null, checkOut:null,
  adults:2, children:0, rooms:1,
  sortBy:"relevance",
  allResults:[], displayedCount:0, PAGE_SIZE:6,
  isLive:false,
};

/* ============================================================
   STATE – FLIGHTS
   ============================================================ */
const FlightState = {
  fromIata: "OTP",
  fromName: "București (OTP)",
  toIata:   "",
  toName:   "",
  mode:     "month",       // "month" | "interval"
  // mode=month
  month:    null,          // 0-11
  year:     null,
  duration: 3,             // zile
  // mode=interval
  dateFrom: null,
  dateTo:   null,
  intervalDuration: 3,
  adults:   1,
  results:  [],
  loading:  false,
};

const MONTHS_RO = ["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"];
const DAYS_RO   = ["Lu","Ma","Mi","Jo","Vi","Sâ","Du"];
let calViewYear  = new Date().getFullYear();
let calViewMonth = new Date().getMonth();
let calStep      = "checkin";

/* ============================================================
   AIRPORTS pentru autocomplete zboruri
   ============================================================ */
const AIRPORTS = [
  { iata:"OTP", name:"București Henri Coandă", city:"București", country:"România",   flag:"🇷🇴" },
  { iata:"BBU", name:"București Băneasa",       city:"București", country:"România",   flag:"🇷🇴" },
  { iata:"CDG", name:"Paris Charles de Gaulle", city:"Paris",     country:"Franța",    flag:"🇫🇷" },
  { iata:"ORY", name:"Paris Orly",              city:"Paris",     country:"Franța",    flag:"🇫🇷" },
  { iata:"FCO", name:"Roma Fiumicino",          city:"Roma",      country:"Italia",    flag:"🇮🇹" },
  { iata:"BCN", name:"Barcelona El Prat",       city:"Barcelona", country:"Spania",    flag:"🇪🇸" },
  { iata:"PRG", name:"Praga Václav Havel",      city:"Praga",     country:"Cehia",     flag:"🇨🇿" },
  { iata:"AMS", name:"Amsterdam Schiphol",      city:"Amsterdam", country:"Olanda",    flag:"🇳🇱" },
  { iata:"VIE", name:"Viena",                   city:"Viena",     country:"Austria",   flag:"🇦🇹" },
  { iata:"LHR", name:"Londra Heathrow",         city:"Londra",    country:"UK",        flag:"🇬🇧" },
  { iata:"STN", name:"Londra Stansted",         city:"Londra",    country:"UK",        flag:"🇬🇧" },
  { iata:"BER", name:"Berlin Brandenburg",      city:"Berlin",    country:"Germania",  flag:"🇩🇪" },
  { iata:"BUD", name:"Budapesta",               city:"Budapesta", country:"Ungaria",   flag:"🇭🇺" },
  { iata:"LIS", name:"Lisabona",                city:"Lisabona",  country:"Portugalia",flag:"🇵🇹" },
  { iata:"JTR", name:"Santorini",               city:"Santorini", country:"Grecia",    flag:"🇬🇷" },
  { iata:"HER", name:"Creta Heraklion",         city:"Creta",     country:"Grecia",    flag:"🇬🇷" },
  { iata:"JMK", name:"Mykonos",                 city:"Mykonos",   country:"Grecia",    flag:"🇬🇷" },
  { iata:"ATH", name:"Atena",                   city:"Atena",     country:"Grecia",    flag:"🇬🇷" },
  { iata:"AYT", name:"Antalya",                 city:"Antalya",   country:"Turcia",    flag:"🇹🇷" },
  { iata:"IST", name:"Istanbul",                city:"Istanbul",  country:"Turcia",    flag:"🇹🇷" },
  { iata:"DXB", name:"Dubai",                   city:"Dubai",     country:"EAU",       flag:"🇦🇪" },
  { iata:"RAK", name:"Marrakech",               city:"Marrakech", country:"Maroc",     flag:"🇲🇦" },
  { iata:"TFS", name:"Tenerife Sud",            city:"Tenerife",  country:"Spania",    flag:"🇪🇸" },
  { iata:"PMI", name:"Palma de Mallorca",       city:"Mallorca",  country:"Spania",    flag:"🇪🇸" },
  { iata:"DPS", name:"Bali Ngurah Rai",         city:"Bali",      country:"Indonezia", flag:"🇮🇩" },
  { iata:"JFK", name:"New York JFK",            city:"New York",  country:"SUA",       flag:"🇺🇸" },
  { iata:"BKK", name:"Bangkok Suvarnabhumi",    city:"Bangkok",   country:"Thailanda", flag:"🇹🇭" },
  { iata:"CLJ", name:"Cluj-Napoca",             city:"Cluj",      country:"România",   flag:"🇷🇴" },
  { iata:"TSR", name:"Timișoara",               city:"Timișoara", country:"România",   flag:"🇷🇴" },
  { iata:"IAS", name:"Iași",                    city:"Iași",      country:"România",   flag:"🇷🇴" },
  { iata:"CND", name:"Constanța",               city:"Constanța", country:"România",   flag:"🇷🇴" },
];

/* ============================================================
   HOTELS API via Worker
   ============================================================ */
async function apiGet(route, params={}) {
  const url = new URL(WORKER_URL + route);
  Object.entries(params).forEach(([k,v]) => url.searchParams.set(k,v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Worker error ${res.status}`);
  return res.json();
}

async function searchHotelsLive() {
  const destInfo = DESTINATIONS.find(d => d.name === State.dest);
  const destId   = destInfo?.destId || "-1456928";

  // Incearca 1: Worker Cloudflare
  try {
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
    if (hotels.length > 0) {
      return hotels.slice(0,20).map((h,i) => mapHotelProp(h, i, destInfo));
    }
  } catch(e) { console.warn("Worker failed, trying RapidAPI direct:", e.message); }

  // Incearca 2: Booking.com via RapidAPI direct
  try {
    const url = `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?dest_id=${destId}&search_type=CITY&arrival_date=${fmtDate(State.checkIn)||getTomorrow()}&departure_date=${fmtDate(State.checkOut)||getNextWeek()}&adults=${State.adults}&room_qty=${State.rooms}&units=metric&temperature_unit=c&languagecode=ro&currency_code=EUR&location=US`;
    const res = await fetch(url, {
      headers: {
        "x-rapidapi-host": "booking-com15.p.rapidapi.com",
        "x-rapidapi-key":  RAPIDAPI_KEY,
      }
    });
    if (res.ok) {
      const data = await res.json();
      const hotels = data?.data?.hotels || [];
      if (hotels.length > 0) {
        return hotels.slice(0,20).map((h,i) => mapHotelProp(h, i, destInfo));
      }
    }
  } catch(e) { console.warn("RapidAPI direct failed:", e.message); }

  return [];
}

function mapHotelProp(h, i, destInfo) {
  const prop    = h?.property || h;
  const price   = prop?.priceBreakdown?.grossPrice?.value || prop?.minCost || 0;
  const nights  = State.checkIn && State.checkOut ? Math.round((State.checkOut-State.checkIn)/86400000) : 3;
  const perNight = nights>0 ? Math.round(price/nights) : Math.round(price);
  return {
    id:`live_${i}`, name:prop?.name||"Hotel",
    dest:State.dest, country:destInfo?.country||"", flag:destInfo?.flag||"🌍",
    stars:Math.round(prop?.propertyClass||prop?.reviewScore/2||3),
    rating:parseFloat(prop?.reviewScore||7.5), reviews:prop?.reviewCount||0,
    pricePerPerson:Math.round(perNight/Math.max(1,State.adults)), nights,
    checkIn:fmtDate(State.checkIn), checkOut:fmtDate(State.checkOut),
    image:prop?.photoUrls?.[0]||prop?.mainPhotoUrl||"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    room:prop?.unitConfiguration?.[0]?.unitName||"Cameră standard",
    included:buildIncluded(prop), badge:"🏨",
    availability:prop?.isAvailable===false?"Indisponibil":"",
    offerUrl:`https://www.booking.com/searchresults.ro.html?dest_id=${destInfo?.destId||""}&dest_type=city&checkin=${fmtDate(State.checkIn)}&checkout=${fmtDate(State.checkOut)}&group_adults=${State.adults}`,
    transport:"avion", isLive:true,
  };
}

function buildIncluded(prop) {
  const tags=[];
  if(prop?.mealPlanIncluded)      tags.push("Mic dejun inclus");
  if(prop?.freeCancellation)      tags.push("Anulare gratuită");
  if(prop?.hasFreeParkingContext) tags.push("Parcare gratuită");
  if(prop?.hasWifi)               tags.push("Wi-Fi gratuit");
  if(tags.length===0)             tags.push("Wi-Fi gratuit");
  return tags;
}

/* ============================================================
   FLIGHTS API – SkyScanner via RapidAPI (direct, no Worker)
   ============================================================ */
async function searchFlightsDirect(originIata, destIata, date, adults=1) {
  // SkyScanner Search Flights API via RapidAPI
  const url = `https://sky-scanner3.p.rapidapi.com/flights/search-one-way?fromEntityId=${originIata}&toEntityId=${destIata}&departDate=${date}&adults=${adults}&currency=EUR&locale=ro-RO&market=RO&cabinClass=economy`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "sky-scanner3.p.rapidapi.com",
      "x-rapidapi-key":  RAPIDAPI_KEY,
    }
  });
  if (!res.ok) throw new Error(`SkyScanner ${res.status}`);
  const data = await res.json();
  return data;
}

function extractFlightPrice(data) {
  // Încearcă mai multe structuri posibile SkyScanner
  const itineraries = data?.data?.itineraries
    || data?.itineraries
    || data?.data?.results
    || [];
  if (!itineraries.length) return null;
  const best = itineraries[0];
  const price = best?.price?.raw || best?.price?.formatted?.replace(/[^0-9.]/g,"") || null;
  const legs  = best?.legs?.[0];
  return {
    price:     price ? Math.round(parseFloat(price)) : null,
    departure: legs?.departure || "",
    arrival:   legs?.arrival || "",
    duration:  legs?.durationInMinutes || 0,
    stops:     legs?.stopCount || 0,
    carrier:   legs?.carriers?.marketing?.[0]?.name || legs?.operatingCarriers?.[0]?.name || "Operator",
    logo:      legs?.carriers?.marketing?.[0]?.logoUrl || "",
    deeplink:  best?.deeplink || "#",
  };
}

/* ============================================================
   FLIGHTS SEARCH ENGINE – Lună flexibilă
   ============================================================ */
async function searchFlexibleMonth() {
  const { fromIata, toIata, month, year, duration, adults } = FlightState;
  if (!toIata) { showFlightToast("Selectați destinația! ✈️"); return; }
  if (month === null) { showFlightToast("Selectați luna! 📅"); return; }

  showFlightLoading(true);
  renderFlightResults([]);

  const daysInMonth = new Date(year, month+1, 0).getDate();
  const today = new Date(); today.setHours(0,0,0,0);
  const targetMonth = new Date(year, month, 1);

  // Generăm datele de plecare posibile (în intervalul lunii, de azi încoante)
  const departureDates = [];
  for (let d=1; d<=daysInMonth; d++) {
    const date = new Date(year, month, d);
    if (date >= today) {
      departureDates.push(fmtDate(date));
    }
  }

  if (!departureDates.length) {
    showFlightLoading(false);
    showFlightToast("Luna selectată a trecut! Alege o lună viitoare. 📅");
    return;
  }

  showFlightStatusBar(`🔍 Caut ${departureDates.length} date posibile în ${MONTHS_RO[month]}...`);

  // Căutăm în paralel (batches de 5 ca să nu depășim rate limit)
  const results = [];
  const batchSize = 5;
  for (let i=0; i<departureDates.length; i+=batchSize) {
    const batch = departureDates.slice(i, i+batchSize);
    const batchResults = await Promise.allSettled(
      batch.map(async (date) => {
        try {
          const data = await searchFlightsDirect(fromIata, toIata, date, adults);
          const flight = extractFlightPrice(data);
          if (flight?.price) {
            const returnDate = fmtDate(addDays(new Date(date), duration));
            return { date, returnDate, duration, ...flight };
          }
          return null;
        } catch { return null; }
      })
    );
    batchResults.forEach(r => { if (r.status==="fulfilled" && r.value) results.push(r.value); });
    showFlightStatusBar(`🔍 Progres: ${Math.min(i+batchSize, departureDates.length)}/${departureDates.length} date verificate...`);
  }

  showFlightLoading(false);
  if (!results.length) {
    showFlightStatusBar("⚠️ Nu s-au găsit zboruri pentru această perioadă.");
    renderFlightResults([]);
    return;
  }

  // Sortăm după preț
  results.sort((a,b) => a.price - b.price);
  FlightState.results = results;
  showFlightStatusBar(`✅ ${results.length} zboruri găsite · Cel mai ieftin: ${results[0].price} €`);
  renderFlightResults(results);
}

/* ============================================================
   FLIGHTS SEARCH ENGINE – Interval de date
   ============================================================ */
async function searchFlexibleInterval() {
  const { fromIata, toIata, dateFrom, dateTo, intervalDuration, adults } = FlightState;
  if (!toIata)    { showFlightToast("Selectați destinația! ✈️"); return; }
  if (!dateFrom)  { showFlightToast("Selectați data de început! 📅"); return; }
  if (!dateTo)    { showFlightToast("Selectați data de sfârșit! 📅"); return; }

  showFlightLoading(true);
  renderFlightResults([]);

  const today = new Date(); today.setHours(0,0,0,0);
  const departureDates = [];
  let cur = new Date(dateFrom);
  while (cur <= dateTo) {
    const ret = addDays(new Date(cur), intervalDuration);
    if (cur >= today && ret <= addDays(dateTo, intervalDuration)) {
      departureDates.push(fmtDate(cur));
    }
    cur = addDays(cur, 1);
  }

  if (!departureDates.length) {
    showFlightLoading(false);
    showFlightToast("Intervalul selectat nu are date valide! 📅");
    return;
  }

  showFlightStatusBar(`🔍 Caut ${departureDates.length} date în intervalul selectat...`);

  const results = [];
  const batchSize = 5;
  for (let i=0; i<departureDates.length; i+=batchSize) {
    const batch = departureDates.slice(i, i+batchSize);
    const batchResults = await Promise.allSettled(
      batch.map(async (date) => {
        try {
          const data = await searchFlightsDirect(fromIata, toIata, date, adults);
          const flight = extractFlightPrice(data);
          if (flight?.price) {
            const returnDate = fmtDate(addDays(new Date(date), intervalDuration));
            return { date, returnDate, duration: intervalDuration, ...flight };
          }
          return null;
        } catch { return null; }
      })
    );
    batchResults.forEach(r => { if (r.status==="fulfilled" && r.value) results.push(r.value); });
    showFlightStatusBar(`🔍 Progres: ${Math.min(i+batchSize, departureDates.length)}/${departureDates.length} date...`);
  }

  showFlightLoading(false);
  if (!results.length) {
    showFlightStatusBar("⚠️ Nu s-au găsit zboruri pentru intervalul selectat.");
    renderFlightResults([]);
    return;
  }

  results.sort((a,b) => a.price - b.price);
  FlightState.results = results;
  showFlightStatusBar(`✅ ${results.length} zboruri găsite · Cel mai ieftin: ${results[0].price} €`);
  renderFlightResults(results);
}

/* ============================================================
   FLIGHT CARDS RENDER
   ============================================================ */
function renderFlightResults(results) {
  const grid = document.getElementById("fl-results-grid");
  const empty = document.getElementById("fl-empty");
  const section = document.getElementById("fl-results-section");
  if (!grid) return;

  if (!results.length) {
    grid.innerHTML = "";
    if (empty) empty.style.display = "block";
    if (section) section.style.display = results.length === 0 && FlightState.loading ? "none" : "block";
    return;
  }

  if (section) section.style.display = "block";
  if (empty) empty.style.display = "none";

  const toInfo = AIRPORTS.find(a => a.iata === FlightState.toIata);

  grid.innerHTML = results.map((f, i) => {
    const depDate = new Date(f.date);
    const retDate = f.returnDate ? new Date(f.returnDate) : null;
    const depStr = `${depDate.getDate()} ${MONTHS_RO[depDate.getMonth()].slice(0,3)}`;
    const retStr = retDate ? `${retDate.getDate()} ${MONTHS_RO[retDate.getMonth()].slice(0,3)}` : "";
    const stops = f.stops === 0 ? "Direct" : `${f.stops} escal${f.stops>1?"e":"ă"}`;
    const dur = f.duration ? `${Math.floor(f.duration/60)}h${f.duration%60>0?` ${f.duration%60}min`:""}` : "";
    const isBest = i === 0;
    return `
    <article class="fl-card ${isBest?"fl-card--best":""}">
      ${isBest ? `<div class="fl-card__best-badge">🏆 Cel mai ieftin</div>` : ""}
      <div class="fl-card__header">
        ${f.logo ? `<img src="${f.logo}" alt="${f.carrier}" class="fl-card__logo" onerror="this.style.display='none'"/>` : `<span class="fl-card__carrier-icon">✈️</span>`}
        <div class="fl-card__carrier">${f.carrier}</div>
        <div class="fl-card__stops ${f.stops===0?"fl-card__stops--direct":""}">${stops}</div>
      </div>
      <div class="fl-card__route">
        <div class="fl-card__city">
          <div class="fl-card__iata">${FlightState.fromIata}</div>
          <div class="fl-card__date">${depStr}</div>
        </div>
        <div class="fl-card__arrow">
          <span>✈️</span>
          ${dur ? `<div class="fl-card__duration">${dur}</div>` : ""}
        </div>
        <div class="fl-card__city">
          <div class="fl-card__iata">${FlightState.toIata}</div>
          <div class="fl-card__date">${retStr ? `↩ ${retStr}` : ""}</div>
        </div>
      </div>
      <div class="fl-card__footer">
        <div class="fl-card__price-wrap">
          <div class="fl-card__price">${f.price} €</div>
          <div class="fl-card__price-sub">/ persoană · dus-întors</div>
        </div>
        <a href="${f.deeplink}" target="_blank" rel="noopener" class="fl-card__cta">
          Rezervă →
        </a>
      </div>
    </article>`;
  }).join("");

  section.scrollIntoView({ behavior:"smooth", block:"start" });
}

/* ============================================================
   FLIGHT UI HELPERS
   ============================================================ */
function showFlightLoading(show) {
  FlightState.loading = show;
  const el = document.getElementById("fl-loading");
  if (el) el.style.display = show ? "flex" : "none";
  const btn = document.getElementById("fl-search-btn");
  if (btn) { btn.disabled = show; btn.textContent = show ? "Se caută..." : "🔍 Găsește cele mai ieftine zboruri"; }
}

function showFlightStatusBar(msg) {
  const el = document.getElementById("fl-status-bar");
  if (el) { el.textContent = msg; el.style.display = "block"; }
}

function showFlightToast(msg) {
  const t = document.getElementById("bk-toast");
  if (!t) return;
  t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

/* ============================================================
   FLIGHTS TABS (Lună flexibilă / Interval)
   ============================================================ */
function initFlightsTabs() {
  document.querySelectorAll(".fl-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".fl-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".fl-tab-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      const panel = document.getElementById(`fl-panel-${tab.dataset.tab}`);
      if (panel) panel.classList.add("active");
      FlightState.mode = tab.dataset.tab;
    });
  });
}

/* ============================================================
   AIRPORTS AUTOCOMPLETE
   ============================================================ */
function initAirportAutocomplete(inputId, displayId, field) {
  const input   = document.getElementById(inputId);
  const display = document.getElementById(displayId);
  if (!input) return;

  // Dropdown container
  let dropdown = document.getElementById(inputId + "-drop");
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.id = inputId + "-drop";
    dropdown.className = "fl-airport-drop";
    input.parentNode.style.position = "relative";
    input.parentNode.appendChild(dropdown);
  }

  input.addEventListener("focus", () => {
    if (display) display.style.display = "none";
    input.style.opacity = "1";
    showAirportDrop(input.value, dropdown, field, input, display);
  });
  input.addEventListener("blur", () => {
    setTimeout(() => {
      dropdown.classList.remove("open");
      if (display) display.style.display = "";
    }, 200);
  });
  input.addEventListener("input", () => showAirportDrop(input.value, dropdown, field, input, display));
}

function showAirportDrop(q, dropdown, field, input, display) {
  const results = q.length < 1
    ? AIRPORTS.slice(0, 8)
    : AIRPORTS.filter(a =>
        a.iata.toLowerCase().includes(q.toLowerCase()) ||
        a.city.toLowerCase().includes(q.toLowerCase()) ||
        a.name.toLowerCase().includes(q.toLowerCase()) ||
        a.country.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 7);

  if (!results.length) { dropdown.classList.remove("open"); return; }

  dropdown.innerHTML = results.map(a => `
    <div class="fl-airport-item" data-iata="${a.iata}" data-name="${a.city} (${a.iata})">
      <span class="fl-airport-flag">${a.flag}</span>
      <div>
        <span class="fl-airport-iata">${a.iata}</span>
        <span class="fl-airport-name">${a.city} · ${a.name}</span>
      </div>
    </div>`).join("");

  dropdown.querySelectorAll(".fl-airport-item").forEach(item => {
    item.addEventListener("click", () => {
      const iata = item.dataset.iata;
      const name = item.dataset.name;
      if (field === "from") {
        FlightState.fromIata = iata;
        FlightState.fromName = name;
      } else {
        FlightState.toIata = iata;
        FlightState.toName = name;
        // Sync ambele paneluri
        ["fl-to-display-month","fl-to-display-interval"].forEach(id => {
          const el = document.getElementById(id);
          if (el) { el.textContent = name; el.classList.remove("placeholder"); }
        });
        ["fl-to-input-month","fl-to-input-interval"].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = name;
        });
      }
      if (display) { display.textContent = name; display.classList.remove("placeholder"); }
      if (input) input.value = name;
      dropdown.classList.remove("open");
    });
  });
  dropdown.classList.add("open");
}

/* ============================================================
   MONTH PICKER
   ============================================================ */
function initMonthPicker() {
  const grid = document.getElementById("fl-month-grid");
  if (!grid) return;
  const now = new Date();
  grid.innerHTML = "";
  for (let i=0; i<12; i++) {
    let m = now.getMonth() + i;
    let y = now.getFullYear() + Math.floor(m/12);
    m = m % 12;
    const btn = document.createElement("button");
    btn.className = "fl-month-btn";
    btn.textContent = `${MONTHS_RO[m].slice(0,3)} ${y}`;
    btn.dataset.month = m;
    btn.dataset.year = y;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".fl-month-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      FlightState.month = parseInt(btn.dataset.month);
      FlightState.year  = parseInt(btn.dataset.year);
      const display = document.getElementById("fl-month-display");
      if (display) display.textContent = `${MONTHS_RO[m]} ${y}`;
    });
    grid.appendChild(btn);
  }
}

/* ============================================================
   DURATION SPINNERS
   ============================================================ */
function initDurationSpinners() {
  // Month mode
  document.getElementById("fl-dur-minus")?.addEventListener("click", () => {
    FlightState.duration = Math.max(1, FlightState.duration - 1);
    updateDurationDisplay("fl-dur-val", FlightState.duration);
  });
  document.getElementById("fl-dur-plus")?.addEventListener("click", () => {
    FlightState.duration = Math.min(30, FlightState.duration + 1);
    updateDurationDisplay("fl-dur-val", FlightState.duration);
  });
  // Interval mode
  document.getElementById("fl-idur-minus")?.addEventListener("click", () => {
    FlightState.intervalDuration = Math.max(1, FlightState.intervalDuration - 1);
    updateDurationDisplay("fl-idur-val", FlightState.intervalDuration);
  });
  document.getElementById("fl-idur-plus")?.addEventListener("click", () => {
    FlightState.intervalDuration = Math.min(30, FlightState.intervalDuration + 1);
    updateDurationDisplay("fl-idur-val", FlightState.intervalDuration);
  });
}

function updateDurationDisplay(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ============================================================
   INTERVAL DATE PICKER (mini calendar pentru zboruri)
   ============================================================ */
let flCalMode = "from"; // "from" | "to"
let flCalYear = new Date().getFullYear();
let flCalMonth = new Date().getMonth();

function initIntervalCalendar() {
  const fromField = document.getElementById("fl-interval-from-field");
  const toField   = document.getElementById("fl-interval-to-field");
  const cal       = document.getElementById("fl-interval-cal");
  if (!fromField || !cal) return;

  fromField.addEventListener("click", () => { flCalMode="from"; cal.classList.add("open"); renderFlCal(); });
  toField?.addEventListener("click",  () => { flCalMode="to";   cal.classList.add("open"); renderFlCal(); });
  renderFlCal();
}

function renderFlCal() {
  const cal = document.getElementById("fl-interval-cal");
  if (!cal) return;
  const now = new Date(); now.setHours(0,0,0,0);
  const firstDow = new Date(flCalYear, flCalMonth, 1).getDay();
  const daysInMonth = new Date(flCalYear, flCalMonth+1, 0).getDate();
  const offset = (firstDow+6)%7;
  let cells = "";
  for (let i=0; i<offset; i++) cells += `<div class="fl-cal-day empty"></div>`;
  for (let d=1; d<=daysInMonth; d++) {
    const date = new Date(flCalYear, flCalMonth, d);
    let cls = "fl-cal-day";
    if (date < now) cls += " disabled";
    if (FlightState.dateFrom && date.toDateString()===FlightState.dateFrom.toDateString()) cls += " selected-from";
    if (FlightState.dateTo   && date.toDateString()===FlightState.dateTo.toDateString())   cls += " selected-to";
    if (FlightState.dateFrom && FlightState.dateTo && date>FlightState.dateFrom && date<FlightState.dateTo) cls += " in-range";
    cells += `<div class="${cls}" data-y="${flCalYear}" data-m="${flCalMonth}" data-d="${d}">${d}</div>`;
  }
  cal.innerHTML = `
    <div class="fl-cal-header">
      <button class="fl-cal-nav" data-dir="prev">‹</button>
      <span>${MONTHS_RO[flCalMonth]} ${flCalYear}</span>
      <button class="fl-cal-nav" data-dir="next">›</button>
    </div>
    <div class="fl-cal-grid">
      ${DAYS_RO.map(d=>`<div class="fl-cal-dow">${d}</div>`).join("")}${cells}
    </div>
    <div class="fl-cal-hint">${flCalMode==="from"?"Selectează data de start":"Selectează data de final"}</div>`;

  cal.querySelectorAll(".fl-cal-nav").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      flCalMonth += btn.dataset.dir==="prev" ? -1 : 1;
      if (flCalMonth<0) { flCalMonth=11; flCalYear--; }
      if (flCalMonth>11){ flCalMonth=0;  flCalYear++; }
      renderFlCal();
    });
  });

  cal.querySelectorAll(".fl-cal-day:not(.disabled):not(.empty)").forEach(day => {
    day.addEventListener("click", () => {
      const date = new Date(+day.dataset.y, +day.dataset.m, +day.dataset.d);
      if (flCalMode==="from") {
        FlightState.dateFrom = date;
        FlightState.dateTo = null;
        flCalMode = "to";
      } else {
        if (date <= FlightState.dateFrom) {
          FlightState.dateFrom = date; FlightState.dateTo = null; flCalMode = "to";
        } else {
          FlightState.dateTo = date;
          cal.classList.remove("open");
        }
      }
      updateIntervalDisplay();
      renderFlCal();
    });
  });
}

function updateIntervalDisplay() {
  const fromEl = document.getElementById("fl-interval-from-display");
  const toEl   = document.getElementById("fl-interval-to-display");
  if (fromEl) fromEl.textContent = FlightState.dateFrom ? formatDate(FlightState.dateFrom) : "Data start";
  if (toEl)   toEl.textContent   = FlightState.dateTo   ? formatDate(FlightState.dateTo)   : "Data final";
}

/* ============================================================
   CALENDAR – HOTELS
   ============================================================ */
function renderCalendar() {
  const cal = document.getElementById("bk-cal");
  if (!cal) return;
  const months = [
    { year:calViewYear, month:calViewMonth },
    { year:calViewMonth===11?calViewYear+1:calViewYear, month:(calViewMonth+1)%12 }
  ];
  cal.innerHTML = months.map((m,i) => buildMonthHTML(m.year, m.month, i)).join("");
  cal.querySelectorAll(".bk-cal__nav").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      calViewMonth += btn.dataset.dir==="prev" ? -1 : 1;
      if (calViewMonth<0)  { calViewMonth=11; calViewYear--; }
      if (calViewMonth>11) { calViewMonth=0;  calViewYear++; }
      renderCalendar();
    });
  });
  cal.querySelectorAll(".bk-cal__day:not(.disabled):not(.empty)").forEach(day => {
    day.addEventListener("click", () => {
      const d = new Date(+day.dataset.year, +day.dataset.month, +day.dataset.day);
      if (calStep==="checkin") {
        State.checkIn=d; State.checkOut=null; calStep="checkout";
      } else {
        if (d<=State.checkIn) { State.checkIn=d; State.checkOut=null; calStep="checkout"; }
        else { State.checkOut=d; calStep="checkin"; closeAllDropdowns(); }
      }
      updateDateDisplays(); renderCalendar();
    });
  });
}

function buildMonthHTML(year, month, idx) {
  const now = new Date(); now.setHours(0,0,0,0);
  const firstDow    = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const offset      = (firstDow+6)%7;
  let cells = "";
  for (let i=0;i<offset;i++) cells+=`<div class="bk-cal__day empty"></div>`;
  for (let d=1;d<=daysInMonth;d++) {
    const date = new Date(year,month,d);
    let cls = "bk-cal__day";
    if (date<now) cls+=" disabled";
    if (date.toDateString()===now.toDateString()) cls+=" today";
    if (State.checkIn  && date.toDateString()===State.checkIn.toDateString())  cls+=" checkin";
    if (State.checkOut && date.toDateString()===State.checkOut.toDateString()) cls+=" checkout";
    if (State.checkIn && State.checkOut && date>State.checkIn && date<State.checkOut) cls+=" in-range";
    cells+=`<div class="${cls}" data-year="${year}" data-month="${month}" data-day="${d}">${d}</div>`;
  }
  const prev=idx===0?`<button class="bk-cal__nav" data-dir="prev">‹</button>`:`<div></div>`;
  const next=idx===1?`<button class="bk-cal__nav" data-dir="next">›</button>`:`<div></div>`;
  return `<div class="bk-cal__month">
    <div class="bk-cal__header">${prev}<span>${MONTHS_RO[month]} ${year}</span>${next}</div>
    <div class="bk-cal__grid">
      ${DAYS_RO.map(d=>`<div class="bk-cal__dow">${d}</div>`).join("")}${cells}
    </div>
  </div>`;
}

function updateCalStatus() {
  const status=document.getElementById("bk-cal-status");
  const badge =document.getElementById("bk-nights-badge");
  if(!State.checkIn){if(status)status.textContent="Selectează check-in";if(badge)badge.classList.add("hidden");}
  else if(!State.checkOut){if(status)status.textContent="Acum selectează check-out";if(badge)badge.classList.add("hidden");}
  else{
    const n=Math.round((State.checkOut-State.checkIn)/86400000);
    if(status)status.textContent="Perioadă selectată ✓";
    if(badge){badge.classList.remove("hidden");badge.textContent=`${n} nopți`;}
  }
}

function formatDate(d) {
  if(!d)return"";
  return`${d.getDate()} ${MONTHS_RO[d.getMonth()].slice(0,3)} ${d.getFullYear()}`;
}
function fmtDate(d) { if(!d)return""; return d.toISOString().split("T")[0]; }
function getTomorrow() { const d=new Date();d.setDate(d.getDate()+1);return fmtDate(d); }
function getNextWeek()  { const d=new Date();d.setDate(d.getDate()+8);return fmtDate(d); }
function addDays(date, days) { const d=new Date(date);d.setDate(d.getDate()+days);return d; }

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
  if(State.children>0)txt+=` · ${State.children} cop${State.children!==1?"ii":"il"}`;
  txt+=` · ${State.rooms} camer${State.rooms!==1?"e":"ă"}`;
  el.textContent=txt;
}
function setCounter(field,val) {
  const mins={adults:1,children:0,rooms:1},maxs={adults:16,children:10,rooms:8};
  State[field]=Math.max(mins[field],Math.min(maxs[field],val));
  const el=document.getElementById(`${field}-val`);
  if(el)el.textContent=State[field];
  const minBtn=document.getElementById(`${field}-minus`);
  if(minBtn)minBtn.disabled=State[field]<=mins[field];
  updateGuestsDisplay();
}

/* ============================================================
   HOTELS AUTOCOMPLETE
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
  if(found){State.destId=found.destId||"";State.destIata=found.iata||"";}
  const input=document.getElementById("bk-dest-input");
  const display=document.getElementById("bk-dest-display");
  const box=document.getElementById("bk-autocomplete");
  if(input)input.value=name;
  if(display){display.textContent=name;display.className="bk-field__value";}
  if(box)box.classList.remove("open");
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
   HOTELS MAIN SEARCH
   ============================================================ */
async function doSearch() {
  if(!State.dest.trim()){showToast("Introduceți o destinație! 📍");return;}
  if(!State.checkIn){showToast("Selectați data de check-in! 📅");openDropdown("bk-calendar-drop");renderCalendar();return;}
  if(!State.checkOut){showToast("Selectați data de check-out! 📅");openDropdown("bk-calendar-drop");calStep="checkout";renderCalendar();return;}

  showSkeleton(true);
  showResultsSection(false);

  let results=[];
  State.isLive=false;

  try {
    showStatusBar("🔄 Se caută oferte live...");
    results=await searchHotelsLive();
    if(results.length>0){
      State.isLive=true;
      showStatusBar(`✅ ${results.length} oferte găsite live`);
    } else {
      showStatusBar("ℹ️ Nicio ofertă live — se afișează oferte similare");
    }
  } catch(err) {
    console.warn("Worker error:", err.message);
    showStatusBar("⚠️ API indisponibil — se afișează oferte demo");
    results=[];
  }

  // Fallback garantat
  if(results.length===0){
    results=filterDemo();
    if(results.length===0) results=[...DEMO_OFFERS]; // ultimul fallback: toate demo
  }

  results=sortOffers(results,State.sortBy);
  State.allResults=results;
  State.displayedCount=0;
  showSkeleton(false);
  showResultsSection(true);
  renderCards(true);
  updateResultsMeta();
  scrollToResults();
}

function filterDemo() {
  let r=[...DEMO_OFFERS];
  if(State.dest){
    const q = State.dest.toLowerCase();
    // Cauta dupa destinatie exacta sau tara
    const filtered=r.filter(o=>
      o.dest.toLowerCase().includes(q)||
      o.country.toLowerCase().includes(q)
    );
    // Daca cautat e o tara (ex: "Italia"), cauta orasele din tara aia
    const byCountry = r.filter(o => o.country.toLowerCase().includes(q));
    // Prioritate: match exact > match tara > toate
    if(filtered.length>0) r=filtered;
    else if(byCountry.length>0) r=byCountry;
    // else r ramane toate DEMO_OFFERS
  }
  return r;
}

function sortOffers(arr,by) {
  const s=[...arr];
  if(by==="price-asc")  s.sort((a,b)=>a.pricePerPerson-b.pricePerPerson);
  if(by==="price-desc") s.sort((a,b)=>b.pricePerPerson-a.pricePerPerson);
  if(by==="rating")     s.sort((a,b)=>b.rating-a.rating);
  return s;
}

/* ============================================================
   RENDER HOTEL CARDS
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
    if(empty)empty.classList.add("show");
    if(loadMore)loadMore.classList.remove("show");
    return;
  }
  if(empty)empty.classList.remove("show");
  slice.forEach((o,i)=>grid.insertAdjacentHTML("beforeend",buildCard(o,i)));
  if(loadMore)loadMore.classList.toggle("show",State.displayedCount<State.allResults.length);
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
  if(title)title.textContent=`${State.allResults.length} oferte în ${State.dest}`;
  if(meta)meta.textContent=`${formatDate(State.checkIn)} → ${formatDate(State.checkOut)} · ${nights} nopți · ${State.adults} pers.${liveTag}`;
}

/* ============================================================
   UI HELPERS
   ============================================================ */
function showSkeleton(show){document.getElementById("bk-skeleton")?.classList.toggle("show",show);}
function showResultsSection(show){const s=document.getElementById("bk-results-section");if(s)s.style.display=show?"block":"none";}
function scrollToResults(){document.getElementById("bk-results-section")?.scrollIntoView({behavior:"smooth",block:"start"});}
function showStatusBar(msg){
  let bar=document.getElementById("bk-status-bar");
  if(!bar){bar=document.createElement("div");bar.id="bk-status-bar";bar.style.cssText="position:fixed;top:0;left:0;right:0;background:#003580;color:#fff;text-align:center;padding:8px;font-size:0.8rem;z-index:9999;font-weight:600;";document.body.prepend(bar);}
  bar.textContent=msg;
  clearTimeout(bar._t);
  bar._t=setTimeout(()=>bar.remove(),5000);
}
function showToast(msg,d=3000){
  const t=document.getElementById("bk-toast");
  if(!t)return;
  t.textContent=msg;t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),d);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  // ── HOTELS ──────────────────────────────────────────────
  const destInput  = document.getElementById("bk-dest-input");
  const destDisplay= document.getElementById("bk-dest-display");

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

  // ── FLIGHTS ─────────────────────────────────────────────
  initFlightsTabs();
  initMonthPicker();
  initDurationSpinners();
  initIntervalCalendar();

  // Autocomplete aeroport – plecare (același pentru ambele tab-uri, default OTP)
  initAirportAutocomplete("fl-from-input", "fl-from-display", "from");
  // Autocomplete aeroport – destinație (două input-uri, sync via FlightState)
  initAirportAutocomplete("fl-to-input-month",    "fl-to-display-month",    "to");
  initAirportAutocomplete("fl-to-input-interval", "fl-to-display-interval", "to");

  // Setăm valorile default afișate
  const fromDisplay = document.getElementById("fl-from-display");
  if (fromDisplay) fromDisplay.textContent = FlightState.fromName;

  // Search buttons
  document.getElementById("fl-search-btn-month")?.addEventListener("click", searchFlexibleMonth);
  document.getElementById("fl-search-btn-interval")?.addEventListener("click", searchFlexibleInterval);

  // Închide calendar interval la click afară
  document.addEventListener("click", e => {
    const cal = document.getElementById("fl-interval-cal");
    if (cal && !cal.contains(e.target) &&
        !document.getElementById("fl-interval-from-field")?.contains(e.target) &&
        !document.getElementById("fl-interval-to-field")?.contains(e.target)) {
      cal.classList.remove("open");
    }
  });

  // ── COMMON ──────────────────────────────────────────────
  document.getElementById("hamburger")?.addEventListener("click",()=>{
    document.getElementById("mobile-nav")?.classList.toggle("hidden");
  });
  document.querySelectorAll(".mobile-nav__link").forEach(l=>l.addEventListener("click",()=>document.getElementById("mobile-nav")?.classList.add("hidden")));

  updateGuestsDisplay();
  updateDateDisplays();

  if("serviceWorker" in navigator) navigator.serviceWorker.register("service-worker.js").catch(()=>{});
  console.log("✅ SmartTravel AI v5.0 | Flights + Hotels");
});
