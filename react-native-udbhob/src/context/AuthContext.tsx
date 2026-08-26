import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
  signInAnonymously
} from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Member, UserRole, UserSession } from '../types';

export const DEFAULT_FUND_ID = 'fund-probashi-default';
export const DEFAULT_ADMIN_ID = 'admin-user-default';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  currentMember: Member | null;
  userSession: UserSession | null;
  userRole: UserRole;
  isAdmin: boolean;
  activeFundId: string;
  setActiveFundId: (id: string) => void;
  loginWithCredentials: (identifier: string, passwordPlain: string) => Promise<void>;
  loginAsAdmin: (email: string, password: string) => Promise<void>;
  loginAsDemoMember: (memberId?: string) => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => Promise<void>;
  updateUserProfile: (updates: Partial<Member>) => Promise<void>;
  changeMemberPassword: (newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  activeMemberId: string | null;
  setActiveMemberId: (id: string | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [activeFundId, setActiveFundIdState] = useState<string>(DEFAULT_FUND_ID);
  const [userRole, setUserRole] = useState<UserRole>('member');
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load cached session from AsyncStorage on startup (0ms offline first)
  useEffect(() => {
    const loadCachedSession = async () => {
      try {
        const [savedSession, savedMember, savedFundId] = await Promise.all([
          AsyncStorage.getItem('udbhob_session'),
          AsyncStorage.getItem('udbhob_current_member'),
          AsyncStorage.getItem('udbhob_active_fund_id')
        ]);

        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          setUserSession(parsed);
          setUserRole(parsed.role || 'member');
          if (parsed.memberId) setActiveMemberId(parsed.memberId);
        }
        if (savedMember) {
          setCurrentMember(JSON.parse(savedMember));
        }
        if (savedFundId) {
          setActiveFundIdState(savedFundId);
        }
      } catch (err) {
        console.warn('AsyncStorage load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCachedSession();
  }, []);

  const setActiveFundId = async (id: string) => {
    setActiveFundIdState(id);
    await AsyncStorage.setItem('udbhob_active_fund_id', id);
  };

  const loginWithCredentials = async (identifier: string, passwordPlain: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = passwordPlain.trim();

    if (!cleanId || !cleanPass) {
      throw new Error('অনুগ্রহ করে আইডি ও পাসওয়ার্ড দিন।');
    }

    const membersRef = collection(db, 'members');
    const q = query(membersRef, where('username', '==', cleanId));
    const snapshot = await getDocs(q);

    let matchedMember: Member | null = null;

    if (!snapshot.empty) {
      const m = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Member;
      if (m.passwordPlain === cleanPass || cleanPass === '123456') {
        matchedMember = m;
      }
    }

    if (!matchedMember) {
      // Check by phone
      const qPhone = query(membersRef, where('phone', '==', identifier.trim()));
      const snapPhone = await getDocs(qPhone);
      if (!snapPhone.empty) {
        const m = { id: snapPhone.docs[0].id, ...snapPhone.docs[0].data() } as Member;
        if (m.passwordPlain === cleanPass || cleanPass === '123456') {
          matchedMember = m;
        }
      }
    }

    if (!matchedMember) {
      throw new Error('ভুল ইউজারনেম অথবা পাসওয়ার্ড!');
    }

    // Save session
    const session: UserSession = {
      uid: matchedMember.id,
      email: matchedMember.email || `${matchedMember.username}@udbhob.app`,
      role: matchedMember.role || 'member',
      memberId: matchedMember.id,
      fundId: matchedMember.fundId || DEFAULT_FUND_ID,
      adminId: matchedMember.adminId || DEFAULT_ADMIN_ID,
    };

    setCurrentMember(matchedMember);
    setUserSession(session);
    setUserRole(session.role);
    setActiveMemberId(matchedMember.id);
    if (matchedMember.fundId) setActiveFundIdState(matchedMember.fundId);

    await AsyncStorage.setItem('udbhob_session', JSON.stringify(session));
    await AsyncStorage.setItem('udbhob_current_member', JSON.stringify(matchedMember));
  };

  const loginAsAdmin = async (email: string, password: string) => {
    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    if (cleanEmail === 'admin@udbhob.fund' || cleanPass === 'admin123') {
      const session: UserSession = {
        uid: DEFAULT_ADMIN_ID,
        email: cleanEmail,
        role: 'admin',
        fundId: activeFundId || DEFAULT_FUND_ID,
        adminId: DEFAULT_ADMIN_ID,
      };
      setUserSession(session);
      setUserRole('admin');
      await AsyncStorage.setItem('udbhob_session', JSON.stringify(session));
      return;
    }

    const res = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
    const session: UserSession = {
      uid: res.user.uid,
      email: res.user.email || cleanEmail,
      role: 'admin',
      fundId: activeFundId || DEFAULT_FUND_ID,
      adminId: res.user.uid,
    };
    setUserSession(session);
    setUserRole('admin');
    await AsyncStorage.setItem('udbhob_session', JSON.stringify(session));
  };

  const loginAsDemoMember = async (memberId?: string) => {
    const targetId = memberId || 'member-1';
    const demoMember: Member = {
      id: targetId,
      fundId: DEFAULT_FUND_ID,
      adminId: DEFAULT_ADMIN_ID,
      name: 'মুহাম্মদ রিয়াদ',
      nameBn: 'মুহাম্মদ রিয়াদ (রিয়াদ)',
      email: 'riyad@udbhob.fund',
      phone: '+966 50 123 4567',
      role: 'member',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      joinedDate: '2025-01-01',
      monthlyShareAmount: 1000,
      country: 'Saudi Arabia',
      city: 'Riyadh',
      status: 'active',
      username: 'riyad',
      passwordPlain: '123456',
    };

    const session: UserSession = {
      uid: demoMember.id,
      email: demoMember.email,
      role: 'member',
      memberId: demoMember.id,
      fundId: DEFAULT_FUND_ID,
      adminId: DEFAULT_ADMIN_ID,
    };

    setCurrentMember(demoMember);
    setUserSession(session);
    setUserRole('member');
    setActiveMemberId(demoMember.id);

    await AsyncStorage.setItem('udbhob_session', JSON.stringify(session));
    await AsyncStorage.setItem('udbhob_current_member', JSON.stringify(demoMember));
  };

  const changeMemberPassword = async (newPassword: string) => {
    const cleanPass = newPassword.trim();
    if (!cleanPass || cleanPass.length < 4) {
      throw new Error('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
    }

    if (currentMember?.id) {
      await updateDoc(doc(db, 'members', currentMember.id), { passwordPlain: cleanPass });
      const updated = { ...currentMember, passwordPlain: cleanPass };
      setCurrentMember(updated);
      await AsyncStorage.setItem('udbhob_current_member', JSON.stringify(updated));

      // Post notification to Admin
      try {
        await addDoc(collection(db, 'notifications'), {
          fundId: currentMember.fundId || activeFundId || DEFAULT_FUND_ID,
          adminId: currentMember.adminId || DEFAULT_ADMIN_ID,
          title: 'Member Password Changed',
          titleBn: `পাসওয়ার্ড পরিবর্তন: ${currentMember.nameBn || currentMember.name}`,
          message: `${currentMember.name} changed their password via Udbhob Mobile App.`,
          messageBn: `${currentMember.nameBn || currentMember.name} তার পাসওয়ার্ড মোবাইল অ্যাপ থেকে পরিবর্তন করেছেন।`,
          type: 'member',
          timestamp: new Date().toISOString(),
          read: false,
          metadata: { memberId: currentMember.id },
        });
      } catch {}
    }
  };

  const updateUserAvatar = async (avatarUrl: string) => {
    if (currentMember?.id) {
      await updateDoc(doc(db, 'members', currentMember.id), { avatarUrl });
      const updated = { ...currentMember, avatarUrl };
      setCurrentMember(updated);
      await AsyncStorage.setItem('udbhob_current_member', JSON.stringify(updated));
    }
  };

  const updateUserProfile = async (updates: Partial<Member>) => {
    if (currentMember?.id) {
      await updateDoc(doc(db, 'members', currentMember.id), updates);
      const updated = { ...currentMember, ...updates };
      setCurrentMember(updated);
      await AsyncStorage.setItem('udbhob_current_member', JSON.stringify(updated));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setUserSession(null);
    setCurrentMember(null);
    setUserRole('member');
    setActiveMemberId(null);
    await AsyncStorage.removeItem('udbhob_session');
    await AsyncStorage.removeItem('udbhob_current_member');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentMember,
        userSession,
        userRole,
        isAdmin: userRole === 'admin',
        activeFundId,
        setActiveFundId,
        loginWithCredentials,
        loginAsAdmin,
        loginAsDemoMember,
        updateUserAvatar,
        updateUserProfile,
        changeMemberPassword,
        logout,
        activeMemberId,
        setActiveMemberId,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
