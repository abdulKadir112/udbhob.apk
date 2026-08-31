import React from 'react';
import {
  Bell,
  X,
  CheckCircle,
  TrendingUp,
  CreditCard,
  User,
  Volume2,
  VolumeX,
  Trash2,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useFund } from '../context/FundContext';
import { formatCustomDate } from '../utils/formatters';
import { sendTestIncomingCallAlert } from '../utils/pushNotification';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'bn' | 'en';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    soundEnabled,
    setSoundEnabled,
    requestPushPermissions,
    pushPermissionStatus,
  } = useFund();

  if (!isOpen) return null;

  const isBn = language === 'bn';

  const getIconForType = (type: string) => {
    switch (type) {
      case 'due_reminder':
        return <Bell className="w-4 h-4 text-amber-600 animate-bounce" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'investment':
        return <TrendingUp className="w-4 h-4 text-indigo-600" />;
      case 'member':
        return <User className="w-4 h-4 text-amber-600" />;
      case 'urgent_notice':
        return <Sparkles className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-3 sm:p-6 bg-slate-900/40 backdrop-blur-2xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] animate-in slide-in-from-right-4 duration-200">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {isBn ? 'রিয়েল-টাইম নোটিফিকেশন ও পুশ আপডেট' : 'Live Notifications & Push'}
              </h3>
              <p className="text-2xs text-slate-400">
                {isBn ? 'নতুন সঞ্চয় ও বিনিয়োগের তাৎক্ষণিক বিজ্ঞপ্তি' : 'Instant updates on contributions & ventures'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Push Notification & Sound Banner */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center space-x-1"
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span className="text-2xs font-semibold">{soundEnabled ? (isBn ? 'শব্দ অন' : 'Sound On') : (isBn ? 'শব্দ অফ' : 'Muted')}</span>
            </button>

            {pushPermissionStatus !== 'granted' ? (
              <button
                onClick={requestPushPermissions}
                className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold flex items-center space-x-1 shadow-xs cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-2xs">{isBn ? 'লক-স্ক্রিন ও পুশ নোটিফিকেশন চালু করুন' : 'Enable Lock-Screen & Push Alerts'}</span>
              </button>
            ) : (
              <button
                onClick={() => sendTestIncomingCallAlert(isBn)}
                className="p-1.5 rounded-lg bg-teal-700 text-white hover:bg-teal-800 font-semibold flex items-center space-x-1 shadow-xs cursor-pointer"
                title={isBn ? 'লক-স্ক্রিন ইনকামিং কল টেস্ট করুন' : 'Test Lock-Screen Call'}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-2xs">{isBn ? 'কল টেস্ট' : 'Test Call'}</span>
              </button>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={markAllNotificationsRead}
                className="text-2xs text-slate-600 hover:text-slate-900 font-semibold underline"
              >
                {isBn ? 'সব পঠিত' : 'Mark all read'}
              </button>
              <button
                onClick={clearAllNotifications}
                className="p-1 rounded text-slate-400 hover:text-rose-600"
                title={isBn ? 'সব মুছুন' : 'Clear all'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Notifications Feed */}
        <div className="p-3 overflow-y-auto flex-1 divide-y divide-slate-100 space-y-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">{isBn ? 'কোন নতুন বিজ্ঞপ্তি নেই' : 'No notifications yet'}</p>
              <p className="text-2xs text-slate-400 mt-0.5">
                {isBn ? 'নতুন সঞ্চয় বা বিনিয়োগ হলে এখানে রিয়েল-টাইমে দেখা যাবে।' : 'Updates will appear here live when payments or investments are made.'}
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-3 rounded-xl transition-colors cursor-pointer flex items-start space-x-3 ${
                  notif.read ? 'bg-white hover:bg-slate-50' : 'bg-emerald-50/70 border border-emerald-200/70 hover:bg-emerald-100/60'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                  {getIconForType(notif.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">
                      {isBn ? notif.titleBn || notif.title : notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-2xs text-slate-600 mt-0.5 leading-relaxed">
                    {isBn ? notif.messageBn || notif.message : notif.message}
                  </p>
                  <span className="text-3xs text-slate-400 block mt-1">
                    {formatCustomDate(notif.timestamp, isBn)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-2xs text-slate-500">
          <div className="flex items-center space-x-1 text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isBn ? 'ফায়ারবেস ক্লাউড কানেক্টেড' : 'Firebase Cloud Connected'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium"
          >
            {isBn ? 'বন্ধ' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
