import { collection, addDoc, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Member, MonthlyPayment, Fund, UserSession, AppNotification } from '../types';
import { cleanForFirestore } from './firestoreUtils';
import { MONTHS } from './formatters';

export interface DueMemberStatus {
  member: Member;
  isPaid: boolean;
  totalPaid: number;
  expectedAmount: number;
  dueAmount: number;
  paymentCount: number;
}

/**
 * Calculates due and paid status for all members for a given month and year
 */
export function getMonthlyPaymentStatus(
  members: Member[],
  payments: MonthlyPayment[],
  targetYear: number,
  targetMonth: number
): {
  dueMembers: DueMemberStatus[];
  paidMembers: DueMemberStatus[];
  allStatuses: DueMemberStatus[];
  totalDueCount: number;
  totalPaidCount: number;
} {
  const activeMembers = members.filter((m) => m.status !== 'inactive');

  const allStatuses: DueMemberStatus[] = activeMembers.map((member) => {
    const expectedAmount = Number(member.monthlyShareAmount || 1000);
    
    // Find all payments made by this member for the target month and year
    const memberPayments = payments.filter((p) => {
      const isMatchingMonth = Number(p.month) === targetMonth;
      const isMatchingYear = Number(p.year) === targetYear;
      if (!isMatchingMonth || !isMatchingYear) return false;

      const memberId = member.id?.trim();
      const memberUsername = member.username?.trim().toLowerCase();
      const memberName = member.name?.trim().toLowerCase();
      const memberNameBn = member.nameBn?.trim();

      const pMemberId = p.memberId?.trim();
      const pMemberName = p.memberName?.trim().toLowerCase();

      return (
        (memberId && pMemberId === memberId) ||
        (memberUsername && pMemberId?.toLowerCase() === memberUsername) ||
        (memberName && pMemberName === memberName) ||
        (memberNameBn && p.memberName?.trim() === memberNameBn)
      );
    });

    const totalPaid = memberPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const isPaid = totalPaid >= expectedAmount;
    const dueAmount = Math.max(0, expectedAmount - totalPaid);

    return {
      member,
      isPaid,
      totalPaid,
      expectedAmount,
      dueAmount,
      paymentCount: memberPayments.length,
    };
  });

  const dueMembers = allStatuses.filter((s) => !s.isPaid);
  const paidMembers = allStatuses.filter((s) => s.isPaid);

  return {
    dueMembers,
    paidMembers,
    allStatuses,
    totalDueCount: dueMembers.length,
    totalPaidCount: paidMembers.length,
  };
}

/**
 * Checks if current date & time matches the 10th-15th monthly due reminder schedule (8:00 AM & 8:00 PM)
 */
export function getCurrentDueReminderSlotInfo(date: Date = new Date()): {
  isInDueWindow: boolean; // Day 10 to 15
  isMorningSlot: boolean; // 8:00 AM to 7:59 PM (Slot 1)
  isNightSlot: boolean; // 8:00 PM to 11:59 PM (Slot 2)
  currentSlot: 'morning_8am' | 'night_8pm' | null;
  slotKey: string;
  day: number;
  month: number;
  year: number;
  hour: number;
  monthNameBn: string;
} {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();

  // Schedule Rule: 10th to 15th of the month
  const isInDueWindow = day >= 10 && day <= 15;

  // Slot 1: Morning 8:00 AM onwards (8:00 - 19:59)
  const isMorningSlot = hour >= 8 && hour < 20;
  // Slot 2: Night 8:00 PM onwards (20:00 - 23:59)
  const isNightSlot = hour >= 20;

  const currentSlot: 'morning_8am' | 'night_8pm' | null = isNightSlot
    ? 'night_8pm'
    : isMorningSlot
    ? 'morning_8am'
    : null;

  const slotKey = `due_slot_${year}_m${month}_d${day}_${currentSlot || 'inactive'}`;
  const monthNameBn = MONTHS[month - 1]?.nameBn || `${month}ম মাস`;

  return {
    isInDueWindow,
    isMorningSlot,
    isNightSlot,
    currentSlot,
    slotKey,
    day,
    month,
    year,
    hour,
    monthNameBn,
  };
}

/**
 * Automated engine to dispatch monthly due notifications to unpaid members on 10-15th at 8:00 AM & 8:00 PM
 */
export async function checkAndDispatchAutomatedDueReminders({
  fundId,
  members,
  payments,
  currentFund,
  userSession,
}: {
  fundId: string;
  members: Member[];
  payments: MonthlyPayment[];
  currentFund?: Fund;
  userSession?: UserSession | null;
}): Promise<{ dispatched: boolean; count: number; slotKey: string; reason?: string }> {
  if (!fundId || members.length === 0) {
    return { dispatched: false, count: 0, slotKey: '', reason: 'No fund or members' };
  }

  const slotInfo = getCurrentDueReminderSlotInfo();

  // 1. Check if we are inside the 10th - 15th window
  if (!slotInfo.isInDueWindow) {
    return {
      dispatched: false,
      count: 0,
      slotKey: slotInfo.slotKey,
      reason: `Today is day ${slotInfo.day}. Automated reminders run between 10th and 15th of the month.`,
    };
  }

  // 2. Check if we are in an active 8:00 AM or 8:00 PM time slot
  if (!slotInfo.currentSlot) {
    return {
      dispatched: false,
      count: 0,
      slotKey: slotInfo.slotKey,
      reason: `Current hour (${slotInfo.hour}:00) is before 8:00 AM slot. Next alert triggers at 8:00 AM.`,
    };
  }

  const localSlotStorageKey = `probashi_due_notif_sent_${fundId}_${slotInfo.slotKey}`;
  const alreadySentLocally = typeof window !== 'undefined' && localStorage.getItem(localSlotStorageKey);
  if (alreadySentLocally) {
    return {
      dispatched: false,
      count: 0,
      slotKey: slotInfo.slotKey,
      reason: 'Already dispatched for this slot window.',
    };
  }

  // 3. Check Firestore if this slot has already been processed for this fund
  try {
    const notifsRef = collection(db, 'notifications');
    const q = query(
      notifsRef,
      where('fundId', '==', fundId),
      where('metadata.slotKey', '==', slotInfo.slotKey),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(localSlotStorageKey, 'true');
      }
      return {
        dispatched: false,
        count: 0,
        slotKey: slotInfo.slotKey,
        reason: 'Already recorded in database for this time slot.',
      };
    }
  } catch (err) {
    console.warn('Checking previous slot notifications error:', err);
  }

  // 4. Calculate who is due for current month
  const { dueMembers } = getMonthlyPaymentStatus(
    members,
    payments,
    slotInfo.year,
    slotInfo.month
  );

  if (dueMembers.length === 0) {
    // All members have paid! No reminders to send.
    if (typeof window !== 'undefined') {
      localStorage.setItem(localSlotStorageKey, 'all_paid');
    }
    return {
      dispatched: false,
      count: 0,
      slotKey: slotInfo.slotKey,
      reason: 'All members have paid for this month. No dues.',
    };
  }

  // 5. Dispatch targeted notification to each due member
  const nowIso = new Date().toISOString();
  const slotTitleTime = slotInfo.currentSlot === 'morning_8am' ? 'সকাল ৮:০০ টা' : 'রাত ৮:০০ টা';
  let dispatchedCount = 0;

  for (const item of dueMembers) {
    const m = item.member;
    const memberName = m.nameBn || m.name;
    const dueFormatted = `৳${item.dueAmount.toLocaleString()}`;

    const titleBn = `⚠️ মাসিক সঞ্চয় বকেয়া রিমাইন্ডার (${slotInfo.monthNameBn})`;
    const title = `Monthly Dues Reminder (${slotInfo.monthNameBn})`;
    const messageBn = `আসসালামু আলাইকুম ${memberName}, চলতি ${slotInfo.monthNameBn} মাসের নির্ধারিত কিস্তির ${dueFormatted} এখনো জমা দেওয়া বাকি রয়েছে। অনুগ্রহ করে ১০ থেকে ১৫ তারিখের মধ্যে জমা দিয়ে ফান্ড সচল রাখুন।`;
    const message = `Dear ${m.name}, your monthly contribution of ${dueFormatted} for ${slotInfo.monthNameBn} is pending. Please deposit between 10th and 15th.`;

    const notifPayload: Omit<AppNotification, 'id'> = {
      fundId,
      adminId: currentFund?.adminId || userSession?.adminId || 'admin',
      senderName: currentFund?.adminName || 'প্রবাসী মুক্ত ফান্ড অটো-রিমাইন্ডার',
      senderRole: 'admin',
      title,
      titleBn,
      message,
      messageBn,
      type: 'due_reminder',
      targetAudience: 'user',
      targetUserId: m.id,
      targetUserName: memberName,
      priority: 'urgent',
      sound: true,
      timestamp: nowIso,
      read: false,
      metadata: {
        memberId: m.id,
        amount: item.dueAmount,
        automatedDueReminder: true,
        slotKey: slotInfo.slotKey,
        year: slotInfo.year,
        month: slotInfo.month,
        day: slotInfo.day,
        slot: slotInfo.currentSlot,
        badge: `${slotTitleTime} রিমাইন্ডার`,
      },
    };

    try {
      await addDoc(collection(db, 'notifications'), cleanForFirestore(notifPayload));
      dispatchedCount++;
    } catch (e) {
      console.warn(`Error dispatching due reminder for member ${m.id}:`, e);
    }
  }

  // 6. Record that this slot has been dispatched
  if (typeof window !== 'undefined') {
    localStorage.setItem(localSlotStorageKey, 'true');
  }

  return {
    dispatched: true,
    count: dispatchedCount,
    slotKey: slotInfo.slotKey,
  };
}

/**
 * Manual trigger for Admin to send due reminders to all unpaid members immediately
 */
export async function sendManualDueRemindersToAllUnpaid({
  fundId,
  members,
  payments,
  currentFund,
  userSession,
  customNote,
  targetYear,
  targetMonth,
}: {
  fundId: string;
  members: Member[];
  payments: MonthlyPayment[];
  currentFund?: Fund;
  userSession?: UserSession | null;
  customNote?: string;
  targetYear?: number;
  targetMonth?: number;
}): Promise<{ count: number; dueMembersList: Member[] }> {
  const now = new Date();
  const year = targetYear || now.getFullYear();
  const month = targetMonth || now.getMonth() + 1;
  const monthNameBn = MONTHS[month - 1]?.nameBn || `${month}ম মাস`;

  const { dueMembers } = getMonthlyPaymentStatus(members, payments, year, month);

  if (dueMembers.length === 0) {
    return { count: 0, dueMembersList: [] };
  }

  const nowIso = new Date().toISOString();
  let count = 0;
  const dueMembersList: Member[] = [];

  for (const item of dueMembers) {
    const m = item.member;
    const memberName = m.nameBn || m.name;
    const dueFormatted = `৳${item.dueAmount.toLocaleString()}`;

    const titleBn = `⚠️ বকেয়া কিস্তি পরিশোধের নোটিশ (${monthNameBn} ${year})`;
    const title = `Pending Dues Notice (${monthNameBn} ${year})`;
    const baseMsgBn = `আসসালামু আলাইকুম ${memberName}, আপনার ${monthNameBn} মাসের নির্ধারিত কিস্তির ${dueFormatted} জমা দেওয়া বাকি রয়েছে।`;
    const messageBn = customNote ? `${baseMsgBn}\n\n📢 এডমিন বার্তা: ${customNote}` : `${baseMsgBn} অনুগ্রহ করে অতি দ্রুত ফান্ডে জমা প্রদান করুন।`;
    const message = `Dear ${m.name}, your monthly payment of ${dueFormatted} for ${monthNameBn} ${year} is pending. Please deposit promptly.`;

    const notifPayload: Omit<AppNotification, 'id'> = {
      fundId,
      adminId: currentFund?.adminId || userSession?.adminId || 'admin',
      senderName: userSession?.displayName || currentFund?.adminName || 'এডমিন',
      senderRole: 'admin',
      title,
      titleBn,
      message,
      messageBn,
      type: 'due_reminder',
      targetAudience: 'user',
      targetUserId: m.id,
      targetUserName: memberName,
      priority: 'urgent',
      sound: true,
      timestamp: nowIso,
      read: false,
      metadata: {
        memberId: m.id,
        amount: item.dueAmount,
        automatedDueReminder: false,
        year,
        month,
        badge: 'বকেয়া রিমাইন্ডার',
      },
    };

    try {
      await addDoc(collection(db, 'notifications'), cleanForFirestore(notifPayload));
      count++;
      dueMembersList.push(m);
    } catch (e) {
      console.warn(`Error sending manual due notification to ${m.id}:`, e);
    }
  }

  return { count, dueMembersList };
}
