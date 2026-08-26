import React from 'react';
import { Phone, PhoneOff, Video, Shield, User, Volume2, Sparkles } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const IncomingCallModal: React.FC = () => {
  const { incomingCall, acceptIncomingCall, rejectIncomingCall } = useChat();

  if (!incomingCall) return null;

  const isVideo = incomingCall.type === 'video';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-7 border border-emerald-500/40 shadow-2xl text-center relative overflow-hidden ring-4 ring-emerald-500/20">
        {/* Animated ambient glow */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-teal-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Top Call Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{isVideo ? '📹 ইনকামিং ভিডিও কল' : '📞 ইনকামিং অডিও কল'}</span>
        </div>

        {/* Caller Avatar with pulsing ripples */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4">
          <div className="absolute -inset-3 rounded-full bg-emerald-500/30 animate-ping opacity-75" />
          <div className="absolute -inset-6 rounded-full bg-emerald-500/15 animate-pulse" />
          <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-800 border-4 border-emerald-400 flex items-center justify-center text-3xl sm:text-4xl font-black text-white shadow-2xl relative overflow-hidden">
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
            <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center text-xs">
              {incomingCall.callerRole === 'admin' ? '🛡️' : '👤'}
            </span>
          </div>
        </div>

        {/* Caller Name & Info */}
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {incomingCall.callerName}
        </h3>
        
        <div className="flex items-center justify-center gap-2 mt-1 text-xs text-emerald-300 font-medium">
          {incomingCall.callerCountry && (
            <span className="flex items-center gap-1">
              <span>{incomingCall.callerCountryFlag || '🇸🇦'}</span>
              <span>{incomingCall.callerCountry}</span>
            </span>
          )}
          <span>•</span>
          <span>{incomingCall.callerRole === 'admin' ? 'এডমিন' : 'প্রবাসী সদস্য'}</span>
        </div>

        <p className="text-2xs text-slate-400 mt-2">
          {incomingCall.isGroup
            ? 'প্রবাসী মুক্ত ফান্ড গ্রুপ কল আসছে...'
            : 'সরাসরি যোগাযোগ করতে আপনাকে কল করছেন...'}
        </p>

        {/* Action Buttons: Decline / Accept */}
        <div className="flex items-center justify-center gap-6 mt-8">
          {/* Decline Button */}
          <button
            onClick={rejectIncomingCall}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transform group-hover:scale-105 transition-all">
              <PhoneOff className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <span className="text-xs font-bold text-rose-300">কেটে দিন</span>
          </button>

          {/* Accept Button */}
          <button
            onClick={acceptIncomingCall}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 transform group-hover:scale-105 transition-all animate-bounce">
              {isVideo ? <Video className="w-7 h-7 sm:w-8 sm:h-8" /> : <Phone className="w-7 h-7 sm:w-8 sm:h-8" />}
            </div>
            <span className="text-xs font-bold text-emerald-300">রিসিভ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
