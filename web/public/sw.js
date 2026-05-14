// =====================================================================
// ShopAI — Service Worker
// Cache-first for static assets, network-first for API calls
// =====================================================================

const CACHE_NAME = 'shopai-v1';
const PRECACHE = [
  './ShopAI.html',
  './shared-components.jsx',
  './home-page.jsx',
  './product-page.jsx',
  './cart-checkout.jsx',
  './user-dashboard.jsx',
  './seller-page.jsx',
  './tweaks-panel.jsx',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
];

// Install — precache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE.filter(url => !url.startsWith('http'))))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache-first for same-origin, network-first for CDN
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== 'GET') return;

  // CDN resources (React, Babel, fonts) — network first with cache fallback
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Same-origin — cache first, then network
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(request, clone));
        return res;
      });
    })
  );
});

// Listen for skip-waiting message from client
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
