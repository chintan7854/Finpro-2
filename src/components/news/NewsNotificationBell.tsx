import React, { useState, useRef, useEffect } from 'react';
import { useFinanceNews } from '../../context/FinanceNewsContext';
import { useI18n } from '../../context/I18nContext';
import {
  Bell,
  CheckCheck,
  ExternalLink,
  Trash2,
  Volume2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  X,
  ChevronRight,
} from 'lucide-react';
import { NewsNotification } from '../../types/news';

interface NewsNotificationBellProps {
  onOpenNews?: (newsId?: string) => void;
}

export const NewsNotificationBell: React.FC<NewsNotificationBellProps> = ({ onOpenNews }) => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification,
    browserNotificationPermission,
    requestBrowserNotificationPermission,
  } = useFinanceNews();

  const { t, language } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleOpenNewsItem = (notif: NewsNotification) => {
    markNotificationAsRead(notif.id);
    setIsOpen(false);
    if (onOpenNews) {
      onOpenNews(notif.newsId);
    }
  };

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
      const diffHours = Math.floor(diffMs / (3600 * 1000));
      if (diffMins < 60) return `${diffMins || 1}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        title="Finance News Alerts"
        aria-label="Finance News Notifications"
      >
        <Bell className="w-5 h-5 text-slate-700" />
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white shadow-xs animate-pulse">
            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {/* Dropdown Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200/90 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800">
          {/* Panel Header */}
          <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Finance News Alerts</h4>
                <p className="text-[11px] text-slate-500">
                  {unreadNotificationCount} unread verified {unreadNotificationCount === 1 ? 'alert' : 'alerts'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {unreadNotificationCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsAsRead}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold px-2 py-1 rounded-md hover:bg-emerald-50 transition-colors flex items-center space-x-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark All Read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Browser Notification Permission Banner */}
          <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-slate-600">
              <Volume2 className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {browserNotificationPermission === 'granted'
                  ? 'Browser alerts active'
                  : browserNotificationPermission === 'denied'
                  ? 'Browser alerts blocked'
                  : 'Get desktop alerts'}
              </span>
            </div>
            {browserNotificationPermission === 'default' && (
              <button
                type="button"
                onClick={requestBrowserNotificationPermission}
                className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200/70 px-2 py-0.5 rounded-md transition-colors"
              >
                Enable
              </button>
            )}
            {browserNotificationPermission === 'granted' && (
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                Enabled
              </span>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-8 text-center px-4">
                <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">No alerts at the moment</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  You will be notified when new National or International finance news is verified.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 transition-colors flex items-start space-x-3 group ${
                    !item.isRead ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="mt-1">
                    {!item.isRead ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 block ring-2 ring-emerald-200"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300 block"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                          item.category === 'national'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {item.category === 'national' ? 'National' : 'International'}
                      </span>
                      <span className="text-[10px] text-slate-400">•</span>
                      <span className="text-[11px] text-slate-500 font-medium truncate">
                        {item.source}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-auto whitespace-nowrap">
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>

                    <p
                      onClick={() => handleOpenNewsItem(item)}
                      className={`text-xs cursor-pointer line-clamp-2 leading-relaxed ${
                        !item.isRead ? 'font-semibold text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      {item.headline}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleOpenNewsItem(item)}
                        className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center space-x-1"
                      >
                        <span>Open News</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>

                      <div className="flex items-center space-x-2">
                        {!item.isRead && (
                          <button
                            type="button"
                            onClick={() => markNotificationAsRead(item.id)}
                            className="text-slate-500 hover:text-slate-800 text-[10px]"
                            title="Mark as read"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => clearNotification(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                          title="Remove notification"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note: In-app vs Push transparent disclosure */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
            <span>In-App alerts always active</span>
            <span className="text-slate-400">Updates at 4:00 AM IST</span>
          </div>
        </div>
      )}
    </div>
  );
};
