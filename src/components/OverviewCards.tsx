import React from 'react';
import {
  Wallet,
  TrendingUp,
  Landmark,
  Users,
  CalendarCheck,
  ArrowUpRight,
  Sparkles,
  PieChart,
  ShieldCheck,
} from 'lucide-react';
import { useFund } from '../context/FundContext';
import { formatBDT, toBengaliNumerals } from '../utils/formatters';

interface OverviewCardsProps {
  language: 'bn' | 'en';
  onNavigateToMatrix?: () => void;
  onNavigateToInvestments?: () => void;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  language,
  onNavigateToMatrix,
  onNavigateToInvestments,
}) => {
  const { stats, yearStats, selectedYear, members, investments, payments } = useFund();
  const isBn = language === 'bn';

  return (
    <section className="mb-6">
      {/* 5-Column Bento Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* 1. Total Collected (মোট জমা) */}
        <div
          id="card-total-collected"
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
          onClick={onNavigateToMatrix}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isBn ? 'মোট জমা (Collected)' : 'Total Collected'}
            </p>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/80">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600 tracking-tight">
            {formatBDT(stats.totalCollected, isBn)}
          </p>
          <p className="text-[9.5px] sm:text-2xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 inline" />
            {isBn
              ? `${toBengaliNumerals(payments.length)} টি কিস্তি সফলভাবে প্রাপ্ত`
              : `${payments.length} transactions received`}
          </p>
        </div>

        {/* 2. Total Invested (মোট ইনভেস্ট) */}
        <div
          id="card-total-invested"
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
          onClick={onNavigateToInvestments}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isBn ? 'মোট ইনভেস্ট (Invested)' : 'Total Invested'}
            </p>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/80">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-rose-600 tracking-tight">
            {formatBDT(stats.totalInvested, isBn)}
          </p>
          <p className="text-[9.5px] sm:text-2xs text-rose-500 mt-1 font-medium">
            {isBn
              ? `${toBengaliNumerals(stats.activeInvestmentsCount)} টি চলমান সামাজিক প্রকল্প`
              : `${stats.activeInvestmentsCount} active ventures`}
          </p>
        </div>

        {/* 3. Current Bank Balance (বর্তমান ব্যালেন্স) */}
        <div
          id="card-current-balance"
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all relative overflow-hidden group sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isBn ? 'বর্তমান ব্যালেন্স (Balance)' : 'Bank Balance'}
            </p>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
              <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            {formatBDT(stats.currentBalance, isBn)}
          </p>
          <p className="text-[9.5px] sm:text-2xs text-slate-500 mt-1 font-medium">
            {isBn ? 'ব্যাংক ও ক্যাশ রিজার্ভ ফান্ড' : 'Holding in Bank & Cash'}
          </p>
        </div>

        {/* 4. Total Members (মোট সদস্য) */}
        <div
          id="card-total-members"
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
          onClick={onNavigateToMatrix}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isBn ? 'মোট সদস্য (Members)' : 'Total Members'}
            </p>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/80">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 tracking-tight">
            {isBn ? toBengaliNumerals(stats.totalMembers) : stats.totalMembers}
          </p>
          <p className="text-[9.5px] sm:text-2xs text-blue-500 mt-1 font-medium">
            {isBn ? 'প্রবাসী সক্রিয় সদস্য' : 'Active global diaspora'}
          </p>
        </div>

        {/* 5. Year Collected (এই বছরের জমা) */}
        <div
          id="card-current-year-collected"
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
          onClick={onNavigateToMatrix}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isBn ? `এই বছরের জমা (${toBengaliNumerals(selectedYear)})` : `${selectedYear} Collected`}
            </p>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/80">
              <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-600 tracking-tight">
            {formatBDT(yearStats?.collectedInSelectedYear ?? stats?.currentYearCollected ?? 0, isBn)}
          </p>
          <p className="text-[9.5px] sm:text-2xs text-amber-600 mt-1 font-medium">
            {isBn
              ? `অগ্রগতি: ${toBengaliNumerals(yearStats?.completionPercentage ?? 0)}% পূরণ`
              : `Yearly Progress: ${yearStats?.completionPercentage ?? 0}%`}
          </p>
        </div>

      </div>
    </section>
  );
};
