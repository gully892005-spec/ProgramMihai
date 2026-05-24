# ✦ SmartTravel AI

**Agregator inteligent de vacanțe în timp real · PWA · GitHub Pages**

> Caută vacanța perfectă în limbaj natural. Sistemul AI analizează cererea ta și îți prezintă oferte live din Booking.com, Skyscanner și agenții de turism.

---

## 📁 Structura fișierelor

```
SmartTravelAI/
├── index.html          # Structura completă a paginii
├── style.css           # Design mobile-first, dark luxury
├── app.js              # Logica aplicației + integrare API
├── manifest.json       # Configurație PWA (instalare telefon)
├── service-worker.js   # Cache shell + Network-Only pentru API
├── offline.html        # Pagina fallback fără internet
├── README.md           # Acest fișier
└── icons/              # Iconițe PWA (generează cu realfavicongenerator.net)
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-192.png    ← obligatoriu pentru A2HS Android
    ├── icon-384.png
    └── icon-512.png    ← obligatoriu pentru splash screen
```

---

## 🚀 Instalare pe GitHub Pages

### Pasul 1 – Creează repository-ul

```bash
# Creează un repo public pe GitHub (ex: smarttravel-ai)
# Activează GitHub Pages: Settings → Pages → Branch: main → / (root)
```

### Pasul 2 – Încarcă fișierele

```bash
git clone https://github.com/username/smarttravel-ai.git
cd smarttravel-ai

# Copiază toate fișierele din SmartTravelAI/ în folder
# Creează folderul icons/ și adaugă icoanele

git add .
git commit -m "Initial deploy SmartTravel AI"
git push origin main
```

### Pasul 3 – Accesează aplicația

```
https://username.github.io/smarttravel-ai/
```

> ⚠️ **Important:** GitHub Pages servește fișierele de pe HTTPS, ceea ce este **obligatoriu** pentru PWA și Service Worker.

---

## 🔑 Configurare API-uri reale

Deschide `app.js` și modifică obiectul `API_CONFIG` din primele rânduri:

### Booking.com via RapidAPI

1. Mergi pe [rapidapi.com/DataCrawler/api/booking-com15](https://rapidapi.com/DataCrawler/api/booking-com15)
2. Subscribe la planul gratuit (500 req/lună) sau plătit
3. Copiază **X-RapidAPI-Key**
4. În `app.js`:

```javascript
BOOKING: {
  ENABLED: true,                         // ← schimbă în true
  KEY: "abc123xyz_CHEIA_TA_RAPIDAPI",    // ← pune cheia ta
  HOST: "booking-com15.p.rapidapi.com",
  BASE_URL: "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels",
},
```

### Skyscanner via RapidAPI

1. Mergi pe [rapidapi.com/3b-data-3b-data-default/api/skyscanner44](https://rapidapi.com/3b-data-3b-data-default/api/skyscanner44)
2. Subscribe și copiază cheia
3. În `app.js`:

```javascript
SKYSCANNER: {
  ENABLED: true,
  KEY: "abc123xyz_CHEIA_TA_RAPIDAPI",
  HOST: "skyscanner44.p.rapidapi.com",
  BASE_URL: "https://skyscanner44.p.rapidapi.com/search-flights",
},
```

> 💡 **Aceeași cheie RapidAPI** funcționează pentru ambele API-uri dacă ești abonat la ambele pe același cont.

---

## 🖼️ Generare icoane PWA

Cel mai simplu mod: **[realfavicongenerator.net](https://realfavicongenerator.net)**

1. Upload o imagine 512×512px (logo-ul tău)
2. Configurează culorile: background `#050810`, theme `#3d8ef8`
3. Descarcă pachetul și copiază fișierele în `/icons/`

Sau generează manual cu ImageMagick:

```bash
# Redimensionează o imagine sursă (source.png, 512x512)
for size in 72 96 128 144 152 192 384 512; do
  convert source.png -resize ${size}x${size} icons/icon-${size}.png
done
```

---

## 📱 Instalare pe telefon

### Android (Chrome / Samsung Internet)
- Deschide URL-ul în Chrome
- Apasă bannerul "Instalează" care apare automat
- Sau: Meniu (⋮) → **Adaugă pe ecranul de start**

### iOS (Safari)
- Deschide URL-ul în Safari (obligatoriu, nu Chrome pe iOS)
- Apasă butonul Share (□↑)
- **Adaugă pe ecranul de start**

### Android (HyperOS / MIUI)
- Deschide în browser
- Bannerul PWA apare automat după câteva secunde
- Sau: Meniu (...) → **Instalează aplicația**

---

## ⚙️ Configurare avansată

### Modificare culori temă

În `style.css`, secțiunea `:root`:

```css
:root {
  --color-bg: #050810;        /* Fundal principal */
  --color-accent: #3d8ef8;    /* Albastru accent */
  --color-accent-2: #6c3ef8;  /* Violet gradient */
  --color-hot: #f8503d;       /* Roșu last-minute */
}
```

### Adăugare destinații demo

În `app.js`, array-ul `DEMO_OFFERS`, adaugă un obiect nou:

```javascript
{
  id: "demo_custom_1",
  title: "Numele hotelului / ofertei",
  destination: "Orașul, Țara",
  type: "litoral",         // litoral | city-break | last-minute | ski
  transport: "avion",      // avion | masina | autocar
  stars: 4,
  rating: 8.9,
  pricePerPerson: 299,
  persons: 2,
  nights: 7,
  checkIn: "2026-07-01",
  checkOut: "2026-07-08",
  image: "URL_IMAGINE",
  imageAlt: "Descriere imagine",
  source: "Booking.com",
  sourceLogo: "🏨",
  badge: "litoral",
  badgeLabel: "🏖️ LITORAL",
  room: "Cameră dublă",
  included: ["Mic dejun", "Piscină"],
  offerUrl: "https://booking.com/...",
  description: "Descriere completă a ofertei.",
}
```

### Activare notificări Push

În `service-worker.js`, decomentează blocul `self.addEventListener("push", ...)` și `self.addEventListener("notificationclick", ...)`.

Backend-ul push necesită o bibliotecă server-side (ex: [web-push](https://github.com/web-push-libs/web-push) pentru Node.js).

---

## 🏗️ Arhitectura cache-ului (Service Worker)

| Resursă | Strategie | Detalii |
|---|---|---|
| `index.html`, `style.css`, `app.js` | **Cache First** | Se deschide instant, chiar offline |
| `manifest.json`, icoane | **Cache First** | Necesare pentru instalare PWA |
| `booking-com15.p.rapidapi.com` | **Network Only** | Prețuri proaspete, niciodată din cache |
| `skyscanner44.p.rapidapi.com` | **Network Only** | Prețuri proaspete, niciodată din cache |
| `images.unsplash.com` | **Stale-While-Revalidate** | Imaginea apare instant, se actualizează în fundal |
| Orice altceva | **Network First** | Rețea primul, cache ca fallback |

---

## 🔧 Depanare frecventă

**Service Worker-ul nu se înregistrează:**
- Verifică că ești pe HTTPS (GitHub Pages îl oferă implicit)
- Deschide DevTools → Application → Service Workers
- Apasă "Unregister" și reîncarcă pagina

**Aplicația nu apare ca instalabilă pe Android:**
- Verifică că `manifest.json` e corect referit în `<head>`
- Iconița de 192px și 512px trebuie să existe și să fie accesibile
- Service Worker-ul trebuie să fie activ
- Deschide DevTools → Application → Manifest pentru diagnosticare

**API-ul returnează erori 403:**
- Cheia RapidAPI nu este validă sau ai depășit limita de cereri
- Verifică pe dashboard-ul RapidAPI numărul de cereri rămase

**Prețurile nu se actualizează:**
- Verifică că `ENABLED: true` în `API_CONFIG`
- Deschide DevTools → Network → filtrează după "rapidapi" să verifici cererile

---

## 📊 Performanță & Lighthouse

Scoruri țintă Lighthouse:
- **Performance:** 95+
- **Accessibility:** 95+
- **Best Practices:** 100
- **SEO:** 90+
- **PWA:** ✅ Installable

Optimizări incluse:
- Fonturi Google cu `display=swap` și `preconnect`
- Imagini cu `loading="lazy"`
- `animation-delay` staggerat pentru carduri
- CSS variabile pentru consistență și bundle mic
- Nicio dependință JS externă (zero npm, zero bundler)

---

## 📄 Licență

MIT License – Folosește liber pentru proiecte personale și comerciale.

---

*Construit cu ❤️ pentru călători · SmartTravel AI v1.0.0 · 2026*
