import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  Building,
  Check,
  Sparkles,
  Shield,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { useFund } from '../context/FundContext';
import { useAuth } from '../context/AuthContext';
import { COUNTRIES_LIST } from '../utils/formatters';

interface FundProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'bn' | 'en';
}

const PRESET_FUND_LOGOS = [
  'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=150&auto=format&fit=crop&q=80', // Mosque
  'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=150&auto=format&fit=crop&q=80', // Finance/Gold
  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80', // Hands
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80', // Project
];

export const FundProfileModal: React.FC<FundProfileModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const { currentFund, updateFund } = useFund();
  const { isAdmin } = useAuth();
  const isBn = language === 'bn';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [logoUrl, setLogoUrl] = useState<string>(
    currentFund.logoUrl || currentFund.avatarUrl || PRESET_FUND_LOGOS[0]
  );
  const [fundName, setFundName] = useState<string>(currentFund.name || '');
  const [fundNameBn, setFundNameBn] = useState<string>(currentFund.nameBn || currentFund.name || '');
  const [fundDesc, setFundDesc] = useState<string>(currentFund.description || '');
  const [fundCountry, setFundCountry] = useState<string>(currentFund.country || 'Saudi Arabia');
  const [monthlyAmount, setMonthlyAmount] = useState<string>(String(currentFund.defaultMonthlyAmount || 1000));
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  // Compress & convert uploaded image to base64 DataURL
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 260;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setLogoUrl(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateFund(currentFund.id, {
        name: fundName.trim() || currentFund.name,
        nameBn: fundNameBn.trim() || fundName.trim() || currentFund.name,
        description: fundDesc.trim(),
        country: fundCountry,
        defaultMonthlyAmount: Number(monthlyAmount) || 1000,
        logoUrl,
        avatarUrl: logoUrl,
      });

      setSaveSuccess(true);
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 700);
    } catch (err) {
      console.warn('Fund profile save error:', err);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <Building className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isBn ? 'ফান্ডের লোগো ও তথ্য পরিবর্তন' : 'Edit Fund Profile & Logo'}
              </h3>
              <p className="text-2xs text-slate-300">
                {isBn ? '🛡️ শুধুমাত্র এডমিন পরিবর্তন করতে পারবেন' : '🛡️ Admin control only'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Fund Logo Upload Area */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="relative group">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Fund Logo Preview"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-3 border-emerald-600 shadow-md ring-4 ring-emerald-50"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-800 border-3 border-emerald-500 flex items-center justify-center text-2xl font-bold text-white shadow-md ring-4 ring-emerald-50">
                  {fundName.charAt(0) || 'প'}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg border-2 border-white cursor-pointer transition-transform hover:scale-105"
                title={isBn ? 'লোগো আপলোড করুন' : 'Upload logo'}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-2xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Upload className="w-3 h-3" />
                <span>{isBn ? 'ডিভাইস থেকে ফান্ডের লোগো আপলোড' : 'Upload Fund Logo'}</span>
              </button>
            </div>

            {/* Quick Logo Presets */}
            <div className="mt-3.5 w-full">
              <p className="text-3xs text-slate-500 font-semibold mb-1.5 text-center">
                {isBn ? 'অথবা রেডিমেড লোগো নির্বাচন করুন:' : 'Or choose a preset logo:'}
              </p>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {PRESET_FUND_LOGOS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLogoUrl(url)}
                    className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                      logoUrl === url
                        ? 'border-emerald-600 scale-110 shadow-xs ring-2 ring-emerald-200'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Logo ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-2xs font-bold text-slate-700 mb-1">
                {isBn ? 'ফান্ডের নাম *' : 'Fund Name *'}
              </label>
              <input
                type="text"
                required
                value={fundName}
                onChange={(e) => setFundName(e.target.value)}
                placeholder="যেমন: প্রবাসী মুক্ত ফান্ড"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-700 mb-1">
                {isBn ? 'ডিফল্ট মাসিক সঞ্চয় (টাকা)' : 'Default Monthly Share (BDT)'}
              </label>
              <input
                type="number"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
                placeholder="1000"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-700 mb-1">
                {isBn ? 'ফান্ডের অবস্থান / দেশ (Country)' : 'Fund Country of Operation'}
              </label>
              <select
                value={fundCountry}
                onChange={(e) => setFundCountry(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs cursor-pointer"
              >
                {COUNTRIES_LIST.map((c) => (
                  <option key={c.code} value={c.nameEn}>
                    {c.flag} {c.nameEn} ({c.nameBn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-700 mb-1">
                {isBn ? 'ফান্ডের বিবরণ ও উদ্দেশ্য' : 'Fund Description'}
              </label>
              <textarea
                rows={2}
                value={fundDesc}
                onChange={(e) => setFundDesc(e.target.value)}
                placeholder={isBn ? 'প্রবাসী সদস্যদের যৌথ তহবিল ও হালাল বিনিয়োগ প্রকল্প...' : 'Community investment fund...'}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer transition-colors"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md flex items-center space-x-1.5 cursor-pointer transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{isBn ? 'সংরক্ষিত হয়েছে!' : 'Saved!'}</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isBn ? 'ফান্ড আপডেট করুন' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
