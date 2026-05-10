const CACHE_NAME = "ayanokoji-v3";
const STATIC_CACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./offline.html",
  "./js/core/macros.js",
  "./js/core/validation.js",
  "./js/core/state.js",
  "./js/core/task-engine.js",
  "./js/core/achievements.js",
  "./js/core/recovery.js",
  "./js/core/progressive-overload.js",
  "./js/pr-tracker.js",
  "./js/dashboard-enhanced.js",
  "./js/achievements-ui.js",
  "./js/export.js",
  "./js/notifications.js",
  "./js/heatmap.js",
  "./js/theme.js",
  "./js/dashboard.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_CACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      // Only cache complete (200) responses, not partial (206)
      if (response && response.ok && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);
  return cached || networkPromise || caches.match("./offline.html");
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    // Only cache complete (200) responses, not partial (206)
    if (response && response.ok && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (await cache.match(request)) || (await caches.match("./offline.html"));
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  const sameOrigin = requestUrl.origin === self.location.origin;
  if (!sameOrigin) {
    return;
  }

  const isHtmlRequest =
    event.request.mode === "navigate" ||
    event.request.destination === "document" ||
    requestUrl.pathname.endsWith(".html");

  event.respondWith(isHtmlRequest ? networkFirst(event.request) : staleWhileRevalidate(event.request));
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'start' || event.action === 'snooze') {
    event.waitUntil(
      /* global clients */
      clients.matchAll({ type: 'window' }).then(clientList => {
        // Send message to client
        if (clientList.length > 0) {
          clientList[0].postMessage({
            type: 'notification-action',
            action: event.action
          });
          return clientList[0].focus();
        }
        // Open new window if no client exists
        return clients.openWindow('/');
      })
    );
  } else {
    // Default action - open app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
    );
  }
});

