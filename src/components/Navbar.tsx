import React, { useState } from 'react';
import {
  Wallet,
  Bell,
  Shield,
  User,
  PlusCircle,
  TrendingUp,
  Volume2,
  VolumeX,
  LogOut,
  Sparkles,
  Layers,
  ChevronDown,
  Globe,
  SlidersHorizontal,
  MessageSquare,
  Calendar,
  LayoutDashboard,
  Coins,
  Camera,
  Building,
  BellRing,
  Smartphone,
  Download,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFund } from '../context/FundContext';
import { useChat } from '../context/ChatContext';
import { formatBDT, toBengaliNumerals } from '../utils/formatters';
import { PwaInstallModal } from './PwaInstallModal';
import { Member } from '../types';

interface NavbarProps {
  mainTab: 'chat' | 'fund';
  setMainTab: (tab: 'chat' | 'fund') => void;
  fundSubTab: 'overview' | 'matrix' | 'ledger' | 'investments' | 'admin';
  setFundSubTab: (tab: 'overview' | 'matrix' | 'ledger' | 'investments' | 'admin') => void;
  onOpenAddPayment: () => void;
  onOpenAddInvestment: () => void;
  onOpenAuthModal: () => void;
  onOpenProfileModal?: () => void;
  onOpenFundModal?: () => void;
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
  onOpenNotifications: () => void;
  onSelectMember?: (member: Member) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mainTab,
  setMainTab,
  fundSubTab,
  setFundSubTab,
  onOpenAddPayment,
  onOpenAddInvestment,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenFundModal,
  language,
  setLanguage,
  onOpenNotifications,
  onSelectMember,
}) => {
  const { userRole, isAdmin, logout, currentUser, userSession, currentMember } = useAuth();
  const {
    selectedYear,
    setSelectedYear,
    availableYears,
    unreadNotificationCount,
    soundEnabled,
    setSoundEnabled,
    members,
    currentFund,
    allFunds,
    switchFund,
  } = useFund();

  const { onlineCount, unreadChatCount } = useChat();

  const effectiveMember =
    currentMember ||
    (userSession?.memberId ? members.find((m) => m.id === userSession.memberId) : null) ||
    (userSession?.username ? members.find((m) => m.username === userSession.username) : null) ||
    (members.length > 0 ? members[0] : null);

  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const isBn = language === 'bn';
  const fundTitle = currentFund?.name || userSession?.fundName || (isBn ? 'প্রবাসী মুক্ত ফান্ড' : 'Probashi Mukto Fund');
  const userDisplayName = currentMember?.nameBn || currentMember?.name || userSession?.displayName || (isBn ? 'সদস্য' : 'Member');
  const userAvatar = currentMember?.avatarUrl || userSession?.avatarUrl;
  const fundLogo = currentFund?.logoUrl || currentFund?.avatarUrl;

  return (
    <header className="shrink-0 sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* DESKTOP VIEW (md: and up): Single Unified High-Precision Header Row      */}
        {/* ========================================================================= */}
        <div className="hidden md:flex items-center justify-between h-16">
          
          {/* Left: Brand Logo & Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer shrink-0"
            onClick={() => setMainTab('chat')}
          >
            {fundLogo ? (
              <img
                src={fundLogo}
                alt={fundTitle}
                className="w-10 h-10 rounded-xl object-cover border border-emerald-600/30 shadow-xs"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-700 to-teal-900 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-xs border border-emerald-600/30">
                {fundTitle.trim().charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold text-emerald-950 tracking-tight leading-none">
                  {fundTitle}
                </h1>
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xs font-black" title="Verified Fund">
                  ✓
                </span>
              </div>
              <span className="text-2xs font-medium text-slate-500 block mt-0.5">
                {isBn ? 'প্রবাসী সঞ্চয়, বিনিয়োগ ও কমিউনিটি নেটওয়ার্ক' : 'Diaspora Savings & Investment Network'}
              </span>
            </div>
          </div>

          {/* Center: Primary 2-Tab Segmented Switcher (Chat & Fund) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              id="top-nav-chat-desktop"
              onClick={() => setMainTab('chat')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mainTab === 'chat'
                  ? 'bg-[#005c4b] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isBn ? 'কমিউনিটি চ্যাট' : 'Community Chat'}</span>
              <span className={`text-3xs px-1.5 py-0.5 rounded-full font-bold ml-1 flex items-center gap-1 ${
                mainTab === 'chat' ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-100 text-emerald-800'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{onlineCount} {isBn ? 'লাইভ' : 'Live'}</span>
              </span>
            </button>

            <button
              id="top-nav-fund-desktop"
              onClick={() => setMainTab('fund')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mainTab === 'fund'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/60'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>{isBn ? 'আপনার ফান্ড' : 'Your Fund'}</span>
            </button>
          </div>

          {/* Right: Tools (Year, Notifications, User) */}
          <div className="flex items-center space-x-2">
            {/* Year Selector */}
            {mainTab === 'fund' && (
              <div className="relative">
                <button
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isBn ? `${toBengaliNumerals(selectedYear)} সাল` : `${selectedYear}`}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {isYearDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsYearDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-lg border border-slate-200 py-1.5 z-30">
                      {availableYears.map((yr) => (
                        <button
                          key={yr}
                          onClick={() => {
                            setSelectedYear(yr);
                            setIsYearDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                            selectedYear === yr ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{isBn ? toBengaliNumerals(yr) : yr}</span>
                          {selectedYear === yr && <span className="text-emerald-600 font-bold">✓</span>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Install App Button (PWA) */}
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-900 shadow-2xs transition-all cursor-pointer hover:scale-[1.02]"
              title={isBn ? 'মোবাইল ও পিসিতে অ্যাপ ইনস্টল করুন' : 'Install Mobile Web App'}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isBn ? 'অ্যাপ ইনস্টল' : 'Install App'}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-3xs font-bold text-white shadow-xs">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                  isAdmin
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                {userAvatar ? (
                  <img src={userAvatar} alt={userDisplayName} className="w-5 h-5 rounded-full object-cover border border-emerald-500" />
                ) : isAdmin ? (
                  <Shield className="w-3.5 h-3.5 text-amber-700" />
                ) : (
                  <User className="w-3.5 h-3.5 text-slate-600" />
                )}
                <span className="truncate max-w-[110px]">{userDisplayName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserMenuOpen && renderUserDropdown()}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW (< md:): High-End Native Mobile Header Bar                     */}
        {/* ========================================================================= */}
        <div className="md:hidden pt-2 pb-2 flex flex-col gap-2">
          
          {/* Row 1: Mobile Brand & Right Actions */}
          <div className="flex items-center justify-between">
            {/* Left: Brand Icon & Title */}
            <div
              className="flex items-center space-x-2 cursor-pointer truncate max-w-[190px]"
              onClick={() => setMainTab('chat')}
            >
              {fundLogo ? (
                <img
                  src={fundLogo}
                  alt={fundTitle}
                  className="w-8 h-8 rounded-lg object-cover border border-emerald-600/30 shadow-xs shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-black text-sm shadow-xs shrink-0">
                  {fundTitle.trim().charAt(0)}
                </div>
              )}
              <div className="truncate">
                <h1 className="text-sm font-extrabold text-emerald-950 tracking-tight leading-tight truncate">
                  {fundTitle}
                </h1>
                <span className="text-3xs text-emerald-700 font-bold block">
                  {mainTab === 'chat' ? (isBn ? '💬 চ্যাট মোড' : '💬 Chat Mode') : (isBn ? '💰 ফান্ড মোড' : '💰 Fund Mode')}
                </span>
              </div>
            </div>

            {/* Right: Year (if fund), Bell, User Avatar */}
            <div className="flex items-center space-x-1.5 shrink-0">
              {mainTab === 'fund' && (
                <button
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-2xs font-bold text-slate-700 flex items-center gap-0.5"
                >
                  <span>{isBn ? toBengaliNumerals(selectedYear) : selectedYear}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>
              )}

              {/* Year Dropdown for Mobile */}
              {isYearDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsYearDropdownOpen(false)} />
                  <div className="absolute right-12 top-14 w-28 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30">
                    {availableYears.map((yr) => (
                      <button
                        key={yr}
                        onClick={() => {
                          setSelectedYear(yr);
                          setIsYearDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-2xs flex items-center justify-between ${
                          selectedYear === yr ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <span>{isBn ? toBengaliNumerals(yr) : yr}</span>
                        {selectedYear === yr && <span className="text-emerald-600 font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Install App Button (Mobile PWA) */}
              <button
                onClick={() => setIsInstallModalOpen(true)}
                className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-center cursor-pointer"
                title={isBn ? 'অ্যাপ ইনস্টল করুন' : 'Install App'}
              >
                <Smartphone className="w-4 h-4 text-emerald-700" />
              </button>

              {/* Notification Bell */}
              <button
                onClick={onOpenNotifications}
                className="relative p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-3xs font-bold text-white">
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* User Avatar Circle */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center text-xs font-bold border transition-colors ${
                    isAdmin
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  }`}
                  title={userDisplayName}
                >
                  {userAvatar ? (
                    <img src={userAvatar} alt={userDisplayName} className="w-full h-full object-cover" />
                  ) : isAdmin ? (
                    <Shield className="w-4 h-4 text-amber-700" />
                  ) : (
                    userDisplayName.charAt(0)
                  )}
                </button>

                {isUserMenuOpen && renderUserDropdown()}
              </div>
            </div>
          </div>

          {/* Row 2: Full-Width Mobile Segmented Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/90 gap-1 shadow-2xs">
            <button
              id="top-nav-chat-mobile"
              onClick={() => setMainTab('chat')}
              className={`flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mainTab === 'chat'
                  ? 'bg-[#005c4b] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isBn ? 'কমিউনিটি চ্যাট' : 'Community Chat'}</span>
              <span className={`text-3xs px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                mainTab === 'chat' ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-200/60 text-emerald-800'
              }`}>
                {onlineCount}
              </span>
            </button>

            <button
              id="top-nav-fund-mobile"
              onClick={() => setMainTab('fund')}
              className={`flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mainTab === 'fund'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{isBn ? 'আপনার ফান্ড' : 'Your Fund'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 3 / SUB-NAV: ONLY VISIBLE WHEN 'YOUR FUND' TAB IS ACTIVE              */}
        {/* ========================================================================= */}
        {mainTab === 'fund' && (
          <div className="flex items-center justify-between py-2 border-t border-slate-100 overflow-x-auto no-scrollbar gap-1">
            <nav className="flex items-center space-x-1 shrink-0">
              <button
                id="fund-sub-overview"
                onClick={() => setFundSubTab('overview')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  fundSubTab === 'overview'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                {isBn ? 'ড্যাশবোর্ড' : 'Dashboard'}
              </button>

              <button
                id="fund-sub-matrix"
                onClick={() => setFundSubTab('matrix')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  fundSubTab === 'matrix'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                {isBn ? '১২ মাসের সঞ্চয় চার্ট' : '12-Month Matrix'}
              </button>

              <button
                id="fund-sub-ledger"
                onClick={() => setFundSubTab('ledger')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  fundSubTab === 'ledger'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                {isBn ? 'লেনদেন লেজার' : 'Ledger'}
              </button>

              <button
                id="fund-sub-investments"
                onClick={() => setFundSubTab('investments')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  fundSubTab === 'investments'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                {isBn ? 'বিনিয়োগ প্রকল্প' : 'Investments'}
              </button>

              {isAdmin && (
                <button
                  id="fund-sub-admin"
                  onClick={() => setFundSubTab('admin')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer shrink-0 ${
                    fundSubTab === 'admin'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  <span>{isBn ? 'এডমিন' : 'Admin'}</span>
                </button>
              )}
            </nav>

            {/* Quick Add Payment button for Admin */}
            {isAdmin && (
              <button
                onClick={onOpenAddPayment}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded-xl text-2xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0 ml-1"
              >
                <PlusCircle className="w-3 h-3" />
                <span>{isBn ? 'নতুন সঞ্চয়' : 'Add Payment'}</span>
              </button>
            )}
          </div>
        )}

      </div>
      <PwaInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        language={language}
      />
    </header>
  );

  // Helper to render user dropdown menu uniformly
  function renderUserDropdown() {
    return (
      <>
        <div className="fixed inset-0 z-20" onClick={() => setIsUserMenuOpen(false)} />
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-30 animate-in fade-in slide-from-top-2">
          <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2.5">
            {userAvatar ? (
              <img src={userAvatar} alt={userDisplayName} className="w-9 h-9 rounded-full object-cover border border-emerald-500 shrink-0 shadow-xs" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                {userDisplayName.charAt(0)}
              </div>
            )}
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">
                {userDisplayName}
              </p>
              <p className="text-2xs text-slate-500 truncate mt-0.5">
                {isAdmin ? '🛡️ সিস্টেম অ্যাডমিনিস্ট্রেটর' : `🇸🇦 ${currentMember?.country || 'প্রবাসী সদস্য'}`}
              </p>
            </div>
          </div>

          <div className="py-1">
            {/* 1. My Personal Profile & Financial Stats */}
            {onOpenProfileModal && (
              <button
                onClick={() => {
                  if (onOpenProfileModal) onOpenProfileModal();
                  setIsUserMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs text-emerald-950 hover:bg-emerald-50 flex items-center justify-between font-bold bg-emerald-50/60 border-b border-emerald-100/80 cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'আমার ব্যক্তিগত প্রোফাইল ও আর্থিক হিসাব' : 'My Profile & Financial Stats'}</span>
                </div>
                <span className="text-3xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-extrabold">
                  {isBn ? 'শেয়ার ও লাভ' : 'Stats'}
                </span>
              </button>
            )}

            {/* 2. Direct 12-Month Statement & Slip */}
            {effectiveMember && onSelectMember && (
              <button
                onClick={() => {
                  onSelectMember(effectiveMember);
                  setIsUserMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-800 hover:bg-slate-50 flex items-center justify-between font-semibold border-b border-slate-100 cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>{isBn ? 'আমার ১২ মাসের সঞ্চয় ও রসিদ স্লিপ' : 'My 12-Month Statement Slip'}</span>
                </div>
                <span className="text-3xs text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                  {isBn ? 'রশিদ' : 'Slip'}
                </span>
              </button>
            )}

            {/* Profile & Avatar Edit Option */}
            <button
              onClick={() => {
                if (onOpenProfileModal) onOpenProfileModal();
                setIsUserMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-xs text-emerald-800 hover:bg-emerald-50 flex items-center space-x-2 font-semibold cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? 'আমার প্রোফাইল সেটিংস ও ছবি পরিবর্তন' : 'Edit Profile & Avatar'}</span>
            </button>

            {/* Fund Logo / Profile Edit Option (Admin only) */}
            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    if (onOpenFundModal) onOpenFundModal();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                >
                  <Building className="w-4 h-4 text-amber-600" />
                  <span>{isBn ? 'ফান্ডের লোগো ও তথ্য পরিবর্তন' : 'Edit Fund Logo & Details'}</span>
                </button>
                <button
                  onClick={() => {
                    setMainTab('fund');
                    setFundSubTab('admin');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-emerald-800 hover:bg-emerald-50 flex items-center justify-between font-semibold"
                >
                  <span className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>{isBn ? 'সকল ফান্ড ম্যানেজ ও ডিলেট' : 'Manage & Delete Funds'}</span>
                  </span>
                  <span className="text-3xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                    {allFunds.length}
                  </span>
                </button>
              </>
            )}

            {/* Language Switcher inside Profile */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100/80">
              <span className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'ভাষা / Language' : 'Language / ভাষা'}</span>
              </span>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setLanguage('bn')}
                  className={`px-2 py-0.5 rounded-md text-2xs font-bold transition-all ${
                    language === 'bn'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 rounded-md text-2xs font-bold transition-all ${
                    language === 'en'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span>{isBn ? 'শব্দ ও রিংটোন' : 'Sound Effects'}</span>
              </span>
              <span className="text-2xs font-bold text-slate-400">{soundEnabled ? 'অন' : 'অফ'}</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  setMainTab('fund');
                  setFundSubTab('admin');
                  setIsUserMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
              >
                <Shield className="w-4 h-4 text-slate-500" />
                <span>{isBn ? 'এডমিন কনসোল' : 'Admin Console'}</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenAuthModal();
                setIsUserMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>{isBn ? 'সদস্য একাউন্ট পরিবর্তন' : 'Switch Account'}</span>
            </button>
          </div>

          <div className="border-t border-slate-100 pt-1">
            <button
              onClick={async () => {
                await logout();
                setIsUserMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span>{isBn ? 'লগআউট করুন' : 'Log Out'}</span>
            </button>
          </div>
        </div>
      </>
    );
  }
};
