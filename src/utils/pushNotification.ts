/**
 * Push Notification Utility for Mobile & Desktop Browsers
 * Supports:
 * 1. Web Notification API & ServiceWorker showNotification
 * 2. Mobile vibration feedback (navigator.vibrate)
 * 3. Lock-screen notification actions (Answer / Decline)
 * 4. Screen Wake Lock API for incoming calls
 */

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  vibratePattern?: number[];
  requireInteraction?: boolean;
  renotify?: boolean;
  actions?: Array<{ action: string; title: string; icon?: string }>;
  onClick?: () => void;
}

const DEFAULT_ICON = '/udbhob_logo.svg';
let screenWakeLockSentinel: any = null;

/**
 * Register Service Worker for lock-screen push notifications
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });
    return reg;
  } catch (err) {
    console.warn('ServiceWorker registration error:', err);
    return null;
  }
}

/**
 * Request Screen WakeLock so screen lights up on incoming calls
 */
export async function requestScreenWakeLock(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && 'wakeLock' in navigator && (navigator as any).wakeLock) {
    try {
      if (!screenWakeLockSentinel) {
        screenWakeLockSentinel = await (navigator as any).wakeLock.request('screen');
        screenWakeLockSentinel.addEventListener('release', () => {
          screenWakeLockSentinel = null;
        });
      }
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function releaseScreenWakeLock(): void {
  try {
    if (screenWakeLockSentinel) {
      screenWakeLockSentinel.release().catch(() => {});
      screenWakeLockSentinel = null;
    }
  } catch {}
}

/**
 * Request user permission for notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Web Push Notifications are not supported in this browser.');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await registerServiceWorker();
    }
    return permission;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return 'denied';
  }
}

/**
 * Trigger Lock-Screen Incoming Call Notification (IMO / WhatsApp style)
 */
export async function triggerIncomingCallNotification({
  callerName,
  callerAvatar,
  callType,
  callId,
  isGroup = false,
}: {
  callerName: string;
  callerAvatar?: string;
  callType: 'audio' | 'video';
  callId: string;
  isGroup?: boolean;
}) {
  const isVideo = callType === 'video';
  const title = isGroup
    ? `📞 ইনকামিং গ্রুপ কল: ${callerName}`
    : `${isVideo ? '📹' : '📞'} ইনকামিং কল: ${callerName}`;
  const body = `প্রবাসী মুক্ত ফান্ড - ${isVideo ? 'ভিডিও কল' : 'অডিও কল'} আসছে। রিসিভ করতে ট্যাপ করুন।`;

  // Wake screen so phone lights up on incoming call
  requestScreenWakeLock().catch(() => {});

  // Continuous loud vibration pattern for incoming phone ring
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([1000, 400, 1000, 400, 1200, 400, 1500, 400, 2000]);
    } catch {}
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  // Request permission if not already determined
  let permission = Notification.permission;
  if (permission === 'default') {
    try {
      permission = await Notification.requestPermission();
    } catch {}
  }

  if (permission !== 'granted') {
    return;
  }

  const notificationOptions = {
    body,
    icon: callerAvatar || DEFAULT_ICON,
    badge: DEFAULT_ICON,
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
      { action: 'answer', title: '📞 রিসিভ করুন (Answer)' },
      { action: 'decline', title: '❌ কেটে দিন (Decline)' },
    ],
  };

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready.catch(() => null);
      if (reg && 'showNotification' in reg) {
        // Post message to Service Worker controller if available
        if (navigator.serviceWorker.controller) {
          try {
            navigator.serviceWorker.controller.postMessage({
              type: 'SHOW_INCOMING_CALL_NOTIFICATION',
              title,
              body,
              icon: callerAvatar || DEFAULT_ICON,
              callId,
              isVideo,
            });
          } catch {}
        }

        try {
          await (reg.showNotification as any)(title, notificationOptions);
          return;
        } catch (swErr) {
          // If actions fail on some Android versions, retry without actions
          await (reg.showNotification as any)(title, {
            ...notificationOptions,
            actions: undefined,
          });
          return;
        }
      }
    }

    // Fallback standard browser notification
    const notif = new Notification(title, {
      body,
      icon: callerAvatar || DEFAULT_ICON,
      badge: DEFAULT_ICON,
      tag: `incoming-call-${callId}`,
      requireInteraction: true,
    });
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
  } catch (err) {
    console.warn('Could not trigger incoming call push notification:', err);
  }
}

/**
 * Cancel incoming call notification if answered/cancelled elsewhere
 */
export async function cancelIncomingCallNotification(callId: string) {
  releaseScreenWakeLock();
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(0);
    } catch {}
  }

  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && 'getNotifications' in reg) {
        const notifs = await reg.getNotifications({ tag: `incoming-call-${callId}` });
        notifs.forEach((n) => n.close());
      }
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CANCEL_CALL_NOTIFICATION',
          callId,
        });
      }
    } catch {}
  }
}

export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

export function isPushNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Request Notification, Microphone, Camera, and Location permissions all together at once
 */
export async function requestAllCorePermissions(): Promise<{
  notification: NotificationPermission;
  microphone: boolean;
  camera: boolean;
  location: boolean;
}> {
  const result = {
    notification: 'denied' as NotificationPermission,
    microphone: false,
    camera: false,
    location: false,
  };

  // 1. Request Notification permission
  try {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      result.notification = await Notification.requestPermission();
      if (result.notification === 'granted') {
        await registerServiceWorker();
      }
    }
  } catch (e) {
    console.warn('Error requesting notification permission:', e);
  }

  // 2. Request Camera and Microphone together via getUserMedia
  if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      // First enumerate available devices if possible to avoid requesting non-existent hardware
      let hasAudioInput = true;
      let hasVideoInput = true;
      if ('enumerateDevices' in navigator.mediaDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          if (devices && devices.length > 0) {
            const hasAudio = devices.some((d) => d.kind === 'audioinput');
            const hasVideo = devices.some((d) => d.kind === 'videoinput');
            // If device list has labeled or kind items
            if (devices.some((d) => d.kind === 'audioinput' || d.kind === 'videoinput')) {
              hasAudioInput = hasAudio;
              hasVideoInput = hasVideo;
            }
          }
        } catch {}
      }

      if (hasAudioInput && hasVideoInput) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
          result.microphone = true;
          result.camera = true;
          stream.getTracks().forEach((track) => {
            try {
              track.stop();
            } catch {}
          });
        } catch (mediaErr: any) {
          // If combined request failed due to missing camera or mic, try individually
          if (hasAudioInput) {
            try {
              const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
              result.microphone = true;
              audioStream.getTracks().forEach((track) => track.stop());
            } catch {}
          }
          if (hasVideoInput) {
            try {
              const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
              result.camera = true;
              videoStream.getTracks().forEach((track) => track.stop());
            } catch {}
          }
        }
      } else if (hasAudioInput) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          result.microphone = true;
          audioStream.getTracks().forEach((track) => track.stop());
        } catch {}
      } else if (hasVideoInput) {
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
          result.camera = true;
          videoStream.getTracks().forEach((track) => track.stop());
        } catch {}
      }
    } catch (e) {
      // Gracefully handled for environments with virtual/no media devices
    }
  }

  // 3. Request Geolocation / Location access
  if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
    try {
      await new Promise<boolean>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            result.location = true;
            resolve(true);
          },
          (err) => {
            console.warn('Location permission denied or unavailable:', err);
            resolve(false);
          },
          { timeout: 8000, enableHighAccuracy: false }
        );
      });
    } catch (locErr) {
      console.warn('Geolocation request error:', locErr);
    }
  }

  return result;
}

/**
 * Send standard or chat push notification (active & background)
 */
export function sendPushNotification({
  title,
  body,
  icon = DEFAULT_ICON,
  badge = DEFAULT_ICON,
  tag,
  data,
  vibratePattern = [300, 150, 300],
  requireInteraction = false,
  renotify = true,
  actions,
  onClick,
}: PushNotificationPayload): Notification | null {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  // Trigger mobile vibration if available
  if ('vibrate' in navigator && Array.isArray(vibratePattern)) {
    try {
      navigator.vibrate(vibratePattern);
    } catch {}
  }

  if (Notification.permission === 'granted') {
    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
          .then((reg) => {
            (reg.showNotification as any)(title, {
              body,
              icon,
              badge,
              tag: tag || `probashi-${Date.now()}`,
              data: data || { url: '/' },
              vibrate: vibratePattern,
              requireInteraction,
              renotify,
              silent: false,
              timestamp: Date.now(),
              actions: actions || [
                { action: 'open', title: '👀 দেখুন' },
                { action: 'close', title: '❌ বন্ধ' },
              ],
            });
          })
          .catch(() => {
            fallbackNotification();
          });
        return null;
      }

      function fallbackNotification() {
        const notif = new Notification(title, {
          body,
          icon,
          badge,
          tag: tag || `probashi-${Date.now()}`,
          data,
          requireInteraction,
        });

        notif.onclick = () => {
          window.focus();
          if (onClick) onClick();
          notif.close();
        };
        return notif;
      }

      return fallbackNotification();
    } catch (err) {
      console.warn('Could not display push notification:', err);
      return null;
    }
  }

  return null;
}

export async function sendTestPushNotification(isBn: boolean = true): Promise<boolean> {
  const perm = await requestNotificationPermission();
  if (perm === 'granted') {
    sendPushNotification({
      title: isBn ? '🔔 প্রবাসী মুক্ত ফান্ড নোটিফিকেশন' : '🔔 Probashi Mukto Fund Notification',
      body: isBn
        ? 'আপনার ফোনে পুশ নোটিফিকেশন সফলভাবে চালু হয়েছে! ফোন লক বা ব্যাকগ্রাউন্ডে থাকলেও কল ও মেসেজ পাবেন।'
        : 'Push notifications are now enabled! You will receive calls and alerts even when your phone is locked.',
      tag: 'test-push-notification',
      vibratePattern: [200, 100, 300, 100, 200],
    });
    return true;
  }
  return false;
}

export async function sendTestIncomingCallAlert(isBn: boolean = true): Promise<boolean> {
  const perm = await requestNotificationPermission();
  if (perm === 'granted') {
    await triggerIncomingCallNotification({
      callerName: isBn ? 'প্রবাসী টেস্ট কলার (Test Call)' : 'Test Caller (Lock-Screen Call)',
      callType: 'audio',
      callId: `test_call_${Date.now()}`,
    });
    return true;
  }
  return false;
}
