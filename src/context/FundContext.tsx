import React, { createContext, useContext, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  setDoc,
  getDocs,
  writeBatch,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  Member,
  MonthlyPayment,
  Investment,
  AppNotification,
  NotificationType,
  OverviewStats,
  YearStats,
  Fund
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_INVESTMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_FUND,
  DEFAULT_FUND_ID,
  DEFAULT_ADMIN_ID
} from '../data/seedData';
import { useAuth } from './AuthContext';
import { sortPaymentsChronologically } from '../utils/formatters';
import {
  checkAndDispatchAutomatedDueReminders,
  sendManualDueRemindersToAllUnpaid,
  getMonthlyPaymentStatus,
  getCurrentDueReminderSlotInfo,
  DueMemberStatus
} from '../utils/dueReminderEngine';

interface FundContextType {
  // Fund Metadata
  currentFund: Fund;
  allFunds: Fund[];
  createFund: (fundData: Partial<Fund>) => Promise<string>;
  updateFund: (fundId: string, updates: Partial<Fund>) => Promise<void>;
  transferFundAdmin: (
    fundId: string,
    newAdmin: {
      name: string;
      email: string;
      phone: string;
      password?: string;
      country?: string;
      memberId?: string;
      note?: string;
    }
  ) => Promise<void>;
  deleteFund: (fundId: string) => Promise<void>;
  switchFund: (fundId: string) => void;

  // Data Collections
  members: Member[];
  payments: MonthlyPayment[];
  investments: Investment[];
  notifications: AppNotification[];
  allRawNotifications: AppNotification[];
  unreadNotificationCount: number;

  // Overview Stats
  stats: OverviewStats;
  yearStats: YearStats;
  totalFundCapital: number;
  totalCollectedThisYear: number;
  totalInvestedAmount: number;
  activeMembersCount: number;

  // Year Selection
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  availableYears: number[];

  // CRUD Actions
  addMember: (memberData: Omit<Member, 'id' | 'fundId' | 'adminId'> & { username?: string; passwordPlain?: string }) => Promise<string>;
  updateMember: (id: string, updates: Partial<Member>) => Promise<void>;
  updateMemberPassword: (memberId: string, newPasswordPlain: string) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;

  addPayment: (paymentData: Omit<MonthlyPayment, 'id' | 'fundId' | 'adminId' | 'createdAt'>) => Promise<string>;
  deletePayment: (id: string) => Promise<void>;
  batchAddPayments: (paymentsList: Array<Omit<MonthlyPayment, 'id' | 'fundId' | 'adminId' | 'createdAt'>>) => Promise<void>;

  addInvestment: (invData: Omit<Investment, 'id' | 'fundId' | 'adminId' | 'createdAt'>) => Promise<string>;
  updateInvestment: (id: string, updates: Partial<Investment>) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;

  markNotificationAsRead: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  clearAllNotifications: () => Promise<void>;

  // Push Notifications & Audio
  requestPushPermissions: () => Promise<void>;
  pushPermissionStatus: string;
  sendCustomPushNotification: (notifData: {
    title: string;
    titleBn?: string;
    message: string;
    messageBn?: string;
    type?: NotificationType;
    targetAudience?: 'all' | 'admins' | 'members' | 'user' | 'due_members';
    targetUserId?: string;
    targetUserIds?: string[];
    targetUserName?: string;
    targetMemberNames?: string[];
    priority?: 'normal' | 'high' | 'urgent';
    link?: string;
    sound?: boolean;
    postToChatNotice?: boolean;
  }) => Promise<string>;

  // Automated & Manual Monthly Due Reminders
  triggerManualDueReminders: (customNote?: string) => Promise<{ count: number; dueMembersList: Member[] }>;
  monthlyPaymentStatus: {
    dueMembers: DueMemberStatus[];
    paidMembers: DueMemberStatus[];
    allStatuses: DueMemberStatus[];
    totalDueCount: number;
    totalPaidCount: number;
    slotInfo: ReturnType<typeof getCurrentDueReminderSlotInfo>;
  };

  // System & Utilities
  seedDatabase: (force?: boolean) => Promise<void>;
  loading: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const FundContext = createContext<FundContextType | undefined>(undefined);

// Helper to remove undefined values for Firestore writes
function cleanForFirestore<T extends Record<string, any>>(obj: T): T {
  const result: any = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== undefined) {
      if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
        result[key] = cleanForFirestore(val);
      } else {
        result[key] = val;
      }
    }
  }
  return result;
}

export const FundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeFundId, setActiveFundId, userSession, isAdmin } = useAuth();

  const [currentFund, setCurrentFund] = useState<Fund>(() => {
    try {
      const saved = localStorage.getItem(`udbhob_current_fund_${activeFundId}`);
      return saved ? JSON.parse(saved) : INITIAL_FUND;
    } catch {
      return INITIAL_FUND;
    }
  });
  const [allFunds, setAllFunds] = useState<Fund[]>([INITIAL_FUND]);
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem(`udbhob_members_${activeFundId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [payments, setPayments] = useState<MonthlyPayment[]>(() => {
    try {
      const saved = localStorage.getItem(`udbhob_payments_${activeFundId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [investments, setInvestments] = useState<Investment[]>(() => {
    try {
      const saved = localStorage.getItem(`udbhob_investments_${activeFundId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`udbhob_notifs_${activeFundId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Compute currently logged-in member from session
  const currentMember = useMemo(() => {
    if (!userSession) return null;
    return members.find(
      (m) =>
        m.id === userSession.memberId ||
        m.id === userSession.uid ||
        (userSession.phone && m.phone === userSession.phone) ||
        (userSession.username && m.username === userSession.username)
    ) || null;
  }, [members, userSession]);

  // Default year to current Gregorian year
  const currentYearNumber = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYearNumber);

  // Determine available years based on payments and current year
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>([2024, 2025, 2026, currentYearNumber]);
    payments.forEach((p) => {
      if (p.year) yearsSet.add(p.year);
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [payments, currentYearNumber]);

  // 1. Listen to Funds list in Firestore
  useEffect(() => {
    const fundsRef = collection(db, 'funds');
    const unsub = onSnapshot(
      fundsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const fundsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Fund));
          setAllFunds(fundsList);
          const active = fundsList.find((f) => f.id === activeFundId) || fundsList[0];
          if (active) setCurrentFund(active);
        } else {
          // Initialize default fund
          setDoc(doc(db, 'funds', DEFAULT_FUND_ID), INITIAL_FUND).catch((e) => console.warn('Init fund error:', e));
        }
      },
      (err) => console.warn('Funds snapshot error:', err)
    );

    return () => unsub();
  }, [activeFundId]);

  // 2. Real-time listener for Members (scoped to activeFundId with fallback)
  useEffect(() => {
    const membersRef = collection(db, 'members');
    const unsub = onSnapshot(
      membersRef,
      (snapshot) => {
        if (snapshot.empty && (!activeFundId || activeFundId === DEFAULT_FUND_ID || activeFundId === 'fund-main')) {
          // Seed initial data ONLY for the default demo fund
          seedDatabase(false);
          return;
        }
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Member));
        // Strict tenant isolation: Filter members by activeFundId with resilient fallbacks
        const filtered = data.filter((m) => {
          if (!activeFundId || activeFundId === DEFAULT_FUND_ID || activeFundId === 'fund-main' || activeFundId === 'fund-probashi-default') {
            return !m.fundId || m.fundId === DEFAULT_FUND_ID || m.fundId === 'fund-main' || m.fundId === 'fund-probashi-default' || (currentFund && m.fundId === currentFund.id);
          }
          return m.fundId === activeFundId || (currentFund && m.fundId === currentFund.id);
        });
        setMembers(filtered);
        setLoading(false);
        try {
          localStorage.setItem(`udbhob_members_${activeFundId}`, JSON.stringify(filtered));
        } catch {}
      },
      (err) => {
        console.warn('Members listener error:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [activeFundId, currentFund?.id]);

  // 3. Real-time listener for Payments (scoped to activeFundId with fallback)
  useEffect(() => {
    const paymentsRef = collection(db, 'payments');
    const unsub = onSnapshot(
      paymentsRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as MonthlyPayment));
        const filtered = data.filter((p) => {
          if (!activeFundId || activeFundId === DEFAULT_FUND_ID || activeFundId === 'fund-main' || activeFundId === 'fund-probashi-default') {
            return !p.fundId || p.fundId === DEFAULT_FUND_ID || p.fundId === 'fund-main' || p.fundId === 'fund-probashi-default' || (currentFund && p.fundId === currentFund.id);
          }
          return p.fundId === activeFundId || (currentFund && p.fundId === currentFund.id);
        });
        
        // Sort chronologically from newest to oldest (top to bottom)
        const sorted = sortPaymentsChronologically(filtered);

        setPayments(sorted);
        try {
          localStorage.setItem(`udbhob_payments_${activeFundId}`, JSON.stringify(sorted));
        } catch {}
      },
      (err) => console.warn('Payments listener error:', err)
    );

    return () => unsub();
  }, [activeFundId, currentFund?.id]);

  // 4. Auto-clean orphan payments if member does not exist in this fund anymore
  useEffect(() => {
    if (loading || members.length === 0 || payments.length === 0) return;

    const validMemberIds = new Set(members.map((m) => m.id));
    const validMemberNames = new Set(
      members.flatMap((m) => [m.name?.trim(), m.nameBn?.trim()].filter(Boolean) as string[])
    );
    const validUsernames = new Set(
      members.map((m) => m.username?.trim()).filter(Boolean) as string[]
    );

    const orphanPayments = payments.filter((p) => {
      const hasValidId = validMemberIds.has(p.memberId);
      const hasValidName = p.memberName ? validMemberNames.has(p.memberName.trim()) : false;
      const hasValidUser = p.memberId ? validUsernames.has(p.memberId.trim()) : false;
      return !hasValidId && !hasValidName && !hasValidUser;
    });

    if (orphanPayments.length > 0) {
      console.info(`Found ${orphanPayments.length} orphan payment(s) for non-existent members. Auto-cleaning...`);
      // Update local state
      setPayments((prev) =>
        prev.filter((p) => {
          const hasValidId = validMemberIds.has(p.memberId);
          const hasValidName = p.memberName ? validMemberNames.has(p.memberName.trim()) : false;
          const hasValidUser = p.memberId ? validUsernames.has(p.memberId.trim()) : false;
          return hasValidId || hasValidName || hasValidUser;
        })
      );

      // Clean up from Firestore in background
      orphanPayments.forEach((op) => {
        if (op.id) {
          deleteDoc(doc(db, 'payments', op.id)).catch((err) => {
            console.warn('Auto delete orphan payment error:', err);
          });
        }
      });
    }
  }, [members, loading, payments]);

  // 5. Real-time listener for Investments (scoped to activeFundId with fallback)
  useEffect(() => {
    const investmentsRef = collection(db, 'investments');
    const unsub = onSnapshot(
      investmentsRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Investment));
        const filtered = data.filter((i) => {
          if (!activeFundId || activeFundId === DEFAULT_FUND_ID || activeFundId === 'fund-main' || activeFundId === 'fund-probashi-default') {
            return !i.fundId || i.fundId === DEFAULT_FUND_ID || i.fundId === 'fund-main' || i.fundId === 'fund-probashi-default' || (currentFund && i.fundId === currentFund.id);
          }
          return i.fundId === activeFundId || (currentFund && i.fundId === currentFund.id);
        });
        setInvestments(filtered);
        try {
          localStorage.setItem(`udbhob_investments_${activeFundId}`, JSON.stringify(filtered));
        } catch {}
      },
      (err) => console.warn('Investments listener error:', err)
    );

    return () => unsub();
  }, [activeFundId, currentFund?.id]);

  // Register Service Worker for Web Push
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.debug('ServiceWorker registration note:', err);
      });
    }
  }, []);

  // Track initial mount time to prevent alerting old notifications
  const [mountedTime] = useState<number>(() => Date.now());
  const seenNotificationIdsRef = React.useRef<Set<string>>(new Set());

  // Trigger Native Device Push Notification (Web Push, Vibration & Sounds)
  const triggerDevicePushNotification = React.useCallback(
    (notif: {
      title: string;
      message: string;
      priority?: string;
      type?: string;
      sound?: boolean;
      link?: string;
    }) => {
      // 1. Play chime audio
      if (notif.sound !== false && soundEnabled) {
        playSoundEffect(notif.priority === 'urgent' ? 'investment' : 'payment');
      }

      // 2. Vibrate mobile phone (Android / Chrome)
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          if (notif.priority === 'urgent') {
            navigator.vibrate([300, 100, 300, 100, 300]);
          } else {
            navigator.vibrate([200, 100, 200]);
          }
        } catch {}
      }

      // 3. Native Push Notification (Desktop & Mobile Browser Heads-Up Alert)
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then((reg) => {
              (reg.showNotification as any)(notif.title, {
                body: notif.message,
                icon: '/udbhob_logo.svg',
                badge: '/udbhob_logo.svg',
                vibrate: notif.priority === 'urgent' ? [300, 100, 300] : [200, 100, 200],
                tag: `udbhob-${Date.now()}`,
                data: { url: notif.link || window.location.href },
              });
            });
          } else {
            new Notification(notif.title, {
              body: notif.message,
              icon: '/udbhob_logo.svg',
            });
          }
        } catch (err) {
          console.debug('Native notification pop error:', err);
        }
      }
    },
    [soundEnabled]
  );

  // 5. Real-time listener for Notifications (scoped to activeFundId with fallback)
  useEffect(() => {
    const notificationsRef = collection(db, 'notifications');
    const unsub = onSnapshot(
      notificationsRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AppNotification));
        const filtered = data.filter((n) => {
          if (!activeFundId || activeFundId === DEFAULT_FUND_ID || activeFundId === 'fund-main' || activeFundId === 'fund-probashi-default') {
            return !n.fundId || n.fundId === DEFAULT_FUND_ID || n.fundId === 'fund-main' || n.fundId === 'fund-probashi-default' || (currentFund && n.fundId === currentFund.id);
          }
          return n.fundId === activeFundId || (currentFund && n.fundId === currentFund.id);
        });
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setNotifications(filtered);

        // Check for new incoming notifications to trigger instant device push notification!
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const notif = { id: change.doc.id, ...change.doc.data() } as AppNotification;
            const notifTime = new Date(notif.timestamp).getTime();
            
            // Only trigger alert if notification is fresh (created after app mount or within last 45 seconds)
            if (notifTime > mountedTime - 45000 && !seenNotificationIdsRef.current.has(notif.id)) {
              seenNotificationIdsRef.current.add(notif.id);

              const currentUid = userSession?.uid;
              const currentMemberId = userSession?.memberId || currentMember?.id;
              const currentUsername = userSession?.username || currentMember?.username;
              const currentPhone = currentMember?.phone;

              // Audience check: Is this notification intended for the current user?
              const isTargetAdmin = notif.targetAudience === 'admins';
              const isTargetUserAudience = notif.targetAudience === 'user' || notif.targetAudience === 'due_members';
              
              const matchesThisUser = isTargetUserAudience && (
                (notif.targetUserId && (
                  notif.targetUserId === currentUid ||
                  notif.targetUserId === currentMemberId ||
                  notif.targetUserId === currentUsername ||
                  notif.targetUserId === currentPhone
                )) ||
                (Array.isArray(notif.targetUserIds) && (
                  (currentUid && notif.targetUserIds.includes(currentUid)) ||
                  (currentMemberId && notif.targetUserIds.includes(currentMemberId)) ||
                  (currentUsername && notif.targetUserIds.includes(currentUsername)) ||
                  (currentPhone && notif.targetUserIds.includes(currentPhone))
                ))
              );

              let shouldAlert = false;
              if (!notif.targetAudience || notif.targetAudience === 'all') {
                shouldAlert = true;
              } else if (isTargetAdmin && isAdmin) {
                shouldAlert = true;
              } else if (matchesThisUser) {
                shouldAlert = true;
              } else if (notif.targetAudience === 'members' && !isAdmin) {
                shouldAlert = true;
              }

              if (shouldAlert) {
                triggerDevicePushNotification({
                  title: notif.titleBn || notif.title,
                  message: notif.messageBn || notif.message,
                  priority: notif.priority || 'normal',
                  type: notif.type,
                  sound: notif.sound,
                  link: notif.link,
                });
              }
            }
          }
        });

        try {
          localStorage.setItem(`udbhob_notifs_${activeFundId}`, JSON.stringify(filtered));
        } catch {}
      },
      (err) => console.warn('Notifications listener error:', err)
    );

    return () => unsub();
  }, [activeFundId, currentFund?.id, isAdmin, userSession, currentMember, mountedTime, triggerDevicePushNotification]);

  // Automated Monthly Due Reminder Engine (Runs on 10th-15th at 8:00 AM & 8:00 PM for unpaid members)
  useEffect(() => {
    if (!activeFundId || members.length === 0) return;

    const runAutomatedDueCheck = async () => {
      try {
        await checkAndDispatchAutomatedDueReminders({
          fundId: activeFundId,
          members,
          payments,
          currentFund,
          userSession,
        });
      } catch (err) {
        console.warn('Automated due reminder scheduler error:', err);
      }
    };

    // Run first check 3 seconds after loading
    const timer = setTimeout(runAutomatedDueCheck, 3000);
    // Check every 3 minutes while application is open
    const interval = setInterval(runAutomatedDueCheck, 3 * 60 * 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [activeFundId, members, payments, currentFund, userSession]);

  // Compute live current month dues status
  const monthlyPaymentStatus = useMemo(() => {
    const now = new Date();
    const targetYear = now.getFullYear();
    const targetMonth = now.getMonth() + 1;
    const paymentStatus = getMonthlyPaymentStatus(members, payments, targetYear, targetMonth);
    const slotInfo = getCurrentDueReminderSlotInfo(now);

    return {
      ...paymentStatus,
      slotInfo,
    };
  }, [members, payments]);

  // Filter visible notifications for user
  const userVisibleNotifications = useMemo(() => {
    if (isAdmin) return notifications;
    const currentUid = userSession?.uid;
    const currentMemberId = userSession?.memberId || currentMember?.id;
    const currentUsername = userSession?.username || currentMember?.username;
    const currentPhone = currentMember?.phone;

    return notifications.filter((n) => {
      if (!n.targetAudience || n.targetAudience === 'all' || n.targetAudience === 'members') return true;
      if (n.targetAudience === 'admins') return false;
      if (n.targetAudience === 'user' || n.targetAudience === 'due_members') {
        if (n.targetUserId && (
          n.targetUserId === currentUid ||
          n.targetUserId === currentMemberId ||
          n.targetUserId === currentUsername ||
          n.targetUserId === currentPhone
        )) {
          return true;
        }
        if (Array.isArray(n.targetUserIds) && (
          (currentUid && n.targetUserIds.includes(currentUid)) ||
          (currentMemberId && n.targetUserIds.includes(currentMemberId)) ||
          (currentUsername && n.targetUserIds.includes(currentUsername)) ||
          (currentPhone && n.targetUserIds.includes(currentPhone))
        )) {
          return true;
        }
        return false;
      }
      return false;
    });
  }, [notifications, isAdmin, userSession, currentMember]);

  // Compute unread count based on visible notifications
  const unreadNotificationCount = useMemo(() => {
    return userVisibleNotifications.filter((n) => !n.read).length;
  }, [userVisibleNotifications]);

  // Play audio sound on notification / action
  const playSoundEffect = (type: 'payment' | 'investment' | 'success') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'payment') {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // Compute Top Dashboard Metric Cards
  const stats: OverviewStats = useMemo(() => {
    // 1. Total collected across all time
    const totalCollected = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // 2. Total invested
    const totalInvested = investments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

    // 3. Investment returns realized
    const totalReturnsRealized = investments
      .filter((i) => i.status === 'completed' || i.status === 'profitable')
      .reduce((sum, i) => sum + (Number(i.returnAmount) || 0), 0);

    // 4. Current Bank Balance = Total Collected - Total Invested + Total Returns Realized
    const currentBalance = totalCollected - totalInvested + totalReturnsRealized;

    // 5. Total Members
    const totalMembers = members.filter((m) => m.status === 'active').length;

    // 6. Current Selected Year Collected
    const currentYearCollected = payments
      .filter((p) => p.year === selectedYear)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // 7. Active / Completed investments count
    const activeInvestmentsCount = investments.filter((i) => i.status === 'active').length;
    const completedInvestmentsCount = investments.filter((i) => i.status === 'completed').length;
    const totalExpectedReturns = investments
      .filter((i) => i.status === 'active')
      .reduce((sum, i) => sum + (Number(i.expectedReturn) || Number(i.amount)), 0);

    return {
      totalCollected,
      totalInvested,
      currentBalance,
      totalMembers: totalMembers || members.length,
      currentYearCollected,
      activeInvestmentsCount,
      completedInvestmentsCount,
      totalExpectedReturns,
    };
  }, [payments, investments, members, selectedYear]);

  // Compute Year Specific Metrics & Completion Progress
  const yearStats: YearStats = useMemo(() => {
    const collectedInSelectedYear = payments
      .filter((p) => p.year === selectedYear)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const activeMembers = members.filter((m) => m.status === 'active');
    const memberPool = activeMembers.length > 0 ? activeMembers : members;
    const expectedInSelectedYear = memberPool.reduce(
      (sum, m) => sum + ((Number(m.monthlyShareAmount) || 1000) * 12),
      0
    );

    const completionPercentage =
      expectedInSelectedYear > 0
        ? Math.min(100, Math.round((collectedInSelectedYear / expectedInSelectedYear) * 100))
        : 0;

    const totalPaymentsCount = payments.filter((p) => p.year === selectedYear).length;

    return {
      collectedInSelectedYear,
      expectedInSelectedYear,
      completionPercentage,
      totalPaymentsCount,
    };
  }, [payments, members, selectedYear]);

  // Push notification permission state & request helper
  const [pushPermissionStatus, setPushPermissionStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const requestPushPermissions = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setPushPermissionStatus(permission);
      } catch (err) {
        console.warn('Push notification request error:', err);
      }
    }
  };

  // ---------------- Fund Management Actions ----------------
  const createFund = async (fundData: Partial<Fund>): Promise<string> => {
    const fundId = `fund-${Date.now()}`;
    const newFund: Fund = {
      id: fundId,
      name: fundData.name || 'প্রবাসী মুক্ত ফান্ড',
      nameBn: fundData.nameBn || fundData.name || 'প্রবাসী মুক্ত ফান্ড',
      description: fundData.description || 'প্রবাসী যৌথ সঞ্চয় ও হালাল বিনিয়োগ তহবিল',
      adminId: userSession?.adminId || DEFAULT_ADMIN_ID,
      adminEmail: userSession?.email || 'admin@probashi.fund',
      adminName: userSession?.displayName || 'ফান্ড এডমিন',
      currency: fundData.currency || 'BDT',
      defaultMonthlyAmount: fundData.defaultMonthlyAmount || 1000,
      createdAt: new Date().toISOString(),
      coverGradient: fundData.coverGradient || 'from-slate-900 via-slate-900 to-emerald-950',
      country: fundData.country || 'Saudi Arabia',
    };

    await setDoc(doc(db, 'funds', fundId), cleanForFirestore(newFund));
    setActiveFundId(fundId);
    setCurrentFund(newFund);

    // Post notification
    await addDoc(collection(db, 'notifications'), cleanForFirestore({
      fundId,
      adminId: newFund.adminId,
      title: 'New Fund Created',
      titleBn: `নতুন ফান্ড তৈরি হয়েছে: ${newFund.name}`,
      message: `Administrator created a new community fund "${newFund.name}".`,
      messageBn: `এডমিন সফলভাবে "${newFund.name}" ফান্ড তৈরি করেছেন।`,
      type: 'fund',
      timestamp: new Date().toISOString(),
      read: false,
    }));

    return fundId;
  };

  const updateFund = async (fundId: string, updates: Partial<Fund>) => {
    await updateDoc(doc(db, 'funds', fundId), cleanForFirestore(updates));
    if (currentFund.id === fundId) {
      setCurrentFund((prev) => ({ ...prev, ...updates }));
    }
  };

  const transferFundAdmin = async (
    fundId: string,
    newAdmin: {
      name: string;
      email: string;
      phone: string;
      password?: string;
      country?: string;
      memberId?: string;
      note?: string;
    }
  ) => {
    const cleanEmail = newAdmin.email.trim().toLowerCase();
    const cleanName = newAdmin.name.trim();
    const cleanPhone = newAdmin.phone.trim();
    const targetCountry = newAdmin.country || currentFund.country || 'Saudi Arabia';
    const previousAdminName = userSession?.displayName || currentFund.adminName || 'পূর্ববর্তী এডমিন';
    const newAdminId = newAdmin.memberId || `admin_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;

    // 1. Update Fund document in Firestore
    const fundUpdates: Partial<Fund> = {
      adminId: newAdminId,
      adminEmail: cleanEmail,
      adminName: cleanName,
      adminPhone: cleanPhone,
      country: targetCountry,
      lastAdminTransferAt: new Date().toISOString(),
      previousAdminName: previousAdminName,
    };

    await updateDoc(doc(db, 'funds', fundId), cleanForFirestore(fundUpdates));

    // 2. If newAdmin has a memberId or matches an existing member, update member's role to 'admin'
    let matchedMemberId = newAdmin.memberId;
    if (!matchedMemberId) {
      const existing = members.find(
        (m) => (m.email && m.email.toLowerCase() === cleanEmail) || (m.phone && m.phone === cleanPhone)
      );
      if (existing) matchedMemberId = existing.id;
    }

    if (matchedMemberId) {
      await updateDoc(doc(db, 'members', matchedMemberId), cleanForFirestore({
        role: 'admin',
        name: cleanName,
        nameBn: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        country: targetCountry,
        ...(newAdmin.password ? { passwordPlain: newAdmin.password } : {}),
      }));
    }

    // 3. Register or update new Admin record in Firestore 'admins'
    try {
      const adminDocId = `admin_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
      await setDoc(doc(db, 'admins', adminDocId), cleanForFirestore({
        id: adminDocId,
        email: cleanEmail,
        name: cleanName,
        phone: cleanPhone,
        fundId,
        fundName: currentFund.name,
        role: 'admin',
        transferredFrom: previousAdminName,
        transferredAt: new Date().toISOString(),
        note: newAdmin.note || 'প্রশাসনিক দায়িত্ব হস্তান্তর',
        createdAt: new Date().toISOString(),
      }), { merge: true });
    } catch (e) {
      console.warn('Could not write admin record to admins collection:', e);
    }

    // 4. Post system broadcast notification
    await addDoc(collection(db, 'notifications'), cleanForFirestore({
      fundId,
      title: 'Fund Admin Transferred',
      titleBn: 'ফান্ড এডমিন হস্তান্তর ও পরিবর্তন সম্পন্ন',
      message: `Fund leadership has been officially transferred from ${previousAdminName} to ${cleanName} (${cleanPhone}).`,
      messageBn: `ফান্ডের প্রশাসনিক দায়িত্ব ${previousAdminName} থেকে ${cleanName} (${cleanPhone})-কে সফলভাবে হস্তান্তর করা হয়েছে।`,
      type: 'fund',
      timestamp: new Date().toISOString(),
      read: false,
      metadata: {
        fundId,
      },
    }));

    // 5. Post system message to WhatsApp group chat
    try {
      await addDoc(collection(db, 'chat_messages'), cleanForFirestore({
        fundId,
        senderId: 'system',
        senderName: 'ফান্ড নোটিশ বোর্ড',
        senderRole: 'admin',
        type: 'notice',
        text: `👑 *ফান্ডের প্রশাসনিক দায়িত্ব হস্তান্তর সম্পন্ন!*\n\n🔹 *নতুন এডমিন:* ${cleanName}\n📱 *মোবাইল:* ${cleanPhone}\n📧 *ইমেইল:* ${cleanEmail}\n🌍 *দেশ:* ${targetCountry}\n\n👥 সদস্যদের সর্বসম্মতিক্রমে ${previousAdminName} থেকে নতুন এডমিনকে ফান্ডের যাবতীয় হিসাব ও প্রশাসনিক দায়িত্ব অর্পণ করা হয়েছে।`,
        timestamp: new Date().toISOString(),
      }));
    } catch (chatErr) {
      console.warn('Chat notification error on admin transfer:', chatErr);
    }

    // 6. Update local state
    setCurrentFund((prev) => ({ ...prev, ...fundUpdates }));
    setAllFunds((prev) => prev.map((f) => (f.id === fundId ? { ...f, ...fundUpdates } : f)));
  };

  const deleteFund = async (fundId: string): Promise<void> => {
    try {
      // 1. Delete fund document from Firestore
      await deleteDoc(doc(db, 'funds', fundId));

      // 2. Clean up members belonging to this fund
      const membersQuery = query(collection(db, 'members'), where('fundId', '==', fundId));
      const membersSnap = await getDocs(membersQuery);
      for (const mDoc of membersSnap.docs) {
        await deleteDoc(mDoc.ref);
      }

      // 3. Clean up payments belonging to this fund
      const paymentsQuery = query(collection(db, 'payments'), where('fundId', '==', fundId));
      const paymentsSnap = await getDocs(paymentsQuery);
      for (const pDoc of paymentsSnap.docs) {
        await deleteDoc(pDoc.ref);
      }

      // 4. Clean up investments belonging to this fund
      const invQuery = query(collection(db, 'investments'), where('fundId', '==', fundId));
      const invSnap = await getDocs(invQuery);
      for (const iDoc of invSnap.docs) {
        await deleteDoc(iDoc.ref);
      }

      // 5. Clean up notifications belonging to this fund
      const notifQuery = query(collection(db, 'notifications'), where('fundId', '==', fundId));
      const notifSnap = await getDocs(notifQuery);
      for (const nDoc of notifSnap.docs) {
        await deleteDoc(nDoc.ref);
      }

      // 6. Clean up chat messages belonging to this fund
      const chatQuery = query(collection(db, 'chat_messages'), where('fundId', '==', fundId));
      const chatSnap = await getDocs(chatQuery);
      for (const cDoc of chatSnap.docs) {
        await deleteDoc(cDoc.ref);
      }

      // 7. Update local state and switch to another fund if needed
      const remainingFunds = allFunds.filter((f) => f.id !== fundId);
      setAllFunds(remainingFunds);

      if (activeFundId === fundId || currentFund.id === fundId) {
        if (remainingFunds.length > 0) {
          const nextFund = remainingFunds[0];
          setActiveFundId(nextFund.id);
          setCurrentFund(nextFund);
        } else {
          // Fallback to default initial fund if last fund was deleted
          await setDoc(doc(db, 'funds', DEFAULT_FUND_ID), INITIAL_FUND);
          setActiveFundId(DEFAULT_FUND_ID);
          setCurrentFund(INITIAL_FUND);
          setAllFunds([INITIAL_FUND]);
        }
      }
    } catch (err) {
      console.error('Failed to delete fund:', err);
      throw err;
    }
  };

  const switchFund = (fundId: string) => {
    setActiveFundId(fundId);
    const target = allFunds.find((f) => f.id === fundId);
    if (target) setCurrentFund(target);
  };

  // ---------------- Member CRUD ----------------
  const addMember = async (
    memberData: Omit<Member, 'id' | 'fundId' | 'adminId'> & { username?: string; passwordPlain?: string }
  ): Promise<string> => {
    // Clean name fallback
    const rawName = memberData.name || memberData.nameBn || 'member';
    const cleanName = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const generatedUsername = memberData.username?.trim().toLowerCase() || `${cleanName || 'member'}_${Math.floor(100 + Math.random() * 900)}`;
    const generatedPassword = memberData.passwordPlain?.trim() || '123456';

    const effectiveFundId = currentFund?.id || activeFundId || DEFAULT_FUND_ID;

    const newMember: Omit<Member, 'id'> = {
      ...memberData,
      name: memberData.name || memberData.nameBn || 'Member',
      nameBn: memberData.nameBn || memberData.name || 'সদস্য',
      fundId: effectiveFundId,
      adminId: userSession?.adminId || userSession?.uid || currentFund?.adminId || DEFAULT_ADMIN_ID,
      username: generatedUsername,
      passwordPlain: generatedPassword,
      role: memberData.role || 'member',
      status: memberData.status || 'active',
      joinedDate: memberData.joinedDate || new Date().toISOString().split('T')[0],
      shares: Number(memberData.shares) || 1,
      monthlyShareAmount: Number(memberData.monthlyShareAmount) || currentFund.defaultMonthlyAmount || 1000,
    };

    const docRef = await addDoc(collection(db, 'members'), cleanForFirestore(newMember));

    // Post notification
    try {
      await addDoc(collection(db, 'notifications'), cleanForFirestore({
        fundId: effectiveFundId,
        adminId: userSession?.adminId || userSession?.uid || DEFAULT_ADMIN_ID,
        title: 'New Member Added',
        titleBn: `নতুন সদস্য যুক্ত হয়েছেন: ${newMember.nameBn || newMember.name}`,
        message: `${newMember.name} from ${newMember.country} joined ${currentFund.name} with username: ${generatedUsername}`,
        messageBn: `${newMember.nameBn || newMember.name} (${newMember.country}) ফান্ডে যুক্ত হয়েছেন। ইউজারনেম: ${generatedUsername}`,
        type: 'member',
        timestamp: new Date().toISOString(),
        read: false,
        metadata: { memberId: docRef.id },
      }));
    } catch (notifErr) {
      console.warn('Could not post member notification:', notifErr);
    }

    playSoundEffect('success');
    return docRef.id;
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    await updateDoc(doc(db, 'members', id), cleanForFirestore(updates));
  };

  const updateMemberPassword = async (id: string, newPasswordPlain: string) => {
    const cleanPass = newPasswordPlain.trim();
    if (!cleanPass) {
      throw new Error('পাসওয়ার্ড খালি রাখা যাবে না।');
    }
    await updateDoc(doc(db, 'members', id), { passwordPlain: cleanPass });

    const targetMember = members.find((m) => m.id === id);
    const memberName = targetMember?.nameBn || targetMember?.name || 'সদস্য';

    // Post notification
    try {
      await addDoc(collection(db, 'notifications'), cleanForFirestore({
        fundId: currentFund.id || DEFAULT_FUND_ID,
        adminId: userSession?.adminId || userSession?.uid || DEFAULT_ADMIN_ID,
        title: 'Member Password Updated',
        titleBn: `পাসওয়ার্ড পরিবর্তন: ${memberName}`,
        message: `Password for ${targetMember?.name || 'Member'} has been updated by Admin.`,
        messageBn: `এডমিন কর্তৃক ${memberName} (@${targetMember?.username || ''})-এর পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।`,
        type: 'member',
        timestamp: new Date().toISOString(),
        read: false,
        metadata: { memberId: id },
      }));
    } catch (notifErr) {
      console.warn('Could not post password update notification:', notifErr);
    }

    playSoundEffect('success');
  };

  const deleteMember = async (id: string) => {
    try {
      const targetMember = members.find((m) => m.id === id);
      const targetName = targetMember?.name?.trim();
      const targetNameBn = targetMember?.nameBn?.trim();
      const targetUsername = targetMember?.username?.trim();

      // 1. Delete member document from Firestore
      await deleteDoc(doc(db, 'members', id));

      // 2. Cascade delete all payment / transaction records belonging to this member in Firestore
      try {
        const paymentsRef = collection(db, 'payments');
        const paymentsSnap = await getDocs(paymentsRef);
        const deletePaymentPromises: Promise<void>[] = [];

        paymentsSnap.forEach((pDoc) => {
          const pData = pDoc.data();
          const matchesId = pData.memberId === id;
          const matchesName = Boolean(targetName && pData.memberName?.trim() === targetName);
          const matchesNameBn = Boolean(targetNameBn && pData.memberName?.trim() === targetNameBn);
          const matchesUser = Boolean(
            targetUsername &&
              (pData.memberId?.trim() === targetUsername || pData.username?.trim() === targetUsername)
          );

          if (matchesId || matchesName || matchesNameBn || matchesUser) {
            deletePaymentPromises.push(deleteDoc(pDoc.ref));
          }
        });

        await Promise.all(deletePaymentPromises);
      } catch (pErr) {
        console.warn('Error deleting associated member payments:', pErr);
      }

      // 3. Clean up related notifications for this member
      try {
        const notifSnap = await getDocs(collection(db, 'notifications'));
        const notifDeletePromises: Promise<void>[] = [];
        notifSnap.forEach((nDoc) => {
          const nData = nDoc.data();
          if (nData.metadata?.memberId === id) {
            notifDeletePromises.push(deleteDoc(nDoc.ref));
          }
        });
        await Promise.all(notifDeletePromises);
      } catch (nErr) {
        console.warn('Error deleting member notifications:', nErr);
      }

      // 4. Update local states immediately
      const updatedMembers = members.filter((m) => m.id !== id);
      const updatedPayments = payments.filter((p) => {
        const matchesId = p.memberId === id;
        const matchesName = Boolean(targetName && p.memberName?.trim() === targetName);
        const matchesNameBn = Boolean(targetNameBn && p.memberName?.trim() === targetNameBn);
        const matchesUser = Boolean(
          targetUsername &&
            (p.memberId?.trim() === targetUsername || (p as any).username?.trim() === targetUsername)
        );
        return !(matchesId || matchesName || matchesNameBn || matchesUser);
      });

      setMembers(updatedMembers);
      setPayments(updatedPayments);

      try {
        localStorage.setItem(`udbhob_members_${activeFundId}`, JSON.stringify(updatedMembers));
        localStorage.setItem(`udbhob_payments_${activeFundId}`, JSON.stringify(updatedPayments));
      } catch {}

      playSoundEffect('success');
    } catch (err) {
      console.error('Failed to delete member and associated transactions:', err);
      throw err;
    }
  };

  // ---------------- Payment CRUD ----------------
  const addPayment = async (
    paymentData: Omit<MonthlyPayment, 'id' | 'fundId' | 'adminId' | 'createdAt'>
  ): Promise<string> => {
    const now = new Date();
    const defaultTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const defaultDate = now.toISOString().split('T')[0];

    const newPayment: Omit<MonthlyPayment, 'id'> = {
      ...paymentData,
      fundId: currentFund.id || DEFAULT_FUND_ID,
      adminId: userSession?.adminId || userSession?.uid || DEFAULT_ADMIN_ID,
      amount: Number(paymentData.amount),
      year: Number(paymentData.year),
      month: Number(paymentData.month),
      paymentDate: paymentData.paymentDate || defaultDate,
      paymentTime: paymentData.paymentTime || defaultTime,
      receiptNumber: paymentData.receiptNumber || `PMF-${paymentData.year}-${String(paymentData.month).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: now.toISOString(),
      verified: true,
      createdBy: userSession?.displayName || 'Admin',
    };

    const docRef = await addDoc(collection(db, 'payments'), cleanForFirestore(newPayment));

    // Optimistically prepend to payments state sorted
    const createdObj: MonthlyPayment = { id: docRef.id, ...newPayment };
    setPayments((prev) => {
      const next = sortPaymentsChronologically([createdObj, ...prev.filter((p) => p.id !== docRef.id)]);
      try {
        localStorage.setItem(`udbhob_payments_${activeFundId}`, JSON.stringify(next));
      } catch {}
      return next;
    });

    // Month names in Bengali
    const monthNamesBn = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const monthName = monthNamesBn[paymentData.month - 1] || `Month ${paymentData.month}`;

    // Post notification
    try {
      await addDoc(collection(db, 'notifications'), cleanForFirestore({
        fundId: currentFund.id || DEFAULT_FUND_ID,
        adminId: userSession?.adminId || userSession?.uid || DEFAULT_ADMIN_ID,
        title: 'Payment Received',
        titleBn: `মাসিক সঞ্চয় জমা: ${paymentData.memberName}`,
        message: `${paymentData.memberName} paid ৳${paymentData.amount.toLocaleString()} for ${monthName} ${paymentData.year} via ${paymentData.paymentMethod}`,
        messageBn: `${paymentData.memberName} ${monthName} ${paymentData.year}-এর সঞ্চয় ৳${paymentData.amount.toLocaleString()} জমা দিয়েছেন (${paymentData.paymentMethod})।`,
        type: 'payment',
        timestamp: new Date().toISOString(),
        read: false,
        metadata: {
          memberId: paymentData.memberId,
          paymentId: docRef.id,
          amount: paymentData.amount,
        },
      }));
    } catch (notifErr) {
      console.warn('Could not post payment notification:', notifErr);
    }

    playSoundEffect('payment');
    return docRef.id;
  };

  const deletePayment = async (id: string) => {
    if (!id) return;
    const targetId = String(id).trim();

    try {
      // 1. Optimistically update local state immediately
      setPayments((prev) => {
        const updated = prev.filter((p) => String(p.id).trim() !== targetId);
        try {
          localStorage.setItem(`udbhob_payments_${activeFundId}`, JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // 2. Delete document from Firestore
      try {
        await deleteDoc(doc(db, 'payments', targetId));
      } catch (fErr) {
        console.warn('Firestore payment deleteDoc warning (item removed locally):', fErr);
      }

      playSoundEffect('success');
    } catch (err) {
      console.error('Failed to delete payment:', err);
      // Fallback state update
      setPayments((prev) => {
        const updated = prev.filter((p) => String(p.id).trim() !== targetId);
        try {
          localStorage.setItem(`udbhob_payments_${activeFundId}`, JSON.stringify(updated));
        } catch {}
        return updated;
      });
      playSoundEffect('success');
    }
  };

  const batchAddPayments = async (
    paymentsList: Array<Omit<MonthlyPayment, 'id' | 'fundId' | 'adminId' | 'createdAt'>>
  ) => {
    const now = new Date();
    const defaultTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const defaultDate = now.toISOString().split('T')[0];

    const batch = writeBatch(db);
    const addedItems: MonthlyPayment[] = [];

    paymentsList.forEach((p) => {
      const docRef = doc(collection(db, 'payments'));
      const itemData: Omit<MonthlyPayment, 'id'> = {
        ...p,
        fundId: currentFund.id || DEFAULT_FUND_ID,
        adminId: userSession?.adminId || userSession?.uid || DEFAULT_ADMIN_ID,
        paymentDate: p.paymentDate || defaultDate,
        paymentTime: p.paymentTime || defaultTime,
        createdAt: now.toISOString(),
        verified: true,
        createdBy: userSession?.displayName || 'Admin',
      };
      batch.set(docRef, cleanForFirestore(itemData));
      addedItems.push({ id: docRef.id, ...itemData });
    });

    await batch.commit();

    setPayments((prev) => {
      const next = sortPaymentsChronologically([...addedItems, ...prev]);
      try {
        localStorage.setItem(`udbhob_payments_${activeFundId}`, JSON.stringify(next));
      } catch {}
      return next;
    });

    playSoundEffect('payment');
  };

  // ---------------- Investment CRUD ----------------
  const addInvestment = async (
    investmentData: Omit<Investment, 'id' | 'fundId' | 'adminId'>
  ): Promise<string> => {
    const newInv: Omit<Investment, 'id'> = {
      ...investmentData,
      fundId: currentFund.id || DEFAULT_FUND_ID,
      adminId: userSession?.adminId || userSession?.uid || DEFAULT_ADMIN_ID,
      amount: Number(investmentData.amount),
      status: investmentData.status || 'active',
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'investments'), cleanForFirestore(newInv));

    // Post notification
    try {
      await addDoc(collection(db, 'notifications'), cleanForFirestore({
        fundId: currentFund.id || DEFAULT_FUND_ID,
        adminId: userSession?.adminId || userSession?.uid || DEFAULT_ADMIN_ID,
        title: 'New Investment Launched',
        titleBn: `নতুন বিনিয়োগ প্রকল্প: ${investmentData.title}`,
        message: `Venture "${investmentData.title}" launched with capital ৳${investmentData.amount.toLocaleString()}.`,
        messageBn: `"${investmentData.title}" প্রকল্পে ৳${investmentData.amount.toLocaleString()} বিনিয়োগ করা হয়েছে।`,
        type: 'investment',
        timestamp: new Date().toISOString(),
        read: false,
        metadata: { investmentId: docRef.id, amount: investmentData.amount },
      }));
    } catch (notifErr) {
      console.warn('Could not post investment notification:', notifErr);
    }

    playSoundEffect('investment');
    return docRef.id;
  };

  const updateInvestment = async (id: string, updates: Partial<Investment>) => {
    await updateDoc(doc(db, 'investments', id), cleanForFirestore(updates));
  };

  const deleteInvestment = async (id: string) => {
    await deleteDoc(doc(db, 'investments', id));
  };

  // ---------------- Notifications ----------------
  const markNotificationAsRead = async (id: string) => {
    await updateDoc(doc(db, 'notifications', id), { read: true });
  };

  const markAllNotificationsAsRead = async () => {
    const batch = writeBatch(db);
    notifications.filter((n) => !n.read).forEach((n) => {
      const docRef = doc(db, 'notifications', n.id);
      batch.update(docRef, { read: true });
    });
    await batch.commit();
  };

  const clearAllNotifications = async () => {
    const batch = writeBatch(db);
    notifications.forEach((n) => {
      const docRef = doc(db, 'notifications', n.id);
      batch.delete(docRef);
    });
    await batch.commit();
  };

  // Custom Push Notification Dispatcher (For Admin to send broadcast / custom push notifications)
  const sendCustomPushNotification = async (notifData: {
    title: string;
    titleBn?: string;
    message: string;
    messageBn?: string;
    type?: NotificationType;
    targetAudience?: 'all' | 'admins' | 'members' | 'user' | 'due_members';
    targetUserId?: string;
    targetUserIds?: string[];
    targetUserName?: string;
    targetMemberNames?: string[];
    priority?: 'normal' | 'high' | 'urgent';
    link?: string;
    sound?: boolean;
    postToChatNotice?: boolean;
  }): Promise<string> => {
    const effectiveFundId = currentFund?.id || activeFundId || DEFAULT_FUND_ID;
    const cleanTitle = notifData.title.trim();
    const cleanTitleBn = notifData.titleBn?.trim() || cleanTitle;
    const cleanMessage = notifData.message.trim();
    const cleanMessageBn = notifData.messageBn?.trim() || cleanMessage;
    const notifType = notifData.type || 'broadcast';
    const audience = notifData.targetAudience || 'all';
    const priority = notifData.priority || 'high';

    // If audience is due_members, find all currently unpaid members and populate targetUserIds
    let finalTargetUserId = notifData.targetUserId;
    let finalTargetUserIds = notifData.targetUserIds;
    let finalTargetUserName = notifData.targetUserName;

    if (audience === 'due_members') {
      const now = new Date();
      const { dueMembers } = getMonthlyPaymentStatus(members, payments, now.getFullYear(), now.getMonth() + 1);
      finalTargetUserIds = dueMembers.map((d) => d.member.id);
      finalTargetUserName = `বকেয়া সদস্যগণ (${dueMembers.length} জন)`;
    }

    const newNotif: Omit<AppNotification, 'id'> = {
      fundId: effectiveFundId,
      adminId: userSession?.adminId || userSession?.uid || DEFAULT_ADMIN_ID,
      senderName: userSession?.displayName || currentFund?.adminName || 'এডমিন',
      senderRole: userSession?.role || 'admin',
      title: cleanTitle,
      titleBn: cleanTitleBn,
      message: cleanMessage,
      messageBn: cleanMessageBn,
      type: notifType,
      targetAudience: audience,
      targetUserId: finalTargetUserId,
      targetUserIds: finalTargetUserIds,
      targetUserName: finalTargetUserName,
      targetMemberNames: notifData.targetMemberNames,
      priority: priority,
      sound: notifData.sound ?? true,
      link: notifData.link,
      timestamp: new Date().toISOString(),
      read: false,
      metadata: {
        badge: audience === 'due_members' ? 'বকেয়া রিমাইন্ডার' : priority === 'urgent' ? 'জরুরি' : 'নোটিশ',
      },
    };

    const docRef = await addDoc(collection(db, 'notifications'), cleanForFirestore(newNotif));

    // Optional post to chat notices board
    if (notifData.postToChatNotice) {
      try {
        await addDoc(collection(db, 'chat_messages'), cleanForFirestore({
          fundId: effectiveFundId,
          senderId: userSession?.uid || 'admin',
          senderName: userSession?.displayName || currentFund?.adminName || 'এডমিন',
          senderRole: 'admin',
          type: 'notice',
          text: `📢 *${cleanTitleBn}*\n\n${cleanMessageBn}${notifData.link ? `\n\n🔗 ${notifData.link}` : ''}`,
          timestamp: new Date().toISOString(),
        }));
      } catch (chatErr) {
        console.warn('Could not post notice to chat:', chatErr);
      }
    }

    // Trigger local push preview/vibration for sender
    triggerDevicePushNotification({
      title: cleanTitleBn,
      message: cleanMessageBn,
      priority: priority,
      type: notifType,
      sound: notifData.sound,
      link: notifData.link,
    });

    return docRef.id;
  };

  // Manual Trigger for Due Reminders (Admin 1-click dispatch)
  const triggerManualDueReminders = async (customNote?: string) => {
    const effectiveFundId = currentFund?.id || activeFundId || DEFAULT_FUND_ID;
    const res = await sendManualDueRemindersToAllUnpaid({
      fundId: effectiveFundId,
      members,
      payments,
      currentFund,
      userSession,
      customNote,
      targetYear: selectedYear,
      targetMonth: new Date().getMonth() + 1,
    });
    return res;
  };

  // ---------------- Seed Database ----------------
  const seedDatabase = async (force: boolean = false) => {
    try {
      setLoading(true);

      // Save initial fund
      await setDoc(doc(db, 'funds', DEFAULT_FUND_ID), INITIAL_FUND);

      // 1. Seed Members
      const membersSnap = await getDocs(collection(db, 'members'));
      if (membersSnap.empty || force) {
        // Clear old if force
        if (force) {
          for (const docItem of membersSnap.docs) {
            await deleteDoc(docItem.ref);
          }
        }

        const memberIds: string[] = [];
        for (const member of INITIAL_MEMBERS) {
          const docRef = await addDoc(collection(db, 'members'), {
            ...member,
            fundId: DEFAULT_FUND_ID,
            adminId: DEFAULT_ADMIN_ID,
          });
          memberIds.push(docRef.id);
        }

        // 2. Seed Payments for members (generate realistic records for 2024, 2025, 2026)
        if (force) {
          const oldPaymentsSnap = await getDocs(collection(db, 'payments'));
          for (const docItem of oldPaymentsSnap.docs) {
            await deleteDoc(docItem.ref);
          }
        }

        const paymentMethods = ['bKash', 'Nagad', 'Rocket', 'Bank Transfer', 'Remittance'] as const;
        const yearsToSeed = [2024, 2025, 2026];

        for (let i = 0; i < memberIds.length; i++) {
          const memberId = memberIds[i];
          const memberObj = INITIAL_MEMBERS[i];
          const monthlyAmount = memberObj.monthlyShareAmount;

          for (const year of yearsToSeed) {
            // For 2026, seed up to current month (e.g. month 1 and 2)
            const maxMonth = year === 2026 ? 2 : 12;
            for (let month = 1; month <= maxMonth; month++) {
              // 85% chance of paid, 15% unpaid for realistic diaspora data
              const isPaid = Math.random() > 0.12;
              if (isPaid) {
                const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                await addDoc(collection(db, 'payments'), {
                  fundId: DEFAULT_FUND_ID,
                  adminId: DEFAULT_ADMIN_ID,
                  memberId,
                  memberName: memberObj.nameBn || memberObj.name,
                  year,
                  month,
                  amount: monthlyAmount,
                  paymentDate: `${year}-${String(month).padStart(2, '0')}-${String(Math.floor(1 + Math.random() * 25)).padStart(2, '0')}`,
                  paymentMethod: method,
                  receiptNumber: `PMF-${year}-${String(month).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
                  transactionId: `TXN${Math.floor(10000000 + Math.random() * 90000000)}`,
                  verified: true,
                  createdAt: new Date().toISOString(),
                });
              }
            }
          }
        }

        // 3. Seed Investments
        if (force) {
          const oldInvSnap = await getDocs(collection(db, 'investments'));
          for (const docItem of oldInvSnap.docs) {
            await deleteDoc(docItem.ref);
          }
        }
        for (const inv of INITIAL_INVESTMENTS) {
          await addDoc(collection(db, 'investments'), {
            ...inv,
            fundId: DEFAULT_FUND_ID,
            adminId: DEFAULT_ADMIN_ID,
          });
        }

        // 4. Seed Notifications
        if (force) {
          const oldNotifSnap = await getDocs(collection(db, 'notifications'));
          for (const docItem of oldNotifSnap.docs) {
            await deleteDoc(docItem.ref);
          }
        }
        for (const notif of INITIAL_NOTIFICATIONS) {
          await addDoc(collection(db, 'notifications'), {
            ...notif,
            fundId: DEFAULT_FUND_ID,
            adminId: DEFAULT_ADMIN_ID,
          });
        }
      }
    } catch (err) {
      console.warn('Seed database error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FundContext.Provider
      value={{
        currentFund,
        allFunds,
        createFund,
        updateFund,
        transferFundAdmin,
        deleteFund,
        switchFund,
        members,
        payments,
        investments,
        notifications: userVisibleNotifications,
        allRawNotifications: notifications,
        unreadNotificationCount,
        stats,
        yearStats,
        totalFundCapital: stats.totalCollected || 0,
        totalCollectedThisYear: yearStats.collectedInSelectedYear || 0,
        totalInvestedAmount: stats.totalInvested || 0,
        activeMembersCount: members.length,
        selectedYear,
        setSelectedYear,
        availableYears,
        addMember,
        updateMember,
        updateMemberPassword,
        deleteMember,
        addPayment,
        deletePayment,
        batchAddPayments,
        addInvestment,
        updateInvestment,
        deleteInvestment,
        markNotificationAsRead,
        markNotificationRead: markNotificationAsRead,
        markAllNotificationsAsRead,
        markAllNotificationsRead: markAllNotificationsAsRead,
        clearAllNotifications,
        sendCustomPushNotification,
        triggerManualDueReminders,
        monthlyPaymentStatus,
        requestPushPermissions,
        pushPermissionStatus,
        seedDatabase,
        loading,
        soundEnabled,
        setSoundEnabled,
      }}
    >
      {children}
    </FundContext.Provider>
  );
};

export const useFund = () => {
  const context = useContext(FundContext);
  if (!context) {
    throw new Error('useFund must be used within a FundProvider');
  }
  return context;
};
