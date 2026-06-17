// Tankpedia service worker: caches app files for offline fallback.
// Uses network-first: always tries the server first, falls back to cache when offline.
const CACHE = "tankpedia-v4";
const FILES = [
  ".",
  "index.html",
  "script.js",
  "manifest.json",
  "tanks.json",
  "IMG/Tank Logo.png"
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
