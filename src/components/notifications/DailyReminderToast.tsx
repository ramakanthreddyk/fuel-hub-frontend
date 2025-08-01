/**
 * @file DailyReminderToast.tsx
 * @description Daily reminder toast notifications for important tasks
 */

import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Bell, Clock, AlertTriangle } from 'lucide-react';
import { useDailyReminders } from '@/hooks/useOnboarding';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface DailyReminderToastProps {
  enabled?: boolean;
  showOnMount?: boolean;
}

export function DailyReminderToast({
  enabled = true,
  showOnMount = true
}: DailyReminderToastProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: reminders, isLoading } = useDailyReminders();

  useEffect(() => {
    // Only show reminders if user is authenticated and logged in
    if (!enabled || isLoading || !reminders || !showOnMount || !isAuthenticated || !user) return;

    // Show urgent reminders immediately
    const urgentReminders = reminders.filter(r => 
      !r.completed && (r.priority === 'urgent' || r.priority === 'high')
    );

    urgentReminders.forEach((reminder, index) => {
      // Stagger the toasts slightly
      setTimeout(() => {
        const icon = reminder.priority === 'urgent' 
          ? <AlertTriangle className="h-4 w-4 text-red-500" />
          : reminder.priority === 'high'
          ? <Bell className="h-4 w-4 text-orange-500" />
          : <Clock className="h-4 w-4 text-blue-500" />;

        toast(reminder.title, {
          description: reminder.message,
          icon,
          duration: reminder.priority === 'urgent' ? 10000 : 6000,
          action: reminder.route ? {
            label: 'Go',
            onClick: () => navigate(reminder.route!)
          } : undefined,
          className: reminder.priority === 'urgent' 
            ? 'border-red-200 bg-red-50' 
            : reminder.priority === 'high'
            ? 'border-orange-200 bg-orange-50'
            : 'border-blue-200 bg-blue-50'
        });
      }, index * 1000); // 1 second delay between toasts
    });

    // Show a general reminder for daily tasks after urgent ones
    if (urgentReminders.length === 0) {
      const dailyTasks = reminders.filter(r => !r.completed);
      if (dailyTasks.length > 0) {
        setTimeout(() => {
          toast('Daily Tasks', {
            description: `You have ${dailyTasks.length} task${dailyTasks.length > 1 ? 's' : ''} for today.`,
            icon: <Bell className="h-4 w-4 text-blue-500" />,
            duration: 4000,
            action: {
              label: 'View',
              onClick: () => navigate('/dashboard')
            }
          });
        }, urgentReminders.length * 1000 + 2000);
      }
    }
  }, [reminders, isLoading, enabled, showOnMount, navigate, isAuthenticated, user]);

  // This component doesn't render anything visible
  return null;
}

/**
 * Hook to manually trigger reminder toasts
 */
export function useReminderToasts() {
  const navigate = useNavigate();
  const { data: reminders } = useDailyReminders();

  const showUrgentReminders = () => {
    if (!reminders) return;

    const urgentReminders = reminders.filter(r => 
      !r.completed && (r.priority === 'urgent' || r.priority === 'high')
    );

    urgentReminders.forEach((reminder, index) => {
      setTimeout(() => {
        const icon = reminder.priority === 'urgent' 
          ? <AlertTriangle className="h-4 w-4 text-red-500" />
          : <Bell className="h-4 w-4 text-orange-500" />;

        toast(reminder.title, {
          description: reminder.message,
          icon,
          duration: 8000,
          action: reminder.route ? {
            label: 'Go',
            onClick: () => navigate(reminder.route!)
          } : undefined
        });
      }, index * 500);
    });
  };

  const showDailyTasksSummary = () => {
    if (!reminders) return;

    const pendingTasks = reminders.filter(r => !r.completed);
    if (pendingTasks.length === 0) {
      toast.success('All caught up!', {
        description: 'You have no pending tasks for today.',
        icon: <Bell className="h-4 w-4 text-green-500" />
      });
      return;
    }

    toast('Daily Tasks Summary', {
      description: `${pendingTasks.length} task${pendingTasks.length > 1 ? 's' : ''} remaining for today.`,
      icon: <Clock className="h-4 w-4 text-blue-500" />,
      duration: 6000,
      action: {
        label: 'View All',
        onClick: () => navigate('/dashboard')
      }
    });
  };

  const showReadingReminder = () => {
    toast('Reading Reminder', {
      description: 'Don\'t forget to enter today\'s nozzle readings for accurate sales tracking.',
      icon: <Bell className="h-4 w-4 text-blue-500" />,
      duration: 6000,
      action: {
        label: 'Enter Readings',
        onClick: () => navigate('/dashboard/readings/new')
      }
    });
  };

  const showReconciliationReminder = () => {
    toast('Reconciliation Due', {
      description: 'It\'s time for your weekly reconciliation. Review cash and sales data.',
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
      duration: 8000,
      action: {
        label: 'Start Reconciliation',
        onClick: () => navigate('/dashboard/reconciliation')
      }
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
