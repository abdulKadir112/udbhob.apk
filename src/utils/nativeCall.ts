import { Capacitor, registerPlugin, PluginListenerHandle } from '@capacitor/core';

export interface NativeCallPluginInterface {
  showIncomingCall(options: {
    callId: string;
    callerName?: string;
    callerAvatar?: string;
    callType?: string;
    isGroup?: boolean;
    fundId?: string;
  }): Promise<{ success: boolean; callId: string }>;

  endCall(options: { callId?: string }): Promise<{ success: boolean }>;

  getFcmToken(): Promise<{ success: boolean; token?: string; error?: string }>;

  getPendingCallIntent(): Promise<{ hasPendingCall: boolean; callId?: string; callType?: string }>;

  updateSession(options: {
    memberId: string;
    fundId: string;
    name?: string;
    username?: string;
    role?: string;
    isAdmin?: boolean;
  }): Promise<{ success: boolean; serviceRunning?: boolean }>;

  setAudioMode(options: { isCallActive: boolean }): Promise<{ success: boolean }>;

  setSpeakerphoneOn(options: { enabled: boolean }): Promise<{ success: boolean }>;

  isIgnoringBatteryOptimization(): Promise<{ isIgnoring: boolean }>;

  requestIgnoreBatteryOptimization(): Promise<{ success: boolean }>;

  startBackgroundService(): Promise<{ success: boolean }>;

  addListener(
    eventName: 'callAnswered',
    listenerFunc: (data: {
      callId: string;
      callerName?: string;
      callType?: string;
      isGroup?: boolean;
      fundId?: string;
    }) => void
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: 'callDeclined',
    listenerFunc: (data: { callId: string }) => void
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: 'tokenRefreshed',
    listenerFunc: (data: { token: string }) => void
  ): Promise<PluginListenerHandle>;
}

// Register native plugin
export const NativeCall = registerPlugin<NativeCallPluginInterface>('NativeCall');

/**
 * Check if the application is running inside a native Capacitor shell (Android / iOS)
 */
export function isNativeApp(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

/**
 * Fetch Native Device FCM Token directly from Google Play Services on Android
 */
export async function getNativeFcmToken(): Promise<string | null> {
  if (!isNativeApp()) return null;
  try {
    const result = await NativeCall.getFcmToken();
    if (result && result.success && result.token) {
      return result.token;
    }
  } catch (err) {
    console.warn('[NativeCall] getFcmToken failed:', err);
  }
  return null;
}

/**
 * Check if the app was launched by the user tapping Answer on lock screen or notification
 */
export async function checkPendingCallIntent(): Promise<{ callId: string; callType: string } | null> {
  if (!isNativeApp()) return null;
  try {
    const result = await NativeCall.getPendingCallIntent();
    if (result && result.hasPendingCall && result.callId) {
      return {
        callId: result.callId,
        callType: result.callType || 'audio',
      };
    }
  } catch (err) {
    console.warn('[NativeCall] checkPendingCallIntent failed:', err);
  }
  return null;
}

/**
 * Show native lock-screen incoming call UI (only on Native platforms)
 */
export async function showNativeIncomingCall(params: {
  callId: string;
  callerName?: string;
  callerAvatar?: string;
  callType?: string;
  isGroup?: boolean;
  fundId?: string;
}): Promise<boolean> {
  if (!isNativeApp()) return false;
  try {
    await NativeCall.showIncomingCall(params);
    return true;
  } catch (err) {
    console.warn('[NativeCall] showIncomingCall failed or not available:', err);
    return false;
  }
}

/**
 * End/Dismiss native call notification & activity
 */
export async function endNativeCall(callId?: string): Promise<boolean> {
  if (!isNativeApp()) return false;
  try {
    await NativeCall.endCall({ callId });
    return true;
  } catch (err) {
    console.warn('[NativeCall] endCall failed:', err);
    return false;
  }
}

/**
 * Setup listeners for native incoming call interactions (Answer / Decline)
 */
export function registerNativeCallBridge(callbacks: {
  onAnswer: (data: { callId: string; callerName?: string; callType?: string; isGroup?: boolean; fundId?: string }) => void;
  onDecline: (data: { callId: string }) => void;
}): () => void {
  if (!isNativeApp()) {
    return () => {};
  }

  let answerHandle: PluginListenerHandle | null = null;
  let declineHandle: PluginListenerHandle | null = null;

  NativeCall.addListener('callAnswered', (data) => {
    console.log('[NativeCallBridge] callAnswered received:', data);
    callbacks.onAnswer(data);
  }).then((handle) => {
    answerHandle = handle;
  }).catch((e) => console.warn('[NativeCallBridge] Failed to add callAnswered listener:', e));

  NativeCall.addListener('callDeclined', (data) => {
    console.log('[NativeCallBridge] callDeclined received:', data);
    callbacks.onDecline(data);
  }).then((handle) => {
    declineHandle = handle;
  }).catch((e) => console.warn('[NativeCallBridge] Failed to add callDeclined listener:', e));

  const handleWindowCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<{ callId: string; callType?: string }>;
    if (customEvent.detail?.callId) {
      callbacks.onAnswer({
        callId: customEvent.detail.callId,
        callType: customEvent.detail.callType || 'audio',
      });
    }
  };
  window.addEventListener('native_accept_call', handleWindowCustomEvent);

  // Check immediately if there's an already pending call from launch
  checkPendingCallIntent().then((pending) => {
    if (pending) {
      callbacks.onAnswer({
        callId: pending.callId,
        callType: pending.callType,
      });
    }
  }).catch(() => {});

  return () => {
    answerHandle?.remove();
    declineHandle?.remove();
    window.removeEventListener('native_accept_call', handleWindowCustomEvent);
  };
}

/**
 * Sync active user session to Native Android background service
 * so Firestore listeners in Android background service wake up the phone on incoming calls.
 */
export async function updateNativeSession(params: {
  memberId: string;
  fundId?: string;
  name?: string;
  username?: string;
  role?: string;
  isAdmin?: boolean;
}): Promise<boolean> {
  if (!isNativeApp()) return false;
  try {
    const res = await NativeCall.updateSession({
      memberId: params.memberId,
      fundId: params.fundId || 'fund-main',
      name: params.name || '',
      username: params.username || '',
      role: params.role || 'member',
      isAdmin: Boolean(params.isAdmin),
    });
    return Boolean(res.success);
  } catch (e) {
    console.warn('[NativeCall] updateSession error:', e);
    return false;
  }
}

/**
 * Configure VoIP Communication Audio Mode on Native Android
 */
export async function setNativeAudioMode(isCallActive: boolean): Promise<boolean> {
  if (!isNativeApp()) return false;
  try {
    const res = await NativeCall.setAudioMode({ isCallActive });
    return Boolean(res.success);
  } catch (e) {
    console.warn('[NativeCall] setAudioMode error:', e);
    return false;
  }
}

/**
 * Set speakerphone on or off on Native Android
 */
export async function setNativeSpeakerphone(enabled: boolean): Promise<boolean> {
  if (!isNativeApp()) return false;
  try {
    const res = await NativeCall.setSpeakerphoneOn({ enabled });
    return Boolean(res.success);
  } catch (e) {
    console.warn('[NativeCall] setSpeakerphone error:', e);
    return false;
  }
}

/**
 * Start the Native Android Realtime Foreground Service
 */
export async function startNativeBackgroundService(): Promise<boolean> {
  if (!isNativeApp()) return false;
  try {
    const res = await NativeCall.startBackgroundService();
    return Boolean(res.success);
  } catch (e) {
    console.warn('[NativeCall] startBackgroundService error:', e);
    return false;
  }
}

/**
 * Check if the app is currently exempt from Android battery optimization / Doze mode
 */
export async function checkBatteryOptimizationExempt(): Promise<boolean> {
  if (!isNativeApp()) return true;
  try {
    const res = await NativeCall.isIgnoringBatteryOptimization();
    return Boolean(res.isIgnoring);
  } catch (e) {
    return true;
  }
}

/**
 * Request exemption from Android battery optimization / Doze mode
 * so notifications and background connection are never killed in Deep Sleep.
 */
export async function promptBatteryOptimizationExempt(): Promise<boolean> {
  if (!isNativeApp()) return false;
  try {
    const res = await NativeCall.requestIgnoreBatteryOptimization();
    return Boolean(res.success);
  } catch (e) {
    console.warn('[NativeCall] requestIgnoreBatteryOptimization error:', e);
    return false;
  }
}
