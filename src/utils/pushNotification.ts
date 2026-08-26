/**
 * Push Notification Utility for Mobile & Desktop Browsers
 * Supports:
 * 1. Web Notification API (new Notification)
 * 2. Mobile vibration feedback (navigator.vibrate)
 * 3. Audio alert playback
 */

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  vibratePattern?: number[];
  onClick?: () => void;
}

const DEFAULT_ICON = 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=192&q=80';

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Web Push Notifications are not supported in this browser.');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return 'denied';
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

export function sendPushNotification({
  title,
  body,
  icon = DEFAULT_ICON,
  badge,
  tag,
  data,
  vibratePattern = [200, 100, 200],
  onClick,
}: PushNotificationPayload): Notification | null {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  // Trigger mobile vibration if available
  if ('vibrate' in navigator && Array.isArray(vibratePattern)) {
    try {
      navigator.vibrate(vibratePattern);
    } catch {
      // ignore
    }
  }

  if (Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        body,
        icon,
        badge: badge || icon,
        tag: tag || `probashi-${Date.now()}`,
        data,
      });

      notif.onclick = () => {
        window.focus();
        if (onClick) onClick();
        notif.close();
      };

      return notif;
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
        ? 'আপনার ফোনে পুশ নোটিফিকেশন সফলভাবে চালু হয়েছে! নতুন চ্যাট মেসেজ ও জমার তথ্য পাবেন।'
        : 'Push notifications are now enabled on your device! You will receive live alerts.',
      tag: 'test-push-notification',
      vibratePattern: [150, 100, 250],
    });
    return true;
  }
  return false;
}
