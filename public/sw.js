// Basic Service Worker for Tips Moto
// This prevents 404 errors when the browser requests a service worker

self.addEventListener('install', function(event) {
    console.log('Tips Moto Service Worker installed');
    // Skip waiting to activate immediately
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    console.log('Tips Moto Service Worker activated');
    // Claim control of all pages immediately
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
    // Let all requests pass through normally
    // No caching or offline functionality - just a basic stub
    return;
});

// Optional: Listen for messages from the main thread
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
