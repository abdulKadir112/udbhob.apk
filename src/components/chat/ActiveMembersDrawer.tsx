import React, { useState, useMemo } from 'react';
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
  Activity,
  CheckCircle2,
  Users,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'online' | 'recent'>('all');

  // Filter and maintain strict chronological order:
  // Active/Online first, then 1m > 2m > 3m > 4m > hours > days
  const filteredPresences = useMemo(() => {
    return userPresences.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.country && p.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.customStatus && p.customStatus.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterTab === 'online') {
        return p.isOnline;
      }
      if (filterTab === 'recent') {
        if (p.isOnline) return true;
        if (!p.lastActive) return false;
        const diffMs = Date.now() - new Date(p.lastActive).getTime();
        return diffMs < 24 * 60 * 60 * 1000; // within 24 hours
      }
      return true;
    });
  }, [userPresences, searchQuery, filterTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white">গ্রুপ সদস্য ও সক্রিয় স্ট্যাটাস</h3>
              <p className="text-xs text-emerald-300 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{onlineCount} জন বর্তমানে সক্রিয় আছেন</span>
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

        {/* Filter Tabs & Search */}
        <div className="p-3 border-b border-slate-100 bg-slate-50 space-y-2">
          {/* Quick Tabs */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setFilterTab('all')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                filterTab === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              সবাই ({userPresences.length})
            </button>
            <button
              onClick={() => setFilterTab('online')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                filterTab === 'online'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>অনলাইন ({onlineCount})</span>
            </button>
            <button
              onClick={() => setFilterTab('recent')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                filterTab === 'recent'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              সাম্প্রতিক সক্রিয়
            </button>
          </div>

          {/* Search */}
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

        {/* Members List - Ordered strictly by active status, then chronological recency */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-100">
          {filteredPresences.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              কোনো সদস্য পাওয়া যায়নি
            </div>
          ) : (
            filteredPresences.map((presence, idx) => {
              const isMe =
                presence.id === currentMember?.id ||
                presence.id === userSession?.memberId ||
                (isAdmin && presence.role === 'admin');

              return (
                <div
                  key={presence.id}
                  className={`pt-2 flex items-center justify-between p-2.5 rounded-2xl transition-all ${
                    presence.isOnline
                      ? 'bg-emerald-50/60 border border-emerald-100/80 mb-1.5'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
                    {/* Avatar with live online dot */}
                    <div className="relative shrink-0">
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
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-400/40 animate-pulse" />
                      ) : (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5 truncate">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {presence.name}
                        </span>
                        {isMe && (
                          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                            (আপনি)
                          </span>
                        )}
                        {presence.role === 'admin' ? (
                          <span className="text-3xs px-1.5 py-0.5 rounded-md bg-slate-900 text-emerald-300 font-extrabold flex items-center gap-0.5 shrink-0">
                            <Shield className="w-2.5 h-2.5" /> এডমিন
                          </span>
                        ) : (
                          <span className="text-3xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium shrink-0">
                            সদস্য
                          </span>
                        )}
                      </div>

                      {/* Active Status & Chronological Recency Badge */}
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1 text-2xs">
                        {presence.country && (
                          <span className="flex items-center gap-1 text-slate-500 font-medium">
                            <span>{presence.countryFlag || '🇸🇦'}</span>
                            <span>{presence.country}</span>
                          </span>
                        )}

                        <span className="text-slate-300">•</span>

                        {presence.isOnline ? (
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.2 rounded-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            <span>এখন সক্রিয়</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500 font-medium bg-slate-100 px-1.5 py-0.2 rounded-md">
                            <Clock className="w-2.5 h-2.5 text-slate-400" />
                            <span>{presence.customStatus || 'সক্রিয় ছিলেন'}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Direct Call / Chat Action Buttons (if not myself) */}
                  {!isMe && (
                    <div className="flex items-center space-x-1 shrink-0">
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
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-2xs text-slate-500 text-center flex items-center justify-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span>প্রবাসী মুক্ত ফান্ড • রিয়েল-টাইম সক্রিয় সদস্য ক্রমানুসারে সাজানো</span>
        </div>
      </div>
    </div>
  );
};
