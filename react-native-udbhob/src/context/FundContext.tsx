import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Fund, Member, MonthlyPayment, Investment, AppNotification } from '../types';
import { useAuth, DEFAULT_FUND_ID, DEFAULT_ADMIN_ID } from './AuthContext';

interface FundContextType {
  currentFund: Fund;
  allFunds: Fund[];
  members: Member[];
  payments: MonthlyPayment[];
  investments: Investment[];
  notifications: AppNotification[];
  loading: boolean;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  availableYears: number[];
  
  // Actions
  addMember: (memberData: Omit<Member, 'id' | 'fundId' | 'adminId'> & { username?: string; passwordPlain?: string }) => Promise<string>;
  updateMember: (id: string, updates: Partial<Member>) => Promise<void>;
  updateMemberPassword: (memberId: string, newPasswordPlain: string) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;

  addPayment: (paymentData: Omit<MonthlyPayment, 'id' | 'fundId' | 'adminId' | 'createdAt'>) => Promise<string>;
  updatePayment: (id: string, updates: Partial<MonthlyPayment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;

  addInvestment: (invData: Omit<Investment, 'id' | 'fundId' | 'adminId'>) => Promise<string>;
  updateInvestment: (id: string, updates: Partial<Investment>) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;

  // Calculations
  totalFundCapital: number;
  totalCollectedThisYear: number;
  totalInvestedAmount: number;
  activeMembersCount: number;
}

const INITIAL_FUND: Fund = {
  id: DEFAULT_FUND_ID,
  name: 'Udbhob (উদ্ভব)',
  nameBn: 'উদ্ভব - বিনিয়োগে গড়ি নতুন সম্ভাবনা',
  description: 'প্রবাসীদের যৌথ সঞ্চয়, জরুরি সহযোগিতা ও দেশে লাভজনক হালাল যৌথ বিনিয়োগ তহবিল।',
  adminId: DEFAULT_ADMIN_ID,
  adminEmail: 'admin@udbhob.fund',
  adminName: 'মুহাম্মদ আব্দুল কাদির (রিয়াদ)',
  currency: 'BDT',
  defaultMonthlyAmount: 1000,
  establishedDate: '2025-01-01',
  coverGradient: 'from-slate-900 via-slate-900 to-emerald-950',
  country: 'Saudi Arabia',
  logoUrl: '/udbhob_logo.svg',
};

const FundContext = createContext<FundContextType | undefined>(undefined);

export const FundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeFundId, userSession } = useAuth();

  const [currentFund, setCurrentFund] = useState<Fund>(INITIAL_FUND);
  const [allFunds, setAllFunds] = useState<Fund[]>([INITIAL_FUND]);
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<MonthlyPayment[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Load offline cached data from AsyncStorage (0ms load time)
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const [savedFund, savedMembers, savedPayments, savedInvestments, savedNotifs] = await Promise.all([
          AsyncStorage.getItem(`rn_fund_${activeFundId}`),
          AsyncStorage.getItem(`rn_members_${activeFundId}`),
          AsyncStorage.getItem(`rn_payments_${activeFundId}`),
          AsyncStorage.getItem(`rn_investments_${activeFundId}`),
          AsyncStorage.getItem(`rn_notifs_${activeFundId}`),
        ]);

        if (savedFund) setCurrentFund(JSON.parse(savedFund));
        if (savedMembers) setMembers(JSON.parse(savedMembers));
        if (savedPayments) setPayments(JSON.parse(savedPayments));
        if (savedInvestments) setInvestments(JSON.parse(savedInvestments));
        if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
      } catch (e) {
        console.warn('Error reading cached fund data:', e);
      }
    };
    loadCachedData();
  }, [activeFundId]);

  // Real-time Firestore sync
  useEffect(() => {
    // 1. Members
    const membersRef = collection(db, 'members');
    const unsubMembers = onSnapshot(membersRef, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Member));
      const filtered = data.filter((m) => !m.fundId || m.fundId === activeFundId || m.fundId === DEFAULT_FUND_ID);
      setMembers(filtered);
      AsyncStorage.setItem(`rn_members_${activeFundId}`, JSON.stringify(filtered)).catch(() => {});
    });

    // 2. Payments
    const paymentsRef = collection(db, 'payments');
    const unsubPayments = onSnapshot(paymentsRef, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as MonthlyPayment));
      const filtered = data.filter((p) => !p.fundId || p.fundId === activeFundId || p.fundId === DEFAULT_FUND_ID);
      setPayments(filtered);
      AsyncStorage.setItem(`rn_payments_${activeFundId}`, JSON.stringify(filtered)).catch(() => {});
    });

    // 3. Investments
    const invRef = collection(db, 'investments');
    const unsubInvestments = onSnapshot(invRef, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Investment));
      const filtered = data.filter((i) => !i.fundId || i.fundId === activeFundId || i.fundId === DEFAULT_FUND_ID);
      setInvestments(filtered);
      AsyncStorage.setItem(`rn_investments_${activeFundId}`, JSON.stringify(filtered)).catch(() => {});
    });

    // 4. Notifications
    const notifRef = collection(db, 'notifications');
    const unsubNotifs = onSnapshot(notifRef, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppNotification));
      data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setNotifications(data);
      AsyncStorage.setItem(`rn_notifs_${activeFundId}`, JSON.stringify(data)).catch(() => {});
    });

    return () => {
      unsubMembers();
      unsubPayments();
      unsubInvestments();
      unsubNotifs();
    };
  }, [activeFundId]);

  // Actions
  const addMember = async (memberData: Omit<Member, 'id' | 'fundId' | 'adminId'> & { username?: string; passwordPlain?: string }) => {
    const generatedUsername = memberData.username?.trim().toLowerCase() || `member_${Math.floor(100 + Math.random() * 900)}`;
    const generatedPassword = memberData.passwordPlain?.trim() || '123456';

    const newMember = {
      ...memberData,
      fundId: activeFundId || DEFAULT_FUND_ID,
      adminId: userSession?.adminId || DEFAULT_ADMIN_ID,
      username: generatedUsername,
      passwordPlain: generatedPassword,
      role: memberData.role || 'member',
      status: memberData.status || 'active',
      joinedDate: memberData.joinedDate || new Date().toISOString().split('T')[0],
      avatarUrl: memberData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    };

    const docRef = await addDoc(collection(db, 'members'), newMember);
    return docRef.id;
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    await updateDoc(doc(db, 'members', id), updates);
  };

  const updateMemberPassword = async (id: string, newPasswordPlain: string) => {
    const cleanPass = newPasswordPlain.trim();
    if (!cleanPass) throw new Error('পাসওয়ার্ড খালি রাখা যাবে না।');
    await updateDoc(doc(db, 'members', id), { passwordPlain: cleanPass });
  };

  const deleteMember = async (id: string) => {
    await deleteDoc(doc(db, 'members', id));
  };

  const addPayment = async (paymentData: Omit<MonthlyPayment, 'id' | 'fundId' | 'adminId' | 'createdAt'>) => {
    const newPayment = {
      ...paymentData,
      fundId: activeFundId || DEFAULT_FUND_ID,
      adminId: userSession?.adminId || DEFAULT_ADMIN_ID,
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, 'payments'), newPayment);
    return docRef.id;
  };

  const updatePayment = async (id: string, updates: Partial<MonthlyPayment>) => {
    await updateDoc(doc(db, 'payments', id), updates);
  };

  const deletePayment = async (id: string) => {
    await deleteDoc(doc(db, 'payments', id));
  };

  const addInvestment = async (invData: Omit<Investment, 'id' | 'fundId' | 'adminId'>) => {
    const newInv = {
      ...invData,
      fundId: activeFundId || DEFAULT_FUND_ID,
      adminId: userSession?.adminId || DEFAULT_ADMIN_ID,
    };
    const docRef = await addDoc(collection(db, 'investments'), newInv);
    return docRef.id;
  };

  const updateInvestment = async (id: string, updates: Partial<Investment>) => {
    await updateDoc(doc(db, 'investments', id), updates);
  };

  const deleteInvestment = async (id: string) => {
    await deleteDoc(doc(db, 'investments', id));
  };

  // Calculations
  const totalCollectedThisYear = payments
    .filter((p) => p.year === selectedYear && p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalFundCapital = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalInvestedAmount = investments
    .filter((i) => i.status === 'active' || i.status === 'completed')
    .reduce((sum, i) => sum + (i.investedAmount || 0), 0);

  const activeMembersCount = members.filter((m) => m.status === 'active').length;

  const availableYears = [2024, 2025, 2026, 2027, 2028];

  return (
    <FundContext.Provider
      value={{
        currentFund,
        allFunds,
        members,
        payments,
        investments,
        notifications,
        loading,
        selectedYear,
        setSelectedYear,
        availableYears,
        addMember,
        updateMember,
        updateMemberPassword,
        deleteMember,
        addPayment,
        updatePayment,
        deletePayment,
        addInvestment,
        updateInvestment,
        deleteInvestment,
        totalFundCapital,
        totalCollectedThisYear,
        totalInvestedAmount,
        activeMembersCount,
      }}
    >
      {children}
    </FundContext.Provider>
  );
};

export const useFund = () => {
  const context = useContext(FundContext);
  if (!context) throw new Error('useFund must be used within a FundProvider');
  return context;
};
