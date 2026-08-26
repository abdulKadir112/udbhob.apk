import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Calendar,
  User,
  CheckCircle,
  Clock,
  DollarSign,
  AlertCircle,
  Tag,
  Phone,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Building,
  CheckCheck,
  Trash2,
  Edit,
} from 'lucide-react';
import { useFund } from '../context/FundContext';
import { useAuth } from '../context/AuthContext';
import { Investment, InvestmentCategory, InvestmentStatus } from '../types';
import { formatBDT, formatCustomDate, toBengaliNumerals } from '../utils/formatters';

interface InvestmentSectionProps {
  language: 'bn' | 'en';
  onOpenAddInvestment: () => void;
  onEditInvestment?: (investment: Investment) => void;
}

export const InvestmentSection: React.FC<InvestmentSectionProps> = ({
  language,
  onOpenAddInvestment,
  onEditInvestment,
}) => {
  const { investments, updateInvestment, deleteInvestment } = useFund();
  const { isAdmin } = useAuth();
  const isBn = language === 'bn';

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Complete Venture Modal state
  const [completingInvestment, setCompletingInvestment] = useState<Investment | null>(null);
  const [returnAmountInput, setReturnAmountInput] = useState<string>('');
  const [completionNotes, setCompletionNotes] = useState<string>('');

  const filteredInvestments = investments.filter((inv) => {
    const matchCat = filterCategory === 'all' || inv.category === filterCategory;
    const matchStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchCat && matchStatus;
  });

  const activeInvestments = investments.filter((i) => i.status === 'active');
  const completedInvestments = investments.filter((i) => i.status === 'completed');

  const totalActiveCapital = activeInvestments.reduce((sum, i) => sum + i.amount, 0);
  const totalCompletedReturn = completedInvestments.reduce((sum, i) => sum + (i.returnAmount || 0), 0);
  const totalCompletedCapital = completedInvestments.reduce((sum, i) => sum + i.amount, 0);
  const totalNetProfit = totalCompletedReturn - totalCompletedCapital;

  const handleMarkCompleted = async () => {
    if (!completingInvestment) return;
    const retAmt = Number(returnAmountInput) || completingInvestment.expectedReturn || completingInvestment.amount;
    
    await updateInvestment(completingInvestment.id, {
      status: 'completed',
      returnAmount: retAmt,
      completionDate: new Date().toISOString().split('T')[0],
      notes: completionNotes || completingInvestment.notes,
    });

    setCompletingInvestment(null);
    setReturnAmountInput('');
    setCompletionNotes('');
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(isBn ? `আপনি কি নিশ্চিতভাবে "${title}" প্রকল্পটি মুছে ফেলতে চান?` : `Are you sure you want to delete "${title}"?`)) {
      await deleteInvestment(id);
    }
  };

  const getCategoryBadge = (cat: InvestmentCategory) => {
    switch (cat) {
      case 'livestock':
        return { label: isBn ? 'গরু / পশু পালন' : 'Livestock', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'agriculture':
        return { label: isBn ? 'কৃষি ও মৎস্য' : 'Agriculture & Fish', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'land':
        return { label: isBn ? 'জমি লিজ / ক্রয়' : 'Land / Lease', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'emergency_loan':
        return { label: isBn ? 'জরুরি কর্জে হাসানা' : 'Emergency Loan', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      default:
        return { label: isBn ? 'সাধারণ ব্যবসা' : 'Business Venture', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const getStatusBadge = (status: InvestmentStatus) => {
    switch (status) {
      case 'active':
        return {
          label: isBn ? 'চলমান প্রকল্প' : 'Active Venture',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold',
          icon: <Clock className="w-3.5 h-3.5 text-emerald-600 animate-spin" />,
        };
      case 'completed':
        return {
          label: isBn ? 'সফলভাবে সমাপ্ত' : 'Completed & Profit Distributed',
          color: 'bg-blue-50 text-blue-700 border-blue-300 font-bold',
          icon: <CheckCheck className="w-3.5 h-3.5 text-blue-600" />,
        };
      case 'cancelled':
        return {
          label: isBn ? 'বাতিল' : 'Cancelled',
          color: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-500" />,
        };
      default:
        return {
          label: isBn ? 'চলমান' : 'Active',
          color: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: <Clock className="w-3.5 h-3.5" />,
        };
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 border-b border-slate-200/70 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {isBn ? 'প্রবাসী যৌথ বিনিয়োগ ও প্রকল্প বিবরণী' : 'Diaspora Joint Ventures & Investments'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl">
              {isBn
                ? 'সদস্যদের সঞ্চিত তহবিল থেকে দেশে বাস্তবমুখী লাভজনক প্রকল্পে যৌথ বিনিয়োগ (গরু পালন, জমি লিজ, মৎস্য চাষ ইত্যাদি)।'
                : 'Allocated community capital into high-yield local ventures such as livestock farming, land lease, and agriculture.'}
            </p>
          </div>

          {isAdmin && (
            <button
              id="btn-add-investment-top"
              onClick={onOpenAddInvestment}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? '+ নতুন বিনিয়োগ প্রকল্প যুক্ত করুন' : '+ Add New Venture'}</span>
            </button>
          )}
        </div>

        {/* Investment Analytics Quick Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10 text-xs relative z-10">
          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10">
            <span className="text-slate-300 block text-2xs uppercase tracking-wider font-medium">{isBn ? 'চলমান মূলধন' : 'Active Capital'}</span>
            <span className="text-base sm:text-lg font-bold text-white mt-0.5 block">{formatBDT(totalActiveCapital, isBn)}</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10">
            <span className="text-slate-300 block text-2xs uppercase tracking-wider font-medium">{isBn ? 'চলমান প্রজেক্ট' : 'Active Ventures'}</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400 mt-0.5 block">
              {isBn ? toBengaliNumerals(activeInvestments.length) : activeInvestments.length} {isBn ? 'টি' : 'projects'}
            </span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10">
            <span className="text-slate-300 block text-2xs uppercase tracking-wider font-medium">{isBn ? 'সমাপ্ত প্রকল্প ফেরত' : 'Recovered Capital'}</span>
            <span className="text-base sm:text-lg font-bold text-blue-400 mt-0.5 block">{formatBDT(totalCompletedReturn, isBn)}</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10">
            <span className="text-slate-300 block text-2xs uppercase tracking-wider font-medium">{isBn ? 'অর্জিত মোট লাভ' : 'Net Fund Profit'}</span>
            <span className="text-base sm:text-lg font-bold text-amber-400 mt-0.5 block">
              {totalNetProfit > 0 ? `+${formatBDT(totalNetProfit, isBn)}` : formatBDT(totalNetProfit, isBn)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-700">{isBn ? 'ক্যাটাগরি ফিল্টার:' : 'Filter Category:'}</span>
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            {isBn ? 'সবগুলো' : 'All'}
          </button>
          <button
            onClick={() => setFilterCategory('livestock')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterCategory === 'livestock'
                ? 'bg-amber-700 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            🐄 {isBn ? 'গরু / পশু' : 'Livestock'}
          </button>
          <button
            onClick={() => setFilterCategory('land')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterCategory === 'land'
                ? 'bg-blue-700 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            🌾 {isBn ? 'জমি লিজ' : 'Land'}
          </button>
          <button
            onClick={() => setFilterCategory('agriculture')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterCategory === 'agriculture'
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            🐟 {isBn ? 'কৃষি ও মৎস্য' : 'Agri/Fish'}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-500 font-medium">{isBn ? 'অবস্থা:' : 'Status:'}</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium text-xs focus:outline-hidden"
          >
            <option value="all">{isBn ? 'সকল স্ট্যাটাস' : 'All Status'}</option>
            <option value="active">{isBn ? 'চলমান (Active)' : 'Active'}</option>
            <option value="completed">{isBn ? 'সমাপ্ত (Completed)' : 'Completed'}</option>
          </select>
        </div>
      </div>

      {/* Ventures Grid Cards */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInvestments.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            <Building className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-600">
              {isBn ? 'কোন বিনিয়োগ প্রকল্প খুঁজে পাওয়া যায়নি' : 'No investment ventures found'}
            </p>
          </div>
        ) : (
          filteredInvestments.map((inv) => {
            const catBadge = getCategoryBadge(inv.category);
            const statusBadge = getStatusBadge(inv.status);

            return (
              <div
                key={inv.id}
                id={`investment-card-${inv.id}`}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Category & Status Badge Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-2xs font-bold border ${catBadge.color}`}>
                      {catBadge.label}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-2xs font-semibold border flex items-center space-x-1 ${statusBadge.color}`}>
                      {statusBadge.icon}
                      <span>{statusBadge.label}</span>
                    </span>
                  </div>

                  {/* Title & Purpose */}
                  <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
                    {inv.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {inv.purpose}
                  </p>

                  {/* Key Financial Details Box */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div>
                      <span className="text-2xs text-slate-400 uppercase font-semibold block">{isBn ? 'বিনিয়োগকৃত মূলধন' : 'Invested Amount'}</span>
                      <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">{formatBDT(inv.amount, isBn)}</span>
                    </div>
                    <div>
                      <span className="text-2xs text-slate-400 uppercase font-semibold block">
                        {inv.status === 'completed' ? (isBn ? 'চূড়ান্ত প্রাপ্তি' : 'Actual Return') : (isBn ? 'প্রত্যাশিত প্রাপ্তি' : 'Target Return')}
                      </span>
                      <span className="text-sm font-extrabold text-emerald-700 mt-0.5 block">
                        {inv.status === 'completed' && inv.returnAmount
                          ? formatBDT(inv.returnAmount, isBn)
                          : inv.expectedReturn
                          ? formatBDT(inv.expectedReturn, isBn)
                          : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Assigned Person & Start Date */}
                  <div className="space-y-1.5 text-xs text-slate-600 mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        <strong className="text-slate-800 font-semibold">{isBn ? 'দায়িত্বপ্রাপ্ত ব্যক্তি:' : 'Responsible Person:'}</strong>{' '}
                        {inv.assignedPerson}
                      </span>
                    </div>
                    {inv.assignedPersonPhone && (
                      <div className="flex items-center space-x-2 text-2xs text-slate-500">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{inv.assignedPersonPhone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        <strong className="text-slate-800 font-semibold">{isBn ? 'শুরুর তারিখ:' : 'Start Date:'}</strong>{' '}
                        {formatCustomDate(inv.startDate, isBn)}
                      </span>
                    </div>
                    {inv.completionDate && (
                      <div className="flex items-center space-x-2 text-emerald-700 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          {isBn ? 'সমাপ্তির তারিখ:' : 'Completed Date:'} {formatCustomDate(inv.completionDate, isBn)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Notes if any */}
                  {inv.notes && (
                    <div className="mt-2 text-2xs text-slate-500 bg-amber-50/70 border border-amber-200/60 rounded-lg p-2">
                      <strong>{isBn ? 'নোট:' : 'Notes:'}</strong> {inv.notes}
                    </div>
                  )}
                </div>

                {/* Admin Actions Footer */}
                {isAdmin && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {inv.status === 'active' ? (
                      <button
                        onClick={() => {
                          setCompletingInvestment(inv);
                          setReturnAmountInput(String(inv.expectedReturn || inv.amount));
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>{isBn ? 'সমাপ্ত ও লাভ বণ্টন করুন' : 'Mark Completed'}</span>
                      </button>
                    ) : (
                      <span className="text-2xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        ✓ {isBn ? 'হিসাব সম্পন্ন' : 'Ledger Settled'}
                      </span>
                    )}

                    <div className="flex items-center space-x-1">
                      {onEditInvestment && (
                        <button
                          onClick={() => onEditInvestment(inv)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title={isBn ? 'এডিট করুন' : 'Edit'}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(inv.id, inv.title)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Mark Investment as Completed */}
      {completingInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {isBn ? 'প্রকল্প সমাপ্ত ও অর্থ জমা রেকর্ড' : 'Complete Investment Venture'}
              </h3>
              <button
                onClick={() => setCompletingInvestment(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800 block text-sm">{completingInvestment.title}</span>
                <span className="text-slate-500 mt-1 block">
                  {isBn ? 'মূল বিনিয়োগ:' : 'Original Capital:'} <strong>{formatBDT(completingInvestment.amount, isBn)}</strong>
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isBn ? 'ফান্ডে ফেরত বা মোট বিক্রয়মূল্য (টাকা):' : 'Total Recovered Amount / Sale Value (৳):'}
                </label>
                <input
                  type="number"
                  value={returnAmountInput}
                  onChange={(e) => setReturnAmountInput(e.target.value)}
                  placeholder="e.g. 125000"
                  className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold"
                />
                <span className="text-2xs text-slate-500 mt-1 block">
                  {isBn ? 'এই টাকাটি ফান্ডের বর্তমান ব্যাংক ব্যালেন্সে সরাসরি যোগ হবে।' : 'This will be automatically credited to fund bank balance.'}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isBn ? 'সমাপ্তির মন্তব্য / লাভের বিবরণ:' : 'Completion Notes / Profit Breakdown:'}
                </label>
                <textarea
                  rows={3}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder={isBn ? 'যেমন: কুরবানীর হাটে বিক্রয় করে নেট লাভ ফান্ডের একাউন্টে জমা...' : 'e.g. Sold successfully at Eid cattle market...'}
                  className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-2">
              <button
                onClick={() => setCompletingInvestment(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleMarkCompleted}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
              >
                {isBn ? 'সমাপ্তি নিশ্চিত করুন' : 'Confirm & Credit Fund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
