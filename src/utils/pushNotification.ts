/**
 * Push Notification Utility for Mobile & Desktop Browsers
 * Supports:
 * 1. Web Notification API & ServiceWorker showNotification
 * 2. Mobile vibration feedback (navigator.vibrate)
 * 3. Lock-screen notification actions (Answer / Decline)
 * 4. Screen Wake Lock API for incoming calls
 */

import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import app, { db, VAPID_KEY } from '../firebase/config';
import { soundEffects } from './audioFeedback';

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
      getOrRegisterFcmToken().catch(() => {});
    }
    return permission;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return 'denied';
  }
}

/**
 * Safe Vibration helper that checks userActivation and gracefully avoids browser intervention warnings
 */
export function safeVibrate(pattern: number | number[]): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || !('vibrate' in navigator)) {
    return false;
  }
  try {
    const activation = (navigator as any).userActivation;
    if (activation && !activation.hasBeenActive) {
      return false;
    }
    if (typeof document !== 'undefined' && (!document.hasFocus() || document.hidden)) {
      return false;
    }

    if (pattern === 0 || (Array.isArray(pattern) && pattern.length === 1 && pattern[0] === 0)) {
      navigator.vibrate(0);
      return true;
    }

    navigator.vibrate(pattern);
    return true;
  } catch {
    return false;
  }
}

import { isNativeApp, showNativeIncomingCall, endNativeCall } from './nativeCall';

/**
 * Trigger Lock-Screen Incoming Call Notification (IMO / WhatsApp style)
 */
export async function triggerIncomingCallNotification({
  callerName,
  callerAvatar,
  callType,
  callId,
  isGroup = false,
  fundId = 'fund-main',
}: {
  callerName: string;
  callerAvatar?: string;
  callType: 'audio' | 'video';
  callId: string;
  isGroup?: boolean;
  fundId?: string;
}) {
  // If running in Native Capacitor App on Android, trigger Native Lock-Screen Call UI
  if (isNativeApp()) {
    try {
      await showNativeIncomingCall({
        callId,
        callerName,
        callerAvatar,
        callType,
        isGroup,
        fundId,
      });
      return;
    } catch (nativeErr) {
      console.warn('Native incoming call trigger fallback to web:', nativeErr);
    }
  }

  const isVideo = callType === 'video';
  const title = isGroup
    ? `📞 ইনকামিং গ্রুপ কল: ${callerName}`
    : `${isVideo ? '📹' : '📞'} ইনকামিং কল: ${callerName}`;
  const body = `প্রবাসী মুক্ত ফান্ড - ${isVideo ? 'ভিডিও কল' : 'অডিও কল'} আসছে। রিসিভ করতে ট্যাপ করুন।`;

  // Wake screen so phone lights up on incoming call
  requestScreenWakeLock().catch(() => {});

  // Safe continuous vibration pattern for incoming phone ring
  safeVibrate([1000, 400, 1000, 400, 1200, 400, 1500, 400, 2000]);

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
  safeVibrate(0);

  if (isNativeApp()) {
    endNativeCall(callId).catch(() => {});
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

export interface CorePermissionsResult {
  notification: NotificationPermission;
  microphone: boolean;
  camera: boolean;
  location: boolean;
  soundUnlocked: boolean;
  vibration: boolean;
}

/**
 * Check current permissions without prompting user
 */
export async function checkCurrentPermissionsStatus(): Promise<{
  notification: NotificationPermission;
  microphone: 'granted' | 'denied' | 'prompt';
  camera: 'granted' | 'denied' | 'prompt';
  soundUnlocked: boolean;
}> {
  const status = {
    notification: typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'denied' as NotificationPermission,
    microphone: 'prompt' as 'granted' | 'denied' | 'prompt',
    camera: 'prompt' as 'granted' | 'denied' | 'prompt',
    soundUnlocked: false,
  };

  if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
    try {
      const mic = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      status.microphone = mic.state;
    } catch {}
    try {
      const cam = await navigator.permissions.query({ name: 'camera' as PermissionName });
      status.camera = cam.state;
    } catch {}
  }

  return status;
}

/**
 * Request Notification, Sound/Ringtone, Microphone, Camera, and Location permissions all together at once
 */
export async function requestAllCorePermissions(): Promise<CorePermissionsResult> {
  const result: CorePermissionsResult = {
    notification: 'denied' as NotificationPermission,
    microphone: false,
    camera: false,
    location: false,
    soundUnlocked: false,
    vibration: false,
  };

  // 1. Immediately unlock Sound, AudioContext, and Ringtone playback on this user gesture
  try {
    soundEffects.unlockAudio();
    result.soundUnlocked = true;
    // Play gentle chime so AudioContext is 100% active and running
    soundEffects.playReceiveMessage();
  } catch (e) {
    console.warn('Audio/Ringtone unlock error:', e);
  }

  // 2. Safe Haptic / Vibration test
  try {
    result.vibration = safeVibrate([150, 100, 150]);
  } catch {}

  // 3. Request Camera and Microphone together via getUserMedia
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
      console.warn('Media devices request error:', e);
    }
  }

  // 4. Request Notification permission
  try {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      result.notification = await Notification.requestPermission();
      if (result.notification === 'granted') {
        await registerServiceWorker();
        getOrRegisterFcmToken().catch(() => {});
      }
    }
  } catch (e) {
    console.warn('Error requesting notification permission:', e);
  }

  // 5. Request Geolocation / Location access
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

  // 6. Record that all permissions were prompted & set up
  try {
    localStorage.setItem('probashi_core_permissions_setup_done', 'true');
    localStorage.setItem('probashi_permissions_completed', 'true');
    localStorage.setItem('probashi_permissions_prompted', 'true');
    localStorage.setItem('probashi_sound_unlocked', 'true');
  } catch {}

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

  // Trigger mobile vibration safely if available
  if (Array.isArray(vibratePattern)) {
    safeVibrate(vibratePattern);
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
      tag: `test-push-${Date.now()}`,
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

/**
 * Schedule background lock-screen incoming call via Service Worker.
 * Guaranteed to execute even if user presses the power button and locks screen immediately!
 */
export async function scheduleLockScreenCallTest(delayMs: number = 4000, isBn: boolean = true): Promise<boolean> {
  const perm = await requestNotificationPermission();
  if (perm !== 'granted') {
    return false;
  }

  try {
    let swTarget: ServiceWorker | null = null;
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready.catch(() => null);
      if (reg && reg.active) {
        swTarget = reg.active;
      } else if (navigator.serviceWorker.controller) {
        swTarget = navigator.serviceWorker.controller;
      }
    }

    if (swTarget) {
      swTarget.postMessage({
        type: 'SCHEDULE_LOCK_SCREEN_CALL_TEST',
        delayMs,
        isBn,
      });
    }

    // Also arm window timer as immediate secondary backup
    setTimeout(() => {
      triggerIncomingCallNotification({
        callerName: isBn ? 'প্রবাসী টেস্ট কলার (Lock-Screen Call)' : 'Test Caller (Lock-Screen Call)',
        callType: 'audio',
        callId: `test_call_${Date.now()}`,
      }).catch(() => {});
    }, delayMs);

    return true;
  } catch (err) {
    console.warn('Error scheduling lock screen call test:', err);
    return false;
  }
}

/**
 * Schedule background lock-screen notification via Service Worker
 */
export async function scheduleLockScreenNotificationTest(delayMs: number = 3000, isBn: boolean = true): Promise<boolean> {
  const perm = await requestNotificationPermission();
  if (perm !== 'granted') {
    return false;
  }

  try {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready.catch(() => null);
      const swTarget = reg?.active || navigator.serviceWorker.controller;
      if (swTarget) {
        swTarget.postMessage({
          type: 'SCHEDULE_LOCK_SCREEN_NOTIF_TEST',
          delayMs,
          isBn,
        });
      }
    }

    // Secondary fallback
    setTimeout(() => {
      sendPushNotification({
        title: isBn ? '🔔 প্রবাসী মুক্ত ফান্ড নোটিফিকেশন' : '🔔 Udbhob Fund Notification',
        body: isBn
          ? 'আপনার ফোনে পুশ নোটিফিকেশন সফলভাবে কাজ করছে! লক স্ক্রিনেও আপডেট পাবেন।'
          : 'Push notifications are working! You will receive alerts on lock screen.',
        tag: `test-notif-${Date.now()}`,
        vibratePattern: [300, 150, 300],
      });
    }, delayMs);

    return true;
  } catch (err) {
    console.warn('Error scheduling lock screen notification test:', err);
    return false;
  }
}

let messagingInstance: any = null;

/**
 * Register FCM Token for Web Push with the configured VAPID key
 * and save it to the current user's Firestore profile
 */
export async function getOrRegisterFcmToken(memberId?: string, fundId?: string): Promise<string | null> {
  if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const supported = await isSupported().catch(() => false);
    if (!supported) {
      console.warn('Firebase Cloud Messaging is not supported in this browser.');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return null;
    }

    const registration = await registerServiceWorker();
    if (!registration) {
      return null;
    }

    if (!messagingInstance) {
      messagingInstance = getMessaging(app);
    }

    const currentToken = await getToken(messagingInstance, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      console.log('🔑 Device FCM Token registered successfully:', currentToken);
      localStorage.setItem('probashi_fcm_token', currentToken);

      // If user session is active, sync with Firestore
      const effectiveFundId = fundId || localStorage.getItem('probashi_active_fund_id') || 'fund-main';
      const effectiveMemberId = memberId || localStorage.getItem('probashi_active_member_id');

      if (effectiveMemberId && db) {
        try {
          const memberRef = doc(db, 'funds', effectiveFundId, 'members', effectiveMemberId);
          await updateDoc(memberRef, {
            fcmToken: currentToken,
            fcmTokenUpdatedAt: new Date().toISOString(),
          }).catch(async () => {
            const userRef = doc(db, 'users', effectiveMemberId);
            await setDoc(
              userRef,
              { fcmToken: currentToken, updatedAt: new Date().toISOString() },
              { merge: true }
            ).catch(() => {});
          });
        } catch (dbErr) {
          console.warn('Error saving FCM token to Firestore:', dbErr);
        }
      }

      return currentToken;
    }
    return null;
  } catch (error) {
    console.warn('FCM Token registration error:', error);
    return null;
  }
}

/**
 * Listen for foreground FCM Push Messages
 */
export async function initForegroundFcmListener(onMessageCallback?: (payload: any) => void) {
  if (typeof window === 'undefined') return;

  try {
    const supported = await isSupported().catch(() => false);
    if (!supported) return;

    if (!messagingInstance) {
      messagingInstance = getMessaging(app);
    }

    return onMessage(messagingInstance, (payload) => {
      console.log('Received foreground FCM message:', payload);
      const title = payload.notification?.title || payload.data?.title || 'প্রবাসী বার্তা';
      const body = payload.notification?.body || payload.data?.body || '';

      sendPushNotification({
        title,
        body,
        icon: payload.notification?.icon || payload.data?.icon || DEFAULT_ICON,
        data: payload.data,
      });

      if (onMessageCallback) {
        onMessageCallback(payload);
      }
    });
  } catch (err) {
    console.warn('Foreground FCM listener error:', err);
  }
}

/**
 * Fetch FCM Tokens for given member IDs from Firestore in parallel for instant sub-second lookup
 */
export async function getFcmTokensForMembers(memberIds: string[], fundId: string = 'fund-main'): Promise<string[]> {
  if (!db || !memberIds || memberIds.length === 0) return [];
  const uniqueMemberIds = Array.from(new Set(memberIds.filter(Boolean)));
  
  try {
    const tokenPromises = uniqueMemberIds.map(async (mid) => {
      try {
        // 1. Check member document in fund
        const memberDoc = await getDoc(doc(db, 'funds', fundId, 'members', mid)).catch(() => null);
        if (memberDoc?.exists()) {
          const t = memberDoc.data()?.fcmToken;
          if (t && typeof t === 'string') return t;
        }

        // 2. Check user document
        const userDoc = await getDoc(doc(db, 'users', mid)).catch(() => null);
        if (userDoc?.exists()) {
          const t = userDoc.data()?.fcmToken;
          if (t && typeof t === 'string') return t;
        }
      } catch (e) {
        console.warn(`Error fetching FCM token for member ${mid}:`, e);
      }
      return null;
    });

    const results = await Promise.all(tokenPromises);
    const tokens = results.filter((t): t is string => Boolean(t) && typeof t === 'string');
    return Array.from(new Set(tokens));
  } catch (err) {
    console.warn('getFcmTokensForMembers error:', err);
    return [];
  }
}

/**
 * Dispatch Push Notification for Incoming Call to target device(s)
 * Works even when recipient phone is locked or app is completely closed
 */
export async function sendFcmCallPushNotification(params: {
  targetMemberIds: string[];
  callerName: string;
  callerAvatar?: string;
  callType: 'audio' | 'video';
  callId: string;
  isGroup?: boolean;
  fundId?: string;
}): Promise<boolean> {
  const { targetMemberIds, callerName, callerAvatar, callType, callId, isGroup, fundId } = params;
  if (!targetMemberIds || targetMemberIds.length === 0) return false;

  try {
    const tokens = await getFcmTokensForMembers(targetMemberIds, fundId);
    if (tokens.length === 0) {
      console.log('No registered FCM tokens found for recipients, skipping push.');
      return false;
    }

    const title = `📞 ${callerName} থেকে ${callType === 'video' ? 'ভিডিও কল' : 'অডিও কল'} আসছে`;
    const body = isGroup
      ? 'প্রবাসী মুক্ত ফান্ড গ্রুপ কল আসছে... রিসিভ করতে ট্যাপ করুন।'
      : 'সরাসরি কল বাজছে। ফোন আনলক না করেই রিসিভ বা কেটে দিন।';

    const response = await fetch('/api/send-fcm-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokens,
        title,
        body,
        icon: callerAvatar || '/udbhob_logo.svg',
        url: `/?callAction=answer&callId=${callId}&callerName=${encodeURIComponent(callerName)}`,
        isCall: true,
        callId,
        callerName,
        callType,
        data: {
          action: 'incoming_call',
          callId,
          callerName,
          callType,
          isCall: 'true',
          url: `/?callAction=answer&callId=${callId}&callerName=${encodeURIComponent(callerName)}`,
        },
      }),
    });

    const result = await response.json().catch(() => null);
    console.log('FCM Call Push sent result:', result);
    return Boolean(result?.success);
  } catch (err) {
    console.warn('Error sending FCM call push notification:', err);
    return false;
  }
}

/**
 * Dispatch Push Notification for Chat SMS/Messages to target device(s)
 */
export async function sendFcmChatPushNotification(params: {
  recipientMemberIds: string[];
  senderName: string;
  senderAvatar?: string;
  messageText: string;
  messageType?: string;
  fundId?: string;
  senderId?: string;
}): Promise<boolean> {
  const { recipientMemberIds, senderName, senderAvatar, messageText, messageType, fundId, senderId } = params;
  if (!recipientMemberIds || recipientMemberIds.length === 0) return false;

  try {
    const tokens = await getFcmTokensForMembers(recipientMemberIds, fundId);
    if (tokens.length === 0) return false;

    let body = messageText || 'একটি নতুন বার্তা পাঠিয়েছেন';
    if (messageType === 'voice') body = '🎤 ভয়েস বার্তা পাঠিয়েছেন (শুনতে ট্যাপ করুন)';
    else if (messageType === 'image') body = '📷 ছবি পাঠিয়েছেন (দেখতে ট্যাপ করুন)';

    const response = await fetch('/api/send-fcm-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokens,
        title: `💬 ${senderName} (প্রবাসী বার্তা)`,
        body,
        icon: senderAvatar || '/udbhob_logo.svg',
        url: senderId ? `/?tab=chat&directUser=${senderId}` : `/?tab=chat`,
        isCall: false,
        data: {
          action: 'new_message',
          senderId: senderId || '',
          senderName,
          url: senderId ? `/?tab=chat&directUser=${senderId}` : `/?tab=chat`,
        },
      }),
    });

    const result = await response.json().catch(() => null);
    return Boolean(result?.success);
  } catch (err) {
    console.warn('Error sending FCM chat push notification:', err);
    return false;
  }
}


