import React, { useState, useMemo } from 'react';
import {
  Search,
  CreditCard,
  Trash2,
  Printer,
  Share2,
  Calendar,
  Clock,
  Filter,
  CheckCircle2,
  Download,
  Receipt,
  Sparkles,
  User,
  ArrowUpDown,
  RefreshCw,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { useFund } from '../context/FundContext';
import { useAuth } from '../context/AuthContext';
import { Member, MonthlyPayment, PaymentMethod } from '../types';
import {
  MONTHS,
  formatBDT,
  toBengaliNumerals,
  formatCustomDate,
  formatPaymentTime,
  sortPaymentsChronologically,
  getCountryFlag,
} from '../utils/formatters';
import { printSinglePaymentReceipt, printTransactionsLedger } from '../utils/printHelpers';

interface TransactionLedgerProps {
  language: 'bn' | 'en';
  onSelectMember?: (member: Member) => void;
  onOpenAddPayment?: () => void;
}

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({
  language,
  onSelectMember,
  onOpenAddPayment,
}) => {
  const { payments, members, deletePayment, selectedYear, currentFund } = useFund();
  const { isAdmin } = useAuth();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYearFilter, setSelectedYearFilter] = useState<number | 'all'>('all');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<number | 'all'>('all');
  const [selectedMethodFilter, setSelectedMethodFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // All unique payment methods
  const paymentMethods: PaymentMethod[] = [
    'bKash',
    'Nagad',
    'Rocket',
    'Bank Transfer',
    'Cash',
    'Remittance',
    'Other',
  ];

  // Available years from payments
  const availablePaymentYears = useMemo(() => {
    const set = new Set<number>([selectedYear, 2024, 2025, 2026, 2027]);
    payments.forEach((p) => {
      if (p.year) set.add(p.year);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [payments, selectedYear]);

  // Filtered payments list
  const filteredPayments = useMemo(() => {
    const list = payments.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.memberName?.toLowerCase().includes(q) ||
        (p.receiptNumber && p.receiptNumber.toLowerCase().includes(q)) ||
        (p.transactionId && p.transactionId.toLowerCase().includes(q)) ||
        p.paymentMethod?.toLowerCase().includes(q) ||
        (p.notes && p.notes.toLowerCase().includes(q)) ||
        (p.paymentDate && p.paymentDate.includes(q)) ||
        String(p.amount).includes(q);

      const matchesYear = selectedYearFilter === 'all' || p.year === selectedYearFilter;
      const matchesMonth = selectedMonthFilter === 'all' || p.month === selectedMonthFilter;
      const matchesMethod = selectedMethodFilter === 'all' || p.paymentMethod === selectedMethodFilter;

      return matchesQuery && matchesYear && matchesMonth && matchesMethod;
    });

    return sortPaymentsChronologically(list);
  }, [payments, searchQuery, selectedYearFilter, selectedMonthFilter, selectedMethodFilter]);

  // Summary Metrics for filtered view
  const totalFilteredAmount = useMemo(() => {
    return filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [filteredPayments]);

  const handleDelete = async (payment: MonthlyPayment) => {
    const memberName = payment.memberName || 'Member';
    const amountStr = formatBDT(payment.amount, isBn);
    const monthName = MONTHS[payment.month - 1]?.nameBn || payment.month;
    
    if (
      !confirm(
        isBn
          ? `⚠️ আপনি কি নিশ্চিত যে আপনি ${memberName}-এর ${monthName} মাসের ${amountStr} জমার রেকর্ডটি স্থায়ীভাবে মুছে ফেলতে চান?`
          : `⚠️ Are you sure you want to permanently delete payment of ${amountStr} for ${memberName}?`
      )
    ) {
      return;
    }

    try {
      setDeletingId(payment.id);
      await deletePayment(payment.id);
      setActionSuccessMsg(
        isBn
          ? `সঞ্চয় রেকর্ড (${memberName} - ${amountStr}) সফলভাবে মুছে ফেলা হয়েছে।`
          : `Payment record deleted successfully.`
      );
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Delete payment error:', err);
      alert(isBn ? 'লেনদেন মুছতে সমস্যা হয়েছে।' : 'Failed to delete payment.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyReceipt = (payment: MonthlyPayment) => {
    const monthName = isBn ? MONTHS[payment.month - 1]?.nameBn : MONTHS[payment.month - 1]?.nameEn;
    const msg = `🧾 *${currentFund.name} — জমার মানি রসিদ*\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `👤 সদস্য: ${payment.memberName}\n` +
      `🔢 রসিদ নং: ${payment.receiptNumber || payment.id.slice(0, 8)}\n` +
      `📅 মাস ও বছর: ${monthName} ${payment.year}\n` +
      `💰 জমাকৃত অর্থ: ${formatBDT(payment.amount, false)}\n` +
      `💳 মাধ্যম: ${payment.paymentMethod}\n` +
      `🗓️ তারিখ: ${payment.paymentDate}\n` +
      (payment.transactionId ? `🆔 ট্রানজেকশন আইডি: ${payment.transactionId}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `✅ প্রবাসী মুক্ত ফান্ডে আপনার সঞ্চয় নিরাপদে সংরক্ষিত রয়েছে।`;

    navigator.clipboard.writeText(msg);
    setCopiedId(payment.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePrintReceipt = (payment: MonthlyPayment) => {
    const member = members.find((m) => m.id === payment.memberId);
    printSinglePaymentReceipt(payment, member, currentFund, isBn);
  };

  const handlePrintAll = () => {
    printTransactionsLedger(filteredPayments, currentFund, isBn);
  };

  const handleExportCSV = () => {
    const headers = ['Receipt #', 'Member Name', 'Year', 'Month', 'Amount (BDT)', 'Payment Date', 'Method', 'Txn ID', 'Notes'];
    const rows = filteredPayments.map((p) => [
      p.receiptNumber || p.id.slice(0, 8),
      `"${p.memberName || ''}"`,
      p.year,
      MONTHS[p.month - 1]?.nameEn || p.month,
      p.amount,
      p.paymentDate,
      `"${p.paymentMethod}"`,
      `"${p.transactionId || ''}"`,
      `"${p.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fund_transactions_ledger_${currentFund.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      {/* 1. Header Banner matching Fund Styling */}
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 shrink-0">
            <Receipt className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {isBn ? 'লেনদেন ও সঞ্চয় লেজার' : 'Transactions & Savings Ledger'}
              </h2>
              <span className="text-3xs bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {currentFund.name}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isBn
                ? 'সদস্যদের জমাকৃত মাসিক সঞ্চয়ের বিস্তারিত স্টেটমেন্ট, রসিদ প্রিন্ট ও যাচাইকরণ।'
                : 'Complete records of verified member monthly payments and official receipt slips.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0 flex-wrap gap-y-2">
          {onOpenAddPayment && isAdmin && (
            <button
              onClick={onOpenAddPayment}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{isBn ? '+ নতুন সঞ্চয় জমা' : '+ Record Payment'}</span>
            </button>
          )}

          <button
            onClick={handlePrintAll}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-white/15"
            title={isBn ? 'সম্পূর্ণ লেজার প্রিন্ট করুন' : 'Print Ledger Statement'}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isBn ? 'লেজার প্রিন্ট' : 'Print Ledger'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-white/15"
            title={isBn ? 'এক্সেল / সিএসভি ডাউনলোড' : 'Export CSV'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isBn ? 'CSV ডাউনলোড' : 'Export'}</span>
          </button>
        </div>
      </div>

      {/* 2. Success Alert Notification */}
      {actionSuccessMsg && (
        <div className="m-4 sm:m-6 mb-0 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccessMsg('')}
            className="text-slate-400 hover:text-slate-700 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Summary Metric Stat Cards */}
      <div className="p-4 sm:p-6 pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-3xs uppercase font-bold text-slate-500 block">
              {isBn ? 'মোট প্রাপ্ত লেনদেন' : 'Filtered Transactions'}
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 block">
              {isBn ? `${toBengaliNumerals(filteredPayments.length)} টি` : `${filteredPayments.length}`}
            </span>
          </div>

          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
            <span className="text-3xs uppercase font-bold text-emerald-700 block">
              {isBn ? 'মোট সংগৃহীত পরিমাণ' : 'Total Contributed'}
            </span>
            <span className="text-lg sm:text-xl font-black text-emerald-700 mt-0.5 block">
              {formatBDT(totalFilteredAmount, isBn)}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-3xs uppercase font-bold text-slate-500 block">
              {isBn ? 'সক্রিয় সদস্য সংখ্যা' : 'Registered Members'}
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 block">
              {isBn ? `${toBengaliNumerals(members.length)} জন` : `${members.length}`}
            </span>
          </div>

          <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200">
            <span className="text-3xs uppercase font-bold text-blue-700 block">
              {isBn ? 'গড় কিস্তি পরিমাণ' : 'Average Payment'}
            </span>
            <span className="text-lg sm:text-xl font-black text-blue-800 mt-0.5 block">
              {formatBDT(filteredPayments.length > 0 ? Math.round(totalFilteredAmount / filteredPayments.length) : 0, isBn)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Filter & Search Controls Bar */}
      <div className="p-4 sm:p-6 pt-3 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search Box */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? '🔍 নাম, রসিদ নম্বর, মাধ্যম বা তারিখ...' : '🔍 Search name, receipt, method...'}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-800"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={selectedYearFilter}
              onChange={(e) => setSelectedYearFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">{isBn ? '📅 সকল বছর (All Years)' : '📅 All Years'}</option>
              {availablePaymentYears.map((yr) => (
                <option key={yr} value={yr}>
                  {isBn ? `${toBengaliNumerals(yr)} সাল` : `Year ${yr}`}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <select
              value={selectedMonthFilter}
              onChange={(e) => setSelectedMonthFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">{isBn ? '🌙 সকল মাস (All Months)' : '🌙 All Months'}</option>
              {MONTHS.map((m) => (
                <option key={m.id} value={m.id}>
                  {isBn ? m.nameBn : m.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Method Filter */}
          <div>
            <select
              value={selectedMethodFilter}
              onChange={(e) => setSelectedMethodFilter(e.target.value)}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">{isBn ? '💳 সকল মাধ্যম (All Methods)' : '💳 All Methods'}</option>
              {paymentMethods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Reset tag */}
        {(searchQuery || selectedYearFilter !== 'all' || selectedMonthFilter !== 'all' || selectedMethodFilter !== 'all') && (
          <div className="flex items-center justify-between text-2xs bg-slate-100/80 px-3 py-1.5 rounded-xl text-slate-600">
            <span>
              {isBn
                ? `ফিল্টারিং সক্রিয়: ${toBengaliNumerals(filteredPayments.length)} টি রেকর্ড প্রদর্শিত`
                : `Active filter: showing ${filteredPayments.length} records`}
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedYearFilter('all');
                setSelectedMonthFilter('all');
                setSelectedMethodFilter('all');
              }}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
            </button>
          </div>
        )}
      </div>

      {/* 5. Transactions Table / Responsive List */}
      <div className="p-4 sm:p-6 pt-0">
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-2xs border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">{isBn ? 'রসিদ ও তারিখ' : 'Receipt & Date'}</th>
                  <th className="py-3 px-4 font-bold">{isBn ? 'সদস্যের নাম ও দেশ' : 'Member & Country'}</th>
                  <th className="py-3 px-4 font-bold">{isBn ? 'সঞ্চয় মাস' : 'Month / Year'}</th>
                  <th className="py-3 px-4 font-bold">{isBn ? 'জমাকৃত পরিমাণ' : 'Amount'}</th>
                  <th className="py-3 px-4 font-bold">{isBn ? 'মাধ্যম ও ট্রানজেকশন' : 'Method & Txn'}</th>
                  <th className="py-3 px-4 text-right font-bold">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold text-xs text-slate-600">
                        {isBn ? 'কোনো লেনদেন রেকর্ড পাওয়া যায়নি।' : 'No transaction records found.'}
                      </p>
                      <p className="text-2xs text-slate-400 mt-0.5">
                        {isBn ? 'সার্চ বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।' : 'Try changing your search or filters.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => {
                    const member = members.find((m) => m.id === p.memberId);
                    const monthObj = MONTHS[p.month - 1];
                    const isDeletingThis = deletingId === p.id;
                    const isCopiedThis = copiedId === p.id;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                        {/* 1. Receipt & Date / Time */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono text-2xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md inline-block border border-slate-200">
                            #{p.receiptNumber || p.id.slice(0, 8)}
                          </div>
                          <div className="text-slate-600 text-2xs mt-1 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{formatCustomDate(p.paymentDate, isBn)}</span>
                          </div>
                          <div className="text-slate-500 text-3xs mt-0.5 font-medium flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-slate-400" />
                            <span>{formatPaymentTime(p.paymentTime, p.createdAt, isBn)}</span>
                          </div>
                        </td>

                        {/* 2. Member Name */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => member && onSelectMember && onSelectMember(member)}
                            className="font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1.5 text-left cursor-pointer transition-colors"
                          >
                            <span className="truncate max-w-[180px]">
                              {member?.nameBn || p.memberName}
                            </span>
                            {member?.country && (
                              <span className="text-3xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded-md font-semibold shrink-0">
                                {getCountryFlag(member.country)} {member.country}
                              </span>
                            )}
                          </button>
                          {member?.phone && (
                            <span className="text-3xs text-slate-400 font-mono block mt-0.5">
                              📞 {member.phone}
                            </span>
                          )}
                        </td>

                        {/* 3. Month & Year */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-800 bg-slate-100/90 border border-slate-200 px-2.5 py-1 rounded-lg text-2xs inline-block">
                            {isBn ? monthObj?.nameBn || p.month : monthObj?.nameEn || p.month} {isBn ? toBengaliNumerals(p.year) : p.year}
                          </span>
                        </td>

                        {/* 4. Amount */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-black font-mono text-emerald-700 text-sm bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/80 inline-block shadow-2xs">
                            +{formatBDT(p.amount, isBn)}
                          </span>
                        </td>

                        {/* 5. Method & Txn ID */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-3xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            {p.paymentMethod}
                          </span>
                          {p.transactionId && (
                            <div className="font-mono text-3xs text-slate-400 mt-0.5 truncate max-w-[120px]">
                              Txn: {p.transactionId}
                            </div>
                          )}
                        </td>

                        {/* 6. Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1">
                            {/* Copy Receipt Msg */}
                            <button
                              type="button"
                              onClick={() => handleCopyReceipt(p)}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isCopiedThis
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 border-slate-200'
                              }`}
                              title={isBn ? 'হোয়াটসঅ্যাপ মানি রসিদ কপি' : 'Copy WhatsApp Receipt'}
                            >
                              {isCopiedThis ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            {/* Print Receipt */}
                            <button
                              type="button"
                              onClick={() => handlePrintReceipt(p)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 border border-slate-200 transition-colors cursor-pointer"
                              title={isBn ? 'রসিদ প্রিন্ট করুন' : 'Print Slip'}
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button (Admin Only) */}
                            {isAdmin && (
                              <button
                                type="button"
                                disabled={isDeletingThis}
                                onClick={() => handleDelete(p)}
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                                title={isBn ? 'মুছে ফেলুন' : 'Delete Transaction'}
                              >
                                {isDeletingThis ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
