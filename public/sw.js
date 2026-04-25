// ─── OneSignal push handler (must be first) ─────────────────────────────────
// Importing here merges push delivery into this single SW file, avoiding the
// scope conflict that occurs when two separate workers both target scope '/'.
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

// ─── App cache ────────────────────────────────────────────────────────────────
const CACHE_NAME = 'oldhealthy-v1';

const PRECACHE_URLS = ['/', '/index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  const url = event.request.url;

  // Never cache external services — always hit the network
  if (
    url.includes('onesignal.com') ||
    url.includes('api.anthropic.com') ||
    url.includes('supabase.co') ||
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('googleapis.com') ||
    url.includes('emailjs.com') ||
    url.includes('unsplash.com')
  ) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);

      // Cache-first for static assets, network-first for HTML
      if (url.includes('/assets/') || url.match(/\.(js|css|woff2?|png|svg|ico)$/)) {
        return cached || networkFetch;
      }
      return networkFetch || cached;
    })
  );
});
