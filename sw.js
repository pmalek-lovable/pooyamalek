/* Pooya Malek · service worker: cache the app shell, offline fallback only.
   Bump CACHE_NAME on any shell change so clients pick up the new version. */
var CACHE_NAME = 'pm-shell-v24';
var CORE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/app.js',
  '/views.js',
  '/assessment.js',
  '/manifest.json',
  '/offline.html',
  '/assets/favicon.svg',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/assets/apple-touch-icon.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(CORE_ASSETS); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Navigations: always try the network first so nobody gets stuck on a stale
// shell while online. Cache (then offline.html) is the fallback, not the default.
function handleNavigation(event) {
  event.respondWith(
    fetch(event.request).then(function (res) {
      caches.open(CACHE_NAME).then(function (cache) { cache.put('/index.html', res.clone()); });
      return res;
    }).catch(function () {
      return caches.match('/index.html').then(function (cached) { return cached || caches.match('/offline.html'); });
    })
  );
}

// Same-origin static shell assets: stale-while-revalidate.
function handleAsset(event) {
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var network = fetch(event.request).then(function (res) {
        if (res && res.ok) caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, res.clone()); });
        return res;
      }).catch(function () { return cached; });
      return cached || network;
    })
  );
}

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') { handleNavigation(event); return; }
  if (CORE_ASSETS.indexOf(url.pathname) !== -1) { handleAsset(event); return; }
});
