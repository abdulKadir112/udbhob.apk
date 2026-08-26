export type UserRole = 'admin' | 'member' | 'moderator';

export interface Fund {
  id: string;
  name: string;
  nameBn?: string;
  description?: string;
  logoUrl?: string;
  avatarUrl?: string;
  adminId: string;
  adminEmail?: string;
  adminName?: string;
  adminPhone?: string;
  currency: string; // 'BDT', 'SAR', 'AED', 'QAR', 'MYR', 'USD'
  defaultMonthlyAmount: number; // e.g. 1000
  createdAt: string;
  coverGradient?: string;
  country?: string;
  lastAdminTransferAt?: string;
  previousAdminName?: string;
}

export interface Member {
  id: string;
  fundId: string;
  adminId: string;
  name: string;
  nameBn?: string;
  username: string; // e.g. "kadir101"
  passwordPlain?: string; // stored for admin to easily give credentials to the member
  phone: string;
  email?: string;
  country: string;
  countryFlag?: string;
  city?: string;
  monthlyShareAmount: number; // e.g. 1000
  shares: number; // usually 1 or 2
  joinedDate: string;
  role: UserRole;
  status: 'active' | 'inactive';
  avatarUrl?: string;
  notes?: string;
}

export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer' | 'Cash' | 'Remittance' | 'Other';

export interface MonthlyPayment {
  id: string;
  fundId: string;
  adminId: string;
  memberId: string;
  memberName: string;
  year: number;
  month: number; // 1 = January, 12 = December
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  notes?: string;
  receiptNumber?: string;
  verified?: boolean;
  createdBy?: string;
  createdAt: string;
}

export type InvestmentCategory = 'livestock' | 'agriculture' | 'land' | 'business' | 'emergency_loan' | 'other';
export type InvestmentStatus = 'active' | 'completed' | 'profitable' | 'cancelled';

export interface Investment {
  id: string;
  fundId: string;
  adminId: string;
  title: string; // e.g. "গরু ১ পিস - খামার প্রকল্প"
  purpose: string; // "কুরবানী উপলক্ষে গরু পালন ও মোটাতাজাকরণ"
  category: InvestmentCategory;
  amount: number;
  assignedPerson: string; // responsible person
  assignedPersonPhone?: string;
  startDate: string;
  status: InvestmentStatus;
  expectedReturn?: number;
  returnAmount?: number;
  notes?: string;
  completionDate?: string;
  createdAt: string;
  createdBy?: string;
}

export interface AppNotification {
  id: string;
  fundId?: string;
  adminId?: string;
  title: string;
  titleBn?: string;
  message: string;
  messageBn?: string;
  type: 'payment' | 'investment' | 'member' | 'fund' | 'system';
  timestamp: string;
  read: boolean;
  metadata?: {
    memberId?: string;
    paymentId?: string;
    investmentId?: string;
    fundId?: string;
    amount?: number;
  };
}

export interface OverviewStats {
  totalCollected: number;
  totalInvested: number;
  currentBalance: number;
  totalMembers: number;
  currentYearCollected: number;
  activeInvestmentsCount: number;
  completedInvestmentsCount: number;
  totalExpectedReturns: number;
}

export interface YearStats {
  collectedInSelectedYear: number;
  expectedInSelectedYear: number;
  completionPercentage: number;
  totalPaymentsCount: number;
}

export interface UserSession {
  uid: string;
  username: string;
  email?: string;
  role: UserRole;
  memberId?: string;
  fundId: string;
  fundName: string;
  adminId: string;
  displayName: string;
  avatarUrl?: string;
}

export type ChatMessageType = 'text' | 'voice' | 'image' | 'file' | 'notice' | 'call_log' | 'payment_alert';

export interface ChatMessage {
  id: string;
  fundId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderCountry?: string;
  senderCountryFlag?: string;
  senderAvatar?: string;
  recipientId?: string; // for direct 1-to-1 message
  recipientName?: string;
  recipientRole?: UserRole;
  isDirect?: boolean;
  type: ChatMessageType;
  text?: string;
  voiceDuration?: number; // duration in seconds
  voiceDataUrl?: string; // audio data url or blob
  audioUrl?: string; // fallback alias
  imageUrl?: string;
  fileName?: string;
  fileSize?: string;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  reactions?: Record<string, string[]>; // { "👍": ["kadir", "rahim"], "❤️": ["admin"] }
  isPinned?: boolean;
  timestamp: string; // ISO string
  status?: 'sent' | 'delivered' | 'read';
}

export type CallType = 'audio' | 'video';
export type CallStatus = 'incoming' | 'calling' | 'connected' | 'ended';

export interface IncomingCallState {
  id: string;
  type: CallType;
  callerId: string;
  callerName: string;
  callerRole: UserRole;
  callerAvatar?: string;
  callerCountry?: string;
  callerCountryFlag?: string;
  targetId?: string | null;
  targetName?: string | null;
  isGroup: boolean;
  status: 'ringing' | 'connected' | 'ended' | 'rejected';
  timestamp: number;
}

export interface CallParticipant {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  country?: string;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isSpeaking?: boolean;
}

export interface ActiveCallState {
  id: string;
  type: CallType;
  status: CallStatus;
  isGroupCall: boolean;
  callerId?: string;
  callerName?: string;
  callerAvatar?: string;
  targetUser?: {
    id: string;
    name: string;
    avatar?: string;
    role: UserRole;
  };
  participants: CallParticipant[];
  startedAt?: number;
  durationSeconds: number;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeakerOn: boolean;
  cameraFacing?: 'user' | 'environment';
}

export interface UserPresence {
  id: string; // memberId or uid
  name: string;
  role: UserRole;
  isOnline: boolean;
  lastActive: string; // ISO string
  country?: string;
  countryFlag?: string;
  avatar?: string;
  customStatus?: string;
}
