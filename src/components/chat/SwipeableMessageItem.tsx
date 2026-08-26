import React, { useState, useRef } from 'react';
import {
  Reply,
  Shield,
  Pin,
  CheckCheck,
  Check,
  Play,
  Pause,
  Trash2,
  Phone,
} from 'lucide-react';
import { ChatMessage } from '../../types';

const EMOJI_REACTIONS = ['👍', '❤️', '🤲', '👏', '🔥', '😂'];

interface SwipeableMessageItemProps {
  msg: ChatMessage;
  isMe: boolean;
  isAdmin: boolean;
  onReply: (msg: ChatMessage) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onTogglePin: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onImageClick: (url: string) => void;
  playingVoiceId: string | null;
  voiceProgress: number;
  onTogglePlayVoice: (msgId: string, duration?: number, audioDataUrl?: string) => void;
}

export const SwipeableMessageItem: React.FC<SwipeableMessageItemProps> = ({
  msg,
  isMe,
  isAdmin,
  onReply,
  onAddReaction,
  onTogglePin,
  onDelete,
  onImageClick,
  playingVoiceId,
  voiceProgress,
  onTogglePlayVoice,
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);

  const isPaymentAlert = msg.type === 'payment_alert';
  const isCallLog = msg.type === 'call_log';
  const isNotice = msg.type === 'notice';

  // Touch Handlers for WhatsApp-style Swipe to Reply
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isHorizontalSwipeRef.current = null;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartXRef.current;
    const deltaY = currentY - touchStartYRef.current;

    // Detect if horizontal gesture
    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        isHorizontalSwipeRef.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    if (isHorizontalSwipeRef.current) {
      // Only allow swipe right (or slight resistance left)
      if (deltaX > 0) {
        // Apply friction
        const offset = Math.min(deltaX * 0.55, 65);
        setTranslateX(offset);
      } else {
        setTranslateX(0);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);

    if (translateX >= 42) {
      // Trigger reply!
      onReply(msg);
      // Optional subtle haptic
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(15);
        } catch {
          // ignore
        }
      }
    }

    // Reset back smoothly
    setTranslateX(0);
    isHorizontalSwipeRef.current = null;
  };

  // 1. Call Log Bubble
  if (isCallLog) {
    return (
      <div className="flex justify-center my-1.5">
        <div className="bg-slate-800/90 text-slate-200 text-[10.5px] px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 border border-slate-700">
          <Phone className="w-3 h-3 text-emerald-400" />
          <span>{msg.text}</span>
          <span className="text-slate-400 text-[9px]">
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    );
  }

  // 2. Payment Verified Banner Card
  if (isPaymentAlert) {
    return (
      <div className="flex justify-center my-1.5 px-2">
        <div className="bg-emerald-50/95 border border-emerald-300 text-emerald-950 px-3.5 py-2 rounded-xl shadow-xs max-w-md w-full flex items-start space-x-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <CheckCheck className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9.5px] font-extrabold text-emerald-800 uppercase tracking-wider block">
              স্বয়ংক্রিয় সঞ্চয় যাচাই নোটিফিকেশন
            </span>
            <p className="text-[11.5px] font-semibold text-emerald-950 mt-0.5 leading-snug">{msg.text}</p>
            <span className="text-[9px] text-emerald-600 block mt-0.5">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Regular Message Bubble with Swipe-To-Reply and Touch Physics
  const replyIconOpacity = Math.min(translateX / 40, 1);
  const replyIconScale = 0.5 + Math.min(translateX / 80, 0.5);

  return (
    <div className={`relative flex flex-col group ${isMe ? 'items-end' : 'items-start'} my-0.5 sm:my-1`}>
      {/* Swipe to reply indicator badge behind the bubble */}
      <div
        className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-opacity duration-150 z-0"
        style={{
          opacity: replyIconOpacity,
          transform: `translateY(-50%) scale(${replyIconScale})`,
        }}
      >
        <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs">
          <Reply className="w-3 h-3" />
        </div>
      </div>

      {/* Row containing profile avatar + message bubble */}
      <div className={`flex items-end space-x-1.5 sm:space-x-2 max-w-[92%] sm:max-w-[78%] ${isMe ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        {/* Profile Avatar beside the message */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-2xs sm:text-xs shrink-0 shadow-2xs overflow-hidden mb-0.5 border border-slate-200/90 select-none">
          {msg.senderAvatar ? (
            <img
              src={msg.senderAvatar}
              alt={msg.senderName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <span>{(msg.senderName || 'স').charAt(0)}</span>
          )}
        </div>

        {/* Swipeable Message Bubble Container */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isSwiping ? 'none' : 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
          className={`relative rounded-2xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 shadow-2xs text-[12px] sm:text-[13px] z-10 select-text break-words ${
            isMe
              ? 'bg-[#d9fdd3] text-slate-900 rounded-br-xs border border-emerald-200/60'
              : isNotice
              ? 'bg-amber-50 text-amber-950 rounded-bl-xs border-2 border-amber-300'
              : 'bg-white text-slate-900 rounded-bl-xs border border-slate-200/80'
          }`}
        >
          {/* Sender Name (Flags removed as requested) */}
          {!isMe && (
            <div className="flex items-center space-x-1.5 mb-0.5">
              <span
                className={`font-bold text-[11px] sm:text-xs ${
                  msg.senderRole === 'admin' ? 'text-emerald-800' : 'text-slate-800'
                }`}
              >
                {msg.senderName}
              </span>
              {msg.senderRole === 'admin' && (
                <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-emerald-800 text-emerald-100 font-bold flex items-center gap-0.5">
                  <Shield className="w-2 h-2" /> এডমিন
                </span>
              )}
              {msg.isDirect && msg.recipientName && (
                <span className="text-[8.5px] px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                  🔒 ১-টু-১ বার্তা
                </span>
              )}
            </div>
          )}
          {isMe && msg.isDirect && msg.recipientName && (
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300">
                🔒 প্রেরিত: {msg.recipientName}
              </span>
            </div>
          )}

        {/* Quoted / Reply Preview */}
        {msg.replyTo && (
          <div className="mb-1.5 p-1.5 rounded-lg bg-black/5 border-l-3 border-emerald-600 text-[10.5px] text-slate-700">
            <span className="font-bold text-emerald-800 block text-[10px]">{msg.replyTo.senderName}</span>
            <p className="truncate text-slate-600 mt-0.5">{msg.replyTo.text}</p>
          </div>
        )}

        {/* Image Content */}
        {msg.type === 'image' && msg.imageUrl && (
          <div className="mb-1.5 rounded-xl overflow-hidden border border-black/10 cursor-pointer">
            <img
              src={msg.imageUrl}
              alt="Shared attachment"
              onClick={() => onImageClick(msg.imageUrl || '')}
              className="w-full max-h-56 object-cover hover:opacity-95 transition-opacity"
            />
          </div>
        )}

        {/* Voice Note Player */}
        {msg.type === 'voice' && (
          <div className="flex items-center space-x-2 py-0.5 min-w-[170px] sm:min-w-[220px]">
            <button
              onClick={() => onTogglePlayVoice(msg.id, msg.voiceDuration || 10, msg.voiceDataUrl || msg.audioUrl)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs shrink-0 cursor-pointer transition-transform active:scale-95"
              title={playingVoiceId === msg.id ? 'পজ করুন' : 'শুনুন'}
            >
              {playingVoiceId === msg.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>

            {/* Animated waveform bars */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center space-x-0.5 sm:space-x-1 h-4">
                {[40, 70, 90, 60, 30, 80, 100, 50, 75, 45, 90, 65, 35, 80].map((height, i) => (
                  <span
                    key={i}
                    style={{ height: `${height}%` }}
                    className={`w-0.5 sm:w-1 rounded-full transition-colors ${
                      playingVoiceId === msg.id && i < (voiceProgress / 100) * 14
                        ? 'bg-emerald-700'
                        : 'bg-slate-400/60'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-500 mt-0.5">
                <span>{playingVoiceId === msg.id ? 'বাজছে...' : 'ভয়েস বার্তা'}</span>
                <span className="font-mono">{msg.voiceDuration || 8}s</span>
              </div>
            </div>
          </div>
        )}

        {/* Text Content */}
        {msg.text && msg.type !== 'voice' && (
          <p className="whitespace-pre-wrap leading-relaxed select-text font-normal">{msg.text}</p>
        )}

        {/* Time & WhatsApp Single/Double Tick Row */}
        <div className="flex items-center justify-end space-x-1 mt-0.5 text-[9.5px] text-slate-500">
          {msg.isPinned && <Pin className="w-2.5 h-2.5 text-emerald-700 fill-current mr-0.5" />}
          <span>
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isMe && (
            <span className="inline-flex items-center ml-0.5">
              {msg.status === 'read' || msg.status === 'delivered' ? (
                <CheckCheck className="w-3.5 h-3.5 text-sky-500" title="দেখা হয়েছে (Seen)" />
              ) : (
                <Check className="w-3 h-3 text-slate-400" title="পাঠানো হয়েছে (Sent)" />
              )}
            </span>
          )}
        </div>

        {/* Message Reactions display bubble */}
        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
          <div className="absolute -bottom-2 right-2 bg-white border border-slate-200 rounded-full px-1.5 py-0.2 shadow-2xs flex items-center space-x-1 text-[10px] z-10">
            {Object.entries(msg.reactions).map(([emoji, users]) => {
              const userList = (users as string[]) || [];
              return (
                <span key={emoji} className="flex items-center gap-0.5">
                  <span>{emoji}</span>
                  {userList.length > 1 && (
                    <span className="text-[9px] font-bold text-slate-600">{userList.length}</span>
                  )}
                </span>
              );
            })}
          </div>
        )}
      </div>
      </div>

      {/* Hover / Quick Actions Bar: Reply, React, Pin, Delete */}
      <div
        className={`flex items-center space-x-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity px-1 ${
          isMe ? 'justify-end' : 'justify-start'
        }`}
      >
        {/* Emojis */}
        <div className="flex items-center bg-white/95 backdrop-blur-xs border border-slate-200 rounded-full px-1.5 py-0.5 shadow-xs space-x-1">
          {EMOJI_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onAddReaction(msg.id, emoji)}
              className="hover:scale-125 transition-transform text-[11px] p-0.5 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Reply button */}
        <button
          onClick={() => onReply(msg)}
          className="p-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 shadow-xs cursor-pointer"
          title="উত্তর দিন"
        >
          <Reply className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </button>

        {/* Admin Pin */}
        {isAdmin && (
          <button
            onClick={() => onTogglePin(msg.id)}
            className="p-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 shadow-xs cursor-pointer"
            title={msg.isPinned ? 'আনপিন করুন' : 'পিন করুন'}
          >
            <Pin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
        )}

        {/* Delete */}
        {(isMe || isAdmin) && (
          <button
            onClick={() => onDelete(msg.id)}
            className="p-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-rose-600 shadow-xs cursor-pointer"
            title="মুছে ফেলুন"
          >
            <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
