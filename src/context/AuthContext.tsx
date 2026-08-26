import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInAnonymously,
  updatePassword
} from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, getDoc, updateDoc, addDoc, limit } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Member, UserRole, UserSession, Fund } from '../types';
import { cleanForFirestore } from '../utils/firestoreUtils';
import { DEFAULT_FUND_ID, INITIAL_MEMBERS } from '../data/seedData';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  currentMember: Member | null;
  userSession: UserSession | null;
  userRole: UserRole;
  isAdmin: boolean;
  activeFundId: string;
  setActiveFundId: (fundId: string) => void;
  loading: boolean;
  loginWithCredentials: (identifier: string, pass: string, preferredRole?: 'member' | 'admin') => Promise<{ success: boolean; role: UserRole; fundId?: string; member?: Member }>;
  registerAdminWithFund: (email: string, pass: string, adminName: string, fundName: string) => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
  loginAsDemoMember: (memberId?: string) => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => Promise<void>;
  updateUserProfile: (updates: Partial<Member>) => Promise<void>;
  changeMemberPassword: (newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  activeMemberId: string | null;
  setActiveMemberId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'probashi_fund_session_v4';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      // Invalidate any legacy v3 mock session
      localStorage.removeItem('probashi_fund_session_v3');
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure no dummy accounts exist
        if (parsed.uid === 'admin_master_001' || parsed.uid === 'DEFAULT_ADMIN_ID' || parsed.uid === 'demo-admin') {
          localStorage.removeItem(SESSION_STORAGE_KEY);
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [activeFundId, setActiveFundIdState] = useState<string>(() => {
    if (userSession?.fundId) return userSession.fundId;
    const saved = localStorage.getItem('probashi_active_fund_id');
    if (saved && saved !== 'fund-main') return saved;
    return DEFAULT_FUND_ID;
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    if (userSession?.role) return userSession.role;
    return 'member';
  });

  const [activeMemberId, setActiveMemberId] = useState<string | null>(() => {
    if (userSession?.memberId) return userSession.memberId;
    return localStorage.getItem('probashi_active_member_id') || null;
  });

  const [loading, setLoading] = useState(true);

  // Sync session state to storage
  const saveSession = (session: UserSession | null) => {
    setUserSession(session);
    if (session) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      localStorage.setItem('probashi_user_role', session.role);
      localStorage.setItem('probashi_active_fund_id', session.fundId);
      if (session.memberId) {
        localStorage.setItem('probashi_active_member_id', session.memberId);
      }
      setUserRole(session.role);
      setActiveFundIdState(session.fundId);
      setActiveMemberId(session.memberId || null);
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem('probashi_user_role');
      localStorage.removeItem('probashi_active_member_id');
      setUserRole('member');
      setActiveMemberId(null);
      setCurrentMember(null);
    }
  };

  const setActiveFundId = (id: string) => {
    setActiveFundIdState(id);
    localStorage.setItem('probashi_active_fund_id', id);
    if (userSession) {
      const updated = { ...userSession, fundId: id };
      setUserSession(updated);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user && !user.isAnonymous && user.email) {
        try {
          // Check if this Firebase Auth user is registered in the Firestore 'admins' collection
          const adminDocRef = doc(db, 'admins', user.uid);
          const adminDocSnap = await getDoc(adminDocRef);

          if (adminDocSnap.exists()) {
            const adminData = adminDocSnap.data();
            const session: UserSession = {
              uid: user.uid,
              username: user.email.split('@')[0],
              email: user.email,
              role: 'admin',
              fundId: adminData.fundId || `fund-${user.uid}`,
              fundName: adminData.fundName || 'প্রবাসী মুক্ত ফান্ড',
              adminId: user.uid,
              displayName: adminData.name || user.displayName || user.email,
            };
            saveSession(session);
          }
        } catch (e) {
          console.warn('Error loading admin profile from Firestore:', e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch full Member record if session has memberId
  useEffect(() => {
    const fetchMemberData = async () => {
      if (activeMemberId) {
        try {
          const docRef = doc(db, 'members', activeMemberId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setCurrentMember({ id: snap.id, ...snap.data() } as Member);
          }
        } catch (e) {
          console.warn('Error fetching member profile:', e);
        }
      } else {
        setCurrentMember(null);
      }
    };

    fetchMemberData();
  }, [activeMemberId]);

  /**
   * Strictly authenticate users via Firebase:
   * 1. If identifier contains '@' or looks like an email: authenticate directly with Firebase Auth (signInWithEmailAndPassword).
   * 2. If identifier is a member username or phone number: query Firestore 'members' collection.
   */
  const loginWithCredentials = async (
    identifier: string,
    pass: string,
    preferredRole?: 'member' | 'admin'
  ) => {
    const rawId = identifier.trim();
    const cleanId = rawId.toLowerCase();
    const strippedAtId = cleanId.startsWith('@') ? cleanId.substring(1) : cleanId;
    const phoneDigits = rawId.replace(/[^0-9]/g, '');
    const cleanPass = pass.trim();

    if (!cleanId) {
      throw new Error('অনুগ্রহ করে ইউজারনেম, ফোন নম্বর অথবা ইমেইল লিখুন।');
    }
    if (!cleanPass) {
      throw new Error('অনুগ্রহ করে পাসওয়ার্ড লিখুন।');
    }

    // 1. If preferredRole is 'member' or not specified: ALWAYS check Member database first!
    if (preferredRole !== 'admin') {
      let matchedMember: Member | null = null;

      try {
        const membersRef = collection(db, 'members');

        // Query 1: by username without '@'
        if (strippedAtId) {
          const q1 = query(membersRef, where('username', '==', strippedAtId));
          const snap1 = await getDocs(q1);
          if (!snap1.empty) {
            matchedMember = { id: snap1.docs[0].id, ...snap1.docs[0].data() } as Member;
          }
        }

        // Query 2: by username with '@' or exact cleanId
        if (!matchedMember && cleanId) {
          const q2 = query(membersRef, where('username', '==', cleanId));
          const snap2 = await getDocs(q2);
          if (!snap2.empty) {
            matchedMember = { id: snap2.docs[0].id, ...snap2.docs[0].data() } as Member;
          }
        }

        // Query 3: by email
        if (!matchedMember && cleanId.includes('@')) {
          const q3 = query(membersRef, where('email', '==', cleanId));
          const snap3 = await getDocs(q3);
          if (!snap3.empty) {
            matchedMember = { id: snap3.docs[0].id, ...snap3.docs[0].data() } as Member;
          }
        }

        // Query 4: by phone (exact)
        if (!matchedMember && rawId) {
          const q4 = query(membersRef, where('phone', '==', rawId));
          const snap4 = await getDocs(q4);
          if (!snap4.empty) {
            matchedMember = { id: snap4.docs[0].id, ...snap4.docs[0].data() } as Member;
          }
        }

        // Query 5: Full scan of existing members in Firestore for case-insensitive / digit / name matching
        if (!matchedMember) {
          const allMembersSnap = await getDocs(query(membersRef, limit(250)));
          if (!allMembersSnap.empty) {
            const allMembers = allMembersSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Member));
            matchedMember =
              allMembers.find((m) => {
                const mUser = (m.username || '').toLowerCase().trim();
                const mUserStripped = mUser.startsWith('@') ? mUser.substring(1) : mUser;
                const mEmail = (m.email || '').toLowerCase().trim();
                const mPhone = (m.phone || '').trim();
                const mPhoneDigits = mPhone.replace(/[^0-9]/g, '');
                const mName = (m.name || '').toLowerCase().trim();
                const mNameBn = (m.nameBn || '').trim();

                return (
                  (strippedAtId && mUserStripped === strippedAtId) ||
                  (cleanId && mUser === cleanId) ||
                  (cleanId && mEmail === cleanId) ||
                  (rawId && mPhone === rawId) ||
                  (phoneDigits.length >= 6 && mPhoneDigits === phoneDigits) ||
                  (phoneDigits.length >= 6 && mPhoneDigits.endsWith(phoneDigits)) ||
                  (phoneDigits.length >= 6 && phoneDigits.endsWith(mPhoneDigits)) ||
                  (cleanId && mName === cleanId) ||
                  (rawId && mNameBn === rawId)
                );
              }) || null;
          }
        }
      } catch (err: any) {
        console.warn('Firestore member query error:', err);
      }

      // Query 6: Local seed data fallback (for fresh deployments or network glitch)
      if (!matchedMember) {
        const seedFound = INITIAL_MEMBERS.find((m) => {
          const mUser = (m.username || '').toLowerCase().trim();
          const mUserStripped = mUser.startsWith('@') ? mUser.substring(1) : mUser;
          const mEmail = (m.email || '').toLowerCase().trim();
          const mPhone = (m.phone || '').trim();
          const mPhoneDigits = mPhone.replace(/[^0-9]/g, '');
          const mName = (m.name || '').toLowerCase().trim();
          const mNameBn = (m.nameBn || '').trim();

          return (
            (strippedAtId && mUserStripped === strippedAtId) ||
            (cleanId && mUser === cleanId) ||
            (cleanId && mEmail === cleanId) ||
            (rawId && mPhone === rawId) ||
            (phoneDigits.length >= 6 && mPhoneDigits === phoneDigits) ||
            (phoneDigits.length >= 6 && mPhoneDigits.endsWith(phoneDigits)) ||
            (phoneDigits.length >= 6 && phoneDigits.endsWith(mPhoneDigits)) ||
            (cleanId && mName === cleanId) ||
            (rawId && mNameBn === rawId)
          );
        });

        if (seedFound) {
          matchedMember = { id: `seed_mem_${seedFound.username}`, ...seedFound } as Member;
        }
      }

      // If Member is found -> verify password!
      if (matchedMember) {
        const expectedPass = (matchedMember.passwordPlain || '123456').trim();
        if (cleanPass !== expectedPass) {
          throw new Error(
            `ভুল পাসওয়ার্ড! "${matchedMember.nameBn || matchedMember.name}" সদস্যের সঠিক পাসওয়ার্ড দিন (এডমিন থেকে প্রাপ্ত পাসওয়ার্ড বা ডিফল্ট: 123456)।`
          );
        }

        // Authenticate anonymously if not logged in to satisfy Firestore security rules
        try {
          if (!auth.currentUser) {
            await signInAnonymously(auth);
          }
        } catch {
          // ignore
        }

        const session: UserSession = {
          uid: matchedMember.id,
          username: matchedMember.username || strippedAtId,
          email: matchedMember.email,
          role: matchedMember.role || 'member',
          memberId: matchedMember.id,
          fundId: matchedMember.fundId || activeFundId || DEFAULT_FUND_ID,
          fundName: 'প্রবাসী মুক্ত ফান্ড',
          adminId: matchedMember.adminId || 'admin',
          displayName: matchedMember.nameBn || matchedMember.name,
          avatarUrl: matchedMember.avatarUrl,
        };

        saveSession(session);
        setCurrentMember(matchedMember);
        return { success: true, role: matchedMember.role || 'member', fundId: session.fundId, member: matchedMember };
      }

      // If user explicitly clicked "Member Login" tab and was not found:
      if (preferredRole === 'member') {
        throw new Error(
          'ফায়ারবেস ডাটাবেসে এই ইউজারনেম বা মোবাইল নম্বরে কোনো সদস্য পাওয়া যায়নি। অনুগ্রহ করে সঠিক ইউজারনেম দিন অথবা এডমিন প্যানেলে সদস্য যোগ করার পর লগইন করুন।'
        );
      }
    }

    // 2. Admin Authentication via Firebase Authentication (if preferredRole is 'admin' or if input is a valid email)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanId);

    if (preferredRole === 'admin' || isEmail) {
      if (!cleanId.includes('@')) {
        throw new Error('এডমিন হিসেবে লগইন করতে আপনার সঠিক এডমিন ইমেইল দিন (যেমন: admin@gmail.com)।');
      }

      try {
        const userCred = await signInWithEmailAndPassword(auth, cleanId, cleanPass);
        const uid = userCred.user.uid;

        // Check if user is an Admin in Firestore
        const adminDocRef = doc(db, 'admins', uid);
        const adminDocSnap = await getDoc(adminDocRef);

        let fundId = `fund-${uid}`;
        let fundName = 'প্রবাসী মুক্ত ফান্ড';
        let adminDisplayName = userCred.user.displayName || cleanId.split('@')[0];

        if (adminDocSnap.exists()) {
          const adminData = adminDocSnap.data();
          fundId = adminData.fundId || fundId;
          fundName = adminData.fundName || fundName;
          adminDisplayName = adminData.name || adminDisplayName;
        } else {
          // Check query by email in admins collection
          const adminQuery = query(collection(db, 'admins'), where('email', '==', cleanId));
          const adminSnap = await getDocs(adminQuery);
          if (!adminSnap.empty) {
            const adminData = adminSnap.docs[0].data();
            fundId = adminData.fundId || fundId;
            fundName = adminData.fundName || fundName;
            adminDisplayName = adminData.name || adminDisplayName;
          }
        }

        const session: UserSession = {
          uid,
          username: cleanId.split('@')[0],
          email: cleanId,
          role: 'admin',
          fundId,
          fundName,
          adminId: uid,
          displayName: adminDisplayName,
        };

        saveSession(session);
        return { success: true, role: 'admin' as UserRole, fundId };
      } catch (authErr: any) {
        if (
          authErr.code === 'auth/user-not-found' ||
          authErr.code === 'auth/invalid-credential' ||
          authErr.code === 'auth/wrong-password'
        ) {
          throw new Error(
            'ফায়ারবেসে এই ইমেইল বা পাসওয়ার্ডে কোনো এডমিন একাউন্ট পাওয়া যায়নি। অনুগ্রহ করে সঠিক এডমিন ইমেইল/পাসওয়ার্ড দিন অথবা "নতুন এডমিন রেজিস্টার" থেকে একাউন্ট তৈরি করুন।'
          );
        } else if (authErr.code === 'auth/invalid-email') {
          throw new Error('সঠিক ইমেইল ফরম্যাট দিন (যেমন: admin@gmail.com)।');
        } else if (authErr.code === 'auth/too-many-requests') {
          throw new Error('অতিরিক্ত ভুল প্রচেষ্টার কারণে সাময়িকভাবে বন্ধ। কিছুক্ষণ পর চেষ্টা করুন।');
        }
        throw new Error(authErr.message || 'এডমিন লগইন ব্যর্থ হয়েছে।');
      }
    }

    throw new Error(
      'ফায়ারবেস ডাটাবেসে এই ইউজারনেম বা মোবাইল নম্বরে কোনো সদস্য পাওয়া যায়নি। অনুগ্রহ করে সঠিক ইউজারনেম দিন অথবা এডমিন হিসেবে ইমেইল দিয়ে লগইন করুন।'
    );
  };

  /**
   * Register a new Admin directly in Firebase Authentication and deploy their Firestore Fund
   */
  const registerAdminWithFund = async (
    email: string,
    pass: string,
    adminName: string,
    fundName: string
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।');
    }
    if (cleanPass.length < 6) {
      throw new Error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
    }
    if (!adminName.trim()) {
      throw new Error('অনুগ্রহ করে এডমিনের নাম লিখুন।');
    }
    if (!fundName.trim()) {
      throw new Error('অনুগ্রহ করে ফান্ডের নাম লিখুন।');
    }

    // 1. Check if email already registered in Firestore admins
    try {
      const adminsRef = collection(db, 'admins');
      const adminQ = query(adminsRef, where('email', '==', cleanEmail));
      const adminSnap = await getDocs(adminQ);

      if (!adminSnap.empty) {
        throw new Error(
          `এই ইমেইল (${cleanEmail}) দিয়ে ইতোমধ্যে ফায়ারবেসে একটি এডমিন একাউন্ট রয়েছে। অনুগ্রহ করে "এডমিন লগইন" করুন।`
        );
      }
    } catch (checkErr: any) {
      if (checkErr.message?.includes('ইতোমধ্যে ফায়ারবেসে')) {
        throw checkErr;
      }
    }

    // 2. Execute real registration in Firebase Authentication
    let uid: string;
    try {
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
      uid = userCred.user.uid;
    } catch (authErr: any) {
      if (authErr.code === 'auth/email-already-in-use') {
        throw new Error(
          `এই ইমেইল (${cleanEmail}) দিয়ে ইতোমধ্যেই ফায়ারবেসে একাউন্ট রয়েছে। অনুগ্রহ করে "এডমিন লগইন" করুন।`
        );
      } else if (authErr.code === 'auth/weak-password') {
        throw new Error('পাসওয়ার্ডটি খুব দুর্বল। কমপক্ষে ৬টি অক্ষর বা সংখ্যা দিন।');
      } else if (authErr.code === 'auth/invalid-email') {
        throw new Error('সঠিক ইমেইল এড্রেস প্রদান করুন।');
      }
      throw new Error(authErr.message || 'ফায়ারবেস একাউন্ট তৈরি ব্যর্থ হয়েছে।');
    }

    const newFundId = `fund-${uid}`;
    const newFund: Fund = {
      id: newFundId,
      name: fundName.trim() || 'প্রবাসী মুক্ত ফান্ড',
      nameBn: fundName.trim() || 'প্রবাসী মুক্ত ফান্ড',
      description: 'প্রবাসী সদস্যদের যৌথ তহবিল ও হালাল বিনিয়োগ প্রকল্প।',
      adminId: uid,
      adminEmail: cleanEmail,
      adminName: adminName.trim(),
      currency: 'BDT',
      defaultMonthlyAmount: 1000,
      createdAt: new Date().toISOString(),
      coverGradient: 'from-slate-900 via-slate-900 to-emerald-950',
      country: 'Saudi Arabia',
    };

    // 3. Persist Fund and Admin in Firestore
    await setDoc(doc(db, 'funds', newFundId), cleanForFirestore(newFund));
    await setDoc(doc(db, 'admins', uid), cleanForFirestore({
      id: uid,
      email: cleanEmail,
      name: adminName.trim(),
      fundId: newFundId,
      fundName: newFund.name,
      createdAt: new Date().toISOString(),
    }));

    const session: UserSession = {
      uid,
      username: cleanEmail.split('@')[0],
      email: cleanEmail,
      role: 'admin',
      fundId: newFundId,
      fundName: newFund.name,
      adminId: uid,
      displayName: adminName.trim() || 'Admin',
    };

    saveSession(session);
  };

  const loginAsDemoAdmin = async () => {
    throw new Error('ডেমো এডমিন অপশন নিষ্ক্রিয় করা হয়েছে। অনুগ্রহ করে আপনার আসল ফায়ারবেস একাউন্ট দিয়ে রেজিস্ট্রেশন বা লগইন করুন।');
  };

  const loginAsDemoMember = async () => {
    throw new Error('ডেমো সদস্য অপশন নিষ্ক্রিয় করা হয়েছে। অনুগ্রহ করে এডমিন প্যানেলে সদস্য যোগ করার পর লগইন করুন।');
  };

  const updateUserAvatar = async (avatarUrl: string) => {
    if (userSession) {
      const updatedSession = { ...userSession, avatarUrl };
      saveSession(updatedSession);
    }
    if (currentMember?.id) {
      setCurrentMember((prev) => (prev ? { ...prev, avatarUrl } : null));
      try {
        await updateDoc(doc(db, 'members', currentMember.id), { avatarUrl });
      } catch (e) {
        console.warn('Could not update avatar in Firestore:', e);
      }
    }
  };

  const updateUserProfile = async (updates: Partial<Member>) => {
    if (currentMember) {
      const updatedMember = { ...currentMember, ...updates };
      setCurrentMember(updatedMember);
      if (userSession) {
        const updatedSession: UserSession = {
          ...userSession,
          displayName: updates.nameBn || updates.name || userSession.displayName,
          avatarUrl: updates.avatarUrl || userSession.avatarUrl,
        };
        saveSession(updatedSession);
      }
      try {
        if (currentMember.id) {
          await updateDoc(doc(db, 'members', currentMember.id), updates);
        }
      } catch (e) {
        console.warn('Could not update profile in Firestore:', e);
      }
    }
  };

  const changeMemberPassword = async (newPassword: string) => {
    const cleanPass = newPassword.trim();
    if (!cleanPass) {
      throw new Error('অনুগ্রহ করে একটি নতুন পাসওয়ার্ড দিন।');
    }
    if (cleanPass.length < 4) {
      throw new Error('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
    }

    if (currentMember?.id) {
      await updateDoc(doc(db, 'members', currentMember.id), { passwordPlain: cleanPass });
      setCurrentMember((prev) => (prev ? { ...prev, passwordPlain: cleanPass } : null));

      // Post real-time notification to firestore
      try {
        await addDoc(collection(db, 'notifications'), cleanForFirestore({
          fundId: currentMember.fundId || activeFundId || DEFAULT_FUND_ID,
          adminId: currentMember.adminId || 'admin',
          title: 'Member Password Changed',
          titleBn: `পাসওয়ার্ড পরিবর্তন: ${currentMember.nameBn || currentMember.name}`,
          message: `${currentMember.name} (@${currentMember.username}) changed their password from user profile.`,
          messageBn: `${currentMember.nameBn || currentMember.name} (@${currentMember.username}) তার লগইন পাসওয়ার্ড পরিবর্তন করেছেন। এডমিন পোর্টালে নতুন পাসওয়ার্ড আপডেট হয়েছে।`,
          type: 'member',
          timestamp: new Date().toISOString(),
          read: false,
          metadata: { memberId: currentMember.id },
        }));
      } catch (err) {
        console.warn('Failed to post password update notification:', err);
      }
    } else if (currentUser && !currentUser.isAnonymous) {
      await updatePassword(currentUser, cleanPass);
    } else {
      throw new Error('পাসওয়ার্ড পরিবর্তনের জন্য সক্রিয় একাউন্ট পাওয়া যায়নি।');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout error:', e);
    }
    saveSession(null);
  };

  const handleSetActiveMemberId = (id: string | null) => {
    setActiveMemberId(id);
    if (id) {
      localStorage.setItem('probashi_active_member_id', id);
    } else {
      localStorage.removeItem('probashi_active_member_id');
    }
  };

  const isAdmin = userRole === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentMember,
        userSession,
        userRole,
        isAdmin,
        activeFundId,
        setActiveFundId,
        loading,
        loginWithCredentials,
        registerAdminWithFund,
        loginAsDemoAdmin,
        loginAsDemoMember,
        updateUserAvatar,
        updateUserProfile,
        changeMemberPassword,
        logout,
        activeMemberId,
        setActiveMemberId: handleSetActiveMemberId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
