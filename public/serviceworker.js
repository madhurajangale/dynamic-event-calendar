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
  console.log('📦 Fetch intercepted:', event.request.url);

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        console.log('✅ Served from cache:', event.request.url);
        return cachedResponse;
      }

      return fetch(event.request).then(response => {
        console.log('🌐 Fetched from network:', event.request.url);
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(err => {
      console.log('❌ Fetch failed, maybe offline?', err);
      if (event.request.destination === 'document') {
        return caches.match('/offline.html');
      }
    })
  );
});


// Push
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

// Sync
self.addEventListener('sync', event => {
  console.log('🔁 Sync event received:', event.tag);

  // Accept both tags for testing
  if (event.tag === 'sync-my-data' || event.tag === 'test-tag-from-devtools') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log("📡 syncData() called");

  const storedData = await getStoredFormData();
  console.log("📄 Stored data to sync:", storedData);

  if (storedData) {
    await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(storedData),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      console.log('✅ Synced successfully:', res.status);
    }).catch(err => {
      console.error('❌ Sync failed:', err);
    });
  } else {
    console.log("ℹ️ No data to sync");
  }
}


// ✅ Simulate push manually using postMessage
self.addEventListener('push', event => {
  // Log it so we know it ran
  console.log('🟢 Push event received:', event);

  const data = event.data?.json() || {
    title: 'Fallback Title',
    body: 'Fallback body',
    icon: '/web-app-manifest-192x192.png'
  };

  console.log('🟢 Push data parsed:', data);

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.icon,
      vibrate: data.vibrate || [100, 50, 100]
    })
  );
});

