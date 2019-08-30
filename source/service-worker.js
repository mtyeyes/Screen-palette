let urlsToCache = [
  'index.html',
  'manifest.json',
  'css/style.css',
  'js/script.js'
]

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('app-cache').then(function(cache) {
        return cache.addAll(urlsToCache);
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
