// Tankpedia Service Worker – cacht bestanden voor offline gebruik
const CACHE = "tankpedia-v5";

// Lijst van bestanden die bij installatie worden gecacht
const FILES = [
  ".",
  "index.html",
  "SCRIPTS/app.js",
  "SCRIPTS/manifest.json",
  "SCRIPTS/tank-database.json",
  "IMG/Tank%20Logo.png"
];

// Install-event: alle bestanden in de cache plaatsen
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
});

// Activate-event: oude cache versies opruimen
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => { if (k !== CACHE) return caches.delete(k); })))
  );
  self.clients.claim();
});

// Fetch-event: probeer netwerk eerst, val terug op cache bij fout
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
