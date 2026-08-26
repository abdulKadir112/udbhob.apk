import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  User,
  Phone,
  Globe,
  Wallet,
  Shield,
  Layers,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import { Member, MonthlyPayment } from '../types';
import { MONTHS, formatBDT, formatCustomDate, toBengaliNumerals, getCountryFlag, getCountryBn } from '../utils/formatters';

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
  if (!member) return null;

  const isBn = language === 'bn';

  const [activeYear, setActiveYear] = useState<number>(selectedYear);

  // Filter payments for this member
  const memberPayments = payments.filter((p) => p.memberId === member.id);
  const yearPayments = memberPayments.filter((p) => p.year === activeYear);

  const totalLifetimePaid = memberPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalYearPaid = yearPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const yearlyTarget = (member.monthlyShareAmount || 1000) * 12;
  const yearDue = Math.max(0, yearlyTarget - totalYearPaid);

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-base overflow-hidden">
              {member.avatarUrl ? (
                <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span>{member.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  {isBn ? member.nameBn || member.name : member.name}
                </h3>
                <span>{getCountryFlag(member.country)}</span>
              </div>
              <p className="text-xs text-emerald-200">
                {isBn ? getCountryBn(member.country) : member.country} • {member.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintSlip}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1"
              title={isBn ? 'রশিদ স্লিপ প্রিন্ট করুন' : 'Print Statement'}
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{isBn ? 'রশিদ' : 'Print'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Member Overview Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-2xs text-slate-400 uppercase font-semibold block">{isBn ? 'মাসিক প্রতিশ্রুতি' : 'Monthly Due'}</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">{formatBDT(member.monthlyShareAmount, isBn)}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-2xs text-slate-400 uppercase font-semibold block">{isBn ? 'শেয়ার সংখ্যা' : 'Shares'}</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                {isBn ? toBengaliNumerals(member.shares) : member.shares} {isBn ? 'টি' : 'share'}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-2xs text-slate-400 uppercase font-semibold block">{isBn ? 'সর্বমোট প্রদান' : 'Lifetime Paid'}</span>
              <span className="text-sm font-bold text-emerald-700 mt-0.5 block">{formatBDT(totalLifetimePaid, isBn)}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-2xs text-slate-400 uppercase font-semibold block">{isBn ? 'যোগদানের তারিখ' : 'Joined Date'}</span>
              <span className="text-xs font-semibold text-slate-700 mt-0.5 block">{formatCustomDate(member.joinedDate, isBn)}</span>
            </div>
          </div>

          {/* Year selector tabs for statement */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-slate-800 mr-2">{isBn ? 'বছরভিত্তিক হিসেব:' : 'Ledger Year:'}</span>
              {[2024, 2025, 2026, 2027].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setActiveYear(yr)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${
                    activeYear === yr ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isBn ? toBengaliNumerals(yr) : yr}
                </button>
              ))}
            </div>

            <div className="text-right">
              <span className="text-2xs text-slate-500 block">{isBn ? 'এই বছরের মোট জমা:' : 'Year Paid:'}</span>
              <span className="font-extrabold text-emerald-700 text-sm">{formatBDT(totalYearPaid, isBn)}</span>
            </div>
          </div>

          {/* Month by month statement list */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-800 text-xs flex items-center justify-between">
              <span>{isBn ? `${toBengaliNumerals(activeYear)} সালের ১২ মাসের বিবরণী` : `12-Month Payment Breakdown (${activeYear})`}</span>
              <span className="text-2xs font-normal text-slate-500">
                {isBn ? `টার্গেট: ${formatBDT(yearlyTarget, isBn)}` : `Target: ${formatBDT(yearlyTarget, false)}`}
              </span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {MONTHS.map((m) => {
                const monthPayment = yearPayments.find((p) => p.month === m.id);
                const isPaid = !!monthPayment && monthPayment.amount >= member.monthlyShareAmount;
                const isPartial = !!monthPayment && monthPayment.amount > 0 && monthPayment.amount < member.monthlyShareAmount;

                return (
                  <div
                    key={m.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      isPaid
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                        : isPartial
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-slate-50/60 border-slate-200 text-slate-500'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">{isBn ? m.nameBn : m.nameEn}</span>
                      <span className="text-3xs block text-slate-400">
                        {monthPayment ? formatCustomDate(monthPayment.paymentDate, isBn) : (isBn ? 'বকেয়া' : 'Due')}
                      </span>
                    </div>

                    <div className="text-right">
                      {isPaid ? (
                        <div className="flex items-center space-x-1 font-extrabold text-emerald-700">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{formatBDT(monthPayment.amount, isBn)}</span>
                        </div>
                      ) : isPartial ? (
                        <span className="font-bold text-amber-700">{formatBDT(monthPayment.amount, isBn)}</span>
                      ) : (
                        <span className="text-slate-300 font-bold">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Printable Official Slip Card */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-xs text-emerald-400">{isBn ? 'প্রবাসী মুক্ত ফান্ড - অফিসিয়াল স্লিপ' : 'Official Fund Slip'}</span>
              <span className="font-mono text-2xs text-slate-400">ID: {member.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between text-2xs text-slate-300">
              <span>{isBn ? 'সদস্যের নাম:' : 'Member Name:'} <strong className="text-white">{member.name}</strong></span>
              <span>{isBn ? 'দেশ:' : 'Country:'} <strong className="text-white">{member.country}</strong></span>
            </div>
            <div className="flex justify-between text-2xs text-slate-300">
              <span>{isBn ? 'মোট প্রদত্ত সঞ্চয়:' : 'Total Contributed:'} <strong className="text-emerald-400">{formatBDT(totalLifetimePaid, isBn)}</strong></span>
              <span>{isBn ? 'স্ট্যাটাস:' : 'Status:'} <strong className="text-emerald-400">{isBn ? 'নিয়মিত সদস্য' : 'Active Member'}</strong></span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
