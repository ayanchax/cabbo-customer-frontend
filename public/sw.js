// This is a basic service worker for PWA support. VitePWA will inject and manage this automatically.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

// You can add fetch event logic for custom caching if needed.
