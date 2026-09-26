import React, { useState } from 'react';
import {
  X,
  Shield,
  User,
  Key,
  Mail,
  Lock,
  Building,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Info,
  KeyRound,
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFund } from '../context/FundContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'bn' | 'en';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, language }) => {
  const {
    loginWithCredentials,
    registerAdminWithFund,
    logout,
    userRole,
    isAdmin,
    userSession,
    currentUser
  } = useAuth();

  const { members, currentFund, createFund } = useFund();

  const [authMode, setAuthMode] = useState<'member' | 'admin' | 'create_fund'>('member');
  
  // Login form fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // New Fund registration fields
  const [fundName, setFundName] = useState('প্রবাসী মুক্ত ফান্ড');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isBn = language === 'bn';

  if (!isOpen) return null;

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!identifier.trim()) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে ইউজারনেম বা ইমেইল লিখুন।' : 'Please enter your username or email.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে পাসওয়ার্ড লিখুন।' : 'Please enter your password.');
      return;
    }

    try {
      setIsLoading(true);
      const targetRole = authMode === 'admin' ? 'admin' : 'member';
      const res = await loginWithCredentials(identifier, password, targetRole);
      setSuccessMsg(
        isBn
          ? `সফলভাবে লগইন হয়েছে! (${res.role === 'admin' ? 'এডমিন সেশন' : 'সদস্য সেশন'})`
          : `Successfully logged in as ${res.role}!`
      );
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || (isBn ? 'লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।' : 'Login failed. Please verify credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Create Fund and Admin Account
  const handleCreateFund = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fundName.trim()) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে ফান্ডের নাম লিখুন।' : 'Please enter Fund Name.');
      return;
    }
    if (!adminName.trim()) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter Admin Name.');
      return;
    }
    if (!adminEmail.trim() || !adminEmail.includes('@')) {
      setErrorMsg(isBn ? 'সঠিক ইমেইল ঠিকানা দিন।' : 'Please enter a valid email address.');
      return;
    }
    if (adminPassword.length < 6) {
      setErrorMsg(isBn ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }

    try {
      setIsLoading(true);
      await registerAdminWithFund(adminEmail, adminPassword, adminName, fundName);
      setSuccessMsg(isBn ? 'অভিনন্দন! নতুন ফান্ড ও এডমিন অ্যাকাউন্ট সফলভাবে সক্রিয় হয়েছে।' : 'New Fund and Admin account created successfully!');
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMsg(err.message || (isBn ? 'ফান্ড তৈরি করা যায়নি।' : 'Failed to create fund.'));
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Quick Member Login
  const handleQuickMemberSelect = (memberUsername: string) => {
    setIdentifier(memberUsername);
    setPassword('123456');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-5 text-white flex items-center justify-between relative">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <Shield className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold">
                {isBn ? 'প্রবাসী মুক্ত ফান্ড লগইন ও এক্সেস' : 'Probashi Fund Access & Auth'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {isBn
                ? 'এডমিন ও সদস্য লগইন - সকল ডাটা সুরক্ষিতভাবে ক্লাউডে সেভ থাকে'
                : 'Role-based access - Scoped to your Admin reference & Fund'}
            </p>
          </div>
          <button
            id="btn-close-auth-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Session Info Banner (if already logged in) */}
        {userSession && (
          <div className="bg-emerald-50 border-b border-emerald-200/80 px-5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-emerald-900">
                {isBn ? 'ব্যবহারকারী তথ্য:' : 'User Info:'}{' '}
                <strong className="font-bold text-emerald-950">
                  {userSession.displayName || (userSession.role === 'admin' ? currentFund?.adminName || 'এডমিন' : userSession.username)}
                </strong>{' '}
                <span className="text-[14px] text-amber-900 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-lg font-bold">
                  {userSession.role === 'admin' ? (isBn ? '🛡️ এডমিন হোল্ডার (Admin)' : '🛡️ Admin') : (isBn ? '👤 সদস্য' : '👤 Member')}
                </span>
                <span className="text-emerald-800 font-bold ml-1.5">
                  ({currentFund?.name || userSession?.fundName || 'প্রবাসী মুক্ত ফান্ড'})
                </span>
              </span>
            </div>
            <button
              onClick={async () => {
                await logout();
                setSuccessMsg(isBn ? 'লগআউট সম্পন্ন হয়েছে' : 'Logged out');
              }}
              className="text-rose-600 font-bold hover:underline cursor-pointer"
            >
              {isBn ? 'লগআউট করুন' : 'Sign Out'}
            </button>
          </div>
        )}

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1">
          <button
            id="tab-auth-member"
            type="button"
            onClick={() => {
              setAuthMode('member');
              setErrorMsg(null);
              setIdentifier('');
              setPassword('123456');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'member'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isBn ? 'সদস্য লগইন' : 'Member Login'}</span>
          </button>

          <button
            id="tab-auth-admin"
            type="button"
            onClick={() => {
              setAuthMode('admin');
              setErrorMsg(null);
              setIdentifier('admin');
              setPassword('123456');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'admin'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>{isBn ? 'এডমিন লগইন' : 'Admin Login'}</span>
          </button>

          <button
            id="tab-auth-create-fund"
            type="button"
            onClick={() => {
              setAuthMode('create_fund');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'create_fund'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isBn ? 'নতুন ফান্ড তৈরি' : 'Create Fund'}</span>
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-2 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. Member Login Flow */}
          {authMode === 'member' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  {isBn
                    ? 'এডমিনের দেওয়া ইউজারনেম ও পাসওয়ার্ড দিয়ে লগইন করুন। লগইন করার পর আপনার সকল সঞ্চয় ও ফান্ডের ব্যালেন্স দেখতে পাবেন।'
                    : 'Log in with the username & password provided by your Admin. Your session stays active until you sign out.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'ব্যবহারকারীর নাম / মোবাইল নম্বর / ইমেইল' : 'Username / Mobile / Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="input-member-username"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={isBn ? 'উদাঃ rafiq_dubai বা kadir_saudi' : 'e.g. rafiq_dubai'}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'পাসওয়ার্ড (Password)' : 'Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="input-member-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="******"
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="btn-submit-member-login"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isBn ? 'সদস্য প্যানেলে প্রবেশ করুন' : 'Sign in as Member'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. Admin Login Flow */}
          {authMode === 'admin' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-3 bg-slate-900 text-white rounded-2xl text-xs flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 text-2xs leading-relaxed">
                  {isBn
                    ? 'এডমিন একাউন্ট দিয়ে নতুন ফান্ড পরিচালনা, সদস্যদের ইউজারনেম ও পাসওয়ার্ড তৈরি, সঞ্চয় এন্ট্রি ও অনুমোদন করতে পারবেন। (Firebase Auth Secured)'
                    : 'Administrator credentials allow full fund management, user credential generation, investment tracking, and ledger audits.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'এডমিন ইমেইল (Firebase Admin Email)' : 'Admin Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="input-admin-username"
                    type="email"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'এডমিন পাসওয়ার্ড' : 'Admin Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="input-admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="******"
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="btn-submit-admin-login"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>{isBn ? 'এডমিন হিসেবে প্রবেশ করুন' : 'Enter Admin Panel'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. Create Fund & Register Admin */}
          {authMode === 'create_fund' && (
            <form onSubmit={handleCreateFund} className="space-y-3.5">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900">
                <p className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isBn ? 'নতুন প্রবাসী ফান্ড তৈরি করুন' : 'Create & Host a New Fund'}</span>
                </p>
                <p className="text-2xs text-emerald-700 mt-0.5">
                  {isBn
                    ? 'আপনার ফান্ডের নাম দিন এবং এডমিন অ্যাকাউন্ট সেট করুন। এরপর সদস্যদের ইউজারনেম তৈরি করে ফান্ডে যুক্ত করতে পারবেন।'
                    : 'Set your Fund Name and admin credentials. All subsequent members you add will be linked to your fund.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'ফান্ডের নাম (Fund Name)' : 'Fund Name'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    id="input-create-fund-name"
                    type="text"
                    required
                    value={fundName}
                    onChange={(e) => setFundName(e.target.value)}
                    placeholder={isBn ? 'উদাঃ প্রবাসী মুক্ত ফান্ড' : 'e.g. Probashi Mukto Fund'}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'আপনার নাম (Admin Name)' : 'Your Name'}
                  </label>
                  <input
                    id="input-create-admin-name"
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder={isBn ? 'মুহাম্মদ আব্দুল কাদির' : 'Abdul Kadir'}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'এডমিন ইমেইল' : 'Admin Email'}
                  </label>
                  <input
                    id="input-create-admin-email"
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="kadir@fund.com"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'এডমিন পাসওয়ার্ড' : 'Admin Password (min 6 chars)'}
                </label>
                <input
                  id="input-create-admin-password"
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="******"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                id="btn-submit-create-fund"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{isBn ? 'ফান্ড চালু করুন ও এডমিন হোন' : 'Launch Fund & Admin'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-2xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Firebase Cloud Firestore Powered</span>
          </span>
          <span>{isBn ? 'নিরাপদ ক্লাউড সেশন' : 'Encrypted Session'}</span>
        </div>
      </div>
    </div>
  );
};
