import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send,
  Mic,
  Smile,
  Paperclip,
  Phone,
  Video,
  Search,
  MoreVertical,
  X,
  Check,
  CheckCheck,
  Play,
  Pause,
  Reply,
  Pin,
  Image as ImageIcon,
  Users,
  Building,
  Volume2,
  VolumeX,
  FileText,
  User,
  Shield,
  Sparkles,
  Camera,
  Coins,
  Bell,
  Trash2,
  Upload,
  Link as LinkIcon,
  ChevronDown,
  Globe,
  LogOut,
  Loader2,
  ArrowUpCircle,
  MessageSquare,
  UserCheck,
  Smartphone,
  Download,
  WifiOff,
  Wallet,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { safeVibrate } from '../../utils/pushNotification';
import { useFund } from '../../context/FundContext';
import { ChatMessage, CallType, UserPresence, UserRole, Member } from '../../types';
import { soundEffects } from '../../utils/audioFeedback';
import { ActiveMembersDrawer } from './ActiveMembersDrawer';
import { SwipeableMessageItem } from './SwipeableMessageItem';
import {
  requestNotificationPermission,
  sendTestPushNotification,
  sendTestIncomingCallAlert,
  getNotificationPermission,
  requestAllCorePermissions,
} from '../../utils/pushNotification';
import { PwaInstallModal } from '../PwaInstallModal';

interface WhatsAppChatViewProps {
  onNavigateToFund?: () => void;
  onOpenNotifications?: () => void;
  onOpenAuthModal?: () => void;
  onOpenProfileModal?: () => void;
  onOpenFundModal?: () => void;
  language?: 'bn' | 'en';
  setLanguage?: (lang: 'bn' | 'en') => void;
  onSelectMember?: (member: Member) => void;
}

const QUICK_CHIPS = [
  'আসসালামু আলাইকুম 🌸',
  'চলতি মাসের ফান্ড জমা দিয়েছি 💵',
  'টাকা জমা দেওয়ার রসিদ দেখুন 📄',
  'এডমিন, জরুরি একটু কথা ছিল 📞',
  'খামার প্রকল্পের নতুন আপডেট কী? 🐮',
  'মাশাআল্লাহ, অনেক সুন্দর উদ্যোগ! 👏',
  'সবাই কেমন আছেন? দোয়া রইল 🤲',
  'জাজাকাল্লাহ খাইরান, ধন্যবাদ! ✨',
];

export const WhatsAppChatView: React.FC<WhatsAppChatViewProps> = ({
  onNavigateToFund,
  onOpenNotifications,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenFundModal,
  language = 'bn',
  setLanguage,
  onSelectMember,
}) => {
  const {
    messages,
    pinnedMessage,
    replyingTo,
    setReplyingTo,
    sendMessage,
    sendVoiceMessage,
    sendImageMessage,
    addReaction,
    togglePinMessage,
    deleteMessage,
    startCall,
    joinCall,
    runningGroupCall,
    activeCall,
    userPresences,
    onlineCount,
    markChatAsRead,
    selectedChatTab,
    setSelectedChatTab,
    selectedDirectUser,
    setSelectedDirectUser,
  } = useChat();

  const { currentMember, userSession, isAdmin, logout } = useAuth();
  const { currentFund, soundEnabled, setSoundEnabled, notifications, members } = useFund();

  const effectiveMember = useMemo(() => {
    return (
      currentMember ||
      (userSession?.memberId ? members.find((m) => m.id === userSession.memberId) : null) ||
      (userSession?.username ? members.find((m) => m.username === userSession.username) : null) ||
      (members.length > 0 ? members[0] : null)
    );
  }, [currentMember, userSession, members]);

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMembersDrawerOpen, setIsMembersDrawerOpen] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);

  // Pagination / Scroll up to load older messages
  const [visibleCount, setVisibleCount] = useState(30);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialMountRef = useRef(true);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isSlideCancelled, setIsSlideCancelled] = useState(false);
  const [slideOffset, setSlideOffset] = useState(0);
  const [showMicHoldHint, setShowMicHoldHint] = useState(false);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const touchStartXRef = useRef<number>(0);
  const recordingStartTimeRef = useRef<number>(0);
  const isHoldPressingRef = useRef<boolean>(false);

  // Playing voice notes state
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voiceProgress, setVoiceProgress] = useState<number>(0);
  const voiceStopFnRef = useRef<(() => void) | null>(null);

  // Notification & Lock Screen status state
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });
  const [isNotifBannerDismissed, setIsNotifBannerDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('probashi_permissions_prompted') === 'true';
    }
    return false;
  });
  const [isTestingNotif, setIsTestingNotif] = useState(false);

  // PWA Install state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isPwaInstallModalOpen, setIsPwaInstallModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone)
    ) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsAppInstalled(true);
          setDeferredPrompt(null);
        }
      } catch (err) {
        setIsPwaInstallModalOpen(true);
      }
    } else {
      setIsPwaInstallModalOpen(true);
    }
  };

  const handleEnableNotifications = async () => {
    setIsTestingNotif(true);
    try {
      // Simultaneously requests Notification, Microphone, and Camera permissions together!
      const result = await requestAllCorePermissions();
      setNotifPermission(result.notification);
      if (result.notification === 'granted') {
        await sendTestPushNotification(isBn);
      }
    } catch (e) {
      console.warn('Unified permission request error:', e);
    } finally {
      setIsTestingNotif(false);
    }
  };

  // File and photo upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [customImageCaption, setCustomImageCaption] = useState('');
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const myId = userSession?.uid || currentMember?.id || (isAdmin ? 'admin_master_001' : '');
  const isBn = language === 'bn';
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert(isBn ? 'ছবির সাইজ সর্বোচ্চ ৪ মেগাবাইট হতে হবে' : 'Image size must be under 4MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const directTarget = selectedChatTab === 'direct' && selectedDirectUser ? { recipientId: selectedDirectUser.id, recipientName: selectedDirectUser.name } : undefined;
        sendImageMessage(dataUrl, customImageCaption || (isBn ? 'ছবি সংযুক্ত' : 'Photo Attached'), directTarget);
        setIsAttachmentMenuOpen(false);
        setCustomImageCaption('');
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendCustomUrl = () => {
    if (!customImageUrl.trim()) return;
    const directTarget = selectedChatTab === 'direct' && selectedDirectUser ? { recipientId: selectedDirectUser.id, recipientName: selectedDirectUser.name } : undefined;
    sendImageMessage(customImageUrl.trim(), customImageCaption.trim() || (isBn ? 'প্রকল্পের ছবি' : 'Project Photo'), directTarget);
    setCustomImageUrl('');
    setCustomImageCaption('');
    setIsAttachmentMenuOpen(false);
  };

  // Mark all unread messages as read on mount or view
  useEffect(() => {
    markChatAsRead();
  }, []);

  // Filter messages by channel tab & search query
  const displayedMessages = useMemo(() => {
    let list = messages;

    if (selectedChatTab === 'direct' && selectedDirectUser) {
      // 1-to-1 filtered between me and selectedDirectUser
      list = messages.filter((m) => {
        if (!m.isDirect) return false;
        const matchWithTarget =
          (m.senderId === myId && m.recipientId === selectedDirectUser.id) ||
          (m.senderId === selectedDirectUser.id && (m.recipientId === myId || !m.recipientId));
        return matchWithTarget;
      });
    } else if (selectedChatTab === 'group') {
      // Group communications
      list = messages.filter((m) => !m.isDirect || !m.recipientId);
    }

    if (!searchQuery) return list;
    return list.filter(
      (m) =>
        m.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.senderName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [messages, selectedChatTab, selectedDirectUser, myId, searchQuery]);

  // Paginated visible messages (slice from the end)
  const visibleMessages = useMemo(() => {
    if (displayedMessages.length <= visibleCount) return displayedMessages;
    return displayedMessages.slice(-visibleCount);
  }, [displayedMessages, visibleCount]);

  const hasMoreMessages = displayedMessages.length > visibleCount;

  const scrollToBottom = (smooth: boolean = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  // Auto scroll on message additions
  useEffect(() => {
    if (isInitialMountRef.current) {
      scrollToBottom(false);
      isInitialMountRef.current = false;
    } else {
      if (chatScrollContainerRef.current) {
        const { scrollHeight, scrollTop, clientHeight } = chatScrollContainerRef.current;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        if (distanceFromBottom < 150) {
          scrollToBottom(true);
        }
      }
    }
  }, [displayedMessages.length]);

  // Load older messages on scroll near top
  const loadOlderMessages = () => {
    if (!hasMoreMessages || isLoadingOlder) return;
    setIsLoadingOlder(true);

    if (chatScrollContainerRef.current) {
      prevScrollHeightRef.current = chatScrollContainerRef.current.scrollHeight;
    }

    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 25, displayedMessages.length));
      setIsLoadingOlder(false);

      requestAnimationFrame(() => {
        if (chatScrollContainerRef.current) {
          const newScrollHeight = chatScrollContainerRef.current.scrollHeight;
          const diff = newScrollHeight - prevScrollHeightRef.current;
          chatScrollContainerRef.current.scrollTop += diff;
        }
      });
    }, 250);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop <= 40 && hasMoreMessages && !isLoadingOlder) {
      loadOlderMessages();
    }
  };

  // Voice recording engine (MediaRecorder real microphone audio capture)
  const startRecordingAudio = async (startX: number = 0) => {
    recordingStartTimeRef.current = Date.now();
    touchStartXRef.current = startX;
    isHoldPressingRef.current = true;
    setSlideOffset(0);
    setIsSlideCancelled(false);
    setIsRecording(true);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    safeVibrate(35);

    if (soundEnabled) {
      soundEffects.playRecordStart();
    }

    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        let mimeType = 'audio/webm';
        if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function') {
          if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            mimeType = 'audio/webm;codecs=opus';
          } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
          } else if (MediaRecorder.isTypeSupported('audio/aac')) {
            mimeType = 'audio/aac';
          } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
            mimeType = 'audio/ogg;codecs=opus';
          }
        }

        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.start(250);
      }
    } catch (err: any) {
      console.warn('Microphone access unavailable or denied:', err);
    }
  };

  const cancelRecordingAudio = () => {
    setIsRecording(false);
    setIsSlideCancelled(false);
    setSlideOffset(0);
    isHoldPressingRef.current = false;

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      } catch {
        // ignore
      }
      mediaRecorderRef.current = null;
    }
    audioChunksRef.current = [];
  };

  const finishRecordingAudio = async () => {
    if (!isRecording && !isHoldPressingRef.current) return;
    const duration = Math.max(1, recordingSeconds);

    setIsRecording(false);
    setIsSlideCancelled(false);
    setSlideOffset(0);
    isHoldPressingRef.current = false;

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (soundEnabled) {
      soundEffects.playRecordStop();
    }

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          recorder.stream.getTracks().forEach((track) => track.stop());

          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const directTarget =
              selectedChatTab === 'direct' && selectedDirectUser
                ? { recipientId: selectedDirectUser.id, recipientName: selectedDirectUser.name }
                : undefined;
            sendVoiceMessage(duration, dataUrl, directTarget);
          };
          reader.readAsDataURL(audioBlob);
        } catch {
          const directTarget =
            selectedChatTab === 'direct' && selectedDirectUser
              ? { recipientId: selectedDirectUser.id, recipientName: selectedDirectUser.name }
              : undefined;
          sendVoiceMessage(duration, undefined, directTarget);
        }
      };
      recorder.stop();
    } else {
      const directTarget =
        selectedChatTab === 'direct' && selectedDirectUser
          ? { recipientId: selectedDirectUser.id, recipientName: selectedDirectUser.name }
          : undefined;
      sendVoiceMessage(duration, undefined, directTarget);
    }
  };

  // Voice Note Play/Pause with audio waveforms
  const handleTogglePlayVoice = (msgId: string, duration: number = 8, audioDataUrl?: string) => {
    if (playingVoiceId === msgId) {
      if (voiceStopFnRef.current) {
        voiceStopFnRef.current();
        voiceStopFnRef.current = null;
      }
      setPlayingVoiceId(null);
      setVoiceProgress(0);
      return;
    }

    if (voiceStopFnRef.current) {
      voiceStopFnRef.current();
      voiceStopFnRef.current = null;
    }

    setPlayingVoiceId(msgId);
    setVoiceProgress(0);

    const stop = soundEffects.playVoiceNote(
      audioDataUrl,
      duration,
      (progress) => setVoiceProgress(progress),
      () => {
        setPlayingVoiceId(null);
        setVoiceProgress(0);
        voiceStopFnRef.current = null;
      }
    );

    voiceStopFnRef.current = stop;
  };

  // Send text message handler
  const handleSend = () => {
    if (!inputText.trim()) return;
    const directTarget =
      selectedChatTab === 'direct' && selectedDirectUser
        ? { recipientId: selectedDirectUser.id, recipientName: selectedDirectUser.name }
        : undefined;
    sendMessage(
      inputText.trim(),
      replyingTo ? { id: replyingTo.id, senderName: replyingTo.senderName, text: replyingTo.text || '' } : undefined,
      directTarget
    );
    setInputText('');
    setReplyingTo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle release of hold across the window/document
  const handleReleaseHold = () => {
    if (!isHoldPressingRef.current && !isRecording) return;
    isHoldPressingRef.current = false;

    const elapsedMs = Date.now() - (recordingStartTimeRef.current || 0);

    if (isSlideCancelled) {
      cancelRecordingAudio();
    } else if (elapsedMs < 350) {
      // Tapped too briefly - cancel and inform user to hold
      cancelRecordingAudio();
      setShowMicHoldHint(true);
      setTimeout(() => setShowMicHoldHint(false), 2400);
    } else {
      // Held to record - release to send automatically!
      finishRecordingAudio();
      safeVibrate(20);
    }
  };

  const handlePointerDragMove = (clientX: number) => {
    if (!isHoldPressingRef.current || !touchStartXRef.current) return;
    const diff = touchStartXRef.current - clientX;
    const offset = Math.max(0, Math.min(diff, 90));
    setSlideOffset(offset);

    if (diff > 55) {
      setIsSlideCancelled(true);
    } else {
      setIsSlideCancelled(false);
    }
  };

  // Window-level safety listeners to ensure 100% reliable release detection on mobile/PWA/web
  useEffect(() => {
    if (!isRecording) return;

    const onWindowPointerMove = (e: PointerEvent) => {
      handlePointerDragMove(e.clientX);
    };

    const onWindowTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerDragMove(e.touches[0].clientX);
      }
    };

    const onWindowPointerUp = () => {
      handleReleaseHold();
    };

    const onWindowTouchEnd = () => {
      handleReleaseHold();
    };

    window.addEventListener('pointermove', onWindowPointerMove);
    window.addEventListener('touchmove', onWindowTouchMove, { passive: true });
    window.addEventListener('pointerup', onWindowPointerUp);
    window.addEventListener('touchend', onWindowTouchEnd);
    window.addEventListener('pointercancel', onWindowPointerUp);
    window.addEventListener('touchcancel', onWindowTouchEnd);

    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('touchmove', onWindowTouchMove);
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('touchend', onWindowTouchEnd);
      window.removeEventListener('pointercancel', onWindowPointerUp);
      window.removeEventListener('touchcancel', onWindowTouchEnd);
    };
  }, [isRecording, isSlideCancelled]);

  // Voice Hold-to-Record & Release-to-Send handlers on the Mic button
  const handleMicPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    startRecordingAudio(e.clientX);
  };

  const handleMicTouchStart = (e: React.TouchEvent) => {
    const clientX = e.touches[0]?.clientX || 0;
    startRecordingAudio(clientX);
  };

  const handleMicTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handlePointerDragMove(e.touches[0].clientX);
    }
  };

  const handleMicTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleReleaseHold();
  };

  // Find direct user live presence
  const currentDirectPresence = useMemo(() => {
    if (!selectedDirectUser) return null;
    return userPresences.find((p) => p.id === selectedDirectUser.id) || null;
  }, [selectedDirectUser, userPresences]);

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-[#efeae2] shadow-xl overflow-hidden relative border-x border-slate-200">
      {/* 1. TOP HEADER (WHATSAPP COMMUNITY BRANDING) */}
      <div className="bg-[#005c4b] text-white px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between shadow-md z-30 shrink-0 select-none">
        {/* Left: Group/Direct User Avatar & Info */}
        <div
          onClick={() => setIsMembersDrawerOpen(true)}
          className="flex items-center space-x-2 sm:space-x-2.5 cursor-pointer hover:opacity-95 transition-opacity min-w-0 pr-1"
          title="গ্রুপ সদস্য ও বিস্তারিত তথ্য দেখুন"
        >
          <div className="relative shrink-0">
            {selectedChatTab === 'direct' && selectedDirectUser ? (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-800 border-2 border-emerald-300 flex items-center justify-center font-bold text-white shadow-xs text-xs sm:text-sm overflow-hidden">
                {selectedDirectUser.avatar ? (
                  <img
                    src={selectedDirectUser.avatar}
                    alt={selectedDirectUser.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span>{selectedDirectUser.name.charAt(0)}</span>
                )}
              </div>
            ) : currentFund?.logoUrl || currentFund?.avatarUrl ? (
              <img
                src={currentFund.logoUrl || currentFund.avatarUrl}
                alt={currentFund.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-emerald-400 shadow-xs"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-800 border-2 border-emerald-400 flex items-center justify-center font-bold text-white shadow-xs text-xs sm:text-sm">
                {(currentFund?.name || 'প্রবাসী').charAt(0)}
              </div>
            )}
            {/* Live Green Online Dot */}
            <span
              className={`absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border-2 border-[#005c4b] ring-1 ${
                selectedChatTab === 'direct' && currentDirectPresence
                  ? currentDirectPresence.isOnline
                    ? 'bg-emerald-400 ring-emerald-300'
                    : 'bg-slate-400 ring-slate-300'
                  : 'bg-emerald-400 ring-emerald-300'
              }`}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-1">
              <h2 className="text-[12px] sm:text-[14px] font-bold text-white tracking-tight truncate max-w-[120px] xs:max-w-[170px] sm:max-w-none">
                {selectedChatTab === 'direct' && selectedDirectUser
                  ? selectedDirectUser.name
                  : currentFund?.name || 'প্রবাসী মুক্ত ফান্ড'}
              </h2>
              <span className="text-[8px] sm:text-[9px] px-1 py-0.2 rounded bg-emerald-700/90 text-emerald-100 font-semibold hidden xs:inline shrink-0">
                {selectedChatTab === 'direct'
                  ? selectedDirectUser?.role === 'admin'
                    ? 'এডমিন'
                    : 'প্রবাসী সদস্য'
                  : 'অফিসিয়াল'}
              </span>
            </div>
            <p className="text-[9.5px] sm:text-[11px] text-emerald-100/90 flex items-center gap-1 mt-0.5 truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse shrink-0" />
              <span className="truncate">
                {selectedChatTab === 'direct' && currentDirectPresence
                  ? currentDirectPresence.isOnline
                    ? 'অনলাইনে আছেন'
                    : currentDirectPresence.customStatus || 'সক্রিয় ছিলেন'
                  : `${userPresences.length} সদস্য • ${onlineCount} সক্রিয়`}
              </span>
            </p>
          </div>
        </div>

        {/* Right Action Tools: Video Call, Audio Call, Search, Fund Switcher, Notifications, Profile */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
          {/* Video Call */}
          <button
            id="btn-group-video-call"
            onClick={() => {
              if (selectedChatTab === 'direct' && selectedDirectUser) {
                startCall('video', false, selectedDirectUser);
              } else {
                startCall('video', true);
              }
            }}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
            title={selectedChatTab === 'direct' && selectedDirectUser ? `${selectedDirectUser.name}-কে ভিডিও কল করুন` : 'গ্রুপ ভিডিও কল'}
          >
            <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Audio Call */}
          <button
            id="btn-group-audio-call"
            onClick={() => {
              if (selectedChatTab === 'direct' && selectedDirectUser) {
                startCall('audio', false, selectedDirectUser);
              } else {
                startCall('audio', true);
              }
            }}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
            title={selectedChatTab === 'direct' && selectedDirectUser ? `${selectedDirectUser.name}-কে অডিও কল করুন` : 'গ্রুপ অডিও কল'}
          >
            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-1.5 sm:p-2 rounded-full transition-colors cursor-pointer ${
              isSearchOpen ? 'bg-white/20 text-white' : 'hover:bg-white/15 text-white'
            }`}
            title="বার্তা খুঁজুন"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Install App Button (PWA 1-Click Install to Phone Home Screen) */}
          <button
            id="btn-install-pwa-header"
            onClick={handleInstallApp}
            className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full font-bold text-[10.5px] sm:text-xs shadow-xs transition-all cursor-pointer shrink-0 ${
              isAppInstalled
                ? 'bg-emerald-800/90 text-emerald-200 hover:bg-emerald-700'
                : 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950 animate-pulse ring-1 ring-white/50'
            }`}
            title={isBn ? 'ফোনের হোম স্ক্রিনে অ্যাপ ইনস্টল করুন' : 'Install PWA App to Home Screen'}
          >
            <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">
              {isAppInstalled ? (isBn ? 'ইনস্টলড ✓' : 'Installed ✓') : (isBn ? 'ইনস্টল অ্যাপ' : 'Install App')}
            </span>
          </button>

          {/* Switch to Fund Tab Button */}
          {onNavigateToFund && (
            <button
              onClick={onNavigateToFund}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-[10.5px] sm:text-xs shadow-xs transition-all cursor-pointer shrink-0"
              title="ফান্ড ড্যাশবোর্ড, সঞ্চয় চার্ট ও বিনিয়োগ দেখুন"
            >
              <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-900" />
              <span>{isBn ? 'আপনার ফান্ড' : 'Your Fund'}</span>
            </button>
          )}

          {/* Notification Bell */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative p-1.5 sm:p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
              title="বিজ্ঞপ্তি"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-1 ring-white" />
              )}
            </button>
          )}

          {/* User Profile Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-800 border border-emerald-400/80 flex items-center justify-center text-white font-bold text-[11px] sm:text-xs hover:ring-2 hover:ring-white/40 transition-all cursor-pointer shrink-0 overflow-hidden"
              title="প্রোফাইল মেনু"
            >
              {currentMember?.avatarUrl ? (
                <img
                  src={currentMember.avatarUrl}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                (currentMember?.nameBn || currentMember?.name || userSession?.displayName || 'স').charAt(0)
              )}
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 text-slate-800"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/60 rounded-t-2xl">
                  <p className="text-[12px] font-bold text-slate-900 truncate">
                    {currentMember?.nameBn || currentMember?.name || userSession?.displayName || 'সদস্য'}
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <span>{currentMember?.countryFlag || '🌐'}</span>
                    <span>{currentMember?.country || 'প্রবাসী'}</span>
                    <span className="mx-1">•</span>
                    <span className="font-semibold text-emerald-700">
                      {isAdmin ? (isBn ? 'এডমিন' : 'Admin') : (isBn ? 'সদস্য' : 'Member')}
                    </span>
                  </p>
                </div>

                {/* 1. My Personal Profile & Financial Stats */}
                {onOpenProfileModal && (
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenProfileModal();
                    }}
                    className="w-full text-left px-3 py-2 text-[11px] text-emerald-950 hover:bg-emerald-50 flex items-center justify-between font-bold bg-emerald-50/60 border-b border-emerald-100/70"
                  >
                    <span className="flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isBn ? 'আমার প্রোফাইল ও আর্থিক হিসাব' : 'My Profile & Financial Stats'}</span>
                    </span>
                    <span className="text-3xs bg-emerald-600 text-white px-1.5 py-0.2 rounded font-extrabold">
                      {isBn ? 'শেয়ার ও লাভ' : 'Stats'}
                    </span>
                  </button>
                )}

                {/* 2. Direct 12-Month Statement & Slip */}
                {effectiveMember && onSelectMember && (
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onSelectMember(effectiveMember);
                    }}
                    className="w-full text-left px-3 py-2 text-[11px] text-slate-800 hover:bg-slate-50 flex items-center justify-between font-medium border-b border-slate-100"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isBn ? '১২ মাসের সঞ্চয় ও রসিদ স্লিপ' : '12-Month Statement Slip'}</span>
                    </span>
                    <span className="text-3xs text-amber-800 bg-amber-100 px-1 py-0.2 rounded font-bold">
                      {isBn ? 'রশিদ' : 'Slip'}
                    </span>
                  </button>
                )}

                {onOpenProfileModal && (
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenProfileModal();
                    }}
                    className="w-full text-left px-3 py-2 text-[11px] text-emerald-800 hover:bg-emerald-50 flex items-center gap-1.5 font-semibold"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isBn ? 'প্রোফাইল সেটিংস ও ছবি পরিবর্তন' : 'Edit Profile & Avatar'}</span>
                  </button>
                )}

                {isAdmin && onOpenFundModal && (
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenFundModal();
                    }}
                    className="w-full text-left px-3 py-2 text-[11px] text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 font-medium"
                  >
                    <Building className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isBn ? 'ফান্ডের লোগো ও তথ্য পরিবর্তন' : 'Edit Fund Logo & Info'}</span>
                  </button>
                )}

                {/* Sound Toggle */}
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="w-full text-left px-3 py-2 text-[11px] text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    {soundEnabled ? (
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{isBn ? 'শব্দ / অডিও ইফেক্ট' : 'Sound Effects'}</span>
                  </span>
                  <span className={`text-[10px] font-bold ${soundEnabled ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {soundEnabled ? (isBn ? 'চালু' : 'ON') : (isBn ? 'বন্ধ' : 'OFF')}
                  </span>
                </button>

                {/* Install PWA App to Home Screen */}
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    handleInstallApp();
                  }}
                  className="w-full text-left px-3 py-2 text-[11px] text-emerald-800 hover:bg-emerald-50 flex items-center justify-between border-t border-slate-100 font-semibold"
                >
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isBn ? 'ফোনে অ্যাপ ইনস্টল করুন' : 'Install App to Phone'}</span>
                  </span>
                  <span className={`text-[10px] font-bold ${isAppInstalled ? 'text-emerald-700' : 'text-amber-600'}`}>
                    {isAppInstalled ? (isBn ? 'ইনস্টলড ✓' : 'Installed ✓') : (isBn ? 'ইনস্টল' : 'Install')}
                  </span>
                </button>

                {/* Lock-Screen Notification Prompt / Test */}
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('probashi_open_permissions_modal'));
                    } else {
                      handleEnableNotifications();
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-[11px] text-slate-700 hover:bg-slate-50 flex items-center justify-between border-t border-slate-100"
                >
                  <span className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isBn ? 'নোটিফিকেশন, রিংটোন, মাইক ও ক্যামেরা' : 'Alerts, Ringtone, Mic & Camera'}</span>
                  </span>
                  <span className={`text-[10px] font-bold ${notifPermission === 'granted' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {notifPermission === 'granted' ? (isBn ? 'সক্রিয় ✓' : 'Active ✓') : (isBn ? 'অনুমতি দিন' : 'Enable')}
                  </span>
                </button>

                {onOpenAuthModal && (
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenAuthModal();
                    }}
                    className="w-full text-left px-3 py-2 text-[11px] text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isBn ? 'অ্যাকাউন্ট পরিবর্তন করুন' : 'Switch Account'}</span>
                  </button>
                )}

                <button
                  onClick={async () => {
                    setIsProfileMenuOpen(false);
                    await logout();
                  }}
                  className="w-full text-left px-3 py-2 text-[11px] text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 border-t border-slate-100"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>{isBn ? 'লগআউট' : 'Sign Out'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CHANNEL TABS: Group Chat vs 1-to-1 Direct Chat & Active Online Count */}
      <div className="bg-[#004f40] px-3 py-1.5 flex items-center justify-between border-t border-emerald-700/50 shadow-inner z-20 text-white">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Group Chat Button */}
          <button
            onClick={() => setSelectedChatTab('group')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedChatTab === 'group'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>গ্রুপ চ্যাট</span>
          </button>

          {/* 1-to-1 Direct Chat Button */}
          <button
            onClick={() => setSelectedChatTab('direct')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedChatTab === 'direct'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>১-টু-১ চ্যাট {selectedDirectUser ? `(${selectedDirectUser.name})` : ''}</span>
          </button>
        </div>

        {/* View Active Members Drawer Button */}
        <button
          onClick={() => setIsMembersDrawerOpen(true)}
          className="px-2.5 py-1 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-2xs sm:text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          title="সদস্য তালিকা ও সক্রিয় স্ট্যাটাস দেখুন"
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>{isOnline ? `অনলাইন (${onlineCount})` : 'অফলাইন'}</span>
        </button>
      </div>

      {/* Offline PWA indicator banner */}
      {!isOnline && (
        <div className="bg-amber-700 text-amber-50 text-[11px] px-3 py-1.5 flex items-center justify-between font-medium shadow-xs z-20 shrink-0 border-b border-amber-800">
          <div className="flex items-center space-x-1.5">
            <WifiOff className="w-3.5 h-3.5 text-amber-200 animate-pulse shrink-0" />
            <span>
              {isBn
                ? 'অফলাইন মোড সক্রিয় — পূর্বের সব এসএমএস, ভয়েস ও ছবি ব্রাউজ করা যাবে'
                : 'Offline Mode Active — All loaded messages, voice notes & images are cached'}
            </span>
          </div>
          <span className="text-[9.5px] bg-amber-900/80 px-2 py-0.5 rounded-full font-semibold shrink-0">
            PWA অফলাইন
          </span>
        </div>
      )}



      {/* 1-to-1 Direct Chat Selection Bar (When in Direct mode) */}
      {selectedChatTab === 'direct' && (
        <div className="bg-emerald-50 px-3 py-2 border-b border-emerald-200/80 flex items-center justify-between z-15 shrink-0 animate-fadeIn">
          {selectedDirectUser ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                  <span>সরাসরি চ্যাট:</span>
                  <span className="text-emerald-700">{selectedDirectUser.name}</span>
                </span>
                {selectedDirectUser.country && (
                  <span className="text-3xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                    {selectedDirectUser.country}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedDirectUser(null)}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline cursor-pointer"
              >
                সদস্য পরিবর্তন করুন
              </button>
            </div>
          ) : (
            <div className="w-full">
              <p className="text-xs font-bold text-emerald-950 mb-1.5 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>কাকে সরাসরি মেসেজ বা কল করতে চান? সদস্য নির্বাচন করুন:</span>
              </p>
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
                {userPresences
                  .filter((p) => p.id !== myId)
                  .map((presence) => (
                    <button
                      key={presence.id}
                      onClick={() =>
                        setSelectedDirectUser({
                          id: presence.id,
                          name: presence.name,
                          avatar: presence.avatar,
                          role: presence.role,
                          country: presence.country,
                        })
                      }
                      className="px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-200 text-xs text-slate-800 font-bold flex items-center gap-1.5 shrink-0 shadow-2xs transition-all cursor-pointer"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          presence.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                        }`}
                      />
                      <span>{presence.name}</span>
                      {presence.role === 'admin' && (
                        <span className="text-3xs text-emerald-700 font-extrabold">(এডমিন)</span>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optional Search Bar Row */}
      {isSearchOpen && (
        <div className="bg-white px-3 py-1.5 border-b border-slate-200 shadow-xs flex items-center space-x-2 z-20 shrink-0 animate-fadeIn">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বার্তায় বা সদস্যের নামে খুঁজুন..."
            className="flex-1 bg-transparent text-[11.5px] text-slate-900 focus:outline-hidden"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[10px] text-slate-500 hover:text-slate-700 px-1.5 py-0.5 rounded bg-slate-100"
            >
              মুছুন
            </button>
          )}
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
            }}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Ongoing Live Group Call Banner */}
      {runningGroupCall?.isLive && !activeCall && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-3 py-2 shadow-md flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping shrink-0" />
            <Phone className="w-3.5 h-3.5 text-emerald-100 animate-bounce" />
            <span className="text-[11px] sm:text-xs font-bold">
              লাইভ গ্রুপ কল চলছে ({runningGroupCall.participantsCount || 3} জন কথা বলছেন)
            </span>
          </div>
          <button
            id="btn-join-running-call"
            onClick={() => joinCall(runningGroupCall.type || 'audio')}
            className="px-3.5 py-1 bg-white text-emerald-800 hover:bg-emerald-50 rounded-full font-bold text-[11px] sm:text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <Phone className="w-3 h-3 text-emerald-600 fill-current" />
            <span>কলটিতে জয়েন করুন</span>
          </button>
        </div>
      )}

      {/* 2. Pinned Announcement Notice Bar */}
      {pinnedMessage && selectedChatTab === 'group' && (
        <div className="bg-emerald-900/95 text-white px-3 py-1.5 shadow-xs border-b border-emerald-800 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="w-5 h-5 rounded-md bg-emerald-700 flex items-center justify-center shrink-0">
              <Pin className="w-3 h-3 text-emerald-200" />
            </div>
            <div className="truncate">
              <span className="text-[9.5px] font-bold text-emerald-300 block">পিন করা নোটিশ:</span>
              <p className="text-[10.5px] text-emerald-100 truncate">{pinnedMessage.text}</p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => togglePinMessage(pinnedMessage.id)}
              className="text-emerald-300 hover:text-white text-[9.5px] underline ml-2 shrink-0 cursor-pointer"
            >
              আনপিন
            </button>
          )}
        </div>
      )}

      {/* 2.1 Background & Lock-Screen Call Notification, Mic & Camera Setup Banner */}
      {notifPermission !== 'granted' && !isNotifBannerDismissed && (
        <div className="bg-gradient-to-r from-amber-600 via-emerald-700 to-teal-800 text-white px-3 py-2 shadow-sm border-b border-emerald-600 flex items-center justify-between z-10 shrink-0 animate-fadeIn">
          <div
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('probashi_open_permissions_modal'));
              }
            }}
            className="flex items-center space-x-2 overflow-hidden mr-2 cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
              <Bell className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="text-[11px] leading-tight">
              <span className="font-bold block text-emerald-100">
                {isBn ? 'নোটিফিকেশন, রিংটোন, মাইক ও ক্যামেরা:' : 'Notifications, Ringtone, Mic & Camera:'}
              </span>
              <span className="text-white/90 text-[10px]">
                {isBn
                  ? 'ফোন লকে কল পাওয়া, মিষ্টি রিংটোন, ভয়েস ও ভিডিও কলের জন্য এক ক্লিকেই সব চালু করে নিন।'
                  : 'Enable lock-screen calls, ringtone, voice notes & video chat in one seamless click.'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              id="btn-enable-lockscreen-alerts"
              onClick={handleEnableNotifications}
              disabled={isTestingNotif}
              className="px-2.5 py-1 rounded-full bg-white text-emerald-950 font-bold text-[10px] sm:text-xs shadow hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              {isTestingNotif ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
              )}
              <span>{isBn ? 'সব এলাউ করুন (Allow All)' : 'Allow All'}</span>
            </button>
            <button
              onClick={() => setIsNotifBannerDismissed(true)}
              className="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10"
              title="বন্ধ করুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MESSAGES CHAT CANVAS */}
      {/* ========================================================================= */}
      <div
        ref={chatScrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar p-2.5 sm:p-4 space-y-2 relative"
        style={{
          backgroundImage: `radial-gradient(#cbd5e1 0.75px, transparent 0.75px)`,
          backgroundSize: '16px 16px',
        }}
      >
        {/* Load older messages indicator */}
        {hasMoreMessages && (
          <div className="flex justify-center my-1.5">
            {isLoadingOlder ? (
              <div className="bg-white/90 border border-slate-200 text-slate-700 text-[10px] px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 text-emerald-600 animate-spin" />
                <span>পূর্বের বার্তা লোড হচ্ছে...</span>
              </div>
            ) : (
              <button
                onClick={loadOlderMessages}
                className="bg-white/90 hover:bg-emerald-50 border border-slate-200 text-slate-600 hover:text-emerald-800 text-[10px] font-semibold px-3 py-1 rounded-full shadow-2xs flex items-center gap-1 transition-all cursor-pointer"
              >
                <ArrowUpCircle className="w-3 h-3 text-emerald-600" />
                <span>আরও আগের বার্তা দেখুন ({displayedMessages.length - visibleCount}টি বাকি)</span>
              </button>
            )}
          </div>
        )}

        {/* Security Notice Pill */}
        <div className="flex justify-center my-1.5">
          <div className="bg-[#ffeecd] border border-[#f3d38c] text-[#54656f] text-[10px] sm:text-[11px] px-3 py-1 rounded-xl shadow-2xs text-center max-w-sm flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-amber-700 shrink-0" />
            <span>🔒 প্রবাসী মুক্ত ফান্ডের সকল বার্তা ও ভয়েস কল সুরক্ষিত ও রিয়েল-টাইমে সংরক্ষিত।</span>
          </div>
        </div>

        {/* Empty state when no messages */}
        {visibleMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100/90 text-emerald-700 flex items-center justify-center mb-3 shadow-2xs">
              <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              {selectedChatTab === 'direct'
                ? selectedDirectUser
                  ? `${selectedDirectUser.name}-এর সাথে ১-টু-১ চ্যাট`
                  : 'সরাসরি চ্যাট করতে উপরের তালিকা থেকে সদস্য বেছে নিন'
                : 'প্রবাসী মুক্ত ফান্ড চ্যাট রুমে স্বাগতম'}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 max-w-xs sm:max-w-sm mt-1 leading-relaxed">
              {selectedChatTab === 'direct'
                ? 'সরাসরি ব্যক্তিগত বার্তা, ভয়েস রেকর্ড অথবা অডিও/ভিডিও কল করুন।'
                : 'এখনো কোনো বার্তা নেই। সঞ্চয়, খামার বা তহবিলের যেকোনো পরামর্শ নিয়ে প্রথম বার্তা পাঠান বা ভয়েস রেকর্ড করুন।'}
            </p>
          </div>
        )}

        {/* Message Bubbles with Swipe to Reply */}
        {visibleMessages.map((msg) => {
          const isMe =
            msg.senderId === myId ||
            (isAdmin && msg.senderRole === 'admin');

          return (
            <SwipeableMessageItem
              key={msg.id}
              msg={msg}
              isMe={isMe}
              isAdmin={isAdmin}
              onReply={(m) => setReplyingTo(m)}
              onAddReaction={(id, emoji) => addReaction(id, emoji)}
              onTogglePin={(id) => togglePinMessage(id)}
              onDelete={(id) => deleteMessage(id)}
              onImageClick={(url) => setSelectedImagePreview(url)}
              playingVoiceId={playingVoiceId}
              voiceProgress={voiceProgress}
              onTogglePlayVoice={handleTogglePlayVoice}
            />
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Quick Suggestion Prompt Chips Bar */}
      <div className="bg-[#f0f2f5] px-3 py-1.5 border-t border-slate-200 overflow-x-auto no-scrollbar flex items-center space-x-2 shrink-0">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider shrink-0 flex items-center gap-1 bg-slate-200/80 px-2 py-0.5 rounded-md">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>দ্রুত বার্তা:</span>
        </span>
        {QUICK_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => setInputText(chip)}
            className="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-[11px] font-medium border border-slate-200 hover:border-emerald-300 transition-all shadow-2xs cursor-pointer active:scale-95 whitespace-nowrap"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* 5. Replying To Bar (if active) */}
      {replyingTo && (
        <div className="bg-slate-100 px-3 py-1.5 border-t border-slate-200 flex items-center justify-between z-10 shrink-0">
          <div className="border-l-3 border-emerald-600 pl-2">
            <span className="text-[10.5px] font-bold text-emerald-800 block">{replyingTo.senderName} কে উত্তর দিচ্ছেন</span>
            <p className="text-[10px] text-slate-600 truncate max-w-sm">{replyingTo.text || 'মিডিয়া ফাইল'}</p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 rounded-full text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* 6. Real Project Image Attachment Drawer */}
      {isAttachmentMenuOpen && (
        <div className="bg-white p-3 border-t border-slate-200 shadow-lg z-20 shrink-0 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? 'ছবি বা ভাউচার / রসিদ পাঠান' : 'Share Photo / Receipt'}</span>
            </span>
            <button
              onClick={() => setIsAttachmentMenuOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Upload from Gallery/Camera */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/60 transition-colors text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Upload className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800">
                  {isBn ? 'ডিভাইস বা ক্যামেরা থেকে ছবি তুলুন' : 'Upload from Device / Camera'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {isBn ? 'রসিদ, ভাউচার বা খামারের ছবি (সর্বোচ্চ ৪ এমবি)' : 'Photos, receipts, vouchers (up to 4MB)'}
                </p>
              </div>
            </button>

            {/* Direct Image URL Input */}
            <div className="p-2 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-1.5">
              <div className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <input
                  type="text"
                  placeholder={isBn ? 'ছবির অনলাইন লিঙ্ক (URL) দিন...' : 'Paste image URL...'}
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 text-slate-800"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder={isBn ? 'ছবির ক্যাপশন / বিবরণ (ঐচ্ছিক)...' : 'Caption (optional)...'}
                  value={customImageCaption}
                  onChange={(e) => setCustomImageCaption(e.target.value)}
                  className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleSendCustomUrl}
                  disabled={!customImageUrl.trim()}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  পাঠান
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. BOTTOM MESSAGE INPUT & VOICE RECORDING CONTROLS */}
      <div className="bg-[#f0f2f5] px-2 sm:px-3.5 py-2 sm:py-2.5 border-t border-slate-300 flex items-center z-20 shrink-0 select-none w-full max-w-full overflow-hidden box-border relative">
        {/* Quick Tap Hint Tooltip */}
        {showMicHoldHint && (
          <div className="absolute -top-10 right-4 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg border border-slate-700 flex items-center gap-1.5 animate-bounce z-40">
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <span>ভয়েস পাঠাতে চেপে ধরে রাখুন</span>
          </div>
        )}

        <div className="flex items-center space-x-1.5 sm:space-x-2 w-full max-w-full">
          {isRecording ? (
            // WhatsApp-style Active Recording Bar (While Holding)
            <div className="flex-1 min-w-0 bg-white rounded-2xl border border-rose-300 shadow-inner px-3 py-1.5 min-h-[44px] flex items-center justify-between overflow-hidden gap-2">
              {/* Left: Red blinker + Timer + Waveforms */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                <span className="text-xs sm:text-sm font-bold text-rose-600 font-mono">
                  {String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:
                  {String(recordingSeconds % 60).padStart(2, '0')}
                </span>
                {/* Waveform bars */}
                <div className="hidden xs:flex items-center space-x-0.5 h-3.5 ml-1">
                  {[40, 80, 100, 60, 90, 70, 45, 85].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-0.5 bg-rose-500 rounded-full animate-pulse"
                    />
                  ))}
                </div>
              </div>

              {/* Middle: Slide to cancel indicator (interactive with slide offset) */}
              <div
                style={{ transform: `translateX(-${slideOffset * 0.4}px)` }}
                className="flex-1 min-w-0 text-center transition-transform px-1"
              >
                <span
                  className={`text-2xs sm:text-xs font-semibold truncate block transition-colors ${
                    isSlideCancelled ? 'text-rose-600 font-bold animate-pulse' : 'text-slate-500'
                  }`}
                >
                  {isSlideCancelled ? '❌ ছেড়ে দিলে বাতিল হবে' : '👈 বামে স্লাইড করে বাতিল'}
                </span>
              </div>

              {/* Cancel Trash Icon */}
              <button
                type="button"
                onClick={cancelRecordingAudio}
                className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer shrink-0"
                title="রেকর্ড বাতিল"
              >
                <Trash2 className={`w-4 h-4 ${isSlideCancelled ? 'text-rose-600 animate-bounce' : 'text-slate-400'}`} />
              </button>
            </div>
          ) : (
            // Standard Text / Attachment Input Bar
            <>
              <div className="flex items-center space-x-0.5 sm:space-x-1 shrink-0">
                {/* Emoji button */}
                <button
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
                  title="ইমোজি"
                >
                  <Smile className="w-5 h-5" />
                </button>

                {/* Attachment button */}
                <button
                  onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                  className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
                  title="ছবি বা ফাইল সংযুক্ত করুন"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>

              {/* Input Box */}
              <div className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 shadow-2xs px-3 sm:px-4 py-1.5 sm:py-2 flex items-center min-h-[42px] sm:min-h-[46px] transition-all">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    selectedChatTab === 'direct' && selectedDirectUser
                      ? `${selectedDirectUser.name}-কে লিখুন...`
                      : 'একটি বার্তা লিখুন...'
                  }
                  className="w-full text-[13px] sm:text-[14px] text-slate-900 placeholder-slate-400 bg-transparent focus:outline-hidden leading-relaxed"
                />
              </div>
            </>
          )}

          {/* Right Action Button: Send text OR Hold-to-Record Mic */}
          {inputText.trim() && !isRecording ? (
            <button
              id="btn-chat-send"
              onClick={handleSend}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0"
              title="পাঠান"
            >
              <Send className="w-4.5 h-4.5 sm:w-5 sm:h-5 ml-0.5" />
            </button>
          ) : (
            <button
              id="btn-chat-mic"
              onPointerDown={handleMicPointerDown}
              onTouchStart={handleMicTouchStart}
              onTouchMove={handleMicTouchMove}
              onTouchEnd={handleMicTouchEnd}
              onContextMenu={(e) => e.preventDefault()}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full text-white flex items-center justify-center shadow-md transition-all cursor-pointer shrink-0 select-none ${
                isRecording
                  ? 'bg-rose-600 ring-8 ring-rose-400/40 scale-120 animate-pulse'
                  : 'bg-[#00a884] hover:bg-[#008f6f] active:scale-110'
              }`}
              title="চাপ দিয়ে ধরে রাখুন রেকর্ড করতে, ছেড়ে দিলে সাথে সাথে পাঠানো হবে"
            >
              <Mic className={`transition-transform ${isRecording ? 'w-5 h-5 scale-110' : 'w-4.5 h-4.5 sm:w-5 sm:h-5'}`} />
            </button>
          )}
        </div>
      </div>

      {/* Emoji Picker Popover */}
      {isEmojiPickerOpen && (
        <div className="absolute bottom-14 left-3 bg-white p-2 rounded-2xl shadow-xl border border-slate-200 z-30 flex items-center space-x-1.5 animate-fadeIn">
          {['👍', '❤️', '🤲', '👏', '🔥', '😂', '🌸', '🇧🇩', '🇸🇦', '🐮', '💵', '✅'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setInputText((prev) => prev + emoji);
                setIsEmojiPickerOpen(false);
              }}
              className="text-base sm:text-lg hover:scale-125 transition-transform p-1 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Full-screen Image Preview Modal */}
      {selectedImagePreview && (
        <div
          onClick={() => setSelectedImagePreview(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer animate-fadeIn"
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImagePreview}
              alt="Preview"
              className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setSelectedImagePreview(null)}
              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Active Members & Presence Drawer */}
      <ActiveMembersDrawer
        isOpen={isMembersDrawerOpen}
        onClose={() => setIsMembersDrawerOpen(false)}
      />

      {/* PWA Direct Installation & Guidance Modal */}
      <PwaInstallModal
        isOpen={isPwaInstallModalOpen}
        onClose={() => setIsPwaInstallModalOpen(false)}
        language={language}
      />
    </div>
  );
};
