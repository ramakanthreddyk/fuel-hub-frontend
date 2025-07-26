import { useEffect } from 'react';
import { useAlerts } from '@/hooks/api/useAlerts';
import { useToastNotifications } from '@/hooks/useToastNotifications';

export function AlertNotifications() {
  const { data: alerts = [] } = useAlerts();
  const { showError, showWarning, showInfo, showSuccess } = useToastNotifications();

  useEffect(() => {
    // Show unread alerts as toasts
    const unreadAlerts = alerts.filter(alert => !alert.isRead);
    
    unreadAlerts.forEach(alert => {
      switch (alert.type) {
        case 'error':
          showError(alert.title, alert.message);
          break;
        case 'warning':
          showWarning(alert.title, alert.message);
          break;
        case 'info':
          showInfo(alert.title, alert.message);
          break;
        case 'success':
          showSuccess(alert.title, alert.message);
          break;
      }
    });
  }, [alerts, showError, showWarning, showInfo, showSuccess]);

  return null; // This component only handles notifications
}