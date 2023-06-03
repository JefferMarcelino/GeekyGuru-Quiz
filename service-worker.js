const cacheName = 'geeky-guru-quiz';
const cacheAssets = [
  './index.html',
  './style.css',
  './script.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(cacheAssets))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
