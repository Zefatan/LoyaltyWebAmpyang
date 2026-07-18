/* ============================================================
   Service Worker — bikin situs bisa di-install (PWA) dan
   tetap terbuka walau sinyal jelek di kedai.
   Strategi:
   - HTML & JSON promo: network-first (selalu coba versi terbaru)
   - CSS/JS/ikon: cache-first (cepat, hemat kuota)
   Naikkan VERSI setiap kali file situs berubah besar.
   ============================================================ */

const VERSI = "ampyang-v1";

const ASET_INTI = [
  "index.html",
  "kartu.html",
  "promo.html",
  "css/style.css",
  "js/config.js",
  "js/storage.js",
  "js/app.js",
  "js/kartu.js",
  "data/promos.json",
  "manifest.webmanifest",
  "assets/icon-192.png",
  "assets/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSI).then((c) => c.addAll(ASET_INTI)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== VERSI).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const networkFirst =
    req.mode === "navigate" ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".json");

  if (networkFirst) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const salinan = res.clone();
          caches.open(VERSI).then((c) => c.put(req, salinan));
          return res;
        })
        .catch(() => caches.match(req))
    );
  } else {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const salinan = res.clone();
            caches.open(VERSI).then((c) => c.put(req, salinan));
            return res;
          })
      )
    );
  }
});
