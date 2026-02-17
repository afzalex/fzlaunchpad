// Service Worker for fzlaunchpad - Enables offline functionality
const CACHE_VERSION = 'v1';
const CACHE_NAME = `fzlaunchpad-${CACHE_VERSION}`;
const RUNTIME_CACHE = `fzlaunchpad-runtime-${CACHE_VERSION}`;

// Essential files to cache on install
const ESSENTIAL_ASSETS = [
  '/',
  '/index.html',
];

// Patterns for assets that should be cached
const CACHE_PATTERNS = [
  /\/assets\/.*\.(js|css)$/i,           // Vite bundled JS/CSS
  /\/images\/.*\.(jpg|jpeg|png|gif|svg|webp)$/i,  // Images
  /\/config.*\.yaml$/i,                 // Config files
  /\/favicon\.(png|ico|svg)$/i,         // Favicon
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache essential files individually to handle missing files gracefully
      return Promise.allSettled(
        ESSENTIAL_ASSETS.map((url) => {
          return cache.add(url).catch((err) => {
            console.warn(`[Service Worker] Failed to cache ${url}:`, err);
            return null;
          });
        })
      ).then(() => {
        console.log('[Service Worker] Installation completed');
      });
    })
  );
  
  // Force activation immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Keep current caches, delete old ones
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (health checks are handled by the app)
  if (url.origin !== location.origin) {
    return;
  }

  // Check if this is a cacheable asset
  const isCacheable = CACHE_PATTERNS.some(pattern => pattern.test(url.pathname)) ||
                     url.pathname === '/' ||
                     url.pathname === '/index.html';

  if (!isCacheable) {
    return; // Let browser handle non-cacheable requests
  }

  // For config.yaml requests, try network first, fallback to cache
  if (request.headers.get('accept')?.includes('text/html') || url.pathname === '/config.yaml') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback to index.html for SPA routing
            return caches.match('/index.html');
          });
        })
    );
    return;
  }

  // For other assets (JS, CSS, images, html files), cache first, fallback to network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed and not in cache
          // For images, return empty response
          if (request.destination === 'image') {
            return new Response('', { status: 404, statusText: 'Not Found' });
          }
          // For other assets, return empty response
          return new Response('', { status: 404, statusText: 'Not Found' });
        });
    })
  );
});
