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

// Enable CORS for Native Capacitor Android APK (capacitor://localhost, https://localhost) and Web
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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
    const notificationBody = body || (isCall ? 'প্রবাসী মুক্ত ফান্ড কল আসছে। রিসিভ বা কেটে দিতে ট্যাপ করুন' : 'নতুন বার্তা এসেছে');
    const notificationIcon = icon || '/udbhob_logo.svg';
    const targetUrl = url || (isCall ? `/?callAction=answer&callId=${callId || 'live'}` : '/');

    // Build comprehensive data payload with both camelCase and snake_case keys
    const enrichedData = {
      type: isCall ? 'incoming_call' : 'notification',
      action: isCall ? 'incoming_call' : 'message',
      isCall: isCall ? 'true' : 'false',
      callId: String(callId || ''),
      call_id: String(callId || ''),
      callerName: String(callerName || 'প্রবাসী সদস্য'),
      caller_name: String(callerName || 'প্রবাসী সদস্য'),
      callerRole: String(data.callerRole || data.caller_role || 'member'),
      caller_role: String(data.callerRole || data.caller_role || 'member'),
      callerCountry: String(data.callerCountry || data.caller_country || 'প্রবাসী'),
      caller_country: String(data.callerCountry || data.caller_country || 'প্রবাসী'),
      callType: String(callType || 'audio'),
      call_type: String(callType || 'audio'),
      callerAvatar: String(notificationIcon),
      caller_avatar: String(notificationIcon),
      title: notificationTitle,
      body: notificationBody,
      timestamp: String(Date.now()),
      url: targetUrl,
      ...Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
      ),
    };

    const commonPayload: any = {
      data: enrichedData,
      android: {
        priority: 'high' as const,
        ttl: isCall ? 60 * 1000 : 86400 * 1000,
        directBootOk: true,
        // For general messages/announcements only: show system tray notification
        ...(!isCall && {
          notification: {
            title: notificationTitle,
            body: notificationBody,
            icon: 'ic_launcher',
            color: '#005C4B',
            sound: 'default',
            priority: 'max' as const,
            visibility: 'public' as const,
            channelId: 'probashi_general_channel_v2',
            defaultVibrateTimings: true,
          },
        }),
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
          data: enrichedData,
        },
        fcmOptions: {
          link: targetUrl,
        },
      },
    };

    // Include top-level notification for non-call messages for universal compatibility
    if (!isCall) {
      commonPayload.notification = {
        title: notificationTitle,
        body: notificationBody,
      };
      if (typeof notificationIcon === 'string' && (notificationIcon.startsWith('http://') || notificationIcon.startsWith('https://'))) {
        commonPayload.notification.imageUrl = notificationIcon;
      }
    }

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
