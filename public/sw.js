/* ═══════════════════════════════════════════════════
   VIP Brand — Service Worker
   Push Notifications + Minimal Caching for PWA
   
   ⚠️ IMPORTANT: This SW does NOT cache HTML, JS, or CSS
   to ensure customers always see the latest admin changes.
   Only icons and manifest are cached for offline icon display.
   ═══════════════════════════════════════════════════ */

const CACHE_NAME = 'vip-brand-v5';
const STATIC_ASSETS = [
  '/favicon.svg',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

/* ── Install: Cache only icons/manifest ── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

/* ── Activate: Clean ALL old caches immediately ── */
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

/* ── Fetch: ALWAYS go to network for HTML/JS/CSS/API ── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Only handle GET requests
  if (request.method !== 'GET') return;
  
  // NEVER cache or intercept API calls
  if (request.url.includes('/api/')) return;
  
  // NEVER cache HTML pages, JS bundles, or CSS — always go to network
  // This ensures customers ALWAYS see the latest admin changes
  const url = new URL(request.url);
  const isHTML = request.mode === 'navigate' || request.destination === 'document';
  const isJS = url.pathname.endsWith('.js') || request.destination === 'script';
  const isCSS = url.pathname.endsWith('.css') || request.destination === 'style';
  const isAssetBundle = url.pathname.includes('/assets/');
  
  if (isHTML || isJS || isCSS || isAssetBundle) {
    // Network only — no caching, no fallback for dynamic content
    event.respondWith(
      fetch(request).catch(() => {
        // Only fallback to cache for navigation (offline support)
        if (isHTML) {
          return caches.match('/') || new Response('Offline', { status: 503 });
        }
        return new Response('', { status: 503 });
      })
    );
    return;
  }
  
  // For static assets (icons, images) — network first, cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
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
