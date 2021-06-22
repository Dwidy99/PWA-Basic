const staticCacheName = 'pages-cache-v1';

const filesToCache = [
	'/',
	'/css/style.css',
	'/js/jquery-3.6.0.min.js',
	'/js/main.js',
	'/img/fast.png',
];

// Install
self.addEventListener('install', (event) => {
	//   self.skipWaiting();
	event.waitUntil(
		caches.open(staticCacheName).then((cache) => {
			console.log('in install serviceWorker... cahce opened');
			return cache.addAll(filesToCache);
		})
	);
});

// Sajikan file dari cache
self.addEventListener('fetch', (event) => {
	console.log('Fetch event for ', event.request.url);
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				console.log('Found ', event.request.url, ' in cache');
				return response;
			}
			console.log('Network request for ', event.request.url);
			return fetch(event.request);
		})
	);
});

// Hapus Cache yang kadaluarsa
self.addEventListener('activate', (event) => {
	console.log('Activating new service worker...');

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
