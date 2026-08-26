import React, { useState } from 'react';
import {
  Shield,
  User,
  Lock,
  Mail,
  Building,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
  Wallet,
  Coins,
  ChevronRight,
  HeartHandshake,
  Check,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFund } from '../context/FundContext';
import { Member } from '../types';

interface AuthLandingPageProps {
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
  onContinueAsGuest?: () => void;
}

export const AuthLandingPage: React.FC<AuthLandingPageProps> = ({
  language,
  setLanguage,
  onContinueAsGuest,
}) => {
  const {
    loginWithCredentials,
    registerAdminWithFund,
    loginAsDemoAdmin,
    loginAsDemoMember,
    userSession,
  } = useAuth();

  const { members, currentFund } = useFund();

  const [activeTab, setActiveTab] = useState<'member_login' | 'admin_login' | 'admin_register'>('member_login');

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Admin registration form
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [fundName, setFundName] = useState('প্রবাসী মুক্ত ফান্ড');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isBn = language === 'bn';

  // Handle Member / Admin Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!identifier.trim()) {
      setErrorMessage(
        isBn
          ? 'অনুগ্রহ করে ইউজারনেম বা মোবাইল নম্বর লিখুন।'
          : 'Please enter your username or phone.'
      );
      return;
    }
    if (!password.trim()) {
      setErrorMessage(
        isBn ? 'অনুগ্রহ করে পাসওয়ার্ড দিন।' : 'Please enter your password.'
      );
      return;
    }

    try {
      setIsLoading(true);
      const targetRole = activeTab === 'admin_login' ? 'admin' : 'member';
      const res = await loginWithCredentials(identifier, password, targetRole);
      setSuccessMessage(
        isBn
          ? `সফলভাবে লগইন হয়েছে! (${res.role === 'admin' ? '🛡️ এডমিন প্যানেল' : '👤 সদস্য ড্যাশবোর্ড'})`
          : `Successfully logged in as ${res.role}!`
      );
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          (isBn
            ? 'লগইন ব্যর্থ হয়েছে। ইউজারনেম বা পাসওয়ার্ড যাচাই করুন।'
            : 'Login failed. Please check credentials.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Admin & Fund Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!adminName.trim()) {
      setErrorMessage(isBn ? 'আপনার নাম লিখুন।' : 'Please enter Admin Name.');
      return;
    }
    if (!adminEmail.trim() || !adminEmail.includes('@')) {
      setErrorMessage(isBn ? 'সঠিক ইমেইল ঠিকানা দিন।' : 'Please enter valid Email.');
      return;
    }
    if (adminPassword.length < 6) {
      setErrorMessage(
        isBn
          ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'
          : 'Password must be at least 6 characters.'
      );
      return;
    }
    if (!fundName.trim()) {
      setErrorMessage(isBn ? 'ফান্ডের নাম দিন।' : 'Please enter Fund Name.');
      return;
    }

    try {
      setIsLoading(true);
      await registerAdminWithFund(adminEmail, adminPassword, adminName, fundName);
      setSuccessMessage(
        isBn
          ? 'অভিনন্দন! আপনার নতুন ফান্ড ও এডমিন একাউন্ট সফলভাবে সক্রিয় হয়েছে।'
          : 'Congratulations! Fund and Admin account created successfully.'
      );
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          (isBn ? 'রেজিস্ট্রেশন করা যায়নি। আবার চেষ্টা করুন।' : 'Failed to register. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-Click login helper for testing
  const handleQuickMemberSelect = (username: string) => {
    setIdentifier(username);
    setPassword('123456');
    setActiveTab('member_login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Subtle glowing ambient lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand & Language Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-600/40">
            {(currentFund?.name || 'প্রবাসী মুক্ত ফান্ড').trim().charAt(0)}
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>{currentFund?.name || (isBn ? 'প্রবাসী মুক্ত ফান্ড' : 'Probashi Mukto Fund')}</span>
              <span className="text-3xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                Cloud Synced
              </span>
            </h1>
            <p className="text-2xs text-slate-400 font-medium">
              {isBn ? 'যৌথ সঞ্চয়, মাসিক সঞ্চয় লেজার ও হালাল বিনিয়োগ প্ল্যাটফর্ম' : 'Collaborative Diaspora Savings & Investment'}
            </p>
          </div>
        </div>

        {/* Language switch button */}
        <button
          onClick={() => setLanguage(isBn ? 'en' : 'bn')}
          className="bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isBn ? 'English' : 'বাংলা'}</span>
        </button>
      </header>

      {/* Main Hero & Auth Portal Card */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col justify-center items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Hero Pitch & Live Stats (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isBn ? 'প্রবাসী কমিউনিটি প্ল্যাটফর্ম' : 'Diaspora Community Fund'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {isBn
                  ? 'আপনার সঞ্চয় ও বিনিয়োগ এখন সম্পূর্ণ স্বচ্ছ ও সুরক্ষিত'
                  : 'Transparent, Secure & Halal Collaborative Savings'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                {isBn
                  ? 'দুবাই, সৌদি আরব, কুয়েত ও অন্যান্য দেশের প্রবাসীদের প্রতিমাসের সঞ্চয় জমা, লাইভ লেজার, রসিদ ও বিনিয়োগের হিসাব এক ক্লিকে দেখুন।'
                  : 'Manage monthly member deposits, real-time matrix status, payment receipts, and halal livestock/trade investments with ease.'}
              </p>

              {/* Feature Highlights */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start space-x-2.5 text-xs text-slate-200">
                  <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    <strong>{isBn ? 'সদস্য লগইন:' : 'Member Login:'}</strong>{' '}
                    {isBn ? 'এডমিনের দেওয়া ইউজারনেম দিয়ে আপনার জমা দেখুন' : 'Log in with assigned ID to track your payments'}
                  </span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-200">
                  <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    <strong>{isBn ? 'এডমিন কন্ট্রোল:' : 'Admin Control:'}</strong>{' '}
                    {isBn ? 'সদস্য যোগ, অটো ইউজারনেম তৈরি ও হোয়াটসঅ্যাপে বার্তা প্রদান' : 'Add members, auto-generate credentials & share'}
                  </span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-200">
                  <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    <strong>{isBn ? 'রিয়েল-টাইম ক্লাউড:' : 'Real-time Cloud:'}</strong>{' '}
                    {isBn ? 'Firebase Firestore ডাটাবেজে স্বয়ংক্রিয় সিঙ্ক' : 'Permanent Firestore Cloud database sync'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Auth Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 flex flex-col justify-between">
            <div>
              {/* Tab Navigation Header */}
              <div className="flex border-b border-slate-200 pb-3 gap-1 sm:gap-2">
                <button
                  id="tab-landing-member"
                  type="button"
                  onClick={() => {
                    setActiveTab('member_login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setIdentifier('');
                    setPassword('');
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'member_login'
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{isBn ? 'সদস্য লগইন' : 'Member Login'}</span>
                </button>

                <button
                  id="tab-landing-admin"
                  type="button"
                  onClick={() => {
                    setActiveTab('admin_login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setIdentifier('');
                    setPassword('');
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'admin_login'
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>{isBn ? 'এডমিন লগইন' : 'Admin Login'}</span>
                </button>

                <button
                  id="tab-landing-register"
                  type="button"
                  onClick={() => {
                    setActiveTab('admin_register');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'admin_register'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isBn ? 'নতুন এডমিন / ফান্ড' : 'Create Fund'}</span>
                </button>
              </div>

              {/* Status Alerts */}
              {errorMessage && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-2 text-xs text-rose-700 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2 text-xs text-emerald-800 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Form 1: Member Login */}
              {activeTab === 'member_login' && (
                <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-xs text-emerald-950">
                    <p className="font-bold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{isBn ? 'সদস্যদের জন্য লগইন পোর্টাল' : 'Diaspora Member Sign In'}</span>
                    </p>
                    <p className="text-2xs text-emerald-800 mt-1">
                      {isBn
                        ? 'এডমিন কর্তৃক প্রদত্ত ইউজারনেম বা মোবাইল নম্বর এবং পাসওয়ার্ড দিয়ে লগইন করুন।'
                        : 'Enter your assigned member username or mobile number and password to access the portal.'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBn ? 'ইউজারনেম / মোবাইল নম্বর' : 'Username / Phone Number'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="input-landing-member-user"
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={isBn ? 'উদাঃ rafiq_dubai বা 017xxxxxxxx' : 'e.g. rafiq_dubai'}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
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
                        id="input-landing-member-pass"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="******"
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
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
                    id="btn-landing-member-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-700/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{isBn ? 'হোম পেজে প্রবেশ করুন' : 'Sign in to Home Page'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Form 2: Admin Login */}
              {activeTab === 'admin_login' && (
                <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
                  <div className="p-3 bg-slate-900 rounded-2xl text-xs text-white">
                    <p className="font-bold flex items-center gap-1.5 text-amber-400">
                      <Shield className="w-3.5 h-3.5" />
                      <span>{isBn ? 'এডমিনিস্ট্রেটর পোর্টাল (Firebase Auth)' : 'Administrator Sign In (Firebase Auth)'}</span>
                    </p>
                    <p className="text-2xs text-slate-300 mt-1">
                      {isBn
                        ? 'আপনার আসল Firebase এডমিন ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন।'
                        : 'Sign in with your authentic Firebase Admin email and password.'}
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
                        id="input-landing-admin-user"
                        type="email"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="admin@example.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-medium"
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
                        id="input-landing-admin-pass"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="******"
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-mono"
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
                    id="btn-landing-admin-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-slate-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span>{isBn ? 'এডমিন হিসেবে ড্যাশবোর্ডে যান' : 'Enter as Administrator'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Form 3: Admin Registration & Fund Creation */}
              {activeTab === 'admin_register' && (
                <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
                    <p className="font-bold flex items-center gap-1 text-amber-800">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isBn ? 'নতুন এডমিন অ্যাকাউন্ট ও ফান্ড তৈরি' : 'Create New Fund & Admin Account'}</span>
                    </p>
                    <p className="text-2xs text-amber-700 mt-0.5">
                      {isBn
                        ? 'আপনার নাম, ইমেইল ও পাসওয়ার্ড দিয়ে রেজিস্ট্রেশন করুন। Firebase-এ স্বয়ংক্রিয়ভাবে আপনার ফান্ড তৈরি হবে।'
                        : 'Register to deploy a dedicated Fund container on Firestore.'}
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
                        id="input-landing-fund-name"
                        type="text"
                        required
                        value={fundName}
                        onChange={(e) => setFundName(e.target.value)}
                        placeholder={isBn ? 'উদাঃ প্রবাসী মুক্ত ফান্ড' : 'e.g. Probashi Mukto Fund'}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? 'এডমিন নাম' : 'Admin Name'}
                      </label>
                      <input
                        id="input-landing-admin-name"
                        type="text"
                        required
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        placeholder={isBn ? 'মুহাম্মদ আব্দুল কাদির' : 'Abdul Kadir'}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? 'এডমিন ইমেইল' : 'Admin Email'}
                      </label>
                      <input
                        id="input-landing-admin-email"
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="kadir@fund.com"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBn ? 'পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)' : 'Password (min 6 chars)'}
                    </label>
                    <input
                      id="input-landing-admin-reg-pass"
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="******"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white font-mono"
                    />
                  </div>

                  <button
                    id="btn-landing-register-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-amber-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>{isBn ? 'ফান্ড নিবন্ধন করুন ও প্রবেশ করুন' : 'Register Fund & Launch'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Bottom Guest Mode Explore Option */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Firebase Cloud Database Connected</span>
              </span>

              {onContinueAsGuest && (
                <button
                  onClick={onContinueAsGuest}
                  className="text-slate-600 hover:text-emerald-700 font-semibold underline flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{isBn ? 'অতিথি হিসেবে ড্যাশবোর্ড দেখুন' : 'Explore Dashboard as Guest'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-400">
        <p>
          {isBn
            ? 'প্রবাসী মুক্ত ফান্ড © ২০২৩-২০২৬ • বিশ্বস্ত যৌথ সঞ্চয় ও হালাল বিনিয়োগ প্ল্যাটফর্ম'
            : 'Probashi Mukto Fund © 2023-2026 • Diaspora Savings & Halal Investment'}
        </p>
      </footer>
    </div>
  );
};
