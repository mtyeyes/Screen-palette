let urlsToCache = [
  '/palette/',
  '/palette/manifest.json',
  '/palette/css/style.css',
  '/palette/js/script.js'
]

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(uniqueSN).then(function(cache) {
      return cache.addAll(urlsToCache);
    }),
    caches.keys().then(function(cacheNames) {
      cacheNames.forEach(function(cacheName) {
        if (cacheName !== uniqueSN) caches.delete(cacheName)
      })
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) { return response; }
      return fetch(event.request);
      })
  );
});
