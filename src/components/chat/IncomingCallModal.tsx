import React, { useEffect, useRef } from 'react';
import { Phone, PhoneOff, Video, Shield, User, Volume2, Sparkles, PhoneCall } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { soundEffects } from '../../utils/audioFeedback';
import { safeVibrate } from '../../utils/pushNotification';

export const IncomingCallModal: React.FC = () => {
  const { incomingCall, acceptIncomingCall, rejectIncomingCall } = useChat();
  const vibIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!incomingCall) {
      if (vibIntervalRef.current) clearInterval(vibIntervalRef.current);
      safeVibrate(0);
      return;
    }

    // Try to unlock and play ringtone immediately
    soundEffects.unlockAudio();

    // Safe continuous mobile vibration loop like WhatsApp / IMO
    safeVibrate([1000, 400, 1000, 400, 1500, 400, 2000]);
    vibIntervalRef.current = setInterval(() => {
      safeVibrate([1000, 400, 1000, 400, 1500, 400, 2000]);
    }, 7000);

    return () => {
      if (vibIntervalRef.current) clearInterval(vibIntervalRef.current);
      safeVibrate(0);
    };
  }, [incomingCall?.id]);

  if (!incomingCall) return null;

  const isVideo = incomingCall.type === 'video';

  const handleAccept = () => {
    soundEffects.unlockAudio();
    acceptIncomingCall();
  };

  const handleReject = () => {
    rejectIncomingCall();
  };

  return (
    <div 
      onClick={() => soundEffects.unlockAudio()}
      className="fixed inset-0 z-50 flex flex-col justify-between items-center p-6 sm:p-8 bg-gradient-to-b from-slate-950 via-[#061810] to-slate-950 text-white backdrop-blur-xl animate-fadeIn select-none overflow-hidden"
    >
      {/* Dynamic Animated Ambient Background Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-72 sm:w-80 h-72 sm:h-80 bg-teal-500/15 rounded-full blur-[90px] pointer-events-none animate-pulse delay-700" />

      {/* Top Bar: Call Type Badge & Fund Branding */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center pt-4 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold shadow-lg backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{isVideo ? '📹 ইনকামিং ভিডিও কল' : '📞 ইনকামিং অডিও কল'}</span>
        </div>
        <p className="text-2xs text-slate-400 mt-2 font-medium tracking-wide">
          উদ্ভব • প্রবাসী মুক্ত ফান্ড
        </p>
      </div>

      {/* Center: Caller Avatar with Realistic Expanding Sonar Waves */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center my-auto z-10">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center mb-6">
          {/* Sonar Ring 1 */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-ping duration-1000" />
          {/* Sonar Ring 2 */}
          <div className="absolute -inset-4 rounded-full bg-emerald-500/15 animate-pulse duration-700" />
          {/* Sonar Ring 3 */}
          <div className="absolute -inset-8 rounded-full bg-teal-500/10 animate-pulse duration-1000" />

          {/* Avatar Container */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 border-4 border-emerald-400 flex items-center justify-center text-4xl sm:text-5xl font-black text-white shadow-2xl relative overflow-hidden ring-8 ring-emerald-500/20">
            {incomingCall.callerAvatar ? (
              <img
                src={incomingCall.callerAvatar}
                alt={incomingCall.callerName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span>{incomingCall.callerName.charAt(0)}</span>
            )}

            {/* Role Badge on Avatar */}
            <span className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-slate-950 border-2 border-emerald-400 flex items-center justify-center text-sm shadow-md">
              {incomingCall.callerRole === 'admin' ? '🛡️' : '👤'}
            </span>
          </div>
        </div>

        {/* Caller Identity */}
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight text-center px-4">
          {incomingCall.callerName}
        </h2>

        {/* Country & Status */}
        <div className="flex items-center justify-center gap-2 mt-2 text-sm text-emerald-300 font-semibold bg-slate-900/60 px-3.5 py-1 rounded-full border border-emerald-500/20">
          {incomingCall.callerCountry && (
            <span className="flex items-center gap-1.5">
              <span className="text-base">{incomingCall.callerCountryFlag || '🇸🇦'}</span>
              <span>{incomingCall.callerCountry}</span>
            </span>
          )}
          <span>•</span>
          <span>{incomingCall.callerRole === 'admin' ? 'এডমিন' : 'প্রবাসী সদস্য'}</span>
        </div>

        {/* Call description */}
        <p className="text-xs text-slate-300/80 mt-3 text-center animate-pulse">
          {incomingCall.isGroup
            ? 'প্রবাসী মুক্ত ফান্ড গ্রুপ কল আসছে...'
            : 'সরাসরি কথা বলতে আপনাকে কল করছেন...'}
        </p>
      </div>

      {/* Bottom Actions: WhatsApp / IMO style Big Glowing Decline & Answer Buttons */}
      <div className="w-full max-w-md mx-auto flex items-center justify-around gap-8 pb-4 z-10">
        {/* Decline Button */}
        <button
          onClick={handleReject}
          type="button"
          className="flex flex-col items-center gap-2 group cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-2xl shadow-rose-600/60 border-2 border-rose-400/50 transform group-hover:scale-105 transition-all">
            <PhoneOff className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <span className="text-xs font-bold text-rose-300">কেটে দিন</span>
        </button>

        {/* Accept Button with pulsating ring */}
        <button
          onClick={handleAccept}
          type="button"
          className="flex flex-col items-center gap-2 group cursor-pointer active:scale-95 transition-transform"
        >
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-emerald-400/40 animate-ping" />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/70 border-2 border-emerald-300 transform group-hover:scale-105 transition-all animate-bounce">
              {isVideo ? (
                <Video className="w-8 h-8 sm:w-10 sm:h-10 fill-white/20" />
              ) : (
                <Phone className="w-8 h-8 sm:w-10 sm:h-10 fill-white/20" />
              )}
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-300">রিসিভ করুন</span>
        </button>
      </div>
    </div>
  );
};

