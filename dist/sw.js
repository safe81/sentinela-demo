/* Sentinela — Service Worker (app-shell cache) */

const CACHE = 'sentinela-shell-v1';

// All files needed to run the mobile app offline
const SHELL = [
  'mobile.html',
  'colors_and_type.css',
  'data.js',
  'store.js',
  'primitives.jsx',
  'manifest.json',
  'app_mobile/Login.jsx',
  'app_mobile/Patrulha.jsx',
  'app_mobile/Scanner.jsx',
  'app_mobile/Comms.jsx',
  'app_mobile/Extras.jsx',
  'app_mobile/Shell.jsx',
  'assets/sentinela-shield.svg',
  'assets/sentinela-wordmark.svg',
  'assets/sentinela-wordmark-dark.svg',
];

// CDN scripts — cache on first fetch, serve from cache after
const CDN_ORIGINS = [
  'https://unpkg.com',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  // Remove old caches
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  const isCDN = CDN_ORIGINS.some(o => e.request.url.startsWith(o));

  if (isCDN) {
    // CDN: cache-first, fall back to network
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        });
      })
    );
    return;
  }

  // App shell: cache-first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        // Cache any successfully fetched local file
        if (res.ok && url.origin === self.location.origin) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached); // offline fallback
    })
  );
});
