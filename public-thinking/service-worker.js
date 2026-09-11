const CACHE_NAME = "thinkos-v33";
const MAX_CACHE_ENTRIES = 50;
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.svg",
  "./apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg"
];

async function trimCache(cacheName, maxEntries) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxEntries) {
      await cache.delete(keys[0]);
      return trimCache(cacheName, maxEntries);
    }
  } catch (e) {
    console.warn("Trim cache error:", e);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle http and https scheme requests (ignore chrome-extension, blob, etc.)
  if (!request.url.startsWith("http://") && !request.url.startsWith("https://")) {
    return;
  }

  // Never cache/handle AI bridge, Firestore, Firebase, or Google auth traffic.
  if (
    request.url.includes("/api/") ||
    request.url.includes("firestore") ||
    request.url.includes("googleapis") ||
    request.url.includes("firebase") ||
    request.url.includes("firebaseapp.com") ||
    request.url.includes("accounts.google") ||
    request.url.includes("google.com") ||
    request.url.includes("gstatic.com")
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-cache" })
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          }
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          // Don't cache non-200 or non-basic responses, or responses larger than 2MB
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const contentLength = response.headers.get('content-length');
          if (contentLength && parseInt(contentLength) > 2 * 1024 * 1024) {
            return response;
          }
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, copy).catch(e => console.warn("Cache put failed:", e));
            trimCache(CACHE_NAME, MAX_CACHE_ENTRIES);
          });
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
