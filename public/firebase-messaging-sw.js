// Firebase Cloud Messaging Background Service Worker (Dedicated for PWA & Lock-Screen Calls)
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

try {
  firebase.initializeApp({
    projectId: "gen-lang-client-0385276763",
    appId: "1:398473187816:web:becc6125d6dc5dc1f8545d",
    apiKey: "AIzaSyDPvrnAw7xVXxwof-KdC2YpTz93FSYYGRs",
    authDomain: "gen-lang-client-0385276763.firebaseapp.com",
    storageBucket: "gen-lang-client-0385276763.firebasestorage.app",
    messagingSenderId: "398473187816",
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] FCM Background Message received:', payload);
    const isCall =
      payload.data?.action === 'incoming_call' ||
      payload.data?.isCall === 'true' ||
      payload.data?.isCall === true ||
      (typeof payload.data?.tag === 'string' && payload.data?.tag.startsWith('incoming-call'));
    const callId = payload.data?.callId || Date.now();
    const callerName = payload.data?.callerName;

    const title =
      payload.notification?.title ||
      payload.data?.title ||
      (isCall ? `📞 ${callerName || 'প্রবাসী সদস্য'} থেকে কল আসছে` : 'প্রবাসী মুক্ত ফান্ড');
    const body =
      payload.notification?.body ||
      payload.data?.body ||
      (isCall ? 'ফোন লক থাকলেও রিসিভ বা কেটে দিতে ট্যাপ করুন' : 'নতুন নোটিফিকেশন এসেছে');

    const options = {
      body,
      icon: payload.notification?.icon || payload.data?.icon || '/udbhob_logo.svg',
      badge: '/udbhob_logo.svg',
      tag: payload.data?.tag || (isCall ? `incoming-call-${callId}` : `udbhob-${Date.now()}`),
      renotify: true,
      requireInteraction: isCall ? true : Boolean(payload.data?.requireInteraction),
      silent: false,
      timestamp: Date.now(),
      vibrate: isCall
        ? [1000, 400, 1000, 400, 1200, 400, 1500, 400, 2000]
        : [200, 100, 200, 100, 200],
      data: payload.data || { url: '/' },
      actions: isCall
        ? [
            { action: 'answer', title: '📞 রিসিভ করুন' },
            { action: 'decline', title: '❌ কেটে দিন' },
          ]
        : [
            { action: 'open', title: '👀 দেখুন' },
            { action: 'close', title: '❌ বন্ধ' },
          ],
    };

    return self.registration.showNotification(title, options).catch(() => {
      return self.registration.showNotification(title, { ...options, actions: undefined });
    });
  });
} catch (err) {
  console.warn('[firebase-messaging-sw.js] Note:', err);
}

// Re-use notificationclick routing
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const notifData = event.notification.data || {};
  const isCall = notifData.action === 'incoming_call' || notifData.isCall === 'true' || notifData.isCall === true;
  const targetUrl = notifData.url || '/';

  if (action === 'decline' || action === 'close') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          client.postMessage({ type: 'DECLINE_INCOMING_CALL', data: notifData });
        }
      })
    );
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          if (action === 'answer' || isCall) {
            client.postMessage({ type: 'ANSWER_INCOMING_CALL', data: notifData });
          }
          return client.focus();
        }
      }

      if (clients.openWindow) {
        const dest = isCall && notifData.callId ? `/?callAction=answer&callId=${notifData.callId}` : targetUrl;
        return clients.openWindow(dest);
      }
    })
  );
});
