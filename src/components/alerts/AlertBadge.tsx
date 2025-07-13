
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAlerts } from '@/hooks/useAlerts';
import { Bell, X, CheckCircle } from 'lucide-react';
import { Alert } from '@/api/api-contract';
import { format } from 'date-fns';

export function AlertBadge() {
  const [open, setOpen] = useState(false);
  const { data: alerts = [], markAsRead, dismissAlert } = useAlerts();
  
  const unreadAlerts = alerts.filter(alert => !alert.read && (alert.isActive ?? true));
  const criticalAlerts = unreadAlerts.filter(alert => alert.severity === 'critical' || alert.priority === 'critical');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const handleMarkAsRead = (alertId: string) => {
    markAsRead(alertId);
  };

  const handleDismiss = (alertId: string) => {
    dismissAlert(alertId);
  };

  if (unreadAlerts.length === 0) {
    return (
      <Button variant="ghost" size="sm" className="relative">
        <Bell className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <Badge 
            variant={criticalAlerts.length > 0 ? "destructive" : "default"}
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadAlerts.length}
          </Badge>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alerts & Notifications
            <Badge variant="secondary">{unreadAlerts.length}</Badge>
          </DialogTitle>
          <DialogDescription>Recent alerts for this tenant</DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-96">
          <div className="space-y-3">
            {unreadAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity || alert.priority)}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <p className="text-xs mt-1 opacity-90">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs opacity-75">
                      <span>{alert.stationName}</span>
                      <span>•</span>
                      <span>{format(new Date(alert.createdAt), 'MMM dd, HH:mm')}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="h-6 w-6 p-0"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(alert.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {unreadAlerts.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <p>No new alerts</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
