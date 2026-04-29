/* ═══════════════════════════════════════════════════
   VIP Brand — Service Worker v7
   Push Notifications + Auto-Update for ALL users
   
   ⚠️ This SW does NOT cache HTML, JS, or CSS
   to ensure customers always see the latest admin changes.
   Only icons and manifest are cached for offline icon display.
   ═══════════════════════════════════════════════════ */

const CACHE_NAME = 'vip-brand-v7';
const STATIC_ASSETS = [
  '/favicon.svg',
  '/manifest.json',
];

/* ── Install: Skip waiting immediately to activate ASAP ── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting(); // Activate immediately — don't wait for old SW
});

/* ── Activate: Clean old caches + Force ALL clients to reload ── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => {
      // Force all open pages to reload with the new code
      return self.clients.matchAll({ type: 'window' }).then(windowClients => {
        for (let client of windowClients) {
          client.navigate(client.url);
        }
      });
    })
  );
  self.clients.claim(); // Take control of ALL open pages immediately
});

/* ── Fetch: ALWAYS network for HTML/JS/CSS/API ── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Only handle GET requests
  if (request.method !== 'GET') return;
  
  // NEVER cache or intercept API calls
  if (request.url.includes('/api/')) return;
  
  const url = new URL(request.url);
  const isHTML = request.mode === 'navigate' || request.destination === 'document';
  const isJS = url.pathname.endsWith('.js') || request.destination === 'script';
  const isCSS = url.pathname.endsWith('.css') || request.destination === 'style';
  const isAssetBundle = url.pathname.includes('/assets/');
  
  // HTML/JS/CSS: ALWAYS from network — ensures admin changes reach ALL users
  if (isHTML || isJS || isCSS || isAssetBundle) {
    event.respondWith(
      fetch(request).catch(() => {
        if (isHTML) {
          return caches.match('/') || new Response('Offline', { status: 503 });
        }
        return new Response('', { status: 503 });
      })
    );
    return;
  }
  
  // Images and static: network first, cache fallback
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

/* ── Handle Push Events (works even when phone is locked) ── */
self.addEventListener('push', (event) => {
  let data = {
    title: '🛍️ طلب جديد - VIP Brand!',
    body: 'في طلب جديد على المتجر!',
    icon: '/icons/icon-192.png',
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
    icon: data.icon || '/icons/icon-192.png',
    badge: data.badge || '/favicon.svg',
    tag: data.tag || 'vip-order-' + Date.now(),
    vibrate: [300, 100, 300, 100, 300, 100, 300],
    requireInteraction: true,
    renotify: true,
    silent: false,
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
      for (const client of clients) {
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

/* ── Auto re-subscribe push if subscription expires ── */
self.addEventListener('pushsubscriptionchange', (event) => {
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
    }).catch(() => {})
  );
});

/* ── Periodic check for updates (every page load) ── */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
