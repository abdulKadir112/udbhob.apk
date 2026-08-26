import React, { useState, useMemo } from 'react';
import {
  PlusCircle,
  TrendingUp,
  CreditCard,
  Users,
  Search,
  Trash2,
  Edit2,
  Calendar,
  DollarSign,
  User,
  Shield,
  CheckCircle,
  Clock,
  Sparkles,
  Layers,
  Phone,
  FileText,
  AlertCircle,
  ChevronDown,
  RefreshCw,
  Copy,
  Check,
  Building,
  Key,
  Share2,
  ExternalLink,
  Plus,
  AlertTriangle,
  FolderPlus,
  ShieldCheck,
  Crown,
  ArrowRightLeft,
  UserCheck,
  Send,
  HelpCircle,
  Lock,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFund } from '../context/FundContext';
import { useAuth } from '../context/AuthContext';
import { Member, MonthlyPayment, Investment, PaymentMethod, InvestmentCategory, Fund } from '../types';
import {
  MONTHS,
  formatBDT,
  formatCustomDate,
  toBengaliNumerals,
  getCountryFlag,
  getCountryBn,
  COUNTRIES_LIST,
  playChime,
} from '../utils/formatters';

interface AdminPanelProps {
  language: 'bn' | 'en';
  defaultTab?: 'payment' | 'investment' | 'transactions' | 'members' | 'funds' | 'transfer';
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  language,
  defaultTab = 'payment',
}) => {
  const {
    currentFund,
    allFunds,
    createFund,
    updateFund,
    transferFundAdmin,
    deleteFund,
    switchFund,
    members,
    payments,
    investments,
    addPayment,
    batchAddPayments,
    deletePayment,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    addMember,
    updateMember,
    updateMemberPassword,
    deleteMember,
    selectedYear,
  } = useFund();

  const { isAdmin, userSession } = useAuth();
  const isBn = language === 'bn';

  const [currentAdminTab, setCurrentAdminTab] = useState<'payment' | 'investment' | 'transactions' | 'members' | 'funds' | 'transfer'>(
    defaultTab === 'funds' ? 'funds' : defaultTab
  );

  // === 1. Payment Form State ===
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [paymentMemberSearch, setPaymentMemberSearch] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<string>('1000');
  const [paymentMonth, setPaymentMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [paymentYear, setPaymentYear] = useState<number>(selectedYear || new Date().getFullYear());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bKash');
  const [transactionId, setTransactionId] = useState<string>('');
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [isBatchMonth, setIsBatchMonth] = useState<boolean>(false);
  const [selectedBatchMonths, setSelectedBatchMonths] = useState<number[]>([new Date().getMonth() + 1]);
  const [paymentSubmitting, setPaymentSubmitting] = useState<boolean>(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string>('');

  // === 2. Investment Form State ===
  const [invTitle, setInvTitle] = useState<string>('গরু ১ পিস - কুরবানী মোটাতাজাকরণ');
  const [invPurpose, setInvPurpose] = useState<string>('কুরবানী হাটে বিক্রয়ের জন্য দেশি জাতের ষাঁড় গরু ক্রয় ও লালনপালন');
  const [invCategory, setInvCategory] = useState<InvestmentCategory>('livestock');
  const [invAmount, setInvAmount] = useState<string>('80000');
  const [invAssignedPerson, setInvAssignedPerson] = useState<string>('');
  const [invAssignedPhone, setInvAssignedPhone] = useState<string>('');
  const [invStartDate, setInvStartDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [invExpectedReturn, setInvExpectedReturn] = useState<string>('115000');
  const [invNotes, setInvNotes] = useState<string>('');
  const [invSubmitting, setInvSubmitting] = useState<boolean>(false);
  const [invSuccessMsg, setInvSuccessMsg] = useState<string>('');

  // === 3. Transactions List State ===
  const [txnSearchQuery, setTxnSearchQuery] = useState<string>('');
  const [editingPayment, setEditingPayment] = useState<MonthlyPayment | null>(null);

  // === 4. Member Management Form State ===
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [newMemberNameBn, setNewMemberNameBn] = useState<string>('');
  const [newMemberUsername, setNewMemberUsername] = useState<string>('');
  const [newMemberPassword, setNewMemberPassword] = useState<string>('123456');
  const [newMemberPhone, setNewMemberPhone] = useState<string>('');
  const [newMemberEmail, setNewMemberEmail] = useState<string>('');
  const [newMemberCountry, setNewMemberCountry] = useState<string>('Saudi Arabia');
  const [newMemberCity, setNewMemberCity] = useState<string>('');
  const [newMemberShareAmount, setNewMemberShareAmount] = useState<string>('1000');
  const [newMemberShares, setNewMemberShares] = useState<number>(1);
  const [newMemberNotes, setNewMemberNotes] = useState<string>('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberSubmitting, setMemberSubmitting] = useState<boolean>(false);
  const [memberSuccessMsg, setMemberSuccessMsg] = useState<string>('');
  const [memberErrorMsg, setMemberErrorMsg] = useState<string>('');
  const [copiedMemberId, setCopiedMemberId] = useState<string | null>(null);
  const [quickPassMemberId, setQuickPassMemberId] = useState<string | null>(null);
  const [quickPassValue, setQuickPassValue] = useState<string>('');
  const [quickPassSaving, setQuickPassSaving] = useState<boolean>(false);
  const [directorySearch, setDirectorySearch] = useState<string>('');

  // Computed filtered list of members for Payment Form
  const filteredPaymentMembers = useMemo(() => {
    if (!paymentMemberSearch.trim()) return members;
    const q = paymentMemberSearch.toLowerCase().trim();
    return members.filter((m) =>
      (m.name || '').toLowerCase().includes(q) ||
      (m.nameBn || '').toLowerCase().includes(q) ||
      (m.username || '').toLowerCase().includes(q) ||
      (m.phone || '').includes(q) ||
      (m.country || '').toLowerCase().includes(q)
    );
  }, [members, paymentMemberSearch]);

  // Selected member object for Payment Form
  const selectedPaymentMember = useMemo(() => {
    return members.find((m) => m.id === selectedMemberId) || null;
  }, [members, selectedMemberId]);

  // Computed filtered list of members for Member Credentials Directory Table
  const filteredDirectoryMembers = useMemo(() => {
    if (!directorySearch.trim()) return members;
    const q = directorySearch.toLowerCase().trim();
    return members.filter((m) =>
      (m.name || '').toLowerCase().includes(q) ||
      (m.nameBn || '').toLowerCase().includes(q) ||
      (m.username || '').toLowerCase().includes(q) ||
      (m.phone || '').includes(q) ||
      (m.country || '').toLowerCase().includes(q) ||
      (m.city || '').toLowerCase().includes(q) ||
      (m.role || '').toLowerCase().includes(q)
    );
  }, [members, directorySearch]);

  // === 5. Fund Management State ===
  const [newFundName, setNewFundName] = useState<string>('');
  const [newFundDescription, setNewFundDescription] = useState<string>('');
  const [newFundTargetAmount, setNewFundTargetAmount] = useState<string>('1000');
  const [newFundCurrency, setNewFundCurrency] = useState<string>('BDT');
  const [newFundCountry, setNewFundCountry] = useState<string>('Saudi Arabia');
  const [showCreateFundForm, setShowCreateFundForm] = useState<boolean>(false);
  const [fundSuccessMsg, setFundSuccessMsg] = useState<string>('');

  // Active Fund Edit State
  const [isEditingActiveFund, setIsEditingActiveFund] = useState<boolean>(false);
  const [activeFundNameInput, setActiveFundNameInput] = useState<string>(currentFund.name);
  const [activeFundDescInput, setActiveFundDescInput] = useState<string>(currentFund.description || '');
  const [activeFundAmountInput, setActiveFundAmountInput] = useState<string>(String(currentFund.defaultMonthlyAmount || 1000));

  // Edit specific fund state
  const [editingFund, setEditingFund] = useState<Fund | null>(null);
  const [editingFundName, setEditingFundName] = useState<string>('');
  const [editingFundDesc, setEditingFundDesc] = useState<string>('');
  const [editingFundAmount, setEditingFundAmount] = useState<string>('1000');
  const [editingFundCountry, setEditingFundCountry] = useState<string>('Saudi Arabia');

  // Deletion Modal State
  const [fundToDelete, setFundToDelete] = useState<Fund | null>(null);
  const [isDeletingFund, setIsDeletingFund] = useState<boolean>(false);

  // === 6. Admin Transfer & Handover State ===
  const [transferMode, setTransferMode] = useState<'select_member' | 'new_admin'>('select_member');
  const [transferSelectedMemberId, setTransferSelectedMemberId] = useState<string>('');
  const [transferNewName, setTransferNewName] = useState<string>('');
  const [transferNewEmail, setTransferNewEmail] = useState<string>('');
  const [transferNewPhone, setTransferNewPhone] = useState<string>('');
  const [transferNewCountry, setTransferNewCountry] = useState<string>(currentFund.country || 'Saudi Arabia');
  const [transferNewPassword, setTransferNewPassword] = useState<string>('admin123');
  const [transferNote, setTransferNote] = useState<string>('সদস্যদের যৌথ মিটিংয়ে সর্বসম্মতিক্রমে নতুন এডমিন নির্বাচিত করা হয়েছে');
  const [transferConfirmOpen, setTransferConfirmOpen] = useState<boolean>(false);
  const [transferSubmitting, setTransferSubmitting] = useState<boolean>(false);
  const [transferSecurityAgreed, setTransferSecurityAgreed] = useState<boolean>(false);
  const [transferSuccessMsg, setTransferSuccessMsg] = useState<string>('');
  const [transferErrorMsg, setTransferErrorMsg] = useState<string>('');
  const [copiedTransferCreds, setCopiedTransferCreds] = useState<boolean>(false);
  const [transferCompletedData, setTransferCompletedData] = useState<{
    name: string;
    email: string;
    phone: string;
    country: string;
    password?: string;
  } | null>(null);

  // Auto-generate username when typing member name
  const handleNameChange = (val: string) => {
    setNewMemberName(val);
    if (!editingMember && (!newMemberUsername || newMemberUsername.startsWith('user_'))) {
      const clean = val.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean) {
        setNewMemberUsername(`${clean}_${Math.floor(10 + Math.random() * 90)}`);
      }
    }
  };

  // Update payment amount default when member is selected
  const handleMemberSelect = (memberId: string) => {
    setSelectedMemberId(memberId);
    const m = members.find((x) => x.id === memberId);
    if (m) {
      setPaymentAmount(String(m.monthlyShareAmount || 1000));
    }
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  // Copy Member Login Credentials formatted for WhatsApp/SMS
  const handleCopyCredentials = (member: Member) => {
    const appUrl = window.location.origin;
    const msg = isBn
      ? `🌟 ${currentFund.name} - আপনার সদস্য লগইন তথ্য:\n\n👤 নাম: ${member.nameBn || member.name}\n📱 ইউজারনেম: ${member.username || 'username'}\n🔑 পাসওয়ার্ড: ${member.passwordPlain || '123456'}\n🌐 লগইন লিংক: ${appUrl}\n\nআপনার মাসিক সঞ্চয় ও ফান্ড ব্যালেন্স দেখতে লিংকে গিয়ে ইউজারনেম ও পাসওয়ার্ড দিয়ে লগইন করুন।`
      : `🌟 ${currentFund.name} - Member Login Details:\n\n👤 Name: ${member.name}\n📱 Username: ${member.username || 'username'}\n🔑 Password: ${member.passwordPlain || '123456'}\n🌐 Login Link: ${appUrl}`;

    navigator.clipboard.writeText(msg);
    setCopiedMemberId(member.id);
    setTimeout(() => setCopiedMemberId(null), 3000);
  };

  // Submit Payment Handler
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) {
      alert(isBn ? 'অনুগ্রহ করে সদস্য নির্বাচন করুন।' : 'Please select a member.');
      return;
    }

    const member = members.find((m) => m.id === selectedMemberId);
    if (!member) return;

    setPaymentSubmitting(true);
    try {
      if (isBatchMonth && selectedBatchMonths.length > 1) {
        // Multi-month batch submit
        const amountPerMonth = Number(paymentAmount) / selectedBatchMonths.length;
        const paymentsList = selectedBatchMonths.map((m) => ({
          memberId: member.id,
          memberName: member.nameBn || member.name,
          year: paymentYear,
          month: m,
          amount: amountPerMonth,
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod,
          transactionId: transactionId || undefined,
          notes: paymentNotes || undefined,
        }));
        await batchAddPayments(paymentsList);
      } else {
        // Single month submit
        await addPayment({
          memberId: member.id,
          memberName: member.nameBn || member.name,
          year: paymentYear,
          month: Number(paymentMonth),
          amount: Number(paymentAmount),
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod,
          transactionId: transactionId || undefined,
          notes: paymentNotes || undefined,
        });
      }

      triggerConfetti();
      setPaymentSuccessMsg(isBn ? 'সঞ্চয় সফলভাবে জমা হয়েছে এবং ক্লাউডে আপডেট হয়েছে!' : 'Payment recorded and synced to cloud!');
      setTimeout(() => setPaymentSuccessMsg(''), 4000);

      // Reset form fields
      setTransactionId('');
      setPaymentNotes('');
    } catch (err: any) {
      alert(`Error saving payment: ${err.message || err}`);
    } finally {
      setPaymentSubmitting(false);
    }
  };

  // Submit Investment Handler
  const handleInvestmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invTitle || !invAmount || !invAssignedPerson) {
      alert(isBn ? 'শিরোনাম, পরিমাণ ও দায়িত্বপ্রাপ্ত ব্যক্তির নাম আবশ্যক।' : 'Title, Amount, and Assigned Person are required.');
      return;
    }

    setInvSubmitting(true);
    try {
      await addInvestment({
        title: invTitle,
        purpose: invPurpose,
        category: invCategory,
        amount: Number(invAmount),
        assignedPerson: invAssignedPerson,
        assignedPersonPhone: invAssignedPhone || undefined,
        startDate: invStartDate,
        status: 'active',
        expectedReturn: invExpectedReturn ? Number(invExpectedReturn) : undefined,
        notes: invNotes || undefined,
      });

      triggerConfetti();
      setInvSuccessMsg(isBn ? 'বিনিয়োগ প্রকল্প সফলভাবে অনুমোদন ও লিপিবদ্ধ হয়েছে!' : 'Investment venture successfully authorized & logged!');
      setTimeout(() => setInvSuccessMsg(''), 4000);

      setInvNotes('');
    } catch (err: any) {
      alert(`Error saving investment: ${err.message || err}`);
    } finally {
      setInvSubmitting(false);
    }
  };

  // Submit New Member Handler (with Username & Password)
  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberErrorMsg('');
    setMemberSuccessMsg('');

    const effectiveName = newMemberName.trim() || newMemberNameBn.trim();
    if (!effectiveName) {
      setMemberErrorMsg(isBn ? 'অনুগ্রহ করে সদস্যের নাম (ইংরেজি বা বাংলা) লিখুন।' : 'Please enter member name.');
      return;
    }
    if (!newMemberPhone.trim()) {
      setMemberErrorMsg(isBn ? 'অনুগ্রহ করে মোবাইল নম্বর লিখুন।' : 'Please enter phone number.');
      return;
    }

    const cleanUsername = (newMemberUsername.trim() || `${effectiveName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'}_${Math.floor(100 + Math.random() * 900)}`).toLowerCase();
    const effectivePassword = newMemberPassword.trim() || '123456';

    try {
      setMemberSubmitting(true);

      if (editingMember) {
        await updateMember(editingMember.id, {
          name: newMemberName.trim() || effectiveName,
          nameBn: newMemberNameBn.trim() || effectiveName,
          username: cleanUsername,
          passwordPlain: effectivePassword,
          phone: newMemberPhone.trim(),
          email: newMemberEmail.trim() || undefined,
          country: newMemberCountry || 'Saudi Arabia',
          city: newMemberCity.trim() || undefined,
          monthlyShareAmount: Number(newMemberShareAmount) || currentFund.defaultMonthlyAmount || 1000,
          shares: Number(newMemberShares) || 1,
          notes: newMemberNotes.trim() || undefined,
        });
        setMemberSuccessMsg(
          isBn
            ? `সদস্য "${effectiveName}"-এর তথ্য ও লগইন ক্রেডেনশিয়াল আপডেট সম্পন্ন হয়েছে!`
            : `Member "${effectiveName}" updated successfully!`
        );
        setEditingMember(null);
      } else {
        await addMember({
          name: newMemberName.trim() || effectiveName,
          nameBn: newMemberNameBn.trim() || effectiveName,
          username: cleanUsername,
          passwordPlain: effectivePassword,
          phone: newMemberPhone.trim(),
          email: newMemberEmail.trim() || undefined,
          country: newMemberCountry || 'Saudi Arabia',
          city: newMemberCity.trim() || undefined,
          monthlyShareAmount: Number(newMemberShareAmount) || currentFund.defaultMonthlyAmount || 1000,
          shares: Number(newMemberShares) || 1,
          joinedDate: new Date().toISOString().split('T')[0],
          role: 'member',
          status: 'active',
          notes: newMemberNotes.trim() || undefined,
        });
        triggerConfetti();
        setMemberSuccessMsg(
          isBn
            ? `সদস্য "${effectiveName}" সফলভাবে তৈরি হয়েছেন! ইউজারনেম: ${cleanUsername} | পাসওয়ার্ড: ${effectivePassword}`
            : `Member "${effectiveName}" created! Username: ${cleanUsername} | Pass: ${effectivePassword}`
        );
      }

      // Reset form
      setNewMemberName('');
      setNewMemberNameBn('');
      setNewMemberUsername('');
      setNewMemberPassword('123456');
      setNewMemberPhone('');
      setNewMemberEmail('');
      setNewMemberCity('');
      setNewMemberNotes('');
      setTimeout(() => setMemberSuccessMsg(''), 7000);
    } catch (err: any) {
      console.error('Error saving member:', err);
      setMemberErrorMsg(`সমস্যা: ${err.message || 'সদস্য তৈরি করা যায়নি।'}`);
    } finally {
      setMemberSubmitting(false);
    }
  };

  // Handle Create Fund
  const handleCreateFundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFundName.trim()) {
      alert(isBn ? 'অনুগ্রহ করে ফান্ডের নাম লিখুন।' : 'Please enter Fund Name.');
      return;
    }

    try {
      const fundId = await createFund({
        name: newFundName.trim(),
        nameBn: newFundName.trim(),
        description: newFundDescription.trim() || 'প্রবাসী মুক্ত ফান্ড যৌথ সঞ্চয় ও হালাল বিনিয়োগ প্রকল্প',
        defaultMonthlyAmount: Number(newFundTargetAmount) || 1000,
        currency: newFundCurrency || 'BDT',
        country: newFundCountry || 'Saudi Arabia',
      });

      triggerConfetti();
      setFundSuccessMsg(isBn ? `"${newFundName}" ফান্ড সফলভাবে তৈরি ও সক্রিয় হয়েছে!` : `Fund "${newFundName}" created successfully!`);
      setNewFundName('');
      setNewFundDescription('');
      setShowCreateFundForm(false);
      setTimeout(() => setFundSuccessMsg(''), 5000);
    } catch (err: any) {
      alert(`Error creating fund: ${err.message || err}`);
    }
  };

  // Update Active Fund Details Handler
  const handleUpdateActiveFundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFundNameInput.trim()) {
      alert(isBn ? 'অনুগ্রহ করে ফান্ডের নাম লিখুন।' : 'Please enter Fund Name.');
      return;
    }

    try {
      await updateFund(currentFund.id, {
        name: activeFundNameInput.trim(),
        nameBn: activeFundNameInput.trim(),
        description: activeFundDescInput.trim(),
        defaultMonthlyAmount: Number(activeFundAmountInput) || 1000,
      });

      triggerConfetti();
      setFundSuccessMsg(isBn ? `ফান্ডের নাম ও তথ্য সফলভাবে আপডেট হয়েছে!` : `Fund details updated successfully!`);
      setIsEditingActiveFund(false);
      setTimeout(() => setFundSuccessMsg(''), 5000);
    } catch (err: any) {
      alert(`Error updating fund: ${err.message || err}`);
    }
  };

  // Save specific edited fund handler
  const handleSaveEditedFund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFund) return;
    if (!editingFundName.trim()) {
      alert(isBn ? 'অনুগ্রহ করে ফান্ডের নাম লিখুন।' : 'Please enter Fund Name.');
      return;
    }

    try {
      await updateFund(editingFund.id, {
        name: editingFundName.trim(),
        nameBn: editingFundName.trim(),
        description: editingFundDesc.trim(),
        defaultMonthlyAmount: Number(editingFundAmount) || 1000,
        country: editingFundCountry,
      });

      triggerConfetti();
      setFundSuccessMsg(isBn ? `"${editingFundName}" ফান্ডের তথ্য সফলভাবে আপডেট হয়েছে!` : `Fund "${editingFundName}" updated successfully!`);
      setEditingFund(null);
      setTimeout(() => setFundSuccessMsg(''), 5000);
    } catch (err: any) {
      alert(`Error updating fund: ${err.message || err}`);
    }
  };

  // Delete fund confirmation handler
  const handleDeleteFundConfirm = async () => {
    if (!fundToDelete) return;
    setIsDeletingFund(true);

    try {
      const deletedName = fundToDelete.name;
      await deleteFund(fundToDelete.id);

      setFundSuccessMsg(
        isBn
          ? `ফান্ড "${deletedName}" এবং এর সাথে সম্পর্কিত সকল ডাটা সফলভাবে মুছে ফেলা হয়েছে!`
          : `Fund "${deletedName}" and its associated data were deleted successfully!`
      );
      setFundToDelete(null);
      setTimeout(() => setFundSuccessMsg(''), 6000);
    } catch (err: any) {
      alert(`ফান্ড মুছে ফেলতে সমস্যা হয়েছে: ${err.message || err}`);
    } finally {
      setIsDeletingFund(false);
    }
  };

  // Admin Transfer Handlers
  const handleSelectTransferMember = (memberId: string) => {
    setTransferSelectedMemberId(memberId);
    const m = members.find((x) => x.id === memberId);
    if (m) {
      setTransferNewName(m.nameBn || m.name);
      setTransferNewEmail(m.email || `${m.username || 'admin'}@probashi.fund`);
      setTransferNewPhone(m.phone || '');
      setTransferNewCountry(m.country || 'Saudi Arabia');
      setTransferNewPassword(m.passwordPlain || 'admin123');
    }
  };

  const handleInitiateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferErrorMsg('');

    if (!transferNewName.trim()) {
      setTransferErrorMsg(isBn ? 'অনুগ্রহ করে নতুন এডমিনের নাম প্রদান করুন।' : 'Please enter new admin name.');
      return;
    }
    if (!transferNewPhone.trim()) {
      setTransferErrorMsg(isBn ? 'অনুগ্রহ করে নতুন এডমিনের মোবাইল / হোয়াটসঅ্যাপ নম্বর প্রদান করুন।' : 'Please enter phone number.');
      return;
    }
    if (!transferNewEmail.trim()) {
      setTransferErrorMsg(isBn ? 'অনুগ্রহ করে নতুন এডমিনের ইমেইল অথবা লগইন আইডি প্রদান করুন।' : 'Please enter email / login ID.');
      return;
    }

    setTransferSecurityAgreed(false);
    setTransferConfirmOpen(true);
  };

  const handleConfirmTransferSubmit = async () => {
    if (!transferSecurityAgreed) {
      alert(isBn ? 'অনুগ্রহ করে নিরাপত্তা শর্তাবলীতে টিক চিহ্ন দিন।' : 'Please check the security confirmation box.');
      return;
    }

    setTransferSubmitting(true);
    setTransferErrorMsg('');

    try {
      await transferFundAdmin(currentFund.id, {
        name: transferNewName.trim(),
        email: transferNewEmail.trim(),
        phone: transferNewPhone.trim(),
        password: transferNewPassword.trim(),
        country: transferNewCountry,
        memberId: transferMode === 'select_member' ? transferSelectedMemberId : undefined,
        note: transferNote.trim(),
      });

      triggerConfetti();
      playChime('alert');

      setTransferCompletedData({
        name: transferNewName.trim(),
        email: transferNewEmail.trim(),
        phone: transferNewPhone.trim(),
        country: transferNewCountry,
        password: transferNewPassword.trim(),
      });

      setTransferSuccessMsg(
        isBn
          ? `ফান্ড "${currentFund.name}" এর প্রশাসনিক দায়িত্ব সফলভাবে ${transferNewName}-কে হস্তান্তর করা হয়েছে!`
          : `Fund leadership successfully transferred to ${transferNewName}!`
      );

      setTransferConfirmOpen(false);
    } catch (err: any) {
      setTransferErrorMsg(err.message || 'এডমিন হস্তান্তরে সমস্যা হয়েছে।');
    } finally {
      setTransferSubmitting(false);
    }
  };

  const handleCopyTransferSummary = () => {
    if (!transferCompletedData) return;
    const msg = `📢 *প্রবাসীবান্ধব ফান্ড নোটিশ*\n\n👑 *ফান্ডের নতুন এডমিন ও দায়িত্ব হস্তান্তর সম্পন্ন!*\n🏢 ফান্ড: ${currentFund.name}\n👤 নতুন এডমিন: ${transferCompletedData.name}\n📱 মোবাইল: ${transferCompletedData.phone}\n📧 ইমেইল/আইডি: ${transferCompletedData.email}\n🌍 প্রবাসী দেশ: ${transferCompletedData.country}\n🔑 লগইন পাসওয়ার্ড: ${transferCompletedData.password || 'admin123'}\n\n✅ এখন থেকে ফান্ডের সকল আর্থিক হিসাব ও পরিচালনা নতুন এডমিনের তত্ত্বাবধানে পরিচালিত হবে।`;
    navigator.clipboard.writeText(msg);
    setCopiedTransferCreds(true);
    setTimeout(() => setCopiedTransferCreds(false), 3000);
  };

  const filteredTransactions = payments.filter((p) => {
    const q = txnSearchQuery.toLowerCase();
    return (
      !q ||
      p.memberName.toLowerCase().includes(q) ||
      (p.receiptNumber && p.receiptNumber.toLowerCase().includes(q)) ||
      (p.transactionId && p.transactionId.toLowerCase().includes(q)) ||
      p.paymentMethod.toLowerCase().includes(q)
    );
  });

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Top Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-900 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
            <Shield className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {isBn ? 'এডমিন কন্ট্রোল ও ফান্ড ব্যবস্থাপনা' : 'Admin & Fund Control Center'}
              </h2>
              <span className="text-3xs bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold uppercase">
                {currentFund.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isBn
                ? 'সদস্যদের ইউজারনেম/পাসওয়ার্ড প্রদান, সঞ্চয় সংগ্রহ, বিনিয়োগ ও ফান্ড প্রশাসন।'
                : 'Manage member credentials, monthly dues, ventures, and fund references.'}
            </p>
          </div>
        </div>

        {/* Sub-Nav Pills */}
        <div className="flex items-center space-x-1 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700/80 text-xs overflow-x-auto">
          <button
            id="tab-admin-payment"
            onClick={() => setCurrentAdminTab('payment')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              currentAdminTab === 'payment' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{isBn ? 'সঞ্চয় জমা' : 'Add Payment'}</span>
          </button>
          <button
            id="tab-admin-members"
            onClick={() => setCurrentAdminTab('members')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              currentAdminTab === 'members' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isBn ? 'সদস্য ও লগইন' : 'Members & Auth'}</span>
          </button>
          <button
            id="tab-admin-funds"
            onClick={() => setCurrentAdminTab('funds')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              currentAdminTab === 'funds' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>{isBn ? 'ফান্ড সেটিংস' : 'Fund Settings'}</span>
          </button>
          <button
            id="tab-admin-transfer"
            onClick={() => setCurrentAdminTab('transfer')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              currentAdminTab === 'transfer' ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-xs' : 'text-amber-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>{isBn ? 'এডমিন হস্তান্তর' : 'Transfer Admin'}</span>
          </button>
          <button
            id="tab-admin-investment"
            onClick={() => setCurrentAdminTab('investment')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              currentAdminTab === 'investment' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{isBn ? 'নতুন বিনিয়োগ' : 'Add Venture'}</span>
          </button>
          <button
            id="tab-admin-transactions"
            onClick={() => setCurrentAdminTab('transactions')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              currentAdminTab === 'transactions' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{isBn ? 'লেনদেন লেজার' : 'Transactions'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        
        {/* ========================================================================= */}
        {/* TAB 1: ADD NEW PAYMENT FORM */}
        {/* ========================================================================= */}
        {currentAdminTab === 'payment' && (
          <div className="max-w-3xl mx-auto">
            {paymentSuccessMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center space-x-2 animate-in fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{paymentSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              <div className="bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>{isBn ? 'সদস্যের মাসিক সঞ্চয় জমা ফরম' : 'Record Member Monthly Payment'}</span>
                  </h3>
                  <span className="text-2xs text-slate-500 font-medium">
                    {isBn ? `সক্রিয় ফান্ড: ${currentFund.name}` : `Active Fund: ${currentFund.name}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Member with Realtime Search Filter */}
                  <div className="sm:col-span-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="input-payment-member-search" className="block text-xs font-bold text-slate-700">
                        {isBn ? 'সদস্য নির্বাচন করুন *' : 'Select Member *'}
                      </label>
                      {paymentMemberSearch ? (
                        <span className="text-2xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          {isBn
                            ? `${toBengaliNumerals(filteredPaymentMembers.length)} জন পাওয়া গেছে`
                            : `${filteredPaymentMembers.length} found`}
                        </span>
                      ) : (
                        <span className="text-2xs text-slate-500 font-medium">
                          {isBn ? `মোট: ${toBengaliNumerals(members.length)} জন সদস্য` : `Total: ${members.length} members`}
                        </span>
                      )}
                    </div>

                    {/* Member Quick Search Input */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-payment-member-search"
                        type="text"
                        value={paymentMemberSearch}
                        onChange={(e) => setPaymentMemberSearch(e.target.value)}
                        placeholder={isBn ? "🔍 নাম, ইউজারনেম, ফোন বা দেশ দিয়ে সার্চ করুন..." : "🔍 Search member by name, username, phone, or country..."}
                        className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-800 shadow-2xs"
                      />
                      {paymentMemberSearch && (
                        <button
                          type="button"
                          onClick={() => setPaymentMemberSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100"
                          title={isBn ? 'সার্চ মুছুন' : 'Clear search'}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Member Select Dropdown */}
                    <select
                      id="select-payment-member"
                      value={selectedMemberId}
                      onChange={(e) => handleMemberSelect(e.target.value)}
                      required
                      className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-800 cursor-pointer"
                    >
                      <option value="">
                        {paymentMemberSearch
                          ? (isBn ? `-- ফিল্টারকৃত তালিকা থেকে নির্বাচন করুন (${toBengaliNumerals(filteredPaymentMembers.length)} জন) --` : `-- Select from filtered results (${filteredPaymentMembers.length}) --`)
                          : (isBn ? '-- সদস্য নির্বাচন করুন --' : '-- Choose a Member --')}
                      </option>
                      {filteredPaymentMembers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {getCountryFlag(m.country)} {m.nameBn || m.name} ({m.country}) — {formatBDT(m.monthlyShareAmount, isBn)}/{isBn ? 'মাস' : 'mo'} (@{m.username || 'user'}) - 📞 {m.phone}
                        </option>
                      ))}
                    </select>

                    {/* Selected Member Quick Summary Preview Card */}
                    {selectedPaymentMember && (
                      <div className="flex items-center justify-between p-3 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-xs shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs overflow-hidden">
                            {selectedPaymentMember.avatarUrl ? (
                              <img src={selectedPaymentMember.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (selectedPaymentMember.name || 'M').charAt(0)
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                              <span className="truncate">{selectedPaymentMember.nameBn || selectedPaymentMember.name}</span>
                              <span className="text-2xs font-mono text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md font-bold">
                                @{selectedPaymentMember.username || 'user'}
                              </span>
                              <span className="text-2xs text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-md font-semibold">
                                {getCountryFlag(selectedPaymentMember.country)} {selectedPaymentMember.country}
                              </span>
                            </div>
                            <div className="text-2xs text-slate-600 flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="font-mono">📞 {selectedPaymentMember.phone}</span>
                              <span>•</span>
                              <span className="font-extrabold text-emerald-700">
                                {isBn ? 'মাসিক কিস্তি:' : 'Monthly Share:'} {formatBDT(selectedPaymentMember.monthlyShareAmount, isBn)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMemberId('');
                            setPaymentMemberSearch('');
                          }}
                          className="shrink-0 text-2xs text-slate-600 hover:text-rose-700 px-2.5 py-1 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-all font-bold cursor-pointer"
                        >
                          {isBn ? 'পরিবর্তন' : 'Clear'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Payment Amount */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? 'জমার পরিমাণ (টাকা) *' : 'Amount (BDT) *'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">৳</span>
                      <input
                        id="input-payment-amount"
                        type="number"
                        min="100"
                        step="100"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        required
                        placeholder="1000"
                        className="w-full pl-8 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? 'পরিশোধের মাধ্যম *' : 'Payment Method *'}
                    </label>
                    <select
                      id="select-payment-method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-800"
                    >
                      <option value="bKash">bKash (বিকাশ)</option>
                      <option value="Nagad">Nagad (নগদ)</option>
                      <option value="Rocket">Rocket (রকেট)</option>
                      <option value="Bank Transfer">Bank Transfer (ব্যাংক ট্রান্সফার)</option>
                      <option value="Cash">Cash (নগদ টাকা)</option>
                      <option value="Remittance">Remittance (রেমিট্যান্স)</option>
                    </select>
                  </div>

                  {/* Month & Year */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? 'মাস নির্বাচন *' : 'Month *'}
                    </label>
                    <select
                      id="select-payment-month"
                      value={paymentMonth}
                      onChange={(e) => setPaymentMonth(Number(e.target.value))}
                      className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-800"
                    >
                      {MONTHS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {isBn ? m.nameBn : m.nameEn} ({m.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? 'সাল / বছর *' : 'Year *'}
                    </label>
                    <input
                      type="number"
                      value={paymentYear}
                      onChange={(e) => setPaymentYear(Number(e.target.value))}
                      className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-800"
                    />
                  </div>

                  {/* Transaction ID & Notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? 'ট্রানজেকশন আইডি / রেফারেন্স (ঐচ্ছিক)' : 'Transaction ID (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. TXN-98471203"
                      className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? 'মন্তব্য / নোট (ঐচ্ছিক)' : 'Notes (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      placeholder={isBn ? 'যেমন: সময়মত সঞ্চয় পরিশোধিত' : 'e.g. On-time payment'}
                      className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                    />
                  </div>
                </div>

                {/* Multi-Month Toggle */}
                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="checkbox-batch-pay"
                      type="checkbox"
                      checked={isBatchMonth}
                      onChange={(e) => setIsBatchMonth(e.target.checked)}
                      className="rounded-sm text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="checkbox-batch-pay" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      {isBn ? 'একাধিক মাসের কিস্তি একসাথে জমা দিন (Batch Entry)' : 'Batch multi-month payment'}
                    </label>
                  </div>
                </div>

                {isBatchMonth && (
                  <div className="mt-3 p-3 bg-white rounded-2xl border border-slate-200">
                    <label className="block text-2xs font-bold uppercase text-slate-500 mb-2">
                      {isBn ? 'পরিশোধিত মাসগুলো নির্বাচন করুন:' : 'Select Paid Months:'}
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {MONTHS.map((m) => {
                        const isSelected = selectedBatchMonths.includes(m.id);
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedBatchMonths(selectedBatchMonths.filter((x) => x !== m.id));
                              } else {
                                setSelectedBatchMonths([...selectedBatchMonths, m.id].sort((a, b) => a - b));
                              }
                            }}
                            className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {isBn ? m.shortBn : m.shortEn}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Payment Button */}
              <button
                id="btn-submit-payment"
                type="submit"
                disabled={paymentSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {paymentSubmitting ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                <span>
                  {paymentSubmitting
                    ? (isBn ? 'জমা সংরক্ষণ হচ্ছে...' : 'Saving Payment...')
                    : (isBn ? 'সঞ্চয় জমা সম্পন্ন করুন (Submit Payment)' : 'Confirm & Record Payment')}
                </span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MEMBERS & AUTH CREDENTIALS MANAGEMENT */}
        {/* ========================================================================= */}
        {currentAdminTab === 'members' && (
          <div className="space-y-6">
            {memberSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{memberSuccessMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMemberSuccessMsg('')}
                  className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-1 rounded-lg"
                >
                  ✕
                </button>
              </div>
            )}

            {memberErrorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-sm font-semibold flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{memberErrorMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMemberErrorMsg('')}
                  className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-800 px-3 py-1 rounded-lg"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Add / Edit Member Form with Credentials */}
            <form onSubmit={handleMemberSubmit} className="bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>
                    {editingMember
                      ? (isBn ? 'সদস্যের তথ্য ও লগইন পাসওয়ার্ড পরিবর্তন' : 'Edit Member Profile & Credentials')
                      : (isBn ? 'নতুন প্রবাসী সদস্য নিবন্ধন ও লগইন তৈরি' : 'Register New Member & Assign Login')}
                  </span>
                </h3>
                <span className="text-2xs bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-bold">
                  {isBn ? `ফান্ড: ${currentFund.name}` : `Fund: ${currentFund.name}`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* Name EN */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isBn ? 'নাম (ইংরেজি) *' : 'Name (English) *'}</label>
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Mohammad Rafiq"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Name BN */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isBn ? 'নাম (বাংলা)' : 'Name (Bengali)'}</label>
                  <input
                    type="text"
                    value={newMemberNameBn}
                    onChange={(e) => setNewMemberNameBn(e.target.value)}
                    placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Username for Login */}
                <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-200/80">
                  <label className="block font-bold text-amber-950 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isBn ? 'ইউজারনেম (Login Username)' : 'Username (Login)'}</span>
                  </label>
                  <input
                    type="text"
                    value={newMemberUsername}
                    onChange={(e) => setNewMemberUsername(e.target.value)}
                    placeholder={isBn ? 'খালি রাখলে স্বয়ংক্রিয় তৈরি হবে' : 'e.g. rafiq_dubai'}
                    className="w-full p-2 bg-white border border-amber-300 rounded-lg text-slate-900 font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Password for Login */}
                <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-200/80">
                  <label className="block font-bold text-amber-950 mb-1 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isBn ? 'পাসওয়ার্ড (ডিফল্ট: 123456)' : 'Password (Default: 123456)'}</span>
                  </label>
                  <input
                    type="text"
                    value={newMemberPassword}
                    onChange={(e) => setNewMemberPassword(e.target.value)}
                    placeholder="123456"
                    className="w-full p-2 bg-white border border-amber-300 rounded-lg text-slate-900 font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isBn ? 'মোবাইল / হোয়াটসঅ্যাপ নম্বর *' : 'Phone / WhatsApp *'}</label>
                  <input
                    type="tel"
                    required
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    placeholder="+971 55 987 6543"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isBn ? 'বর্তমান প্রবাসী দেশ *' : 'Diaspora Country *'}</label>
                  <select
                    value={newMemberCountry}
                    onChange={(e) => setNewMemberCountry(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {COUNTRIES_LIST.map((c) => (
                      <option key={c.code} value={c.nameEn}>
                        {c.flag} {c.nameEn} ({c.nameBn})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Monthly Share Amount */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isBn ? 'মাসিক সঞ্চয়ের পরিমাণ (টাকা) *' : 'Monthly Due (BDT) *'}</label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    required
                    value={newMemberShareAmount}
                    onChange={(e) => setNewMemberShareAmount(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Shares count */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isBn ? 'শেয়ার সংখ্যা' : 'Shares Count'}</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newMemberShares}
                    onChange={(e) => setNewMemberShares(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                {editingMember && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMember(null);
                      setNewMemberName('');
                      setNewMemberNameBn('');
                      setNewMemberUsername('');
                      setNewMemberPassword('123456');
                      setNewMemberPhone('');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                )}
                <button
                  id="btn-submit-member"
                  type="submit"
                  disabled={memberSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {memberSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                  <span>
                    {memberSubmitting
                      ? (isBn ? 'তৈরি হচ্ছে...' : 'Saving...')
                      : editingMember
                      ? (isBn ? 'আপডেট সম্পন্ন করুন' : 'Update Member')
                      : (isBn ? '+ সদস্য ও লগইন তৈরি করুন' : '+ Register Member & Auth')}
                  </span>
                </button>
              </div>
            </form>

            {/* Members Directory Table with Usernames & Passwords */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>{isBn ? 'সকল সদস্যের লগইন ক্রেডেনশিয়াল ও তালিকা' : 'Member Credentials & Directory'}</span>
                    <span className="text-2xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                      {isBn ? `${toBengaliNumerals(members.length)} জন` : `${members.length} Total`}
                    </span>
                  </h4>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    {isBn
                      ? 'সদস্যকে হোয়াটসঅ্যাপে লগইন তথ্য পাঠাতে "কপি লগইন বার্তা" বাটনে ক্লিক করুন।'
                      : 'Click "Copy Login Message" to send WhatsApp/SMS credentials to diaspora members.'}
                  </p>
                </div>

                {/* Directory Search & Filter Bar */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={directorySearch}
                      onChange={(e) => setDirectorySearch(e.target.value)}
                      placeholder={isBn ? "🔍 নাম, ইউজারনেম বা ফোন..." : "🔍 Search name, username, phone..."}
                      className="w-full pl-9 pr-8 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-800 shadow-2xs"
                    />
                    {directorySearch && (
                      <button
                        type="button"
                        onClick={() => setDirectorySearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100"
                        title={isBn ? 'মুছে ফেলুন' : 'Clear'}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {directorySearch && (
                    <span className="text-2xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1.5 rounded-xl border border-emerald-200 whitespace-nowrap">
                      {isBn ? `ফলাফল: ${toBengaliNumerals(filteredDirectoryMembers.length)}` : `Found: ${filteredDirectoryMembers.length}`}
                    </span>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-2xs border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-bold">{isBn ? 'সদস্যের নাম ও দেশ' : 'Member'}</th>
                      <th className="py-3 px-4 font-bold">{isBn ? 'ইউজারনেম (Login ID)' : 'Username'}</th>
                      <th className="py-3 px-4 font-bold">{isBn ? 'পাসওয়ার্ড' : 'Password'}</th>
                      <th className="py-3 px-4 font-bold">{isBn ? 'ফোন নম্বর' : 'Phone'}</th>
                      <th className="py-3 px-4 font-bold">{isBn ? 'মাসিক সঞ্চয়' : 'Monthly Due'}</th>
                      <th className="py-3 px-4 text-right font-bold">{isBn ? 'অ্যাকশন ও শেয়ার' : 'Actions & Share'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredDirectoryMembers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 px-4 text-center">
                          <User className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          <p className="font-bold text-slate-800 text-sm">
                            {isBn ? 'কোন সদস্য পাওয়া যায়নি' : 'No members found'}
                          </p>
                          <p className="text-2xs text-slate-500 mt-1">
                            {isBn
                              ? `"${directorySearch}" অনুসন্ধানের সাথে কোনো সদস্য মেলেনি।`
                              : `No member matched "${directorySearch}".`}
                          </p>
                          <button
                            type="button"
                            onClick={() => setDirectorySearch('')}
                            className="mt-3 px-3.5 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>{isBn ? 'সকল সদস্য দেখুন' : 'View all members'}</span>
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredDirectoryMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 text-sm">
                            {m.nameBn || m.name}
                          </div>
                          <div className="text-slate-500 text-2xs flex items-center gap-1">
                            <span>{getCountryFlag(m.country)}</span>
                            <span>{m.country}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                          @{m.username || 'not_set'}
                        </td>
                        <td className="py-3 px-4">
                          {quickPassMemberId === m.id ? (
                            <div className="flex items-center gap-1 min-w-[170px]">
                              <input
                                type="text"
                                value={quickPassValue}
                                onChange={(e) => setQuickPassValue(e.target.value)}
                                placeholder="New Pass"
                                className="w-24 px-2 py-1 bg-white border border-emerald-500 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none"
                                autoFocus
                              />
                              <button
                                type="button"
                                disabled={quickPassSaving || !quickPassValue.trim()}
                                onClick={async () => {
                                  if (!quickPassValue.trim()) return;
                                  setQuickPassSaving(true);
                                  try {
                                    await updateMemberPassword(m.id, quickPassValue.trim());
                                    setQuickPassMemberId(null);
                                    setQuickPassValue('');
                                  } catch (err: any) {
                                    alert(err.message || 'পাসওয়ার্ড পরিবর্তনে ব্যর্থ হয়েছে।');
                                  } finally {
                                    setQuickPassSaving(false);
                                  }
                                }}
                                className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                                title={isBn ? 'সংরক্ষণ' : 'Save'}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setQuickPassMemberId(null)}
                                className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg cursor-pointer"
                                title={isBn ? 'বাতিল' : 'Cancel'}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 group">
                              <span
                                onClick={() => {
                                  setQuickPassMemberId(m.id);
                                  setQuickPassValue(m.passwordPlain || '123456');
                                }}
                                className="font-mono bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900 text-slate-800 px-2 py-0.5 rounded-lg font-bold text-2xs border border-slate-200 cursor-pointer transition-colors"
                                title={isBn ? 'ক্লিক করে পাসওয়ার্ড পরিবর্তন করুন' : 'Click to change password'}
                              >
                                {m.passwordPlain || '123456'}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setQuickPassMemberId(m.id);
                                  setQuickPassValue(m.passwordPlain || '123456');
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-emerald-700 rounded transition-opacity cursor-pointer"
                                title={isBn ? 'পাসওয়ার্ড পরিবর্তন' : 'Edit password'}
                              >
                                <Key className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-2xs">{m.phone}</td>
                        <td className="py-3 px-4 font-extrabold text-emerald-700">{formatBDT(m.monthlyShareAmount, isBn)}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* Copy WhatsApp login message button */}
                            <button
                              onClick={() => handleCopyCredentials(m)}
                              className={`px-2.5 py-1 rounded-xl text-2xs font-bold transition-all flex items-center gap-1 shadow-2xs ${
                                copiedMemberId === m.id
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                              title={isBn ? 'হোয়াটসঅ্যাপে পাঠানোর জন্য লগইন মেসেজ কপি করুন' : 'Copy WhatsApp Login Details'}
                            >
                              {copiedMemberId === m.id ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>{isBn ? 'কপি হয়েছে!' : 'Copied!'}</span>
                                </>
                              ) : (
                                <>
                                  <Share2 className="w-3 h-3 text-emerald-600" />
                                  <span>{isBn ? 'লগইন বার্তা কপি' : 'Copy Info'}</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => {
                                setEditingMember(m);
                                setNewMemberName(m.name);
                                setNewMemberNameBn(m.nameBn || '');
                                setNewMemberUsername(m.username || '');
                                setNewMemberPassword(m.passwordPlain || '123456');
                                setNewMemberPhone(m.phone);
                                setNewMemberCountry(m.country);
                                setNewMemberShareAmount(String(m.monthlyShareAmount));
                                setNewMemberShares(m.shares || 1);
                              }}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                              title={isBn ? 'এডিট করুন' : 'Edit'}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(isBn ? `সদস্য "${m.name}" মুছে ফেলতে চান?` : `Delete member "${m.name}"?`)) {
                                  deleteMember(m.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                              title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FUND MANAGEMENT & CREATION */}
        {/* ========================================================================= */}
        {currentAdminTab === 'funds' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {fundSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center space-x-2 animate-in fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{fundSuccessMsg}</span>
              </div>
            )}

            {/* Active Fund Overview Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                  {currentFund.logoUrl ? (
                    <img src={currentFund.logoUrl} alt={currentFund.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building className="w-7 h-7 text-emerald-400" />
                  )}
                </div>
                <div>
                  <span className="text-3xs bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    {isBn ? 'বর্তমান সক্রিয় ফান্ড' : 'Active Community Fund'}
                  </span>
                  <h3 className="text-2xl font-black mt-2 tracking-tight text-white">{currentFund.name}</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl line-clamp-2">{currentFund.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-300">
                    <span>
                      {isBn ? 'দেশ:' : 'Country:'}{' '}
                      <strong className="text-white">{currentFund.country || 'Saudi Arabia'}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      {isBn ? 'ডিফল্ট কিস্তি:' : 'Monthly Target:'}{' '}
                      <strong className="font-mono text-emerald-300">{formatBDT(currentFund.defaultMonthlyAmount || 1000, isBn)}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCreateFundForm(!showCreateFundForm)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isBn ? 'নতুন ফান্ড যোগ করুন' : 'Create New Fund'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveFundNameInput(currentFund.name);
                    setActiveFundDescInput(currentFund.description || '');
                    setActiveFundAmountInput(String(currentFund.defaultMonthlyAmount || 1000));
                    setIsEditingActiveFund(!isEditingActiveFund);
                  }}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isEditingActiveFund ? (isBn ? 'বাতিল করুন' : 'Cancel') : (isBn ? 'তথ্য পরিবর্তন' : 'Edit Fund')}</span>
                </button>
              </div>
            </div>

            {/* Edit Active Fund Inline Form */}
            {isEditingActiveFund && (
              <form onSubmit={handleUpdateActiveFundSubmit} className="bg-emerald-50/80 rounded-3xl p-5 sm:p-6 border border-emerald-300 space-y-4 animate-in fade-in shadow-md">
                <h3 className="text-base font-bold text-emerald-950 flex items-center space-x-2">
                  <Edit2 className="w-5 h-5 text-emerald-700" />
                  <span>{isBn ? 'সক্রিয় ফান্ডের নাম ও তথ্য আপডেট করুন' : 'Update Active Fund Name & Info'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'ফান্ডের নাম (Fund Name) *' : 'Fund Name *'}
                    </label>
                    <input
                      id="input-admin-edit-fund-name"
                      type="text"
                      required
                      value={activeFundNameInput}
                      onChange={(e) => setActiveFundNameInput(e.target.value)}
                      placeholder={isBn ? 'যেমন: আলোকিত প্রবাসী মুক্ত ফান্ড' : 'e.g. Probashi Mukto Fund'}
                      className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'ডিফল্ট মাসিক সঞ্চয় (টাকা)' : 'Default Monthly Due (BDT)'}
                    </label>
                    <input
                      type="number"
                      value={activeFundAmountInput}
                      onChange={(e) => setActiveFundAmountInput(e.target.value)}
                      placeholder="1000"
                      className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-slate-900 font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'ফান্ডের উদ্দেশ্য ও বিবরণ' : 'Description & Objective'}
                    </label>
                    <textarea
                      rows={2}
                      value={activeFundDescInput}
                      onChange={(e) => setActiveFundDescInput(e.target.value)}
                      className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingActiveFund(false)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isBn ? 'সংরক্ষণ করুন' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Create New Fund Form (Collapsible) */}
            {showCreateFundForm && (
              <form onSubmit={handleCreateFundSubmit} className="bg-white rounded-3xl p-6 border-2 border-emerald-400 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <FolderPlus className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-black text-slate-900">
                      {isBn ? 'নতুন ফান্ড তৈরি করুন' : 'Create a New Community Fund'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCreateFundForm(false)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1"
                  >
                    {isBn ? 'বন্ধ করুন' : 'Close'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'ফান্ডের নাম (Fund Name) *' : 'Fund Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newFundName}
                      onChange={(e) => setNewFundName(e.target.value)}
                      placeholder={isBn ? 'যেমন: রিয়াদ প্রবাসী মুক্ত ফান্ড - ২' : 'e.g. Riyadh Probashi Fund 2'}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'ডিফল্ট মাসিক কিস্তির পরিমাণ (টাকা)' : 'Default Monthly Due (BDT)'}
                    </label>
                    <input
                      type="number"
                      value={newFundTargetAmount}
                      onChange={(e) => setNewFundTargetAmount(e.target.value)}
                      placeholder="1000"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'মুদ্রা (Currency)' : 'Currency'}
                    </label>
                    <select
                      value={newFundCurrency}
                      onChange={(e) => setNewFundCurrency(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    >
                      <option value="BDT">BDT (৳ টাকা)</option>
                      <option value="SAR">SAR (সৌদি রিয়াল)</option>
                      <option value="AED">AED (ইউএই দিরহাম)</option>
                      <option value="QAR">QAR (কাতার রিয়াল)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'অবস্থান / দেশ (Country)' : 'Country of Operation'}
                    </label>
                    <select
                      value={newFundCountry}
                      onChange={(e) => setNewFundCountry(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    >
                      {COUNTRIES_LIST.map((c) => (
                        <option key={c.code} value={c.nameEn}>
                          {c.flag} {c.nameEn} ({c.nameBn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'ফান্ডের বিবরণ ও উদ্দেশ্য' : 'Description & Mission'}
                    </label>
                    <textarea
                      rows={2}
                      value={newFundDescription}
                      onChange={(e) => setNewFundDescription(e.target.value)}
                      placeholder={isBn ? 'প্রবাসী বন্ধুদের যৌথ সঞ্চয় ও লাভজনক হালাল বিনিয়োগ...' : 'Community collective savings and halal investments...'}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateFundForm(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isBn ? 'ফান্ড তৈরি করুন ও সক্রিয় করুন' : 'Create & Activate Fund'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Managed Funds List (Switch, Edit, Delete) */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <h4 className="font-black text-slate-900 text-base">
                    {isBn ? 'আপনার সকল ফান্ডের তালিকা ও পরিচালনা' : 'All Community Funds Management'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn
                      ? 'এখান থেকে যেকোনো ফান্ডে সুইচ করতে পারেন, তথ্য সংশোধন করতে পারেন কিংবা অপ্রয়োজনীয় ফান্ড মুছে ফেলতে পারেন।'
                      : 'Switch between active funds, update settings, or delete funds.'}
                  </p>
                </div>
                <span className="text-xs bg-slate-200 text-slate-700 font-bold px-3 py-1 rounded-full self-start sm:self-auto">
                  {allFunds.length} {isBn ? 'টি ফান্ড বিদ্যমান' : 'Funds Total'}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {allFunds.map((fund) => {
                  const isActive = currentFund.id === fund.id;
                  const isEditingThis = editingFund?.id === fund.id;

                  return (
                    <div key={fund.id} className={`p-5 transition-colors ${isActive ? 'bg-emerald-50/40' : 'hover:bg-slate-50/80'}`}>
                      {isEditingThis ? (
                        /* Inline Edit Form for this specific fund */
                        <form onSubmit={handleSaveEditedFund} className="space-y-3 bg-white p-4 rounded-2xl border-2 border-emerald-400">
                          <h5 className="font-bold text-xs text-emerald-900 flex items-center gap-1">
                            <Edit2 className="w-4 h-4 text-emerald-600" />
                            <span>{isBn ? `ফান্ড সম্পাদনা: ${fund.name}` : `Editing: ${fund.name}`}</span>
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block font-bold text-slate-600 mb-1">{isBn ? 'নাম *' : 'Name *'}</label>
                              <input
                                type="text"
                                required
                                value={editingFundName}
                                onChange={(e) => setEditingFundName(e.target.value)}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-600 mb-1">{isBn ? 'ডিফল্ট সঞ্চয়' : 'Target Due'}</label>
                              <input
                                type="number"
                                value={editingFundAmount}
                                onChange={(e) => setEditingFundAmount(e.target.value)}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block font-bold text-slate-600 mb-1">{isBn ? 'দেশ (Country)' : 'Country'}</label>
                              <select
                                value={editingFundCountry}
                                onChange={(e) => setEditingFundCountry(e.target.value)}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                              >
                                {COUNTRIES_LIST.map((c) => (
                                  <option key={c.code} value={c.nameEn}>
                                    {c.flag} {c.nameEn} ({c.nameBn})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block font-bold text-slate-600 mb-1">{isBn ? 'বিবরণ' : 'Description'}</label>
                              <input
                                type="text"
                                value={editingFundDesc}
                                onChange={(e) => setEditingFundDesc(e.target.value)}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingFund(null)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg"
                            >
                              {isBn ? 'বাতিল' : 'Cancel'}
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{isBn ? 'সংরক্ষণ' : 'Save'}</span>
                            </button>
                          </div>
                        </form>
                      ) : (
                        /* Normal Fund Row */
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border overflow-hidden ${
                              isActive ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-600'
                            }`}>
                              {fund.logoUrl ? (
                                <img src={fund.logoUrl} alt={fund.name} className="w-full h-full object-cover" />
                              ) : (
                                <Building className="w-6 h-6" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="font-black text-slate-900 text-sm sm:text-base">{fund.name}</h5>
                                {isActive ? (
                                  <span className="text-3xs bg-emerald-600 text-white font-black px-2.5 py-0.5 rounded-full shadow-xs">
                                    {isBn ? '✓ সক্রিয়' : '✓ Active'}
                                  </span>
                                ) : (
                                  <span className="text-3xs bg-slate-100 text-slate-600 border border-slate-200 font-bold px-2 py-0.5 rounded-full">
                                    {fund.currency || 'BDT'}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-lg">
                                {fund.description || (isBn ? 'প্রবাসী মুক্ত ফান্ড প্রকল্প' : 'Probashi community fund')}
                              </p>
                              <div className="flex items-center gap-3 mt-1.5 text-2xs text-slate-400">
                                <span>{isBn ? 'দেশ:' : 'Country:'} <strong className="text-slate-600">{fund.country || 'Saudi Arabia'}</strong></span>
                                <span>•</span>
                                <span>{isBn ? 'মাসিক সঞ্চয়:' : 'Due:'} <strong className="text-slate-700 font-mono">{formatBDT(fund.defaultMonthlyAmount || 1000, isBn)}</strong></span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                            {!isActive ? (
                              <button
                                type="button"
                                onClick={() => switchFund(fund.id)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <span>{isBn ? 'সক্রিয় করুন' : 'Activate'}</span>
                              </button>
                            ) : (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-200">
                                {isBn ? 'চলমান ফান্ড' : 'In Use'}
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setEditingFund(fund);
                                setEditingFundName(fund.name);
                                setEditingFundDesc(fund.description || '');
                                setEditingFundAmount(String(fund.defaultMonthlyAmount || 1000));
                                setEditingFundCountry(fund.country || 'Saudi Arabia');
                              }}
                              className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                              title={isBn ? 'সম্পাদনা করুন' : 'Edit Fund'}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setFundToDelete(fund)}
                              className="p-2 text-rose-500 hover:text-white hover:bg-rose-600 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                              title={isBn ? 'ফান্ড ডিলেট করুন' : 'Delete Fund'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 1 Admin Multi-Fund System Policy Notice */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold shrink-0">
                  🛡️
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {isBn ? 'ফান্ড নিয়ন্ত্রণ ও ডাটা নিরাপত্তা নির্দেশিকা' : 'Fund Governance & Data Safety'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn
                      ? 'এডমিন হিসেবে আপনি একাধিক ফান্ড তৈরি, পরিচালনা কিংবা প্রয়োজনমতো সম্পূর্ণ মুছে ফেলতে পারেন। প্রতিটি ফান্ডের সদস্য ও সঞ্চয়ের ডাটা সম্পূর্ণ স্বতন্ত্র থাকে।'
                      : 'As an administrator, you can manage multiple funds, create new funds, switch active fund context, or permanently delete unnecessary funds.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                  <div className="text-2xs font-semibold text-slate-500">{isBn ? 'সক্রিয় ফান্ডের সদস্য' : 'Active Fund Members'}</div>
                  <div className="text-lg font-black text-slate-900 mt-1">{members.length} {isBn ? 'জন' : 'members'}</div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                  <div className="text-2xs font-semibold text-slate-500">{isBn ? 'নিবন্ধিত সঞ্চয় রেকর্ড' : 'Payment Records'}</div>
                  <div className="text-lg font-black text-slate-900 mt-1">{payments.length} {isBn ? 'টি' : 'entries'}</div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                  <div className="text-2xs font-semibold text-slate-500">{isBn ? 'চালু বিনিয়োগ প্রকল্প' : 'Active Investments'}</div>
                  <div className="text-lg font-black text-slate-900 mt-1">{investments.length} {isBn ? 'টি' : 'projects'}</div>
                </div>
              </div>
            </div>

            {/* ================================================================= */}
            {/* DELETE FUND CONFIRMATION MODAL */}
            {/* ================================================================= */}
            {fundToDelete && (
              <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4 animate-in zoom-in-95">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-black text-slate-900">
                      {isBn ? 'আপনি কি ফান্ডটি মুছে ফেলতে নিশ্চিত?' : 'Are you sure you want to delete this fund?'}
                    </h3>
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                      <p className="font-black text-rose-900 text-sm">{fundToDelete.name}</p>
                      <p className="text-2xs text-rose-700 mt-1">
                        {isBn
                          ? 'সতর্কতা: এই ফান্ডটি মুছে ফেললে এর অধীনস্থ সকল সদস্য, মাসিক সঞ্চয়ের হিসাব, বিনিয়োগ প্রকল্প ও মেসেজ স্থায়ীভাবে মুছে যাবে!'
                          : 'Warning: Deleting this fund will permanently remove all linked members, payment records, investments, and chats!'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isDeletingFund}
                      onClick={() => setFundToDelete(null)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      {isBn ? 'না, বাতিল করুন' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      disabled={isDeletingFund}
                      onClick={handleDeleteFundConfirm}
                      className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isDeletingFund ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span>{isBn ? 'হ্যাঁ, সম্পূর্ণ মুছুন' : 'Yes, Delete Permanently'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: ADMIN TRANSFER & HANDOVER (দায়িত্ব হস্তান্তর) */}
        {/* ========================================================================= */}
        {currentAdminTab === 'transfer' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header / Intro */}
            <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-2xl bg-white/20 backdrop-blur-md text-amber-200">
                      <Crown className="w-6 h-6" />
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                      {isBn ? 'ফান্ডের এডমিন পরিবর্তন ও দায়িত্ব হস্তান্তর' : 'Fund Admin Transfer & Leadership Handover'}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl leading-relaxed">
                    {isBn
                      ? 'সদস্যদের সর্বসম্মত সিদ্ধান্তে ফান্ডের বর্তমান এডমিন পরিবর্তন করে নতুন ব্যক্তির কাছে দায়িত্ব হস্তান্তর করতে নিচের ফরমটি পূরণ করুন।'
                      : 'Transfer fund administrative control and ownership to a new person or selected existing member.'}
                  </p>
                </div>

                <div className="bg-black/25 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl self-start md:self-auto shrink-0">
                  <div className="text-3xs uppercase font-bold text-amber-200 tracking-wider">
                    {isBn ? 'দায়িত্বাধীন ফান্ড' : 'Active Fund'}
                  </div>
                  <div className="text-sm font-black text-white">{currentFund.name}</div>
                  <div className="text-2xs text-amber-100 flex items-center gap-1 mt-0.5">
                    <span>{getCountryFlag(currentFund.country)}</span>
                    <span>{currentFund.country || 'Saudi Arabia'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Message Banner with WhatsApp Copy */}
            {transferSuccessMsg && (
              <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 space-y-3 shadow-md animate-in fade-in">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-emerald-900">{isBn ? 'এডমিন হস্তান্তর সফল হয়েছে!' : 'Admin Handover Successful!'}</h4>
                      <p className="text-xs text-emerald-800 font-medium">{transferSuccessMsg}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTransferSuccessMsg('')}
                    className="text-xs bg-emerald-200 hover:bg-emerald-300 text-emerald-900 px-3 py-1.5 rounded-xl font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {transferCompletedData && (
                  <div className="bg-white p-4 rounded-2xl border border-emerald-200 space-y-3">
                    <div className="text-xs text-slate-700 font-bold">
                      {isBn ? '📱 সদস্যদের হোয়াটসঅ্যাপ গ্রুপে নোটিশ পাঠাতে নিচে ক্লিক করে বার্তা কপি করুন:' : 'Share update to WhatsApp group:'}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyTransferSummary}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        {copiedTransferCreds ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedTransferCreds ? (isBn ? 'হোয়াটসঅ্যাপ মেসেজ কপি হয়েছে!' : 'Message Copied!') : (isBn ? 'হোয়াটসঅ্যাপ নোটিশ কপি করুন' : 'Copy WhatsApp Notice')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {transferErrorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{transferErrorMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTransferErrorMsg('')}
                  className="text-xs bg-rose-200 hover:bg-rose-300 text-rose-900 px-2 py-1 rounded-lg font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Current vs New Admin Comparison Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Admin Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xs uppercase font-black tracking-wider bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">
                    {isBn ? 'বর্তমান দায়িত্বপ্রাপ্ত এডমিন' : 'Current Active Admin'}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                    {currentFund.adminName ? currentFund.adminName.slice(0, 2).toUpperCase() : 'AD'}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm sm:text-base">
                      {currentFund.adminName || (isBn ? 'ফান্ড এডমিনিস্ট্রেটর' : 'Fund Administrator')}
                    </h4>
                    <p className="text-2xs text-slate-500 font-mono">{currentFund.adminEmail || 'admin@probashi.fund'}</p>
                    <p className="text-2xs text-slate-600 font-semibold mt-0.5">{currentFund.adminPhone || (isBn ? 'ফোন নম্বর যুক্ত নেই' : 'No phone linked')}</p>
                  </div>
                </div>
                {currentFund.lastAdminTransferAt && (
                  <div className="text-3xs text-slate-400 bg-white p-2 rounded-xl border border-slate-100">
                    {isBn ? 'সর্বশেষ দায়িত্ব বদল:' : 'Last Handover:'} {formatCustomDate(currentFund.lastAdminTransferAt, isBn)}
                    {currentFund.previousAdminName && ` (${currentFund.previousAdminName} থেকে)`}
                  </div>
                )}
              </div>

              {/* New Admin Preview Card */}
              <div className="bg-gradient-to-br from-amber-500/10 to-rose-500/10 border-2 border-dashed border-amber-300 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xs uppercase font-black tracking-wider bg-amber-500 text-white px-2.5 py-1 rounded-full shadow-xs">
                    {isBn ? '👑 নতুন এডমিন প্রিভিউ' : '👑 New Admin Preview'}
                  </span>
                  <Crown className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center font-black text-lg shadow-md">
                    {transferNewName ? transferNewName.slice(0, 2).toUpperCase() : 'NEW'}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm sm:text-base">
                      {transferNewName || (isBn ? 'নতুন এডমিনের নাম' : 'New Admin Name')}
                    </h4>
                    <p className="text-2xs text-slate-600 font-mono">{transferNewEmail || 'new_admin@probashi.fund'}</p>
                    <p className="text-2xs text-slate-700 font-semibold mt-0.5 flex items-center gap-1.5">
                      <span>{getCountryFlag(transferNewCountry)}</span>
                      <span>{transferNewPhone || '+880 / +966...'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleInitiateTransfer} className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
              {/* Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  {isBn ? '১. নতুন এডমিন নির্বাচনের মাধ্যম বেছে নিন:' : '1. Choose Selection Mode:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTransferMode('select_member');
                      if (members.length > 0 && !transferSelectedMemberId) {
                        handleSelectTransferMember(members[0].id);
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center space-x-3 ${
                      transferMode === 'select_member'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-950 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      transferMode === 'select_member' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black">{isBn ? 'ফান্ডের বর্তমান সদস্য থেকে নির্বাচন' : 'Select from Existing Members'}</div>
                      <div className="text-2xs text-slate-500 mt-0.5">{isBn ? 'সদস্য তালিকা থেকে যে কাউকে এডমিন বানান' : 'Promote an existing registered member'}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTransferMode('new_admin');
                      setTransferSelectedMemberId('');
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center space-x-3 ${
                      transferMode === 'new_admin'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-950 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      transferMode === 'new_admin' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black">{isBn ? 'সম্পূর্ণ নতুন ব্যক্তির তথ্য লিখুন' : 'Enter New Admin Manually'}</div>
                      <div className="text-2xs text-slate-500 mt-0.5">{isBn ? 'নতুন এডমিনের নাম, মোবাইল ও ইমেইল টাইপ করুন' : 'Provide fresh details for outside person'}</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* If member mode, Member Picker */}
              {transferMode === 'select_member' && (
                <div className="bg-amber-50/60 p-4 sm:p-5 rounded-2xl border border-amber-200 space-y-2">
                  <label className="block text-xs font-bold text-amber-950">
                    {isBn ? 'সদস্য নির্বাচন করুন (সদস্যের নাম ও তথ্য স্বয়ংক্রিয় পূরণ হবে):' : 'Select Member to Promote:'}
                  </label>
                  <select
                    value={transferSelectedMemberId}
                    onChange={(e) => handleSelectTransferMember(e.target.value)}
                    className="w-full p-3 bg-white border border-amber-300 rounded-xl text-slate-900 font-bold text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="">{isBn ? '-- সদস্য নির্বাচন করুন --' : '-- Choose a Member --'}</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {getCountryFlag(m.country)} {m.nameBn || m.name} ({m.phone}) {m.country ? `[${m.country}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Detailed Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Name */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {isBn ? 'নতুন এডমিনের পূর্ণ নাম *' : 'New Admin Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={transferNewName}
                    onChange={(e) => setTransferNewName(e.target.value)}
                    placeholder={isBn ? 'যেমন: মোহাম্মদ শফিকুল ইসলাম' : 'e.g. Shafiqul Islam'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {isBn ? 'মোবাইল / হোয়াটসঅ্যাপ নম্বর *' : 'Phone / WhatsApp *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={transferNewPhone}
                    onChange={(e) => setTransferNewPhone(e.target.value)}
                    placeholder={isBn ? '+৯৬৬ ৫০ ১২৩ ৪৫৬৭' : '+966 50 123 4567'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Email / Login ID */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {isBn ? 'ইমেইল / লগইন আইডি *' : 'Email / Login ID *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={transferNewEmail}
                    onChange={(e) => setTransferNewEmail(e.target.value)}
                    placeholder="shafiq@probashi.fund"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {isBn ? 'প্রবাসী দেশ (Country) *' : 'Diaspora Country *'}
                  </label>
                  <select
                    value={transferNewCountry}
                    onChange={(e) => setTransferNewCountry(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                  >
                    {COUNTRIES_LIST.map((c) => (
                      <option key={c.code} value={c.nameEn}>
                        {c.flag} {c.nameEn} ({c.nameBn})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {isBn ? 'নতুন এডমিনের লগইন পাসওয়ার্ড *' : 'Admin Login Password *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={transferNewPassword}
                      onChange={(e) => setTransferNewPassword(e.target.value)}
                      placeholder="admin123"
                      className="w-full p-2.5 pl-8 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <Key className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Handover Note / Reason */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {isBn ? 'দায়িত্ব হস্তান্তরের কারণ / রেজুলেশন' : 'Handover Note / Resolution'}
                  </label>
                  <input
                    type="text"
                    value={transferNote}
                    onChange={(e) => setTransferNote(e.target.value)}
                    placeholder={isBn ? 'যেমন: বার্ষিক সাধারণ সভার সিদ্ধান্ত মোতাবেক' : 'e.g. As decided in annual member meeting'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Trigger */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <div className="text-2xs text-slate-500 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    {isBn
                      ? 'দায়িত্ব হস্তান্তরের পর ফান্ডের সমস্ত নিয়ন্ত্রণ নতুন এডমিনের নামে নিবন্ধিত হবে।'
                      : 'All administrative privileges will be safely handed over to the new admin.'}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700 hover:from-amber-700 hover:to-indigo-800 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-600/30 flex items-center justify-center space-x-2 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>{isBn ? 'দায়িত্ব হস্তান্তর প্রক্রিয়া শুরু করুন' : 'Initiate Admin Handover'}</span>
                </button>
              </div>
            </form>

            {/* ================================================================= */}
            {/* FINAL CONFIRMATION MODAL */}
            {/* ================================================================= */}
            {transferConfirmOpen && (
              <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-amber-400 space-y-5 animate-in zoom-in-95">
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Crown className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        {isBn ? '⚠️ এডমিন দায়িত্ব হস্তান্তরের চূড়ান্ত নিশ্চিতকরণ' : 'Confirm Administrative Handover'}
                      </h3>
                      <p className="text-2xs text-slate-500 mt-0.5">
                        {isBn ? `ফান্ড: ${currentFund.name}` : `Fund: ${currentFund.name}`}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <p className="text-slate-700 leading-relaxed">
                      {isBn
                        ? `আপনি কি নিশ্চিত যে এই ফান্ডের আর্থিক হিসাব, সদস্য ডাটাবেস ও সকল প্রশাসনিক নিয়ন্ত্রণ নিচের ব্যক্তির কাছে হস্তান্তর করতে চান?`
                        : `Are you sure you want to transfer full control and administration of this fund to:`}
                    </p>

                    <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500">{isBn ? 'নতুন এডমিন:' : 'New Admin:'}</span>
                        <span className="font-black text-amber-950 text-sm">{transferNewName}</span>
                      </div>
                      <div className="flex justify-between items-center text-2xs">
                        <span className="text-slate-500">{isBn ? 'মোবাইল / হোয়াটসঅ্যাপ:' : 'Phone:'}</span>
                        <span className="font-bold text-slate-800">{transferNewPhone}</span>
                      </div>
                      <div className="flex justify-between items-center text-2xs">
                        <span className="text-slate-500">{isBn ? 'ইমেইল / আইডি:' : 'Email / ID:'}</span>
                        <span className="font-mono text-slate-800">{transferNewEmail}</span>
                      </div>
                      <div className="flex justify-between items-center text-2xs">
                        <span className="text-slate-500">{isBn ? 'প্রবাসী দেশ:' : 'Country:'}</span>
                        <span className="font-bold text-slate-800">{getCountryFlag(transferNewCountry)} {transferNewCountry}</span>
                      </div>
                    </div>

                    {/* Security Checkbox */}
                    <label className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={transferSecurityAgreed}
                        onChange={(e) => setTransferSecurityAgreed(e.target.checked)}
                        className="w-4 h-4 mt-0.5 text-amber-600 rounded-md focus:ring-amber-500 cursor-pointer"
                      />
                      <span className="text-2xs text-slate-700 font-semibold leading-normal">
                        {isBn
                          ? 'আমি ফান্ডের সকল সদস্যদের সম্মতি ও সিদ্ধান্তে এই প্রশাসনিক দায়িত্ব ও নিয়ন্ত্রণ পরিবর্তন সম্পন্ন করতে সম্মত।'
                          : 'I agree to transfer administrative ownership with the consensus of fund members.'}
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      disabled={transferSubmitting}
                      onClick={() => setTransferConfirmOpen(false)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      {isBn ? 'বাতিল করুন' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      disabled={transferSubmitting || !transferSecurityAgreed}
                      onClick={handleConfirmTransferSubmit}
                      className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-black text-xs rounded-xl shadow-lg shadow-amber-600/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {transferSubmitting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>{transferSubmitting ? (isBn ? 'হস্তান্তর হচ্ছে...' : 'Transferring...') : (isBn ? 'হ্যাঁ, এডমিন পরিবর্তন করুন' : 'Confirm Handover')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ADD NEW INVESTMENT FORM */}
        {/* ========================================================================= */}
        {currentAdminTab === 'investment' && (
          <div className="max-w-3xl mx-auto">
            {invSuccessMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm font-semibold flex items-center space-x-2 animate-in fade-in">
                <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>{invSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleInvestmentSubmit} className="space-y-5">
              <div className="bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>{isBn ? 'নতুন বিনিয়োগ প্রকল্প অনুমোদন ফরম' : 'Authorize New Investment Venture'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? 'প্রকল্পের নাম / শিরোনাম *' : 'Venture Title / Name *'}
                    </label>
                    <input
                      id="input-inv-title"
                      type="text"
                      value={invTitle}
                      onChange={(e) => setInvTitle(e.target.value)}
                      required
                      placeholder={isBn ? 'যেমন: গরু ১ পিস - কুরবানী মোটাতাজাকরণ প্রকল্প' : 'e.g. Cattle Livestock Project'}
                      className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold text-slate-900"
                    />
                  </div>

                  {/* Purpose */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? 'উদ্দেশ্য ও বিস্তারিত পরিকল্পনা' : 'Purpose & Details'}
                    </label>
                    <textarea
                      rows={2}
                      value={invPurpose}
                      onChange={(e) => setInvPurpose(e.target.value)}
                      placeholder={isBn ? 'যেমন: কুরবানী হাটে বিক্রয়ের উদ্দেশ্যে...' : 'e.g. Raising cattle for annual festival market...'}
                      className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? 'বিনিয়োগের ধরন / ক্যাটাগরি *' : 'Category *'}
                    </label>
                    <select
                      id="select-inv-category"
                      value={invCategory}
                      onChange={(e) => setInvCategory(e.target.value as InvestmentCategory)}
                      className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-slate-800"
                    >
                      <option value="livestock">🐄 {isBn ? 'গরু / গবাদি পশু পালন' : 'Livestock'}</option>
                      <option value="land">🌾 {isBn ? 'জমি লিজ / কৃষি জমি' : 'Land / Lease'}</option>
                      <option value="agriculture">🐟 {isBn ? 'মৎস্য ও ফল বাগান' : 'Agriculture & Fish'}</option>
                      <option value="business">🏢 {isBn ? 'স্থানীয় ব্যবসা বা দোকান' : 'Business Venture'}</option>
                      <option value="emergency_loan">🤝 {isBn ? 'সদস্য জরুরি ঋণ (কর্জ)' : 'Emergency Loan'}</option>
                      <option value="other">📦 {isBn ? 'অন্যান্য প্রকল্প' : 'Other'}</option>
                    </select>
                  </div>

                  {/* Investment Amount */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? 'বিনিয়োগকৃত মূলধনের পরিমাণ (টাকা) *' : 'Capital Amount (BDT) *'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">৳</span>
                      <input
                        id="input-inv-amount"
                        type="number"
                        min="1000"
                        step="1000"
                        value={invAmount}
                        onChange={(e) => setInvAmount(e.target.value)}
                        required
                        placeholder="85000"
                        className="w-full pl-8 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Assigned Person Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? 'দেশে দায়িত্বপ্রাপ্ত ব্যক্তি (তত্ত্বাবধায়ক) *' : 'Responsible Person Name *'}
                    </label>
                    <input
                      id="input-inv-assigned-person"
                      type="text"
                      value={invAssignedPerson}
                      onChange={(e) => setInvAssignedPerson(e.target.value)}
                      required
                      placeholder={isBn ? 'যেমন: তরিকুল ইসলাম' : 'e.g. Tariqul Islam'}
                      className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                    />
                  </div>

                  {/* Assigned Person Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? 'দায়িত্বপ্রাপ্ত ব্যক্তির মোবাইল নম্বর' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={invAssignedPhone}
                      onChange={(e) => setInvAssignedPhone(e.target.value)}
                      placeholder="+880 17 1122 3344"
                      className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                    />
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? 'প্রকল্প শুরুর তারিখ *' : 'Start Date *'}
                    </label>
                    <input
                      type="date"
                      value={invStartDate}
                      onChange={(e) => setInvStartDate(e.target.value)}
                      required
                      className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                    />
                  </div>

                  {/* Expected Return */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? 'প্রত্যাশিত মোট প্রাপ্তি / বিক্রয়মূল্য (টাকা)' : 'Expected Return / Sale Value (BDT)'}
                    </label>
                    <input
                      type="number"
                      value={invExpectedReturn}
                      onChange={(e) => setInvExpectedReturn(e.target.value)}
                      placeholder="120000"
                      className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold text-emerald-800"
                    />
                  </div>

                  {/* Notes */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? 'চুক্তি ও অতিরিক্ত মন্তব্য' : 'Contract & Extra Notes'}
                    </label>
                    <input
                      type="text"
                      value={invNotes}
                      onChange={(e) => setInvNotes(e.target.value)}
                      placeholder={isBn ? 'যেমন: ময়মনসিংহের হাট থেকে কেনা হয়েছে...' : 'e.g. Registered agreement signed'}
                      className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Investment Button */}
              <button
                id="btn-submit-investment"
                type="submit"
                disabled={invSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {invSubmitting ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <TrendingUp className="w-5 h-5" />
                )}
                <span>
                  {invSubmitting
                    ? (isBn ? 'প্রকল্প সংরক্ষণ হচ্ছে...' : 'Saving Venture...')
                    : (isBn ? 'বিনিয়োগ অনুমোদন সম্পন্ন করুন (Confirm Investment)' : 'Authorize Investment Venture')}
                </span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: RECENT TRANSACTIONS TABLE (SEARCH / DELETE) */}
        {/* ========================================================================= */}
        {currentAdminTab === 'transactions' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={txnSearchQuery}
                  onChange={(e) => setTxnSearchQuery(e.target.value)}
                  placeholder={isBn ? 'সদস্যের নাম বা রসিদ নম্বর খুঁজুন...' : 'Search by member or receipt #...'}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <span className="text-xs text-slate-500 font-semibold">
                {isBn ? `মোট ${toBengaliNumerals(filteredTransactions.length)} টি লেনদেন` : `${filteredTransactions.length} Total Transactions`}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-2xs border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-bold">{isBn ? 'রসিদ / তারিখ' : 'Receipt & Date'}</th>
                    <th className="py-3 px-4 font-bold">{isBn ? 'সদস্যের নাম' : 'Member'}</th>
                    <th className="py-3 px-4 font-bold">{isBn ? 'মাস ও বছর' : 'Month / Year'}</th>
                    <th className="py-3 px-4 font-bold">{isBn ? 'পরিমাণ' : 'Amount'}</th>
                    <th className="py-3 px-4 font-bold">{isBn ? 'মাধ্যম' : 'Method'}</th>
                    <th className="py-3 px-4 text-right font-bold">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        {isBn ? 'কোন লেনদেন পাওয়া যায়নি' : 'No transactions recorded'}
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-mono text-2xs text-slate-500">{p.receiptNumber || p.id.slice(0, 8)}</div>
                          <div className="text-slate-700 font-medium">{formatCustomDate(p.paymentDate, isBn)}</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">{p.memberName}</td>
                        <td className="py-3 px-4 text-slate-700">
                          {MONTHS[p.month - 1]?.nameBn || p.month} {toBengaliNumerals(p.year)}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-emerald-700">{formatBDT(p.amount, isBn)}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {p.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => {
                                if (confirm(isBn ? 'আপনি কি এই সঞ্চয় রেকর্ডটি মুছে ফেলতে চান?' : 'Delete this payment record?')) {
                                  deletePayment(p.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                              title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
