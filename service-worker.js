/**
 * SmartTravel AI · service-worker.js
 * Versiune: 1.0.0
 *
 * Strategie cache:
 * ─ Shell UI (HTML, CSS, JS, fonturi, icoane) → Cache First
 *   Aplicația se deschide instant, chiar și offline.
 * ─ Cereri API (Booking, Skyscanner, RapidAPI, Unsplash) → Network Only
 *   Prețurile sunt întotdeauna proaspete, direct din rețea.
 * ─ Imagini externe (Unsplash etc.) → Stale-While-Revalidate
 *   Imaginea din cache apare imediat, se actualizează în fundal.
 */

/* ============================================================
   CONFIGURARE
   ============================================================ */

const CACHE_VERSION = "v1.0.0";
const SHELL_CACHE   = `smarttravel-shell-${CACHE_VERSION}`;
const IMG_CACHE     = `smarttravel-images-${CACHE_VERSION}`;

/** Resursele shell-ului aplicației – se pun în cache la instalare. */
const SHELL_ASSETS = [
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  /* Icoane PWA – asigură-te că există fișierele în /icons/ */
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  /* Pagina offline fallback */
  "./offline.html",
];

/** Domenii pentru care cererea trece DIRECT prin rețea (Network Only). */
const NETWORK_ONLY_DOMAINS = [
  "rapidapi.com",
  "booking-com15.p.rapidapi.com",
  "skyscanner44.p.rapidapi.com",
  "aerodatabox.p.rapidapi.com",
  "api.booking.com",
  "partners.api.skyscanner.net",
  "api.anthropic.com",
];

/** Domenii pentru imagini – strategie Stale-While-Revalidate. */
const IMAGE_DOMAINS = [
  "images.unsplash.com",
  "cf.bstatic.com",
  "r-xx.bstatic.com",
  "content.skyscanner.net",
];

/** Numărul maxim de imagini stocate în cache. */
const IMG_CACHE_MAX = 60;

/* ============================================================
   INSTALARE – precachează shell-ul aplicației
   ============================================================ */

self.addEventListener("install", (event) => {
  console.info("[SW] Instalare · versiune:", CACHE_VERSION);

  event.waitUntil(
    caches.open(SHELL_CACHE).then(async (cache) => {
      try {
        await cache.addAll(SHELL_ASSETS);
        console.info("[SW] Shell assets precachate:", SHELL_ASSETS.length, "fișiere");
      } catch (err) {
        /**
         * Dacă un fișier din SHELL_ASSETS nu există (ex: offline.html nu a
         * fost creat încă), cache-uieste ce se poate și loghează eroarea.
         * Nu blocăm instalarea SW-ului din cauza unui fișier lipsă.
         */
        console.warn("[SW] Câteva resurse nu au putut fi cache-uite:", err);

        // Încearcă individual, ignorând erorile individuale
        await Promise.allSettled(
          SHELL_ASSETS.map((url) =>
            cache.add(url).catch((e) => console.warn("[SW] Skip:", url, e.message))
          )
        );
      }
    })
  );

  // Activează imediat noul SW fără să aștepte tab-urile vechi să se închidă
  self.skipWaiting();
});

/* ============================================================
   ACTIVARE – șterge cache-urile vechi
   ============================================================ */

self.addEventListener("activate", (event) => {
  console.info("[SW] Activare · versiune:", CACHE_VERSION);

  event.waitUntil(
    Promise.all([
      // Șterge orice cache care nu mai e relevant
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== IMG_CACHE)
            .map((key) => {
              console.info("[SW] Șterg cache vechi:", key);
              return caches.delete(key);
            })
        )
      ),
      // Preia controlul imediat asupra tuturor clienților activi
      self.clients.claim(),
    ])
  );
});

/* ============================================================
   FETCH – interceptează toate cererile de rețea
   ============================================================ */

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignoră tot ce nu e HTTP/HTTPS (ex: chrome-extension://)
  if (!url.protocol.startsWith("http")) return;

  // Ignoră cererile POST/PUT/DELETE/PATCH (nu se cache-uiesc)
  if (request.method !== "GET") return;

  /* ── 1. NETWORK ONLY – cereri API live ── */
  if (isNetworkOnly(url)) {
    event.respondWith(networkOnly(request));
    return;
  }

  /* ── 2. STALE-WHILE-REVALIDATE – imagini externe ── */
  if (isImageRequest(url)) {
    event.respondWith(staleWhileRevalidate(request, IMG_CACHE));
    return;
  }

  /* ── 3. CACHE FIRST – shell UI ── */
  if (isShellAsset(url, request)) {
    event.respondWith(cacheFirst(request, SHELL_CACHE));
    return;
  }

  /* ── 4. NETWORK FIRST – orice altceva ── */
  event.respondWith(networkFirst(request));
});

/* ============================================================
   STRATEGII DE CACHE
   ============================================================ */

/**
 * NETWORK ONLY
 * Trimite cererea direct la rețea. Dacă eșuează, returnează
 * un răspuns JSON cu eroare (nu un fallback HTML).
 */
async function networkOnly(request) {
  try {
    const response = await fetch(request, {
      // Forțăm bypass cache HTTP nativ pentru date proaspete
      cache: "no-store",
    });
    return response;
  } catch (error) {
    console.warn("[SW] Network Only eșuat:", request.url, error.message);
    return new Response(
      JSON.stringify({
        error: true,
        message: "Conexiunea la internet nu este disponibilă. Prețurile live necesită internet.",
        offline: true,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 503,
        statusText: "Service Unavailable (Offline)",
        headers: {
          "Content-Type": "application/json",
          "X-SmartTravel-Offline": "true",
        },
      }
    );
  }
}

/**
 * CACHE FIRST
 * Întoarce din cache dacă există; altfel fetch din rețea
 * și salvează răspunsul în cache pentru data viitoare.
 * Fallback la offline.html dacă totul eșuează.
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      // Clonăm răspunsul: un stream poate fi citit o singură dată
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.warn("[SW] Cache First – rețea eșuată:", request.url);

    // Fallback offline
    const offlinePage = await cache.match("./offline.html");
    if (offlinePage) return offlinePage;

    return new Response("<h1>Offline</h1><p>SmartTravel AI nu este disponibil fără internet pentru această resursă.</p>", {
      status: 503,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}

/**
 * NETWORK FIRST
 * Încearcă rețeaua; dacă eșuează, returnează din cache.
 * Bun pentru pagini care se schimbă frecvent.
 */
async function networkFirst(request) {
  const cache = await caches.open(SHELL_CACHE);

  try {
    const response = await fetch(request);

    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;

    // Fallback la index.html pentru navigare SPA
    const indexPage = await cache.match("./index.html");
    if (indexPage && request.mode === "navigate") return indexPage;

    return new Response("Resursă indisponibilă offline.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

/**
 * STALE-WHILE-REVALIDATE
 * Returnează imediat din cache (dacă există), și în paralel
 * face fetch din rețea pentru a actualiza cache-ul.
 * Dacă nu e în cache, face fetch și salvează.
 * Aplică și o limită de dimensiune a cache-ului de imagini.
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Fetch în fundal (revalidare)
  const fetchPromise = fetch(request).then(async (response) => {
    if (response.ok) {
      await cache.put(request, response.clone());
      await trimCache(cacheName, IMG_CACHE_MAX);
    }
    return response;
  }).catch(() => null);

  // Returnează din cache dacă există, altfel așteaptă rețeaua
  return cached || fetchPromise || new Response("", { status: 204 });
}

/* ============================================================
   HELPERS
   ============================================================ */

/**
 * Verifică dacă URL-ul aparține unui API live (Network Only).
 */
function isNetworkOnly(url) {
  return NETWORK_ONLY_DOMAINS.some(
    (domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`)
  );
}

/**
 * Verifică dacă e o cerere de imagine externă.
 */
function isImageRequest(url) {
  return (
    IMAGE_DOMAINS.some(
      (domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    ) ||
    /\.(jpg|jpeg|png|webp|gif|avif|svg)(\?.*)?$/i.test(url.pathname)
  );
}

/**
 * Verifică dacă URL-ul face parte din shell-ul aplicației.
 */
function isShellAsset(url, request) {
  // Același origin
  if (url.origin !== self.location.origin) return false;

  // Resursele shell cunoscute
  const shellPaths = SHELL_ASSETS.map((a) => new URL(a, self.location).pathname);
  if (shellPaths.includes(url.pathname)) return true;

  // Navigare (HTML pages) → cache first cu fallback index.html
  if (request.mode === "navigate") return true;

  return false;
}

/**
 * Limitează numărul de intrări dintr-un cache la `maxEntries`.
 * Șterge cele mai vechi intrări (FIFO).
 */
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxEntries) {
    const toDelete = keys.slice(0, keys.length - maxEntries);
    await Promise.all(toDelete.map((key) => cache.delete(key)));
    console.info(`[SW] Trim cache ${cacheName}: ${toDelete.length} intrări șterse`);
  }
}

/* ============================================================
   PUSH NOTIFICATIONS (placeholder pregătit pentru activare)
   Descomenteaza blocul de mai jos când vrei să trimiți
   notificări push utilizatorilor (ex: new last-minute deals).
   ============================================================ */

/*
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "SmartTravel AI", body: event.data.text() };
  }

  const options = {
    body: data.body || "Ofertă nouă disponibilă!",
    icon: "./icons/icon-192.png",
    badge: "./icons/badge-72.png",
    image: data.image || "",
    tag: data.tag || "smarttravel-notification",
    renotify: true,
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "./index.html",
      offerId: data.offerId || null,
    },
    actions: [
      { action: "view", title: "Vezi oferta", icon: "./icons/action-view.png" },
      { action: "dismiss", title: "Ignoră", icon: "./icons/action-dismiss.png" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "SmartTravel AI", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const targetUrl = event.notification.data?.url || "./index.html";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      // Dacă aplicația e deja deschisă, aduce-o în prim-plan
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.focus();
          client.postMessage({ type: "NOTIFICATION_CLICK", url: targetUrl });
          return;
        }
      }
      // Altfel, deschide un tab nou
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
*/

/* ============================================================
   BACKGROUND SYNC (placeholder)
   Permite re-trimiterea cererilor eșuate când internetul revine.
   ============================================================ */

/*
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-search") {
    event.waitUntil(
      // Citește din IndexedDB cererea salvată și o retrimite
      retrySavedSearches()
    );
  }
});

async function retrySavedSearches() {
  // Implementează logica de retry pentru căutări salvate offline
  // Folosește IndexedDB (idb-keyval sau similar) pentru stocare
  console.info("[SW] Background sync: reîncercare căutări salvate");
}
*/

/* ============================================================
   MESAJE DE LA CLIENT (postMessage)
   ============================================================ */

self.addEventListener("message", (event) => {
  const { type } = event.data || {};

  switch (type) {
    case "SKIP_WAITING":
      // Clientul cere activarea imediată a noii versiuni SW
      self.skipWaiting();
      break;

    case "CLEAR_CACHE":
      // Clientul cere ștergerea manuală a cache-ului (ex: buton "Resetează")
      event.waitUntil(
        caches.keys().then((keys) =>
          Promise.all(keys.map((key) => caches.delete(key)))
        ).then(() => {
          event.source?.postMessage({ type: "CACHE_CLEARED" });
          console.info("[SW] Cache șters complet la cererea clientului.");
        })
      );
      break;

    case "GET_VERSION":
      // Clientul întreabă ce versiune de SW rulează
      event.source?.postMessage({ type: "SW_VERSION", version: CACHE_VERSION });
      break;

    default:
      break;
  }
});

/* ============================================================
   PERIODIC BACKGROUND SYNC (experimental – Chrome only)
   Actualizează prețurile în fundal la un interval definit.
   ============================================================ */

/*
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "update-prices") {
    event.waitUntil(updateCachedPrices());
  }
});

async function updateCachedPrices() {
  // Logica de actualizare prețuri în fundal
  console.info("[SW] Periodic sync: actualizare prețuri");
}
*/

console.info(`[SmartTravel SW] Loaded · Cache version: ${CACHE_VERSION}`);
