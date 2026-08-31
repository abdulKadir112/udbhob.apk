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
  Globe,
  ArrowUpDown,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { useFund } from '../context/FundContext';
import { useAuth } from '../context/AuthContext';
import { Member, MonthlyPayment } from '../types';
import {
  MONTHS,
  formatBDT,
  toBengaliNumerals,
  getCountryFlag,
  getCountryBn,
  getCleanBaseName,
  sortMembersByBaseName,
  sortMembersByCountryAndName,
} from '../utils/formatters';
import { printYearlyFundMatrix } from '../utils/printHelpers';

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
  const { members, payments, selectedYear, setSelectedYear, availableYears, currentFund } = useFund();
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
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [isExportingImage, setIsExportingImage] = useState(false);

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
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [members]);

  // Filtered members list with country and search
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

  // Group filtered members by Country, and sort each group alphabetically by clean base name (ignoring Md/মোঃ)
  const countryGroups = useMemo(() => {
    const groupsMap = new Map<string, Member[]>();

    // Sort by clean root name
    const sorted = sortMembersByBaseName<Member>(filteredMembers, isBn);

    sorted.forEach((m) => {
      const c = m.country || 'Other';
      if (!groupsMap.has(c)) {
        groupsMap.set(c, []);
      }
      groupsMap.get(c)!.push(m);
    });

    const sortedCountryKeys = Array.from(groupsMap.keys()).sort((a, b) => {
      return a.localeCompare(b, isBn ? 'bn' : 'en');
    });

    return sortedCountryKeys.map((countryKey) => {
      const groupMembers = groupsMap.get(countryKey)!;
      let totalCountryPaid = 0;

      groupMembers.forEach((m) => {
        const monthMap = paymentsMap.get(m.id);
        if (monthMap) {
          monthMap.forEach((pmts) => {
            totalCountryPaid += pmts.reduce((sum, p) => sum + (p.amount || 0), 0);
          });
        }
      });

      return {
        country: countryKey,
        countryBn: getCountryBn(countryKey),
        flag: getCountryFlag(countryKey),
        members: groupMembers,
        totalCollectedYear: totalCountryPaid,
      };
    });
  }, [filteredMembers, paymentsMap, isBn]);

  // Total members in current view
  const totalFilteredCount = useMemo(() => {
    return countryGroups.reduce((sum, g) => sum + g.members.length, 0);
  }, [countryGroups]);

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

    const allSortedMembers = countryGroups.flatMap((g) => g.members);

    const rows = allSortedMembers.map((member) => {
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

  const handleDownloadHighQualityImage = async () => {
    if (!tableRef.current) return;
    setIsExportingImage(true);
    try {
      const { toPng } = await import('html-to-image');
      const tableEl = tableRef.current;

      const dataUrl = await toPng(tableEl, {
        pixelRatio: 2, // 2x high resolution
        backgroundColor: '#ffffff',
        cacheBust: true,
        fontEmbedCSS: '', // Prevents trying to read cross-origin Google Fonts stylesheets rules
        filter: (node) => {
          // Exclude any controls or non-exportable buttons if present
          if (node instanceof HTMLElement && node.classList.contains('no-export')) {
            return false;
          }
          return true;
        },
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Probashi_Mukto_Fund_Ledger_${selectedYear}_HD.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export high quality image:', error);
    } finally {
      setIsExportingImage(false);
    }
  };

  const handlePrint = () => {
    const allSortedMembers = countryGroups.flatMap((g) => g.members);
    printYearlyFundMatrix(allSortedMembers, payments, selectedYear, currentFund, isBn);
  };

  return (
    <section className="bg-white rounded-none border border-slate-200 shadow-xs overflow-hidden mb-6 flex flex-col w-full">
      {/* Header & Controls Bar */}
      <div className="p-3 sm:p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          
          {/* Title & Stats badge */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm sm:text-base lg:text-lg font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isBn ? `দেশভিত্তিক সদস্য তালিকা ও সঞ্চয় লেজার (${toBengaliNumerals(selectedYear)})` : `Country-Wise Member Ledger (${selectedYear})`}</span>
              </h2>
              <span className="px-2 py-0.5 rounded-none text-[10px] sm:text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                {isBn ? `${toBengaliNumerals(totalFilteredCount)} জন সদস্য` : `${totalFilteredCount} Members`}
              </span>
              <span className="px-2 py-0.5 rounded-none text-[9px] sm:text-3xs font-medium bg-slate-200 text-slate-700 border border-slate-300 shrink-0">
                {isBn ? 'মোঃ/MD বাদে মূল নাম বর্ণানুক্রমিক' : 'Sorted by core name'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              {isBn
                ? 'দেশ অনুযায়ী গ্রুপকৃত এবং মোঃ / MD বাদ দিয়ে মূল নামের বর্ণানুক্রমিক ক্রমানুসারে সাজানো।'
                : 'Grouped by country and sorted alphabetically by core name (ignoring Md/prefix).'}
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
                className="w-full pl-8 pr-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs bg-white border border-slate-200 rounded-none focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Country Dropdown Filter */}
            <div className="relative">
              <select
                id="select-country-filter"
                value={selectedCountryFilter}
                onChange={(e) => setSelectedCountryFilter(e.target.value)}
                className="py-1 sm:py-1.5 px-2 sm:px-3 text-[11px] sm:text-xs bg-white border border-slate-200 rounded-none focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-700 font-medium cursor-pointer"
              >
                <option value="all">{isBn ? '🌐 সকল দেশ (দেশভিত্তিক)' : '🌐 All Countries'}</option>
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
                className="py-1 sm:py-1.5 px-2 sm:px-3 text-[11px] sm:text-xs bg-emerald-50 border border-emerald-300 rounded-none focus:outline-hidden text-emerald-900 font-bold cursor-pointer"
              >
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {isBn ? `${toBengaliNumerals(yr)}` : `${yr}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Excel / CSV Export button */}
            <button
              id="btn-export-csv"
              onClick={handleExportCSV}
              className="p-1 sm:px-2.5 sm:py-1.5 rounded-none border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] sm:text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
              title={isBn ? 'এক্সেল/সিএসভি ফাইল ডাউনলোড' : 'Export Excel / CSV'}
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">{isBn ? 'এক্সেল/CSV' : 'Excel/CSV'}</span>
            </button>

            {/* High Quality Image Download button */}
            <button
              id="btn-download-matrix-image"
              onClick={handleDownloadHighQualityImage}
              disabled={isExportingImage}
              className="p-1 sm:px-2.5 sm:py-1.5 rounded-none border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title={isBn ? 'হাই-কোয়ালিটি ছবি (HD Image) ডাউনলোড করুন' : 'Download High Quality Image (HD)'}
            >
              {isExportingImage ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span className="hidden sm:inline">
                {isExportingImage ? (isBn ? 'তৈরি হচ্ছে...' : 'Exporting...') : (isBn ? 'ছবি ডাউনলোড' : 'HD Image')}
              </span>
            </button>

            {/* Print button */}
            <button
              id="btn-print-table"
              onClick={handlePrint}
              className="p-1 sm:px-2.5 sm:py-1.5 rounded-none border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] sm:text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
              title={isBn ? 'প্রিন্ট রিপোর্ট (A4 ফিট)' : 'Print Table'}
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBn ? 'প্রিন্ট লেজার' : 'Print'}</span>
            </button>

          </div>
        </div>

        {/* Quick Country Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-slate-500 shrink-0 mr-1">
            {isBn ? 'দেশ ফিল্টার:' : 'Filter Country:'}
          </span>
          <button
            onClick={() => setSelectedCountryFilter('all')}
            className={`px-2.5 py-1 rounded-none text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              selectedCountryFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            🌐 {isBn ? 'সকল দেশ' : 'All Countries'}
          </button>
          {countries.map((c) => {
            const count = members.filter((m) => m.country === c).length;
            const isSelected = selectedCountryFilter === c;
            return (
              <button
                key={c}
                onClick={() => setSelectedCountryFilter(c)}
                className={`px-2.5 py-1 rounded-none text-xs font-semibold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{getCountryFlag(c)}</span>
                <span>{isBn ? getCountryBn(c) : c}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-none ${isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                  {isBn ? toBengaliNumerals(count) : count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Legend Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2.5 pt-2.5 border-t border-slate-100 text-[10.5px] sm:text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{isBn ? 'নির্দেশিকা:' : 'Legend:'}</span>
          <span className="inline-flex items-center space-x-1">
            <span className="w-2 h-2 rounded-none bg-emerald-500" />
            <span className="text-emerald-700 font-medium">{isBn ? 'পরিশোধিত' : 'Paid'}</span>
          </span>
          <span className="inline-flex items-center space-x-1">
            <span className="w-2 h-2 rounded-none bg-amber-400" />
            <span className="text-amber-700 font-medium">{isBn ? 'আংশিক' : 'Partial'}</span>
          </span>
          <span className="inline-flex items-center space-x-1">
            <span className="w-2 h-2 rounded-none bg-slate-300" />
            <span className="text-slate-600">{isBn ? 'বকেয়া' : 'Due'}</span>
          </span>
          <span className="text-[10px] text-slate-400 ml-auto hidden sm:inline">
            {isBn ? '💡 সদস্যের নামের উপর ক্লিক করে A4 সাইজের অফিসিয়াল রশিদ প্রিন্ট করুন।' : '💡 Click on any member to print A4 statement slip.'}
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
            className="px-2.5 py-1 rounded-none bg-emerald-100/80 hover:bg-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
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
                className={`shrink-0 w-36 sm:w-44 p-3 rounded-none border transition-all cursor-pointer snap-center select-none ${
                  isRunningMonth
                    ? 'bg-gradient-to-br from-emerald-800 via-slate-900 to-emerald-950 text-white border-emerald-400/60 shadow-md ring-1 ring-emerald-400/40'
                    : isFocused
                    ? 'bg-white border-emerald-500 shadow-xs text-slate-900 ring-1 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isRunningMonth ? 'text-white' : 'text-slate-900'}`}>
                    {isBn ? m.nameBn : m.nameEn}
                  </span>
                  {isRunningMonth ? (
                    <span className="text-3xs font-extrabold px-1.5 py-0.5 rounded-none bg-emerald-400 text-slate-950 uppercase tracking-wider animate-pulse flex items-center gap-0.5">
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
      <div ref={tableScrollRef} className="overflow-x-auto relative scroll-smooth no-scrollbar w-full">
        <table ref={tableRef} className="w-full text-left text-xs border-collapse">
          
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] sm:text-2xs border-b border-slate-200 select-none">
              {/* Sticky Member Column (Left Frozen) */}
              <th className="sticky left-0 z-20 bg-slate-100 py-1.5 sm:py-2.5 px-1.5 sm:px-3 font-bold min-w-[110px] sm:min-w-[180px] md:min-w-[210px] shadow-r border-r border-slate-200">
                <div className="flex items-center justify-between">
                  <span>{isBn ? 'সদস্যের নাম (দেশভিত্তিক)' : 'Member Name & Country'}</span>
                  <span className="text-[9px] sm:text-2xs text-slate-400 lowercase font-normal hidden sm:inline">{isBn ? 'শেয়ার' : 'share'}</span>
                </div>
              </th>

              {/* 12 Months: January - December (Scrollable Horizontal Area) */}
              {MONTHS.map((m) => {
                const isRunning = selectedYear === currentRealYear && m.id === currentRealMonth;
                return (
                  <th
                    key={m.id}
                    ref={(el) => {
                      tableMonthColRefs.current[m.id] = el;
                    }}
                    onClick={() => scrollToMonth(m.id, true)}
                    className={`py-1.5 sm:py-2 px-1 text-center font-bold min-w-[50px] sm:min-w-[62px] md:min-w-[70px] border-l border-slate-200/60 cursor-pointer transition-colors ${
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
                    <div className="text-[8.5px] sm:text-2xs text-slate-400 font-normal">
                      {isRunning ? (isBn ? '⭐ রানিং' : 'Current') : (isBn ? m.shortBn : m.id)}
                    </div>
                  </th>
                );
              })}

              {/* Total Column on Right (Right Frozen) - Optimized padding on mobile */}
              <th className="sticky right-0 z-20 bg-slate-100 py-1.5 sm:py-2.5 px-1 sm:px-3 text-right font-bold min-w-[70px] sm:min-w-[110px] border-l-2 border-slate-200 shadow-l">
                <div className="text-slate-900 font-extrabold text-[10px] sm:text-xs leading-tight">{isBn ? 'মোট প্রাপ্তি' : 'Total Paid'}</div>
                <div className="text-[8.5px] sm:text-2xs text-slate-500 font-normal leading-tight">{isBn ? 'টার্গেট / স্ট্যাটাস' : 'Target / Status'}</div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 bg-white">
            {countryGroups.length === 0 || totalFilteredCount === 0 ? (
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
              countryGroups.map((group) => {
                return (
                  <React.Fragment key={group.country}>
                    {/* Country Header Grouping Banner (Sticky Left Info so it never scrolls off) */}
                    <tr className="bg-slate-100/95 border-t-2 border-b border-emerald-600/30">
                      <td
                        colSpan={14}
                        className="py-1 px-1.5 sm:px-2 text-slate-800 font-bold"
                      >
                        <div className="sticky left-0 inline-flex items-center gap-1.5 sm:gap-3 flex-wrap py-0.5 px-1 z-10 w-fit max-w-[calc(100vw-36px)]">
                          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                            <span className="text-sm sm:text-base leading-none">{group.flag}</span>
                            <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                              {isBn ? group.countryBn : group.country}
                            </span>
                          </div>

                          <span className="text-[9.5px] sm:text-2xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-none bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                            {isBn ? `${toBengaliNumerals(group.members.length)} জন সদস্য` : `${group.members.length} Members`}
                          </span>

                          <div className="text-[9.5px] sm:text-2xs font-semibold text-emerald-800 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-none border border-emerald-200/70 shrink-0 flex items-center gap-1">
                            <span className="text-slate-600 font-medium hidden sm:inline">{isBn ? 'দেশের মোট জমা:' : 'Total:'}</span>
                            <span className="text-slate-600 font-medium sm:hidden">{isBn ? 'মোট:' : 'Total:'}</span>
                            <strong className="font-mono font-bold text-slate-900">{formatBDT(group.totalCollectedYear, isBn)}</strong>
                          </div>

                          <span className="text-[9.5px] sm:text-3xs text-slate-500 font-normal hidden lg:inline">
                            ({isBn ? 'মূল নাম অনুসারে সাজানো' : 'Sorted alphabetically'})
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Members of this Country */}
                    {group.members.map((member) => {
                      const monthMap = paymentsMap.get(member.id);
                      let memberTotalYearPaid = 0;
                      const yearlyTarget = (member.monthlyShareAmount || 1000) * 12;
                      const cleanBase = getCleanBaseName(isBn ? member.nameBn || member.name : member.name);

                      return (
                        <tr
                          key={member.id}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          {/* Sticky Member Info Column (Left Frozen) */}
                          <td
                            className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/90 py-1 sm:py-2 px-1.5 sm:px-3 shadow-r border-r border-slate-200 transition-colors cursor-pointer"
                            onClick={() => onSelectMember(member)}
                          >
                            <div className="flex items-center space-x-1.5 sm:space-x-2.5">
                              {/* Avatar Icon: Hidden on mobile, visible on tablet & desktop */}
                              <div className="hidden sm:flex w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-100 border border-slate-200 items-center justify-center text-slate-700 font-bold text-[10px] sm:text-xs shrink-0 overflow-hidden shadow-2xs">
                                {member.avatarUrl ? (
                                  <img
                                    src={member.avatarUrl}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <span>{cleanBase.charAt(0)}</span>
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
                                <div className="flex items-center space-x-1 sm:space-x-2 text-[9px] sm:text-2xs text-slate-500">
                                  <span className="truncate">{isBn ? getCountryBn(member.country) : member.country}</span>
                                  <span>•</span>
                                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded-none whitespace-nowrap">
                                    {formatBDT(member.monthlyShareAmount || (member.shares ? member.shares * 1000 : 1000), isBn)}/{isBn ? 'মাস' : 'mo'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 12 Month Cells (Scrollable) */}
                          {MONTHS.map((m) => {
                            const monthPayments = monthMap?.get(m.id) || [];
                            const monthPaid = monthPayments.reduce((s, p) => s + (p.amount || 0), 0);
                            memberTotalYearPaid += monthPaid;

                            const requiredDue = member.monthlyShareAmount || (member.shares ? member.shares * 1000 : 1000);
                            const isFullPaid = monthPaid >= requiredDue;
                            const isPartial = monthPaid > 0 && monthPaid < requiredDue;

                            const isRunning = selectedYear === currentRealYear && m.id === currentRealMonth;

                            return (
                              <td
                                key={m.id}
                                className={`py-1 sm:py-2 px-0.5 sm:px-1 text-center border-l border-slate-100 transition-colors ${
                                  isRunning ? 'bg-emerald-50/30' : ''
                                }`}
                              >
                                {isFullPaid ? (
                                  <div
                                    onClick={() => onSelectMember(member)}
                                    className="inline-flex flex-col items-center justify-center p-0.5 sm:py-1 sm:px-1.5 rounded-none bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer w-full"
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
                                    className="inline-flex flex-col items-center justify-center p-0.5 sm:py-1 sm:px-1.5 rounded-none bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-all cursor-pointer w-full"
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
                                        className="opacity-0 group-hover/cell:opacity-100 text-[10px] px-1 py-0.5 rounded-none bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-600 font-medium transition-all cursor-pointer"
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

                          {/* Total Summary Cell for Member (Right Frozen) - Balanced padding on mobile */}
                          <td
                            className="sticky right-0 z-10 bg-white group-hover:bg-slate-50/90 py-1 sm:py-2 px-1 sm:px-3 text-right border-l-2 border-slate-200 shadow-l transition-colors cursor-pointer"
                            onClick={() => onSelectMember(member)}
                          >
                            <div className="space-y-0.5">
                              <div className="font-extrabold text-[10.5px] sm:text-xs md:text-sm text-slate-900 leading-tight">
                                {formatBDT(memberTotalYearPaid, isBn)}
                              </div>
                              <div className="flex items-center justify-end space-x-1">
                                {memberTotalYearPaid >= yearlyTarget ? (
                                  <span className="inline-flex items-center px-1 sm:px-1.5 py-0.5 rounded-none text-[8px] sm:text-3xs font-bold bg-emerald-100 text-emerald-800 leading-none">
                                    ✓ {isBn ? 'সম্পূর্ণ' : '100%'}
                                  </span>
                                ) : (
                                  <span className="text-[8px] sm:text-3xs font-semibold text-slate-500 leading-none">
                                    {isBn ? `${toBengaliNumerals(Math.round((memberTotalYearPaid / yearlyTarget) * 100))}% আদায়` : `${Math.round((memberTotalYearPaid / yearlyTarget) * 100)}%`}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })
            )}
          </tbody>

          {/* Table Footer: Total for each month */}
          <tfoot>
            <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-800">
              <td className="sticky left-0 z-20 bg-slate-900 py-1.5 sm:py-2.5 px-1.5 sm:px-3 shadow-r border-r border-slate-800">
                <div className="flex items-center justify-between text-[11px] sm:text-xs md:text-sm">
                  <span>{isBn ? 'সর্বমোট প্রাপ্তি:' : 'Fund Total:'}</span>
                  <span className="text-[9px] sm:text-2xs text-emerald-400 font-normal uppercase hidden sm:inline">
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
                    className={`py-1.5 sm:py-2 px-0.5 sm:px-1 text-center text-[10px] sm:text-xs border-l border-slate-800 transition-colors ${
                      isRunning ? 'bg-emerald-950/80 text-emerald-200' : ''
                    }`}
                  >
                    <div className={`font-bold ${isRunning ? 'text-emerald-300 font-black' : 'text-emerald-400'}`}>
                      {totalMonth > 0 ? formatBDT(totalMonth, isBn) : '—'}
                    </div>
                  </td>
                );
              })}

              <td className="sticky right-0 z-20 bg-slate-900 py-1.5 sm:py-2.5 px-1 sm:px-3 text-right border-l-2 border-slate-800 shadow-l">
                <div className="text-[10.5px] sm:text-xs md:text-sm text-emerald-400 font-black leading-tight">
                  {formatBDT(grandYearTotal, isBn)}
                </div>
                <div className="text-[8px] sm:text-3xs text-slate-400 font-normal leading-tight">
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
