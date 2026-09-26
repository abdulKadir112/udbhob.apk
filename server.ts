import express from 'express';
import path from 'path';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Lazy Firebase Admin Initialization
let adminAppInstance: App | null = null;

function getFirebaseAdminApp(): App | null {
  try {
    const existingApps = getApps();
    if (adminAppInstance && existingApps.length > 0) {
      return adminAppInstance;
    }
    if (existingApps.length > 0) {
      adminAppInstance = existingApps[0];
      return adminAppInstance;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0385276763';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (clientEmail && privateKey) {
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
      privateKey = privateKey.replace(/\\n/g, '\n');

      adminAppInstance = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        projectId,
      });
      console.log('✅ Firebase Admin initialized with service account.');
      return adminAppInstance;
    }

    // Initialize with project ID
    adminAppInstance = initializeApp({
      projectId,
    });
    console.log('✅ Firebase Admin initialized with project ID:', projectId);
    return adminAppInstance;
  } catch (err) {
    console.warn('⚠️ Firebase Admin initialization note:', err);
    const existing = getApps();
    return existing.length > 0 ? existing[0] : null;
  }
}

// 📌 API Route: Send FCM Push Notification (Calls, SMS & Alerts)
app.post('/api/send-fcm-notification', async (req, res) => {
  try {
    const {
      token,
      tokens,
      title,
      body,
      icon,
      url,
      isCall,
      callId,
      callerName,
      callType,
      data = {},
    } = req.body;

    const recipientTokens: string[] = [];
    if (token && typeof token === 'string') recipientTokens.push(token);
    if (Array.isArray(tokens)) {
      tokens.forEach((t) => {
        if (typeof t === 'string' && t && !recipientTokens.includes(t)) {
          recipientTokens.push(t);
        }
      });
    }

    if (recipientTokens.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No recipient FCM token provided.',
      });
    }

    const adminApp = getFirebaseAdminApp();
    if (!adminApp) {
      return res.status(500).json({
        success: false,
        message: 'Firebase Admin could not be initialized.',
      });
    }

    const messaging = getMessaging(adminApp);
    const notificationTitle = title || (isCall ? `📞 ${callerName || 'সদস্য'} থেকে কল আসছে` : 'প্রবাসী মুক্ত ফান্ড');
    const notificationBody = body || (isCall ? 'ফোন লক থাকলেও রিসিভ বা কেটে দিতে ট্যাপ করুন' : 'নতুন বার্তা এসেছে');
    const notificationIcon = icon || '/udbhob_logo.svg';
    const targetUrl = url || (isCall ? `/?callAction=answer&callId=${callId || 'live'}` : '/');

    const topLevelNotification: { title: string; body: string; imageUrl?: string } = {
      title: notificationTitle,
      body: notificationBody,
    };
    if (typeof notificationIcon === 'string' && (notificationIcon.startsWith('http://') || notificationIcon.startsWith('https://'))) {
      topLevelNotification.imageUrl = notificationIcon;
    }

    const commonPayload = {
      notification: topLevelNotification,
      data: {
        url: targetUrl,
        isCall: isCall ? 'true' : 'false',
        callId: String(callId || ''),
        callerName: String(callerName || ''),
        callType: String(callType || 'audio'),
        timestamp: String(Date.now()),
        action: isCall ? 'incoming_call' : 'message',
        ...Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, String(v)])
        ),
      },
      android: {
        priority: 'high' as const,
        ttl: isCall ? 60 * 1000 : 86400 * 1000,
        notification: {
          title: notificationTitle,
          body: notificationBody,
          icon: 'udbhob_logo',
          color: '#10B981',
          sound: 'default',
          priority: 'max' as const,
          visibility: 'public' as const,
          channelId: 'calls_channel',
          defaultVibrateTimings: !isCall,
          vibrateTimingsMillis: isCall ? [0, 1000, 400, 1000, 400, 1200, 400, 1500, 400, 2000] : undefined,
        },
      },
      webpush: {
        headers: {
          Urgency: isCall ? 'high' : 'normal',
          TTL: isCall ? '60' : '86400',
        },
        notification: {
          title: notificationTitle,
          body: notificationBody,
          icon: notificationIcon,
          badge: '/udbhob_logo.svg',
          tag: isCall ? `incoming-call-${callId || Date.now()}` : `udbhob-${Date.now()}`,
          renotify: true,
          requireInteraction: isCall ? true : false,
          silent: false,
          vibrate: isCall
            ? [1000, 300, 1000, 300, 1200, 300, 1500, 400, 2000]
            : [200, 100, 200, 100, 200],
          actions: isCall
            ? [
                { action: 'answer', title: '📞 রিসিভ করুন' },
                { action: 'decline', title: '❌ কেটে দিন' },
              ]
            : [
                { action: 'open', title: '👀 দেখুন' },
                { action: 'close', title: '❌ বন্ধ' },
              ],
        },
        fcmOptions: {
          link: targetUrl,
        },
      },
    };

    const results = await Promise.allSettled(
      recipientTokens.map((t) =>
        messaging.send({
          ...commonPayload,
          token: t,
        })
      )
    );

    const successfulCount = results.filter((r) => r.status === 'fulfilled').length;
    const failureCount = results.filter((r) => r.status === 'rejected').length;

    console.log(`[FCM Push] Sent to ${recipientTokens.length} devices (Success: ${successfulCount}, Failed: ${failureCount})`);

    return res.status(200).json({
      success: successfulCount > 0,
      sentCount: successfulCount,
      failureCount,
      results: results.map((r) => (r.status === 'fulfilled' ? r.value : (r as any).reason?.message || (r as any).reason)),
    });
  } catch (error: any) {
    console.error('❌ Error sending FCM push notification:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Unknown error occurred while dispatching FCM',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
