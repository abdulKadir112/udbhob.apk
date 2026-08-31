/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FundProvider, useFund } from './context/FundContext';
import { ChatProvider } from './context/ChatContext';
import { Navbar } from './components/Navbar';
import { OverviewCards } from './components/OverviewCards';
import { MonthlyPaymentMatrix } from './components/MonthlyPaymentMatrix';
import { TransactionLedger } from './components/TransactionLedger';
import { InvestmentSection } from './components/InvestmentSection';
import { AdminPanel } from './components/AdminPanel';
import { MemberDetailModal } from './components/MemberDetailModal';
import { NotificationCenter } from './components/NotificationCenter';
import { AuthModal } from './components/AuthModal';
import { AuthLandingPage } from './components/AuthLandingPage';
import { UserProfileModal } from './components/UserProfileModal';
import { FundProfileModal } from './components/FundProfileModal';
import { WhatsAppChatView } from './components/chat/WhatsAppChatView';
import { CallModal } from './components/chat/CallModal';
import { IncomingCallModal } from './components/chat/IncomingCallModal';
import { PermissionPromptModal } from './components/PermissionPromptModal';
import { Member, Investment } from './types';
import { formatBDT, toBengaliNumerals } from './utils/formatters';
import { requestNotificationPermission } from './utils/pushNotification';
import {
  Wallet,
  Shield,
  Users,
  TrendingUp,
  HeartHandshake,
  Sparkles,
  Info,
  Calendar,
  CheckCircle2,
  Lock,
  PlusCircle,
  ArrowRight,
  Clock,
  User,
  LogOut,
  MessageSquare,
  Coins,
} from 'lucide-react';

function MainApp() {
  const { members, payments, investments, selectedYear, loading, stats } = useFund();
  const { isAdmin, userSession, currentMember, logout } = useAuth();

  // Primary 2-tab navigation: 1st Chat (Active on Home Screen), 2nd Your Fund
  const [mainTab, setMainTab] = useState<'chat' | 'fund'>('chat');
  const [fundSubTab, setFundSubTab] = useState<'overview' | 'matrix' | 'ledger' | 'investments' | 'admin'>('overview');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);

  // Modals state
  const [selectedMemberForModal, setSelectedMemberForModal] = useState<Member | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isFundProfileModalOpen, setIsFundProfileModalOpen] = useState<boolean>(false);
  const [adminDefaultTab, setAdminDefaultTab] = useState<'payment' | 'investment' | 'transactions' | 'members'>('payment');
  const [showInitialPermissionModal, setShowInitialPermissionModal] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const alreadyHandled = localStorage.getItem('probashi_permissions_prompted');
      if (alreadyHandled === 'true') return false;
      if ('Notification' in window && Notification.permission === 'granted') return false;
      return true;
    }
    return false;
  });

  const isBn = language === 'bn';

  // Request all permissions automatically on first load / member login if not yet granted
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const alreadyHandled = localStorage.getItem('probashi_permissions_prompted');
      if (alreadyHandled !== 'true' && 'Notification' in window && Notification.permission !== 'granted') {
        setShowInitialPermissionModal(true);
      }
    }
  }, [userSession?.userId]);

  // Handler to open admin payment form
  const handleOpenAddPayment = () => {
    if (!isAdmin) {
      setMainTab('fund');
      setFundSubTab('matrix');
      return;
    }
    setAdminDefaultTab('payment');
    setMainTab('fund');
    setFundSubTab('admin');
  };

  // Handler to open admin investment form
  const handleOpenAddInvestment = () => {
    if (!isAdmin) {
      setMainTab('fund');
      setFundSubTab('investments');
      return;
    }
    setAdminDefaultTab('investment');
    setMainTab('fund');
    setFundSubTab('admin');
  };

  // Handler when clicking on a cell to add payment for specific member
  const handleOpenAddPaymentForMember = (memberId: string, month: number, year: number) => {
    if (!isAdmin) return;
    setAdminDefaultTab('payment');
    setMainTab('fund');
    setFundSubTab('admin');
  };

  // Derived data for Bento widgets
  const activeInvestments = investments.filter((i) => i.status === 'active');
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mb-4 animate-bounce">
          <Wallet className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">প্রবাসী মুক্ত ফান্ড (Probashi Mukto Fund)</h2>
        <p className="text-xs text-slate-400 mt-2 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>ক্লাউড সার্ভার ও চ্যাট নেটওয়ার্ক সিঙ্ক হচ্ছে...</span>
        </p>
      </div>
    );
  }

  // 1. If not logged in and not in guest mode, show the dedicated Auth Gateway Page
  if (!userSession && !isGuestMode) {
    return (
      <>
        <AuthLandingPage
          language={language}
          setLanguage={setLanguage}
          onContinueAsGuest={() => setIsGuestMode(true)}
        />
        {showInitialPermissionModal && (
          <PermissionPromptModal
            onComplete={() => setShowInitialPermissionModal(false)}
            isBn={isBn}
          />
        )}
      </>
    );
  }

  return (
    <div className={`${mainTab === 'chat' ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : 'min-h-screen overflow-y-auto'} bg-[#f3f4f6] text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white`}>
      {/* Top Navbar displayed in Fund view (contains chat switch tab, subtabs, year, etc.) */}
      {mainTab === 'fund' && (
        <Navbar
          mainTab={mainTab}
          setMainTab={setMainTab}
          fundSubTab={fundSubTab}
          setFundSubTab={setFundSubTab}
          onOpenAddPayment={handleOpenAddPayment}
          onOpenAddInvestment={handleOpenAddInvestment}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onOpenFundModal={() => setIsFundProfileModalOpen(true)}
          language={language}
          setLanguage={setLanguage}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />
      )}

      {/* ========================================================================= */}
      {/* 1ST MAIN TAB: COMMUNITY WHATSAPP CHAT (ACTIVE BY DEFAULT ON HOME SCREEN) */}
      {/* ========================================================================= */}
      {mainTab === 'chat' && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden animate-in fade-in duration-150">
          <WhatsAppChatView
            onNavigateToFund={() => setMainTab('fund')}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onOpenFundModal={() => setIsFundProfileModalOpen(true)}
            language={language}
            setLanguage={setLanguage}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2ND MAIN TAB: YOUR FUND (ড্যাশবোর্ড, ১২ মাসের সঞ্চয় চার্ট, বিনিয়োগ, এডমিন) */}
      {/* ========================================================================= */}
      {mainTab === 'fund' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          
          {/* Top 5-Column Bento Metric Cards on Fund Overview */}
          <OverviewCards
            language={language}
            onNavigateToMatrix={() => setFundSubTab('matrix')}
            onNavigateToInvestments={() => setFundSubTab('investments')}
          />

          {/* View Switcher Content based on fundSubTab */}
          {fundSubTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200 mt-2">
              
              {/* Full Width (100%) Member Payment Status Tracker */}
              <div className="w-full">
                <MonthlyPaymentMatrix
                  language={language}
                  onSelectMember={(member) => setSelectedMemberForModal(member)}
                  onOpenAddPaymentForMember={handleOpenAddPaymentForMember}
                />
              </div>

              {/* Bottom 2-Column Grid: Active Investments & Recent Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                
                {/* Bento Card 1: Active Investments (Dark Bento) */}
                <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                        <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                        <span>{isBn ? 'চলমান বিনিয়োগ' : 'Active Investments'}</span>
                      </h3>
                      <button
                        onClick={() => setFundSubTab('investments')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
                      >
                        {isBn ? 'সব প্রকল্প' : 'View All'}
                      </button>
                    </div>

                    {/* List of active ventures */}
                    <div className="space-y-3">
                      {activeInvestments.slice(0, 3).map((inv) => (
                        <div
                          key={inv.id}
                          className="bg-white/10 rounded-2xl border border-white/10 p-3.5 hover:bg-white/15 transition-all"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-xs sm:text-sm text-white line-clamp-1">
                              {inv.title}
                            </h4>
                            <span className="text-3xs bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                              {isBn ? 'চলমান' : 'Active'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-slate-300 mt-2">
                            <span className="font-mono text-emerald-400 font-bold">
                              {formatBDT(inv.amount, isBn)}
                            </span>
                            <span className="text-2xs text-slate-400">
                              {isBn ? `তত্ত্বাবধায়ক: ${inv.managerName}` : `Lead: ${inv.managerName}`}
                            </span>
                          </div>
                        </div>
                      ))}

                      {activeInvestments.length === 0 && (
                        <p className="text-xs text-slate-400 py-4 text-center">
                          {isBn ? 'কোন চলমান প্রকল্প নেই' : 'No active investments found'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Quick Stat and Action */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between relative z-10 text-xs">
                    <span className="text-slate-300 text-2xs sm:text-xs">
                      {isBn ? 'মোট সক্রিয় প্রকল্প:' : 'Active Ventures:'}{' '}
                      <strong className="text-white font-bold">{isBn ? toBengaliNumerals(stats.activeInvestmentsCount) : stats.activeInvestmentsCount}</strong>
                    </span>
                    {isAdmin ? (
                      <button
                        onClick={handleOpenAddInvestment}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>{isBn ? 'নতুন প্রকল্প' : 'New Venture'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setFundSubTab('investments')}
                        className="bg-white/15 hover:bg-white/25 text-white font-semibold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isBn ? 'সবগুলো দেখুন →' : 'View All →'}</span>
                      </button>
                    )}
                  </div>

                  {/* Atmospheric Emerald Blur Glow */}
                  <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />
                </div>

                {/* Bento Card 2: Recent Transactions (Live Sync) */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                      <span>{isBn ? 'সাম্প্রতিক লেনদেন' : 'Recent Transactions'}</span>
                    </h3>
                    <span className="text-3xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                      {isBn ? 'রিয়েল-টাইম' : 'Live Sync'}
                    </span>
                  </div>

                  {/* List of recent payment transactions */}
                  <div className="space-y-2.5 flex-1">
                    {recentPayments.map((pmt) => {
                      const member = members.find((m) => m.id === pmt.memberId);
                      return (
                        <div
                          key={pmt.id}
                          className="flex items-center justify-between text-xs py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-1 rounded-lg transition-colors cursor-pointer"
                          onClick={() => member && setSelectedMemberForModal(member)}
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <p className="font-semibold text-slate-800 truncate">
                              {member?.name || (isBn ? 'সাধারণ সদস্য' : 'Member')}
                            </p>
                            <p className="text-2xs text-slate-400">
                              {pmt.date} • {isBn ? `${toBengaliNumerals(pmt.year)} সাল` : `Year ${pmt.year}`}
                            </p>
                          </div>
                          <span className="font-bold font-mono text-emerald-600 shrink-0">
                            +{formatBDT(pmt.amount, isBn)}
                          </span>
                        </div>
                      );
                    })}

                    {recentPayments.length === 0 && (
                      <p className="text-xs text-slate-400 py-3 text-center">
                        {isBn ? 'কোন লেনদেন পাওয়া যায়নি' : 'No transactions recorded'}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setFundSubTab('ledger')}
                    className="mt-3 text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 pt-2.5 border-t border-slate-100 block w-full transition-colors cursor-pointer"
                  >
                    {isBn ? 'সকল সঞ্চয়ের লেজার দেখুন →' : 'View Full Ledger →'}
                  </button>
                </div>

              </div>
            </div>
          )}

          {fundSubTab === 'matrix' && (
            <div className="animate-in fade-in duration-200 mt-2">
              <MonthlyPaymentMatrix
                language={language}
                onSelectMember={(member) => setSelectedMemberForModal(member)}
                onOpenAddPaymentForMember={handleOpenAddPaymentForMember}
              />
            </div>
          )}

          {fundSubTab === 'ledger' && (
            <div className="animate-in fade-in duration-200 mt-2">
              <TransactionLedger
                language={language}
                onSelectMember={(member) => setSelectedMemberForModal(member)}
                onOpenAddPayment={handleOpenAddPayment}
              />
            </div>
          )}

          {fundSubTab === 'investments' && (
            <div className="animate-in fade-in duration-200 mt-2">
              <InvestmentSection
                language={language}
                onOpenAddInvestment={handleOpenAddInvestment}
              />
            </div>
          )}

          {fundSubTab === 'admin' && (
            <div className="animate-in fade-in duration-200 mt-2">
              <AdminPanel
                language={language}
                defaultTab={adminDefaultTab}
              />
            </div>
          )}
        </main>
      )}

      {/* Global Incoming & Active Call Modals for Audio & Video Calling */}
      <IncomingCallModal />
      <CallModal />

      {/* Modals & Drawers */}
      <MemberDetailModal
        member={selectedMemberForModal}
        payments={payments}
        selectedYear={selectedYear}
        onClose={() => setSelectedMemberForModal(null)}
        language={language}
      />

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        language={language}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        language={language}
      />

      <FundProfileModal
        isOpen={isFundProfileModalOpen}
        onClose={() => setIsFundProfileModalOpen(false)}
        language={language}
      />

      {/* Initial App Load Notification Permission Modal */}
      {showInitialPermissionModal && (
        <PermissionPromptModal
          onComplete={() => setShowInitialPermissionModal(false)}
          isBn={isBn}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FundProvider>
        <ChatProvider>
          <MainApp />
        </ChatProvider>
      </FundProvider>
    </AuthProvider>
  );
}
