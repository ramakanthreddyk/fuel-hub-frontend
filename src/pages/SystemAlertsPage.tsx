import React from 'react';
import { NotificationCenter, Notification } from '@/components/common/NotificationCenter';
import { alertsService } from '@/api/services/alertsService';

function useSystemNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  React.useEffect(() => {
    alertsService.getAlerts().then(alerts => {
      setNotifications(
        (Array.isArray(alerts) ? alerts : []).map(alert => {
          let type: 'info' | 'success' | 'warning' | 'error' = 'info';
          if (alert.type === 'success') type = 'success';
          else if (alert.type === 'error') type = 'error';
          else if (alert.type === 'warning') type = 'warning';
          return {
            id: alert.id,
            title: alert.title,
            message: alert.message,
            type,
            createdAt: new Date(alert.createdAt),
            read: alert.isRead,
          };
        })
      );
    });
  }, []);
  const markAsRead = (id: string) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const markAllAsRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
  const removeNotification = (id: string) => setNotifications(n => n.filter(x => x.id !== id));
  const clearAll = () => setNotifications([]);
  return { notifications, markAsRead, markAllAsRead, removeNotification, clearAll };
}

export default function SystemAlertsPage() {
  const systemNotifications = useSystemNotifications();
  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <img src="/bell-icon.svg" alt="System Alerts" className="h-6 w-6" /> System Alerts
        </h1>
        <NotificationCenter
          notifications={systemNotifications.notifications}
          onMarkAsRead={systemNotifications.markAsRead}
          onMarkAllAsRead={systemNotifications.markAllAsRead}
          onRemove={systemNotifications.removeNotification}
          onClearAll={systemNotifications.clearAll}
        />
      </div>
    </div>
  );
}
