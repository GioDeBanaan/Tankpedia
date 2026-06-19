const CACHE = "tankpedia-v5";
const FILES = [
  ".",
  "index.html",
  "SCRIPTS/app.js",
  "SCRIPTS/manifest.json",
  "SCRIPTS/tank-database.json",
  "IMG/Tank%20Logo.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => { if (k !== CACHE) return caches.delete(k); })))
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
