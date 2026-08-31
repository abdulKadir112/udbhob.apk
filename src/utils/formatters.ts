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

/**
 * Formats a payment time string (HH:mm) or createdAt ISO string into a readable 12-hour AM/PM format
 */
export function formatPaymentTime(timeStr?: string, createdAt?: string, useBengali = false): string {
  let rawTime = timeStr?.trim();
  
  if (!rawTime && createdAt) {
    try {
      const d = new Date(createdAt);
      if (!isNaN(d.getTime())) {
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        rawTime = `${hh}:${mm}`;
      }
    } catch {}
  }

  if (!rawTime) {
    return useBengali ? '—' : '—';
  }

  const parts = rawTime.split(':');
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1] ? parts[1].slice(0, 2).padStart(2, '0') : '00';
  
  if (isNaN(hours)) {
    return rawTime;
  }

  const isPM = hours >= 12;
  const ampm = isPM ? 'PM' : 'AM';
  const ampmBn = isPM ? 'পিএম' : 'এএম';
  const displayHours = hours % 12 || 12;
  const formattedHours = String(displayHours).padStart(2, '0');

  if (useBengali) {
    return `${toBengaliNumerals(formattedHours)}:${toBengaliNumerals(minutes)} ${ampmBn}`;
  }
  return `${formattedHours}:${minutes} ${ampm}`;
}

/**
 * Returns a precise Unix millisecond timestamp for sorting payments from newest to oldest
 */
export function getPaymentSortTimestamp(p: { paymentDate?: string; paymentTime?: string; createdAt?: string }): number {
  if (!p) return 0;

  // 1. If createdAt exists and valid, it represents the exact creation epoch
  if (p.createdAt) {
    const epoch = new Date(p.createdAt).getTime();
    if (!isNaN(epoch) && epoch > 0) {
      // If paymentDate is also provided and differs in date, combine them
      if (p.paymentDate && p.paymentTime) {
        const fullTimeStr = p.paymentTime.length === 5 ? `${p.paymentTime}:00` : p.paymentTime;
        const combined = new Date(`${p.paymentDate}T${fullTimeStr}`).getTime();
        if (!isNaN(combined) && combined > 0) {
          return combined;
        }
      }
      return epoch;
    }
  }

  // 2. Combine paymentDate and paymentTime
  if (p.paymentDate) {
    const timePart = p.paymentTime ? (p.paymentTime.length === 5 ? `${p.paymentTime}:00` : p.paymentTime) : '12:00:00';
    const combined = new Date(`${p.paymentDate}T${timePart}`).getTime();
    if (!isNaN(combined) && combined > 0) {
      return combined;
    }

    const dateOnly = new Date(p.paymentDate).getTime();
    if (!isNaN(dateOnly) && dateOnly > 0) {
      return dateOnly;
    }
  }

  return 0;
}

/**
 * Sorts any list of payments chronologically: Newest to Oldest (top to bottom)
 */
export function sortPaymentsChronologically<T extends { paymentDate?: string; paymentTime?: string; createdAt?: string; id?: string }>(
  payments: T[]
): T[] {
  return [...payments].sort((a, b) => {
    const timeA = getPaymentSortTimestamp(a);
    const timeB = getPaymentSortTimestamp(b);
    if (timeB !== timeA) return timeB - timeA;
    return (b.id || '').localeCompare(a.id || '');
  });
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

/**
 * Strips title / honorific prefixes from Bengali and English names for accurate alphabetical sorting.
 * e.g., "মোঃ আব্দুল কাদের" -> "আব্দুল কাদের", "Md. Zahid" -> "Zahid", "শ্রী সুজন কুমার" -> "সুজন কুমার"
 */
export function getCleanBaseName(rawName?: string): string {
  if (!rawName) return '';
  let n = rawName.trim();

  // 1. Bengali title/honorific prefixes
  const bnPrefixPattern = /^(মোঃ|মো:|মো\.|মোহাম্মদ|মুহাম্মদ|মুহাঃ|মুহম্মদ|মুঃ|মোসাঃ|মোসাম্মৎ|মোসাম্মত|মোসলেহ|শ্রী|শ্রীমতি|শ্রীমতী|বাবু|ডাঃ|ডাক্তার|ইঞ্জিঃ|প্রকৌশলী|মৌলভী|মাওলানা|হাজী|আলহাজ্ব|আলহাজ|অধ্যক্ষ|ড\.|অধ্যাপক|শেখ|সৈয়দ|কাজী)\s*[:.\-_]?\s*/iu;
  
  // 2. English title/honorific prefixes
  const enPrefixPattern = /^(md|md\.|mohammad|mohammed|muhammad|mst|mst\.|mr|mr\.|mrs|mrs\.|miss|ms|ms\.|dr|dr\.|engr|engr\.|prof|prof\.|shri|sri|babu|adv|adv\.|haji|alhaj|al-haj|sheikh|syed|kazi)\s*[:.\-_]?\s*/iu;

  // Clean iteratively in case of compound prefixes like "হাজী মোঃ ..."
  let prev = '';
  while (prev !== n) {
    prev = n;
    n = n.replace(bnPrefixPattern, '').replace(enPrefixPattern, '').trim();
  }

  return n || rawName.trim();
}

/**
 * Compare two member names alphabetically based on their clean base name (ignoring মোঃ / Md / Sri).
 */
export function compareMemberBaseNames(aName?: string, bName?: string, isBn: boolean = true): number {
  const cleanA = getCleanBaseName(aName);
  const cleanB = getCleanBaseName(bName);
  return cleanA.localeCompare(cleanB, isBn ? 'bn' : 'en', { sensitivity: 'base', numeric: true });
}

/**
 * Sorts an array of members alphabetically by their core name (ignoring prefixes).
 */
export function sortMembersByBaseName<T extends { name: string; nameBn?: string }>(
  members: T[],
  isBn: boolean = true
): T[] {
  return [...members].sort((a, b) => {
    const nameA = isBn ? (a.nameBn || a.name) : a.name;
    const nameB = isBn ? (b.nameBn || b.name) : b.name;
    return compareMemberBaseNames(nameA, nameB, isBn);
  });
}

/**
 * Groups and sorts members by country first, and within each country alphabetically by core name.
 */
export function sortMembersByCountryAndName<T extends { name: string; nameBn?: string; country?: string }>(
  members: T[],
  isBn: boolean = true
): T[] {
  return [...members].sort((a, b) => {
    const countryA = (a.country || 'Other').trim();
    const countryB = (b.country || 'Other').trim();

    const countryComp = countryA.localeCompare(countryB, isBn ? 'bn' : 'en', { sensitivity: 'base' });
    if (countryComp !== 0) return countryComp;

    const nameA = isBn ? (a.nameBn || a.name) : a.name;
    const nameB = isBn ? (b.nameBn || b.name) : b.name;
    return compareMemberBaseNames(nameA, nameB, isBn);
  });
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
