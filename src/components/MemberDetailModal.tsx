import React, { useState } from 'react';
import {
  X,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Globe,
  Wallet,
  Shield,
  Layers,
  Sparkles,
  TrendingUp,
  Percent,
  Coins,
  ArrowUpRight,
  PiggyBank,
  AlertCircle,
  FileText,
  BadgeCheck,
  Lock,
} from 'lucide-react';
import { Member, MonthlyPayment } from '../types';
import {
  MONTHS,
  formatBDT,
  formatCustomDate,
  toBengaliNumerals,
  getCountryFlag,
  getCountryBn,
  getMemberMonthlyRate,
} from '../utils/formatters';
import { useFund } from '../context/FundContext';
import { useAuth } from '../context/AuthContext';
import { printMemberStatementSlip } from '../utils/printHelpers';
import { calculateMemberFinancialStats } from '../utils/memberStats';

interface MemberDetailModalProps {
  member: Member | null;
  payments: MonthlyPayment[];
  selectedYear: number;
  onClose: () => void;
  language: 'bn' | 'en';
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  payments,
  selectedYear,
  onClose,
  language,
}) => {
  const { currentFund, members, investments } = useFund();
  const { currentMember, userSession, isAdmin } = useAuth();
  const isBn = language === 'bn';
  const [activeYear, setActiveYear] = useState<number>(selectedYear);
  const [activeViewTab, setActiveViewTab] = useState<'matrix' | 'profit_details' | 'statement'>('matrix');

  if (!member) return null;

  // Privacy Rule: Profit/Loss and private financial analytics can ONLY be seen by that person themselves or an Admin
  const isSelf = Boolean(
    (currentMember?.id && currentMember.id === member.id) ||
    (userSession?.memberId && userSession.memberId === member.id) ||
    (userSession?.username && member.username && userSession.username === member.username)
  );
  const canViewFinancials = isSelf || isAdmin;

  // Compute standard financial statistics
  const stats = calculateMemberFinancialStats(member, members, payments, investments, activeYear);

  // Filter payments for this member
  const memberPayments = payments.filter((p) => p.memberId === member.id);
  const yearPayments = memberPayments.filter((p) => p.year === activeYear);

  const totalLifetimePaid = stats.totalDepositedLifetime;
  const totalYearPaid = stats.totalDepositedSelectedYear;
  const monthlyDue = stats.shareAmountMonthly;
  const yearlyTarget = monthlyDue * 12;
  const yearDue = Math.max(0, yearlyTarget - totalYearPaid);

  const handlePrintSlip = () => {
    printMemberStatementSlip(member, payments, activeYear, currentFund, isBn);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden cursor-default text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modern Executive Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white overflow-hidden shrink-0">
          {/* Subtle background ambient lights */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-1/3 w-36 h-36 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {/* Member Avatar */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white/10 border-2 border-emerald-400/40 p-0.5 shadow-lg overflow-hidden flex items-center justify-center text-white font-black text-2xl">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{(member.nameBn || member.name).charAt(0)}</span>
                  )}
                </div>
                <div
                  className="absolute -bottom-1 -right-1 text-lg shadow-sm bg-slate-900 rounded-full px-1 py-0.2 border border-white/20"
                  title={member.country}
                >
                  {getCountryFlag(member.country)}
                </div>
              </div>

              {/* Title & Identity */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight truncate">
                    {isBn ? member.nameBn || member.name : member.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-3xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3 text-emerald-400" />
                    <span>{isBn ? 'সক্রিয় সদস্য' : 'Active Member'}</span>
                  </span>
                  {member.role === 'admin' && (
                    <span className="px-2 py-0.5 rounded-full text-3xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      {isBn ? 'এডমিন' : 'Admin'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-2xs sm:text-xs text-slate-300 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isBn ? getCountryBn(member.country) : member.country}</span>
                    {member.city && <span>({member.city})</span>}
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="flex items-center gap-1 font-mono text-emerald-200">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{member.phone}</span>
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="text-slate-400">
                    {isBn ? 'যোগদান: ' : 'Joined: '}
                    <strong className="text-slate-200 font-semibold">{formatCustomDate(member.joinedDate, isBn)}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Print & Close */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePrintSlip}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors border border-white/15 active:scale-95"
                title={isBn ? 'রশিদ স্লিপ প্রিন্ট করুন' : 'Print Slip'}
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">{isBn ? 'রশিদ প্রিন্ট' : 'Print Slip'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NEW DESIGN: 4 CORE HIGHLIGHT STATS (Requested by User) */}
        {/* 1. কতটা শেয়ার (Shares) */}
        {/* 2. কত পার্সেন্ট লাভ করেছে এবং পাশে লাভের টাকা থাকবে (% Profit & Profit BDT) */}
        {/* 3. মোট কয় মাসের টাকা জমা আছে (Months paid count) */}
        {/* 4. তার নামে মোট কত টাকা আছে (Total deposited in their name) */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Card 1: কতটা শেয়ার (Shares Count & Monthly Due) */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isBn ? 'শেয়ার সংখ্যা' : 'Shares Count'}</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-extrabold text-3xs">
                    ৳১,০০০/শেয়ার
                  </span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {isBn ? toBengaliNumerals(stats.shares) : stats.shares}
                  </span>
                  <span className="text-xs font-bold text-slate-600">{isBn ? 'টি শেয়ার' : 'shares'}</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-3xs text-slate-600">
                <span>{isBn ? 'নির্ধারিত কিস্তি:' : 'Monthly Rate:'}</span>
                <strong className="text-slate-900 font-bold">{formatBDT(stats.shareAmountMonthly, isBn)}/মাস</strong>
              </div>
            </div>

            {/* Card 2: লাভ / লোকসান (% Profit/Loss & BDT) - STRICTLY PRIVATE to self or admin */}
            {canViewFinancials ? (
              <div className={`p-3.5 rounded-2xl border shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between ${
                stats.profitStatus === 'loss'
                  ? 'bg-rose-50/70 border-rose-200'
                  : 'bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white border-emerald-200'
              }`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isBn ? 'লাভ / লোকসান হিসাব' : 'Profit / Loss'}</span>
                    </span>
                    <span className={`px-1.5 py-0.2 rounded-md font-extrabold text-3xs flex items-center gap-0.5 ${
                      stats.profitStatus === 'profit'
                        ? 'bg-emerald-600 text-white'
                        : stats.profitStatus === 'loss'
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {stats.profitStatus === 'profit'
                        ? (isBn ? 'লভ্যাংশ' : 'Profit')
                        : stats.profitStatus === 'loss'
                        ? (isBn ? 'লোকসান' : 'Loss')
                        : (isBn ? 'অনির্ধারিত' : 'Pending')}
                    </span>
                  </div>

                  {/* Profit/Loss display */}
                  <div className="mt-1.5">
                    {stats.profitStatus === 'profit' ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1 bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-lg font-black text-sm sm:text-base border border-emerald-300">
                          <Percent className="w-3 h-3 text-emerald-700" />
                          <span>+{isBn ? toBengaliNumerals(stats.memberProfitPercentage) : stats.memberProfitPercentage}%</span>
                        </div>
                        <div className="font-black text-emerald-800 text-base sm:text-lg tracking-tight">
                          +{formatBDT(stats.memberProfitAmount, isBn)}
                        </div>
                      </div>
                    ) : stats.profitStatus === 'loss' ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1 bg-rose-100 text-rose-900 px-2 py-0.5 rounded-lg font-black text-sm sm:text-base border border-rose-300">
                          <Percent className="w-3 h-3 text-rose-700" />
                          <span>-{isBn ? toBengaliNumerals(Math.abs(stats.memberProfitPercentage)) : Math.abs(stats.memberProfitPercentage)}%</span>
                        </div>
                        <div className="font-black text-rose-800 text-base sm:text-lg tracking-tight">
                          -{formatBDT(Math.abs(stats.memberProfitAmount), isBn)}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-slate-800 text-sm sm:text-base">
                            ০% (৳০)
                          </span>
                          <span className="text-3xs text-slate-600 font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {isBn ? 'কোনো নিশ্চিত লাভ নেই' : 'No fixed profit'}
                          </span>
                        </div>
                        <p className="text-3xs text-slate-500 mt-0.5">
                          {isBn ? 'বিনিয়োগ চলমান • সমাপ্তির পর লাভ বণ্টিত হবে' : 'Investment ongoing • Realized upon completion'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-3xs text-slate-600">
                  <span>{isBn ? 'ফান্ড শেয়ার অংশীদারিত্ব:' : 'Share Ratio:'}</span>
                  <strong className="font-bold text-slate-900">
                    {isBn ? toBengaliNumerals(stats.sharePercentageOfFund) : stats.sharePercentageOfFund}%
                  </strong>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isBn ? 'লাভ / লোকসান হিসাব' : 'Profit / Loss'}</span>
                    </span>
                    <span className="px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700 font-extrabold text-3xs flex items-center gap-0.5">
                      <Shield className="w-2.5 h-2.5 text-slate-500" />
                      <span>{isBn ? 'গোপনীয়' : 'Private'}</span>
                    </span>
                  </div>
                  <div className="mt-2 font-bold text-slate-800 text-xs sm:text-sm">
                    {isBn ? 'ব্যক্তিগত তথ্য সংরক্ষিত' : 'Confidential Record'}
                  </div>
                  <p className="text-3xs text-slate-500 mt-1 leading-relaxed">
                    {isBn
                      ? 'ফান্ড নিয়ম অনুযায়ী লাভ-লোকসানের হিসাব শুধুমাত্র সংশ্লিষ্ট সদস্য দেখতে পান।'
                      : 'Per privacy policy, profit details are visible only to the account holder.'}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-3xs text-slate-500">
                  <span>{isBn ? 'প্রাইভেসি প্রোটেকশন:' : 'Privacy:'}</span>
                  <strong className="text-emerald-700 font-semibold">{isBn ? 'শুধুমাত্র নিজস্ব প্রোফাইলে' : 'Owner Profile Only'}</strong>
                </div>
              </div>
            )}

            {/* Card 3: মোট কয় মাসের টাকা জমা আছে (Total Months Deposited) */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isBn ? 'জমা মাসের সংখ্যা' : 'Months Paid'}</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-extrabold text-3xs">
                    {isBn ? `${toBengaliNumerals(activeYear)} সাল` : activeYear}
                  </span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight">
                    {isBn ? toBengaliNumerals(stats.paidMonthsSelectedYear) : stats.paidMonthsSelectedYear}
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    / {isBn ? '১২ মাস' : '12 months'}
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-3xs text-slate-600">
                <span>{isBn ? 'সর্বমোট পরিশোধিত:' : 'Total Lifetime:'}</span>
                <strong className="text-blue-700 font-bold">
                  {isBn ? `${toBengaliNumerals(stats.distinctMonthsPaidLifetime)} মাস` : `${stats.distinctMonthsPaidLifetime} mos`}
                </strong>
              </div>
            </div>

            {/* Card 4: তার নামে মোট কত টাকা আছে (Total Deposited in Their Name) */}
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-3xs font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isBn ? 'নামে মোট সঞ্চয়' : 'Total in His Name'}</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-3xs">
                    {isBn ? 'মূল জমা' : 'Principal'}
                  </span>
                </div>
                <div className="mt-1.5">
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight block">
                    {formatBDT(stats.totalDepositedLifetime, isBn)}
                  </span>
                </div>
              </div>
              <div className="relative z-10 mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-3xs text-slate-300">
                <span>
                  {stats.memberProfitAmount !== 0
                    ? (isBn ? 'চূড়ান্ত সমন্বিত মান:' : 'Settled Value:')
                    : (isBn ? 'সুরক্ষিত আমানত:' : 'Net Principal:')}
                </span>
                <strong className="text-white font-extrabold">
                  {formatBDT(stats.totalAssetValue, isBn)}
                </strong>
              </div>
              {/* Atmospheric Glow */}
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-emerald-500/20 blur-xl rounded-full pointer-events-none" />
            </div>

          </div>

          {/* Sub-tabs for detailed view switching */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveViewTab('matrix')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeViewTab === 'matrix'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{isBn ? '১২ মাসের কিস্তির ছক' : '12-Month Matrix'}</span>
              </button>

              {canViewFinancials && (
                <button
                  type="button"
                  onClick={() => setActiveViewTab('profit_details')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeViewTab === 'profit_details'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isBn ? 'শেয়ার ও লাভের বিস্তারিত' : 'Share & Profit Audit'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveViewTab('statement')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeViewTab === 'statement'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isBn ? 'অফিসিয়াল স্টেটমেন্ট' : 'Official Statement'}</span>
              </button>
            </div>

            {/* Year Selector Buttons */}
            <div className="flex items-center gap-1">
              <span className="text-3xs font-bold text-slate-500 mr-1 hidden sm:inline">
                {isBn ? 'বছর:' : 'Year:'}
              </span>
              {[2024, 2025, 2026, 2027].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setActiveYear(yr)}
                  className={`px-2.5 py-1 rounded-lg font-extrabold text-xs transition-colors cursor-pointer ${
                    activeYear === yr
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isBn ? toBengaliNumerals(yr) : yr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
          
          {/* VIEW 1: 12-Month Payment Matrix */}
          {activeViewTab === 'matrix' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>
                      {isBn
                        ? `${toBengaliNumerals(activeYear)} সালের ১২ মাসের কিস্তির বিবরণ`
                        : `12-Month Installment Statement (${activeYear})`}
                    </span>
                  </h4>
                  <p className="text-3xs text-slate-500 mt-0.5">
                    {isBn
                      ? `প্রতি মাসে নির্ধারিত কিস্তি: ${formatBDT(monthlyDue, isBn)} (${toBengaliNumerals(stats.shares)}টি শেয়ার)`
                      : `Monthly Installment: ${formatBDT(monthlyDue, false)} (${stats.shares} shares)`}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-3xs text-slate-500 block">{isBn ? 'এই বছরে মোট জমা:' : 'Total in Year:'}</span>
                  <span className="font-black text-emerald-700 text-sm sm:text-base">
                    {formatBDT(totalYearPaid, isBn)}
                  </span>
                </div>
              </div>

              {/* 12 Months Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {MONTHS.map((m) => {
                  const monthPayments = yearPayments.filter((p) => p.month === m.id);
                  const monthTotal = monthPayments.reduce((s, p) => s + (p.amount || 0), 0);
                  const isPaid = monthTotal >= monthlyDue;
                  const isPartial = monthTotal > 0 && monthTotal < monthlyDue;
                  const latestPayment = monthPayments.length > 0 ? monthPayments[monthPayments.length - 1] : null;

                  return (
                    <div
                      key={m.id}
                      className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                        isPaid
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 shadow-2xs'
                          : isPartial
                          ? 'bg-amber-50/70 border-amber-200 text-amber-950 shadow-2xs'
                          : 'bg-slate-50/60 border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-extrabold text-xs block text-slate-900">
                            {isBn ? m.nameBn : m.nameEn}
                          </span>
                          <span className="text-3xs text-slate-500 block mt-0.5">
                            {latestPayment
                              ? formatCustomDate(latestPayment.paymentDate, isBn)
                              : isBn ? 'বকেয়া' : 'Unpaid'}
                          </span>
                        </div>
                        {isPaid ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                        ) : isPartial ? (
                          <span className="px-1.5 py-0.2 rounded-md bg-amber-200 text-amber-900 font-black text-3xs">
                            {isBn ? 'আংশিক' : 'Partial'}
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-3xs font-bold">
                            ✕
                          </span>
                        )}
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-3xs text-slate-500">{isBn ? 'জমা:' : 'Paid:'}</span>
                        <span
                          className={`font-black text-xs ${
                            isPaid
                              ? 'text-emerald-700'
                              : isPartial
                              ? 'text-amber-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {monthTotal > 0 ? formatBDT(monthTotal, isBn) : '—'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Year Summary Bar */}
              <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    {isBn ? toBengaliNumerals(activeYear) : activeYear}
                  </div>
                  <div>
                    <span className="text-2xs text-slate-300 block">
                      {isBn ? 'বছরের লক্ষ্যমাত্রা:' : 'Yearly Target:'}{' '}
                      <strong className="text-white">{formatBDT(yearlyTarget, isBn)}</strong>
                    </span>
                    <span className="text-2xs text-emerald-300 font-semibold">
                      {isBn ? 'পরিশোধিত: ' : 'Completed: '}
                      {formatBDT(totalYearPaid, isBn)} ({isBn ? `${toBengaliNumerals(stats.paidMonthsSelectedYear)} মাস` : `${stats.paidMonthsSelectedYear} mos`})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xs text-slate-400 block">{isBn ? 'চলতি বছর বকেয়া:' : 'Year Dues:'}</span>
                  <span className={`text-sm font-black ${yearDue > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {yearDue > 0 ? formatBDT(yearDue, isBn) : isBn ? 'কোন বকেয়া নেই' : 'All Cleared'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Share & Profit Detailed Audit - Only accessible if canViewFinancials */}
          {canViewFinancials && activeViewTab === 'profit_details' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-extrabold text-sm text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>{isBn ? 'শেয়ার ও মুনাফা বণ্টন হিসাব নীতিমালা' : 'Share & Profit Allocation Policy'}</span>
                  </span>
                  <span className="text-3xs text-slate-400 font-mono">
                    {isBn ? 'হিসাব বিধি: ১ শেয়ার = ৳১,০০০/মাস' : 'Rule: 1 Share = ৳1,000/mo'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white/10 p-3 rounded-xl">
                    <span className="text-3xs text-slate-300 block">{isBn ? 'সদস্যের মোট শেয়ার:' : 'Member Shares:'}</span>
                    <span className="text-base font-black text-amber-300 mt-0.5 block">
                      {isBn ? toBengaliNumerals(stats.shares) : stats.shares} {isBn ? 'টি শেয়ার' : 'shares'}
                    </span>
                    <span className="text-3xs text-slate-400 mt-1 block">
                      {isBn ? `(ফান্ডের মোট ${toBengaliNumerals(stats.totalFundShares)}টি শেয়ারের মধ্যে)` : `(Out of ${stats.totalFundShares} fund shares)`}
                    </span>
                  </div>

                  <div className="bg-white/10 p-3 rounded-xl">
                    <span className="text-3xs text-slate-300 block">{isBn ? 'শেয়ার মালিকানা শতকরা হার:' : 'Ownership Share:'}</span>
                    <span className="text-base font-black text-emerald-300 mt-0.5 block">
                      {isBn ? toBengaliNumerals(stats.sharePercentageOfFund) : stats.sharePercentageOfFund}%
                    </span>
                    <span className="text-3xs text-slate-400 mt-1 block">
                      {isBn ? 'মুনাফা অনুপাতে বরাদ্দকৃত' : 'Proportion of profits'}
                    </span>
                  </div>

                  <div className="bg-white/10 p-3 rounded-xl">
                    <span className="text-3xs text-slate-300 block">{isBn ? 'অর্জিত মুনাফার মোট অংশ:' : 'Allocated Profit:'}</span>
                    {stats.memberProfitAmount !== 0 ? (
                      <>
                        <span className="text-base font-black text-emerald-400 mt-0.5 block">
                          {stats.memberProfitAmount > 0 ? '+' : ''}{formatBDT(stats.memberProfitAmount, isBn)}
                        </span>
                        <span className="text-3xs text-emerald-200 mt-1 block font-bold">
                          {stats.memberProfitPercentage > 0 ? '+' : ''}{isBn ? toBengaliNumerals(stats.memberProfitPercentage) : stats.memberProfitPercentage}%
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-base font-black text-slate-200 mt-0.5 block">
                          ০% (৳০)
                        </span>
                        <span className="text-3xs text-slate-300 mt-1 block">
                          {isBn ? 'বিনিয়োগ চলমান • অনির্ধারিত' : 'Investment ongoing'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Fund Active Investment Projects Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <h5 className="font-extrabold text-slate-800 text-xs flex items-center justify-between">
                  <span>{isBn ? 'ফান্ডের বিনিয়োগ প্রকল্প ও মুনাফার উৎস' : 'Fund Investment Portfolio'}</span>
                  <span className="text-3xs text-slate-500">
                    {isBn ? `মোট প্রকল্প: ${toBengaliNumerals(investments.length)}টি` : `Total Projects: ${investments.length}`}
                  </span>
                </h5>

                <div className="space-y-2">
                  {investments.slice(0, 4).map((inv) => (
                    <div
                      key={inv.id}
                      className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{inv.title}</span>
                        <span className="text-3xs text-slate-500">
                          {isBn ? 'বিনিয়োগ মূলধন:' : 'Capital:'} {formatBDT(inv.amount, isBn)} •{' '}
                          {inv.status === 'completed'
                            ? (isBn ? 'সম্পন্ন' : 'Completed')
                            : (isBn ? 'চলমান' : 'Active')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-emerald-700 block">
                          {inv.returnAmount ? formatBDT(inv.returnAmount, isBn) : formatBDT(inv.expectedReturn || inv.amount, isBn)}
                        </span>
                        <span className="text-3xs text-emerald-600 font-semibold">
                          {inv.status === 'completed' ? (isBn ? 'রিটার্ন অর্জিত' : 'Realized Return') : (isBn ? 'প্রত্যাশিত' : 'Expected')}
                        </span>
                      </div>
                    </div>
                  ))}

                  {investments.length === 0 && (
                    <p className="text-center text-slate-400 py-3 text-2xs">
                      {isBn ? 'কোন বিনিয়োগ প্রকল্প এখনো লিপিবদ্ধ হয়নি' : 'No investment projects recorded yet'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: Official Printable Statement Slip */}
          {activeViewTab === 'statement' && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black">
                    ফান্ড
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {currentFund?.nameBn || currentFund?.name || 'প্রবাসী মুক্ত ফান্ড'}
                    </h4>
                    <p className="text-3xs text-slate-500">
                      {isBn ? 'সদস্য পরিচিতি ও আর্থিক বিবরণী সনদ' : 'Member Identity & Statement Certificate'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-2xs text-slate-500 block">ID: #{member.id.slice(0, 8)}</span>
                  <span className="text-3xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {isBn ? 'যাচাইকৃত সক্রিয়' : 'Verified Active'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-3xs text-slate-400 font-bold block">{isBn ? 'সদস্যের নাম' : 'Member Name'}</span>
                  <span className="font-extrabold text-slate-900 text-xs mt-0.5 block">{member.nameBn || member.name}</span>
                </div>
                <div>
                  <span className="text-3xs text-slate-400 font-bold block">{isBn ? 'শেয়ার সংখ্যা' : 'Shares'}</span>
                  <span className="font-extrabold text-slate-900 text-xs mt-0.5 block">
                    {isBn ? toBengaliNumerals(stats.shares) : stats.shares} {isBn ? 'টি' : 'shares'}
                  </span>
                </div>
                <div>
                  <span className="text-3xs text-slate-400 font-bold block">{isBn ? 'পরিশোধিত মাস' : 'Months Paid'}</span>
                  <span className="font-extrabold text-blue-700 text-xs mt-0.5 block">
                    {isBn ? `${toBengaliNumerals(stats.distinctMonthsPaidLifetime)} মাস` : `${stats.distinctMonthsPaidLifetime} mos`}
                  </span>
                </div>
                <div>
                  <span className="text-3xs text-slate-400 font-bold block">{isBn ? 'মোট প্রদত্ত সঞ্চয়' : 'Total Deposited'}</span>
                  <span className="font-extrabold text-emerald-700 text-xs mt-0.5 block">
                    {formatBDT(stats.totalDepositedLifetime, isBn)}
                  </span>
                </div>
              </div>

              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-3xs text-emerald-800 font-bold block">{isBn ? 'অর্জিত মুনাফা ও হার' : 'Profit & Rate'}</span>
                  <span className="font-black text-emerald-950 text-sm mt-0.5 block">
                    +{isBn ? toBengaliNumerals(stats.memberProfitPercentage) : stats.memberProfitPercentage}% লাভ ({formatBDT(stats.memberProfitAmount, isBn)})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-3xs text-emerald-800 font-bold block">{isBn ? 'সর্বমোট আর্থিক মূল্য' : 'Total Net Value'}</span>
                  <span className="font-black text-emerald-700 text-sm sm:text-base mt-0.5 block">
                    {formatBDT(stats.totalAssetValue, isBn)}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handlePrintSlip}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>{isBn ? 'রশিদ ও স্টেটমেন্ট প্রিন্ট করুন' : 'Print Statement Slip'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer active:scale-98"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
