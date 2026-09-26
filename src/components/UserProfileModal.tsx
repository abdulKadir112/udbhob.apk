import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  Camera,
  Upload,
  User,
  Phone,
  MapPin,
  Check,
  Sparkles,
  Bell,
  BellRing,
  Shield,
  Loader2,
  Trash2,
  Users,
  LogOut,
  ArrowRightLeft,
  Globe,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  TrendingUp,
  Wallet,
  Layers,
  Percent,
  CheckCircle2,
  ArrowUpRight,
  FileText,
  BadgeCheck,
  Info,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFund } from '../context/FundContext';
import {
  requestNotificationPermission,
  requestAllCorePermissions,
  getNotificationPermission,
  sendTestPushNotification,
} from '../utils/pushNotification';
import {
  COUNTRIES_LIST,
  getCountryFlag,
  toBengaliNumerals,
  formatBDT,
  formatCustomDate,
  getCountryBn,
} from '../utils/formatters';
import { calculateMemberFinancialStats } from '../utils/memberStats';
import { Member } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal?: () => void;
  onOpenMemberDetailModal?: (member: Member) => void;
  initialMemberId?: string;
  language: 'bn' | 'en';
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenAuthModal,
  onOpenMemberDetailModal,
  language,
}) => {
  const {
    currentUser,
    currentMember,
    userSession,
    isAdmin,
    updateUserAvatar,
    updateUserProfile,
    changeUserPassword,
    logout,
  } = useAuth();
  const { updateMember, members, payments, investments, selectedYear } = useFund();

  const isBn = language === 'bn';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Active Tab state: 'financials' | 'profile' | 'security' | 'alerts'
  const [activeTab, setActiveTab] = useState<'financials' | 'profile' | 'security' | 'alerts'>('financials');

  // STRICT PRIVACY: User profile strictly resolves ONLY to the currently logged in member!
  // No member can browse or inspect someone else's personal profit/loss details.
  const effectiveMember = useMemo(() => {
    return (
      currentMember ||
      (userSession?.memberId ? members.find((m) => m.id === userSession.memberId) : null) ||
      (userSession?.username ? members.find((m) => m.username === userSession.username) : null) ||
      null
    );
  }, [currentMember, userSession, members]);

  // Financial statistics calculation strictly for this member
  const memberStats = useMemo(() => {
    if (!effectiveMember) return null;
    return calculateMemberFinancialStats(
      effectiveMember,
      members,
      payments,
      investments,
      selectedYear
    );
  }, [effectiveMember, members, payments, investments, selectedYear]);

  // Profile Form State
  const [avatarUrl, setAvatarUrl] = useState<string>(
    effectiveMember?.avatarUrl || userSession?.avatarUrl || PRESET_AVATARS[0]
  );
  const [nameBn, setNameBn] = useState<string>(effectiveMember?.nameBn || userSession?.displayName || '');
  const [nameEn, setNameEn] = useState<string>(effectiveMember?.name || '');
  const [phone, setPhone] = useState<string>(effectiveMember?.phone || '');
  const [city, setCity] = useState<string>(effectiveMember?.city || '');
  const [country, setCountry] = useState<string>(effectiveMember?.country || 'Saudi Arabia');

  useEffect(() => {
    if (effectiveMember) {
      setAvatarUrl(effectiveMember.avatarUrl || PRESET_AVATARS[0]);
      setNameBn(effectiveMember.nameBn || '');
      setNameEn(effectiveMember.name || '');
      setPhone(effectiveMember.phone || '');
      setCity(effectiveMember.city || '');
      setCountry(effectiveMember.country || 'Saudi Arabia');
    }
  }, [effectiveMember]);

  // Password State
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // General Save State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pushStatus, setPushStatus] = useState<string>(() => getNotificationPermission());
  const [testingPush, setTestingPush] = useState(false);

  if (!isOpen) return null;

  // Compress uploaded image to lightweight dataURL
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 240;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateUserAvatar(avatarUrl);
      await updateUserProfile({
        name: nameEn || nameBn,
        nameBn: nameBn || nameEn,
        phone,
        city,
        country,
        avatarUrl,
      });

      if (effectiveMember?.id) {
        await updateMember(effectiveMember.id, {
          name: nameEn || nameBn,
          nameBn: nameBn || nameEn,
          phone,
          city,
          country,
          avatarUrl,
        });
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setIsSaving(false);
      }, 1500);
    } catch (err) {
      console.warn('Profile save error:', err);
      setIsSaving(false);
    }
  };

  const handleTogglePush = async () => {
    setTestingPush(true);
    try {
      const res = await requestAllCorePermissions();
      setPushStatus(res.notification);
      if (res.notification === 'granted') {
        await sendTestPushNotification(isBn);
      }
    } catch (e) {
      console.warn('Error enabling permissions:', e);
    } finally {
      setTestingPush(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-xs animate-in fade-in cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden cursor-default text-slate-900 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================================= */}
        {/* 1. HEADER: Member Identity & Status Badge */}
        {/* ========================================================================= */}
        <div className="relative px-4 sm:px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white shrink-0 overflow-hidden border-b border-white/10">
          {/* Subtle Ambient Accents */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 left-1/4 w-32 h-32 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border-2 border-emerald-400/40 p-0.5 shadow-md overflow-hidden flex items-center justify-center text-white font-black text-xl">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{(nameBn || nameEn || 'স').charAt(0)}</span>
                  )}
                </div>
                <div
                  className="absolute -bottom-1 -right-1 text-base shadow bg-slate-900 rounded-full px-1 py-0.2 border border-white/20"
                  title={country}
                >
                  {getCountryFlag(country)}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight truncate">
                    {isBn ? nameBn || nameEn || 'আমার ব্যক্তিগত প্রোফাইল' : nameEn || nameBn || 'My Personal Profile'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-3xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3 text-emerald-400" />
                    <span>{isAdmin ? (isBn ? 'এডমিন' : 'Admin') : (isBn ? 'সক্রিয় সদস্য' : 'Active Member')}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-2xs sm:text-xs text-slate-300 mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-emerald-400" />
                    <span>{isBn ? getCountryBn(country) : country}</span>
                    {city && <span>({city})</span>}
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="font-mono text-emerald-200 text-3xs sm:text-2xs">
                    {phone || (effectiveMember?.username ? `@${effectiveMember.username}` : userSession?.email || '')}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15 active:scale-95 shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. NAVIGATION TABS (Responsive horizontal bar) */}
        {/* ========================================================================= */}
        <div className="px-3 sm:px-6 pt-2 pb-1 bg-slate-50 border-b border-slate-200 shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              type="button"
              onClick={() => setActiveTab('financials')}
              className={`px-3 sm:px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'financials'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBn ? 'আমার আর্থিক হিসাব' : 'My Financials'}</span>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-700 text-3xs font-extrabold border border-emerald-300">
                🔒 {isBn ? 'গোপনীয়' : 'Private'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-3 sm:px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>{isBn ? 'প্রোফাইল ও ছবি' : 'Profile & Photo'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`px-3 sm:px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'security'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBn ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('alerts')}
              className={`px-3 sm:px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isBn ? 'নোটিফিকেশন' : 'Push Alerts'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MODAL BODY */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          
          {/* Unauthenticated / Guest Protection */}
          {!effectiveMember && (!currentUser || currentUser.isAnonymous) && (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900">
                {isBn ? 'ব্যক্তিগত প্রোফাইল ও আর্থিক হিসাব লক করা' : 'Personal Profile & Financials Locked'}
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                {isBn
                  ? 'ফান্ড নিরাপত্তা ও গোপনীয়তা নীতি অনুযায়ী, সদস্যদের ব্যক্তিগত সঞ্চয় এবং লাভ-লোকসানের হিসাব শুধুমাত্র লগইন করা সদস্য নিজেই দেখতে পারেন।'
                  : 'In compliance with fund privacy rules, individual financial records and profit-loss calculations are strictly accessible only by the logged-in owner.'}
              </p>
              {onOpenAuthModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal();
                  }}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>{isBn ? 'আপনার একাউন্টে লগইন করুন' : 'Sign In to Your Account'}</span>
                </button>
              )}
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 1: FINANCIALS & SHARES (Strictly Private to this member) */}
          {/* ======================================================================= */}
          {effectiveMember && activeTab === 'financials' && memberStats && (
            <div className="space-y-4">
              
              {/* Privacy Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Shield className="w-4 h-4 text-emerald-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-xs text-emerald-950">
                      {isBn ? 'গোপনীয় ব্যক্তিগত আর্থিক বিবরণী' : 'Confidential Financial Overview'}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white font-extrabold text-3xs">
                      🔒 {isBn ? 'শুধুমাত্র আপনার দৃশ্য' : 'Visible Only to You'}
                    </span>
                  </div>
                  <p className="text-3xs text-emerald-900/90 mt-0.5 leading-relaxed">
                    {isBn
                      ? 'ফান্ড নীতি অনুযায়ী আপনার জমার টাকা, কিস্তি এবং লাভ-লোকসানের এই হিসাব সম্পূর্ণ সুরক্ষিত। অন্য কোনো সাধারণ সদস্য এটি দেখতে পাবেন না।'
                      : 'Per fund security protocol, your deposit and financial metrics are confidential. No other member can view your personal records.'}
                  </p>
                </div>
              </div>

              {/* Fund Investment Reality & No Guaranteed Profit Notice */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-extrabold text-xs text-amber-300">
                    {isBn ? 'ফান্ড বিনিয়োগের বাস্তবতা ও মুনাফা নীতি' : 'Fund Investment Policy & Transparency'}
                  </span>
                </div>
                <p className="text-3xs text-slate-300 leading-relaxed">
                  {isBn
                    ? 'আমাদের ফান্ডে কোনো নির্দিষ্ট বা পূর্বনির্ধারিত নিশ্চিত লাভ নেই। ফান্ডের বিনিয়োগ প্রকল্পগুলো বর্তমানে চলমান রয়েছে। প্রকল্প সমাপ্তি ও প্রকৃত নগদ অর্থ ফেরত আসার পর হিসাব নিষ্পত্তি সাপেক্ষে অর্জিত লভ্যাংশ আপনার নামে স্বয়ংক্রিয়ভাবে যোগ হবে।'
                    : 'Our fund guarantees no fixed profit. All investment projects are currently active and ongoing. Realized profits will be automatically credited once investments conclude and accounts are settled.'}
                </p>
              </div>

              {/* 4 CORE HIGHLIGHT CARDS (Fully Responsive Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* Card 1: শেয়ার সংখ্যা (Shares Count) */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-amber-600" />
                        <span>{isBn ? 'শেয়ার সংখ্যা' : 'Shares Count'}</span>
                      </span>
                      <span className="px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-extrabold text-3xs">
                        ৳১,০০০/শেয়ার
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        {isBn ? toBengaliNumerals(memberStats.shares) : memberStats.shares}
                      </span>
                      <span className="text-xs font-bold text-slate-600">{isBn ? 'টি শেয়ার' : 'shares'}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-3xs text-slate-600">
                    <span>{isBn ? 'নির্ধারিত কিস্তি:' : 'Monthly Rate:'}</span>
                    <strong className="text-slate-900 font-bold">{formatBDT(memberStats.shareAmountMonthly, isBn)}/মাস</strong>
                  </div>
                </div>

                {/* Card 2: লাভ / লোকসান হিসাব (Profit / Loss Status) */}
                <div className={`p-3.5 rounded-2xl border shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between ${
                  memberStats.profitStatus === 'loss'
                    ? 'bg-rose-50/70 border-rose-200'
                    : 'bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white border-emerald-200'
                }`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isBn ? 'লাভ / লোকসান হিসাব' : 'Profit / Loss'}</span>
                      </span>
                      <span className={`px-1.5 py-0.2 rounded-md font-extrabold text-3xs flex items-center gap-0.5 ${
                        memberStats.profitStatus === 'profit'
                          ? 'bg-emerald-600 text-white'
                          : memberStats.profitStatus === 'loss'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {memberStats.profitStatus === 'profit'
                          ? (isBn ? 'লভ্যাংশ' : 'Profit')
                          : memberStats.profitStatus === 'loss'
                          ? (isBn ? 'লোকসান' : 'Loss')
                          : (isBn ? 'অনির্ধারিত' : 'Pending')}
                      </span>
                    </div>

                    <div className="mt-2">
                      {memberStats.profitStatus === 'profit' ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1 bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-lg font-black text-sm border border-emerald-300">
                            <Percent className="w-3 h-3 text-emerald-700" />
                            <span>+{isBn ? toBengaliNumerals(memberStats.memberProfitPercentage) : memberStats.memberProfitPercentage}%</span>
                          </div>
                          <div className="font-black text-emerald-800 text-base tracking-tight">
                            +{formatBDT(memberStats.memberProfitAmount, isBn)}
                          </div>
                        </div>
                      ) : memberStats.profitStatus === 'loss' ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1 bg-rose-100 text-rose-900 px-2 py-0.5 rounded-lg font-black text-sm border border-rose-300">
                            <Percent className="w-3 h-3 text-rose-700" />
                            <span>-{isBn ? toBengaliNumerals(Math.abs(memberStats.memberProfitPercentage)) : Math.abs(memberStats.memberProfitPercentage)}%</span>
                          </div>
                          <div className="font-black text-rose-800 text-base tracking-tight">
                            -{formatBDT(Math.abs(memberStats.memberProfitAmount), isBn)}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-slate-800 text-base">
                              ০% (৳০)
                            </span>
                            <span className="text-3xs text-slate-600 font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                              {isBn ? 'কোনো নিশ্চিত লাভ নেই' : 'No fixed profit'}
                            </span>
                          </div>
                          <p className="text-3xs text-slate-500 mt-1">
                            {isBn ? 'বিনিয়োগ চলমান • সমাপ্তির পর লভ্যাংশ যোগ হবে' : 'Investment active • Profit credited upon settlement'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-3xs text-slate-600">
                    <span>{isBn ? 'ফান্ড অংশীদারিত্ব:' : 'Share Ratio:'}</span>
                    <strong className="font-bold text-slate-900">
                      {isBn ? toBengaliNumerals(memberStats.sharePercentageOfFund) : memberStats.sharePercentageOfFund}%
                    </strong>
                  </div>
                </div>

                {/* Card 3: জমা মাসের সংখ্যা (Months Paid Count) */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>{isBn ? 'জমা মাসের সংখ্যা' : 'Months Paid'}</span>
                      </span>
                      <span className="px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-extrabold text-3xs">
                        {isBn ? `${toBengaliNumerals(selectedYear)} সাল` : selectedYear}
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-blue-900 tracking-tight">
                        {isBn ? toBengaliNumerals(memberStats.paidMonthsSelectedYear) : memberStats.paidMonthsSelectedYear}
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        / {isBn ? '১২ মাস' : '12 months'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-3xs text-slate-600">
                    <span>{isBn ? 'সর্বমোট পরিশোধিত:' : 'Total Lifetime:'}</span>
                    <strong className="text-blue-700 font-bold">
                      {isBn ? `${toBengaliNumerals(memberStats.distinctMonthsPaidLifetime)} মাস` : `${memberStats.distinctMonthsPaidLifetime} mos`}
                    </strong>
                  </div>
                </div>

                {/* Card 4: তার নামে মোট কত টাকা আছে (Total Deposited) */}
                <div className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-3xs font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isBn ? 'নামে মোট সঞ্চয়' : 'Total in Your Name'}</span>
                      </span>
                      <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-3xs">
                        {isBn ? 'মূল জমা' : 'Principal'}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-black text-emerald-400 tracking-tight block">
                        {formatBDT(memberStats.totalDepositedLifetime, isBn)}
                      </span>
                    </div>
                  </div>
                  <div className="relative z-10 mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-3xs text-slate-300">
                    <span>{isBn ? 'প্রকৃত আমানত:' : 'Net Principal:'}</span>
                    <strong className="text-white font-extrabold">
                      {formatBDT(memberStats.totalDepositedLifetime, isBn)}
                    </strong>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-emerald-500/20 blur-xl rounded-full pointer-events-none" />
                </div>

              </div>

              {/* Action: Open 12-Month Detailed Statement Slip */}
              {onOpenMemberDetailModal && effectiveMember && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">
                      {isBn ? '১২ মাসের কিস্তির রসিদ ও লেনদেন বিবরণী' : '12-Month Installment Statement Slip'}
                    </span>
                    <span className="text-3xs text-slate-500">
                      {isBn ? 'প্রতি মাসের জমা, রশিদ ভাউচার ও প্রিন্ট স্লিপ দেখুন' : 'View month-by-month vouchers and print receipt slip'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenMemberDetailModal(effectiveMember);
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isBn ? 'পূর্ণাঙ্গ বিবরণী দেখুন →' : 'View Full Slip →'}</span>
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 2: PROFILE & AVATAR EDITING */}
          {/* ======================================================================= */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Avatar Studio */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
                <div className="relative group">
                  <img
                    src={avatarUrl}
                    alt="Profile Preview"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-3 border-emerald-500 shadow-md ring-4 ring-emerald-50"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg border-2 border-white cursor-pointer transition-transform hover:scale-105"
                    title={isBn ? 'ছবি আপলোড করুন' : 'Upload photo'}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileChange}
                />

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-2xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isBn ? 'ক্যামেরা বা ফাইল থেকে ছবি সিলেক্ট করুন' : 'Select from Camera / Gallery'}</span>
                  </button>
                </div>

                {/* Preset Avatars */}
                <div className="mt-3.5 w-full">
                  <p className="text-3xs text-slate-500 font-semibold mb-1.5 text-center">
                    {isBn ? 'অথবা রেডিমেড প্রোফাইল ছবি বেছে নিন:' : 'Or pick a preset avatar:'}
                  </p>
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                          avatarUrl === url
                            ? 'border-emerald-600 scale-110 shadow-xs ring-2 ring-emerald-200'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 mb-1">
                      {isBn ? 'নাম (বাংলায়)' : 'Full Name (Bengali)'}
                    </label>
                    <input
                      type="text"
                      value={nameBn}
                      onChange={(e) => setNameBn(e.target.value)}
                      placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-700 mb-1">
                      {isBn ? 'নাম (English)' : 'Full Name (English)'}
                    </label>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="e.g. Md Rafiqul Islam"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 mb-1">
                      {isBn ? 'ফোন নম্বর' : 'Phone Number'}
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+966 50 123 4567"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-700 mb-1">
                      {isBn ? 'শহর / বর্তমান অবস্থান' : 'City / Location'}
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Riyadh / Dubai / Jeddah"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 mb-1">
                    {isBn ? 'প্রবাসী দেশ (Country)' : 'Diaspora Country'}
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs cursor-pointer"
                  >
                    {COUNTRIES_LIST.map((c) => (
                      <option key={c.code} value={c.nameEn}>
                        {c.flag} {c.nameEn} ({c.nameBn})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{isBn ? 'প্রোফাইল সংরক্ষিত হয়েছে!' : 'Profile Saved!'}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isBn ? 'প্রোফাইল আপডেট সংরক্ষণ করুন' : 'Save Profile Changes'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* ======================================================================= */}
          {/* TAB 3: PASSWORD & SECURITY */}
          {/* ======================================================================= */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-2xl border border-emerald-900/50 shadow-md">
                <div className="flex items-center space-x-2.5 mb-3 pb-2.5 border-b border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{isBn ? 'লগইন পাসওয়ার্ড পরিবর্তন' : 'Change Login Password'}</span>
                      <span className="text-3xs px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                        {isAdmin ? (isBn ? '🛡️ এডমিন' : 'Admin') : (isBn ? '👤 সদস্য' : 'Member')}
                      </span>
                    </h4>
                    <p className="text-3xs text-emerald-200/70">
                      {isBn ? 'বর্তমান পাসওয়ার্ড নিশ্চিত করে নতুন পাসওয়ার্ড সেট করুন' : 'Verify current password and set new password'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {/* Current Password Field */}
                  <div>
                    <label className="block text-3xs font-bold text-slate-300 mb-1">
                      {isBn ? '১. বর্তমান পাসওয়ার্ড (Current Password) *' : '1. Current Password *'}
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          setPasswordError(null);
                          setPasswordChangeSuccess(false);
                        }}
                        placeholder={isBn ? 'আপনার বর্তমান পাসওয়ার্ড লিখুন (ডিফল্ট: 123456)' : 'Enter current password'}
                        className="w-full pl-8 pr-8 py-2 bg-white/10 border border-white/15 rounded-xl text-white placeholder-slate-400 text-xs font-mono focus:bg-white/20 focus:border-emerald-400 outline-none transition-all"
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-3xs font-bold text-slate-300 mb-1">
                        {isBn ? '২. নতুন পাসওয়ার্ড (New Password) *' : '2. New Password *'}
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setPasswordError(null);
                            setPasswordChangeSuccess(false);
                          }}
                          placeholder={isBn ? 'কমপক্ষে ৬ অক্ষর' : 'Min 6 chars'}
                          className="w-full pl-8 pr-8 py-2 bg-white/10 border border-white/15 rounded-xl text-white placeholder-slate-400 text-xs font-mono focus:bg-white/20 focus:border-emerald-400 outline-none transition-all"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-3xs font-bold text-slate-300 mb-1">
                        {isBn ? '৩. নতুন পাসওয়ার্ড নিশ্চিতকরণ *' : '3. Confirm Password *'}
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordError(null);
                            setPasswordChangeSuccess(false);
                          }}
                          placeholder={isBn ? 'পুনরায় নতুন পাসওয়ার্ড' : 'Repeat password'}
                          className="w-full pl-8 pr-8 py-2 bg-white/10 border border-white/15 rounded-xl text-white placeholder-slate-400 text-xs font-mono focus:bg-white/20 focus:border-emerald-400 outline-none transition-all"
                        />
                        <Check className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isChangingPass || !currentPassword.trim() || !newPassword.trim()}
                      onClick={async () => {
                        if (!currentPassword.trim()) {
                          setPasswordError(isBn ? 'অনুগ্রহ করে বর্তমান পাসওয়ার্ডটি লিখুন।' : 'Enter current password.');
                          return;
                        }
                        if (!newPassword.trim()) {
                          setPasswordError(isBn ? 'অনুগ্রহ করে নতুন পাসওয়ার্ডটি লিখুন।' : 'Enter new password.');
                          return;
                        }
                        if (newPassword.trim().length < 6) {
                          setPasswordError(isBn ? 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Min 6 characters required.');
                          return;
                        }
                        if (confirmPassword.trim() && newPassword.trim() !== confirmPassword.trim()) {
                          setPasswordError(isBn ? 'নতুন পাসওয়ার্ড ও নিশ্চিতকরণ পাসওয়ার্ড মিলছে না!' : 'Passwords do not match.');
                          return;
                        }

                        setIsChangingPass(true);
                        setPasswordError(null);
                        setPasswordChangeSuccess(false);

                        try {
                          await changeUserPassword(currentPassword.trim(), newPassword.trim());
                          if (effectiveMember?.id) {
                            await updateMember(effectiveMember.id, { passwordPlain: newPassword.trim() });
                          }
                          setPasswordChangeSuccess(true);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setTimeout(() => setPasswordChangeSuccess(false), 5000);
                        } catch (err: any) {
                          setPasswordError(err.message || (isBn ? 'পাসওয়ার্ড পরিবর্তনে সমস্যা হয়েছে।' : 'Failed to change password.'));
                        } finally {
                          setIsChangingPass(false);
                        }
                      }}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isChangingPass ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{isBn ? 'যাচাই ও আপডেট হচ্ছে...' : 'Verifying & Updating...'}</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-3.5 h-3.5" />
                          <span>{isBn ? 'বর্তমান পাসওয়ার্ড যাচাই করে পরিবর্তন করুন' : 'Verify & Change Password'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {passwordError && (
                    <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-3xs font-medium flex items-center gap-1.5 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  {passwordChangeSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-3xs font-medium flex items-center gap-1.5 animate-in fade-in">
                      <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      <span>{isBn ? '✅ আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।' : '✅ Password successfully updated!'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 4: ALERTS & NOTIFICATIONS */}
          {/* ======================================================================= */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <BellRing className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {isBn ? 'মোবাইল ব্রাউজার পুশ নোটিফিকেশন' : 'Mobile Push Alerts'}
                    </p>
                    <p className="text-3xs text-slate-500 mt-0.5">
                      {pushStatus === 'granted'
                        ? (isBn ? '✅ সক্রিয় রয়েছে (পেমেন্ট ও চ্যাট মেসেজ তাৎক্ষণিক পাবেন)' : '✅ Active (Instant alerts on payment & chat)')
                        : (isBn ? 'নোটিফিকেশন চালু করুন যাতে কোনো গুরুত্বপূর্ণ নোটিশ মিস না হয়' : 'Enable notifications to never miss fund updates')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTogglePush}
                  disabled={testingPush}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 shadow-2xs"
                >
                  {pushStatus === 'granted' ? (isBn ? 'টেস্ট অ্যালার্ট' : 'Test Alert') : (isBn ? 'চালু করুন' : 'Enable')}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* 4. FOOTER: Account Switching & Logout Controls */}
        {/* ========================================================================= */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {onOpenAuthModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuthModal();
                }}
                className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? 'অন্য একাউন্টে সুইচ' : 'Switch Account'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>{isBn ? 'লগআউট' : 'Logout'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
