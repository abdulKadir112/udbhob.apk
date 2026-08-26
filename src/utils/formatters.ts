export const MONTHS = [
  { id: 1, nameEn: 'January', nameBn: 'জানুয়ারি', shortEn: 'Jan', shortBn: 'জানু' },
  { id: 2, nameEn: 'February', nameBn: 'ফেব্রুয়ারি', shortEn: 'Feb', shortBn: 'ফেব্রু' },
  { id: 3, nameEn: 'March', nameBn: 'মার্চ', shortEn: 'Mar', shortBn: 'মার্চ' },
  { id: 4, nameEn: 'April', nameBn: 'এপ্রিল', shortEn: 'Apr', shortBn: 'এপ্রি' },
  { id: 5, nameEn: 'May', nameBn: 'মে', shortEn: 'May', shortBn: 'মে' },
  { id: 6, nameEn: 'June', nameBn: 'জুন', shortEn: 'Jun', shortBn: 'জুন' },
  { id: 7, nameEn: 'July', nameBn: 'জুলাই', shortEn: 'Jul', shortBn: 'জুলাই' },
  { id: 8, nameEn: 'August', nameBn: 'আগস্ট', shortEn: 'Aug', shortBn: 'আগ' },
  { id: 9, nameEn: 'September', nameBn: 'সেপ্টেম্বর', shortEn: 'Sep', shortBn: 'সেপ্টে' },
  { id: 10, nameEn: 'October', nameBn: 'অক্টোবর', shortEn: 'Oct', shortBn: 'অক্টো' },
  { id: 11, nameEn: 'November', nameBn: 'নভেম্বর', shortEn: 'Nov', shortBn: 'নভে' },
  { id: 12, nameEn: 'December', nameBn: 'ডিসেম্বর', shortEn: 'Dec', shortBn: 'ডিসে' },
];

export const BENGALI_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export function toBengaliNumerals(value: number | string): string {
  const str = String(value);
  return str.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[digit] || digit);
}

export function formatBDT(amount: number, useBengali = false): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount || 0);

  if (useBengali) {
    return `৳${toBengaliNumerals(formatted)}`;
  }
  return `৳${formatted}`;
}

export function formatCustomDate(dateString?: string, useBengali = false): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    
    const day = d.getDate();
    const month = MONTHS[d.getMonth()];
    const year = d.getFullYear();

    if (useBengali) {
      return `${toBengaliNumerals(day)} ${month?.nameBn || ''}, ${toBengaliNumerals(year)}`;
    }
    return `${day} ${month?.nameEn || ''} ${year}`;
  } catch {
    return dateString;
  }
}

export interface CountryOption {
  code: string;
  nameEn: string;
  nameBn: string;
  flag: string;
  currency: string;
  dialCode: string;
}

export const COUNTRIES_LIST: CountryOption[] = [
  { code: 'SA', nameEn: 'Saudi Arabia', nameBn: 'সৌদি আরব', flag: '🇸🇦', currency: 'SAR', dialCode: '+966' },
  { code: 'AE', nameEn: 'United Arab Emirates', nameBn: 'সংযুক্ত আরব আমিরাত (UAE)', flag: '🇦🇪', currency: 'AED', dialCode: '+971' },
  { code: 'QA', nameEn: 'Qatar', nameBn: 'কাতার', flag: '🇶🇦', currency: 'QAR', dialCode: '+974' },
  { code: 'OM', nameEn: 'Oman', nameBn: 'ওমান', flag: '🇴🇲', currency: 'OMR', dialCode: '+968' },
  { code: 'KW', nameEn: 'Kuwait', nameBn: 'কুয়েত', flag: '🇰🇼', currency: 'KWD', dialCode: '+965' },
  { code: 'BH', nameEn: 'Bahrain', nameBn: 'বাহরাইন', flag: '🇧🇭', currency: 'BHD', dialCode: '+973' },
  { code: 'MY', nameEn: 'Malaysia', nameBn: 'মালয়েশিয়া', flag: '🇲🇾', currency: 'MYR', dialCode: '+60' },
  { code: 'SG', nameEn: 'Singapore', nameBn: 'সিঙ্গাপুর', flag: '🇸🇬', currency: 'SGD', dialCode: '+65' },
  { code: 'IT', nameEn: 'Italy', nameBn: 'ইতালি', flag: '🇮🇹', currency: 'EUR', dialCode: '+39' },
  { code: 'GB', nameEn: 'United Kingdom', nameBn: 'যুক্তরাজ্য (UK)', flag: '🇬🇧', currency: 'GBP', dialCode: '+44' },
  { code: 'US', nameEn: 'USA', nameBn: 'যুক্তরাষ্ট্র (USA)', flag: '🇺🇸', currency: 'USD', dialCode: '+1' },
  { code: 'CA', nameEn: 'Canada', nameBn: 'কানাডা', flag: '🇨🇦', currency: 'CAD', dialCode: '+1' },
  { code: 'AU', nameEn: 'Australia', nameBn: 'অস্ট্রেলিয়া', flag: '🇦🇺', currency: 'AUD', dialCode: '+61' },
  { code: 'MV', nameEn: 'Maldives', nameBn: 'মালদ্বীপ', flag: '🇲🇻', currency: 'MVR', dialCode: '+960' },
  { code: 'KR', nameEn: 'South Korea', nameBn: 'দক্ষিণ কোরিয়া', flag: '🇰🇷', currency: 'KRW', dialCode: '+82' },
  { code: 'JP', nameEn: 'Japan', nameBn: 'জাপান', flag: '🇯🇵', currency: 'JPY', dialCode: '+81' },
  { code: 'DE', nameEn: 'Germany', nameBn: 'জার্মানি', flag: '🇩🇪', currency: 'EUR', dialCode: '+49' },
  { code: 'FR', nameEn: 'France', nameBn: 'ফ্রান্স', flag: '🇫🇷', currency: 'EUR', dialCode: '+33' },
  { code: 'BD', nameEn: 'Bangladesh', nameBn: 'বাংলাদেশ', flag: '🇧🇩', currency: 'BDT', dialCode: '+880' },
  { code: 'OTHER', nameEn: 'Other', nameBn: 'অন্যান্য দেশ', flag: '🌍', currency: 'USD', dialCode: '' },
];

export const COUNTRY_META: Record<string, { flag: string; nameBn: string }> = {
  'Saudi Arabia': { flag: '🇸🇦', nameBn: 'সৌদি আরব' },
  'United Arab Emirates': { flag: '🇦🇪', nameBn: 'সংযুক্ত আরব আমিরাত' },
  'UAE': { flag: '🇦🇪', nameBn: 'দুবাই / আমিরাত' },
  'Qatar': { flag: '🇶🇦', nameBn: 'কাতার' },
  'Oman': { flag: '🇴🇲', nameBn: 'ওমান' },
  'Kuwait': { flag: '🇰🇼', nameBn: 'কুয়েত' },
  'Bahrain': { flag: '🇧🇭', nameBn: 'বাহরাইন' },
  'Malaysia': { flag: '🇲🇾', nameBn: 'মালয়েশিয়া' },
  'Singapore': { flag: '🇸🇬', nameBn: 'সিঙ্গাপুর' },
  'Italy': { flag: '🇮🇹', nameBn: 'ইতালি' },
  'United Kingdom': { flag: '🇬🇧', nameBn: 'যুক্তরাজ্য (UK)' },
  'USA': { flag: '🇺🇸', nameBn: 'যুক্তরাষ্ট্র (USA)' },
  'Canada': { flag: '🇨🇦', nameBn: 'কানাডা' },
  'Australia': { flag: '🇦🇺', nameBn: 'অস্ট্রেলিয়া' },
  'Maldives': { flag: '🇲🇻', nameBn: 'মালদ্বীপ' },
  'South Korea': { flag: '🇰🇷', nameBn: 'দক্ষিণ কোরিয়া' },
  'Japan': { flag: '🇯🇵', nameBn: 'জাপান' },
  'Germany': { flag: '🇩🇪', nameBn: 'জার্মানি' },
  'France': { flag: '🇫🇷', nameBn: 'ফ্রান্স' },
  'Bangladesh': { flag: '🇧🇩', nameBn: 'বাংলাদেশ' },
  'Other': { flag: '🌍', nameBn: 'অন্যান্য দেশ' },
};

export function getCountryFlag(countryName?: string): string {
  if (!countryName) return '🌐';
  return COUNTRY_META[countryName]?.flag || '🌍';
}

export function getCountryBn(countryName?: string): string {
  if (!countryName) return '';
  return COUNTRY_META[countryName]?.nameBn || countryName;
}

// Pleasant chime synthesizer using Web Audio API
export function playChime(type: 'payment' | 'investment' | 'alert' = 'payment') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'payment') {
      // Upbeat 2-note chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880, now + 0.1); // A5

      osc2.frequency.setValueAtTime(1174.66, now + 0.1); // D6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.1);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } else {
      // Pleasant 3-note chord for investment
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.6);
      });
    }
  } catch (err) {
    console.debug('Audio play inhibited:', err);
  }
}
