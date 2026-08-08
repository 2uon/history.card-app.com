const CACHE_NAME = "hanmatch-v96";
const OFFLINE_PAGE = "./index.html";
const APP_SHELL = [
  "./",
  "./index.html",
  "./timeline.html",
  "./styles.css?v=23",
  "./pairs.js?v=9",
  "./orders.js?v=2",
  "./classifications.js?v=1",
  "./app.js?v=32",
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
    const offlineTarget = new URL(request.url).pathname.replace(/\/$/, "").endsWith("/timeline")
      ? "./timeline.html"
      : OFFLINE_PAGE;
    event.respondWith(
      fetch(request)
        .then(response => response.ok ? response : Promise.reject(new Error("Navigation failed")))
        .catch(() => caches.match(request).then(cached => cached || caches.match(offlineTarget)))
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
