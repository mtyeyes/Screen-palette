self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('app-cache').then(function(cache) {
        return cache.addAll(
          [
            'index.html',
            'manifest.json',
            'css/style.css',
            'js/script.js',
          ]
        );
      })
    );
  });

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
