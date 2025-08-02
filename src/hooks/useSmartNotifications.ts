/**
 * @file useSmartNotifications.ts
 * @description Smart notification system that prevents duplicate alerts and manages user preferences
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AlertTriangle, Bell, Clock, CheckCircle } from 'lucide-react';

interface SmartNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'reconciliation' | 'readings' | 'inventory' | 'system' | 'general';
  actionUrl?: string;
  actionLabel?: string;
  dismissible: boolean;
  expiresAt?: Date;
  showOnce?: boolean; // Only show once per session
  consolidateWith?: string[]; // IDs of similar notifications to consolidate
}

interface NotificationState {
  dismissedPermanently: Set<string>;
  dismissedForToday: Set<string>;
  lastShown: Record<string, number>;
}

const STORAGE_KEY = 'fuelsync_notification_state';

export function useSmartNotifications() {
  const { user } = useAuth();
  const [state, setState] = useState<NotificationState>({
    dismissedPermanently: new Set(),
    dismissedForToday: new Set(),
    lastShown: {}
  });

  // Load state from localStorage on mount
  useEffect(() => {
    if (!user?.id) return;

    const stored = localStorage.getItem(`${STORAGE_KEY}_${user.id}`);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const today = new Date().toDateString();

        // Clear today's dismissals if it's a new day
        const dismissedForToday = new Set<string>(
          parsed.dismissedForToday?.filter((item: any) => {
            return item.date === today;
          }).map((item: any) => item.id) || []
        );

        setState(prev => ({
          ...prev,
          dismissedPermanently: new Set<string>(parsed.dismissedPermanently || []),
          dismissedForToday,
          lastShown: parsed.lastShown || {}
        }));
      } catch (error) {
        console.error('Failed to parse notification state:', error);
      }
    }
  }, [user?.id]);

  // Save state to localStorage
  const saveState = useCallback((newState: NotificationState) => {
    if (!user?.id) return;

    const today = new Date().toDateString();
    const toStore = {
      dismissedPermanently: Array.from(newState.dismissedPermanently),
      dismissedForToday: Array.from(newState.dismissedForToday).map(id => ({
        id,
        date: today
      })),
      lastShown: newState.lastShown
    };

    localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(toStore));
  }, [user?.id]);

  // Check if notification should be shown
  const shouldShow = useCallback((notification: SmartNotification): boolean => {
    // Don't show if permanently dismissed
    if (state.dismissedPermanently.has(notification.id)) {
      return false;
    }

    // Don't show if dismissed for today
    if (state.dismissedForToday.has(notification.id)) {
      return false;
    }

    // Don't show if expired
    if (notification.expiresAt && new Date() > notification.expiresAt) {
      return false;
    }

    // Rate limiting - don't show same notification too frequently (24 hours for most, 1 hour for urgent)
    const lastShown = state.lastShown[notification.id];
    if (lastShown) {
      const timeSinceLastShown = Date.now() - lastShown;
      const minInterval = notification.priority === 'urgent' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 1h for urgent, 24h for others

      if (timeSinceLastShown < minInterval) {
        return false;
      }
    }

    return true;
  }, [state]);

  // Show notification with smart logic
  const showNotification = useCallback((notification: SmartNotification) => {
    if (!shouldShow(notification)) {
      return;
    }

    // Check for consolidation - don't show if similar notification was shown recently
    if (notification.consolidateWith) {
      const similarShown = notification.consolidateWith.some(id => {
        const lastShown = state.lastShown[id];
        if (lastShown) {
          const timeSinceLastShown = Date.now() - lastShown;
          return timeSinceLastShown < 60 * 60 * 1000; // 1 hour
        }
        return false;
      });
      if (similarShown) {
        return; // Skip if similar notification already shown recently
      }
    }

    const IconComponent = getNotificationIcon(notification.type, notification.priority);
    const duration = getNotificationDuration(notification.priority);

    toast(notification.title, {
      description: notification.message,
      duration,
      icon: React.createElement(IconComponent, { className: "h-4 w-4" }),
      action: notification.actionUrl ? {
        label: notification.actionLabel || 'View',
        onClick: () => {
          window.location.href = notification.actionUrl!;
        }
      } : undefined,
      cancel: notification.dismissible ? {
        label: 'Dismiss',
        onClick: () => dismissNotification(notification.id, 'today')
      } : undefined,
      className: getNotificationClassName(notification.type, notification.priority)
    });

    // Update state - track when notification was last shown
    const newState = {
      ...state,
      lastShown: {
        ...state.lastShown,
        [notification.id]: Date.now()
      }
    };

    setState(newState);
    saveState(newState);
  }, [state, shouldShow, saveState]);

  // Dismiss notification
  const dismissNotification = useCallback((
    notificationId: string, 
    dismissType: 'session' | 'today' | 'permanent'
  ) => {
    let newState = { ...state };

    switch (dismissType) {
      case 'permanent':
        newState.dismissedPermanently = new Set([...state.dismissedPermanently, notificationId]);
        break;
      case 'today':
        newState.dismissedForToday = new Set([...state.dismissedForToday, notificationId]);
        break;
      case 'session':
        // Just mark as shown in session, will reset on page reload
        break;
    }

    setState(newState);
    saveState(newState);
  }, [state, saveState]);

  // Batch show notifications with smart consolidation
  const showNotifications = useCallback((notifications: SmartNotification[]) => {
    // Group by category and priority
    const grouped = notifications.reduce((acc, notification) => {
      const key = `${notification.category}_${notification.priority}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(notification);
      return acc;
    }, {} as Record<string, SmartNotification[]>);

    // Show consolidated notifications
    Object.entries(grouped).forEach(([key, notificationGroup]) => {
      if (notificationGroup.length === 1) {
        showNotification(notificationGroup[0]);
      } else {
        // Create consolidated notification
        const consolidated: SmartNotification = {
          id: `consolidated_${key}_${Date.now()}`,
          type: notificationGroup[0].type,
          title: `${notificationGroup.length} ${notificationGroup[0].category} alerts`,
          message: `You have ${notificationGroup.length} pending ${notificationGroup[0].category} tasks`,
          priority: notificationGroup[0].priority,
          category: notificationGroup[0].category,
          dismissible: true,
          showOnce: true,
          actionUrl: '/dashboard',
          actionLabel: 'View All'
        };
        showNotification(consolidated);
      }
    });
  }, [showNotification]);

  // Clear all dismissals (for testing/admin)
  const clearDismissals = useCallback(() => {
    const newState = {
      dismissedPermanently: new Set<string>(),
      dismissedForToday: new Set<string>(),
      lastShown: {}
    };
    setState(newState);
    saveState(newState);
  }, [saveState]);

  return {
    showNotification,
    showNotifications,
    dismissNotification,
    clearDismissals,
    state
  };
}

// Helper functions
function getNotificationIcon(type: string, priority: string) {
  if (priority === 'urgent') return AlertTriangle;

  switch (type) {
    case 'error': return AlertTriangle;
    case 'warning': return AlertTriangle;
    case 'success': return CheckCircle;
    case 'info': return Bell;
    default: return Clock;
  }
}

function getNotificationDuration(priority: string): number {
  switch (priority) {
    case 'urgent': return 10000; // 10 seconds
    case 'high': return 8000;    // 8 seconds
    case 'medium': return 6000;  // 6 seconds
    case 'low': return 4000;     // 4 seconds
    default: return 5000;        // 5 seconds
  }
}

function getNotificationClassName(type: string, priority: string): string {
  if (priority === 'urgent') return 'border-red-200 bg-red-50';
  
  switch (type) {
    case 'error': return 'border-red-200 bg-red-50';
    case 'warning': return 'border-yellow-200 bg-yellow-50';
    case 'success': return 'border-green-200 bg-green-50';
    case 'info': return 'border-blue-200 bg-blue-50';
    default: return 'border-gray-200 bg-gray-50';
  }
}
