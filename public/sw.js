/* ═══════════════════════════════════════════════════
   VIP Brand — Service Worker
   Push Notifications + App Caching for PWA
   ═══════════════════════════════════════════════════ */

const CACHE_NAME = 'vip-brand-v3';
const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

/* ── Install: Cache critical assets ── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Don't fail install if some assets aren't available yet
      });
    })
  );
  self.skipWaiting();
});

/* ── Activate: Clean old caches ── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

/* ── Fetch: Network-first with cache fallback ── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET and API requests
  if (request.method !== 'GET') return;
  if (request.url.includes('/api/')) return;
  
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // For navigation requests, serve the cached index
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});

/* ── Handle Push Events (works even when phone is locked/closed) ── */
self.addEventListener('push', (event) => {
  let data = {
    title: '🛍️ طلب جديد - VIP Brand!',
    body: 'في طلب جديد على المتجر!',
    icon: '/icons/icon-192.svg',
    badge: '/favicon.svg',
    tag: 'vip-new-order',
    url: '/admin',
  };

  try {
    if (event.data) {
      const payload = event.data.json();
      data = { ...data, ...payload };
    }
  } catch (e) {
    // Use defaults
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192.svg',
    badge: data.badge || '/favicon.svg',
    tag: data.tag || 'vip-order-' + Date.now(), // unique tag so each order shows
    vibrate: [300, 100, 300, 100, 300, 100, 300], // stronger vibration pattern
    requireInteraction: true, // stays on screen until dismissed
    renotify: true, // always notify even if same tag
    silent: false, // make sure sound plays
    data: { url: data.url || '/admin' },
    actions: [
      { action: 'open', title: '📋 فتح الطلبات' },
      { action: 'dismiss', title: '✕ تجاهل' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/* ── Handle Notification Click ── */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/admin';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Try to focus existing admin window
      for (const client of clients) {
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

/* ── Keep Service Worker alive for push ── */
self.addEventListener('pushsubscriptionchange', (event) => {
  // Re-subscribe automatically if subscription expires
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: self.registration.pushManager.getSubscription()
        .then(sub => sub?.options?.applicationServerKey)
    }).then((newSub) => {
      return fetch('/api/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: newSub.toJSON(),
          label: 'admin',
        }),
      });
    }).catch(() => {
      // Silently fail - will be re-subscribed on next admin visit
    })
  );
});
