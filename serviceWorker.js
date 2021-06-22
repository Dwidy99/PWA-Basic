const staticCacheName = "pages-cache-v1";

const filesToCache = [
  "/",
  "/css/style.css",
  "/js/jquery-3.6.0.min.js",
  "/js/main.js",
  "/img/fast.png",
  "/fallback.json",
];

// Install
self.addEventListener("install", (event) => {
  //   self.skipWaiting();
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("in install serviceWorker... cahce opened");
      return cache.addAll(filesToCache);
    })
  );
});

// Strategi cache --> Cache Then Network
self.addEventListener("fetch", (event) => {
  var request = event.request;
  var url = new URL(request.url);

  // Pindahkan request API dan Internal
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then(function (response) {
        return response || fetch(response);
      })
    );
  } else {
    event.respondWith(
      caches
        .open("products-cache")
        .then(function (cache) {
          return fetch(request).then(function (liveResponse) {
            cache.put(request, liveResponse.clone());
            return liveResponse;
          });
        })
        // --> jika tidak berhasil cache dari network
        .catch(function () {
          return caches.match(request).then(function (response) {
            if (response) return response;
            return caches.match("/fallback.json");
          });
        })
    );
  }
});

// Hapus Cache yang kadaluarsa
self.addEventListener("activate", (event) => {
  console.log("Activating new service worker...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            return cacheName != staticCacheName;
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    })
  );
});
