export type UserRole = 'admin' | 'member';

export type PaymentStatus = 'paid' | 'unpaid' | 'partial' | 'pending';

export interface Fund {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  adminId: string;
  adminEmail: string;
  adminName: string;
  currency: string;
  defaultMonthlyAmount: number;
  establishedDate: string;
  coverGradient: string;
  country: string;
  logoUrl?: string;
  avatarUrl?: string;
}

export interface Member {
  id: string;
  fundId: string;
  adminId: string;
  name: string;
  nameBn: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl: string;
  joinedDate: string;
  monthlyShareAmount: number;
  country: string;
  city: string;
  status: 'active' | 'inactive';
  username?: string;
  passwordPlain?: string;
  nationalId?: string;
  lastActive?: string;
  isOnline?: boolean;
}

export interface MonthlyPayment {
  id: string;
  fundId: string;
  adminId: string;
  memberId: string;
  year: number;
  month: number; // 1 - 12
  amount: number;
  status: PaymentStatus;
  paidDate?: string;
  paymentMethod?: string;
  receiptUrl?: string;
  notes?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Investment {
  id: string;
  fundId: string;
  adminId: string;
  title: string;
  titleBn: string;
  description: string;
  category: 'business' | 'real_estate' | 'agriculture' | 'emergency_loan' | 'other';
  investedAmount: number;
  currentValue: number;
  expectedReturnPercentage: number;
  returnType: 'monthly' | 'quarterly' | 'yearly' | 'one_time';
  status: 'active' | 'completed' | 'loss' | 'pending';
  startDate: string;
  endDate?: string;
  location?: string;
  partnerName?: string;
  contractUrl?: string;
  notes?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface AppNotification {
  id: string;
  fundId: string;
  adminId: string;
  title: string;
  titleBn: string;
  message: string;
  messageBn: string;
  type: 'payment' | 'investment' | 'member' | 'system' | 'meeting';
  timestamp: string;
  read: boolean;
  linkUrl?: string;
  metadata?: any;
}

export interface ChatMessage {
  id: string;
  fundId: string;
  senderId: string;
  senderName: string;
  senderNameBn?: string;
  senderRole?: UserRole;
  senderAvatar?: string;
  text: string;
  mediaType?: 'text' | 'image' | 'voice' | 'file';
  mediaUrl?: string;
  voiceDuration?: number;
  timestamp: string;
  readBy?: string[];
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
}

export interface UserSession {
  uid: string;
  email: string;
  role: UserRole;
  memberId?: string;
  fundId?: string;
  adminId?: string;
  isAnonymous?: boolean;
}
