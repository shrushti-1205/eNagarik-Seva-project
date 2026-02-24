import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode, useMemo } from 'react';
import { Notification } from '../types';
import { apiService } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: (isInitialLoad?: boolean) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchNotifications = useCallback(async (isInitialLoad = false) => {
    if (!user) return;
    if (isInitialLoad) {
        setIsLoading(true);
    }
    try {
      const userNotifications = await apiService.getNotificationsByUserId(user.userId);
      setNotifications(userNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
    }
  }, [user]);

  // Effect for initial load and polling
  useEffect(() => {
    if (user) {
      fetchNotifications(true); // Initial fetch with loading indicator
      const intervalId = setInterval(() => fetchNotifications(false), 10000); // Poll every 10 seconds

      return () => clearInterval(intervalId); // Cleanup on logout/unmount
    } else {
      setNotifications([]); // Clear notifications on logout
    }
  }, [user, fetchNotifications]);


  const markAsRead = async (notificationId: string) => {
    try {
      const updatedNotification = await apiService.markNotificationAsRead(notificationId);
      if (updatedNotification) {
        setNotifications(prev => 
          prev.map(n => n.notificationId === notificationId ? { ...n, isRead: true } : n)
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };
  
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}