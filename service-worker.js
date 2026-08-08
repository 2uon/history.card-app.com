const CACHE_NAME = "hanmatch-v82";
const OFFLINE_PAGE = "./index.html";
const APP_SHELL = [
  "./",
  "./index.html",
  "./timeline.html",
  "./styles.css?v=17",
  "./pairs.js?v=7",
  "./orders.js?v=1",
  "./classifications.js?v=1",
  "./app.js?v=20",
  "./timeline.css?v=82",
  "./timeline-data.js?v=82",
  "./timeline.js?v=82",
  "./manifest.webmanifest?v=3",
  "./app-icon-v2.svg",
  "./app-icon-192.png",
  "./app-icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => response.ok ? response : Promise.reject(new Error("Navigation failed")))
        .catch(() => caches.match(request).then(cached => cached || caches.match(OFFLINE_PAGE)))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (!response.ok) return response;
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      return response;
    }))
  );
});
