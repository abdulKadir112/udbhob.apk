import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { useFund } from './FundContext';
import {
  ChatMessage,
  ActiveCallState,
  CallType,
  UserPresence,
  UserRole,
  CallParticipant,
  IncomingCallState,
} from '../types';
import { soundEffects } from '../utils/audioFeedback';
import { cleanForFirestore } from '../utils/firestoreUtils';
import { DEFAULT_FUND_ID } from '../data/seedData';
import { webrtcManager } from '../utils/webrtcManager';
import {
  triggerIncomingCallNotification,
  cancelIncomingCallNotification,
  sendPushNotification,
  sendFcmCallPushNotification,
  sendFcmChatPushNotification,
  syncFcmTokenToFirestore,
  registerServiceWorker,
  requestScreenWakeLock,
  releaseScreenWakeLock,
  safeVibrate,
} from '../utils/pushNotification';
import { registerNativeCallBridge, endNativeCall, NativeCall, isNativeApp, updateNativeSession } from '../utils/nativeCall';
import {
  saveMessagesOffline,
  loadMessagesOffline,
  queueOfflineMessage,
  getPendingOfflineMessages,
  removePendingOfflineMessage,
} from '../utils/offlineStorage';
import { formatLastActiveBn, getCountryBn, getCountryFlag, detectCountryFromPhone } from '../utils/formatters';

const isDefaultFund = (id?: string | null): boolean => {
  return (
    !id ||
    id === DEFAULT_FUND_ID ||
    id === 'fund-probashi-default' ||
    id === 'fund-main' ||
    id === 'fund_probashi_001'
  );
};

interface ChatContextType {
  messages: ChatMessage[];
  pinnedMessage: ChatMessage | null;
  loading: boolean;
  replyingTo: ChatMessage | null;
  setReplyingTo: (msg: ChatMessage | null) => void;
  activeCall: ActiveCallState | null;
  incomingCall: IncomingCallState | null;
  runningGroupCall: { isLive: boolean; participantsCount: number; type: CallType } | null;
  userPresences: UserPresence[];
  onlineCount: number;
  unreadChatCount: number;
  isChatScreenActive: boolean;
  setIsChatScreenActive: (active: boolean) => void;
  selectedChatTab: 'group' | 'direct';
  setSelectedChatTab: (tab: 'group' | 'direct') => void;
  selectedDirectUser: { id: string; name: string; avatar?: string; role: UserRole; country?: string } | null;
  setSelectedDirectUser: (user: { id: string; name: string; avatar?: string; role: UserRole; country?: string } | null) => void;
  markChatAsRead: () => void;
  sendMessage: (text: string, replyTo?: ChatMessage['replyTo'], directTarget?: { recipientId: string; recipientName: string }) => Promise<void>;
  sendVoiceMessage: (durationSeconds: number, audioDataUrl?: string, directTarget?: { recipientId: string; recipientName: string }) => Promise<void>;
  sendImageMessage: (imageUrl: string, caption?: string, directTarget?: { recipientId: string; recipientName: string }) => Promise<void>;
  addReaction: (messageId: string, emoji: string) => Promise<void>;
  togglePinMessage: (messageId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  startCall: (type: CallType, isGroup: boolean, targetUser?: { id: string; name: string; avatar?: string; role: UserRole }) => Promise<void>;
  acceptIncomingCall: () => Promise<void>;
  rejectIncomingCall: () => Promise<void>;
  joinCall: (type?: CallType) => void;
  endCall: () => Promise<void>;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleSpeaker: () => void;
  toggleCameraFacing: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userSession, currentMember, isAdmin, activeFundId } = useAuth();
  const { members, currentFund, soundEnabled } = useFund();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`probashi_chat_msgs_${activeFundId || 'all'}`) ||
                    localStorage.getItem('probashi_chat_msgs_universal');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load complete offline messages from IndexedDB for seamless PWA offline viewing
  useEffect(() => {
    let isMounted = true;
    loadMessagesOffline(activeFundId || undefined).then((offlineMsgs) => {
      if (isMounted && offlineMsgs && offlineMsgs.length > 0) {
        setMessages((prev) => {
          if (prev.length === 0) return offlineMsgs;
          const existingMap = new Map<string, ChatMessage>(prev.map((m) => [m.id, m]));
          offlineMsgs.forEach((m) => {
            if (!existingMap.has(m.id)) {
              existingMap.set(m.id, m);
            }
          });
          const merged: ChatMessage[] = Array.from(existingMap.values());
          merged.sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());
          return merged;
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, [activeFundId]);

  // Automatic sync for messages composed while offline when internet connection resumes
  useEffect(() => {
    const syncOfflineQueue = async () => {
      if (typeof navigator === 'undefined' || !navigator.onLine) return;
      try {
        const pending = await getPendingOfflineMessages();
        for (const msg of pending) {
          try {
            await setDoc(doc(db, 'chat_messages', msg.id), cleanForFirestore(msg));
            await removePendingOfflineMessage(msg.id);
          } catch (err) {
            console.debug('Pending sync retry later:', err);
          }
        }
      } catch {}
    };

    window.addEventListener('online', syncOfflineQueue);
    // Initial attempt if already online
    syncOfflineQueue();

    return () => {
      window.removeEventListener('online', syncOfflineQueue);
    };
  }, []);

  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [isChatScreenActive, setIsChatScreenActiveState] = useState<boolean>(true);
  const isChatScreenActiveRef = useRef<boolean>(true);

  const setIsChatScreenActive = (active: boolean) => {
    isChatScreenActiveRef.current = active;
    setIsChatScreenActiveState(active);
  };

  // Chat tab & direct recipient
  const [selectedChatTab, setSelectedChatTab] = useState<'group' | 'direct'>('group');
  const [selectedDirectUser, setSelectedDirectUser] = useState<{
    id: string;
    name: string;
    avatar?: string;
    role: UserRole;
    country?: string;
  } | null>(null);

  // Real-time call states
  const [activeCall, setActiveCall] = useState<ActiveCallState | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCallState | null>(null);
  const [runningGroupCall, setRunningGroupCall] = useState<{
    isLive: boolean;
    participantsCount: number;
    type: CallType;
  } | null>(null);

  const callToneStopRef = useRef<(() => void) | null>(null);
  const incomingToneStopRef = useRef<(() => void) | null>(null);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wakeLockRef = useRef<any>(null);
  const incomingCallRef = useRef<IncomingCallState | null>(null);

  useEffect(() => {
    incomingCallRef.current = incomingCall;
  }, [incomingCall]);

  // Auto-register service worker & unlock audio on initial touch/gesture
  useEffect(() => {
    registerServiceWorker().catch(() => {});

    const unlockHandler = () => {
      soundEffects.unlockAudio();
    };

    window.addEventListener('click', unlockHandler, { passive: true });
    window.addEventListener('touchstart', unlockHandler, { passive: true });
    window.addEventListener('keydown', unlockHandler, { passive: true });

    return () => {
      window.removeEventListener('click', unlockHandler);
      window.removeEventListener('touchstart', unlockHandler);
      window.removeEventListener('keydown', unlockHandler);
    };
  }, []);

  const requestWakeLock = async () => {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      } catch {}
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      try {
        wakeLockRef.current.release().catch(() => {});
      } catch {}
      wakeLockRef.current = null;
    }
  };

  // Live presence state from Firestore
  const [rawPresences, setRawPresences] = useState<Record<string, { isOnline: boolean; lastActive: string }>>({});

  const myId = userSession?.uid || currentMember?.id || (isAdmin ? 'admin_master_001' : '');
  const myUsername = currentMember?.username || userSession?.username || '';
  const myName = currentMember?.nameBn || currentMember?.name || userSession?.displayName || (isAdmin ? 'এডমিন আব্দুল কাদির' : 'প্রবাসী সদস্য');
  const myRole: UserRole = userSession?.role || (isAdmin ? 'admin' : 'member');
  const myAvatar = currentMember?.avatarUrl || userSession?.avatarUrl || '';
  const detectedCountryFromPhone = detectCountryFromPhone(currentMember?.phone);
  const myCountryRaw = currentMember?.country || (detectedCountryFromPhone ? detectedCountryFromPhone.nameBn : (isAdmin ? (currentFund?.country || 'সৌদি আরব') : 'বাংলাদেশ'));
  const myCountry = getCountryBn(myCountryRaw) || 'সৌদি আরব';
  const myCountryFlag = currentMember?.countryFlag || getCountryFlag(myCountryRaw) || (isAdmin ? '🇸🇦' : '🇧🇩');
  const effectiveFundId = activeFundId || currentMember?.fundId || DEFAULT_FUND_ID;

  // 1. Live Presence Heartbeat to Firestore
  useEffect(() => {
    if (!myId) return;

    const reportHeartbeat = async (status: boolean = true) => {
      try {
        const presenceDoc = {
          id: myId,
          name: myName,
          role: myRole,
          fundId: effectiveFundId,
          isOnline: status,
          lastActive: new Date().toISOString(),
          country: myCountry,
          countryFlag: myCountryFlag,
          avatar: myAvatar,
          timestamp: Date.now(),
        };
        await setDoc(doc(db, 'user_presences', myId), cleanForFirestore(presenceDoc), { merge: true });
      } catch (err) {
        console.warn('Presence heartbeat error:', err);
      }
    };

    // Report immediately on load
    reportHeartbeat(true);

    // Sync native Android background service for deep-sleep call handling
    if (isNativeApp() && myId) {
      updateNativeSession({
        memberId: myId,
        fundId: effectiveFundId,
        name: myName,
        role: myRole,
        isAdmin: Boolean(isAdmin),
      }).catch(() => {});
    }

    // Heartbeat every 20 seconds
    const interval = setInterval(() => {
      reportHeartbeat(true);
    }, 20000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        reportHeartbeat(true);
      } else {
        reportHeartbeat(false);
      }
    };

    const handleBeforeUnload = () => {
      reportHeartbeat(false);
    };

    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [myId, myName, myRole, myAvatar, myCountry, myCountryFlag, effectiveFundId]);

  // 2. Real-time User Presence Listener from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        collection(db, 'user_presences'),
        (snapshot) => {
          const dict: Record<string, { isOnline: boolean; lastActive: string; country?: string; countryFlag?: string }> = {};
          const now = Date.now();

          snapshot.docs.forEach((d) => {
            const data = d.data();
            const lastActiveMs = data.lastActive ? new Date(data.lastActive).getTime() : 0;
            // Online if marked online and updated in last 50 seconds
            const isFresh = Boolean(data.isOnline && (now - lastActiveMs < 50000));
            dict[d.id] = {
              isOnline: isFresh,
              lastActive: data.lastActive || new Date().toISOString(),
              country: data.country,
              countryFlag: data.countryFlag,
            };
          });

          setRawPresences(dict);
        },
        (err) => {
          console.warn('Presence snapshot listener error:', err);
        }
      );

      return () => unsub();
    } catch (err) {
      console.warn('Presence listener setup failed:', err);
    }
  }, []);

  // Compute combined user presences (merge Firestore presence with members list)
  const userPresences = useMemo<UserPresence[]>(() => {
    // Current user presence
    const myPresenceData = myId ? rawPresences[myId] : null;

    // Admin presence
    const adminMember = members.find((m) => m.role === 'admin' || m.id === 'admin_master_001');
    const adminPresenceData = rawPresences['admin_master_001'] || rawPresences['admin'] || (isAdmin && myId ? rawPresences[myId] : null);
    const adminIsOnline = Boolean(adminPresenceData?.isOnline || isAdmin);
    const adminLastActive = adminPresenceData?.lastActive || new Date().toISOString();
    const adminLastActiveFormatted = adminIsOnline ? 'বর্তমানে সক্রিয়' : formatLastActiveBn(adminLastActive).text;
    const adminCountryRaw = adminPresenceData?.country || adminMember?.country || currentFund?.country || 'সৌদি আরব';
    const adminCountryBn = getCountryBn(adminCountryRaw);
    const adminCountryFlag = adminPresenceData?.countryFlag || adminMember?.countryFlag || getCountryFlag(adminCountryRaw) || '🇸🇦';

    const result: UserPresence[] = [
      {
        id: isAdmin && myId ? myId : 'admin_master_001',
        name: isAdmin ? myName : (adminMember?.nameBn || adminMember?.name || 'এডমিন আব্দুল কাদির'),
        role: 'admin',
        isOnline: adminIsOnline,
        lastActive: adminLastActive,
        country: adminCountryBn,
        countryFlag: adminCountryFlag,
        customStatus: adminLastActiveFormatted,
      },
    ];

    members.forEach((m) => {
      const pData = rawPresences[m.id];
      const isMe = m.id === myId || m.id === currentMember?.id;
      const isOnline = isMe ? true : Boolean(pData?.isOnline);
      const lastActive = isMe ? new Date().toISOString() : (pData?.lastActive || m.joinedDate || '');
      
      // Fetch and format server-stored country with multiple reliable fallbacks
      let serverCountryRaw = pData?.country || m.country;
      let serverCountryFlag = pData?.countryFlag || m.countryFlag;

      // If missing, try to infer from phone number
      if (!serverCountryRaw && m.phone) {
        const detected = detectCountryFromPhone(m.phone);
        if (detected) {
          serverCountryRaw = detected.nameBn;
          serverCountryFlag = detected.flag;
        }
      }

      // If still missing, fallback to current fund country or default diaspora country
      if (!serverCountryRaw) {
        serverCountryRaw = currentFund?.country || 'সৌদি আরব';
      }

      const serverCountryBn = getCountryBn(serverCountryRaw) || 'সৌদি আরব';
      if (!serverCountryFlag) {
        serverCountryFlag = getCountryFlag(serverCountryRaw) || '🇸🇦';
      }
      const lastActiveStatus = isOnline ? 'বর্তমানে সক্রিয়' : formatLastActiveBn(lastActive).text;

      result.push({
        id: m.id,
        name: m.nameBn || m.name,
        role: m.role || 'member',
        isOnline,
        lastActive,
        country: serverCountryBn,
        countryFlag: serverCountryFlag,
        avatar: m.avatarUrl,
        customStatus: lastActiveStatus,
      });
    });

    // SORTING ORDER (Strict requirement):
    // 1. All currently ACTIVE (Online) users come FIRST.
    // 2. Then, offline users sorted strictly chronologically by recency:
    //    (2 min ago > 3 min ago > 4 min ago > hours ago > days ago > inactive)
    return result.sort((a, b) => {
      // 1. Active online users always on top
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;

      // 2. Strict chronological order of recency of lastActive timestamp
      const timeA = a.lastActive ? new Date(a.lastActive).getTime() : 0;
      const timeB = b.lastActive ? new Date(b.lastActive).getTime() : 0;

      if (timeA !== timeB) {
        return timeB - timeA; // Descending (more recent timestamp first)
      }

      // 3. Fallback: Admin priority then alphabetical
      if (a.role === 'admin' && b.role !== 'admin') return -1;
      if (b.role === 'admin' && a.role !== 'admin') return 1;
      return a.name.localeCompare(b.name, 'bn');
    });
  }, [members, rawPresences, myId, myName, isAdmin, currentMember]);

  const onlineCount = useMemo(() => {
    return userPresences.filter((p) => p.isOnline).length;
  }, [userPresences]);

  // Mark all unread messages as read
  const markChatAsRead = () => {
    setUnreadChatCount(0);
    setMessages((prev) => {
      let changed = false;
      const updated = prev.map((m) => {
        if (m.status !== 'read') {
          changed = true;
          return { ...m, status: 'read' as const };
        }
        return m;
      });
      if (changed) {
        localStorage.setItem(`probashi_chat_msgs_${activeFundId || 'all'}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // 3. Real-time Incoming & Active Call Signaling via Firestore
  useEffect(() => {
    if (!myId) return;

    try {
      const callsQuery = query(collection(db, 'active_calls'), limit(50));
      const unsubscribe = onSnapshot(
        callsQuery,
        (snapshot) => {
          const now = Date.now();
          let incoming: IncomingCallState | null = null;
          let liveGroup: { isLive: boolean; participantsCount: number; type: CallType } | null = null;

          snapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            const callTime = data.timestamp || 0;
            const ageMs = now - callTime;

            // Only consider recent active calls (within 3 minutes)
            if (ageMs < 180000) {
              if (data.status === 'ringing') {
                // A caller must NEVER receive an incoming call alert or ringtone on their own device!
                const isMeCaller =
                  Boolean(myId && data.callerId === myId) ||
                  Boolean(currentMember?.id && data.callerId === currentMember.id) ||
                  Boolean(myName && data.callerName === myName) ||
                  Boolean(myUsername && data.callerUsername === myUsername) ||
                  Boolean(activeCall && (activeCall.id === docSnap.id || activeCall.status === 'calling' || activeCall.status === 'connected'));

                if (!isMeCaller) {
                  const isTargetMe =
                    Boolean(myId && data.targetId === myId) ||
                    Boolean(currentMember?.id && data.targetId === currentMember.id) ||
                    Boolean(myUsername && data.targetUsername === myUsername) ||
                    Boolean(isAdmin && (data.targetRole === 'admin' || data.targetId === 'admin_master_001' || data.targetId === 'admin' || (data.targetName && data.targetName.includes('এডমিন')))) ||
                    Boolean(myName && data.targetName === myName);

                  const isGroupForMe = Boolean(data.isGroup);

                  if (isTargetMe || isGroupForMe) {
                    incoming = {
                      id: docSnap.id,
                      type: data.type || 'audio',
                      callerId: data.callerId,
                      callerName: data.callerName || 'প্রবাসী সদস্য',
                      callerRole: data.callerRole || 'member',
                      callerAvatar: data.callerAvatar,
                      callerCountry: data.callerCountry,
                      callerCountryFlag: data.callerCountryFlag,
                      targetId: data.targetId,
                      targetName: data.targetName,
                      isGroup: Boolean(data.isGroup),
                      status: 'ringing',
                      timestamp: callTime,
                    };
                  }
                }
              }

              if (data.status === 'connected') {
                // If caller was waiting for connection, transition caller to connected!
                if (activeCall && activeCall.id === docSnap.id && activeCall.status === 'calling') {
                  if (callToneStopRef.current) {
                    callToneStopRef.current();
                    callToneStopRef.current = null;
                  }
                  setActiveCall((prev) => (prev ? { ...prev, status: 'connected', startedAt: Date.now() } : null));
                }

                if (data.isGroup) {
                  liveGroup = {
                    isLive: true,
                    participantsCount: (data.participants || []).length || 2,
                    type: data.type || 'audio',
                  };
                }
              }

              if (data.status === 'ended' || data.status === 'rejected') {
                // If current active call was ended by remote party
                if (activeCall && activeCall.id === docSnap.id) {
                  endCallLocally();
                }
              }
            }
          });

          // Handle incoming call alert (for callee only)
          if (incoming && !activeCall) {
            setIncomingCall(incoming);
            if (!incomingToneStopRef.current && soundEnabled) {
              incomingToneStopRef.current = soundEffects.startIncomingRingtone();
            }

            // Trigger system Web Notification with action buttons & high priority for lock screen & background
            triggerIncomingCallNotification({
              callerName: incoming.callerName,
              callerAvatar: incoming.callerAvatar,
              callType: incoming.type,
              callId: incoming.id,
              isGroup: incoming.isGroup,
            }).catch(() => {});
          } else {
            if (incomingCall) {
              cancelIncomingCallNotification(incomingCall.id).catch(() => {});
            }
            setIncomingCall(null);
            if (incomingToneStopRef.current) {
              incomingToneStopRef.current();
              incomingToneStopRef.current = null;
            }
            safeVibrate(0);
            releaseScreenWakeLock();
          }

          setRunningGroupCall(liveGroup);
        },
        (err) => {
          console.warn('Call signaling snapshot error:', err);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Call listener setup error:', err);
    }
  }, [myId, myName, myUsername, activeCall, soundEnabled, isAdmin, currentMember]);

  // Clean local call termination
  const endCallLocally = () => {
    webrtcManager.cleanup();
    releaseWakeLock();
    if (callToneStopRef.current) {
      callToneStopRef.current();
      callToneStopRef.current = null;
    }
    if (incomingToneStopRef.current) {
      incomingToneStopRef.current();
      incomingToneStopRef.current = null;
    }
    safeVibrate(0);
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    if (soundEnabled) {
      soundEffects.playEndCall();
    }
    if (activeCall?.id || incomingCall?.id) {
      endNativeCall(activeCall?.id || incomingCall?.id).catch(() => {});
    }
    setActiveCall(null);
    setIncomingCall(null);
  };

  // Call Initiation (Caller)
  const startCall = async (
    type: CallType,
    isGroup: boolean,
    targetUser?: { id: string; name: string; avatar?: string; role: UserRole }
  ) => {
    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const currentName = myName;
    const currentAvatar = myAvatar;

    const participants: CallParticipant[] = [
      {
        id: myId,
        name: `${currentName} (আপনি)`,
        role: myRole,
        avatar: currentAvatar,
        country: myCountry,
        isMuted: false,
        isVideoOff: false,
      },
    ];

    if (isGroup) {
      members.slice(0, 4).forEach((m) => {
        if (m.id !== myId) {
          participants.push({
            id: m.id,
            name: m.nameBn || m.name,
            role: m.role || 'member',
            avatar: m.avatarUrl,
            country: m.country,
            isMuted: false,
            isVideoOff: false,
          });
        }
      });
    } else if (targetUser) {
      participants.push({
        id: targetUser.id,
        name: targetUser.name,
        role: targetUser.role,
        avatar: targetUser.avatar,
        isMuted: false,
        isVideoOff: false,
      });
    }

    const newCall: ActiveCallState = {
      id: callId,
      type,
      status: 'calling',
      isGroupCall: isGroup,
      callerId: myId,
      callerName: myName,
      callerAvatar: myAvatar,
      targetUser,
      participants,
      durationSeconds: 0,
      isMuted: false,
      isVideoOff: false,
      isSpeakerOn: true,
      cameraFacing: 'user',
    };

    setActiveCall(newCall);

    if (callToneStopRef.current) {
      callToneStopRef.current();
      callToneStopRef.current = null;
    }

    if (soundEnabled) {
      callToneStopRef.current = soundEffects.startOutgoingDialTone();
    }

    // Initialize WebRTC as Caller
    webrtcManager.startCaller(callId, type, () => {}).catch((err) => {
      console.warn('WebRTC caller startup error:', err);
    });

    // 🚀 Dispatch Firestore Signaling and High-Urgency FCM Push simultaneously in parallel
    const callDocData = {
      id: callId,
      fundId: effectiveFundId,
      callerId: myId,
      callerUsername: myUsername,
      callerName: myName,
      callerRole: myRole,
      callerAvatar: myAvatar,
      callerCountry: myCountry,
      callerCountryFlag: myCountryFlag,
      targetId: targetUser?.id || null,
      targetName: targetUser?.name || null,
      targetRole: targetUser?.role || null,
      type,
      isGroup,
      status: 'ringing',
      participants: cleanForFirestore(participants),
      timestamp: Date.now(),
      startedAt: Date.now(),
    };

    const recipientIds = isGroup
      ? members.filter((m) => m.id !== myId).map((m) => m.id)
      : targetUser
      ? [targetUser.id]
      : [];

    // Parallel instant dispatch (no waiting for one to start the other)
    Promise.allSettled([
      setDoc(doc(db, 'active_calls', callId), cleanForFirestore(callDocData)),
      recipientIds.length > 0
        ? sendFcmCallPushNotification({
            targetMemberIds: recipientIds,
            callerName: myName,
            callerAvatar: myAvatar,
            callType: type,
            callId,
            isGroup,
            fundId: effectiveFundId,
          })
        : Promise.resolve(false),
    ]).catch((err) => {
      console.warn('Call signaling/push parallel dispatch note:', err);
    });

    // Start timer for duration
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    callTimerRef.current = setInterval(() => {
      setActiveCall((prev) => {
        if (!prev) return null;
        if (prev.status === 'connected') {
          return { ...prev, durationSeconds: prev.durationSeconds + 1 };
        }
        return prev;
      });
    }, 1000);
  };

  // Accept incoming call (Recipient)
  const acceptIncomingCall = async () => {
    if (!incomingCall) return;

    if (incomingToneStopRef.current) {
      incomingToneStopRef.current();
      incomingToneStopRef.current = null;
    }

    safeVibrate(0);

    const currentName = myName;
    const currentAvatar = myAvatar;

    const myParticipant: CallParticipant = {
      id: myId,
      name: `${currentName} (আপনি)`,
      role: myRole,
      avatar: currentAvatar,
      country: myCountry,
      isMuted: false,
      isVideoOff: false,
    };

    const callerParticipant: CallParticipant = {
      id: incomingCall.callerId,
      name: incomingCall.callerName,
      role: incomingCall.callerRole,
      avatar: incomingCall.callerAvatar,
      country: incomingCall.callerCountry,
      isMuted: false,
      isVideoOff: false,
    };

    const connectedCall: ActiveCallState = {
      id: incomingCall.id,
      type: incomingCall.type,
      status: 'connected',
      isGroupCall: incomingCall.isGroup,
      callerId: incomingCall.callerId,
      callerName: incomingCall.callerName,
      callerAvatar: incomingCall.callerAvatar,
      targetUser: {
        id: incomingCall.callerId,
        name: incomingCall.callerName,
        avatar: incomingCall.callerAvatar,
        role: incomingCall.callerRole,
      },
      participants: [myParticipant, callerParticipant],
      durationSeconds: 1,
      isMuted: false,
      isVideoOff: false,
      isSpeakerOn: true,
      cameraFacing: 'user',
    };

    setActiveCall(connectedCall);
    setIncomingCall(null);
    requestWakeLock().catch(() => {});

    // Initialize WebRTC as Callee
    webrtcManager.startCallee(incomingCall.id, incomingCall.type, () => {}).catch((err) => {
      console.warn('WebRTC callee startup error:', err);
    });

    // Update Firestore status to 'connected'
    try {
      await updateDoc(doc(db, 'active_calls', incomingCall.id), {
        status: 'connected',
        acceptedBy: myId,
        connectedAt: Date.now(),
      });
    } catch (err) {
      console.warn('Error accepting call in Firestore:', err);
    }

    // Start duration counter
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    callTimerRef.current = setInterval(() => {
      setActiveCall((prev) => {
        if (!prev || prev.status !== 'connected') return prev;
        return { ...prev, durationSeconds: prev.durationSeconds + 1 };
      });
    }, 1000);
  };

  // Listen for ServiceWorker answer/decline action messages (from Lock Screen notification buttons)
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      const messageHandler = (event: MessageEvent) => {
        if (event.data?.type === 'ANSWER_INCOMING_CALL') {
          const callData = event.data?.data;
          if (incomingCallRef.current || incomingCall) {
            acceptIncomingCall();
          } else if (callData?.callId) {
            getDoc(doc(db, 'active_calls', callData.callId)).then((snap) => {
              if (snap?.exists()) {
                const data = snap.data();
                if (data && (data.status === 'ringing' || data.status === 'calling')) {
                  const incObj: IncomingCallState = {
                    id: snap.id,
                    type: data.type || 'audio',
                    callerId: data.callerId,
                    callerName: data.callerName || 'প্রবাসী সদস্য',
                    callerAvatar: data.callerAvatar,
                    callerRole: data.callerRole || 'member',
                    callerCountry: data.callerCountry,
                    callerCountryFlag: data.callerCountryFlag,
                    targetId: data.targetId || null,
                    targetName: data.targetName || null,
                    isGroup: Boolean(data.isGroup),
                    status: 'ringing',
                    timestamp: data.timestamp || Date.now(),
                  };
                  setIncomingCall(incObj);
                  incomingCallRef.current = incObj;
                  setTimeout(() => {
                    acceptIncomingCall();
                  }, 200);
                }
              }
            }).catch(() => {});
          }
        } else if (event.data?.type === 'DECLINE_INCOMING_CALL') {
          if (incomingCallRef.current || incomingCall) {
            rejectIncomingCall();
          }
        }
      };
      navigator.serviceWorker.addEventListener('message', messageHandler);
      return () => {
        navigator.serviceWorker.removeEventListener('message', messageHandler);
      };
    }
  }, [incomingCall]);

  // Listen for Native Android Capacitor Call events (Answer/Decline from native Lock Screen Activity)
  useEffect(() => {
    const unbind = registerNativeCallBridge({
      onAnswer: async (data) => {
        console.log('[ChatContext] Native call answered event received:', data);
        const targetCallId = data.callId;
        if (incomingCallRef.current && incomingCallRef.current.id === targetCallId) {
          acceptIncomingCall();
        } else if (targetCallId) {
          const callDocSnap = await getDoc(doc(db, 'active_calls', targetCallId)).catch(() => null);
          if (callDocSnap?.exists()) {
            const d = callDocSnap.data();
            if (d && (d.status === 'ringing' || d.status === 'calling')) {
              const incObj: IncomingCallState = {
                id: callDocSnap.id,
                type: d.type || 'audio',
                callerId: d.callerId,
                callerName: d.callerName || data.callerName || 'প্রবাসী সদস্য',
                callerAvatar: d.callerAvatar,
                callerRole: d.callerRole || 'member',
                callerCountry: d.callerCountry,
                callerCountryFlag: d.callerCountryFlag,
                targetId: d.targetId || null,
                targetName: d.targetName || null,
                isGroup: Boolean(d.isGroup),
                status: 'ringing',
                timestamp: d.timestamp || Date.now(),
              };
              setIncomingCall(incObj);
              incomingCallRef.current = incObj;
              setTimeout(() => {
                acceptIncomingCall();
              }, 200);
            }
          }
        }
      },
      onDecline: async (data) => {
        console.log('[ChatContext] Native call declined event received:', data);
        if (incomingCallRef.current || incomingCall) {
          rejectIncomingCall();
        } else if (data.callId) {
          try {
            await updateDoc(doc(db, 'active_calls', data.callId), {
              status: 'rejected',
              rejectedBy: myId,
            });
          } catch {}
        }
      },
    });

    let tokenRefreshHandle: any = null;
    if (isNativeApp()) {
      NativeCall.addListener('tokenRefreshed', (data) => {
        if (data.token) {
          console.log('[ChatContext] Native token refreshed:', data.token);
          localStorage.setItem('probashi_fcm_token', data.token);
          syncFcmTokenToFirestore(data.token, myId, effectiveFundId);
        }
      }).then((h) => {
        tokenRefreshHandle = h;
      }).catch(() => {});
    }

    return () => {
      unbind();
      tokenRefreshHandle?.remove();
    };
  }, [myId, incomingCall, effectiveFundId]);

  // Check URL parameters when window opens from lock-screen notification click or push tap
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkUrlCallAction = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const callAction = urlParams.get('callAction');
        const callId = urlParams.get('callId');

        if (callAction === 'answer' && callId) {
          // Request Screen Wake Lock so screen stays ON
          requestScreenWakeLock();

          const currentInc = incomingCallRef.current || incomingCall;
          if (currentInc && currentInc.id === callId) {
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            acceptIncomingCall();
          } else {
            // Cold start: App was closed, fetch call doc directly from Firestore
            const callDocSnap = await getDoc(doc(db, 'active_calls', callId)).catch(() => null);
            if (callDocSnap?.exists()) {
              const data = callDocSnap.data();
              if (data && (data.status === 'ringing' || data.status === 'calling')) {
                const incObj: IncomingCallState = {
                  id: callDocSnap.id,
                  type: data.type || 'audio',
                  callerId: data.callerId,
                  callerName: data.callerName || 'প্রবাসী সদস্য',
                  callerAvatar: data.callerAvatar,
                  callerRole: data.callerRole || 'member',
                  callerCountry: data.callerCountry,
                  callerCountryFlag: data.callerCountryFlag,
                  targetId: data.targetId || null,
                  targetName: data.targetName || null,
                  isGroup: Boolean(data.isGroup),
                  status: 'ringing',
                  timestamp: data.timestamp || Date.now(),
                };
                setIncomingCall(incObj);
                incomingCallRef.current = incObj;

                const cleanUrl = window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
                
                // Trigger accept directly
                setTimeout(() => {
                  acceptIncomingCall();
                }, 300);
              }
            }
          }
        }
      } catch (e) {
        console.warn('URL call action handling error:', e);
      }
    };

    checkUrlCallAction();
  }, [incomingCall?.id, myId]);

  // Reject / Decline incoming call
  const rejectIncomingCall = async () => {
    if (!incomingCall) return;

    if (incomingToneStopRef.current) {
      incomingToneStopRef.current();
      incomingToneStopRef.current = null;
    }

    safeVibrate(0);

    const callId = incomingCall.id;
    endNativeCall(callId).catch(() => {});
    setIncomingCall(null);
    webrtcManager.cleanup();

    try {
      await updateDoc(doc(db, 'active_calls', callId), {
        status: 'rejected',
        rejectedBy: myId,
      });
    } catch (err) {
      console.warn('Error rejecting call in Firestore:', err);
    }
  };

  // Join an ongoing active call room
  const joinCall = (type: CallType = 'audio') => {
    if (activeCall) return;

    const myParticipant: CallParticipant = {
      id: myId,
      name: `${myName} (আপনি)`,
      avatar: myAvatar,
      role: myRole,
      country: myCountry,
      isMuted: false,
      isVideoOff: false,
    };

    const groupParticipants: CallParticipant[] = [
      myParticipant,
      ...members.slice(0, 3).map((m) => ({
        id: m.id,
        name: m.nameBn || m.name,
        avatar: m.avatarUrl,
        role: m.role || 'member',
        country: m.country,
        isMuted: false,
        isVideoOff: false,
      })),
    ];

    const joinedCall: ActiveCallState = {
      id: `call_joined_${Date.now()}`,
      type,
      status: 'connected',
      isGroupCall: true,
      participants: groupParticipants,
      durationSeconds: 15,
      isMuted: false,
      isVideoOff: false,
      isSpeakerOn: true,
      cameraFacing: 'user',
    };

    setActiveCall(joinedCall);
    setRunningGroupCall({ isLive: true, participantsCount: groupParticipants.length, type });

    webrtcManager.getLocalMedia(type).catch(() => {});

    if (callTimerRef.current) clearInterval(callTimerRef.current);
    callTimerRef.current = setInterval(() => {
      setActiveCall((prev) => {
        if (!prev || prev.status !== 'connected') return prev;
        return { ...prev, durationSeconds: prev.durationSeconds + 1 };
      });
    }, 1000);
  };

  // End active call
  const endCall = async () => {
    const callToClose = activeCall;

    webrtcManager.cleanup();

    if (callToneStopRef.current) {
      callToneStopRef.current();
      callToneStopRef.current = null;
    }
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    if (soundEnabled) {
      soundEffects.playEndCall();
    }

    // Post a call log in group chat if call lasted > 0 seconds
    if (callToClose && callToClose.durationSeconds > 0) {
      const mins = Math.floor(callToClose.durationSeconds / 60);
      const secs = callToClose.durationSeconds % 60;
      const durationStr = `${mins > 0 ? `${mins} মি ` : ''}${secs} সেকেন্ড`;

      const callLogMsg: ChatMessage = {
        id: `call_log_${Date.now()}`,
        fundId: effectiveFundId,
        senderId: myId || 'system',
        senderName: 'সিস্টেম কল লগ',
        senderRole: 'admin',
        type: 'call_log',
        text: `${callToClose.type === 'video' ? '📹 ভিডিও কল সমাপ্ত' : '📞 অডিও কল সমাপ্ত'} (${callToClose.isGroupCall ? 'গ্রুপ কল' : callToClose.targetUser?.name || '১-টু-১ কল'}) • সময়কাল: ${durationStr}`,
        timestamp: new Date().toISOString(),
        status: 'read',
      };

      setMessages((prev) => [...prev, callLogMsg]);
      setDoc(doc(db, 'chat_messages', callLogMsg.id), cleanForFirestore(callLogMsg)).catch(() => {});
    }

    if (callToClose) {
      try {
        await updateDoc(doc(db, 'active_calls', callToClose.id), {
          status: 'ended',
          endedAt: Date.now(),
        });
      } catch {
        // ignore
      }
    }

    setActiveCall(null);
    setRunningGroupCall(null);
  };

  const toggleMute = () => {
    setActiveCall((prev) => {
      if (!prev) return null;
      const newMuted = !prev.isMuted;
      webrtcManager.setAudioMute(newMuted);
      return { ...prev, isMuted: newMuted };
    });
  };

  const toggleVideo = () => {
    setActiveCall((prev) => {
      if (!prev) return null;
      const newVideoOff = !prev.isVideoOff;
      webrtcManager.setVideoOff(newVideoOff);
      return { ...prev, isVideoOff: newVideoOff };
    });
  };

  const toggleSpeaker = () => {
    setActiveCall((prev) => (prev ? { ...prev, isSpeakerOn: !prev.isSpeakerOn } : null));
  };

  const toggleCameraFacing = () => {
    setActiveCall((prev) => {
      if (!prev) return null;
      const newFacing = prev.cameraFacing === 'user' ? 'environment' : 'user';
      webrtcManager.flipCamera(newFacing);
      return { ...prev, cameraFacing: newFacing };
    });
  };

  const prevMsgIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef<boolean>(true);

  // 4. Real-time Firestore Chat Message Sync
  useEffect(() => {
    try {
      const q = query(collection(db, 'chat_messages'), limit(500));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched: ChatMessage[] = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            })) as ChatMessage[];

            // Filter for current fund or default fund or user direct messages
            const fundFiltered = fetched.filter((m) => {
              // Direct messages involving the user are always included
              if (m.isDirect) {
                const isSentByMe = m.senderId === myId || (isAdmin && m.senderRole === 'admin') || (currentMember && m.senderId === currentMember.id);
                const isReceivedByMe = m.recipientId === myId || (isAdmin && (m.recipientRole === 'admin' || m.recipientId === 'admin_master_001' || m.recipientId === 'admin')) || (currentMember && m.recipientId === currentMember.id) || (m.recipientName && m.recipientName === myName);
                if (isSentByMe || isReceivedByMe) return true;
              }

              // Community group messages: include all workspace community messages
              if (!activeFundId || isDefaultFund(activeFundId) || !m.fundId || isDefaultFund(m.fundId)) {
                return true;
              }
              return m.fundId === activeFundId;
            });

            // Sort ascending by timestamp
            fundFiltered.sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());

            // Play receive sound & push notification ONLY when user is NOT actively viewing the chat screen
            if (!isInitialLoadRef.current) {
              const newIncoming = fundFiltered.filter(
                (m) =>
                  !prevMsgIdsRef.current.has(m.id) &&
                  m.senderId !== myId &&
                  m.senderName !== myName &&
                  m.type !== 'call_log'
              );

              if (newIncoming.length > 0) {
                // Check if user is currently active on the chat screen with tab visible & focused
                const isActivelyViewingChat =
                  isChatScreenActiveRef.current &&
                  typeof document !== 'undefined' &&
                  document.visibilityState === 'visible';

                if (!isActivelyViewingChat) {
                  // User is not on the chat screen (e.g., viewing Fund tab, other app tab, or mobile device background)
                  if (soundEnabled) {
                    soundEffects.playReceiveMessage();
                  }

                  // Fire native mobile/browser push notification with Service Worker (works on lock screen & background)
                  const latestMsg = newIncoming[newIncoming.length - 1];
                  const notifTitle = latestMsg.isDirect
                    ? `${latestMsg.senderName} (সরাসরি বার্তা)`
                    : `${latestMsg.senderName} • প্রবাসী মুক্ত ফান্ড`;
                  const notifBody =
                    latestMsg.type === 'voice'
                      ? '🎤 একটি ভয়েস বার্তা পাঠিয়েছেন'
                      : latestMsg.type === 'image'
                      ? '📷 একটি ছবি পাঠিয়েছেন'
                      : latestMsg.text || 'একটি নতুন বার্তা এসেছে';

                  sendPushNotification({
                    title: notifTitle,
                    body: notifBody,
                    icon: latestMsg.senderAvatar || '/udbhob_logo.svg',
                    badge: '/udbhob_logo.svg',
                    tag: 'probashi-chat-msg',
                    vibratePattern: [200, 100, 200],
                    data: { url: '/', messageId: latestMsg.id },
                  });
                } else {
                  // When user is actively on chat screen, incoming messages stream smoothly without sound interruption
                }

                setUnreadChatCount((prev) => prev + newIncoming.length);
              }
            } else {
              isInitialLoadRef.current = false;
            }

            prevMsgIdsRef.current = new Set(fundFiltered.map((m) => m.id));
            setMessages(fundFiltered);
            saveMessagesOffline(fundFiltered, activeFundId || undefined);
          } else {
            // If snapshot is empty (e.g. during initial network disconnect), keep cached offline messages!
          }
        },
        (err) => {
          console.warn('Firestore chat snapshot error (relying on offline cache):', err);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Chat listener setup error:', err);
    }
  }, [activeFundId, myId, myName, soundEnabled, isAdmin, currentMember]);

  // Derive pinned message
  const pinnedMessage = useMemo(() => {
    return messages.slice().reverse().find((m) => m.isPinned) || null;
  }, [messages]);

  // 5. Send standard text message (Group or Direct 1-to-1)
  const sendMessage = async (
    text: string,
    replyTo?: ChatMessage['replyTo'],
    directTarget?: { recipientId: string; recipientName: string }
  ) => {
    if (!text.trim()) return;

    const recipient = directTarget || (selectedChatTab === 'direct' && selectedDirectUser ? { recipientId: selectedDirectUser.id, recipientName: selectedDirectUser.name } : undefined);

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      fundId: effectiveFundId,
      senderId: myId,
      senderName: myName,
      senderRole: myRole,
      senderCountry: myCountry,
      senderCountryFlag: myCountryFlag,
      senderAvatar: myAvatar,
      recipientId: recipient?.recipientId,
      recipientName: recipient?.recipientName,
      isDirect: Boolean(recipient),
      type: 'text',
      text: text.trim(),
      replyTo: replyTo || (replyingTo ? { id: replyingTo.id, senderName: replyingTo.senderName, text: replyingTo.text || '' } : undefined),
      timestamp: new Date().toISOString(),
      status: 'sent',
      reactions: {},
    };

    if (soundEnabled) {
      soundEffects.playSendMessage();
    }

    setReplyingTo(null);

    // Optimistic local and offline IndexedDB update
    setMessages((prev) => {
      const updated = [...prev, newMessage];
      saveMessagesOffline(updated, activeFundId || undefined);
      return updated;
    });

    // Firestore persistence with offline fallback queue
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        await queueOfflineMessage(newMessage);
      } else {
        await setDoc(doc(db, 'chat_messages', newMessage.id), cleanForFirestore(newMessage));
      }

      // Dispatch Web Push notification to recipient(s)
      const recipientIds = recipient
        ? [recipient.recipientId]
        : members.filter((m) => m.id !== myId).map((m) => m.id);

      if (recipientIds.length > 0) {
        sendFcmChatPushNotification({
          recipientMemberIds: recipientIds,
          senderName: myName,
          senderAvatar: myAvatar,
          messageText: text.trim(),
          messageType: 'text',
          fundId: effectiveFundId,
          senderId: myId,
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('Could not save message to Firestore, queued for sync:', err);
      await queueOfflineMessage(newMessage);
    }
  };

  // 6. Send voice note
  const sendVoiceMessage = async (
    durationSeconds: number,
    audioDataUrl?: string,
    directTarget?: { recipientId: string; recipientName: string }
  ) => {
    const recipient = directTarget || (selectedChatTab === 'direct' && selectedDirectUser ? { recipientId: selectedDirectUser.id, recipientName: selectedDirectUser.name } : undefined);

    const newMessage: ChatMessage = {
      id: `msg_voice_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      fundId: effectiveFundId,
      senderId: myId,
      senderName: myName,
      senderRole: myRole,
      senderCountry: myCountry,
      senderCountryFlag: myCountryFlag,
      senderAvatar: myAvatar,
      recipientId: recipient?.recipientId,
      recipientName: recipient?.recipientName,
      isDirect: Boolean(recipient),
      type: 'voice',
      voiceDuration: Math.max(1, Math.round(durationSeconds)),
      voiceDataUrl: audioDataUrl,
      text: `ভয়েস বার্তা (${durationSeconds}s)`,
      timestamp: new Date().toISOString(),
      status: 'sent',
      reactions: {},
    };

    if (soundEnabled) {
      soundEffects.playSendMessage();
    }

    setMessages((prev) => {
      const updated = [...prev, newMessage];
      saveMessagesOffline(updated, activeFundId || undefined);
      return updated;
    });

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        await queueOfflineMessage(newMessage);
      } else {
        await setDoc(doc(db, 'chat_messages', newMessage.id), cleanForFirestore(newMessage));
      }

      const recipientIds = recipient
        ? [recipient.recipientId]
        : members.filter((m) => m.id !== myId).map((m) => m.id);

      if (recipientIds.length > 0) {
        sendFcmChatPushNotification({
          recipientMemberIds: recipientIds,
          senderName: myName,
          senderAvatar: myAvatar,
          messageText: `🎤 ভয়েস বার্তা (${durationSeconds}s)`,
          messageType: 'voice',
          fundId: effectiveFundId,
          senderId: myId,
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('Could not save voice note to Firestore, queued for sync:', err);
      await queueOfflineMessage(newMessage);
    }
  };

  // 7. Send image message
  const sendImageMessage = async (
    imageUrl: string,
    caption?: string,
    directTarget?: { recipientId: string; recipientName: string }
  ) => {
    const recipient = directTarget || (selectedChatTab === 'direct' && selectedDirectUser ? { recipientId: selectedDirectUser.id, recipientName: selectedDirectUser.name } : undefined);

    const newMessage: ChatMessage = {
      id: `msg_img_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      fundId: effectiveFundId,
      senderId: myId,
      senderName: myName,
      senderRole: myRole,
      senderCountry: myCountry,
      senderCountryFlag: myCountryFlag,
      senderAvatar: myAvatar,
      recipientId: recipient?.recipientId,
      recipientName: recipient?.recipientName,
      isDirect: Boolean(recipient),
      type: 'image',
      imageUrl,
      text: caption || 'ছবি শেয়ার করা হয়েছে',
      timestamp: new Date().toISOString(),
      status: 'sent',
      reactions: {},
    };

    if (soundEnabled) {
      soundEffects.playSendMessage();
    }

    setMessages((prev) => {
      const updated = [...prev, newMessage];
      saveMessagesOffline(updated, activeFundId || undefined);
      return updated;
    });

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        await queueOfflineMessage(newMessage);
      } else {
        await setDoc(doc(db, 'chat_messages', newMessage.id), cleanForFirestore(newMessage));
      }

      const recipientIds = recipient
        ? [recipient.recipientId]
        : members.filter((m) => m.id !== myId).map((m) => m.id);

      if (recipientIds.length > 0) {
        sendFcmChatPushNotification({
          recipientMemberIds: recipientIds,
          senderName: myName,
          senderAvatar: myAvatar,
          messageText: caption || '📷 ছবি পাঠিয়েছেন',
          messageType: 'image',
          fundId: effectiveFundId,
          senderId: myId,
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('Could not save image message to Firestore, queued for sync:', err);
      await queueOfflineMessage(newMessage);
    }
  };

  // Add or toggle emoji reaction
  const addReaction = async (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        const existingReactions = { ...(msg.reactions || {}) };
        const usersForEmoji = existingReactions[emoji] ? [...existingReactions[emoji]] : [];

        if (usersForEmoji.includes(myName)) {
          const filtered = usersForEmoji.filter((u) => u !== myName);
          if (filtered.length === 0) {
            delete existingReactions[emoji];
          } else {
            existingReactions[emoji] = filtered;
          }
        } else {
          existingReactions[emoji] = [...usersForEmoji, myName];
        }

        const updatedMsg = { ...msg, reactions: existingReactions };
        setDoc(doc(db, 'chat_messages', msg.id), cleanForFirestore(updatedMsg), { merge: true }).catch(() => {});
        return updatedMsg;
      })
    );
  };

  // Pin/Unpin message
  const togglePinMessage = async (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const updated = { ...msg, isPinned: !msg.isPinned };
          setDoc(doc(db, 'chat_messages', msg.id), { isPinned: updated.isPinned }, { merge: true }).catch(() => {});
          return updated;
        }
        return msg;
      })
    );
  };

  // Delete message
  const deleteMessage = async (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    try {
      await deleteDoc(doc(db, 'chat_messages', messageId));
    } catch {
      // ignore
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        pinnedMessage,
        loading,
        replyingTo,
        setReplyingTo,
        activeCall,
        incomingCall,
        runningGroupCall,
        userPresences,
        onlineCount,
        unreadChatCount,
        isChatScreenActive,
        setIsChatScreenActive,
        selectedChatTab,
        setSelectedChatTab,
        selectedDirectUser,
        setSelectedDirectUser,
        markChatAsRead,
        sendMessage,
        sendVoiceMessage,
        sendImageMessage,
        addReaction,
        togglePinMessage,
        deleteMessage,
        startCall,
        acceptIncomingCall,
        rejectIncomingCall,
        joinCall,
        endCall,
        toggleMute,
        toggleVideo,
        toggleSpeaker,
        toggleCameraFacing,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
