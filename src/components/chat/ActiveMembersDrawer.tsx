import React, { useState, useMemo } from 'react';
import {
  X,
  Phone,
  Video,
  Shield,
  Search,
  MessageSquare,
  Activity,
  Users,
  Clock,
  Globe,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useFund } from '../../context/FundContext';
import {
  toBengaliNumerals,
  formatLastActiveBn,
  getCountryBn,
  getCountryFlag,
  getCountryTheme,
  detectCountryFromPhone,
} from '../../utils/formatters';

export interface ActiveMembersDrawerProps {
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
  const { members, currentFund } = useFund();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'online' | 'recent'>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  // Compute resolved presence records with unified, accurate country & city data
  const resolvedPresences = useMemo(() => {
    return userPresences.map((p) => {
      const isMe =
        p.id === currentMember?.id ||
        p.id === userSession?.memberId ||
        (isAdmin && p.role === 'admin');

      // Match member record from fund database
      const matchingMember = members.find(
        (m) =>
          m.id === p.id ||
          m.username === p.id ||
          m.name === p.name ||
          m.nameBn === p.name
      );

      // Determine country accurately: presence doc -> member record -> phone detection -> fund country -> fallback
      let rawCountry = p.country || matchingMember?.country;
      let rawFlag = p.countryFlag || matchingMember?.countryFlag;
      const phone = matchingMember?.phone;

      if (!rawCountry && phone) {
        const detected = detectCountryFromPhone(phone);
        if (detected) {
          rawCountry = detected.nameBn;
          rawFlag = detected.flag;
        }
      }

      if (!rawCountry) {
        rawCountry = currentFund?.country || 'সৌদি আরব';
      }

      const countryBn = getCountryBn(rawCountry) || 'সৌদি আরব';
      const flag = rawFlag || getCountryFlag(rawCountry) || '🇸🇦';
      const city = matchingMember?.city;
      const theme = getCountryTheme(countryBn);
      const lastActiveInfo = formatLastActiveBn(p.lastActive);

      return {
        ...p,
        isMe,
        matchingMember,
        countryBn,
        flag,
        city,
        phone,
        theme,
        lastActiveInfo,
      };
    });
  }, [userPresences, currentMember, userSession, isAdmin, members, currentFund]);

  // Aggregate country statistics for filter pills & header overview
  const countryStats = useMemo(() => {
    const statsMap: Record<
      string,
      { countryBn: string; flag: string; total: number; online: number }
    > = {};

    resolvedPresences.forEach((p) => {
      const c = p.countryBn;
      if (!statsMap[c]) {
        statsMap[c] = {
          countryBn: c,
          flag: p.flag,
          total: 0,
          online: 0,
        };
      }
      statsMap[c].total += 1;
      if (p.isOnline) {
        statsMap[c].online += 1;
      }
    });

    return Object.values(statsMap).sort((a, b) => b.total - a.total);
  }, [resolvedPresences]);

  // Filter members by search query, status tab, and country filter pill
  const filteredPresences = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return resolvedPresences.filter((p) => {
      // 1. Search filter (Name, Country, City, Status, Phone)
      if (query) {
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCountry =
          p.countryBn.toLowerCase().includes(query) ||
          (p.country && p.country.toLowerCase().includes(query));
        const matchesCity = p.city && p.city.toLowerCase().includes(query);
        const matchesStatus =
          p.customStatus && p.customStatus.toLowerCase().includes(query);
        const matchesPhone = p.phone && p.phone.includes(query);

        if (
          !matchesName &&
          !matchesCountry &&
          !matchesCity &&
          !matchesStatus &&
          !matchesPhone
        ) {
          return false;
        }
      }

      // 2. Country filter pill
      if (selectedCountry !== 'all') {
        if (p.countryBn !== selectedCountry) {
          return false;
        }
      }

      // 3. Status tabs (all / online / recent)
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
  }, [resolvedPresences, searchQuery, selectedCountry, filterTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold tracking-tight text-white">
                  গ্রুপ সদস্য ও সক্রিয় স্ট্যাটাস
                </h3>
                <span className="text-3xs bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 font-bold px-1.5 py-0.5 rounded-full">
                  লাইভ
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 flex items-center gap-1.5 mt-0.5 font-medium flex-wrap">
                <span className="inline-flex items-center gap-1 text-emerald-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {toBengaliNumerals(onlineCount)} জন সক্রিয়
                </span>
                <span>•</span>
                <span>মোট {toBengaliNumerals(userPresences.length)} জন</span>
                <span>•</span>
                <span className="text-emerald-300">
                  {toBengaliNumerals(countryStats.length)}টি দেশ
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/80 space-y-2.5 shrink-0">
          {/* Quick Status Tabs */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setFilterTab('all')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                filterTab === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              সবাই ({toBengaliNumerals(userPresences.length)})
            </button>
            <button
              onClick={() => setFilterTab('online')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                filterTab === 'online'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>অনলাইন ({toBengaliNumerals(onlineCount)})</span>
            </button>
            <button
              onClick={() => setFilterTab('recent')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                filterTab === 'recent'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              সাম্প্রতিক
            </button>
          </div>

          {/* Interactive Country Filter Strip (Scrollable) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-3xs font-bold text-slate-500 px-0.5">
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-600" />
                <span>প্রবাসী দেশভিত্তিক ফিল্টার:</span>
              </span>
              {selectedCountry !== 'all' && (
                <button
                  onClick={() => setSelectedCountry('all')}
                  className="text-emerald-700 hover:underline cursor-pointer"
                >
                  সব দেখান
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
              {/* All countries pill */}
              <button
                onClick={() => setSelectedCountry('all')}
                className={`px-2.5 py-1 rounded-lg text-2xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                  selectedCountry === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🌐</span>
                <span>সব দেশ ({toBengaliNumerals(userPresences.length)})</span>
              </button>

              {/* Each diaspora country pill */}
              {countryStats.map((c) => {
                const isSelected = selectedCountry === c.countryBn;
                return (
                  <button
                    key={c.countryBn}
                    onClick={() =>
                      setSelectedCountry(isSelected ? 'all' : c.countryBn)
                    }
                    className={`px-2.5 py-1 rounded-lg text-2xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-400/40'
                        : 'bg-white text-slate-800 border border-slate-200 hover:bg-emerald-50/70 hover:border-emerald-300'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.countryBn}</span>
                    <span
                      className={`text-3xs px-1 rounded-full ${
                        isSelected
                          ? 'bg-emerald-800/80 text-emerald-100'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {toBengaliNumerals(c.total)}
                    </span>
                    {c.online > 0 && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                        title={`${toBengaliNumerals(c.online)} জন অনলাইন`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="সদস্যের নাম, দেশ বা শহর দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Members List - Ordered strictly by active status, then chronological recency */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredPresences.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2 text-slate-400 text-xs">
              <Globe className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-bold text-slate-600">কোনো সদস্য পাওয়া যায়নি</p>
              <p className="text-2xs text-slate-400">
                ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন
              </p>
            </div>
          ) : (
            filteredPresences.map((presence) => {
              return (
                <div
                  key={presence.id}
                  className={`p-3 rounded-2xl transition-all border ${
                    presence.isOnline
                      ? 'bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/50 border-emerald-300/80 shadow-2xs'
                      : 'bg-white hover:bg-slate-50/80 border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    {/* Left: Avatar & Live Status */}
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 flex items-center justify-center text-white font-bold text-base shadow-xs overflow-hidden border border-emerald-600/30">
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
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-400/50 animate-pulse"
                            title="বর্তমানে অনলাইনে আছেন"
                          />
                        ) : (
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white"
                            title="বর্তমানে অফলাইনে আছেন"
                          />
                        )}
                      </div>

                      {/* Name, Identity & Country Badge */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {presence.name}
                          </span>
                          {presence.isMe && (
                            <span className="text-3xs font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md border border-emerald-300/60">
                              (আপনি)
                            </span>
                          )}
                          {presence.role === 'admin' ? (
                            <span className="text-3xs px-1.5 py-0.5 rounded-md bg-slate-900 text-emerald-300 font-extrabold flex items-center gap-0.5 shrink-0">
                              <Shield className="w-2.5 h-2.5" /> এডমিন
                            </span>
                          ) : (
                            <span className="text-3xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold shrink-0">
                              {toBengaliNumerals(
                                presence.matchingMember?.sharesCount || 1
                              )}
                              টি শেয়ার
                            </span>
                          )}
                        </div>

                        {/* Accurate & Beautiful Country Badge + Live Status */}
                        <div className="flex items-center flex-wrap gap-x-2 gap-y-1.5 mt-1.5 text-2xs">
                          {/* Polished Diaspora Country Badge */}
                          <div
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border font-semibold text-2xs shadow-2xs transition-colors ${presence.theme.badgeBg} ${presence.theme.badgeBorder} ${presence.theme.badgeText}`}
                            title={`প্রবাসী দেশ: ${presence.countryBn}`}
                          >
                            <span className="text-xs leading-none">
                              {presence.flag}
                            </span>
                            <span>{presence.countryBn}</span>
                            {presence.city && (
                              <span className="flex items-center gap-0.5 text-3xs font-normal opacity-85">
                                <MapPin className="w-2.5 h-2.5" />
                                {presence.city}
                              </span>
                            )}
                          </div>

                          {/* Active / Last Active Badge */}
                          {presence.isOnline ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded-md border border-emerald-300/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>বর্তমানে সক্রিয়</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-600 font-medium bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">
                              <Clock className="w-2.5 h-2.5 text-slate-400" />
                              <span>{presence.lastActiveInfo.text}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Action Buttons (Direct Chat, Audio Call, Video Call) */}
                    <div className="flex items-center space-x-1 shrink-0">
                      {!presence.isMe && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedDirectUser({
                                id: presence.id,
                                name: presence.name,
                                avatar: presence.avatar,
                                role: presence.role,
                                country: presence.countryBn,
                              });
                              setSelectedChatTab('direct');
                              if (onSelectUserForChat) {
                                onSelectUserForChat(presence.name);
                              }
                              onClose();
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
                            title="সরাসরি মেসেজ পাঠান"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

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
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-2xs text-slate-600 text-center flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium">
              প্রবাসী মুক্ত ফান্ড • রিয়েল-টাইম লাইভ ডাটাবেজ
            </span>
          </div>
          <span className="text-3xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold">
            {toBengaliNumerals(onlineCount)} জন সক্রিয়
          </span>
        </div>
      </div>
    </div>
  );
};
