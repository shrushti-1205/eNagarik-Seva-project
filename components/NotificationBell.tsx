import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Notification } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

const NotificationItem: React.FC<{ notification: Notification; onRead: (id: string) => void }> = ({ notification, onRead }) => {
  const handleItemClick = () => {
    if (!notification.isRead) {
      onRead(notification.notificationId);
    }
  };

  // Note: Notification messages from the mock API are in English. A real-world app would handle this differently.
  return (
    <div 
        onClick={handleItemClick}
        className={`p-3 border-b border-gray-200 last:border-b-0 cursor-pointer transition-colors duration-200 ${notification.isRead ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100'}`}
    >
        <p className="text-sm text-gray-700">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
    </div>
  );
};


const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative text-gray-600 hover:text-blue-600 focus:outline-none">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-md shadow-lg z-20">
            <div className="p-3 border-b font-semibold text-gray-800">{t('notifications')}</div>
            {notifications.length > 0 ? (
                <div>
                    {notifications.map(n => <NotificationItem key={n.notificationId} notification={n} onRead={markAsRead} />)}
                </div>
            ) : (
                <p className="text-center text-gray-500 p-4">{t('noNotificationsYet')}</p>
            )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
