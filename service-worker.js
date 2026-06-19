// Tankpedia Service Worker – cacht bestanden voor offline gebruik
const CACHE = "tankpedia-v6";

// Lijst van bestanden die bij installatie worden gecacht
const FILES = [
  ".",
  "index.html",
  "SCRIPTS/app.js",
  "manifest.json",
  "SCRIPTS/tank-database.json",
  "IMG/Tank%20Logo.png",
  "IMG/bunker_green-camo.jpg"
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

// Fetch-event: netwerk eerst, bij navigatie-fout index.html uit cache (SPA fallback)
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      if (e.request.mode === "navigate") {
        return caches.match("index.html");
      }
      return caches.match(e.request);
    })
  );
});
