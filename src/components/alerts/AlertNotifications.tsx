
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAlerts } from '@/hooks/useAlerts';
import { AlertTriangle, Bell, CheckCircle, X } from 'lucide-react';

export function AlertNotifications() {
  const { data: alerts = [], isLoading, markAsRead, dismissAlert } = useAlerts();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-600" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getAlertColor = (type: string, severity: string) => {
    if (severity === 'critical') return 'border-red-500 bg-red-50';
    if (severity === 'warning') return 'border-yellow-500 bg-yellow-50';
    return 'border-blue-500 bg-blue-50';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'inventory': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'credit': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const unreadCount = alerts.filter(a => !(a.read || a.isRead)).length;

  return (
    <Card className="bg-gradient-to-br from-white to-red-50 border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-600" />
            System Alerts
          </div>
          <Badge variant="secondary">{unreadCount} unread</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
              All systems running smoothly
            </div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-lg border-2 ${getAlertColor(alert.type, alert.severity || alert.priority || 'info')} ${!(alert.read || alert.isRead) ? 'ring-2 ring-offset-1 ring-red-200' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {alert.stationName}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!(alert.read || alert.isRead) && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 w-6 p-0"
                        onClick={() => markAsRead(alert.id)}
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
