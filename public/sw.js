// Udbhob Service Worker for Offline PWA, Lock-Screen Calls & Push Notifications
const CACHE_NAME = 'udbhob-sw-v5-offline-calls';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/udbhob_logo.svg',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Initial cache preload note:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      ),
    ])
  );
});

// Cache & Offline Interceptor for PWA Assets, Images & Media
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests and Firestore / Firebase API endpoints (Firestore handles its own IndexedDB offline sync)
  if (
    request.method !== 'GET' ||
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('firebaseinstallations.googleapis.com')
  ) {
    return;
  }

  // 1. Navigation requests (App Shell) - Network First with Cache Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match('/index.html') || await caches.match('/');
          return fallback || new Response('Offline', { status: 200, headers: { 'Content-Type': 'text/html' } });
        })
    );
    return;
  }

  // 2. Images, Audio, Fonts, Scripts & Styles - Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Handle Background Push Events
self.addEventListener('push', (event) => {
  let data = {
    title: 'উদ্ভব - নতুন বার্তা',
    body: 'প্রবাসী মুক্ত ফান্ডে নতুন একটি আপডেট এসেছে।',
    icon: '/udbhob_logo.svg',
    badge: '/udbhob_logo.svg',
    tag: 'udbhob-notification',
    data: { url: '/' },
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const isCall = data.data && (data.data.action === 'incoming_call' || data.isCall || data.tag?.startsWith('incoming-call'));

  const options = {
    body: data.body,
    icon: data.icon || '/udbhob_logo.svg',
    badge: data.badge || '/udbhob_logo.svg',
    image: data.image,
    vibrate: isCall
      ? [1000, 400, 1000, 400, 1200, 400, 1500, 400, 2000]
      : [200, 100, 200, 100, 200],
    tag: data.tag || (isCall ? `incoming-call-${Date.now()}` : `udbhob-${Date.now()}`),
    renotify: true,
    requireInteraction: isCall ? true : Boolean(data.requireInteraction),
    silent: false,
    timestamp: Date.now(),
    data: data.data || { url: '/' },
    actions: isCall
      ? [
          { action: 'answer', title: '📞 রিসিভ করুন (Answer)' },
          { action: 'decline', title: '❌ কেটে দিন (Decline)' },
        ]
      : [
          { action: 'open', title: '👀 দেখুন (View)' },
          { action: 'close', title: '❌ বন্ধ (Dismiss)' },
        ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle Client Messages (e.g. app requesting SW to show high priority call notification)
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SHOW_INCOMING_CALL_NOTIFICATION') {
    const { title, body, icon, callId, isVideo } = event.data;
    const options = {
      body: body || `${isVideo ? 'ভিডিও কল' : 'অডিও কল'} আসছে... রিসিভ করতে ট্যাপ করুন।`,
      icon: icon || '/udbhob_logo.svg',
      badge: '/udbhob_logo.svg',
      tag: `incoming-call-${callId}`,
      renotify: true,
      requireInteraction: true,
      silent: false,
      timestamp: Date.now(),
      vibrate: [1000, 400, 1000, 400, 1200, 400, 1500, 400, 2000],
      data: {
        url: `/?callAction=answer&callId=${callId}`,
        callId,
        action: 'incoming_call',
        isCall: true,
      },
      actions: [
        { action: 'answer', title: '📞 রিসিভ করুন' },
        { action: 'decline', title: '❌ কেটে দিন' },
      ],
    };

    event.waitUntil(self.registration.showNotification(title || '📞 ইনকামিং কল আসছে', options));
  } else if (event.data.type === 'CANCEL_CALL_NOTIFICATION' && event.data.callId) {
    event.waitUntil(
      self.registration.getNotifications({ tag: `incoming-call-${event.data.callId}` }).then((notifications) => {
        notifications.forEach((n) => n.close());
      })
    );
  }
});

// Handle Notification Click & Action Buttons
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const notifData = event.notification.data || {};
  const isCall = notifData.action === 'incoming_call' || notifData.isCall;
  const targetUrl = notifData.url || '/';

  if (action === 'decline' || action === 'close') {
    // Notify clients that call was declined
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          client.postMessage({ type: 'DECLINE_INCOMING_CALL', data: notifData });
        }
      })
    );
    return;
  }

  // Answer call or open message/view
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it and dispatch the answer action
      for (const client of clientList) {
        if ('focus' in client) {
          if (action === 'answer' || isCall) {
            client.postMessage({ type: 'ANSWER_INCOMING_CALL', data: notifData });
          }
          return client.focus();
        }
      }

      // If no window is currently open, launch new window with answer parameter
      if (clients.openWindow) {
        const dest = isCall && notifData.callId ? `/?callAction=answer&callId=${notifData.callId}` : targetUrl;
        return clients.openWindow(dest);
      }
    })
  );
});
