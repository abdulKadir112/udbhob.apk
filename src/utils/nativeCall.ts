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

  checkPermissions?(): Promise<{ fullScreenIntent: boolean; notifications: boolean }>;

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

  return () => {
    answerHandle?.remove();
    declineHandle?.remove();
    window.removeEventListener('native_accept_call', handleWindowCustomEvent);
  };
}
