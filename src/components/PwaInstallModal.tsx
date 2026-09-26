import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle,
  X,
  Share,
  PlusSquare,
  Sparkles,
  ShieldCheck,
  Bell,
  Monitor,
  Check,
  Mic,
  Camera,
  MapPin,
  PhoneCall,
  Volume2,
} from 'lucide-react';
import { useFund } from '../context/FundContext';
import {
  requestAllCorePermissions,
  sendTestPushNotification,
  sendTestIncomingCallAlert,
  scheduleLockScreenCallTest,
  scheduleLockScreenNotificationTest,
} from '../utils/pushNotification';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'bn' | 'en';
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const { currentFund } = useFund();
  const isBn = language === 'bn';

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'pc'>('android');
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [notifTesting, setNotifTesting] = useState(false);
  const [callTesting, setCallTesting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed as standalone
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Auto-detect OS
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setActiveTab('ios');
    } else if (/android/i.test(userAgent)) {
      setActiveTab('android');
    } else {
      setActiveTab('pc');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('probashi_open_permissions_modal'));
          }, 600);
        }
      }
    } else {
      // Prompt guidance according to active tab
    }
  };

  const handleRequestPushNotification = async () => {
    try {
      setNotifTesting(true);
      const res = await requestAllCorePermissions();
      setNotifPermission(res.notification);
      if (res.notification === 'granted') {
        await sendTestPushNotification(isBn);
        await scheduleLockScreenNotificationTest(3000, isBn);
      }
    } catch (e) {
      console.error('Unified permission error in PWA modal:', e);
    } finally {
      setNotifTesting(false);
    }
  };

  const handleTestLockScreenCall = async () => {
    try {
      setCallTesting(true);
      const res = await requestAllCorePermissions();
      setNotifPermission(res.notification);
      if (res.notification === 'granted') {
        // Arm the background Service Worker scheduler FIRST so it runs in background even if the screen turns off immediately
        await scheduleLockScreenCallTest(4000, isBn);

        // Visual UI countdown
        setCountdown(4);
        let count = 4;
        const timer = setInterval(() => {
          count -= 1;
          if (count <= 0) {
            clearInterval(timer);
            setCountdown(null);
            setCallTesting(false);
          } else {
            setCountdown(count);
          }
        }, 1000);
      } else {
        setCallTesting(false);
      }
    } catch (e) {
      console.error('Test call error:', e);
      setCallTesting(false);
      setCountdown(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[92vh] sm:max-h-[88vh] flex flex-col my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-4 sm:p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 pr-8">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white p-1 shadow-md shrink-0 flex items-center justify-center">
              <img src="/udbhob_logo.svg" alt="Udbhob" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-3xs uppercase tracking-wider font-bold bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-400/30 inline-block">
                PWA Mobile Web App
              </span>
              <h3 className="text-base sm:text-lg font-black mt-0.5 text-white leading-tight">
                {isBn ? 'মোবাইল অ্যাপ ইনস্টল ও নোটিফিকেশন' : 'Install Mobile App & Notifications'}
              </h3>
              <p className="text-2xs text-emerald-100/90 mt-0.5">
                {isBn ? 'প্লে-স্টোর ছাড়াই সরাসরি ফোনে ইনস্টল করে আসল অ্যাপের মতো ব্যবহার করুন।' : 'Install directly to your phone without app store.'}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto overscroll-contain">
          
          {/* Quick 1-Click Install Button if supported */}
          {deferredPrompt && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2.5">
              <div className="flex items-center justify-center gap-2 text-emerald-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>{isBn ? '১-ক্লিকে ইনস্টল উপলব্ধ আছে!' : '1-Click Direct Install Available!'}</span>
              </div>
              <button
                onClick={handleNativeInstall}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isBn ? 'ফোনে ইনস্টল করুন (Install Now)' : 'Install Now to Phone'}</span>
              </button>
            </div>
          )}

          {isInstalled && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900 font-semibold">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{isBn ? 'অ্যাপটি ইতোমধ্যে আপনার ডিভাইসে সফলভাবে ইনস্টল করা আছে!' : 'App is already installed on your device!'}</span>
            </div>
          )}

          {/* Device Tabs */}
          <div>
            <label className="block text-2xs font-bold uppercase text-slate-500 mb-2">
              {isBn ? 'আপনার ডিভাইস নির্বাচন করুন:' : 'Select Your Device:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pc')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'pc'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>PC / Laptop</span>
              </button>
            </div>
          </div>

          {/* Guide for Android */}
          {activeTab === 'android' && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>🤖</span>
                <span>{isBn ? 'অ্যান্ড্রয়েড ফোন (Chrome / Samsung Internet):' : 'Android Steps:'}</span>
              </h4>
              <ol className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-2xs flex items-center justify-center shrink-0 mt-0.5">১</span>
                  <span>{isBn ? 'ব্রাউজারের উপরের ডানদিকের তিনটি বিন্দুতে (⋮) চাপ দিন।' : 'Tap the three dots (⋮) menu at the top-right.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-2xs flex items-center justify-center shrink-0 mt-0.5">২</span>
                  <span>{isBn ? 'মেনু থেকে "Install app" অথবা "Add to Home screen" নির্বাচন করুন।' : 'Select "Install app" or "Add to Home screen".'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-2xs flex items-center justify-center shrink-0 mt-0.5">৩</span>
                  <span>{isBn ? '"Install" বা "Add" চাপলে অ্যাপটি ফোনের হোমস্ক্রিনে চলে আসবে।' : 'Tap "Install" to complete.'}</span>
                </li>
              </ol>
            </div>
          )}

          {/* 🛡️ Phone Safety & 24/7 Background Call Guarantee Card */}
          <div className="p-4 rounded-2xl bg-emerald-950/5 border border-emerald-500/30 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isBn ? '🛡️ ফোনের সুরক্ষা ও নিরবচ্ছিন্ন ব্যাকগ্রাউন্ড কল গ্যারান্টি' : '🛡️ Phone Safety & 24/7 Background Reliability'}</span>
            </div>

            <div className="space-y-2 text-slate-700 text-2xs leading-relaxed">
              <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-emerald-700 font-bold shrink-0">⚡</span>
                <p>
                  <strong>{isBn ? 'ফোনের ক্ষতি বা ব্যাটারি ড্রেন হবে না:' : 'Zero Phone Harm & Battery Safe:'}</strong>{' '}
                  {isBn
                    ? 'অ্যাপটি ব্যাকগ্রাউন্ডে অনর্থক ভারী প্রসেস বা ব্যাটারি খরচ করে না। ফোন স্লিপে থাকলে শক্তি খরচ শূন্য (0%)। শুধুমাত্র কোনো সদস্য কল বা কিস্তির নোটিফিকেশন পাঠালেই লাইটওয়েট ফায়ারবেস ক্লাউড মেসেজিং ফোনের সার্ভিস ওয়ার্কারকে সক্রিয় করে রিং বাজায়।'
                    : 'The app consumes zero battery when idle. When someone calls, lightweight Firebase Push awakens the service worker instantly.'}
                </p>
              </div>

              <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-emerald-700 font-bold shrink-0">🔒</span>
                <p>
                  <strong>{isBn ? 'কল শেষেই সেন্সর বন্ধ:' : 'Hardware Protection:'}</strong>{' '}
                  {isBn
                    ? 'কল কেটে দেওয়ামাত্রই ক্যামেরা ও মাইক্রোফোন পুরোপুরি স্টপ এবং বন্ধ হয়ে যায়। ফোনে অতিরিক্ত তাপ বা চার্জ শেষ হওয়ার কোনো সুযোগ নেই।'
                    : 'Camera and microphone hardware sensors are immediately terminated upon call end.'}
                </p>
              </div>

              <div className="flex items-start gap-2 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 text-amber-950">
                <span className="text-amber-700 font-bold shrink-0">📱</span>
                <div>
                  <p className="font-bold">
                    {isBn ? 'অ্যান্ড্রয়েড ফোনে লক-স্ক্রিন কল নিশ্চিত করার সেটিং:' : 'Android Setting for Lock-Screen Calls:'}
                  </p>
                  <p className="mt-0.5 text-slate-600">
                    {isBn
                      ? 'Xiaomi, Samsung, Vivo, Oppo ইত্যাদি ফোনে Settings > Apps > Udbhob এ গিয়ে Battery Saver কে "No restrictions" (সীমাহীন) এবং "Autostart" অন রাখুন যাতে ফোন লক থাকলেও কল ও নোটিফিকেশন মিস না হয়।'
                      : 'Set Battery to "Unrestricted" / "No restrictions" and enable "Autostart" so Android does not sleep the incoming call listener.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Guide for iOS */}
          {activeTab === 'ios' && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>🍎</span>
                <span>{isBn ? 'আইফোন / আইপ্যাড (Safari Browser):' : 'iPhone Safari Steps:'}</span>
              </h4>
              <ol className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-2xs flex items-center justify-center shrink-0 mt-0.5">১</span>
                  <span className="flex items-center gap-1">
                    {isBn ? 'সাফারি ব্রাউজারের নিচে শেয়ার বাটনে' : 'Tap Safari Share icon'}
                    <Share className="w-3.5 h-3.5 text-blue-600 inline shrink-0" />
                    {isBn ? 'চাপ দিন।' : '.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-2xs flex items-center justify-center shrink-0 mt-0.5">২</span>
                  <span className="flex items-center gap-1">
                    {isBn ? 'একটু নিচে স্ক্রোল করে' : 'Scroll down and tap'}
                    <strong className="text-slate-900">"Add to Home Screen"</strong>
                    <PlusSquare className="w-3.5 h-3.5 text-slate-700 inline shrink-0" />
                    {isBn ? 'এ চাপ দিন।' : '.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-2xs flex items-center justify-center shrink-0 mt-0.5">৩</span>
                  <span>{isBn ? 'উপরে ডানদিকের "Add" বাটনে চাপ দিলেই অ্যাপটি আপনার আইফোনে সেভ হয়ে যাবে।' : 'Tap "Add" in top-right to finish.'}</span>
                </li>
              </ol>
            </div>
          )}

          {/* Guide for PC */}
          {activeTab === 'pc' && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>💻</span>
                <span>{isBn ? 'কম্পিউটার (Chrome / Edge Browser):' : 'Desktop Steps:'}</span>
              </h4>
              <p className="text-slate-700">
                {isBn
                  ? 'ব্রাউজারের অ্যাড্রেস বারের (URL bar) একদম ডানপাশে "Install" আইকনটিতে ক্লিক করুন অথবা ৩-ডট মেনু থেকে "Install Udbhob" চাপুন।'
                  : 'Click the Install icon on the right side of the address bar, or from browser menu select "Install Udbhob".'}
              </p>
            </div>
          )}

          {/* Push Notifications, Mic, Camera & Location Setup Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center -space-x-1">
                  <span className="p-1 rounded-full bg-amber-500 text-white text-3xs"><Bell className="w-2.5 h-2.5" /></span>
                  <span className="p-1 rounded-full bg-emerald-600 text-white text-3xs"><Mic className="w-2.5 h-2.5" /></span>
                  <span className="p-1 rounded-full bg-teal-600 text-white text-3xs"><Camera className="w-2.5 h-2.5" /></span>
                  <span className="p-1 rounded-full bg-sky-600 text-white text-3xs"><MapPin className="w-2.5 h-2.5" /></span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  {isBn ? 'নোটিফিকেশন, মাইক, ক্যামেরা ও লোকেশন' : 'Notification, Mic, Camera & Location'}
                </h4>
              </div>
              <span className={`text-3xs font-bold px-2 py-0.5 rounded-full ${
                notifPermission === 'granted'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {notifPermission === 'granted' ? (isBn ? 'অনুমোদিত ✓' : 'Enabled ✓') : (isBn ? '১-ক্লিকে ৪টি অনুমোদন' : '1-Click 4 Permissions')}
              </span>
            </div>

            <p className="text-2xs text-slate-700 leading-relaxed">
              {isBn
                ? 'কিস্তির অ্যালার্ট, ভয়েস মেসেজ, লাইভ ভিডিও কল ও মেম্বার লোকেশন সিকিউরিটির জন্য এক ক্লিকেই ৪টি সুবিধা সক্রিয় করুন।'
                : 'Enable lock-screen fund alerts, voice messages, video calls & location security with a single permission click.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleRequestPushNotification}
                disabled={notifTesting}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {notifPermission === 'granted' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-200 stroke-[3]" />
                    <span>{isBn ? 'টেস্ট নোটিফিকেশন পাঠান' : 'Send Test Notification'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                    <span>{isBn ? 'সব পারমিশন এলাউ করুন' : 'Allow All Permissions'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleTestLockScreenCall}
                disabled={callTesting}
                className="py-2.5 px-3 bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {countdown !== null ? (
                  <span className="text-amber-300 animate-pulse font-extrabold">
                    {isBn ? `📞 ${countdown} সেকেন্ডে কল বাজবে — ফোন লক করুন!` : `📞 Ringing in ${countdown}s — Lock Phone!`}
                  </span>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-teal-200" />
                    <span>{isBn ? 'লক-স্ক্রিন ইনকামিং কল টেস্ট' : 'Test Lock-Screen Call'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
          >
            {isBn ? 'ঠিক আছে, বুঝেছি' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
