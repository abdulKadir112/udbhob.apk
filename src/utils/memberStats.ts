import { Member, MonthlyPayment, Investment } from '../types';
import { getMemberMonthlyRate } from './formatters';

export interface MemberFinancialStats {
  memberId: string;
  shares: number;
  shareAmountMonthly: number;
  totalFundShares: number;
  sharePercentageOfFund: number; // e.g. 5.2% of fund shares

  // Deposits in their name (তার নামে মোট কত টাকা আছে - মূল সঞ্চয়)
  totalDepositedLifetime: number; // All-time deposits strictly from confirmed payments
  totalDepositedSelectedYear: number; // Current active year deposits

  // Months count (মোট কয় মাসের টাকা জমা আছে)
  distinctMonthsPaidLifetime: number; // Total distinct months with payments
  paidMonthsSelectedYear: number; // Months paid in selected year (out of 12)
  equivalentInstallments: number; // totalDeposited / monthlyRate

  // Profit / Loss metrics (কোনো নির্দিষ্ট বা নিশ্চিত লাভ নেই - লাভ/লোকসান কেবল চূড়ান্ত বিনিয়োগের ওপর নির্ভরশীল)
  fundCompletedNetProfit: number; // Actual completed profit or loss in fund
  memberProfitAmount: number; // Member's actual share in BDT (0 if no completed profit/loss distributed)
  memberProfitPercentage: number; // Actual rate % (0 if not distributed)
  profitStatus: 'profit' | 'loss' | 'pending' | 'none';
  profitStatusTextBn: string;
  profitStatusTextEn: string;

  // Total financial value in their name (মূল সঞ্চয় + চূড়ান্ত মুনাফা/লোকসান)
  totalAssetValue: number;
}

/**
 * Computes transparent, share-based financial statistics for any member.
 * IMPORTANT: In this fund there is NO guaranteed or fixed profit ("কোনো নিশ্চিত লাভ নেই").
 * Active investments do NOT count as realized money. Profit/loss is strictly zero until
 * investments are actually completed and distributed.
 */
export function calculateMemberFinancialStats(
  member: Member | null | undefined,
  allMembers: Member[],
  payments: MonthlyPayment[],
  investments: Investment[],
  selectedYear: number = new Date().getFullYear()
): MemberFinancialStats {
  if (!member) {
    return {
      memberId: '',
      shares: 1,
      shareAmountMonthly: 1000,
      totalFundShares: 1,
      sharePercentageOfFund: 0,
      totalDepositedLifetime: 0,
      totalDepositedSelectedYear: 0,
      distinctMonthsPaidLifetime: 0,
      paidMonthsSelectedYear: 0,
      equivalentInstallments: 0,
      fundCompletedNetProfit: 0,
      memberProfitAmount: 0,
      memberProfitPercentage: 0,
      profitStatus: 'none',
      profitStatusTextBn: 'কোনো নির্দিষ্ট লাভ নেই • চলমান বিনিয়োগ',
      profitStatusTextEn: 'No fixed profit • Ongoing investments',
      totalAssetValue: 0,
    };
  }

  const shares = Math.max(1, Number(member.shares) || 1);
  const shareAmountMonthly = getMemberMonthlyRate(member);

  // Total shares across all active members in the fund
  const activeMembers = allMembers.filter((m) => m.status !== 'inactive');
  const pool = activeMembers.length > 0 ? activeMembers : allMembers;
  const totalFundShares = Math.max(
    1,
    pool.reduce((sum, m) => sum + Math.max(1, Number(m.shares) || 1), 0)
  );

  const shareRatio = shares / totalFundShares;
  const sharePercentageOfFund = Number(((shares / totalFundShares) * 100).toFixed(1));

  // Payments for this member
  const memberPayments = payments.filter((p) => p.memberId === member.id);
  const totalDepositedLifetime = memberPayments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );

  const selectedYearPayments = memberPayments.filter((p) => p.year === selectedYear);
  const totalDepositedSelectedYear = selectedYearPayments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );

  // Distinct months calculation
  const distinctMonthKeys = new Set<string>();
  memberPayments.forEach((p) => {
    if (p.year && p.month && Number(p.amount) > 0) {
      distinctMonthKeys.add(`${p.year}-${p.month}`);
    }
  });
  const distinctMonthsPaidLifetime = distinctMonthKeys.size;

  const selectedYearMonthKeys = new Set<number>();
  selectedYearPayments.forEach((p) => {
    if (p.month && Number(p.amount) > 0) {
      selectedYearMonthKeys.add(p.month);
    }
  });
  const paidMonthsSelectedYear = selectedYearMonthKeys.size;

  const equivalentInstallments =
    shareAmountMonthly > 0
      ? Math.floor(totalDepositedLifetime / shareAmountMonthly)
      : distinctMonthsPaidLifetime;

  // Investment Profit / Loss Calculation
  // NO GUARANTEED OR FIXED PROFIT: We only consider completed/settled investments that have an actual returnAmount recorded.
  // Active/ongoing investments carry uncertain outcomes and must NEVER be treated as earned or distributed money.
  const completedInvestments = investments.filter(
    (i) =>
      (i.status === 'completed' || i.status === 'profitable' || (i.status as string) === 'loss') &&
      typeof i.returnAmount === 'number' &&
      !isNaN(i.returnAmount)
  );

  const fundCompletedNetProfit = completedInvestments.reduce(
    (sum, i) => sum + ((Number(i.returnAmount) || 0) - Number(i.amount || 0)),
    0
  );

  let memberProfitAmount = 0;
  let memberProfitPercentage = 0;
  let profitStatus: 'profit' | 'loss' | 'pending' | 'none' = 'none';
  let profitStatusTextBn = 'কোনো নির্দিষ্ট বা নিশ্চিত লাভ নেই';
  let profitStatusTextEn = 'No fixed or guaranteed profit';

  if (completedInvestments.length === 0) {
    // No completed investments with returned capital yet - investments are strictly ongoing
    profitStatus = 'pending';
    profitStatusTextBn = 'বিনিয়োগ চলমান • কোনো নিশ্চিত লাভ নেই (প্রকল্প সমাপ্তি সাপেক্ষে)';
    profitStatusTextEn = 'Investments ongoing • No fixed profit';
    memberProfitAmount = 0;
    memberProfitPercentage = 0;
  } else if (fundCompletedNetProfit > 0) {
    memberProfitAmount = Math.round(fundCompletedNetProfit * shareRatio);
    if (totalDepositedLifetime > 0) {
      memberProfitPercentage = Number(((memberProfitAmount / totalDepositedLifetime) * 100).toFixed(1));
    }
    profitStatus = 'profit';
    profitStatusTextBn = 'বাস্তবায়িত অর্জিত মুনাফা';
    profitStatusTextEn = 'Realized distributed profit';
  } else if (fundCompletedNetProfit < 0) {
    memberProfitAmount = Math.round(fundCompletedNetProfit * shareRatio);
    if (totalDepositedLifetime > 0) {
      memberProfitPercentage = Number(((memberProfitAmount / totalDepositedLifetime) * 100).toFixed(1));
    }
    profitStatus = 'loss';
    profitStatusTextBn = 'বাস্তবায়িত লোকসান';
    profitStatusTextEn = 'Realized loss';
  } else {
    profitStatus = 'none';
    profitStatusTextBn = 'মুনাফা বা লোকসান সমতা (৳০)';
    profitStatusTextEn = 'Break-even (৳0)';
  }

  // Total balance in his name: strictly their deposited principal + any realized profit/loss
  const totalAssetValue = totalDepositedLifetime + memberProfitAmount;

  return {
    memberId: member.id,
    shares,
    shareAmountMonthly,
    totalFundShares,
    sharePercentageOfFund,
    totalDepositedLifetime,
    totalDepositedSelectedYear,
    distinctMonthsPaidLifetime,
    paidMonthsSelectedYear,
    equivalentInstallments,
    fundCompletedNetProfit,
    memberProfitAmount,
    memberProfitPercentage,
    profitStatus,
    profitStatusTextBn,
    profitStatusTextEn,
    totalAssetValue,
  };
}
