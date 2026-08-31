import React, { useState, useRef } from 'react';
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
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFund } from '../context/FundContext';
import { requestNotificationPermission, getNotificationPermission, sendTestPushNotification } from '../utils/pushNotification';
import { COUNTRIES_LIST, getCountryFlag } from '../utils/formatters';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal?: () => void;
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
  language,
}) => {
  const { currentUser, currentMember, userSession, isAdmin, updateUserAvatar, updateUserProfile, changeUserPassword, logout } = useAuth();
  const { updateMember } = useFund();

  const isBn = language === 'bn';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string>(
    currentMember?.avatarUrl || userSession?.avatarUrl || PRESET_AVATARS[0]
  );
  const [nameBn, setNameBn] = useState<string>(currentMember?.nameBn || userSession?.displayName || '');
  const [nameEn, setNameEn] = useState<string>(currentMember?.name || '');
  const [phone, setPhone] = useState<string>(currentMember?.phone || '');
  const [city, setCity] = useState<string>(currentMember?.city || '');
  const [country, setCountry] = useState<string>(currentMember?.country || 'Saudi Arabia');
  
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

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pushStatus, setPushStatus] = useState<string>(() => getNotificationPermission());
  const [testingPush, setTestingPush] = useState(false);

  if (!isOpen) return null;

  // Compress & convert uploaded image to light base64 DataURL
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

  const handleSave = async (e: React.FormEvent) => {
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

      if (currentMember?.id) {
        await updateMember(currentMember.id, {
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
        onClose();
      }, 700);
    } catch (err) {
      console.warn('Profile save error:', err);
      setIsSaving(false);
    }
  };

  const handleTogglePush = async () => {
    setTestingPush(true);
    const perm = await requestNotificationPermission();
    setPushStatus(perm);
    if (perm === 'granted') {
      await sendTestPushNotification(isBn);
    }
    setTestingPush(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isBn ? 'প্রোফাইল ছবি ও তথ্য পরিবর্তন' : 'Edit Profile & Avatar'}
              </h3>
              <p className="text-2xs text-emerald-100/90">
                {isAdmin ? '🛡️ সিস্টেম এডমিন প্রোফাইল' : '🇸🇦 সদস্য প্রোফাইল সেটিংস'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs">

          {/* Logged in Account Status Card (Requested moved to profile) */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 rounded-2xl border border-emerald-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {currentMember?.avatarUrl ? (
                    <img
                      src={currentMember.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    (currentMember?.nameBn || currentMember?.name || userSession?.displayName || 'স').charAt(0)
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500 font-medium">লগইন আছেন:</span>
                    <span className="font-bold text-slate-900 text-xs truncate">
                      {currentMember?.nameBn || currentMember?.name || userSession?.displayName || 'অতিথি সদস্য'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-600 mt-0.5">
                    <span>{currentMember?.countryFlag || '🌐'}</span>
                    <span>{currentMember?.country || 'প্রবাসী'}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-emerald-700">
                      {isAdmin ? (isBn ? 'এডমিন' : 'Admin') : (isBn ? 'সদস্য' : 'Member')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons: Switch Account & Logout */}
            <div className="mt-2.5 pt-2.5 border-t border-emerald-200/60 flex items-center gap-2">
              {onOpenAuthModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal();
                  }}
                  className="flex-1 px-2.5 py-1.5 bg-white hover:bg-emerald-100/70 border border-emerald-300 text-emerald-800 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-98"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isBn ? 'অ্যাকাউন্ট সুইচ' : 'Switch Account'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-98"
                title={isBn ? 'লগআউট করুন' : 'Logout'}
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>{isBn ? 'লগআউট' : 'Logout'}</span>
              </button>
            </div>
          </div>
          
          {/* Avatar Upload Area */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
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
                className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-2xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Upload className="w-3 h-3" />
                <span>{isBn ? 'গ্যালারি / ক্যামেরা থেকে ছবি আপলোড' : 'Upload from Device'}</span>
              </button>
            </div>

            {/* Quick Avatar Presets */}
            <div className="mt-3.5 w-full">
              <p className="text-3xs text-slate-500 font-semibold mb-1.5 text-center">
                {isBn ? 'অথবা রেডিমেড অবতার সিলেক্ট করুন:' : 'Or choose a preset avatar:'}
              </p>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
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

          {/* Form Fields */}
          <div className="space-y-3">
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

            <div className="grid grid-cols-2 gap-3">
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
                  {isBn ? 'শহর / অবস্থান' : 'City / Location'}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Dubai / Riyadh"
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

          {/* Password Change Section (Self-Service with Current Password Verification) */}
          <div className="p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl border border-emerald-900/50 shadow-md">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 shadow-inner">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{isBn ? 'লগইন পাসওয়ার্ড পরিবর্তন' : 'Change Login Password'}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      {isAdmin ? (isBn ? '🛡️ এডমিন' : 'Admin') : (isBn ? '👤 সদস্য' : 'Member')}
                    </span>
                  </h4>
                  <p className="text-3xs text-emerald-200/70">
                    {currentMember?.username ? (
                      <span>ইউজারনেম: <strong className="text-white font-mono">@{currentMember.username}</strong></span>
                    ) : userSession?.email ? (
                      <span>ইমেইল: <strong className="text-white font-mono">{userSession.email}</strong></span>
                    ) : (
                      isBn ? 'বর্তমান পাসওয়ার্ড নিশ্চিত করে নতুন পাসওয়ার্ড সেট করুন' : 'Verify current password and set new password'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {!currentMember && !userSession && (!currentUser || currentUser.isAnonymous) ? (
              <div className="p-3 bg-amber-500/10 border border-amber-400/30 rounded-xl text-center space-y-2">
                <p className="text-2xs text-amber-200">
                  {isBn
                    ? '⚠️ পাসওয়ার্ড পরিবর্তন করতে অনুগ্রহ করে প্রথমে আপনার একাউন্টে লগইন করুন।'
                    : '⚠️ Please login to your account to change your password.'}
                </p>
                {onOpenAuthModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAuthModal();
                    }}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{isBn ? 'লগইন করুন' : 'Login Now'}</span>
                  </button>
                )}
              </div>
            ) : (
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
                      placeholder={isBn ? 'আপনার বর্তমান পাসওয়ার্ড লিখুন (ডিফল্ট: 123456)' : 'Enter your current password'}
                      className="w-full pl-8 pr-8 py-2 bg-white/10 border border-white/15 rounded-xl text-white placeholder-slate-400 text-xs font-mono focus:bg-white/20 focus:border-emerald-400 outline-none transition-all"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                      title={showCurrentPassword ? 'Hide password' : 'Show password'}
                    >
                      {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* New Password & Confirm Grid */}
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
                        title={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-slate-300 mb-1">
                      {isBn ? '৩. নতুন পাসওয়ার্ড নিশ্চিতকরণ *' : '3. Confirm New Password *'}
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
                        placeholder={isBn ? 'পুনরায় নতুন পাসওয়ার্ড' : 'Repeat new password'}
                        className="w-full pl-8 pr-8 py-2 bg-white/10 border border-white/15 rounded-xl text-white placeholder-slate-400 text-xs font-mono focus:bg-white/20 focus:border-emerald-400 outline-none transition-all"
                      />
                      <Check className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Action Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    disabled={isChangingPass || !currentPassword.trim() || !newPassword.trim()}
                    onClick={async () => {
                      if (!currentPassword.trim()) {
                        setPasswordError(isBn ? 'অনুগ্রহ করে বর্তমান পাসওয়ার্ডটি লিখুন।' : 'Please enter current password.');
                        return;
                      }
                      if (!newPassword.trim()) {
                        setPasswordError(isBn ? 'অনুগ্রহ করে নতুন পাসওয়ার্ডটি লিখুন।' : 'Please enter new password.');
                        return;
                      }
                      if (newPassword.trim().length < 6) {
                        setPasswordError(isBn ? 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'New password must be at least 6 characters.');
                        return;
                      }
                      if (confirmPassword.trim() && newPassword.trim() !== confirmPassword.trim()) {
                        setPasswordError(isBn ? 'নতুন পাসওয়ার্ড ও নিশ্চিতকরণ পাসওয়ার্ড মিলছে না!' : 'New passwords do not match.');
                        return;
                      }

                      setIsChangingPass(true);
                      setPasswordError(null);
                      setPasswordChangeSuccess(false);

                      try {
                        await changeUserPassword(currentPassword.trim(), newPassword.trim());
                        if (currentMember?.id) {
                          await updateMember(currentMember.id, { passwordPlain: newPassword.trim() });
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
                    className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isChangingPass ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{isBn ? 'যাচাই ও আপডেট হচ্ছে...' : 'Verifying & Updating...'}</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-3.5 h-3.5" />
                        <span>{isBn ? 'বর্তমান পাসওয়ার্ড যাচাই করে পাসওয়ার্ড পরিবর্তন করুন' : 'Verify & Change Password'}</span>
                      </>
                    )}
                  </button>
                </div>

                {passwordError && (
                  <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-3xs font-medium flex items-center gap-1.5 animate-in fade-in">
                  <X className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordChangeSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-3xs font-medium flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>{isBn ? '✅ অভিনন্দন! আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।' : '✅ Success! Your password has been changed.'}</span>
                </div>
              )}
            </div>
            )}
          </div>

          {/* Push Notification Section */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <BellRing className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-2xs font-bold text-slate-900">
                  {isBn ? 'ফোনে পুশ নোটিফিকেশন' : 'Mobile Push Alerts'}
                </p>
                <p className="text-3xs text-slate-500">
                  {pushStatus === 'granted'
                    ? (isBn ? '✅ সক্রিয় রয়েছে' : 'Active')
                    : (isBn ? 'মেসেজ ও জমার নোটিফিকেশন চালু করুন' : 'Enable chat & payment notifications')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTogglePush}
              disabled={testingPush}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-2xs font-bold cursor-pointer transition-colors shrink-0 shadow-2xs"
            >
              {pushStatus === 'granted' ? (isBn ? 'টেস্ট পাঠান' : 'Test Alert') : (isBn ? 'অন করুন' : 'Enable')}
            </button>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer transition-colors"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md flex items-center space-x-1.5 cursor-pointer transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{isBn ? 'সংরক্ষিত হয়েছে!' : 'Saved!'}</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isBn ? 'প্রোফাইল আপডেট করুন' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
