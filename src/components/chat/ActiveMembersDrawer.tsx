import React from 'react';
import {
  X,
  Phone,
  Video,
  Shield,
  User,
  Sparkles,
  MapPin,
  Clock,
  Circle,
  Search,
  MessageSquare,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useFund } from '../../context/FundContext';

interface ActiveMembersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUserForChat?: (userName: string) => void;
}

export const ActiveMembersDrawer: React.FC<ActiveMembersDrawerProps> = ({
  isOpen,
  onClose,
  onSelectUserForChat,
}) => {
  const {
    userPresences,
    onlineCount,
    startCall,
    setSelectedChatTab,
    setSelectedDirectUser,
  } = useChat();
  const { currentMember, userSession, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');

  if (!isOpen) return null;

  const filteredPresences = userPresences.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.country && p.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white">গ্রুপ সদস্য ও সক্রিয় স্ট্যাটাস</h3>
              <p className="text-xs text-emerald-300 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{onlineCount} জন বর্তমানে অনলাইনে আছেন</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="সদস্য বা দেশ দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-100">
          {filteredPresences.map((presence) => {
            const isMe =
              presence.id === currentMember?.id ||
              presence.id === userSession?.memberId ||
              (isAdmin && presence.role === 'admin');

            return (
              <div
                key={presence.id}
                className="pt-2 flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar with live online dot */}
                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-bold text-sm shadow-xs overflow-hidden">
                      {presence.avatar ? (
                        <img
                          src={presence.avatar}
                          alt={presence.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span>{presence.name.charAt(0)}</span>
                      )}
                    </div>
                    {presence.isOnline ? (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-400/40" />
                    ) : (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {presence.name} {isMe && <span className="text-2xs text-emerald-700 font-normal">(আপনি)</span>}
                      </span>
                      {presence.role === 'admin' ? (
                        <span className="text-3xs px-1.5 py-0.5 rounded-md bg-slate-900 text-emerald-300 font-extrabold flex items-center gap-0.5">
                          <Shield className="w-2.5 h-2.5" /> এডমিন
                        </span>
                      ) : (
                        <span className="text-3xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          সদস্য
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mt-0.5 text-2xs text-slate-500">
                      {presence.country && (
                        <span className="flex items-center gap-1 font-medium">
                          <span>{presence.countryFlag || '🇸🇦'}</span>
                          <span>{presence.country}</span>
                        </span>
                      )}
                      <span>•</span>
                      <span className={presence.isOnline ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                        {presence.customStatus || (presence.isOnline ? 'অনলাইনে আছেন' : 'সক্রিয় ছিলেন')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Call / Chat Action Buttons (if not myself) */}
                {!isMe && (
                  <div className="flex items-center space-x-1">
                    {/* Direct Chat */}
                    <button
                      onClick={() => {
                        setSelectedDirectUser({
                          id: presence.id,
                          name: presence.name,
                          avatar: presence.avatar,
                          role: presence.role,
                          country: presence.country,
                        });
                        setSelectedChatTab('direct');
                        if (onSelectUserForChat) {
                          onSelectUserForChat(presence.name);
                        }
                        onClose();
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
                      title="সরাসরি চ্যাট"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    {/* Audio Call */}
                    <button
                      onClick={() => {
                        startCall('audio', false, {
                          id: presence.id,
                          name: presence.name,
                          avatar: presence.avatar,
                          role: presence.role,
                        });
                        onClose();
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
                      title="অডিও কল"
                    >
                      <Phone className="w-4 h-4" />
                    </button>

                    {/* Video Call */}
                    <button
                      onClick={() => {
                        startCall('video', false, {
                          id: presence.id,
                          name: presence.name,
                          avatar: presence.avatar,
                          role: presence.role,
                        });
                        onClose();
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
                      title="ভিডিও কল"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-2xs text-slate-500 text-center">
          প্রবাসী মুক্ত ফান্ড • রিয়েল-টাইম সদস্য যোগাযোগ ও কলিং
        </div>
      </div>
    </div>
  );
};
