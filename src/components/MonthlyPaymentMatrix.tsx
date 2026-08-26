import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Filter,
  Eye,
  Plus,
  UserCheck,
  Building2,
  Calendar,
  Sparkles,
  Printer,
  ChevronRight,
  TrendingUp,
  ChevronLeft,
  Flame,
} from 'lucide-react';
import { useFund } from '../context/FundContext';
import { useAuth } from '../context/AuthContext';
import { Member, MonthlyPayment } from '../types';
import { MONTHS, formatBDT, toBengaliNumerals, getCountryFlag, getCountryBn } from '../utils/formatters';

interface MonthlyPaymentMatrixProps {
  language: 'bn' | 'en';
  onSelectMember: (member: Member) => void;
  onOpenAddPaymentForMember?: (memberId: string, month: number, year: number) => void;
}

export const MonthlyPaymentMatrix: React.FC<MonthlyPaymentMatrixProps> = ({
  language,
  onSelectMember,
  onOpenAddPaymentForMember,
}) => {
  const { members, payments, selectedYear, setSelectedYear, availableYears } = useFund();
  const { isAdmin } = useAuth();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('all');
  const [activeFocusedMonth, setActiveFocusedMonth] = useState<number | null>(null);

  // Month Scroll Container & Table Scroll Refs for auto-focusing on running month
  const monthScrollContainerRef = useRef<HTMLDivElement>(null);
  const monthCardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const tableMonthColRefs = useRef<Record<number, HTMLTableCellElement | null>>({});

  // Real-world current year and month
  const now = new Date();
  const currentRealYear = now.getFullYear();
  const currentRealMonth = now.getMonth() + 1; // 1-12 (August = 8, Sept = 9)

  // Build matrix lookup: memberId -> month (1-12) -> MonthlyPayment[]
  const paymentsMap = useMemo(() => {
    const map = new Map<string, Map<number, MonthlyPayment[]>>();
    payments.forEach((payment) => {
      if (payment.year === selectedYear) {
        if (!map.has(payment.memberId)) {
          map.set(payment.memberId, new Map());
        }
        const monthMap = map.get(payment.memberId)!;
        if (!monthMap.has(payment.month)) {
          monthMap.set(payment.month, []);
        }
        monthMap.get(payment.month)!.push(payment);
      }
    });
    return map;
  }, [payments, selectedYear]);

  // List of unique countries among members
  const countries = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.country) set.add(m.country);
    });
    return Array.from(set);
  }, [members]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        member.name.toLowerCase().includes(q) ||
        (member.nameBn && member.nameBn.includes(q)) ||
        member.phone.toLowerCase().includes(q) ||
        member.country.toLowerCase().includes(q);

      const matchCountry = selectedCountryFilter === 'all' || member.country === selectedCountryFilter;

      return matchSearch && matchCountry;
    });
  }, [members, searchQuery, selectedCountryFilter]);

  // Monthly totals across all members for selected year
  const monthlyFundTotals = useMemo(() => {
    const totals: Record<number, number> = {};
    for (let m = 1; m <= 12; m++) {
      totals[m] = 0;
    }
    payments.forEach((p) => {
      if (p.year === selectedYear && p.month >= 1 && p.month <= 12) {
        totals[p.month] = (totals[p.month] || 0) + (p.amount || 0);
      }
    });
    return totals;
  }, [payments, selectedYear]);

  // Count of paid members in each month for selected year
  const monthlyPaidMemberCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let m = 1; m <= 12; m++) {
      let paidCount = 0;
      members.forEach((member) => {
        const monthPays = paymentsMap.get(member.id)?.get(m) || [];
        const sum = monthPays.reduce((acc, p) => acc + (p.amount || 0), 0);
        if (sum >= (member.monthlyShareAmount || 1000)) {
          paidCount++;
        }
      });
      counts[m] = paidCount;
    }
    return counts;
  }, [members, paymentsMap]);

  const grandYearTotal = useMemo(() => {
    return (Object.values(monthlyFundTotals) as number[]).reduce((sum: number, val: number) => sum + val, 0);
  }, [monthlyFundTotals]);

  // Auto-scroll to running month (e.g. August when August, September when September)
  const scrollToMonth = (monthId: number, smooth: boolean = true) => {
    setActiveFocusedMonth(monthId);

    // 1. Scroll month horizon carousel
    const cardEl = monthCardRefs.current[monthId];
    if (cardEl && monthScrollContainerRef.current) {
      cardEl.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        inline: 'center',
        block: 'nearest',
      });
    }

    // 2. Scroll main matrix table on mobile
    const colEl = tableMonthColRefs.current[monthId];
    if (colEl && tableScrollRef.current) {
      const tableContainer = tableScrollRef.current;
      const colLeft = colEl.offsetLeft;
      tableContainer.scrollTo({
        left: Math.max(0, colLeft - 180),
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  // Initial & Year change auto-scroll effect
  useEffect(() => {
    const targetMonth = selectedYear === currentRealYear ? currentRealMonth : 1;
    const timer = setTimeout(() => {
      scrollToMonth(targetMonth, true);
    }, 150);

    return () => clearTimeout(timer);
  }, [selectedYear, currentRealYear, currentRealMonth]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Member Name',
      'Country',
      'Shares',
      'Monthly Due',
      ...MONTHS.map((m) => m.nameEn),
      'Total Paid',
      'Status',
    ];

    const rows = filteredMembers.map((member) => {
      const monthMap = paymentsMap.get(member.id);
      let memberYearTotal = 0;

      const monthCols = MONTHS.map((m) => {
        const monthPays = monthMap?.get(m.id) || [];
        const monthTotal = monthPays.reduce((s, p) => s + p.amount, 0);
        memberYearTotal += monthTotal;
        return monthTotal > 0 ? monthTotal : 0;
      });

      const yearlyTarget = member.monthlyShareAmount * 12;
      const status = memberYearTotal >= yearlyTarget ? 'Completed' : `${Math.round((memberYearTotal / yearlyTarget) * 100)}% Paid`;

      return [
        `"${member.name}"`,
        `"${member.country}"`,
        member.shares,
        member.monthlyShareAmount,
        ...monthCols,
        memberYearTotal,
        `"${status}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Probashi_Mukto_Fund_Ledger_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6 flex flex-col">
      {/* Header & Controls Bar */}
      <div className="p-3 sm:p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          
          {/* Title & Stats badge */}
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm sm:text-base lg:text-lg font-bold text-slate-800 tracking-tight">
                {isBn ? `সদস্য সঞ্চয় আদায় স্ট্যাটাস (${toBengaliNumerals(selectedYear)} ট্র্যাকার)` : `Member Payment Status (${selectedYear} Tracker)`}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                {isBn ? `${toBengaliNumerals(filteredMembers.length)} জন` : `${filteredMembers.length} Members`}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              {isBn
                ? 'জানুয়ারি থেকে ডিসেম্বর পর্যন্ত সকল সদস্যের সঞ্চয় পরিশোধের লাইভ আপডেট।'
                : 'Month-by-month payment tracking with instant verification and receipts.'}
            </p>
          </div>

          {/* Action Tools: Search, Filter, Export */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
            
            {/* Search Bar */}
            <div className="relative min-w-[140px] sm:min-w-[200px] flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-search-members"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'সদস্য খুঁজুন...' : 'Search members...'}
                className="w-full pl-8 pr-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Country Filter */}
            <div className="relative">
              <select
                id="select-country-filter"
                value={selectedCountryFilter}
                onChange={(e) => setSelectedCountryFilter(e.target.value)}
                className="py-1 sm:py-1.5 px-2 sm:px-3 text-[11px] sm:text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 font-medium cursor-pointer"
              >
                <option value="all">{isBn ? 'সকল দেশ' : 'All Countries'}</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {getCountryFlag(c)} {isBn ? getCountryBn(c) : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Selector */}
            <div className="relative">
              <select
                id="select-matrix-year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="py-1 sm:py-1.5 px-2 sm:px-3 text-[11px] sm:text-xs bg-emerald-50 border border-emerald-300 rounded-lg focus:outline-hidden text-emerald-900 font-bold cursor-pointer"
              >
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {isBn ? `${toBengaliNumerals(yr)}` : `${yr}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Print & CSV buttons */}
            <button
              id="btn-export-csv"
              onClick={handleExportCSV}
              className="p-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] sm:text-xs font-semibold flex items-center space-x-1 transition-colors"
              title={isBn ? 'সিএসভি ডাউনলোড' : 'Export CSV'}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBn ? 'সিএসভি' : 'CSV'}</span>
            </button>

            <button
              id="btn-print-table"
              onClick={handlePrint}
              className="p-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] sm:text-xs font-semibold flex items-center space-x-1 transition-colors"
              title={isBn ? 'প্রিন্ট রিপোর্ট' : 'Print Table'}
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBn ? 'প্রিন্ট' : 'Print'}</span>
            </button>

          </div>
        </div>

        {/* Quick Legend Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2.5 pt-2.5 border-t border-slate-100 text-[10.5px] sm:text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{isBn ? 'নির্দেশিকা:' : 'Legend:'}</span>
          <span className="inline-flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-emerald-700 font-medium">{isBn ? 'পরিশোধিত' : 'Paid'}</span>
          </span>
          <span className="inline-flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-amber-700 font-medium">{isBn ? 'আংশিক' : 'Partial'}</span>
          </span>
          <span className="inline-flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="text-slate-600">{isBn ? 'বকেয়া' : 'Due'}</span>
          </span>
          <span className="text-[10px] text-slate-400 ml-auto hidden sm:inline">
            {isBn ? '💡 সদস্যের নামে ক্লিক করে পূর্ণাঙ্গ হিস্ট্রি ও রশিদ স্লিপ দেখুন।' : '💡 Click on any member to view full statement slip.'}
          </span>
        </div>
      </div>

      {/* Monthly Collections Horizon Scroll Ribbon (রানিং মাস অটো-স্ক্রল বার) */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/70">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              {isBn ? '১২ মাসের জমা ও রানিং মাস ট্র্যাকার' : '12-Month Live Collection Bar'}
            </h3>
            <span className="text-2xs text-slate-500 font-medium hidden sm:inline">
              {isBn ? `(${selectedYear === currentRealYear ? 'বর্তমান রানিং মাসে অটো-স্ক্রল' : `${toBengaliNumerals(selectedYear)} সালের ডাটা`})` : `(${selectedYear === currentRealYear ? 'Auto-scrolled to running month' : `Year ${selectedYear}`})`}
            </span>
          </div>

          <button
            onClick={() => {
              const targetMonth = selectedYear === currentRealYear ? currentRealMonth : 1;
              scrollToMonth(targetMonth, true);
            }}
            className="px-2.5 py-1 rounded-lg bg-emerald-100/80 hover:bg-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>{isBn ? 'রানিং মাসে যান' : 'Go to Current Month'}</span>
          </button>
        </div>

        {/* Horizontal Month Strip Carousel */}
        <div
          ref={monthScrollContainerRef}
          className="flex space-x-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {MONTHS.map((m) => {
            const totalCollected = monthlyFundTotals[m.id] || 0;
            const paidCount = monthlyPaidMemberCounts[m.id] || 0;
            const isRunningMonth = selectedYear === currentRealYear && m.id === currentRealMonth;
            const isFocused = activeFocusedMonth === m.id;

            return (
              <div
                key={m.id}
                ref={(el) => {
                  monthCardRefs.current[m.id] = el;
                }}
                onClick={() => scrollToMonth(m.id, true)}
                className={`shrink-0 w-36 sm:w-44 p-3 rounded-2xl border transition-all cursor-pointer snap-center select-none ${
                  isRunningMonth
                    ? 'bg-gradient-to-br from-emerald-800 via-slate-900 to-emerald-950 text-white border-emerald-400/60 shadow-md ring-2 ring-emerald-400/40 transform scale-[1.02]'
                    : isFocused
                    ? 'bg-white border-emerald-500 shadow-xs text-slate-900 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isRunningMonth ? 'text-white' : 'text-slate-900'}`}>
                    {isBn ? m.nameBn : m.nameEn}
                  </span>
                  {isRunningMonth ? (
                    <span className="text-3xs font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5 fill-current" />
                      <span>{isBn ? 'রানিং মাস' : 'Current'}</span>
                    </span>
                  ) : (
                    <span className="text-3xs text-slate-400 font-semibold">
                      {isBn ? `${toBengaliNumerals(m.id)}ম মাস` : `M${m.id}`}
                    </span>
                  )}
                </div>

                {/* Collected Amount */}
                <div className={`text-sm sm:text-base font-black font-mono tracking-tight mt-1 ${
                  isRunningMonth ? 'text-emerald-300' : totalCollected > 0 ? 'text-emerald-700' : 'text-slate-400'
                }`}>
                  {totalCollected > 0 ? formatBDT(totalCollected, isBn) : isBn ? '৳০ জমা' : '৳0 Paid'}
                </div>

                {/* Member Payment Progress Count */}
                <div className={`flex items-center justify-between mt-2 pt-1.5 border-t text-2xs ${
                  isRunningMonth ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <span className={isRunningMonth ? 'text-emerald-200 font-medium' : 'text-slate-500'}>
                    {isBn ? 'পরিশোধিত:' : 'Paid:'}
                  </span>
                  <span className={`font-bold ${
                    isRunningMonth
                      ? 'text-white'
                      : paidCount > 0
                      ? 'text-emerald-700 font-extrabold'
                      : 'text-slate-400'
                  }`}>
                    {isBn ? `${toBengaliNumerals(paidCount)}/${toBengaliNumerals(members.length)} জন` : `${paidCount}/${members.length}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Grid Table */}
      <div ref={tableScrollRef} className="overflow-x-auto relative scroll-smooth no-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 uppercase tracking-wider text-[10px] sm:text-2xs border-b border-slate-200 select-none">
              {/* Sticky Member Column */}
              <th className="sticky left-0 z-20 bg-slate-100 py-2.5 sm:py-3.5 px-2.5 sm:px-4 font-bold min-w-[140px] sm:min-w-[190px] md:min-w-[220px] shadow-r">
                <div className="flex items-center justify-between">
                  <span>{isBn ? 'সদস্যের নাম ও দেশ' : 'Member & Location'}</span>
                  <span className="text-[9px] sm:text-2xs text-slate-400 lowercase font-normal">{isBn ? 'শেয়ার' : 'share'}</span>
                </div>
              </th>

              {/* 12 Months: January - December */}
              {MONTHS.map((m) => {
                const isRunning = selectedYear === currentRealYear && m.id === currentRealMonth;
                return (
                  <th
                    key={m.id}
                    ref={(el) => {
                      tableMonthColRefs.current[m.id] = el;
                    }}
                    onClick={() => scrollToMonth(m.id, true)}
                    className={`py-2 sm:py-3 px-1 sm:px-2 text-center font-bold min-w-[56px] sm:min-w-[70px] md:min-w-[80px] border-l border-slate-200/60 cursor-pointer transition-colors ${
                      isRunning
                        ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                        : activeFocusedMonth === m.id
                        ? 'bg-slate-200/80 text-slate-900'
                        : 'hover:bg-slate-200/50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                      <span className={`text-[10px] sm:text-xs ${isRunning ? 'font-extrabold text-emerald-900' : 'text-slate-800'}`}>
                        {isBn ? m.nameBn : m.shortEn}
                      </span>
                      {isRunning && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                      )}
                    </div>
                    <div className="text-[9px] sm:text-2xs text-slate-400 font-normal">
                      {isRunning ? (isBn ? '⭐ রানিং' : 'Current') : (isBn ? m.shortBn : m.id)}
                    </div>
                  </th>
                );
              })}

              {/* Total Column on Right */}
              <th className="sticky right-0 z-20 bg-slate-100 py-2.5 sm:py-3.5 px-2.5 sm:px-4 text-right font-bold min-w-[95px] sm:min-w-[125px] border-l-2 border-slate-200 shadow-l">
                <div className="text-slate-900 font-extrabold text-[10.5px] sm:text-xs">{isBn ? 'মোট প্রাপ্তি' : 'Total Paid'}</div>
                <div className="text-[9px] sm:text-2xs text-slate-500 font-normal">{isBn ? 'টার্গেট / স্ট্যাটাস' : 'Target / Status'}</div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={14} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Search className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">
                      {isBn ? 'কোন সদস্য পাওয়া যায়নি' : 'No members match the search query'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {isBn ? 'অনুগ্রহ করে অনুসন্ধানের শব্দ পরিবর্তন করুন।' : 'Try clearing your search query or filter.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredMembers.map((member, index) => {
                const monthMap = paymentsMap.get(member.id);
                let memberTotalYearPaid = 0;
                const yearlyTarget = (member.monthlyShareAmount || 1000) * 12;

                return (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Sticky Member Info Column */}
                    <td
                      className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/90 py-2 sm:py-3 px-2 sm:px-4 shadow-r transition-colors cursor-pointer"
                      onClick={() => onSelectMember(member)}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-2.5">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-[10px] sm:text-xs shrink-0 overflow-hidden shadow-2xs">
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span>{member.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1">
                            <p className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-900 truncate hover:text-emerald-700">
                              {isBn ? member.nameBn || member.name : member.name}
                            </p>
                            <span className="text-[10px] sm:text-xs shrink-0" title={member.country}>
                              {getCountryFlag(member.country)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2 text-[9.5px] sm:text-2xs text-slate-500">
                            <span className="truncate">{isBn ? getCountryBn(member.country) : member.country}</span>
                            <span>•</span>
                            <span className="font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                              {formatBDT(member.monthlyShareAmount, isBn)}/{isBn ? 'মাস' : 'mo'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 12 Month Cells */}
                    {MONTHS.map((m) => {
                      const monthPayments = monthMap?.get(m.id) || [];
                      const monthPaid = monthPayments.reduce((s, p) => s + (p.amount || 0), 0);
                      memberTotalYearPaid += monthPaid;

                      const isFullPaid = monthPaid >= member.monthlyShareAmount;
                      const isPartial = monthPaid > 0 && monthPaid < member.monthlyShareAmount;
                      const isUnpaid = monthPaid === 0;

                      const isRunning = selectedYear === currentRealYear && m.id === currentRealMonth;

                      return (
                        <td
                          key={m.id}
                          className={`py-1.5 sm:py-2.5 px-0.5 sm:px-1.5 text-center border-l border-slate-100 transition-colors ${
                            isRunning ? 'bg-emerald-50/30' : ''
                          }`}
                        >
                          {isFullPaid ? (
                            <div
                              onClick={() => onSelectMember(member)}
                              className="inline-flex flex-col items-center justify-center p-0.5 sm:py-1.5 sm:px-2 rounded-md sm:rounded-lg bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer w-full"
                              title={`${isBn ? m.nameBn : m.nameEn}: ${formatBDT(monthPaid, isBn)} (${monthPayments[0]?.paymentMethod || 'Paid'})`}
                            >
                              <div className="flex items-center space-x-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                                <span className="font-bold text-[10px] sm:text-xs">
                                  {formatBDT(monthPaid, isBn)}
                                </span>
                              </div>
                              <span className="text-[8px] sm:text-3xs text-emerald-600/80 font-medium">
                                {monthPayments[0]?.paymentMethod || 'Paid'}
                              </span>
                            </div>
                          ) : isPartial ? (
                            <div
                              onClick={() => onSelectMember(member)}
                              className="inline-flex flex-col items-center justify-center p-0.5 sm:py-1.5 sm:px-2 rounded-md sm:rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-all cursor-pointer w-full"
                              title={`${isBn ? 'আংশিক জমা' : 'Partial'}: ${formatBDT(monthPaid, isBn)}`}
                            >
                              <span className="font-bold text-[10px] sm:text-xs text-amber-700">
                                {formatBDT(monthPaid, isBn)}
                              </span>
                              <span className="text-[8px] sm:text-3xs text-amber-600 font-semibold">{isBn ? 'আংশিক' : 'Partial'}</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center py-1.5 group/cell">
                              {isAdmin && onOpenAddPaymentForMember ? (
                                <button
                                  onClick={() => onOpenAddPaymentForMember(member.id, m.id, selectedYear)}
                                  className="opacity-0 group-hover/cell:opacity-100 text-[10px] px-1 py-0.5 rounded bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-600 font-medium transition-all"
                                  title={isBn ? 'সঞ্চয় জমা দিন' : 'Add Payment'}
                                >
                                  + {isBn ? 'জমা' : 'Pay'}
                                </button>
                              ) : (
                                <span className="text-slate-300 text-[10px] select-none">—</span>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Total Summary Cell for Member */}
                    <td
                      className="sticky right-0 z-10 bg-white group-hover:bg-slate-50/90 py-2 sm:py-3 px-2 sm:px-4 text-right border-l-2 border-slate-200 shadow-l transition-colors cursor-pointer"
                      onClick={() => onSelectMember(member)}
                    >
                      <div className="space-y-0.5">
                        <div className="font-extrabold text-[11px] sm:text-xs md:text-sm text-slate-900">
                          {formatBDT(memberTotalYearPaid, isBn)}
                        </div>
                        <div className="flex items-center justify-end space-x-1">
                          {memberTotalYearPaid >= yearlyTarget ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] sm:text-3xs font-bold bg-emerald-100 text-emerald-800">
                              ✓ {isBn ? 'সম্পূর্ণ' : '100%'}
                            </span>
                          ) : (
                            <span className="text-[8.5px] sm:text-3xs font-semibold text-slate-500">
                              {isBn ? `${toBengaliNumerals(Math.round((memberTotalYearPaid / yearlyTarget) * 100))}% আদায়` : `${Math.round((memberTotalYearPaid / yearlyTarget) * 100)}%`}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>

          {/* Table Footer: Total for each month */}
          <tfoot>
            <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-800">
              <td className="sticky left-0 z-20 bg-slate-900 py-2.5 sm:py-3.5 px-2.5 sm:px-4 shadow-r">
                <div className="flex items-center justify-between text-[11px] sm:text-xs md:text-sm">
                  <span>{isBn ? 'সর্বমোট প্রাপ্তি:' : 'Fund Total:'}</span>
                  <span className="text-[9px] sm:text-2xs text-emerald-400 font-normal uppercase">
                    {isBn ? `${toBengaliNumerals(selectedYear)}` : `${selectedYear}`}
                  </span>
                </div>
              </td>

              {MONTHS.map((m) => {
                const totalMonth = monthlyFundTotals[m.id] || 0;
                const isRunning = selectedYear === currentRealYear && m.id === currentRealMonth;
                return (
                  <td
                    key={m.id}
                    className={`py-2.5 px-0.5 sm:px-1.5 text-center text-[10px] sm:text-xs border-l border-slate-800 transition-colors ${
                      isRunning ? 'bg-emerald-950/80 text-emerald-200' : ''
                    }`}
                  >
                    <div className={`font-bold ${isRunning ? 'text-emerald-300 font-black' : 'text-emerald-400'}`}>
                      {totalMonth > 0 ? formatBDT(totalMonth, isBn) : '—'}
                    </div>
                  </td>
                );
              })}

              <td className="sticky right-0 z-20 bg-slate-900 py-2.5 sm:py-3.5 px-2.5 sm:px-4 text-right border-l-2 border-slate-800 shadow-l">
                <div className="text-[11px] sm:text-xs md:text-sm text-emerald-400 font-black">
                  {formatBDT(grandYearTotal, isBn)}
                </div>
                <div className="text-[8.5px] sm:text-3xs text-slate-400 font-normal">
                  {isBn ? 'বাৎসরিক মোট' : 'Grand Total'}
                </div>
              </td>
            </tr>
          </tfoot>

        </table>
      </div>
    </section>
  );
};
