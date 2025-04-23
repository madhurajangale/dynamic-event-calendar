const CACHE_NAME = "app-cache-v1";
const urlsToCache = ["/", "/index.html", "/manifest.json"];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // If in cache, return it; otherwise fetch from network
      return cachedResponse || fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          // Cache the new response for future use
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(() => {
      // Optional: return a fallback page/image when offline
      if (event.request.destination === 'document') {
        return caches.match('/offline.html');
      }
    })
  );
});

self.addEventListener('push', event => {
  const data = event.data?.json() || {
    title: 'Default Title',
    body: 'Default body',
    icon: '/web-app-manifest-192x192.png'
  };

  const options = {
    body: data.body,
    icon: data.icon,
    badge: '/web-app-manifest-192x192.png',
    vibrate: [100, 50, 100]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('sync', event => {
  if (event.tag === 'sync-my-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Example: send stored form data when back online
  const storedData = await getStoredFormData(); // You’d use IndexedDB here
  if (storedData) {
    await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(storedData),
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
