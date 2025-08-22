
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Bell, Info, CheckCircle } from 'lucide-react';

const AlertsPage = () => {
  // Mock alerts data - this would come from an API in a real application
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Low Fuel Level',
      message: 'Station A - Tank 1 is running low on Premium fuel (15% remaining)',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      type: 'info',
      title: 'Maintenance Scheduled',
      message: 'Pump 3 at Station B is scheduled for maintenance tomorrow at 9 AM',
      timestamp: '4 hours ago',
    },
    {
      id: 3,
      type: 'success',
      title: 'Delivery Completed',
      message: 'Fuel delivery to Station C has been completed successfully',
      timestamp: '6 hours ago',
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'warning':
        return 'destructive';
      case 'success':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">System Alerts</h1>
          <p className="text-muted-foreground">
            Monitor important notifications and system status updates
          </p>
        </div>

        <div className="grid gap-4">
          {alerts.map((alert) => (
            <Alert key={alert.id} variant={getAlertVariant(alert.type)} className="bg-card border border-border">
              {getAlertIcon(alert.type)}
              <AlertTitle className="flex items-center justify-between text-card-foreground">
                {alert.title}
                <span className="text-sm font-normal text-muted-foreground">
                  {alert.timestamp}
                </span>
              </AlertTitle>
              <AlertDescription className="text-muted-foreground">{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>

        {alerts.length === 0 && (
          <Card className="bg-card border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <CheckCircle className="h-5 w-5 text-green-600" />
                No Active Alerts
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                All systems are operating normally. You'll see notifications here when attention is needed.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
