// Service Worker for Food Transparency Portal
// IMPORTANT: Update SW_VERSION on each deployment to force cache refresh
// This ensures users get the latest version without manual cache clearing
// Format: Use semantic versioning (e.g., '2.0.1', '2.1.0', '3.0.0') or timestamp (e.g., '2.0.0-20240115')
const SW_VERSION = '2.0.1';
const CACHE_NAME = `food-transparency-portal-${SW_VERSION}`;
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.svg',
  '/favicon-96x96.png',
  '/apple-touch-icon.png',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker version:', SW_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Opened cache:', CACHE_NAME);
        // Don't cache index.html here - use network-first strategy
        return cache.addAll(urlsToCache.filter(url => url !== '/'));
      })
      .catch((error) => {
        console.error('[SW] Cache install failed:', error);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker version:', SW_VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('food-transparency-portal-')) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - network-first for HTML, cache-first for assets
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip API requests (they should always go to network)
  if (event.request.url.includes('/api/')) {
    return;
  }

  const url = new URL(event.request.url);
  const isHTML = event.request.destination === 'document' || 
                 url.pathname === '/' || 
                 url.pathname.endsWith('.html');

  // Network-first strategy for HTML files to ensure fresh content
  if (isHTML) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If network succeeds, update cache and return response
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If no cache, return offline page
            return caches.match('/');
          });
        })
    );
  } else {
    // Cache-first strategy for static assets
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request).then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
        })
        .catch(() => {
          // If both cache and network fail, return offline page for documents
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        })
    );
  }
});

// Message handler - allows clients to trigger service worker updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message, activating immediately');
    self.skipWaiting();
  }
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-inspections') {
    event.waitUntil(syncInspections());
  }
});

async function syncInspections() {
  // This would sync any pending inspections when back online
  console.log('Syncing inspections...');
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/web-app-manifest-192x192.png',
    badge: '/logo192.png',
    vibrate: [200, 100, 200],
    tag: 'notification',
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification('Food Transparency Portal', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

