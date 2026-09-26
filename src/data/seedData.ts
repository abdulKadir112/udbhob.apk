import { Member, Investment, AppNotification, Fund } from '../types';

export const DEFAULT_FUND_ID = 'fund-probashi-default';
export const DEFAULT_ADMIN_ID = 'admin-probashi-main';

export const INITIAL_FUND: Fund = {
  id: DEFAULT_FUND_ID,
  name: 'Udbhob (উদ্ভব)',
  nameBn: 'উদ্ভব - বিনিয়োগে গড়ি নতুন সম্ভাবনা',
  description: 'প্রবাসীদের যৌথ সঞ্চয়, জরুরি সহযোগিতা ও দেশে লাভজনক হালাল যৌথ বিনিয়োগ তহবিল।',
  adminId: DEFAULT_ADMIN_ID,
  adminEmail: 'admin@udbhob.fund',
  adminName: 'মুহাম্মদ আব্দুল কাদির (রিয়াদ)',
  currency: 'BDT',
  defaultMonthlyAmount: 1000,
  createdAt: '2024-01-01T00:00:00Z',
  coverGradient: 'from-slate-900 via-slate-900 to-emerald-950',
  country: 'Saudi Arabia',
  logoUrl: '/udbhob_logo.svg',
  avatarUrl: '/udbhob_logo.svg',
};

// Known dummy usernames and project titles that were previously used for demonstration/mocking
export const DUMMY_USERNAMES: string[] = [
  'kadir_saudi',
  'rafiq_dubai',
  'kamal_qatar',
  'nurul_my',
  'tariqul_malaysia',
  'kamrul_qatar',
  'nurul_kuwait',
  'belal_oman',
  'jashim_bahrain',
  'mizan_singapore',
  'faruk_italy',
  'shahadat_london',
  'alauddin_usa',
  'saiful_canada',
  'zakir_saudi',
  'mostafa_dubai',
  'harun_malaysia',
  'anowar_qatar',
  'selim_kuwait',
  'delwar_oman',
  'monir_singapore',
  'ibrahim_italy',
  'demo-admin',
  'demo-member',
];

export const DUMMY_INVESTMENT_TITLES: string[] = [
  'গরু ১ পিস - কুরবানী মোটাতাজাকরণ প্রকল্প',
  'জমি লিজ (কৃষি ভূমি ১ বিঘা)',
  'বায়োফ্লক ও পুকুরে মৎস্য চাষ প্রকল্প',
  'সুপারিশকৃত জরুরি আপদকালীন ঋণ (সদস্য সহায়তা)',
  'লেয়ার মুরগির খামার প্রকল্প',
  'সরিষা ও গম চাষ প্রকল্প',
  'গ্রামীন জরুরি ফান্ড ঋণ সহায়তা',
];

// No dummy members, investments, or notifications are seeded
export const INITIAL_MEMBERS: Omit<Member, 'id'>[] = [];
export const INITIAL_INVESTMENTS: Omit<Investment, 'id'>[] = [];
export const INITIAL_NOTIFICATIONS: Omit<AppNotification, 'id'>[] = [];
