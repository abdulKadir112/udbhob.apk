import React, { useState } from 'react';
import { Bell, Mic, Camera, MapPin, ShieldCheck, CheckCircle2, Smartphone, Sparkles } from 'lucide-react';
import { requestAllCorePermissions, sendTestPushNotification } from '../utils/pushNotification';

interface PermissionPromptModalProps {
  onComplete: () => void;
  isBn?: boolean;
}

export const PermissionPromptModal: React.FC<PermissionPromptModalProps> = ({
  onComplete,
  isBn = true,
}) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleAllowAll = async () => {
    setIsRequesting(true);
    try {
      // Requests Notification, Microphone, Camera, and Location all together at once in 1 click
      const result = await requestAllCorePermissions();
      if (result.notification === 'granted') {
        try {
          await sendTestPushNotification(isBn);
        } catch {}
      }
      try {
        localStorage.setItem('probashi_permissions_prompted', 'true');
        localStorage.setItem('probashi_permissions_completed', 'true');
      } catch {}
    } catch (e) {
      console.warn('Permissions request error:', e);
    } finally {
      setIsRequesting(false);
      onComplete();
    }
  };

  const handleSkip = () => {
    try {
      localStorage.setItem('probashi_permissions_prompted', 'true');
    } catch {}
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white text-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-5 sm:p-6 text-center animate-scaleUp">
        {/* Animated Icons Group (Bell, Mic, Camera, MapPin) */}
        <div className="mx-auto flex items-center justify-center gap-2 mb-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-[#00a884] shadow-md animate-bounce">
            <Bell className="w-6 h-6" />
          </div>
          <div className="w-11 h-11 rounded-2xl bg-teal-100 border-2 border-teal-300 flex items-center justify-center text-teal-700 shadow-sm">
            <Mic className="w-5 h-5" />
          </div>
          <div className="w-11 h-11 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-sky-700 shadow-sm">
            <Camera className="w-5 h-5" />
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 shadow-sm">
            <MapPin className="w-5 h-5" />
          </div>
        </div>

        {/* Header */}
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {isBn ? 'প্রয়োজনীয় ৪টি পারমিশন অনুমোদন:' : 'App Access & 4 Core Permissions:'}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
          {isBn
            ? 'ফোন লকে কল পাওয়া, ভয়েস বার্তা, ভিডিও কল ও ফান্ড সিকিউরিটির জন্য এক ক্লিকেই ৪টি পারমিশন অনুমোদন দিন।'
            : 'Allow notifications, mic, camera, and location in one click for instant lock-screen calls, voice notes & verified security.'}
        </p>

        {/* Feature Highlights - 4 Core Permissions */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 my-3.5 space-y-2 text-left text-2xs sm:text-xs text-slate-700">
          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <Bell className="w-3.5 h-3.5 text-emerald-700" />
            </div>
            <span>{isBn ? 'নোটিফিকেশন: ফোন লকে রিংটোন ও কিস্তি এলার্ট' : 'Notifications: Lock-screen call alerts & dues'}</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
              <Mic className="w-3.5 h-3.5 text-teal-700" />
            </div>
            <span>{isBn ? 'মাইক্রোফোন: ভয়েস মেসেজ ও অডিও কল' : 'Microphone: Voice notes & crystal-clear audio calls'}</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
              <Camera className="w-3.5 h-3.5 text-sky-700" />
            </div>
            <span>{isBn ? 'ক্যামেরা: গ্রুপ ভিডিও কল ও রসিদের ছবি' : 'Camera: Group video calls & receipt attachments'}</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
            </div>
            <span>{isBn ? 'লোকেশন: মেম্বারদের অবস্থান ও নিরাপদ ভেরিফিকেশন' : 'Location: Member region & secure verification'}</span>
          </div>
        </div>

        {/* Main Action Button */}
        <button
          id="btn-allow-initial-notifications"
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
            {isBn ? 'এক ক্লিকে ৪টি অনুমোদন দিন (Allow All)' : 'Allow All 4 Permissions (1-Click)'}
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
      </div>
    </div>
  );
};
