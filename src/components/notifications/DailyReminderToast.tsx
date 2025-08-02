/**
 * @file DailyReminderToast.tsx
 * @description Daily reminder toast notifications for important tasks
 */

import React, { useEffect } from 'react';
import { useDailyReminders } from '@/hooks/useOnboarding';
import { useAuth } from '@/contexts/AuthContext';
import { useSmartNotifications } from '@/hooks/useSmartNotifications';

interface DailyReminderToastProps {
  enabled?: boolean;
  showOnMount?: boolean;
}

export function DailyReminderToast({
  enabled = true,
  showOnMount = true
}: DailyReminderToastProps) {
  const { user, isAuthenticated } = useAuth();
  const { data: reminders, isLoading } = useDailyReminders();
  const { showNotifications } = useSmartNotifications();

  useEffect(() => {
    // Only show reminders if user is authenticated and logged in
    if (!enabled || isLoading || !reminders || !showOnMount || !isAuthenticated || !user) return;

    // Ensure reminders is an array
    const reminderArray = Array.isArray(reminders) ? reminders : [];

    if (reminderArray.length === 0) return;

    // Convert reminders to smart notifications
    const smartNotifications = reminderArray
      .filter(r => !r.completed)
      .map(reminder => ({
        id: reminder.id,
        type: reminder.priority === 'urgent' ? 'error' as const :
              reminder.priority === 'high' ? 'warning' as const : 'info' as const,
        title: reminder.title,
        message: reminder.message,
        priority: reminder.priority as 'low' | 'medium' | 'high' | 'urgent',
        category: reminder.type === 'reconciliation' ? 'reconciliation' as const :
                 reminder.type === 'reading_entry' ? 'readings' as const : 'general' as const,
        actionUrl: reminder.route,
        actionLabel: 'Go',
        dismissible: true,
        consolidateWith: reminder.type === 'reconciliation' ? ['weekly-reconciliation', 'daily-reconciliation'] : undefined
      }));

    // Show notifications using smart system
    showNotifications(smartNotifications);
  }, [reminders, isLoading, enabled, showOnMount, isAuthenticated, user, showNotifications]);

  // This component doesn't render anything visible
  return null;
}

/**
 * Hook to manually trigger reminder notifications using smart system
 */
export function useReminderToasts() {
  const { data: reminders } = useDailyReminders();
  const { showNotification, showNotifications } = useSmartNotifications();

  const showUrgentReminders = () => {
    if (!reminders) return;

    const urgentReminders = reminders.filter(r =>
      !r.completed && (r.priority === 'urgent' || r.priority === 'high')
    );

    const smartNotifications = urgentReminders.map(reminder => ({
      id: `urgent_${reminder.id}`,
      type: reminder.priority === 'urgent' ? 'error' as const : 'warning' as const,
      title: reminder.title,
      message: reminder.message,
      priority: reminder.priority as 'urgent' | 'high',
      category: 'general' as const,
      actionUrl: reminder.route,
      actionLabel: 'Go',
      dismissible: true
    }));

    showNotifications(smartNotifications);
  };

  const showDailyTasksSummary = () => {
    if (!reminders) return;

    const pendingTasks = reminders.filter(r => !r.completed);
    if (pendingTasks.length === 0) {
      showNotification({
        id: 'all_caught_up',
        type: 'success',
        title: 'All caught up!',
        message: 'You have no pending tasks for today.',
        priority: 'low',
        category: 'general',
        dismissible: true
      });
      return;
    }

    showNotification({
      id: 'daily_tasks_summary',
      type: 'info',
      title: 'Daily Tasks Summary',
      message: `${pendingTasks.length} task${pendingTasks.length > 1 ? 's' : ''} remaining for today.`,
      priority: 'medium',
      category: 'general',
      actionUrl: '/dashboard',
      actionLabel: 'View All',
      dismissible: true
    });
  };

  const showReadingReminder = () => {
    showNotification({
      id: 'reading_reminder',
      type: 'info',
      title: 'Reading Reminder',
      message: 'Don\'t forget to enter today\'s nozzle readings for accurate sales tracking.',
      priority: 'medium',
      category: 'readings',
      actionUrl: '/dashboard/readings/new',
      actionLabel: 'Enter Readings',
      dismissible: true
    });
  };

  const showReconciliationReminder = () => {
    showNotification({
      id: 'reconciliation_reminder',
      type: 'warning',
      title: 'Reconciliation Due',
      message: 'It\'s time for your weekly reconciliation. Review cash and sales data.',
      priority: 'high',
      category: 'reconciliation',
      actionUrl: '/dashboard/reconciliation',
      actionLabel: 'Start Reconciliation',
      dismissible: true
    });
  };

  return {
    showUrgentReminders,
    showDailyTasksSummary,
    showReadingReminder,
    showReconciliationReminder,
    urgentCount: reminders?.filter(r => !r.completed && r.priority === 'urgent').length || 0,
    highPriorityCount: reminders?.filter(r => !r.completed && r.priority === 'high').length || 0,
    totalPendingCount: reminders?.filter(r => !r.completed).length || 0
  };
}

export default DailyReminderToast;
