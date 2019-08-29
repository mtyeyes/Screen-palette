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

// <<<<<<<<<<<<<<<<<<----------------------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


'use strict';

const version = '201904300000::';

// Caches for different resources
const coreCacheName = version + 'core';
const pagesCacheName = version + 'pages';
const assetsCacheName = version + 'assets';

// Resources that will be always be cached
const coreCacheUrls = [
  '/',
  '/about/',
  '/offline/',
  '/css/style.css',
  '/javascripts/site.js',
  '/images/afasterweb-logo-white.png',
  '/images/profile-image-300.jpg'
];

function updateCoreCache() {
  return caches.open(coreCacheName)
    .then( cache => {
      // Make installation contingent on storing core cache items
      return cache.addAll(coreCacheUrls);
    });
}

function addToCache(cacheName, request, response) {
  caches.open(cacheName)
    .then( cache => cache.put(request, response) );
}

    // Remove old caches that don't match current version
function clearCaches() {
  return caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(key) {
        return key.indexOf(version) !== 0;
      }).map(function(key) {
        return caches.delete(key);
      })
    );
  })
}

    // Check if request is something SW should handle


self.addEventListener('install', event => {
  event.waitUntil(updateCoreCache()
    .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    clearCaches().then( () => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('message', event => {
  if (event.data.command == 'trimCaches') {
    trimCache(pagesCacheName, 20);
    trimCache(assetsCacheName, 20);
  }
});


self.addEventListener('fetch', event => {

  let request = event.request,
      acceptHeader = request.headers.get('Accept');

  // Do not respond to non-GET requests
  if (!shouldFetch(event)) {
    event.respondWith(
      fetch(request)
        .catch( () => {
          return caches.match('/offline/');
        })
      );
    return;
  }

  // HTML Requests
  if (acceptHeader.indexOf('text/html') !== -1) {
    // Try network first
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok)
            addToCache(pagesCacheName, request, response.clone());
          return response;
        })
      // Try cache second with offline fallback
      .catch( () => {
        return caches.match(request).then( response => {
            return response || caches.match('/offline/');
        })
      })
    );

  // Non-HTML Requests
  } else if (acceptHeader.indexOf('text/html') == -1) {
    event.respondWith(
      caches.match(request)
        .then( response => {
          // Try cache, then network, then offline fallback
          return response || fetch(request)
            .then( response => {
              if (response.ok)
                addToCache(assetsCacheName, request, response.clone());
              return response;
            })
          .catch( () => {
            return new Response('<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>', { headers: { 'Content-Type': 'image/svg+xml' }});
          })
      })
    );
  }
});


// Pass offline pages cache for display on the Offline page
self.addEventListener('message', event => {
  if (event.data.command == 'getOfflinePages') {

    console.log('inside SW message handler'); // this comes from the ServiceWorker
    let pages = [];
    caches.open(pagesCacheName).then(function(cache) {
      cache.keys().then(function(keys) {
        keys.forEach(function(request, index, array) {
          getResponseMeta(cache, request).then(meta => {
            if (meta) pages.push(meta);
            if (index == array.length - 1) {
              console.log('meta', event.ports[0], pages);
              event.ports[0].postMessage({'offlinePages': pages});
            }
          });
        });
      });
    }).catch(e => { console.log(e) } );
  }

  // Gets Title and Description from the response text
  function getResponseMeta(cache, request){
    return cache.match(request).then(response => {
      return response.text().then(function(html){
        try {
          let title = html.match(/<title>([^<]+)<\/title>/)[1];
          let description = html.match(/<meta name="description" content="([^"]*?)">/)[1];
          let url = new URL(request.url).pathname;
          return {
            title: title,
            description: description,
            url: url
          };
        } catch(e) { console.log('error in meta parsing', e); }
      });
    });
  }

});