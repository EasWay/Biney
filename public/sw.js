const CACHE_VERSION = 'v3';
const STATIC_CACHE  = `biney-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `biney-dynamic-${CACHE_VERSION}`;

// Pre-cache core shell on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

// Clean up old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never intercept non-GET or API calls
  if (request.method !== 'GET' || url.pathname.startsWith('/api/')) return;

  // External requests (fonts, CDN) — cache-first with network fallback
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML navigation — network-first, fallback to cached shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // JS/CSS/images — stale-while-revalidate: serve cache instantly, update in background
  event.respondWith(
    caches.open(DYNAMIC_CACHE).then((cache) =>
      cache.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        });
        // Return cached version immediately if available, otherwise wait for network
        return cached || fetchPromise;
      })
    )
  );
});
