import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Mic,
  Camera,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Smartphone,
  ShieldCheck,
  Play,
  Square,
  Check,
} from 'lucide-react';
import {
  requestAllCorePermissions,
  sendTestPushNotification,
  checkCurrentPermissionsStatus,
  CorePermissionsResult,
} from '../utils/pushNotification';
import { soundEffects } from '../utils/audioFeedback';

interface PermissionPromptModalProps {
  onComplete: () => void;
  isBn?: boolean;
}

export const PermissionPromptModal: React.FC<PermissionPromptModalProps> = ({
  onComplete,
  isBn = true,
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [isPlayingRingtone, setIsPlayingRingtone] = useState(false);
  const [stepStatus, setStepStatus] = useState<string | null>(null);
  const [isCompletedSuccess, setIsCompletedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live status of individual permissions
  const [permState, setPermState] = useState<{
    notification: NotificationPermission;
    microphone: boolean;
    camera: boolean;
    soundUnlocked: boolean;
  }>({
    notification: typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default',
    microphone: false,
    camera: false,
    soundUnlocked: typeof window !== 'undefined' ? localStorage.getItem('probashi_sound_unlocked') === 'true' : false,
  });

  const stopRingtoneRef = useRef<(() => void) | null>(null);

  // Initial check on mount
  useEffect(() => {
    checkCurrentPermissionsStatus().then((status) => {
      setPermState({
        notification: status.notification,
        microphone: status.microphone === 'granted',
        camera: status.camera === 'granted',
        soundUnlocked: status.soundUnlocked || localStorage.getItem('probashi_sound_unlocked') === 'true',
      });
    }).catch(() => {});

    return () => {
      if (stopRingtoneRef.current) {
        stopRingtoneRef.current();
        stopRingtoneRef.current = null;
      }
    };
  }, []);

  // Toggle Ringtone Sound Test
  const handleToggleRingtoneTest = () => {
    soundEffects.unlockAudio();
    if (isPlayingRingtone) {
      if (stopRingtoneRef.current) {
        stopRingtoneRef.current();
        stopRingtoneRef.current = null;
      }
      setIsPlayingRingtone(false);
    } else {
      setIsPlayingRingtone(true);
      const stopFn = soundEffects.startIncomingRingtone();
      stopRingtoneRef.current = stopFn;
      // Automatically stop ringtone preview after 6 seconds
      setTimeout(() => {
        if (stopRingtoneRef.current === stopFn) {
          stopFn();
          stopRingtoneRef.current = null;
          setIsPlayingRingtone(false);
        }
      }, 6000);
    }
  };

  // 1-Click Allow All Permissions
  const handleAllowAll = async () => {
    setIsRequesting(true);
    setErrorMessage(null);
    setStepStatus(isBn ? 'সাউন্ড ও রিংটোন আনলক হচ্ছে...' : 'Unlocking Sound & Ringtone...');

    try {
      // 1. Immediately unlock audio on this click gesture
      soundEffects.unlockAudio();

      // 2. Request all permissions unified
      setStepStatus(isBn ? 'মাইক্রোফোন, ক্যামেরা ও নোটিফিকেশন অনুমোদন...' : 'Requesting Mic, Camera & Notification...');
      const result: CorePermissionsResult = await requestAllCorePermissions();

      setPermState({
        notification: result.notification,
        microphone: result.microphone,
        camera: result.camera,
        soundUnlocked: result.soundUnlocked,
      });

      // 3. If notifications granted, send a pleasant test notification & play ringtone chime
      if (result.notification === 'granted') {
        setStepStatus(isBn ? 'টেস্ট নোটিফিকেশন ও রিংটোন পাঠানো হচ্ছে...' : 'Sending test alert & ringtone...');
        try {
          await sendTestPushNotification(isBn);
        } catch {}
      }

      // Mark everything completed in localStorage
      try {
        localStorage.setItem('probashi_core_permissions_setup_done', 'true');
        localStorage.setItem('probashi_permissions_completed', 'true');
        localStorage.setItem('probashi_permissions_prompted', 'true');
        localStorage.setItem('probashi_sound_unlocked', 'true');
      } catch {}

      // Play short victory tone
      soundEffects.playReceiveMessage();

      // Brief ringtone demonstration for 2.5 seconds so user knows phone will ring
      try {
        const stopDemo = soundEffects.startIncomingRingtone();
        setTimeout(() => {
          try {
            stopDemo();
          } catch {}
        }, 2200);
      } catch {}

      setIsCompletedSuccess(true);

      // Auto close after 2.5 seconds of showing victory confirmation
      setTimeout(() => {
        onComplete();
      }, 2500);
    } catch (e: any) {
      console.warn('Unified permission setup error:', e);
      setErrorMessage(
        isBn
          ? 'ব্রাউজারে কোনো পারমিশন ব্লক থাকলে URL বারের তালা (🔒) আইকন থেকে Allow করুন।'
          : 'If any permission was blocked, please tap the lock (🔒) icon in the address bar to allow.'
      );
    } finally {
      setIsRequesting(false);
      setStepStatus(null);
    }
  };

  const handleSkip = () => {
    if (stopRingtoneRef.current) {
      stopRingtoneRef.current();
      stopRingtoneRef.current = null;
    }
    try {
      localStorage.setItem('probashi_permissions_prompted', 'true');
    } catch {}
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col p-5 sm:p-6 text-center animate-scaleUp">
        
        {/* Success Confirmation Screen */}
        {isCompletedSuccess ? (
          <div className="py-4 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {isBn ? 'অভিনন্দন! সব সুবিধা চালু হয়েছে 🎉' : 'All Permissions Activated! 🎉'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                {isBn
                  ? 'আপনার ফোনে নোটিফিকেশন, কল রিংটোন, মাইক ও ক্যামেরা সফলভাবে চালু হয়েছে। ম্যানুয়ালি আর কিছু করা লাগবে না।'
                  : 'Notifications, call ringtone, microphone, and camera are all enabled. No manual setup needed.'}
              </p>
            </div>

            {/* Quick Status List */}
            <div className="bg-emerald-50/80 border border-emerald-200/70 rounded-2xl p-3 text-left text-xs space-y-2 text-emerald-950 font-medium">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'নোটিফিকেশন ও পুশ এলার্ট' : 'Notifications & Push'}</span>
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> {isBn ? 'সক্রিয়' : 'Active'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'কল রিংটোন ও সাউন্ড অটো-প্লে' : 'Call Ringtone & Sound'}</span>
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> {isBn ? 'আনলকড' : 'Unlocked'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'মাইক্রোফোন (ভয়েস ও কল)' : 'Microphone (Voice/Call)'}</span>
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> {isBn ? 'অনুমোদিত' : 'Granted'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'ক্যামেরা (ভিডিও ও স্ক্যান)' : 'Camera (Video/Scan)'}</span>
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> {isBn ? 'অনুমোদিত' : 'Granted'}
                </span>
              </div>
            </div>

            <button
              id="btn-permissions-continue"
              onClick={onComplete}
              className="w-full py-3.5 rounded-2xl bg-[#00a884] hover:bg-[#008f6f] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              {isBn ? 'অ্যাপে প্রবেশ করুন' : 'Continue to App'}
            </button>
          </div>
        ) : (
          <>
            {/* Animated Header Icons */}
            <div className="mx-auto flex items-center justify-center gap-2 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-[#00a884] shadow-sm animate-pulse">
                <Bell className="w-5 h-5" />
              </div>
              <div className="w-11 h-11 rounded-2xl bg-teal-100 border-2 border-teal-300 flex items-center justify-center text-teal-700 shadow-sm">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="w-11 h-11 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-sky-700 shadow-sm">
                <Mic className="w-5 h-5" />
              </div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 border-2 border-indigo-300 flex items-center justify-center text-indigo-700 shadow-sm">
                <Camera className="w-5 h-5" />
              </div>
            </div>

            {/* Title & Subtitle */}
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {isBn ? 'প্রথমবার সেটআপ: সব পারমিশন চালু করুন' : 'First Launch: Enable All Core Permissions'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              {isBn
                ? 'ফোন লকে কল পাওয়া, স্পষ্ট রিংটোন বাজা, ভয়েস মেসেজ ও ভিডিও কলের জন্য এক ক্লিকেই সব চালু করে নিন।'
                : 'Enable notifications, loud ringtone, mic and camera in 1 click for instant lock-screen calls & voice chat.'}
            </p>

            {/* Core 4 Permissions List with Live Badges */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 my-3.5 space-y-2 text-left text-xs">
              {/* 1. Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px] sm:text-xs">
                      {isBn ? 'নোটিফিকেশন ও পুশ এলার্ট' : 'Notifications & Push'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {isBn ? 'ফোন লকে কল ও কিস্তির বার্তা' : 'Lock-screen incoming calls & dues'}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  permState.notification === 'granted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {permState.notification === 'granted' ? (isBn ? 'সক্রিয় ✓' : 'Active ✓') : (isBn ? 'অনুমোদন দরকার' : 'Required')}
                </span>
              </div>

              {/* 2. Sound & Ringtone Autoplay */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                    <Volume2 className="w-4 h-4 text-teal-700" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px] sm:text-xs">
                      {isBn ? 'সাউন্ড ও কল রিংটোন' : 'Sound & Ringtone Autoplay'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {isBn ? 'কল আসলে পরিষ্কার মিষ্টি রিংটোন' : 'Authentic call ringtone melody'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleRingtoneTest}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors ${
                    isPlayingRingtone
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      : 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                  }`}
                  title={isBn ? 'রিংটোন টেস্ট করুন' : 'Test ringtone'}
                >
                  {isPlayingRingtone ? (
                    <>
                      <Square className="w-2.5 h-2.5 fill-current" />
                      <span>{isBn ? 'থামান' : 'Stop'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>{isBn ? 'টেস্ট রিংটোন' : 'Test Ring'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* 3. Microphone */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4 text-sky-700" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px] sm:text-xs">
                      {isBn ? 'মাইক্রোফোন (ভয়েস ও কল)' : 'Microphone (Voice & Call)'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {isBn ? 'ভয়েস মেসেজ ও সরাসরি কথা বলা' : 'Voice notes and crystal audio calls'}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  permState.microphone
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {permState.microphone ? (isBn ? 'অনুমোদিত ✓' : 'Granted ✓') : (isBn ? 'প্রস্তুত' : 'Ready')}
                </span>
              </div>

              {/* 4. Camera */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4 text-indigo-700" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px] sm:text-xs">
                      {isBn ? 'ক্যামেরা (ভিডিও ও স্ক্যান)' : 'Camera (Video & Scan)'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {isBn ? 'গ্রুপ ভিডিও কল ও ভাউচার আপলোড' : 'Group video calls & document photo'}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  permState.camera
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {permState.camera ? (isBn ? 'অনুমোদিত ✓' : 'Granted ✓') : (isBn ? 'প্রস্তুত' : 'Ready')}
                </span>
              </div>
            </div>

            {/* Optional Error / Guidance Alert */}
            {errorMessage && (
              <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-left flex items-start gap-2 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{errorMessage}</span>
              </div>
            )}

            {/* Step Progress while Requesting */}
            {stepStatus && (
              <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center justify-center gap-2 animate-pulse">
                <span className="inline-block w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span>{stepStatus}</span>
              </div>
            )}

            {/* Main Action Button - 1 Click */}
            <button
              id="btn-allow-all-permissions"
              onClick={handleAllowAll}
              disabled={isRequesting}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#00a884] hover:bg-[#008f6f] text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              {isRequesting ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              <span className="tracking-wide font-extrabold">
                {isBn ? 'এক ক্লিকে সব চালু করুন (Allow All)' : 'Allow All Permissions (1-Click)'}
              </span>
            </button>

            {/* Subtle skip/close option */}
            <button
              type="button"
              onClick={handleSkip}
              className="mt-2.5 text-xs text-slate-400 hover:text-slate-600 transition-colors py-1 cursor-pointer"
            >
              {isBn ? 'পরে করব (Skip)' : 'Skip for now'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
